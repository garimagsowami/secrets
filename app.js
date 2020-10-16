//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
 app.set("view engine", "ejs");
 app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-garima:goswami123@cluster0.hhzzr.mongodb.net/userDB>",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "thisisoursecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const user = new mongoose.model("user", userSchema);

 app.get("/", function(req, res){
   res.render("home");
 });

 app.get("/login", function(req, res){
   res.render("login");
 });

 app.post("/login", function(req, res){
   const username = req.body.username;
   const password = req.body.password;
   user.findOne({email: username}, function(err, foundUser){
     if(err){
       console.log(err);
     }else{
       if(foundUser){
         if(foundUser.password === password){
          res.render("secrets");
         }
       }
     }
   });
 });

 app.get("/register", function(req, res){
   res.render("register");
 });

 app.post("/register", function(req, res){
   const newUser = new user ({
     email: req.body.username,
     password: req.body.password
   });

   newUser.save(function(err){
     if(!err){
       res.render("secrets");
     }
     else{
       res.render(err);
     }
   });
 });


 app.get("/submit", function(req, res){
   res.render("submit");
 });


 let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started ");
});
