const express = require('express')
const app = express();
const port = 3000;

const communityRouter = require("./routes/community")
const morgan = require("morgan")

const connect = require("./schemas")
connect();

app.use(express.json())

app.use("/community", communityRouter)
app.use(morgan(`dev`));

app.get('/', (req, res) => {
  res.send('api만 제공하는 서버입니다. 현재 경로에 /community 를 붙여 api를 사용해주세요.');
})

app.listen(port, () => {
  console.log('localhost:'+port, 'server started')
})