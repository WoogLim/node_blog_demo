const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // 바라볼 게시글 ID
  postId: {
    type: String,
    required: true,
  },
  // 코멘트 비밀번호
  password: {
    type: String,
    required: true,
  },
  // 코멘트 유저
  user: {
    type: String,
    required: true,
  },
  // 코멘트 내용
  content: {
    type: String,
    required: true,
  },
  // 코멘트 넘버 -> 첫번째 댓글 1
  step: {
    type: Number,
    required: true
  },
  // 답글 대상 코멘트 ID
  parentComment: {
    type: String,
  },
  // 답글 넘버 -> 첫번째 답글 1
  replyStep: {
    type: Number,
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
  // 3 -> 삭제됨
  commentStatus: {
    type: Number,
    required: true,
  },
  // 1 -> 댓글
  // 2 -> 답글
  commentType: {
    type: Number,
    required: true,
  }
},{
  versionKey: false
});

module.exports = mongoose.model("Comment", commentSchema);