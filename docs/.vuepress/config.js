const readFileList = require("../../scripts/build.js");

module.exports = {
  title: "光伏日报",
  description:
    "光伏日报，聚焦光伏行业动态。内容涵盖：政策、技术、市场、企业等板块。",
  head: [
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: "/rss.xml",
        title: "光伏日报"
      }
    ]
  ],
  plugins: [
    [
      "vuepress-plugin-baidu-google-analytics",
      {
        hm: "489822e659c8198759f3fd27589071c7",
        ignore_hash: false
      }
    ],
    [
      "vuepress-plugin-rss-support",
      {
        site_url: "https://ankrwu.github.io/zaobao",
        filter: page => /^\/20.+/.test(page.path),
        copyright: "2026光伏日报",
        count: 60
      }
    ],
    [
      "@vssue/vuepress-plugin-vssue",
      {
        platform: "github",
        owner: "ankrwu",
        repo: "zaobao",
        clientId: "20ee116870a4be78bb37",
        clientSecret: "13c39d03e4bdc6f13023cc6f318ca132c7522b9f"
      }
    ]
  ],
  base: "/zaobao/",
  themeConfig: {
    repo: "ankrwu/zaobao",
    lastUpdated: "Last Updated",
    docsDir: "docs",
    algolia: {
      apiKey: "d9708b4d74ba98295f2a87341fae3f0c",
      indexName: "zaobao"
    },
    nav: [{ text: "留言", link: "/other/talk" }],
    sidebar: [
      ["/", "1. 介绍"],
      {
        title: "2026年03月",
        collapsable: false,
        children: readFileList("2026", "03")
      }
    ]
  }
};
