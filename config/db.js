require('dotenv').config();
const mongoose=require('mongoose');


function connectDB(){
  //DataBase connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
  });

  const connection=mongoose.connection;
  connection.once('open',()=>console.log(`DataBase Connected`)).catch((e)=>{
    console.log(`Connection Failed.`);
  });
}

module.exports=connectDB;
