const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const visitorSchema= new Schema({
    E_name:{
        type:String,
        required:true,
       
    }    
    ,
    E_mobile:{
        type:String,
        required:true,
    }    
    ,
    E_msg:{
        type:String,
    }    
    ,
    info_at:{
        type: Date,
        default: Date.now,
    }
});

const Visitor =mongoose.model("visitor",visitorSchema);
module.exports=Visitor;