const { resolve } = require('path');
const { existsSync, lstatSync, readdirSync } = require('fs');

function readFileList(year, moon) {
  const fileList = [];
  const dirPath = resolve(`./docs/${year}/${moon}/`);
  const isDir = existsSync(dirPath) && lstatSync(dirPath).isDirectory();
  if (!isDir) {
    return fileList;
  }

  const files = readdirSync(dirPath);
  files.forEach((item) => {
    const currentFile = item.slice(0, 2);
    fileList.push([
      `/${year}/${moon}/${currentFile}`,
      `${year}年${moon}月${currentFile}日`
    ]);
  });
  return fileList.reverse();
}

/**
 * 读取指定年份下的所有月份目录
 * @param {string} year - 年份，如 "2026"
 * @returns {string[]} 月份数组，如 ["03", "04"]
 */
function readMonths(year) {
  const months = [];
  const yearPath = resolve(`./docs/${year}/`);
  const isDir = existsSync(yearPath) && lstatSync(yearPath).isDirectory();
  if (!isDir) {
    return months;
  }

  const dirs = readdirSync(yearPath);
  dirs.forEach((item) => {
    const monthPath = resolve(yearPath, item);
    if (lstatSync(monthPath).isDirectory() && /^\d{2}$/.test(item)) {
      months.push(item);
    }
  });
  return months.sort().reverse(); // 降序排列，最新的月份在前
}

/**
 * 生成侧边栏配置（动态读取所有月份）
 * @param {string} year - 年份，如 "2026"
 * @returns {Array} 侧边栏配置数组
 */
function generateSidebar(year) {
  const months = readMonths(year);
  const sidebar = [];

  months.forEach((month) => {
    const children = readFileList(year, month);
    if (children.length > 0) {
      sidebar.push({
        title: `${year}年${month}月`,
        collapsable: true,
        children: children
      });
    }
  });

  return sidebar;
}

module.exports = {
  readFileList,
  readMonths,
  generateSidebar
};
