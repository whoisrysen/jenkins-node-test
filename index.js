//importing node framework
var express = require("express");
 
//Respond with "hello world" for requests that hit our root "/"
var app = express();
//listen to port 3000 by default
app.get("/", function (req, res) {
    res.send("hello world");
});
app.listen(process.env.PORT || 3000);
 
module.exports = app;