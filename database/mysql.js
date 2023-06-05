// import module
const mysql = require("mysql");

// mysql pool
const MySQLConnectionPool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "users",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

MySQLConnectionPool.on("connection", (connection) => {
  connection.query("SET SESSION wait_timeout = 28800");
  connection.query("SET NAMES utf8mb4");
});

MySQLConnectionPool.on("enqueue", () => {
  console.log("数据库连接池已满");
});

MySQLConnectionPool.on("release", () => {});

MySQLConnectionPool.on("error", (err) => {
  console.error("MySQL error: ", err);
});

// 查询结果转换函数
function transformResult(result) {
  result = JSON.stringify(result);
  result = JSON.parse(result);
  return result;
}

// MySQL Handler
const mysqlHandler = async (sql, value) => {
  // 从连接池中获取连接
  return new Promise(async (resolve, reject) => {
    try {
      await MySQLConnectionPool.getConnection(async (err, connection) => {
        if (err) throw new Error(err);
        // 记录开始时间
        const startTime = Date.now();
        await connection.query(sql, value, async (err, result) => {
          // 记录结束时间
          const endTime = Date.now();
          if (err) {
            reject(new Error(err));
          }
          let data = await transformResult(result);
          connection.release();
          resolve({ data, responseTime: endTime - startTime });
        });
      });
    } catch (err) {
      reject(new Error(err));
    }
  });
};

// 导出模块
module.exports = { mysqlHandler };
