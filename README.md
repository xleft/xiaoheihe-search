# 小黑盒站内搜索 Skill

用**你已登录小黑盒的 Chrome**，查游戏档案、评分和站内讨论。适合找攻略、跟进补丁反馈、比较玩家口碑。需要看讨论时，给出原帖链接、代表性回复和争议点，便于自己追看。

| 能查什么 | 示例输出 |
| --- | --- |
| 站内搜帖与读帖 | 标题、原帖链接、摘要、正文和已加载回复 |
| 游戏档案与评价 | 小黑盒评分、评价人数、全语言好评率、简介、页面价格、在线数据、短评样本 |
| 游戏专属社区 | 通过游戏详情页「社区」进入，按需读原帖和回复 |

数据以网页实际展示为准。完整玩家统计等需要打开 App 的字段，以及未加载或折叠的评论，不保证取到。不会导入 Cookie、调用未公开接口或替你登录。技能本身不需要 Agent Reach、OpenCLI、heybox-cli 或 API 密钥；需要宿主可操作你授权的 Chrome。

## 安装

| 环境 | 安装与浏览器 | 验证状态 |
| --- | --- | --- |
| **Codex 桌面版** | 将本仓库放到用户技能目录 `~/.agents/skills/xiaoheihe-search`。在 Codex 中连接已登录小黑盒的 Chrome。 | Windows 上已实测搜帖、读帖、评论采样、游戏档案与专属社区 |
| **WorkBuddy 桌面版** | [下载技能 ZIP](https://github.com/xleft/xiaoheihe-search/releases/latest/download/xiaoheihe-search.zip)，从「专家·技能·连接器 → 技能 → 添加技能 → 上传技能」导入。用 WorkBuddy 的 Chrome 扩展连接已登录的浏览器。 | 提供原生浏览器操作路线，尚未端到端实测 |
| **Hermes Agent（可使用 DeepSeek 模型）** | 将本仓库放到 `~/.hermes/skills/xiaoheihe-search`，或放到当前 Hermes 配置的技能目录。在已授权的 Chrome 中登录小黑盒，并按官方说明连接 Hermes 浏览器工具。 | 提供原生浏览器操作路线，尚未端到端实测 |

例如，在 Windows PowerShell 安装到 Codex：

```powershell
git clone https://github.com/xleft/xiaoheihe-search.git "$env:USERPROFILE/.agents/skills/xiaoheihe-search"
```

macOS/Linux 的 Codex 和 Hermes Agent 可分别克隆到：

```sh
git clone https://github.com/xleft/xiaoheihe-search.git ~/.agents/skills/xiaoheihe-search
# 或者，安装到 Hermes Agent：
git clone https://github.com/xleft/xiaoheihe-search.git ~/.hermes/skills/xiaoheihe-search
```

已有同名技能时请更新原目录，避免装出两个同名副本。没有显示时新开会话；Codex 仍未识别时可重启。Hermes 只换成 DeepSeek 模型不会自动接通浏览器，仍需正确配置并授权 Chrome。三个宿主的执行区别见[浏览器操作指引](references/browser-workflow.md)。

## 怎么用

安装后，可以直接说：

- 「用小黑盒搜索技能查《尼尔：机械纪元》的评分和玩家短评，说明两种评分口径。」
- 「去小黑盒搜《影之刃零》瞬身误触，列 5 篇相关帖和代表性回复，标出争议。」
- 「打开这条小黑盒帖子，整理楼主观点和评论区给出的解决办法。」

也可以在 Codex 中用 `$xiaoheihe-search`，在 Hermes 中用 `/xiaoheihe-search`。

## 参考

[Codex 技能文档](https://developers.openai.com/codex/skills) · [WorkBuddy 上传技能](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market) · [Hermes 技能文档](https://hermes-agent.nousresearch.com/docs/guides/work-with-skills)

输出范围标记参考了 [heybox-cli](https://github.com/shadowfish07/heybox-cli) 的只读工具设计；本项目通过浏览器读取页面，不运行该 CLI。

本项目是独立技能，与小黑盒、OpenAI、腾讯及 Nous Research 无官方隶属关系。
