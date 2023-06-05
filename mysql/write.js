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

const mysqlWriteMain = async () => {
  return new Promise(async (resolve, reject) => {
    // 每秒 MySQL CPU占用
    const cpus = [];
    // 每秒 MySQL 内存占用
    const memories = [];
    // 每次插入耗时
    const insertTimes = [];
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
      const { responseTime } = await mysqlHandler(
        "insert into users(name,email,password) values(?,?,?)",
        ["user" + i, i + "@qq.com", 123456]
      );
      insertTimes.push(responseTime);
    }
    // 清除定时器
    clearInterval(interval);
    // 保存 excel 表格
    writeExcel("MySQL写操作CPU占用.xlsx", cpus, "sheet");
    writeExcel("MySQL写操作内存占用.xlsx", memories, "sheet");
    writeExcel("MySQL写操作耗时.xlsx", insertTimes, "sheet");
    let totalTime = insertTimes.reduce((total, value) => (total += value), 0);
    console.log(`总耗时: ${totalTime} ms`);
    resolve("MySQL 写操作完成！");
  });
};

module.exports = { mysqlWriteMain };
