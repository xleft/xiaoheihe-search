// Load once as JavaScript in the CUA REPL; pass a temporary tab from the user's Chrome.
function heyboxSearchUrl(query) {
  const q = typeof query === 'string' ? query.trim() : '';
  if (!q || q.length > 160) throw Error('BAD_INPUT: expected a keyword of 1–160 characters');
  return 'https://www.xiaoheihe.cn/app/search/list?' + new URLSearchParams({q, search_type:'link'});
}

function heyboxPostUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { throw Error('BAD_INPUT: expected an official Heybox post URL'); }
  const match = u.pathname.match(/^\/app\/bbs\/link\/([a-z0-9_-]{1,128})\/?$/i);
  if (u.protocol !== 'https:' || !['www.xiaoheihe.cn','xiaoheihe.cn'].includes(u.hostname) ||
      u.port || u.username || u.password || !match) throw Error('BAD_INPUT: expected an official Heybox post URL');
  return 'https://www.xiaoheihe.cn/app/bbs/link/' + match[1];
}

function heyboxUniquePosts(rows) {
  const out = new Map();
  for (const row of rows) {
    let url;
    try { url = heyboxPostUrl(row.url); } catch { continue; }
    if (!out.has(url) && (row.title || row.summary)) out.set(url,{...row,url});
  }
  return [...out.values()];
}

