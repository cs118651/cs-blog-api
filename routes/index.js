const router = require('express').Router();
const mongoose = require('mongoose');
const Article = require('../controllers/article')

const DB_URL = 'mongodb://localhost/CS-ONE';

// 连接数据库
mongoose.connect(DB_URL);

// CORS
router.all('*', function(req, res, next) {
  let currentReqHostName = req.hostname;
  if (currentReqHostName === 'api.timrchen.site') {
      res.header("Access-Control-Allow-Origin", 'http://www.cs1997.cn');
  } else if (currentReqHostName === '127.0.0.1') {
      res.header("Access-Control-Allow-Origin", 'http://' + currentReqHostName + ':8080');
  }
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");  
  next();
});

router.get('/api/essay/list', Article.getList);

module.exports = router;