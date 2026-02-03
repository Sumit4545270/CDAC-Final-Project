require('dotenv').config()//env variable

const express=require("express");
const app = express();

const mongoose=require("mongoose"); //require mongoDB
const connectDB = require("./config/db.js");
connectDB();

const path = require("path");

let port=process.env.PORT;

const bodyParser = require("body-parser");

const ejsMate=require("ejs-mate");//require ejs-Mate for boilerplate
const puppeteer = require('puppeteer');//PDF GENERETOR(CERTIFICATE)

// SCHEMA CONNECTIN $ REQUIRE 

const adminRoutes = require("./routes/adminRoutes.js");
const Student= require ("./models/student");//STUDENT SCHEMA
const Course= require ("./models/course.js");//COURSES SCHEMA
const Blog= require ("./models/blog.js");//BLOG SCHEMA
const Visitor= require ("./models/enquiry.js");//VISITOR SCHEMA
const Feedback = require ("./models/feedback.js");//FEEDBACK SCHEMA



const methodOverride=require("method-override");
// stablish connectio b/w APP & MONGODB ATLAS

app.set("view engine","ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json


//mrthodOverrde  require and use
app.use(methodOverride("_method"));

app.get("/",async(req,res)=>{
  const allFeedbacks= await Feedback.find({});
    res.render("./pages/home.ejs",{allFeedbacks});
})

app.get("/home",async(req,res)=>{
  const allFeedbacks= await Feedback.find({});
    res.render("./pages/home.ejs",{allFeedbacks});
})

app.get("/courses",async(req,res)=>{
  const allCourses= await Course.find({});
    res.render("./pages/courses.ejs",{allCourses});
})

app.get("/blogs",async(req,res)=>{
    const allBlogs= await Blog.find({});
    res.render("./pages/blogs.ejs",{allBlogs});
});

app.get("/aboutUs",(req,res)=>{
    res.render("./pages/aboutUs.ejs");
})

app.get("/contact",(req,res)=>{
    res.render("./pages/contact.ejs");
})

app.get("/student-login",(req,res)=>{
  res.render("./loginpage/student-login.ejs");
})

app.get("/privacy-policy",(req,res)=>{
  res.render("./legal/privacy.ejs");
})

app.get("/Terms-of-Service",(req,res)=>{
  res.render("./legal/terms.ejs");
})

app.get("/legal-certificate-india-iso",(req,res)=>{
  res.render("./legal/iso.ejs");
})

app.get("/legal-certificate-india-msme",(req,res)=>{
  res.render("./legal/msme.ejs");
})

// ADMIN DASHBOARD 


//ADMIN LOGIN ///////////////////////////////////////////////////////////////////////////////////////////////////////////


// Admin routes

app.use("/admin", adminRoutes);

// Serve the login form
app.get("/ani-anturli-admin-login",(req,res)=>{
  res.render("./loginpage/admin-login.ejs");
})


// Admin routes
app.use("/admin", adminRoutes);

///////////////////////////////////////////////////////////////////////////////////////////////////////

// CRUD OPERATIONS

// // ADMIN - STUDENT 
// app.get("/admin/students",async(req,res)=>{
//   const allStudents= await Student.find({});
//   res.render("./admin/students.ejs",{allStudents});
// });

// STUDENT-->  ADD NEW STUDENT (BUTTON)
    // app.get("/admin/students/new",async(req,res)=>{
    //   const allCourses= await Course.find({});
    //     res.render("./admin-crud/student-new.ejs",{allCourses});
    // })

    // Taking input values from student-new.ejs // route ->{"/admin/students/new"}
    app.post("/admin/students", async (req, res) => {
        try {
          // Create a new student with the data from the request body
          const newStudent = new Student(req.body.student);
          
          
          // Attempt to save the student to the database
          await newStudent.save();
          
          // If successful, redirect to the students list page
          res.redirect("/admin/students");
          console.log("New student added:", newStudent);
        } catch (error) {
          // Log the error to the console for debugging
          console.error("Error saving student:", error);
      
          // Check if the error is a MongoDB duplicate key error
          if (error.code === 11000) {
            // Duplicate key error (for example, unique constraint on a field like prn)
            return res.status(400).render('./errors/student-error', { message: 'The entered STUDENT PRN number already exists. Please try again with a different PRN.' });
          } else if (error.name === "ValidationError") {
            // Mongoose validation error
            res.status(400).send("Validation Error:" + error.message);
          } else {
            // General server error for other unexpected issues
            res.status(500).send("An unexpected error occurred. Please try again later.");
          }
        }
      });


//Edit Route  
app.get("/admin/students/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const student = await Student.findById(id);
    const allCourses= await Course.find({});
    res.render("./admin-crud/student-edit.ejs",{student,allCourses});
});
//UPDATE ROUTE
app.put("/admin/students/:id",async(req,res)=>{
    let {id}=req.params;
    await Student.findByIdAndUpdate(id,{...req.body.student});

    res.redirect(`/admin/students`)
})
   
