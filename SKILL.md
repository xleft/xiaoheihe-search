---
name: xiaoheihe-search
description: Search 小黑盒 (Heybox, Xiaoheihe) for game profiles, scores, reviews, community posts, and replies when the user asks for information from that site.
metadata:
  version: "0.1.0"
  browser: "Authorized Chrome signed in to Heybox"
---

# 小黑盒站内搜索

只读使用用户授权、已登录小黑盒的 Chrome。未连接、身份不明、已退出或遇到验证时，请用户处理当前浏览器；不改用匿名网页、通用搜索、其他账号或客户端接口。不要读取或传输 Cookie，也不要发帖、点赞、关注、领券或购买。

## 选择浏览器工具

- **Codex 桌面版**：通过 Chrome 连接打开临时标签。搜帖或读帖时，将 [搜帖脚本](scripts/heybox.cua.js) 源码载入 CUA REPL；查游戏档案时，载入 [档案脚本](scripts/heybox-game.cua.js)。源码应在 CUA REPL 中运行，不是终端命令。
- **WorkBuddy 或 Hermes Agent**：按 [宿主与网页操作指引](references/browser-workflow.md) 使用宿主的原生浏览器工具。不要调用 Codex 专属脚本，或在当前宿主没有浏览器权限时改用其他来源。

Codex 调用示例（`tab` 是工具返回的 Chrome 标签）：

```js
nodeRepl.write(await heyboxRun(tab, { query: '影之刃零 瞬身', limit: 10 }));
nodeRepl.write(await heyboxRun(tab, { url: postUrl, comments: true }));
nodeRepl.write(await heyboxGame(tab, { query: '尼尔机械纪元', reviews: 3, community: 5 }));
```

`postUrl` 使用实际观察到的小黑盒原帖链接。游戏档案也可传实际观察到的游戏详情页 `url`；名称不唯一时核对游戏、平台和版本。同一问题按需取样，避免为了数量打开大量帖子。

## 呈现结果

- 想看讨论：先列原帖链接，每帖给出核心观点、实际读到的代表性回复及争议。搜索卡片摘要不算正文，评论数不算已读回复。只有需要核对或汇总时，打开最相关的 1–3 篇原帖继续读。
- 想看游戏档案：评分、网页显示的评价人数和「全语言好评率」分开；评价样本和游戏专属社区帖子也分开。小黑盒玩家数不等于销量。价格保留页面原始口径和查询时间，不自行从领券提示推算到手价。
- 只报告已加载的内容和实际读到的字段。注明数据来源、样本量和未展开回复；`partial` 或 `completeness_verified:false` 不得解读为全量。网页提示打开 App 时，将该字段标记为未取得，不把入口提示当作数据。
