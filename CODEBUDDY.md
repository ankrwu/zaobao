# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## 项目概述

每日时报是一个基于 VuePress 的国家政策日报静态网站，以国家政策体系为主要分享课题，内容分为政策、法规、通知、财税等板块。

## 常用命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 本地开发预览（http://localhost:8080/zaobao/）
pnpm doc:dev

# 构建静态网站
pnpm doc:build

# 部署到 GitHub Pages
pnpm doc:deploy

# Markdown 文档规范检查
pnpm lint:md

# JavaScript 代码检查
pnpm lint:js

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 项目结构

```
├── docs/                    # VuePress 文档目录
│   ├── .vuepress/          # VuePress 配置
│   │   ├── config.js       # 主配置文件（包含侧边栏导航配置）
│   │   └── theme/          # 自定义主题（扩展自 @vuepress/theme-default）
│   ├── 20xx/               # 按年份组织的日报目录
│   │   └── 01-12/          # 按月份组织的日报目录
│   │       └── dd.md       # 每日日报文件（如 16.md）
│   ├── other/              # 其他页面
│   │   ├── latest.md       # 最新日报入口
│   │   └── talk.md         # 留言页面
│   └── README.md           # 首页
├── scripts/
│   └── build.js            # 读取日报文件列表的工具函数
├── test/                   # Jest 测试
├── commitlint.config.js    # Commit 规范配置（conventional commits）
└── .lintmdrc               # Markdown 规范配置
```

## 架构要点

### 侧边栏自动生成

`docs/.vuepress/config.js` 使用 `scripts/build.js` 中的 `readFileList(year, month)` 函数动态读取对应年月目录下的日报文件，自动生成侧边栏导航。

### 日报文件格式

日报文件存放在 `docs/{年份}/{月份}/{日期}.md`，例如 `docs/2026/03/16.md`。文件格式示例：

```markdown
### 2026.03.16 今天是每日时报陪伴您的第 N 天

[分类] 标题：链接
```

分类包括：政策、法规、通知、财税、科技等。

### 提交规范

项目使用 commitlint + conventional commits 规范。提交信息格式：`type: description`

### 部署流程

`deploy.sh` 脚本执行：构建 → 进入 dist 目录 → 初始化 git → 强制推送到 gh-pages 分支。

### 信息来源

国家政策信息主要来源（已验证可访问）：

**政策数据库**
- 人民数据国家政策数据库：https://data.people.com.cn/pd/gjzcxx/index.html
- 人民数据政策库：https://data.people.com.cn/pd/zck

**国务院及综合部门**
- 中国政府网：https://www.gov.cn/
- 国家发改委：https://www.ndrc.gov.cn/
- 国务院新闻办公室：http://www.scio.gov.cn/

**经济金融部门**
- 财政部：https://www.mof.gov.cn/
- 中国人民银行：http://www.pbc.gov.cn/
- 商务部：https://www.mofcom.gov.cn/

**社会民生部门**
- 教育部：https://www.moe.gov.cn/
- 人社部：https://www.mohrss.gov.cn/
- 民政部：https://www.mca.gov.cn/
- 国家医保局：https://www.nhsa.gov.cn/
- 文化和旅游部：https://www.mct.gov.cn/

**产业建设部门**
- 工信部：https://www.miit.gov.cn/
- 住建部：https://www.mohurd.gov.cn/
- 应急管理部：https://www.mem.gov.cn/

**司法执法机关**
- 最高人民法院：https://www.court.gov.cn/
- 最高人民检察院：https://www.spp.gov.cn/

## 包管理器

项目使用 pnpm 作为包管理器，配置文件为 `.pnpmrc` 和 `.npmrc`。