//DELETE ROUTE
app.delete("/admin/students/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedStudent= await Student.findByIdAndDelete(id);
    // console.log(deletedStudent);
    res.redirect("/admin/students");
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Courses Section

// ADMIN - COURSES 
// app.get("/admin/courses",async(req,res)=>{
//     const allCourses= await Course.find({});
//     res.render("./admin/courses-admin.ejs",{allCourses});
// });


 // COURSE-->  ADD NEW BLOG (BUTTON)
//  app.get("/admin/courses/new",(req,res)=>{
//     res.render("./admin-crud/course-new.ejs");
// })
// Taking input values from student-new.ejs // route ->{"/admin/students/new"}
    app.post("/admin/courses", async (req, res) => {
        try {
          // Create a new student with the data from the request body
          const newCourse= new Course(req.body.course);
          
          // Attempt to save the student to the database
          await newCourse.save();
      
          // If successful, redirect to the students list page
          res.redirect("/admin/courses");
          // console.log("New course added:", newCourse);
        } catch (error) {
          // Log the error to the console for debugging
          console.error("Error saving blog:", error);
      
          // Check if the error is a MongoDB duplicate key error
          if (error.code === 11000) {
            // Duplicate key error (for example, unique constraint on a field like prn)
            res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
          } else if (error.name === "ValidationError") {
            // Mongoose validation error
            res.status(400).send("Validation Error: " + error.message);
          } else {
            // General server error for other unexpected issues
            res.status(500).send("An unexpected error occurred. Please try again later.");
          }
        }
      });

//Edit Route
app.get("/admin/courses/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const course= await Course.findById(id);
    res.render("./admin-crud/course-edit.ejs",{course });
});


//UPDATE ROUTE
app.put("/admin/courses/:id",async(req,res)=>{
    let {id}=req.params;
    await Course.findByIdAndUpdate(id,{...req.body.course});
    res.redirect(`/admin/courses`);
})

//DELETE ROUTE (blog )
app.delete("/admin/courses/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedCourse= await Course.findByIdAndDelete(id);
    // console.log(deletedCourse);
    res.redirect("/admin/courses");
})

// //////////////////////////




// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// BLOG SECTION

// ADMIN - BLOG
// app.get("/admin/blogs",async(req,res)=>{
//     const allBlogs= await Blog.find({});
//     res.render("./admin/blogs-admin.ejs",{allBlogs});
// })

 // BLOG-->  ADD NEW BLOG (BUTTON)
// app.get("/admin/blogs/new",(req,res)=>{
//     res.render("./admin-crud/blog-new.ejs");
// })

    // Taking input values from student-new.ejs // route ->{"/admin/students/new"}
    app.post("/admin/blogs", async (req, res) => {
        try {
          // Create a new student with the data from the request body
          const newBLog= new Blog(req.body.blog);
          
          // Attempt to save the student to the database
          await newBLog.save();
      
          // If successful, redirect to the students list page
          res.redirect("/admin/blogs");
          // console.log("New blog added:", newBLog);
        } catch (error) {
          // Log the error to the console for debugging
          console.error("Error saving blog:", error);
      
          // Check if the error is a MongoDB duplicate key error
          if (error.code === 11000) {
            // Duplicate key error (for example, unique constraint on a field like prn)
            res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
          } else if (error.name === "ValidationError") {
            // Mongoose validation error
            res.status(400).send("Validation Error: " + error.message);
          } else {
            // General server error for other unexpected issues
            res.status(500).send("An unexpected error occurred. Please try again later.");
          }
        }
      });


