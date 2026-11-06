# 安装或更新小黑盒搜索技能

这份说明供收到安装请求的 Agent 执行，也可以手动照做。技能源是 [xleft/xiaoheihe-search](https://github.com/xleft/xiaoheihe-search)。装好后，使用宿主工具在用户授权、已登录小黑盒的浏览器里做只读验收。

## 1. 按当前宿主安装

先确认当前宿主及其识别的技能目录，再检查是否已加载同名技能。升级时沿用该宿主的有效安装位置。来源正确且干净的 Git 副本可在原目录执行 `git pull --ff-only`。有本地修改或来源不明的副本保留原样。每个宿主只保留一个可加载的同名副本。当前会话未刷新时，用新会话确认技能是否出现。

### Codex 桌面版

新装到用户技能目录 `~/.agents/skills/xiaoheihe-search`。如果已有有效的旧安装目录（例如 `~/.codex/skills/xiaoheihe-search`），优先更新现有副本。

Windows PowerShell：

```powershell
$skillParent = Join-Path $env:USERPROFILE '.agents/skills'
New-Item -ItemType Directory -Force -Path $skillParent | Out-Null
git clone https://github.com/xleft/xiaoheihe-search.git (Join-Path $skillParent 'xiaoheihe-search')
```

macOS/Linux：

```sh
mkdir -p "$HOME/.agents/skills"
git clone https://github.com/xleft/xiaoheihe-search.git "$HOME/.agents/skills/xiaoheihe-search"
```

确认技能已加载；若当前会话没有刷新，开启新会话，必要时重启 Codex。使用 Codex 的浏览器操作工具连接用户授权的 Chrome。[Codex 技能文档](https://developers.openai.com/codex/skills)

### WorkBuddy 桌面版

Windows 上已验证从 `~/.workbuddy/skills/xiaoheihe-search` 加载。确认当前客户端使用该目录且可写时，从[仓库最新版](https://github.com/xleft/xiaoheihe-search/archive/refs/heads/main.zip)解压，将包含 `SKILL.md` 和 `references/` 的文件夹命名为 `xiaoheihe-search` 并放入技能目录。使用上传入口时，可下载[已发布的 v0.1.0 导入包](https://github.com/xleft/xiaoheihe-search/releases/download/v0.1.0/xiaoheihe-search.zip)，在「专家·技能·连接器 → 技能 → 添加技能 → 上传技能」导入。新版指引在仓库主分支。

在「设置 → 智能体 → 浏览器操控」分别确认客户端运行时和 Chrome 扩展。需要安装或授权时请用户在对应界面确认。[WorkBuddy 技能文档](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market)

### 豆包办公与其他宿主

豆包办公有本地环境从 `.user_skills` 加载成功的记录，也有环境仅报告技能上传入口。先确认当前宿主是否明确提供可写的技能根目录。确认后可放入完整技能文件夹。若只提供上传入口，由用户在技能管理界面上传。以当前宿主的识别结果为准。

其他宿主使用其当前配置的技能根目录或上传入口。按[浏览器操作指引](../references/browser-workflow.md)检查实际提供的浏览器能力。已登录的本机 Chrome 与宿主独立浏览器需要分别确认。

### Hermes Agent（可搭配 DeepSeek）

新装到当前 Hermes 配置的技能目录。默认路径为 `~/.hermes/skills/xiaoheihe-search`；如果启用了独立配置，先核实该配置的实际目录。以下是 macOS/Linux 默认路径的示例：

```sh
mkdir -p "$HOME/.hermes/skills"
git clone https://github.com/xleft/xiaoheihe-search.git "$HOME/.hermes/skills/xiaoheihe-search"
```

确认能找到 `/xiaoheihe-search`，再按[浏览器操作指引](../references/browser-workflow.md)配置 Hermes 的浏览器工具。即使已选用 DeepSeek 模型，也要单独完成浏览器连接。[Hermes 技能文档](https://hermes-agent.nousresearch.com/docs/guides/work-with-skills)

Codex 或 Hermes 没有 Git 时，可下载[仓库源码 ZIP](https://github.com/xleft/xiaoheihe-search/archive/refs/heads/main.zip)，把解压出的目录改名为 `xiaoheihe-search`，放到相应的技能目录，保留 `SKILL.md`、`scripts/` 和 `references/`。升级手动安装的副本前，先确认是否有本地修改。

## 2. 检查是否能用

验收题为「《影之刃零》在小黑盒上有哪些热门讨论？」

1. **技能已加载**。确认宿主识别 `xiaoheihe-search`，区分文件已就位和会话已加载。
2. **浏览器已连通**。先列标签页核对实例（工具无法列出时打开首页验证），然后在该实例打开[小黑盒](https://www.xiaoheihe.cn/)核对登录状态。分别说明连接和登录结果。授权、登录与验证由用户处理。
3. **实际查询已通过**。按 [SKILL.md](../SKILL.md) 在站内找到游戏专属社区和热门讨论，先列原帖链接和实际读到的代表性回复，再归纳主题、争议和可尝试的解法。说明热度依据、实读样本和网页限制。只有列表卡片，或未取得可见回复时，记为部分通过，写明卡点。

比较流程效率时，记录从开始到读到首篇原帖及回复的耗时、无效重试次数、截图次数和实际读到的回复数。需要用户安装、授权或登录的等待单独记录。
