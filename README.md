# 小黑盒搜索 Skill

**让你的 Agent 用你已登录的小黑盒 Chrome，查游戏评分、搜站内帖子、读玩家回复。**

适合找攻略、跟进补丁反馈，也适合在买游戏前看看玩家怎么评价。想了解一场讨论时，Agent 会给出原帖和代表性回复，再概括共识、分歧和玩家提出的解决办法。

## 快速上手

把下面这句话发给 **Codex、WorkBuddy 或 Hermes Agent**：

```text
帮我安装或更新小黑盒搜索技能，并做一次只读验收：https://raw.githubusercontent.com/xleft/xiaoheihe-search/main/docs/install.md
```

Agent 会按[安装说明](docs/install.md)选择适合当前环境的方式，并分别检查技能是否加载、浏览器是否连通、能否查到游戏信息。首次连接 Chrome、登录小黑盒或上传技能包时，可能需要你在界面上操作。

技能需要 Agent 能操作你授权的、已登录小黑盒的 Chrome。不需要另装 Agent Reach、OpenCLI、heybox-cli，也不需要 API 密钥。

## 能查什么

| 你想看 | 能拿到什么 |
| --- | --- |
| 站内帖子与讨论 | 原帖标题和链接、正文重点、已加载的评论与楼中楼样本 |
| 游戏信息与评分 | 简介、小黑盒评分和评价人数、平台好评率、玩家短评，以及页面可见的价格和在线数据 |
| 某款游戏的专属社区 | 从游戏详情页进入该游戏的「社区」，列出相关帖子和代表性回复 |

以浏览器实际显示为准。需要扫码打开 App 的完整玩家统计、移动端专属券价等，网页读不到时会标明。评论是已读样本，不能代表整个评论区。

## 怎么用

装好后直接说你想查什么，例如：

- 「去小黑盒搜《影之刃零》瞬身误触，列 5 篇相关帖子和代表性回复，总结大家争论什么、有哪些解决办法。」
- 「查《尼尔：机械纪元》的小黑盒评分和玩家短评，把小黑盒评分与 Steam 好评率分开列。」
- 「打开这条小黑盒帖子，列出楼主的核心观点和评论区的不同意见。」说完附上帖子链接即可。

也可以在 Codex 中用 `$xiaoheihe-search`，或在 Hermes Agent 中用 `/xiaoheihe-search`。

## 支持的环境

| 环境 | 手动安装入口 | 验证状态 |
| --- | --- | --- |
| **Codex 桌面版** | 将仓库放到 `~/.agents/skills/xiaoheihe-search`，连接已登录小黑盒的 Chrome | Windows 上已实测搜帖、读帖、评论采样、游戏档案与专属社区 |
| **WorkBuddy 桌面版** | [下载技能 ZIP](https://github.com/xleft/xiaoheihe-search/releases/latest/download/xiaoheihe-search.zip)，从「专家·技能·连接器 → 技能 → 添加技能 → 上传技能」导入；通过 Chrome 扩展连接浏览器 | 已提供安装包和操作指引，尚未端到端实测 |
| **Hermes Agent（可搭配 DeepSeek）** | 将仓库放到 `~/.hermes/skills/xiaoheihe-search` 或当前配置的技能目录，再连接授权的 Chrome | 已提供操作指引，尚未端到端实测 |

手动安装命令和检查步骤见[安装与更新](docs/install.md)。WorkBuddy 和 Hermes 使用各自的浏览器工具，详见[浏览器操作指引](references/browser-workflow.md)。在 Hermes 中选择 DeepSeek 模型后，仍需配置浏览器工具。

## 参考

快速上手的呈现方式参考 [Agent Reach](https://github.com/Panniantong/agent-reach#快速上手)，输出范围的标记参考 [heybox-cli](https://github.com/shadowfish07/heybox-cli) 的只读工具设计。

本项目是独立技能，与小黑盒、OpenAI、腾讯及 Nous Research 无官方隶属关系。