//Edit Route
app.get("/admin/blogs/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const blog = await Blog.findById(id);
    res.render("./admin-crud/blog-edit.ejs",{blog});
});
//UPDATE ROUTE
app.put("/admin/blogs/:id",async(req,res)=>{
    let {id}=req.params;
    await Blog.findByIdAndUpdate(id,{...req.body.blog});

    res.redirect(`/admin/blogs`)
})   
//DELETE ROUTE (blog)
app.delete("/admin/blogs/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedBlog= await Blog.findByIdAndDelete(id);
    // console.log(deletedBlog);
    res.redirect("/admin/blogs");
})

/////////////////////////////////////////////////////////////////////

// ADMIN - ENQUIRY
// app.get("/admin/enquiries",async(req,res)=>{
//   const allVisitors= await Visitor.find({});
//   res.render("./admin/enquiry-admin.ejs",{allVisitors});
// });


    // Taking input values from student-new.ejs // route ->{"/admin/students/new"}
    app.post("/admin/enquiries", async (req, res) => {
      try {
        // Create a new student with the data from the request body
        const newVisitor= new Visitor(req.body.visitor);
        
        // Attempt to save the student to the database
        await newVisitor.save();
    
        // If successful, redirect to the students list page
        // res.redirect("/contact");
        res.render("./pages/eform.ejs", { submitMessage: " Thank you for reaching out! Your enquiry has been successfully submitted." });
        // console.log("New Enquiy added:", newVisitor);
      } catch (error) {
        // Log the error to the console for debugging
        console.error("Error saving blog:", error);
    
        // Check if the error is a MongoDB duplicate key error
        if (error.code === 11000) {
          // Duplicate key error (for example, unique constraint on a field like prn)
          res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
        } else if (error.name === "ValidationError") {
          // Mongoose validation error
          res.status(400).send("Validation Error: " + error.message);
        } else {
          // General server error for other unexpected issues
          res.status(500).send("An unexpected error occurred. Please try again later.");
        }
      }
    });

    
//DELETE ROUTE (ENQUIRY )
app.delete("/admin/enquiries/:id",async(req,res)=>{
  let {id}=req.params;
  let deletedVisitor= await Visitor.findByIdAndDelete(id);
  // console.log(deletedVisitor);
  res.redirect("/admin/enquiries");
})

/////////////////  FEEDBACK ////////////////////////////////////////////////////


// ADMIN - FEEDBACK  
// app.get("/admin/feedbacks",async(req,res)=>{ 
//   const allFeedbacks= await Feedback.find({});
//   res.render("./admin/feedback-admin.ejs",{allFeedbacks});
// });

    app.post("/admin/feedbacks", async (req, res) => {
      try {
        // Create a new student with the data from the request body
        const allFeedbacks= new Feedback(req.body.feedback);
        
        // Attempt to save the student to the database
        await allFeedbacks.save();
    
        // If successful, redirect to the students list page
        // res.redirect("/home");
        const allnewFeedbacks= await Feedback.find({});
        res.render("./pages/home-copy.ejs", {allnewFeedbacks});
      } catch (error) {
        // Log the error to the console for debugging
        console.error("Error saving feedback:", error);
        // Check if the error is a MongoDB duplicate key error
        if (error.code === 11000) {
          // Duplicate key error (for example, unique constraint on a field like prn)
          res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
        } else if (error.name === "ValidationError") {
          // Mongoose validation error
          res.status(400).send("Validation Error: " + error.message);
        } else {
          // General server error for other unexpected issues
          res.status(500).send("An unexpected error occurred. Please try again later.");
        }
      }
    });

    
//DELETE ROUTE (ENQUIRY )
app.delete("/admin/feedbacks/:id",async(req,res)=>{
  let {id}=req.params;
  let deletedFeedback= await Feedback.findByIdAndDelete(id);
  // console.log(deletedFeedback);
  res.redirect("/admin/feedbacks");
})


////////////////////////////////////////////////////////////////////////////

// STUDENT LOGIN ////////////
   