async function heyboxRun(tab, {query, url, comments = false, limit = 10} = {}) {
  const started = Date.now();
  const fail = (code,message) => ({ok:false, items:[], error:{code,message}, elapsed_ms:Date.now()-started});
  const search = url === undefined;
  let target;
  try {
    if (search && (!Number.isInteger(limit) || limit < 1 || limit > 30)) throw Error('BAD_INPUT: limit must be 1–30');
    target = search ? heyboxSearchUrl(query) : heyboxPostUrl(url);
  } catch (e) { return fail('BAD_INPUT',e.message.replace(/^BAD_INPUT: /,'')); }

  try {
    const here = await tab.url();
    if (here !== target) await tab.goto(target);
    const pageStatus = () => tab.playwright.evaluate(() => {
      const nav = document.querySelector('nav,[role="navigation"]');
      const login = Array.from(nav?.querySelectorAll('button') ?? []).some(e=>e.innerText.trim()==='登录');
      const challenge = Array.from(document.querySelectorAll('[role="dialog"],.el-dialog')).some(
        e => e.getClientRects().length && /安全验证|请完成验证|滑块验证|访问过于频繁/.test(e.innerText));
      return {signedIn: !!nav?.querySelector('button.publish-btn'), login, challenge};
    });
    let session = await pageStatus();
    if (!session.signedIn && !session.challenge) {
      await tab.playwright.getByRole('button',{name:'发布内容',exact:true}).first()
        .waitFor({state:'visible',timeoutMs:7000}).catch(()=>{});
      session = await pageStatus();
    }
    if (session.challenge) return fail('PLATFORM_BLOCKED','小黑盒要求验证，请在 Chrome 里本人处理。');
    if (!session.signedIn) return fail(session.login?'NEED_LOGIN':'SESSION_UNVERIFIED',
      session.login?'请在你选定的 Chrome 里登录小黑盒。':'未确认小黑盒登录状态，已停止。');
    const ok = (scope,items,more={}) => ({ok:true,source:'signed-in Chrome / Heybox',scope,items,
      completeness_verified:false,elapsed_ms:Date.now()-started,...more});

    if (search) {
      const current = new URL(await tab.url());
      if (!['xiaoheihe.cn','www.xiaoheihe.cn'].includes(current.hostname) ||
          current.pathname !== '/app/search/list' || current.searchParams.get('search_type') !== 'link' ||
          current.searchParams.get('q') !== query.trim()) return fail('WRONG_PAGE','未进入对应的站内「内容」结果页。');
      const cards = tab.playwright.locator('main a.hb-cpt__bbs-list-content[href*="/app/bbs/link/"]');
      await cards.first().waitFor({state:'attached',timeoutMs:6500}).catch(()=>{});
      const extract = () => cards.evaluateAll(es => es.map(e => {
        const value = s => e.querySelector(s)?.innerText?.trim() || null;
        const date = [...e.querySelectorAll('.bbs-new-style-bottom__rich-node')].map(n=>n.innerText.trim())
          .findLast(v=>/^(?:\d{1,4}[-/]\d{1,2}|今天|昨天|\d+\s*(?:秒|分钟|小时|天|个月|年)前|刚刚)/.test(v));
        return {url:e.href, title:value('.bbs-content__title'),
          author:value('.list-content__username'), displayed_time:date || null,
          summary:value('.bbs-content__content')?.slice(0,360) || null};
      }));
      let rows = heyboxUniquePosts(await extract());
      if (!rows.length) {
        const s=await pageStatus();
        if (s.challenge) return fail('PLATFORM_BLOCKED','小黑盒要求验证，请在 Chrome 里本人处理。');
        if (s.login && !s.signedIn) return fail('NEED_LOGIN','小黑盒已退出登录。');
        return fail('NO_VERIFIED_RESULTS','没读到可验证的帖子；可能是无匹配、页面加载失败或版式变化。');
      }
      const first_batch = rows.length;
      for (let batch=0; rows.length<limit && batch<2; batch++) {
        const anchors = await cards.count();
        const ax = await tab.getAXState({emit:false,disableDiffing:true});
        const id = new URL(rows.at(-1).url).pathname;
        const last = ax.split('\n').find(l=>l.includes(id) && /^\s*\d+\s+link\b/.test(l));
        if (!last) break;
        await tab.scroll(Number(last.trim().match(/^\d+/)[0]),'down',3);
        await cards.nth(anchors).waitFor({state:'attached',timeoutMs:3200}).catch(()=>{});
        const s=await pageStatus();
        if (s.challenge) return fail('PLATFORM_BLOCKED','继续加载时小黑盒要求验证，已停止。');
        if (s.login && !s.signedIn) return fail('NEED_LOGIN','继续加载时小黑盒已退出登录。');
        const more=heyboxUniquePosts([...rows,...await extract()]);
        if (more.length===rows.length) break;
        rows=more;
      }
      return ok('search_cards',rows.slice(0,limit),{query:query.trim(),requested:limit,
        first_batch,observed:rows.length,returned:Math.min(rows.length,limit),partial:rows.length<limit});
    }

    if (heyboxPostUrl(await tab.url()) !== target) return fail('WRONG_PAGE','未进入目标帖子。');
    const body = tab.playwright.locator('main .hb-bbs-link__content');
    await body.first().waitFor({state:'visible',timeoutMs:6500}).catch(()=>{});
    const data = await tab.playwright.evaluate(wantComments=>{
      const root = document.querySelector('main .hb-bbs-link__content');
      if (!root) return null;
      const val = (e,s) => e.querySelector(s)?.innerText?.trim() || null;
      const text = val(root,'.image-text__content, .article__content');
      const title = val(root,'.link-section-title, .section-title__content');
      const author = val(root,'.link-user__username');
      const rows = wantComments ? [...root.querySelectorAll('.link-comment__comment-item')] : [];
      return {title,author, text:text?.slice(0,12000) || null, text_truncated:(text?.length || 0)>12000,
        ...(wantComments ? {root_comments_loaded:rows.length,
          comments:rows.slice(0,20).map(e=>({author:val(e,'.info-box__username'),
            displayed_time:val(e,'.info-box__create-time'),text:val(e,'.comment-item__content')?.slice(0,800)||null,
            visible_replies:[...e.querySelectorAll('.comment-children-item')].slice(0,8)
              .map(r=>({author:val(r,'.children-item__comment-creator'),text:val(r,'.children-item__comment-content')?.slice(0,500)||null}))})),
          folded_groups:[...root.querySelectorAll('button')].filter(e=>/全部\s*\d+\s*条回复/.test(e.innerText)).length} : {})};
    }, comments);
    if (!data?.title && !data?.text) return fail('NO_VERIFIED_BODY','未读取到可验证的帖子标题或正文。');
    return ok(comments?'post_and_loaded_comments':'post_text',[{url:target,...data}],
      {partial:!!(comments || data.text_truncated || !data.text)});
  } catch (e) {
    const m=String(e?.message || e);
    return fail(/timeout|deadline/i.test(m)?'TIMEOUT':'BROWSER_ERROR','Chrome 页面读取未完成；检查连接或页面状态。');
  }
}
