'use strict';

const express = require('express');
const router = express.Router();
const email = require('./controller/HtmlEmailSender');
const auth = require('./controller/Auth');
const page = require('./controller/pages');
const {  catchErrors } = require('./ErrorHandler');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('./schema/UserSchema');

router.get('/', auth.Authorize, (req, res, next)=>{
 res.render('home');
});


//GET Request
router.get('/login', auth.AuthorizeLogin, page.login);
router.get('/register', auth.AuthorizeLogin, page.register);
router.get('/setNewPass',auth.AuthorizeSetNewPass, page.setNewPass);
router.get('/verification',  auth.verificationPage);
router.get('/verificationPage', (req, res, next)=>{
  let id = null;
  if(req.session.user != undefined){
      id = req.session.user._id;
  }
  req.session.setpass = "lala";
    res.render('verification', {id: id, host: req.hostname});
});

router.get('/delete/:id', async function(req, res, next){
    if(req.params.id){
       const user = await User.findByIdAndDelete(req.params.id);
       if(!user){
         res.json('error deleting account');
       } else{
         req.session.user = null;
         res.redirect('/register');
       }
    }
});


router.get('/setPass', (req, res)=>{
   req.session.setpass = "lala";
   res.redirect('/setNewPass');
});
router.get('/logout', auth.logout);



//PostMethods
router.post('/login', auth.AuthorizeLogin, auth.loginPost);
router.post('/register',auth.AuthorizeLogin, auth.validateUser, auth.registerPost);
router.post('/setNewPass', auth.AuthorizeSetNewPass, auth.setNewPassPost);


module.exports = router;