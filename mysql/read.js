const { mysqlHandler } = require("../database/mysql");
const pidusage = require("pidusage");
const nodeXlsx = require("node-xlsx");
const fs = require("fs");
const path = require("path");

const writeExcel = (fileName, data, sheetName) => {
  const buffer = nodeXlsx.build([
    { name: sheetName, data: data.map((item) => [item]) },
  ]);
  fs.writeFileSync(path.join(__dirname, "..", "data", fileName), buffer, {
    flag: "w",
  });
};

const mysqlReadMain = async () => {
  return new Promise(async (resolve, reject) => {
    // 每秒 MySQL CPU占用
    const cpus = [];
    // 每秒 MySQL 内存占用
    const memories = [];
    // 每次读取耗时
    const selectTimes = [];
    // 设置计时器 动态获取进程 CPU占用 内存占用
    let interval;
    // 延迟触发
    setTimeout(() => {
      interval = setInterval(() => {
        pidusage(6596, function (err, stats) {
          cpus.push(stats.cpu);
          memories.push(stats.memory);
        });
      }, 1000);
    }, 100);
    // 循环插入 MySQL
    for (let i = 0; i < 5000; i++) {
      const { responseTime } = await mysqlHandler("select * from users");
      selectTimes.push(responseTime);
    }
    // 清除定时器
    clearInterval(interval);
    // 保存 excel 表格
    writeExcel("MySQL读操作CPU占用.xlsx", cpus, "sheet");
    writeExcel("MySQL读操作内存占用.xlsx", memories, "sheet");
    writeExcel("MySQL读操作耗时.xlsx", selectTimes, "sheet");
    let totalTime = selectTimes.reduce((total, value) => (total += value), 0);
    console.log(`总耗时: ${totalTime} ms`);
    resolve("MySQL 读操作完成！");
  });
};

module.exports = { mysqlReadMain };
