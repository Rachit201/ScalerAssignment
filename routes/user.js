const express = require('express');
const router = express.Router();
const url = require('url');
const debug = require('debug')('app:admins')
const { User } = require('../models/user');
const { Interview } = require('../models/interview');
let added = "";

/*
router.get('/listUsers',async(req,res)=>{
    try{
        const list = await User.find().sort({name:1});
        const resumeDir = url.pathToFileURL((__dirname + "/../data/resumes/")).href;
        res.render('listUsers',{list,resumeDir:resumeDir});
    }catch(err){
        debug('Could not fetch Users list');
        debug(err);
        return res.status(500).send(err);
    }
});*/

router.get('/listUsers',async(req,res)=>{
    try{
        const list = await User.find().sort({name:1});
        const resumeDir = url.pathToFileURL((__dirname + "/../data/resumes/")).href;
        res.render('listUsers',{list,resumeDir:resumeDir});
    }catch(err){
        debug('Could not fetch Users list');
        debug(err);
        return res.status(500).send(err);
    }
});



router.get('/new',async(req,res)=>{
    res.render('newUser',{'error':added});
    added = "";
});


router.get('/',async(req,res)=>{
    res.render('welcome');
});

router.get('/*',(req,res)=>{
    res.redirect('/user/');
});

/*
router.post('/new',async(req,res)=>{
    console.log(req.body);
    const newAdmin = new Admin({
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email
    });
    try{
        const result = await newAdmin.save();
        added = "Admin added to the Database"
    }catch(err){
        debug(err.message);
        added = err.message;
    }
    return res.redirect('/admin/new/');
});*/

router.post("/new",async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        added = 'No files were uploaded.';
        return res.redirect("/user/new");
    }
    debug(req.files);
    try {
        const resumeID = await fileUpload(req);
        debug("ID IS = ",resumeID);
        const newUser = new User({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            resumeID: resumeID
        });
        const result = await newUser.save();
        debug("new object - ",result);
        added = "User Added to the database";
        debug(added);
    } catch (err) {
        debug("caught - ",err.message);
        added = err.message;
    }
    return res.redirect("/user/new");
});

async function fileUpload(req){
    const Resume = req.files.resumeC;
    const path = __dirname + "/../data/resumes/" + Resume.md5;
    debug('file uploaded');
    try{
        const result = await Resume.mv(path);
        debug('upload successful');
        return Resume.md5;
    }catch(err){
        debug('could not move file');
        debug(err);
        throw err;
    }            
}

module.exports = router;