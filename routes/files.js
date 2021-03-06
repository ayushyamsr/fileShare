const express=require('express');
const router=new express.Router();
const multer=require('multer');
const File=require('../models/file.js');
const path=require('path');
const {v4:uuid4}=require('uuid');

let storage=multer.diskStorage({
  destination:(req,file,cb)=>cb(null,'uploads/'),
  filename:(req,file,cb)=>{
    const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
    cb(null,uniqueName);
  }

});

let upload=multer({
  storage,
  limit:{
    fileSize:100000000
  }
}).single('myfile');


router.post('/api/files',(req,res)=>{


  //store file

  upload(req,res,async (err)=>{
    //validate request
    if(!req.file){
      return res.json({error:"All fields are required."});
    }

    if(err){
      return res.status(500).send({error:err.message});
    }
    //store in database
    const file=new File({
      filename:req.file.filename,
      uuid:uuid4(),
      path:req.file.path,
      size:req.file.size
    });

    const response=await file.save();
    //response->link

    return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

  });


});

router.post('/api/files/send',async (req,res)=>{
  const{uuid,emailTo,emailFrom}=req.body;
  if(!uuid || !emailTo || !emailFrom){
    return res.status(400).send({error:"All fields are required"});
  }

  const file=await File.findOne({uuid});
  if(file.sender){
    return res.status(400).send({error:"Email already sent"});
  }
  file.sender=emailFrom;
  file.receiver=emailTo;
  const response=await file.save();

  //send email
  const sendmail=require('../services/emailServices.js');
  sendmail({
    from:emailFrom,
    to:emailTo,
    subject:'inShare file sharing',
    text:`${emailFrom} shared a file with you`,
    html:require('../services/emailTemplate')({
      emailFrom:emailFrom,
      downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size:parseInt(file.size/1000)+' KB',
      expires:'24 hours'
    })
  });
  return res.send({success:true});

});

module.exports=router;
