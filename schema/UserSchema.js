'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {type: String, trim: true, require: true},
    password: {type: String, trim: true, require: true},
    email:{type: String, trim: true, require: true},
    createdAt: {type: String, default: Date.now()},
    status: {type: Boolean, default: false}
});


userSchema.pre('save', function(next){

    var user = this;
    if(user.isModified('password')){

        bcrypt.genSalt(10, function(err, salt){
            if(err){
                return Promise.reject();
            }

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err){
                    return Promise.reject();
                }
  
  
                user.password = hash;
                next();
                  });

        });

    } else{
        next();
    }

});



userSchema.statics.findByInfo = function(email, password){
    var User = this;

    return User.findOne({email}).then(function(user){
        if(!user){
            return Promise.reject();
        }

        return new Promise(function(resolve, reject){
            bcrypt.compare(password, user.password, (err, res)=>{
                if(res){
                    resolve(user);
                } else{
                    resolve(null);
                }
       });
        });
    }).catch(err=>{
        console.log(err);
    });
};


userSchema.statics.findBySession = function(req){
    var User = this;
return new Promise(function(resolve, reject){
   if(req.session.user){
      User.findById(req.session.user._id).then(function(user){
           if(!user){
               return reject('no user found');
           }

            resolve(user);
      });
   } else{
       resolve(null);
   }
}).catch(err =>{
    console.log(err);
    resolve(null);
});

};

module.exports = mongoose.model('users', userSchema);