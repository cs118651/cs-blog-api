const mongoose = require('mongoose');
const ArticleSchema = require('../schemas/article');
const ArticleModel = mongoose.model('ArticleModel', ArticleSchema);

module.exports = ArticleModel;