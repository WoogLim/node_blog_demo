const mongoose = require("mongoose");
mongoose.set('strictQuery',false)

const connect = () => {
  // 커넥션 에러 시 catch
  mongoose
    .connect("mongodb://localhost:27017/spa_blog")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  // 커넥션 과정 에러 발생 시, 에러 발생
  console.error("몽고디비 연결 에러", err);
});

// connect 익명함수를 외부에서 이용 가능하도록 설정
module.exports = connect;