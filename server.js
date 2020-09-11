const express=require('express');
const app=express();
const PORT=process.env.PORT || 3000;
const path=require('path');
const connectDB=require('./config/db.js');
const files=require('./routes/files.js');
const show=require('./routes/show.js');
const download=require('./routes/download.js');
connectDB();



//express static
app.use(express.static('public'));
app.use(express.json());

//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');


//routes
app.use(files);
app.use(show);
app.use(download);


app.listen(PORT,()=>console.log(`Server is up on port ${PORT}`));
