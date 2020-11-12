const express = require('express');
const bodyParser = require('body-parser');
const app=express();
const ejs = require('ejs');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/donorsDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
//*******************donor list schema is here below*********************************
const donorSchema={
  name:String,
  contactNo:Number,
  bloodGroup:String,
  gender:Boolean,
  emailAdress:String,
  city:String,
  state:String,
  pin:Number,
  dateOfBirth:Date
}
//**********************************************************************

//***************************this is the donor collection**************
const Donor=mongoose.model("Donor",donorSchema);
/*this is a sample object for donor list*/
// const donor1=new Donor({
//   name:"yush",
//   contactNo:1234567890,
//   bloodGroup:"b+",
//   gender:1,
//   emailAdress:"abc@xyz.com",
//   city:"new delhi",
//   state:"delhi",
//   pin:110087,
//   dateOfBirth:'2002-12-09'
//
// })
// // donor1.save();
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
app.post("/signup",function(req,res){
  console.log(req.body.dob);
  const ans=req.body;
  let sex;
  if(ans.department[1]==="Male"){
    sex=true;
  }
  else sex=false;
  const donorNew= new Donor({
    name:ans.first_name+" "+ans.last_name,
    contactNo:ans.contact_no,
    bloodGroup:ans.department[0],
    gender:sex,
    dateOfBirth:ans.dob,
    emailAdress:ans.email,
    city:ans.city,
    state:ans.state,
    pin:ans.pin,
  });
  donorNew.save();
  res.send("success");
})
app.get("/aboutus",function(req,res){
  res.render("aboutus",{pageTitle:"about us"})
})
app.get("/donorlist",function(req,res){
  Donor.find({},function(err,results){
    if(!err){
      console.log(results[2]);
      res.render("donorlist0",{pageTitle:"donor list",results:results});
    }
  })
})

app.listen(process.env.PORT||3000,function(){
  console.log("working on port 3000");
});
