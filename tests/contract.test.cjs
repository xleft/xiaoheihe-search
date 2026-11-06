const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const file = join(__dirname, '..', 'scripts', 'heybox.cua.js');
function load() {
  assert.ok(existsSync(file), 'the batch helper has not been implemented');
  const ctx = vm.createContext({ URL, URLSearchParams });
  vm.runInContext(readFileSync(file, 'utf8'), ctx);
  return ctx;
}

test('normalizes official post URLs without leaking query metadata, and rejects lookalikes', () => {
  const h = load();
  assert.equal(h.heyboxPostUrl('https://xiaoheihe.cn/app/bbs/link/a123bb/?tracking=abc#test'), 'https://www.xiaoheihe.cn/app/bbs/link/a123bb');
  for (const url of ['https://www.xiaoheihe.cn.evil.test/app/bbs/link/123', 'https://a@www.xiaoheihe.cn/app/bbs/link/123', 'https://www.xiaoheihe.cn/app/user/profile/123']) {
    assert.throws(() => h.heyboxPostUrl(url), /BAD_INPUT/);
  }
});

test('encodes the keyword and forces the native content filter', () => {
  const h = load();
  const url = new URL(h.heyboxSearchUrl(' 影之刃零 & DLC '));
  assert.equal(url.searchParams.get('q'), '影之刃零 & DLC');
  assert.equal(url.searchParams.get('search_type'), 'link');
  assert.equal(url.pathname, '/app/search/list');
});

test('deduplicates by the canonical post URL and keeps the native order', () => {
  const h = load();
  const rows = h.heyboxUniquePosts([
    {url:'https://xiaoheihe.cn/app/bbs/link/1?from=share',title:'第一篇'},
    {url:'https://www.xiaoheihe.cn/app/topic/game/pc/2',title:'不是帖子'},
    {url:'https://www.xiaoheihe.cn/app/bbs/link/1',title:'重复'},
    {url:'https://www.xiaoheihe.cn/app/bbs/link/2',title:'第二篇'},
  ]);
  assert.deepEqual(Array.from(rows, r => r.title), ['第一篇','第二篇']);
  assert.equal(rows[0].url, 'https://www.xiaoheihe.cn/app/bbs/link/1');
});

test('a logged-out session stops before reading any post cards', async () => {
  const h = load();
  const tab = {
    url: async () => h.heyboxSearchUrl('影之刃零'),
    playwright: {
      evaluate: async () => ({ signedIn: false, login: true }),
      getByRole: () => ({first:()=>({waitFor:async()=>{throw Error('timeout');}})}),
    },
  };
  const result = await h.heyboxRun(tab, {query:'影之刃零'});
  assert.equal(result.ok, false);
  assert.equal(result.error.code, 'NEED_LOGIN');
  assert.equal(result.items.length, 0);
});

test('waits for session hydration before trusting the initial logged-out header', async () => {
  const h = load();
  let ready = false;
  const cards = [{title:'真实帖子',url:'https://www.xiaoheihe.cn/app/bbs/link/1'}];
  const tab = {
    url: async () => h.heyboxSearchUrl('影之刃零'),
    playwright: {
      evaluate: async () => ({signedIn:ready,login:!ready}),
      getByRole: (_,options) => ({first:()=>({waitFor:async()=>{
        assert.equal(options.name,'发布内容');
        ready = true;
      }})}),
      locator: () => ({first:()=>({waitFor:async()=>{}}), evaluateAll:async()=>cards}),
    },
  };
  const result = await h.heyboxRun(tab, {query:'影之刃零',limit:1});
  assert.equal(result.ok, true);
  assert.equal(result.returned, 1);
});
