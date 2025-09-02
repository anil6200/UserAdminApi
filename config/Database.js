const mongoose=require('mongoose');
require('dotenv').config();

const DataBaseConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log('Db Connected');
        
    })
    .catch((e)=>{
        console.log('Db is not connected');
        process.exit(1);
        
    })
}
module.exports=DataBaseConnect;