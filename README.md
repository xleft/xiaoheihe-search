# 小黑盒搜索 Skill

**让你的 Agent 用你授权、已登录小黑盒的浏览器，查游戏评分、搜站内帖子、读玩家回复。**

适合找攻略、跟进补丁反馈，也适合在买游戏前看看玩家怎么评价。想了解一场讨论时，Agent 会给出原帖和代表性回复，再概括共识、分歧和玩家提出的解决办法。

## 快速上手

把下面这句话发给 **Codex、WorkBuddy、豆包办公或 Hermes Agent**：

```text
帮我安装或更新小黑盒搜索技能，并做一次只读验收：https://raw.githubusercontent.com/xleft/xiaoheihe-search/main/docs/install.md
```

Agent 会按[安装说明](docs/install.md)选择当前环境的安装方式，并用「《影之刃零》在小黑盒上有哪些热门讨论？」验收技能加载、浏览器连接和实际查询。首次连接浏览器、登录小黑盒或上传技能包时，可能需要你在界面上操作。

技能使用宿主提供的浏览器工具和你自己的小黑盒登录态，无需 API 密钥或发布者提供的服务。登录由你本人完成，技能只读取网页可见内容。

## 能查什么

| 你想看 | 能拿到什么 |
| --- | --- |
| 站内帖子与讨论 | 原帖标题和链接、正文重点、已加载的评论与楼中楼样本 |
| 游戏信息与评分 | 简介、小黑盒评分和评价人数、平台好评率、玩家短评，以及页面可见的价格和在线数据 |
| 某款游戏的专属社区 | 从游戏详情页进入该游戏的「社区」，列出相关帖子和代表性回复 |

以浏览器实际显示为准。需要扫码打开 App 的完整玩家统计、移动端专属券价等，网页读不到时会标明。评论是已读样本，不能代表整个评论区。

## 怎么用

装好后直接说你想查什么，例如：

- 「《影之刃零》在小黑盒上有哪些热门讨论？先给我原帖和代表性回复，再总结大家在讨论什么，说明热门的依据和取样范围。」
- 「查《尼尔：机械纪元》的小黑盒评分和玩家短评，把小黑盒评分与 Steam 好评率分开列。」
- 「打开这条小黑盒帖子，列出楼主的核心观点和评论区的不同意见。」说完附上帖子链接即可。

也可以在 Codex 中用 `$xiaoheihe-search`，或在 Hermes Agent 中用 `/xiaoheihe-search`。

## 支持的环境

| 环境 | 手动安装入口 | 验证状态 |
| --- | --- | --- |
| **Codex 桌面版** | 将仓库放到 `~/.agents/skills/xiaoheihe-search`，连接已登录小黑盒的 Chrome | Windows 上已实测搜帖、读帖、评论采样、游戏档案与专属社区 |
| **WorkBuddy 桌面版** | 将[仓库最新版](https://github.com/xleft/xiaoheihe-search/archive/refs/heads/main.zip)解压到已识别的本地技能目录；用客户端运行时和 Chrome 扩展连接浏览器 | Windows 上已实测技能加载、Chrome 连接和游戏评分查询 |
| **豆包办公** | 按当前环境确认本地技能目录或技能上传入口，使用获授权的宿主浏览器 | 已有独立浏览器扫码登录及游戏评分查询记录；安装方式需按环境确认 |
| **Hermes Agent（可搭配 DeepSeek）** | 将仓库放到 `~/.hermes/skills/xiaoheihe-search` 或当前配置的技能目录，再连接授权的 Chrome | 已提供操作指引，尚未端到端实测 |

手动安装命令和检查步骤见[安装与更新](docs/install.md)。如果使用 WorkBuddy 的上传入口，可下载[已发布的 v0.1.0 导入包](https://github.com/xleft/xiaoheihe-search/releases/download/v0.1.0/xiaoheihe-search.zip)。新版排障和验收指引在仓库主分支。

上表记录已有实测，《影之刃零》新版验收流程需各宿主分别复跑。WorkBuddy 扩展显示未连接时，先检查客户端的「浏览器操控」运行时。豆包若打开独立浏览器，先确认授权和登录状态。详见[浏览器操作指引](references/browser-workflow.md)。

## 参考

快速上手的呈现方式参考 [Agent Reach](https://github.com/Panniantong/agent-reach#快速上手)，输出范围的标记参考 [heybox-cli](https://github.com/shadowfish07/heybox-cli) 的只读工具设计。

本项目是独立技能，与小黑盒、OpenAI、腾讯及 Nous Research 无官方隶属关系。
