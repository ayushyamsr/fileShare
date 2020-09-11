const express=require('express');
const app=express();
const PORT=process.env.PORT || 3000;
const path=require('path');
const cors=require('cors');
const connectDB=require('./config/db.js');
const files=require('./routes/files.js');
const show=require('./routes/show.js');
const download=require('./routes/download.js');
connectDB();



//express static
app.use(express.static('public'));
app.use(express.json());

//Cors
const corsOption={
//  origin:['http://localhost:3000','http://localhost:4000','http://localhost:5000']
  origin:process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOption));

//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');


//routes
app.use(files);
app.use(show);
app.use(download);


app.listen(PORT,()=>console.log(`Server is up on port ${PORT}`));
