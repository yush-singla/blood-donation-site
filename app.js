const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//twilio info in 3 lines from here
const accountSid =process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//nodemailer info is here
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bloodforyou5@gmail.com',
    pass: "aprsy@12345"
  }
});


const ejs = require('ejs');
const mongoose = require("mongoose");
const alert = require('alert');
mongoose.connect("mongodb+srv://admin-yush:yushajay1@cluster0.x2h7y.mongodb.net/donorsDB?retryWrites=true&w=majority
", {
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


//*****************this is the otp schema for verifying otp***********
const otpSchema={
  phoneNo:Number,
  otpPhone:Number,
  email:String,
  otpEmail:Number
}


const Otp=mongoose.model("otp",otpSchema);





app.set("view engine", "ejs");

app.use(express.static("public"));


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}








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


app.get("/delete/:email",function(req,res){
  const email=req.params.email;
  Person.findOneAndRemove({email:email},function(err){
    Donor.findOneAndRemove({emailAdress:email},function(err){
      Otp.findOneAndRemove({email:email},function(err){
        res.send("wiped out everything");
      })
    })
  })
})



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
                else if(valid===1&& ans.user_password.length<=5){
                  valid =0;
                  alert("password must be more than 5 characters");
                  res.redirect("/signup");
                }
                else if (valid===1 && ans.user_password != ans.confirm_password) {
                  valid = 0;
                  alert("password and confirm password donot match plz try again",valid);
                  res.redirect("/signup");
                }
                else if(valid===1 && getAge(ans.dob)<=12){
                  valid=0;
                  alert("you must be older than 12 sorry")
                  res.redirect("/signup");
                }
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
                   const randOtp1=Math.floor(1000 + Math.random() * 9000);

                  client.messages
                    .create({
                       body: 'your otp is'+randOtp1,
                       from: '+19378216745',
                       to: '+91'+ans.contact_no
                     })
                    .then(message => console.log(message.sid));

                    const randotp2=Math.floor(1000 + Math.random() * 9000);

                    var mailOptions = {
                      from: 'bloodforyou5@gmail.com',
                      to: ans.email,
                      subject: 'We have your otp for verification',
                      text: 'your Otp is '+randotp2
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });

                    const newOtp=new Otp({
                      phoneNo:ans.contact_no,
                      otpPhone:randOtp1,
                      email:ans.email,
                      otpEmail:randotp2
                    });
                    newOtp.save();

                   res.redirect("/otp");
                 }
                /*
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
                 */
              });

            }
          });
        }

    });
  }




})








app.get("/otp",function(req,res){
  res.render("otp",{pageTitle: "Otp verification"})
});

app.post("/otp",function(req,res){
  const ans=req.body;
  const mobileNo=ans.mobileNo;
  const email=ans.email;
  console.log(ans.mobotp,ans.emailotp);
  Otp.findOne({phoneNo:mobileNo,email:email},function(err,result){
    if(result){
      console.log(result.otpEmail,result.otpPhone);
      if(ans.mobotp==result.otpPhone && ans.emailotp==result.otpEmail){
        Otp.findOneAndRemove({phoneNo:mobileNo},function(err){
          console.log(err);
          res.render("signinAfterSignupPage",{pageTitle:"welcome"});
        });
      }
      else{
        Person.findOneAndRemove({email:email},function(err){
          if(!err){
            Donor.findOneAndRemove({contactNo:mobileNo},function(err){
              if(!err){
                res.send("otp is not valid");
              }
            });
          }
        });
      }
    }
  });
});











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
  Otp.deleteMany({},function(err){
    res.render("donorReceiverPage",{
      pageTitle:"welcome"
    });
  })
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
});
