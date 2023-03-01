const express = require("express")
const router = express.Router();

const {Date} = require("../../modules/common.js")

const Comments = require("../../schemas/comment.js")

/**
 * 댓글 추가 API
 * /community/comment/write
 * @method POST
 * @param {string} postId 게시글 ID
 * @param {string} user 댓글 작성자 ID
 * @param {string} password 댓글 작성자 PW
 * @param {string} content 댓글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.post("/write", async(req, res) => {
  const {postId, user, password, content} = req.body;

  // 검색된 댓글 결과 갯수 
  const commentStep = await Comments.find({postId, commentType: 1}).countDocuments()

  await Comments.create({
    postId
    , user
    , password
    , content
    , createAt: new Date().YYYYMMDDHHMMSS()
    , step: commentStep + 1
    // commentStatue : 1 -> 작성됨 상태
    , commentStatus: 1
    , commentType: 1
  });

  return res.status(200).json({
    success: true
  })
})

/**
 * 댓글 목록 조회 API
 * /community/comment/view
 * @method GET
 * @param {string} postId 게시글 ID
 * @return {json(objectArray)} [{댓글 정보}, ...] 
 */
router.get("/view/:postId", async(req, res) => {
  const {postId} = req.params

  let searchComments = [];

  searchComments = await Comments.find({
      postId
      , commentStatus: { $ne: 3}
      , commentType: 1
    }).sort({step: 1})

    // for await (variable of iterable) {
    //   statement
    // }

  if(searchComments.length){
    searchComments.forEach( async (comment, index) => {

      console.log(comment._id);

      let replyList = await Comments.find({
        postId: comment.postId
        , parentComment : comment._id.toString()
        , commentType: 2}).sort({replyStep: 1});
  
      searchComments[index]._doc.replyList = replyList;
      
      if(searchComments.length - 1 == index){
        console.log(searchComments);
    
        return res.status(200).json({
          success: true,
          searchComments
        })
      }

    })
  }else{

    return res.status(200).json({
      success: true,
      searchComments
    })
    
  }
})

