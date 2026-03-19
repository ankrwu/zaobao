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
};

// 信息来源配置
const SOURCES = [
  {
    name: '中国政府网',
    url: 'https://www.gov.cn/zhengce/zhengceku/index.htm',
    parse: parseGovCn
  },
  {
    name: '人民数据政策库',
    url: 'https://data.people.com.cn/pd/gjzcxx/index.html',
    parse: parsePeopleData
  }
];

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
 * 解析中国政府网政策页面
 */
async function parseGovCn() {
  const items = [];
  try {
    const response = await axios.get('https://www.gov.cn/zhengce/zhengceku/index.htm', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // 解析政策列表
    $('.news_box .list li, .main .list li').each((index, element) => {
      const $item = $(element);
      const $link = $item.find('a');
      const title = $link.text().trim();
      const href = $link.attr('href');

      if (title && href) {
        // 根据标题关键词判断分类
        let category = '政策';
        for (const [key, value] of Object.entries(CATEGORY_MAP)) {
          if (title.includes(key)) {
            category = value;
            break;
          }
        }

        items.push({
          category,
          title,
          url: href.startsWith('http') ? href : `https://www.gov.cn${href}`
        });
      }
    });
  } catch (error) {
    console.error('解析中国政府网失败:', error.message);
  }
  return items;
}

/**
 * 解析人民数据政策库
 */
async function parsePeopleData() {
  const items = [];
  try {
    const response = await axios.get('https://data.people.com.cn/pd/gjzcxx/index.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // 解析政策列表 - 根据实际页面结构调整选择器
    $('.list_box li, .policy_list li, .data_list li').each((index, element) => {
      const $item = $(element);
      const $link = $item.find('a');
      const title = $link.text().trim();
      const href = $link.attr('href');

      if (title && href) {
        let category = '政策';
        for (const [key, value] of Object.entries(CATEGORY_MAP)) {
          if (title.includes(key)) {
            category = value;
            break;
          }
        }

        items.push({
          category,
          title,
          url: href.startsWith('http') ? href : `https://data.people.com.cn${href}`
        });
      }
    });
  } catch (error) {
    console.error('解析人民数据失败:', error.message);
  }
  return items;
}

/**
 * 获取政策信息
 */
async function fetchPolicyItems() {
  console.log('开始获取政策信息...');

  const allItems = [];

  for (const source of SOURCES) {
    console.log(`正在获取: ${source.name}`);
    try {
      const items = await source.parse();
      console.log(`  获取到 ${items.length} 条信息`);
      allItems.push(...items);
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  获取失败: ${error.message}`);
    }
  }

  // 去重（根据标题）
  const uniqueItems = [];
  const seen = new Set();
  for (const item of allItems) {
    if (!seen.has(item.title)) {
      seen.add(item.title);
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

  // 政策条目
  for (const item of items.slice(0, 8)) { // 最多 8 条
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
    console.log('\n未获取到任何政策信息，生成空模板...');
  }

  // 生成内容
  const content = generateContent(todayInfo, days, items);

  // 确保目录存在并写入文件
  ensureDirectoryExists(todayInfo.filePath);
  fs.writeFileSync(todayInfo.filePath, content, 'utf-8');

  console.log(`\n日报生成完成: ${todayInfo.filePath}`);
  console.log(`共 ${items.length} 条政策信息`);
}

main().catch(error => {
  console.error('生成失败:', error);
  process.exit(1);
});
