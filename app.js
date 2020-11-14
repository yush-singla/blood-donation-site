const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const ejs = require('ejs');
const mongoose = require("mongoose");
const alert = require('alert');
mongoose.connect("mongodb://localhost:27017/donorsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));
//*******************donor list schema is here below*********************************
const donorSchema = {
  name: String,
  contactNo: Number,
  bloodGroup: String,
  gender: Boolean,
  emailAdress: String,
  city: String,
  state: String,
  pin: Number,
  dateOfBirth: Date
}
//**********************************************************************

//***************************this is the donor collection**************
const Donor = mongoose.model("Donor", donorSchema);
/*this is a sample object for donor list*/
/*
const donor1=new Donor({
  name:"yush",
  contactNo:1234567890,
  bloodGroup:"b+",
  gender:1,
  emailAdress:"abc@xyz.com",
  city:"new delhi",
  state:"delhi",
  pin:110087,
  dateOfBirth:'2002-12-09'

})
// donor1.save();*/

//***********************this is the database for signin and signup info of people
const signinSchema = {
  details: donorSchema,
  email: String,
  username: String,
  password: String
}


const Person = mongoose.model("Person", signinSchema);





app.set("view engine", "ejs");

app.use(express.static("public"));




app.get("/", function(req, res) {
  res.render("home", {
    pageTitle: "home page"
  });
})





app.get("/signin", function(req, res) {
  res.render("signin", {
    pageTitle: "Sign In Page"
  });
})


app.post("/signin",function(req,res){
  const ans=req.body;
  console.log(ans);
  Person.findOne({email:ans.email},function(err,results){
    console.log(results);
    if(!results){
      console.log("your email is nt registered with us ");
      res.send("email not there");
    }
    else if(results.password!=ans.password){
        console.log("you have enetered a wrong password");
        res.send("password is wrong");
    }
    else{
      res.redirect("/donorreceiverpage");
    }
  });
});




app.get("/signup", function(req, res) {
  res.render("signup");
})





var check = 1;
app.post("/signup", function(req, res) {
  const ans = req.body;
  //********verifying data for duplicacy and genuinity****************
/*
  //1. phone no is 10 digits
  if (check===1 && (ans.contact_no / 1000000000 >= 10 || ans.contact_no / 1000000000 <1 )) {
    console.log("Invalid phone no! Plz fill it correctly");
    check = 0;
    console.log(check);
  }
  console.log(check);
  //*********************check if username is available or already used up************
  if (check==1) {
    Person.findOne({username: ans.user_name}, function(err, results) {
      if (results) {
        console.log("came here also");
        check = 0;
        console.log("set valid false and am here");
        console.log("the username is already taken by someone else try something else");

      }
    });
  }
console.log(check);
  //***************check if the phone no and the email are not already used
  if (check===1) {
    Donor.findOne({ emailAdress: ans.email }, function(err, result) {
      if (result) {
        check = 0;
        console.log("email is already in use");
      }
    });
    Donor.findOne({ contactNo: ans.contact_no }, function(err, result) {
      if(result){
        check = 0;
        console.log("phone no is already in use");
    }
    });
  }
  //**************password and confirm password are same or not**********
  if (check===1 && ans.user_password != ans.confirm_password) {
    check = 0;
    console.log("password and confirm password donot match plz try again");

  }
  if (check===0) {
    console.log("come here");
    res.redirect("/signup");
  }*/
  var valid=1;
  if (valid===1 && (ans.contact_no / 1000000000 >= 10 || ans.contact_no / 1000000000 <1 )) {
    valid = 0;
    alert("Invalid phone no! Plz fill it correctly",valid);
    res.redirect("/signup");
  }
  if (valid==1) {
    Person.findOne({username: ans.user_name}, function(err, results) {
      if (results) {
        valid = 0;
        alert("the username is already taken by someone else try something else",valid);
        res.redirect("/signup");
      }
      else if (valid===1) {
          Donor.findOne({ emailAdress: ans.email }, function(err, result) {
            if (result) {
              valid = 0;
              alert("email is already in use",valid);
              res.redirect("/signup");
            }
            else{
              Donor.findOne({ contactNo: ans.contact_no }, function(err, result) {
                if(result){
                  valid = 0;
                  alert("phone no is already in use",valid);
                  res.redirect("/signup");
                }

                else if (valid===1 && ans.user_password != ans.confirm_password) {
                  valid = 0;
                  alert("password and confirm password donot match plz try again",valid);
                  res.redirect("/signup");
                }
                // alert("now decision is valid is ",valid);
                else if (valid===1&&(ans.pin/100000>=10||ans.pin/100000<1)) {
                  alert("pin is inalid sorry enter it again");
                  res.redirect("signup");
                }
                else {

                   let sex;
                   if (ans.department[1] === "Male") {
                     sex = true;
                   } else sex = false;

                   //**********getting all the info from the user to be fed to the database after verifying*****
                   const donorNew = new Donor({
                     name: ans.first_name + " " + ans.last_name,
                     contactNo: ans.contact_no,
                     bloodGroup: ans.department[0],
                     gender: sex,
                     dateOfBirth: ans.dob,
                     emailAdress: ans.email,
                     city: ans.city,
                     state: ans.state,
                     pin: ans.pin,
                   });
                   donorNew.save();
                   const newPerson = new Person({
                     details: donorNew,
                     email: ans.email,
                     username: ans.user_name,
                     password: ans.user_password,
                   });
                   newPerson.save();

                   res.render("signinAfterSignupPage", {
                     pageTitle: "Sign In Page"
                   });
                 }
              });

            }
          });
        }

    });
  }


})
app.get("/aaa",function(req,res){
  res.render("signinAfterSignupPage", {
    pageTitle: "Sign In Page"
  });
});
// app.get("/aa",function(req,res){
//   res.render("donorReceiverPage",{
//     pageTitle:"welcome"
//   });
// });
app.get("/donorreceiverpage",function(req,res){
  res.render("donorReceiverPage",{
    pageTitle:"welcome"
  });
});
app.get("/aboutus", function(req, res) {
  res.render("aboutus", {
    pageTitle: "about us"
  })
})
app.get("/donorlist", function(req, res) {
  Donor.find({}, function(err, results) {
    if (!err) {
      res.render("donorlist0", {
        pageTitle: "donor list",
        results: results
      });
    }
  })
})

app.listen(process.env.PORT || 3000, function() {
  console.log("working on port 3000");
  var datetime = new Date();

});
