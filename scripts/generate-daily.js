const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 项目开始日期
const START_DATE = new Date('2018-08-24');

// 政策分类映射
const CATEGORY_MAP = {
  '政策': '政策',
  '法规': '法规',
  '通知': '通知',
  '财税': '财税',
  '科技': '科技',
  '教育': '教育',
  '医疗': '医疗',
  '社保': '社保',
  '环保': '环保',
  '金融': '财税',
  '财政': '财税',
  '税务': '财税',
  '印发': '政策',
  '发布': '通知',
  '办法': '法规',
  '规定': '法规',
  '意见': '政策',
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
  return '政策';
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
 * 解析中国政府网政策库
 */
async function parseGovCnZhengce() {
  const items = [];
  const urls = [
    'https://www.gov.cn/zhengce/',
    'https://www.gov.cn/zhengce/zhengceku/index.htm',
  ];

  for (const url of urls) {
    try {
      console.log(`  尝试: ${url}`);
      const response = await axios.get(url, REQUEST_CONFIG);
      const $ = cheerio.load(response.data);

      // 尝试多种选择器
      const selectors = [
        '.news_box .list li a',
        '.list li a',
        '.news_list li a',
        '.main ul li a',
        '.content ul li a',
        'ul.list li a',
        '.item a'
      ];

      for (const selector of selectors) {
        $(selector).each((index, element) => {
          const $link = $(element);
          const title = $link.text().trim();
          let href = $link.attr('href');

          if (title && href && title.length > 5 && !title.includes('更多')) {
            // 处理相对路径
            if (href.startsWith('/')) {
              href = `https://www.gov.cn${href}`;
            } else if (!href.startsWith('http')) {
              href = `https://www.gov.cn/zhengce/${href}`;
            }

            items.push({
              category: getCategoryByTitle(title),
              title: title.substring(0, 100), // 限制标题长度
              url: href
            });
          }
        });

        if (items.length > 0) {
          console.log(`  使用选择器 "${selector}" 找到 ${items.length} 条`);
          break;
        }
      }

      if (items.length > 0) break;
    } catch (error) {
      console.error(`  请求失败: ${error.message}`);
    }
  }

  return items;
}

/**
 * 解析国务院政策文件
 */
async function parseGovCnLatest() {
  const items = [];
  try {
    const response = await axios.get('https://www.gov.cn/lianbo/index.htm', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 10 && !title.includes('更多') && !title.includes('登录')) {
        if (href.startsWith('/')) {
          href = `https://www.gov.cn${href}`;
        }

        // 过滤非政策类链接
        if (href.includes('gov.cn') && (href.includes('zhengce') || href.includes('content'))) {
          items.push({
            category: getCategoryByTitle(title),
            title: title.substring(0, 100),
            url: href
          });
        }
      }
    });
  } catch (error) {
    console.error(`  解析国务院联播失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析国家发改委
 */
async function parseNdrc() {
  const items = [];
  try {
    const response = await axios.get('https://www.ndrc.gov.cn/xwdt/tzgg/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 5 && !title.includes('更多')) {
        if (href.startsWith('/')) {
          href = `https://www.ndrc.gov.cn${href}`;
        } else if (!href.startsWith('http')) {
          href = `https://www.ndrc.gov.cn/xwdt/tzgg/${href}`;
        }

        items.push({
          category: getCategoryByTitle(title),
          title: title.substring(0, 100),
          url: href
        });
      }
    });
  } catch (error) {
    console.error(`  解析发改委失败: ${error.message}`);
  }
  return items;
}

/**
 * 解析财政部
 */
async function parseMof() {
  const items = [];
  try {
    const response = await axios.get('https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/', REQUEST_CONFIG);
    const $ = cheerio.load(response.data);

    $('a').each((index, element) => {
      const $link = $(element);
      const title = $link.text().trim();
      let href = $link.attr('href');

      if (title && href && title.length > 5 && !title.includes('更多')) {
        if (href.startsWith('/')) {
          href = `https://www.mof.gov.cn${href}`;
        } else if (!href.startsWith('http')) {
          href = `https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/${href}`;
        }

        items.push({
          category: '财税',
          title: title.substring(0, 100),
          url: href
        });
      }
    });
  } catch (error) {
    console.error(`  解析财政部失败: ${error.message}`);
  }
  return items;
}

/**
 * 获取政策信息
 */
async function fetchPolicyItems() {
  console.log('开始获取政策信息...\n');

  const allItems = [];
  const sources = [
    { name: '中国政府网政策库', parse: parseGovCnZhengce },
    { name: '国务院联播', parse: parseGovCnLatest },
    { name: '国家发改委', parse: parseNdrc },
    { name: '财政部', parse: parseMof },
  ];

  for (const source of sources) {
    console.log(`正在获取: ${source.name}`);
    try {
      const items = await source.parse();
      console.log(`  获取到 ${items.length} 条信息\n`);
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
  lines.push(`### ${todayInfo.formatted} 今天是每日时报陪伴您的第 ${days} 天`);
  lines.push('');

  // 政策条目（最多 8 条）
  const selectedItems = items.slice(0, 8);
  for (const item of selectedItems) {
    lines.push(`[${item.category}] ${item.title}：<${item.url}>`);
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
  console.log('=== 每日日报生成器 ===\n');

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

  // 获取政策信息
  const items = await fetchPolicyItems();

  if (items.length === 0) {
    console.log('\n警告: 未获取到任何政策信息！');
    console.log('生成空模板...\n');
  } else {
    console.log(`\n总计获取 ${items.length} 条政策信息`);
    console.log(`将选取前 8 条生成日报\n`);
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