const mongoose = require("mongoose");

// 连接MongoDB
mongoose
  .connect(`mongodb://admin:123456@localhost:27017/users`)
  .then(() => {})
  .catch((error) => {
    console.log(`MongoDB Error: ${error}`);
  });
