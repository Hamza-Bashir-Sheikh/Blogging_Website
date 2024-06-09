const express = require("express");
const userModel = require("./model/userModel");
const categoryModel = require("./model/category");
const bcrypt = require('bcrypt');
const postModel= require('./model/postModel');
const fs = require('fs');
const path = require('path');
const multer =require('multer');
require("./database");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const storage= multer.diskStorage({
      destination:(req, file, cb)=>{
        cb(null, 'uploads');
      },
      filename:(req, file, cb)=>{
          cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname))
      }
});

const upload=multer({
  storage:storage
});

app.post('/add-post', upload.single('image'),async (req,res)=>{
try{

  const data={
    title:req.body.title,
    description:req.body.desc,
    keywords:req.body.keywords,
    category:req.body.cat_name,
    image:{
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType:req.file.mimetype
    }
    
  }
  const post = await postModel.create(data);
  console.log(post);
  res.send("Post Added");
}catch(error){
  res.send(error);
}
})
app.get("/", (req, res) => {
  res.render("client/index.ejs");
});

app.get("/admin-login", (req, res) => {
  res.render("login/login.ejs");
});

app.get("/forget", (req, res) => {
  res.render("login/forgetpassword.ejs");
});

app.post("/post-login", async (req, res) => {
  try {
    const check = await userModel.findOne({
      email: req.body.email,
    });
    if (!check) {
      res.send("User Not Found!");
      return;
    }
    const isPasswordMatch = await bcrypt.compare
    (req.body.password , check.password);
    if (isPasswordMatch) {
      res.redirect("/dashboard");
    } else {
      res.send("Wrong Password");
    }
  } catch (error) {
    res.send(error);
  }
});

app.post("/add-cat", async (req, res) => {
  const data = {
    name: req.body.cat_name,
  };
  // Check if the username already exists in the database
  const existingCat = await categoryModel.findOne({ name: data.name });
  if (existingCat) {
    res.send("Cat already exists. Please choose a different name.");
  } else {
    const catdata = await categoryModel.insertMany(data);
    console.log(catdata);
    res.send("Category Added");
  }
});
app.post('/add-user',async(req,res)=>{
  const data = {
    fullname:req.body.fullname,
    email:req.body.email,
    contact:req.body.contact,
    password:req.body.password,
    role:req.body.role
  };
  //Check if the username already exists in the database
  const existingUser = await userModel.findOne({ email: data.email });
  if (existingUser) {
    res.send("User already exists. Please choose a different name.");
  } else {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    const userdata = await userModel.insertMany(data);
    console.log(userdata);
    res.send("User Added");
  }
});


app.post("/forgot-pass", (req, res) => {
  res.redirect("/admin-login");
});

app.get("/about", (req, res) => {
  res.render("client/about-us.ejs");
});

app.get("/contact", (req, res) => {
  res.render("client/contact.ejs");
});

app.get("/postdetails", (req, res) => {
  res.render("client/post-details.ejs");
});

app.get("/dashboard", (req, res) => {
  res.render("admin/dashboard.ejs");
});

app.get("/category",async (req, res) => {
  try{
    const fetch=await categoryModel.find();
    res.render("admin/category.ejs",{fetch});
  }catch(error){
    res.send(error);
  }
 // res.render("admin/category.ejs");
});

app.get("/addblog",async (req, res) => {
  try{
    const fetch=await categoryModel.find();
    res.render("admin/addBlog.ejs",{fetch});
  }catch(error){
    res.send(error);
  }

});

app.get("/viewblog", (req, res) => {
  res.render("admin/viewblog.ejs");
});

app.get("/adduser", (req, res) => {
  res.render("admin/addUser.ejs");
});

app.get("/userprofile", (req, res) => {
  res.render("admin/userProfile.ejs");
});

app.get("/viewuser", (req, res) => {
  res.render("admin/viewUser.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
