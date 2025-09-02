const express=require('express');
require('dotenv').config();
const cookieParser=require('cookie-parser');
const app=express();

const PORT=process.env.PORT || 6000;

app.use(express.json());
app.use(cookieParser());

const admin=require('./routes/adminroutes');
app.use('/admin',admin);
const user=require('./routes/userroutes');
app.use('/user',user);


const DataBaseConnect=require('./config/Database');

app.listen(PORT,(req,res)=>{
    console.log(`Port started at ${PORT}`)
    DataBaseConnect();
    
});

app.get('/',(req,res)=>{
    res.send("default Route")
})