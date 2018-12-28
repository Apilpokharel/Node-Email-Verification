'use strict';
const User = require('../schema/UserSchema');
var os = require("os");
var hostname = os.hostname() || 'heroku';

exports.login = (req, res)=>{

    res.render('login', {user: new User(), host: hostname});
};


exports.register  = (req, res)=>{
    res.render('register', {user: new User()});
}


exports.setNewPass = (req, res)=>{

    res.render('setNewPass',{id: req.session.user._id});
    
};