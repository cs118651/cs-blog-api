const router = require('express').Router();

router.all('*', function(req, res, next) {
  res.send('asas')
  next();
})

module.exports = router;