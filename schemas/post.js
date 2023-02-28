const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  // 게시글 비밀번호
  password: {
    type: String,
    required: true,
  },
  // 작성자
  user: {
    type: String,
    required: true,
  },
  // 글 제목
  title: {
    type: String,
    required: true,
  },
  // 글 내용
  content: {
    type: String,
    required: true,
  },
  // 작성일
  createAt: {
    type: String,
  },
  // 수정일
  updateAt: {
    type: String,
  },
  // 삭제일
  deleteAt: {
    type: String,
  },
  // 1 -> 작성됨
  // 2 -> 수정됨
  postStatus: {
    type: Number,
    required: true,
  }
},{
  versionKey: false
});

// 패스워드, 작성자, 제목, 내용, 작성일, 수정일

module.exports = mongoose.model("Post", postSchema);