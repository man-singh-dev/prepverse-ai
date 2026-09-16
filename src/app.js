const express=require('express');
const app=express();
app.use(express.json());
/* require all the routes here*/
const authRouter=require('./routes/auth.route')
app.use('/api/auth',authRouter)//using all the routes here





module.exports=app;