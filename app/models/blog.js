var mongoose= require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var blogSchema = new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created: {type: Date, default: Date.now},
   
});
blogSchema.plugin(mongoosePaginate);
var Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;