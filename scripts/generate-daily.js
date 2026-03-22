const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 项目开始日期
const START_DATE = new Date('2026-03-22');

// 光伏行业分类映射
const CATEGORY_MAP = {
  '政策': '政策',
  '法规': '法规',
  '通知': '通知',
  '技术': '技术',
  '市场': '市场',
  '企业': '企业',
  '数据': '数据',
  '项目': '市场',
  '投资': '市场',
  '装机': '数据',
  '发电': '数据',
  '电池': '技术',
  '组件': '技术',
  '硅料': '技术',
  '硅片': '技术',
  '逆变器': '技术',
  '储能': '技术',
};

// 请求配置
const REQUEST_CONFIG = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  },
  timeout: 30000
};

/**
 * 根据标题判断分类
 */
function getCategoryByTitle(title) {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (title.includes(key)) {
      return value;
    }
  }
  return '市场';
}

/**
 * 计算从项目开始到今天的天数
 */
function calculateDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today - START_DATE);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 获取今天的日期信息
 */
function getTodayInfo() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return {
    year,
    month,
    day,
    formatted: `${year}.${month}.${day}`,
    filePath: `docs/${year}/${month}/${day}.md`
  };
}

/**
 * 解析国家能源局
 */
async function parseNEA() {
  const items = [];
  try {
    const response = await axios.get('https://www.nea.gov.cn/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 10 && !title.includes('更多')) {
        // 过滤光伏/太阳能/新能源相关
        if (title.includes('光伏') || title.includes('太阳能') || title.includes('新能源') || title.includes('可再生能源')) {
          // 处理 URL
          if (href.startsWith('/')) {
            href = `https://www.nea.gov.cn${href}`;
          } else if (!href.startsWith('http')) {
            href = `https://www.nea.gov.cn/${href}`;
          }
          items.push({
            category: getCategoryByTitle(title),
            title: title.substring(0, 100),
            url: href
          });
        }
      }
    });
  } catch (error) {
    console.error(`  解析国家能源局失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析工信部光伏相关政策
 */
async function parseMIIT() {
  const items = [];
  try {
    const response = await axios.get('https://www.miit.gov.cn/zwgk/zcwj/wjfb/index.html', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 5 && !title.includes('更多')) {
        // 过滤光伏相关
        if (title.includes('光伏') || title.includes('太阳能') || title.includes('新能源') || title.includes('组件')) {
          if (href.startsWith('/')) {
            href = `https://www.miit.gov.cn${href}`;
          }
          items.push({
            category: '政策',
            title: title.substring(0, 100),
            url: href
          });
        }
      }
    });
  } catch (error) {
    console.error(`  解析工信部失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析中国光伏行业协会
 */
async function parseCPIA() {
  const items = [];
  try {
    const response = await axios.get('https://www.chinapv.org.cn/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 8 && !title.includes('更多') && !title.includes('登录')) {
        if (href.startsWith('/')) {
          href = `https://www.chinapv.org.cn${href}`;
        } else if (!href.startsWith('http')) {
          href = `https://www.chinapv.org.cn/${href}`;
        }
        items.push({
          category: getCategoryByTitle(title),
          title: title.substring(0, 100),
          url: href
        });
      }
    });
  } catch (error) {
    console.error(`  解析光伏行业协会失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析北极星太阳能光伏网
 */
async function parseBJX() {
  const items = [];
  try {
    const response = await axios.get('https://guangfu.bjx.com.cn/yw/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 10 && !title.includes('更多') && !title.includes('登录')) {
        if (!href.startsWith('http')) {
          href = `https://guangfu.bjx.com.cn${href}`;
        }
        items.push({
          category: getCategoryByTitle(title),
          title: title.substring(0, 100),
          url: href
        });
      }
    });
  } catch (error) {
    console.error(`  解析北极星光伏网失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析国家发改委新能源政策
 */
async function parseNDRC() {
  const items = [];
  try {
    const response = await axios.get('https://www.ndrc.gov.cn/xwdt/tzgg/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 5 && !title.includes('更多')) {
        // 过滤新能源相关
        if (title.includes('光伏') || title.includes('太阳能') || title.includes('新能源') || title.includes('能源') || title.includes('电力')) {
          if (href.startsWith('/')) {
            href = `https://www.ndrc.gov.cn${href}`;
          }
          items.push({
            category: getCategoryByTitle(title),
            title: title.substring(0, 100),
            url: href
          });
        }
      }
    });
  } catch (error) {
    console.error(`  解析发改委失败: ${error.message}`);
  }
  return items;
}

/**
 * 获取光伏新闻信息
 */
async function fetchSolarItems() {
  console.log('开始获取光伏行业信息...\n');

  const allItems = [];
  const sources = [
    { name: '国家能源局', parse: parseNEA },
    { name: '工信部', parse: parseMIIT },
    { name: '中国光伏行业协会', parse: parseCPIA },
    { name: '北极星光伏网', parse: parseBJX },
    { name: '国家发改委', parse: parseNDRC },
  ];

  for (const source of sources) {
    console.log(`正在获取: ${source.name}`);
    try {
      const items = await source.parse();
      console.log(`  获取到 ${items.length} 条信息\n`);
      // 为每条新闻添加来源信息
      items.forEach(item => {
        item.source = source.name;
      });
      allItems.push(...items);
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`  获取失败: ${error.message}\n`);
    }
  }

  // 去重（根据标题）
  const uniqueItems = [];
  const seen = new Set();
  for (const item of allItems) {
    const normalizedTitle = item.title.replace(/\s+/g, '');
    if (!seen.has(normalizedTitle) && item.title.length > 5) {
      seen.add(normalizedTitle);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

/**
 * 生成日报内容
 */
function generateContent(todayInfo, days, items) {
  const lines = [];

  // 标题
  lines.push(`### ${todayInfo.formatted} 今天是光伏日报陪伴您的第 ${days} 天`);
  lines.push('');

  // 新闻条目（最多 20 条）
  const selectedItems = items.slice(0, 20);
  for (const item of selectedItems) {
    lines.push(`[${item.category}] ${item.title}（${item.source}）：<${item.url}>`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('=== 光伏日报生成器 ===\n');

  const todayInfo = getTodayInfo();
  const days = calculateDays();

  console.log(`日期: ${todayInfo.formatted}`);
  console.log(`天数: 第 ${days} 天`);
  console.log(`目标文件: ${todayInfo.filePath}\n`);

  // 检查今天是否已有日报
  if (fs.existsSync(todayInfo.filePath)) {
    console.log('今日日报已存在，跳过生成。');
    console.log('如需重新生成，请先删除现有文件。');
    return;
  }

  // 获取光伏新闻信息
  const items = await fetchSolarItems();

  if (items.length === 0) {
    console.log('\n警告: 未获取到任何光伏信息！');
    console.log('生成空模板...\n');
  } else {
    console.log(`\n总计获取 ${items.length} 条光伏信息`);
    console.log(`将选取前 10 条生成日报\n`);
  }

  // 生成内容
  const content = generateContent(todayInfo, days, items);

  // 确保目录存在并写入文件
  ensureDirectoryExists(todayInfo.filePath);
  fs.writeFileSync(todayInfo.filePath, content, 'utf-8');

  console.log(`日报生成完成: ${todayInfo.filePath}`);
}

main().catch(error => {
  console.error('生成失败:', error);
  process.exit(1);
});