'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../schema/UserSchema');
const uuid = require('uuid').v4();
const email = require('./HtmlEmailSender');
const bcrypt = require('bcryptjs');



exports.loginPost = async (req, res, next)=>{
    req.sanitizeBody('email');
    req.sanitizeBody('password');
    let user = new User(req.body);
    let remember = req.body.status;
    const info = await User.findByInfo(user.email, user.password);
    if(info === null){
        res.json('no user found');
    } else{
       console.log('remember is ',remember);
        if(remember === 'on'){
            var hour = 3600000*60*60*60;
            req.session.cookie.maxAge = hour;
        } else{
            req.session.cookie.maxAge = 60*60*100;
        }
          req.session.user = info;
          
          res.redirect('/');
    }  

};





exports.registerPost = async (req, res, next)=>{

    let user = new User(req.body);
    const userCheck = await User.findOne({email: user.email});
    if(!userCheck){
    let info = await user.save();
    if(!info){
        res.json('error in registering');
    } else{
        let code = uuid;
        console.log(uuid);
        req.session.code = code;
       
        
        
        email.sendMail(info.email, 'set new pass',req.hostname, code, info._id);
        res.redirect('/verificationPage');
    }
} else{
    res.json('account already exists try another email');
}
   

};



exports.validateUser = function(req, res, next){
    try{
        req.sanitizeBody('username');
        req.sanitizeBody('email');
        req.sanitizeBody('password');
        req.checkBody('username','username cannot be empty').notEmpty();
        req.checkBody('email','email cannot be empty').notEmpty();
        req.checkBody('password', 'password cannot be empty or less than 6 charadter').isLength({min:6});
        req.checkBody('confirm-password', 'your password didnot matched').equals(req.body.password);

        let errors = req.validationErrors();
        if(errors){
        let error = errors.map(err=> err.msg);

        if(error){
            res.json(error);
        } else{
            next();
        }} else{next()}

    }catch(err){
        next(err);
    }
};




exports.Authorize = async (req, res, next)=>{

    if(req.session.user !== undefined){
    const user = await User.findBySession(req);
    if(!user || (user === null)){
        console.log('user session is', req.session.user);
        res.redirect('/login');
    } else{
        if(user.status === false){
            
            req.session.user = user;   
            res.redirect('/setNewPass');
        } else{
        req.user = user;
        next();
        }
    }} else{
        res.redirect('/login');
    }

};


exports.AuthorizeLogin = async (req, res, next)=>{
    
   const user = await User.findBySession(req);
   if(user == null){
       next();
   } else{
       res.redirect('/');
   }
};

exports.AuthorizeSetNewPass = async (req, res, next)=>{

    
    const user = await User.findBySession(req);
    if(user === null){
        console.log('user session is', req.session.user);
        res.redirect('/login');
    } else{
       
        req.user = user;
        next();
        
    }


};

exports.verificationPage = async (req, res, next)=>{
  
    if(req.query.q && req.query.u){
  const user = await User.findById(req.query.u);
  if(!user){
      res.json('error in verification');
  } else{
       req.session.setpass = "lala";
       req.session.user = user;   
       res.redirect('/setNewPass');
  }
    }else{
        res.json('verification failed');
    }

};



exports.setNewPassPost = async (req, res, next)=>{

    req.checkBody('password', 'password cannot be empty or less than 6 charadter').isLength({min:6});
        req.checkBody('confirm_password', 'your password didnot matched').equals(req.body.password);
let errors = req.validationErrors();
let error;
if(errors){
   error = errors.map(err => err.msg);
}
        if(error){
            res.json(error);
        }  else{
            bcrypt.genSalt(10, function(err, salt){
                if(err){
                    return Promise.reject();
                }
    
                bcrypt.hash(req.body.password, salt, async function(err, hash){
                    if(err){
                        console.log('error in enctyping password');
                        return Promise.reject();
                    }
                     
      
                   const pu = await User.findByIdAndUpdate(req.session.user._id, {password: hash}, {new : true});
                   if(!pu){
                       res.json('error in encrypting password');
                   } else{
                       await User.findByIdAndUpdate(req.session.user._id,{status: true});
                       req.session.user = null;
                       req.session.setpass = null;
                       res.redirect('/login');
                   }
                      });
    
            });
            
        }
    
};




exports.logout = async (req, res, next)=>{
    if(req.session.user){
        req.session.user = null;
    }

    res.redirect('/login');
};