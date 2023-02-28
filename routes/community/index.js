const express = require('express');
const postRouter = require('./posts.route.js')
const commentRouter = require('./comments.route.js')

const router = express.Router()

router.use('/free',postRouter)
router.use('/comment',commentRouter)

module.exports = router