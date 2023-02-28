const express = require("express")
const router = express.Router();

const {Date} = require("../../modules/common.js")

const Posts = require("../../schemas/post.js")

/**
 * 게시글 작성 API
 * /community/free/write
 * @method POST
 * @param {string} password 게시글 추가/수정/삭제 비밀번호
 * @param {string} user 게시글 작성자 ID
 * @param {string} title 게시글 제목
 * @param {string} content 게시글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.post("/write", async(req, res) => {
  const {password, user, title, content} = req.body;

  await Posts.create({
    password
    , user
    , title
    , content
    , createAt : new Date().YYYYMMDDHHMMSS()
    , postStatus : 1 
  });

  return res.status(200).json({
    success: true
  })
})

/**
 * 게시글 전체 조회 API
 * /community/free/list
 * @method GET
 * @param {string} search 게시글 제목/내용 검색어
 * @return {json(objectArray)} [{게시글 정보}, ...] 
 */
router.get("/list", async(req, res) => {
  const {search = null} = req.query
  let searchPost = {};

  if(search){
    // 검색어 존재.
    // or -> OR연산, $regex -> 내용 중 일치하는 글, $options: "i" -> 대소문자 구분X 
    searchPost = await Posts.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }).sort({createAt: -1});
  }else{
    // 검색어 없음.
    searchPost = await Posts.find({});
  }

  return res.status(200).json({
    success: true,
    posts: searchPost
  })
})

/**
 * /community/free/view
 * 게시글 상세 조회 API
 * @method GET
 * @param {string} postId 게시글 ID
 * @return {json(object)} 게시글 정보 {user, title, content, createAt, updateAt, postStatus}
 */
router.get("/view/:postId", async(req, res) => {
  const {postId} = req.params;

  const searchPost = await Posts.findOne({ _id: postId })

  return res.status(200).json({
    success: true,
    posts: searchPost
  })
})

/**
 * 게시글 수정 API
 * /community/free/write
 * @method PUT
 * @param {string} postId 게시글 ID
 * @param {string} password 게시글 비밀번호
 * @param {string} user 게시글 작성자
 * @param {string} title 게시글 비밀번호
 * @param {string} content 게시글 내용
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.put("/write", async(req, res) => {
  const {postId, password, user, title, content} = req.body;

  // 게시글 ID에 작성자, 비밀번호가 일치하는지 확인
  try{
    const authUser = await Posts.findOne({_id:postId, user, password})

    if(authUser){
      const filter = { _id: postId }
      const update = {title
                      , content
                      , updateAt: new Date().YYYYMMDDHHMMSS()
                      , postStatus: 2}
    
      const updateStatue = await Posts.updateOne(filter, update)
      console.log(updateStatue);

      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
      success: false,
      errorMessage: '해당 게시글에 권한이 없거나 비밀번호가 일치하지 않습니다.'
    }))
  } catch (err) {
    console.error(err);

    return (res.status(404).json({
      success: false,
      errorMessage: '잘못된 접근입니다.'
    }))
  }
})

/**
 * 게시글 삭제 API
 * /community/free/delete
 * @method DELETE
 * @param {string} postId 게시글 ID
 * @param {string} password 게시글 비밀번호
 * @param {string} user 게시글 작성자
 * @return {json(object)} 성공여부 { success : true/false }
 */
router.delete("/delete", async(req, res) => {
  const {postId, password, user} = req.body;

  // 게시글 ID에 작성자, 비밀번호가 일치하는지 확인
  try{
    // 이후 서비스단에서 이와 같은 비즈니스 로직 정리
    const authUser = await Posts.findOne({_id:postId, user, password})

    if(authUser){
      const filter = { _id: postId }
    
      const deleteStatue = await Posts.deleteOne(filter)
      console.log(deleteStatue);

      return (res.status(200).json({
        success: true
      }))
    }

    return (res.status(403).json({
      success: false,
      errorMessage: '해당 게시글에 권한이 없거나 비밀번호가 일치하지 않습니다.'
    }))
  } catch (err) {
    console.error(err);

    return (res.status(403).json({
      success: false,
      errorMessage: '해당 게시글에 권한이 없거나 비밀번호가 일치하지 않습니다.'
    }))
  }
})

module.exports = router;