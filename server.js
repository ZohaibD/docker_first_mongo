const express = require('express')
const https = require('https')
const mongoose = require('mongoose');
const config = require('./db');
const fs = require('fs')
const bodyparser = require('body-parser')
const userSchema = require('./model/Student')

const port = 4000
mongoose.connect(config.DB,{useNewUrlParser:true,useUnifiedTopology:true},
    (err)=>{
        if(err) throw err
        console.log("Connect to Db")
    })
const httpsOptions = {
    key: fs.readFileSync('./60266907_localhost.key'),
    cert: fs.readFileSync('./60266907_localhost.cert')
  };

const app = express() 
app.use(bodyparser())
app.get('/',(req,res)=>{
    res.sendFile('views/index.html', {root: __dirname })
})
app.post('/save',(req,res)=>{
    console.log('save API called ' , req.body)
    const body = req.body
    const user = new userSchema({
        name:body.name,
        email :body.email
    })
    console.log('user to be saved', user)
    user.save()
    .then((result)=>{
        console.log('Success')
        return res.status(201).send(result)
    })
    .catch((err)=>{
        console.log('Error' ,err)
        res.status(400).send("eRROR IN SAVE FILE",err)
    })

})
app.get('/list',(req,res)=>{
    console.log('List API called ')
 
    userSchema.find()
    .then((result)=>{
        res.status(200).send({message:"Successfully get the result",result: result})
    })
    .catch((err)=>{
        res.status(400).send("eRROR IN getting result ",err)
    })

})
https.createServer(httpsOptions , app).listen(port,()=>{
    console.log("app is listening on port " , port)
})