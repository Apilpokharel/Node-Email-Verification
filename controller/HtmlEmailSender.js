'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const template = './views/emailTemplate.ejs';


exports.sendMail = (to, subject, hre, link, user)=>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    let templateData = {
        name: '<Apil>',
        link: link,
        id: user,
        hre: hre,
        title:'EMail Verification Page',
        body:'This is unharmful image'
    };


      ejs.renderFile(template, templateData, (err, html) => {
        if (err) console.log('error in ejs file render '+ err);
  

        let mailOptions = {
            from: 'Apil',
            to: to,
            subject: subject,
         
            html: html
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            
            }
          });

      });
       
      
      
    
    };