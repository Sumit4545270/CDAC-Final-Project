const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const feedbackSchema= new Schema({
    user_name:{
        type:String,
        required:true,
    }    
    ,
    fe_msg:{
        type:String,
        required:true,
    }    
    ,
});

const Feedback =mongoose.model("feedback",feedbackSchema);
module.exports=Feedback;