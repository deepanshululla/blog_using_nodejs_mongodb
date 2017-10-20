var express     = require("express"),
    router      = express.Router(),
    Blog        = require("../models/blog"),
    User        = require("../models/user"),
    middleware  = require("../middleware");    ;

// INDEX ROUTE
router.get("/", function(req,res){
    // Blog.find({},function(err,allBlogs){
    //     if(err){
    //         console.log(err);
            
    //     } else {
    //         console.log("GET /blogs");
            
    //         res.render("index",{blogs:allBlogs.reverse()});
    //     }
    // });
    return res.redirect("/blogs/pages/1");
});
// new route
router.get("/new",middleware.isLoggedIn, function(req, res) {
    console.log("GET /blogs/new");
    res.render("new");
});



// create route
router.post("/",middleware.isLoggedIn, function (req, res) {
    // sanitizing inputs
    req.body.blog.image= req.sanitize(req.body.blog.image);
    req.body.blog.title= req.sanitize(req.body.blog.title);
    //req.body.blog.body= req.sanitize(req.body.blog.body);
    var data=req.body.blog;
    
    
    Blog.create(data,function (err, newBlog) {
       if(err || !newBlog){
           console.log(err);
           res.render("new");
       } else {
           console.log("POST /blogs")
           User.findOne({email:process.env.AdminEmail}, function (err, foundUser) {
                if(err || !foundUser){
                    console.log(err);
                    req.flash("error","User not found");
                    
                } else {
                    data.author=foundUser;
                    foundUser.blogs.push(newBlog);
                    foundUser.save(function (err, data) {
                        if(err){
                            console.log(err);
                            req.flash("error","Something went wrong");
                            return res.redirect("/");
                        } else {
                            console.log(data);
                        }
                    });
                }
            });
           
           console.log("New blog post created with title: ", newBlog.title);
           //redirect to index
           req.flash("success","Successfully created blog post");
           
           return res.redirect("/blogs");
       }
    });
});

// Show route
router.get("/:id", function(req, res) {
    var blogId=req.params.id;
    Blog.findById(blogId, function(err, foundblog){
         if(err || !foundblog){
            console.log(err);
            req.flash("error","Can't find this blog");
            return res.redirect("back");
         }  else {
            
            console.log("GET /blogs/"+blogId);
            res.render("show",{blog:foundblog}); 
         }
    });
});

// Edit route
router.get("/:id/edit",middleware.isLoggedIn,function(req, res) {
    var blogId=req.params.id;
    Blog.findById(blogId, function(err, foundblog){
         if(err || !foundblog){
            console.log(err);
            req.flash("error","Can't find this blog");
            return res.redirect("back");
         }  else {
            console.log("GET /blogs/"+blogId+"/edit");
            res.render("edit",{blog:foundblog}); 
         }
    });
    
});
// Update route
router.put("/:id",middleware.isLoggedIn, function (req,res) {
    var blogId=req.params.id;
    req.body.blog.image= req.sanitize(req.body.blog.image);
    req.body.blog.title= req.sanitize(req.body.blog.title);
    //req.body.blog.body= req.sanitize(req.body.blog.body);
    var newData=req.body.blog;
    console.log("PUT /blogs/"+blogId);
    Blog.findByIdAndUpdate(blogId, newData, function(err, updatedBlog){
        if(err || !updatedBlog){
            console.log(err);
            req.flash("error","Can't update this blog");
            return res.redirect("back");
        } else {
            return res.redirect("/blogs/"+blogId);
        }
    })
});
// Delete route
router.delete("/:id",middleware.isLoggedIn, function (req,res) {
    var blogId=req.params.id;
    console.log("DELETE /blogs/"+blogId);
    Blog.findByIdAndRemove(blogId, function(err){
        if(err || !blogId){
            console.log(err);
            req.flash("error","Can't find this blog");
            return res.redirect("back");
        } else {
            return res.redirect("/blogs/pages/1");
        }
    })
});


// =============
// paginate
// ===========
router.get("/pages/:page_id", function(req,res){
    var page_id;
    if(!req.params.page_id){
        page_id=1;
    } else {
        page_id=Number(req.params.page_id);
    }
    if(page_id<1){
        page_id=1;
    }
    Blog.paginate({}, { page: page_id, limit: 5 ,sort:{created:'desc'}}, function(error, paginatedResults) {
      if (error) {
        console.error(error);
      } else {
        //  eval(require("locus"));
        if(page_id<1 || page_id>Number(paginatedResults.pages)){
            req.flash("error","Invalid page Number");
            return res.redirect("back");
        }
        // console.log(paginatedResults);
        if(Number(paginatedResults.pages)<=1){
            return res.render('index',{
			blogs:paginatedResults.docs,
			isPaginate:false,
			currentPage:1,
			prevPage:1,
			nextPage:1,
			numPages:1
			
		});

        }
        res.render("index",{
            blogs:paginatedResults.docs,
            numPages:paginatedResults.pages, 
            currentPage:page_id,
            isPaginate:true,
            prevPage:(page_id-1).toString(),
            nextPage:(page_id+1).toString(),
            
        });
      }
    });
    
});

router.get('*',function(req,res){
     return res.render('error');
});
module.exports = router;
