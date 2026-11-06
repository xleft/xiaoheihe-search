const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const path = require('node:path');
const script = path.join(__dirname,'..','scripts','heybox-game.cua.js');
function setup(){ assert.ok(existsSync(script),'game helper is missing'); const ctx=vm.createContext({URL, URLSearchParams}); vm.runInContext(readFileSync(script,'utf8'),ctx); return ctx; }

test('accepts the official game page but rejects community, store, and lookalike URLs',()=>{
  const x=setup();
  assert.equal(x.heyboxGameUrl('https://xiaoheihe.cn/app/topic/game/pc/524220/?from=share'),'https://www.xiaoheihe.cn/app/topic/game/pc/524220');
  for(const bad of ['https://www.xiaoheihe.cn/app/topic/link/14215','https://fake.xiaoheihe.cn/app/topic/game/pc/524220','https://www.xiaoheihe.cn:444/app/topic/game/pc/524220']) assert.throws(()=>x.heyboxGameUrl(bad),/BAD_INPUT/);
});

test('distinguishes base game from similarly named results without silently choosing the first match',()=>{
  const x=setup();
  const rows=[{name:'尼尔：人工生命',url:'https://www.xiaoheihe.cn/app/topic/game/pc/1113560'},{name:'尼尔：机械纪元',url:'https://www.xiaoheihe.cn/app/topic/game/pc/524220'}];
  assert.equal(x.heyboxPickGame(rows,'尼尔机械纪元').name,'尼尔：机械纪元');
  assert.equal(x.heyboxPickGame(rows,'尼尔'),null);
  assert.equal(x.heyboxPickGame([...rows,{name:'尼尔：机械纪元',url:'https://www.xiaoheihe.cn/app/topic/game/mobile/524220'}],'尼尔机械纪元'),null);
});

test('signed-out Chrome stops before accessing game data',async()=>{
  const x=setup();
  const t={url:async()=>x.heyboxGameUrl('https://www.xiaoheihe.cn/app/topic/game/pc/524220'),playwright:{evaluate:async()=>({signed:false,login:true}),getByRole:()=>({first:()=>({waitFor:async()=>{throw Error('timeout');}})})}};
  const r=await x.heyboxGame(t,{url:await t.url()});
  assert.equal(r.error.code,'NEED_LOGIN');
  assert.equal(r.ok,false);
});