// Handle login form submission   
  // Taking input values from student-new.ejs // route ->{"/admin/students/new"}
     app.post("/student-certificate", async (req, res) => {
     try {
      let S_prn= req.body.S_id;
      let S_password=req.body.password;
     console.log(S_prn,S_password);

     Student.findOne({ S_id: S_prn, Password: S_password})
     .then(student => {
         if (!student) {
             // No matching student found
            //  console.log("Invalid Student PRN or Password.");
             // You can render an error page or send a response with a message
             res.render("./loginpage/invalid-Student.ejs", { errorMessage: "Invalid Student PRN or Password Please try again " });
            
             //  res.status(401).send("Invalid S_id or Password. Please try again.");
         } else {
             // Student found, proceed with the logic
            //  console.log("Student found:", student);
             // Render the student dashboard or desired page
             res.render("./certificate/certificate.ejs", {student});
         }
     })
   

    } catch (error) {
    
      console.error("Error saving blog:", error);
  
      // Check if the error is a MongoDB duplicate key error
      if (error.code === 11000) {
        // Duplicate key error (for example, unique constraint on a field like prn)
        res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
      } else if (error.name === "ValidationError") {
        // Mongoose validation error
        res.status(400).send("Validation Error: " + error.message);
      } else {
        // General server error for other unexpected issues
        res.status(500).send("An unexpected error occurred. Please try again later.");
      }
    }
   });// Route to generate PDF and trigger download
   app.post('/download-certificate', async (req, res) => {
     const { S_id } = req.body;
   
     try {
         const student = await Student.findOne({ S_id });
         if (!student) {
             return res.status(404).send("Student not found.");
         }
   
         // Launch Puppeteer to render the PDF
         const browser = await puppeteer.launch();
         const page = await browser.newPage();
   
         // Resolve the absolute path to the certificate image
         const certificateImagePath = path.resolve(__dirname, student.ImagePath);  // Ensure this is an absolute path
   
         // Generate HTML content for the certificate
         const content = `
             <html>
                 <head>
                     <title>Student Certificate</title>
                     <style>
                         body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; }
                         h1 { margin-top: 20px; font-size: 30px; }
                         img { max-width: 100%; height: auto; margin-top: 50px; }
                     </style>
                 </head>
                 <body>
                     <h1>Congratulations, ${student.S_name}!</h1>
                     <p>Your certificate is ready for download.</p>
                     <img src="file://${certificateImagePath}" alt="Student Certificate Image">
                 </body>
             </html>
         `;
   
         // Set the content of the page
         await page.setContent(content, { waitUntil: 'networkidle0' }); // Wait for network activity to finish
   
         // Generate the PDF with options
         const pdfBuffer = await page.pdf({
             format: 'A4',
             printBackground: true,
             margin: { top: '20px', bottom: '20px', left: '10px', right: '10px' }
         });
   
         await browser.close();
   
         // Set headers to download PDF
         res.setHeader('Content-Disposition', `attachment; filename="${student.S_name}-certificate.pdf"`);
         res.setHeader('Content-Type', 'application/pdf');
         res.send(pdfBuffer);
   
     } catch (error) {
         console.error("Error generating PDF:", error);
         res.status(500).send("An error occurred while generating the PDF.");
     }
   });
   

// ////////////////////////////

// Route to handle search by PRN
app.post("/students/search", async (req, res) => {
  try {
  let S_prn =req.body.S_id;
  //  console.log(S_prn);

   Student.findOne({S_id: S_prn})
   .then(student => {
    console.log(student);
       if (!student) {
           // No matching student found
          //  console.log("Invalid Student PRN or Password.");
           // You can render an error page or send a response with a message
           res.render("./admin/student-not-found.ejs", { errorMessage: " STUDENT NOT FOUND !" });
          // res.send("students not found")
          
           //  res.status(401).send("Invalid S_id or Password. Please try again.");
       } else {
           // Student found, proceed with the logic
          //  console.log("Student found:", student);
           // Render the student dashboard or desired page
           res.render("./admin/student-search.ejs", { student});
       }
   })
 

  } catch (error) {
  
    console.error("Error saving blog:", error);

    // Check if the error is a MongoDB duplicate key error
    if (error.code === 11000) {
      // Duplicate key error (for example, unique constraint on a field like prn)
      res.status(400).send("Error: Duplicate entry detected. Please ensure unique values for unique fields.");
    } else if (error.name === "ValidationError") {
      // Mongoose validation error
      res.status(400).send("Validation Error: " + error.message);
    } else {
      // General server error for other unexpected issues
      res.status(500).send("An unexpected error occurred. Please try again later.");
    }
  }
 });




 
 


app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on port ${port}`);
});
