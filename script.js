const File=require('./models/file.js');
const fs=require('fs');
const connectDB=require('./config/db.js');

connectDB();
async function fetchData(){
  //24hrs files
  const pastDate=new Date(Date.now()-24*60*60*1000);
  const files=File.find({
    createdAt:{
      $lt: pastDate
    }
  });

  if(files.length){
    for(const file of files){
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`Succesfully deleted ${file.filename}`);
      } catch (e) {
        console.log(`Error while deleting file ${e}`);
      }
    }
  }
}

fetchData().then(process.exit);
