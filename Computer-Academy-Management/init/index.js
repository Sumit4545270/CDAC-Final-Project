const mongoose=require("mongoose");
const initData = require("./data.js");
const Admin = require("../models/admin.js");

const MONGO_URL="mongodb+srv://ketan24:eFHU4GMHgOBy0Ilc@cluster0.h0ip0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
.then(()=>{
    console.log("connect to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB= async()=>{
   
    await Admin.insertMany(initData.data);
    console.log("data was initialized");
    console.log(Admin);
    
}

initDB();   

