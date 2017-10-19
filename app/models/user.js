var mongoose= require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
// USer-email,name,password, blogs
var UserSchema = new mongoose.Schema({
   email: { type: String, required: true, index: { unique: true } },
   fullname: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String},
   blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
       ]
});
// provides additional methods for authentication
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);