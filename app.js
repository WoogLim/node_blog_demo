const express = require('express')
const app = express();
const port = 3000;

const communityRouter = require("./routes/community")
const morgan = require("morgan")

const connect = require("./schemas")
connect();

app.use(express.json())

app.use(morgan('dev'));
app.use("/community", communityRouter)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.listen(port, () => {
  console.log('localhost:'+port, 'server started')
})