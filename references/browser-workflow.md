# WorkBuddy / Hermes Agent 浏览器操作

两个宿主共用同一套网页流程。它们不运行仓库中的 Codex CUA 脚本。本路线按各宿主的官方文档编写，尚未在这两个宿主做端到端实测。

## 接入

- **WorkBuddy 桌面版**：在「设置 → 智能体 → 浏览器操控」安装并连接 Chrome 扩展，选择已登录小黑盒的 Chrome。用 WorkBuddy 的独立浏览器工具导航、读取页面和滚动。[官方浏览器文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Right-Sidebar#独立浏览器使用)
- **Hermes Agent**（也适用于在 Hermes 中选择 DeepSeek 模型）：启用浏览器工具，按官方文档连接用户授权的 Chrome，再使用 `browser_exec` 或已经配置的 Chrome 浏览器 MCP。支持的本地 CLI 中可用 `/browser status` 确认连接；`/browser connect` 不是聊天网关里的命令。首次连接的浏览器可能是独立配置，必须核实登录状态，不能把打开了 Chromium 当成已经登录。[官方浏览器文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser#your-own-browser-via-cdp-browser-connect)

在授权浏览器打开小黑盒官网，确认导航显示登录后的控件（例如「发布内容」和头像）。出现登录按钮、验证码、风控或无法确认身份时停止并说明情况。不要通过读凭据、换账号或调用后台接口解决。只操作任务所用的标签。

## 站内帖子和回复

1. 打开 [小黑盒搜索](https://www.xiaoheihe.cn/app/search)，输入游戏名和关键词，切到「内容」。核对结果页的关键词和筛选项。
2. 提取真正的帖子链接（官网路径 `/app/bbs/link/…`），按链接去重，保留标题、摘要、页面显示时间；游戏卡片、商品、用户、热搜词不算帖子。需要更多时有限向下滚动，保留实得条数。
3. 打开与问题最相关的原帖核对正文；需要讨论样本时，读取当前加载的评论和楼中楼。不要把评论数当作已读回复数量，也不要把「相似内容」混进原帖。
4. 返回帖子列表、各帖的代表性回复、核心观点和争议；报告抽样范围。没有独立回复链接时，使用原帖链接即可。

## 游戏档案和专属社区

1. 在搜索结果的「综合」里找同名游戏，优先核对游戏名、版本和平台；只有能区分的才打开。PC 或手游游戏页的典型路径为 `/app/topic/game/pc/…` 或 `/app/topic/game/mobile/…`。不要把同名移植版、DLC 或原声带当成游戏本体。
2. 在「游戏」页读实际可见的评分、评价人数、平台好评率、价格、在线人数、史低、简介、发行信息和短评。按页面标签保留口径，标记查询时间；缺项留空或说未取得。
3. 在**游戏页内部**点「社区」（与顶栏的全站社区不同），核对目标仍是同一游戏的专属社区，再取帖子。网页「查看全部数据」等入口如果要求扫码打开 App，只报告该限制。
