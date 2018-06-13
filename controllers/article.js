const ArticleModel = require('../models/article');
const _ = require('underscore');

exports.getList = function(req, res, next) {
  let articleSum = null;

  ArticleModel.fetch(function(err, articles) {
    articleSum = articles.length;

    ArticleModel.getMainPage(function(err, articles) {
			if (err) {
				console.error(err);
				res.status(500).send({
					"message": "暂时无法获取文章信息!"
				});
			} else {
        res.status(200).send({
          articleSum: articleSum,
          articles: articles
        });
      }
    });
  });
}

exports.getDetail = function(req, res, next) {
  const articleId = req.query.articleId;

  ArticleModel.update({_id: articleId}, {$inc: {pv: 1}}, function(err) {
    if (err) {
      console.error(err);
    }
  });

  ArticleModel.findById(articleId, function(err, article) {
    if (err) {
      console.error(err);
      res.status(500).send({
        "message": "暂时无法获取文章详细信息!"
      });
    } else {
      res.status(200).send({
        article: article
      });
    }
  })
}

exports.getPage = function(req, res, next) {
  let nextPage = req.body.nextPage;
  let articleSum = null;
  ArticleModel.fetch(function(err, articles) {
    articleSum = articles.length;

    if (nextPage <= Math.ceil(articleSum / 4)) {
      ArticleModel.findPage(nextPage, function(err, articles) {
				if (err) {
					console.error(err);
					res.status(500).send({
						"message": "页数不正确!"
					});
				} else {
          res.status(200).send({
            currentPage: nextPage,
            articleSum: articleSum,
            articles: articles
          });
        }
      });
    } else {
      res.status(500).send({
        "message": "页数不正确!"
      })
    }
  });
}

exports.new = function(req, res, next) {
  // 更新或者发布文章

  const articleObj = req.body;
  const articleId = articleObj.articleId;
  let _article;

  if (articleId !== 'undefined') {
    // Id不为undefined 说明是更新文章
    ArticleModel.findById(articleId, function(err, article) {
      if (err) {
        console.error(err);
        res.status(500).send({
          "message": "文章存储出错!"
        });
      } else {
        _article = _.extend(article, articleObj);
        _article.save(function(err, article) {
          if (err) {
            console.error(err);
            res.status(500).send({
              "message": "文章存储出错!"
            });
          } else {
            res.status(200).send({
              "message": "成功更新文章!"
            });
          }
        });
      }
    })
  } else {
    // 新增文章
    _article = new ArticleModel({
      title: articleObj.title,
      content: articleObj.content,
      picUrl: articleObj.picUrl
    });

    _article.save(function(err, article) {
      if (err) {
				console.error(err);
				res.status(500).send({
					"message": "文章存储出错!"
				});
      } else {
        res.status(200).send({
          "message": "成功发布文章!"
        })
      }
    })
  }
};