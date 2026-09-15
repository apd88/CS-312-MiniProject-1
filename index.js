const express = require("express");
const app = express();
const port = 3000;


var posttime = new Date().toLocaleString();
//since we dont need to  save anything to a database or between sessions, 
// we can just shove it into an array and call it good
var posts = [

];

app.set("view engine", "ejs");
//i named my folder view instead of views so this will make it look at view 
app.set("views", "./view");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//home page
    //shows index.ejs, which is the home page
    //also puts the posts in the array on the home page
app.get("/", function (req, res) {
    res.render("index", { posts: posts });
    });

//new post page
app.get("/new", function (req, res) {
    res.render("new");
});

//creating new post
//when the form on the new page post is submitted, it will take that and save it into a new post in the array
app.post("/posts", function (req, res) {
 
  
    var addpost = {
        //give post an id, and get the title/content from the form
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content, 
        created: posttime //maybe rename this idk
        };
        posts.push(addpost);

        res.redirect("/");
    });
 
//  view an individual post
app.get("/posts/:id", function (req, res) {
 
    //turn the id from the post into a number 
    var targetid = parseInt(req.params.id);
 
    //look for the id with a loop that goes through all posts
    var apost = null;
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === targetid) {
            apost = posts[i];
        }
    }
 
    if (apost === null) {
        res.status(404).send("Sorry, we were unable to find that post! :(");
        return;
    }

    res.render("post", { post: apost });
});

//edit post page
app.get("/posts/:id/edit", function (req, res) {
 
    var targetid = parseInt(req.params.id);
 
    var apost = null;
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === targetid) {
            apost = posts[i];
        }
    }
 

    if (apost === null) {
        res.status(404).send("Sorry that post was not found");
        return;
    }
    res.render("edit", { post: apost });
});
 


// save edited post page
app.post("/posts/:id/edit", function (req, res) {
 
    var targetid = parseInt(req.params.id);
 
    //find the post
    var apost = null;
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id == targetid) {
            apost = posts[i];
        }
    }
 
    if (apost === null) {
        res.status(404).send("Sorry, we were unable to find that post! :(v");
        return;
    }
 
    //update with the new info, then we redirect back to home page
    apost.title = req.body.title;
    apost.content = req.body.content;
 
    res.redirect("/");
});



 

// 
app.post("/posts/:id/delete", function (req, res) {
 
    var targetid = parseInt(req.params.id);
 
    //find position of the post in the arrayu
    var remove = -1;
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === targetid) {
            remove = i;
        }
    }
 
    // error code for if it is not found
    if (remove === -1) {
        res.status(404).send("Sorry, we were unable to find that post! :(");
        return;
    }
 
    // remove it
    posts.splice(remove, 1);
 
    // redirect to home page
    res.redirect("/");
});


//start server

app.listen(port, function () {
    console.log("Currently running on http://localhost:" + port);
});
