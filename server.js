'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const http = require('http');



require('dotenv').config({path: 'variables.env'});
const app = require('./app');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true });
mongoose.set('useCreateIndexes', true);
mongoose.set('useFindAndModify', false);
mongoose.connection.on('error',(err)=>{
console.log(`error in database ${err.message}`);
});


const server = http.createServer(app);


server.listen(PORT, (err)=>{
 if(err){
     console.log('error in http server '+err);
 }

 console.log(`server started in port ${PORT}`);
});