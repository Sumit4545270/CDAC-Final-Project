const mongoose = require("mongoose");
const Admin = require("../models/admin.js");
const Schema=mongoose.Schema;



const authMiddleware = async (req, res, next) => {
      const  {username,password}  = req.body;
      // console.log("user Entered-" , username,password);

         Admin.findOne({username,password})
         .then((admin)=>{
          // console.log("Admin-",admin);
          if(!admin){
           
            return res.status(401).render("./loginpage/invalid-admin.ejs", { errorMessage: "Invalid Admin ID and Password Please try again." });
            
          }
          req.admin= admin; // 
          next();
      
    })
};

module.exports = authMiddleware;

