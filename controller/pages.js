'use strict';
const User = require('../schema/UserSchema');

exports.login = (req, res)=>{

    res.render('login', {user: new User()});
};


exports.register  = (req, res)=>{
    res.render('register', {user: new User()});
}


exports.setNewPass = (req, res)=>{

    res.render('setNewPass');
    
};