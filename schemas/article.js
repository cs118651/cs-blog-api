const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: String,
  content: String,
  picUrl: String,
  pv: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

ArticleSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

const pageSize = 4;

// 定义静态方法
ArticleSchema.statics = {
  fetch: function(cb) {
    // 去除所有数据 按更新时间排序 最新的在最前
    return this
          .find({})
          .sort({"meta.updateAt": -1})
          .exec(cb);
  },
  findById: function (id, cb) {
    // 根据ID来查找单条数据
    return this
        .findOne({_id: id})
        .exec(cb);
  },
  getMainPage: function (cb) {
    // 取出最新的四条数据
    return this
        .find({})
        .sort({"meta.updateAt": -1})
        .limit(pageSize)
        .exec(cb);
  },
  findPage: function (nextPage, cb) {
    // 分页功能
    return this
        .find({})
        .sort({"meta.updateAt": -1})
        .skip(pageSize*(nextPage - 1))
        .limit(pageSize)
        .exec(cb)
  }
};

module.exports = ArticleSchema;