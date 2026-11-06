// Load in CUA with a temporary tab from the user's signed-in Chrome.
function heyboxGameUrl(value) {
  let u;
  try { u=new URL(value); } catch { throw Error('BAD_INPUT'); }
  const match=u.pathname.match(/^\/app\/topic\/game\/(pc|mobile)\/(\d{1,20})\/?$/);
  if (!match || u.protocol!=='https:' || !['www.xiaoheihe.cn','xiaoheihe.cn'].includes(u.hostname) ||
      u.port || u.username || u.password) throw Error('BAD_INPUT');
  return 'https://www.xiaoheihe.cn/app/topic/game/'+match[1]+'/'+match[2];
}

function heyboxPickGame(rows,query) {
  const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]/gu,'');
  const q=norm(query);
  if (!q) return null;
  const choices=new Map();
  for(const row of rows) {
    try { if(norm(row.name)===q) choices.set(heyboxGameUrl(row.url),row); } catch {}
  }
  return choices.size===1 ? [...choices.values()][0] : null;
}

async function heyboxGame(tab,{query,url,reviews=0,community=0}={}) {
  const started=Date.now();
  const fail=(code,message,extra={})=>({ok:false,error:{code,message},elapsed_ms:Date.now()-started,...extra});
  const finish=(data)=>({ok:true,source:'signed-in Chrome / Heybox',observed_at:new Date().toISOString(),elapsed_ms:Date.now()-started,...data});
  if (![reviews,community].every(n=>Number.isInteger(n)&&n>=0&&n<=15)) return fail('BAD_INPUT','评测和社区帖子各支持取 0–15 条。');
  const q=typeof query==='string'?query.trim():'';
  const search=url===undefined;
  if (search&&(!q||q.length>160)) return fail('BAD_INPUT','请输入游戏名或小黑盒游戏详情链接。');
  let target;
  try { target=search?'https://www.xiaoheihe.cn/app/search/list?'+new URLSearchParams({q}):heyboxGameUrl(url); }
  catch { return fail('BAD_INPUT','需要官网游戏详情页链接。'); }

  const status=()=>tab.playwright.evaluate(()=>{
    const nav=document.querySelector('nav,[role="navigation"]');
    return {signed:!!nav?.querySelector('button.publish-btn'),
      login:[...(nav?.querySelectorAll('button')??[])].some(e=>e.innerText.trim()==='登录'),
      blocked:[...document.querySelectorAll('[role="dialog"],.el-dialog')].some(e=>e.getClientRects().length&&/安全验证|滑块验证|访问过于频繁/.test(e.innerText))};
  });
  const open=async (u)=>{
    if(await tab.url()!==u) await tab.goto(u);
    let r=await status();
    if(!r.signed&&!r.blocked){
      await tab.playwright.getByRole('button',{name:'发布内容',exact:true}).first().waitFor({state:'visible',timeoutMs:7000}).catch(()=>{});
      r=await status();
    }
    return r.blocked?'PLATFORM_BLOCKED':!r.signed?(r.login?'NEED_LOGIN':'SESSION_UNVERIFIED'):null;
  };

  try {
    let state=await open(target);
    if(state) return fail(state,'无法确认小黑盒已登录或页面需要你本人验证。');
    if(search) {
      const result=tab.playwright.locator('main a[href*="/app/topic/game/"]');
      await result.first().waitFor({state:'attached',timeoutMs:6000}).catch(()=>{});
      const rows=await result.evaluateAll(es=>es.slice(0,15).map(a=>({url:a.href,name:a.querySelector('p')?.innerText.trim()||a.innerText.trim().split('\n')[0]})));
      const candidates=[...new Map(rows.flatMap(x=>{try {const u=heyboxGameUrl(x.url);return [[u,{name:x.name,url:u}]];}catch{return [];}})).values()];
      const chosen=heyboxPickGame(candidates,q);
      if(!chosen) return fail(candidates.length?'GAME_SELECTION_REQUIRED':'NO_VERIFIED_GAMES','请确认游戏及平台；没有唯一同名结果时不自动选择。',{candidates});
      target=chosen.url;
      state=await open(target);
      if(state) return fail(state,'打开游戏页后未确认登录。');
    }
    if(heyboxGameUrl(await tab.url())!==target) return fail('WRONG_PAGE','未进入目标游戏详情。');
    await tab.playwright.locator('main .game-name .name').first().waitFor({state:'visible',timeoutMs:6500});
    const game=await tab.playwright.evaluate(n=>{
      const root=document.querySelector('main main')||document.querySelector('main');
      const txt=(e,s)=>e.querySelector(s)?.innerText?.trim()||null;
      const about=[...root.querySelectorAll('.menu-item p')].map(e=>e.innerText.trim()).filter(t=>/^(发布时间|开发商|发行商|系列|DLCs)[:：]/.test(t));
      const metrics=[...root.querySelectorAll('.data-list .data-item')].slice(0,8).map(e=>({label:txt(e,'.p2'),value:txt(e,'.editor'),rank:txt(e,'.p3')})).filter(x=>x.label&&x.value);
      const description=[...root.querySelectorAll('a[href$="/intro"]')].map(e=>e.innerText.trim()).find(t=>t.length>40)||null;
      const rs=n?[...root.querySelectorAll('.game-detail-comment-item')]:[];
      return {name:txt(root,'.game-name .name'),english_name:txt(root,'.game-name .name-en'),
        heybox_score:txt(root,'.score-wrapper .score .num'),rating_count_display:txt(root,'.score-wrapper .comment'),
        price_display:txt(root,'.game-detail-section-medias .price-row')?.replace(/\s+/g,' ')||null,
        description_excerpt:description?.slice(0,320)||null,about,metrics,
        ...(n?{reviews:{sort:txt(root,'.slide-tab__tab-item.active'),loaded:rs.length,items:rs.slice(0,n).map(e=>({
          author:txt(e,'.nickname'),playtime:txt(e,'.time'),date:txt(e,'.comment-time'),
          text:txt(e,'.description')?.slice(0,500)||null,discussion_count:txt(e,'.tools .comment .num')})),complete:false}}:{})};
    },reviews);
    if(!game.name) return fail('NO_VERIFIED_GAME','未读到游戏名称。');

    let discussion;
    if(community){
      try {
        const pane=tab.playwright.locator('main main');
        await pane.getByRole('button',{name:'社区',exact:true}).click({timeoutMs:5000});
        const cards=tab.playwright.locator('main a[href*="/app/bbs/link/"]');
        await cards.first().waitFor({state:'attached',timeoutMs:6000});
        const u=new URL(await tab.url());
        if(u.protocol!=='https:'||!['xiaoheihe.cn','www.xiaoheihe.cn'].includes(u.hostname)||!/^\/app\/topic\/link\/\d+\/?$/.test(u.pathname)) throw Error('unexpected community route');
        const r=await status();
        if(!r.signed||r.blocked) return finish({game_url:target,game,discussion:{items:[],complete:false,error:r.blocked?'PLATFORM_BLOCKED':'NEED_LOGIN'}});
        const raw=await cards.evaluateAll(es=>es.slice(0,30).map(e=>({url:e.href,title:e.querySelector('.bbs-content__title')?.innerText?.trim()||null,
          author:e.querySelector('.list-content__username')?.innerText?.trim()||null,
          summary:e.querySelector('.bbs-content__content')?.innerText?.trim().slice(0,240)||null,
          card_text:e.innerText.trim().replace(/\s+/g,' ').slice(0,210)})));
        const posts=new Map();
        for(const p of raw){
          const v=new URL(p.url);
          if(v.protocol!=='https:'||!['xiaoheihe.cn','www.xiaoheihe.cn'].includes(v.hostname)||!/^\/app\/bbs\/link\/[\w-]+\/?$/.test(v.pathname)) continue;
          const key='https://www.xiaoheihe.cn'+v.pathname.replace(/\/$/,'');
          if(!posts.has(key)) posts.set(key,{...p,url:key});
        }
        discussion={url:u.origin+u.pathname,loaded:posts.size,items:[...posts.values()].slice(0,community),complete:false};
      } catch { discussion={items:[],complete:false,error:'NO_VERIFIED_COMMUNITY'}; }
    }
    return finish({game_url:target,game,...(community?{discussion}:{})});
  } catch { return fail('NO_VERIFIED_GAME','Chrome 没有返回可验证的游戏详情。'); }
}
