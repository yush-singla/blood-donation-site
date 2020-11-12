const express = require('express');
const bodyParser = require('body-parser');
const app=express();
const ejs = require('ejs');

app.set("view engine","ejs");
app.use(express.static("public"));
app.get("/",function(req,res){
  res.render("home",{pageTitle:"home page"});
})
app.get("/signin",function(req,res){
  res.render("signin",{pageTitle:"Sign In Page"});
})
app.get("/signup",function(req,res){
  res.render("signup");
})
app.get("/aboutus",function(req,res){
  res.render("aboutus",{pageTitle:"about us"})
})
app.get("/donorlist",function(req,res){
  res.render("donorlist0",{pageTitle:"donor list"});
})

app.listen(process.env.PORT||3000,function(){
  console.log("working on port 3000");
});