/**
 * 댓글 수정 API
 * /community/comment/write
 * @method PUT
 * @param {string} commentId 댓글 ID
 * @param {string} user 댓글 작성자 ID
 * @param {string} password 댓글 작성자 PW
 * @param {string} content 댓글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.put("/write", async(req, res) => {
  const {commentId, user, password, content} = req.body;

  try{
    // 삭제된 댓글 제외.
    const authUser = await Comments.findOne(
      { _id:commentId
        , user
        , password
        , commentStatus: { $ne: 3}})

    if(authUser){
      const filter = {_id: commentId}
      const update = {content
                      , updateAt: new Date().YYYYMMDDHHMMSS()
                      // commentStatue : 2 -> 수정됨 상태
                      , commentStatus: 2}

      const updateStatus = await Comments.updateOne(filter, update)
      console.log(updateStatus)     
      
      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
            success: false,
            errorMessage: '해당 댓글에 권한이 없거나 비밀번호가 일치하지 않습니다. 또한 삭제된 경우 수정이 불가능합니다.'
    }))
  } catch(err){
    console.error(err);

    return (res.status(404).json({
      success: false,
      errorMessage: '잘못된 접근입니다.'
    }))
  }
})

/**
 * 댓글 삭제 API
 * /community/comment/delete
 * @method DELETE
 * @param {string} commentId 댓글 ID
 * @param {string} password 댓글 작성자 PW
 * @param {string} user 댓글 작성자 ID
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.delete("/delete", async(req, res) => {
  const {commentId, user, password} = req.body;

  try{
    // 삭제된 댓글 제외.
    const authUser = await Comments.findOne(
      { _id:commentId
        , user
        , password
        , commentStatus: { $ne: 3}})

    if(authUser){
      const filter = {_id: commentId}
      const update = {content: '삭제된 댓글입니다.'
                      , deleteAt: new Date().YYYYMMDDHHMMSS()
                      // commentStatue : 3 -> 삭제됨 상태
                      , commentStatus: 3}

      const updateStatus = await Comments.updateOne(filter, update)
      console.log(updateStatus)     
      
      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
            success: false,
            errorMessage: '해당 댓글에 권한이 없거나 비밀번호가 일치하지 않습니다. 또한 이미 삭제된 댓글일 가능성이 있습니다.'
    }))
  } catch(err){
    console.error(err);

    return (res.status(404).json({
      success: false,
      errorMessage: '잘못된 접근입니다.'
    }))
  }
})

/**
 * 답글 추가 API
 * /community/comment/reply/write
 * @method POST
 * @param {string} postId 게시판 ID
 * @param {string} parentComment 답글 대상 ID
 * @param {string} user 답글 작성자 ID
 * @param {string} password 답글 작성자 PW
 * @param {string} setp 부모 댓글 step
 * @param {string} content 답글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.post("/reply/write", async(req, res) => {

  // 작성일 new Date()
  // 댓글 상태 commentStatue -> 1
  // replyStep -> auto increment
  const {postId, parentComment, user, password, step, content} = req.body;

  // 검색된 답글 결과 갯수 
  // parentComment : 답글 대상 루트 ID
  // commentType [1] 댓글 [2] 답글
  const replyStep = await Comments.find({postId, parentComment, commentType: 2}).countDocuments()

  await Comments.create({
    postId
    // 루트 부모 ID
    , parentComment
    , user
    , password
    , content
    , createAt: new Date().YYYYMMDDHHMMSS()
    // 부모 step
    , step: Number(step)
    // 답글 step
    , replyStep: replyStep + 1
    , commentStatus: 1
    // [2] 답글
    , commentType: 2
  });

  return res.status(200).json({
    success: true
  })
})

/**
 * 답글 수정 API
 * /community/comment/reply/write
 * @method PUT
 * @param {string} postId 게시판 ID
 * @param {string} parentComment 부모 댓글 ID
 * @param {string} replyId 답글 ID
 * @param {string} user 답글 작성자 ID
 * @param {string} password 답글 작성자 PW
 * @param {string} content 답글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.put("/reply/write", async(req, res) => {
  const {postId, parentComment, replyId, user, password, content} = req.body;

  try{
    // 삭제된 댓글 제외.
    const authUser = await Comments.findOne(
      { _id:replyId
        , postId
        , parentComment
        , user
        , password
        , commentStatus: { $ne: 3}})

    if(authUser){
      const filter = {_id: replyId}
      const update = {content
                      , updateAt: new Date().YYYYMMDDHHMMSS()
                      // commentStatue : 2 -> 수정됨 상태
                      , commentStatus: 2}

      const updateStatus = await Comments.updateOne(filter, update)
      console.log(updateStatus)     
      
      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
            success: false,
            errorMessage: '해당 답글에 권한이 없거나 비밀번호가 일치하지 않습니다. 또한 삭제된 경우 수정이 불가능합니다.'
    }))
  } catch(err){
    console.error(err);

    return (res.status(404).json({
      success: false,
      errorMessage: '잘못된 접근입니다.'
    }))
  }
})

/**
 * 답글 삭제 API
 * /community/comment/reply/write
 * @method DELETE
 * @param {string} postId 게시글 ID
 * @param {string} parentComment 부모 댓글 ID
 * @param {string} replyId 답글 ID
 * @param {string} user 답글 작성자 ID
 * @param {string} password 답글 작성자 PW
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.delete("/reply/delete", async(req, res) => {
  const {postId, parentComment, replyId, user, password} = req.body;

  try{
    // 삭제된 댓글 제외.
    const authUser = await Comments.findOne(
      { _id:replyId
        , postId
        , parentComment
        , user
        , password
        , commentStatus: { $ne: 3}})

    if(authUser){
      const filter = {_id: replyId}
      const update = {content: "삭제된 답글입니다."
                      , deleteAt: new Date().YYYYMMDDHHMMSS()
                      // commentStatue : 3 -> 삭제됨 상태
                      , commentStatus: 3}

      const updateStatus = await Comments.updateOne(filter, update)
      console.log(updateStatus)     
      
      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
            success: false,
            errorMessage: '해당 답글에 권한이 없거나 비밀번호가 일치하지 않습니다. 또한 이미 삭제된 답글일 가능성이 있습니다.'
    }))
  } catch(err){
    console.error(err);

    return (res.status(404).json({
      success: false,
      errorMessage: '잘못된 접근입니다.'
    }))
  }
})

module.exports = router;