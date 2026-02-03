const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// SCHEMA CONNECTION & REQUIRE
const Admin = require("../routes/adminRoutes.js");
const Student = require("../models/student"); // STUDENT SCHEMA
const Course = require("../models/course.js"); // COURSES SCHEMA
const Blog = require("../models/blog.js"); // BLOG SCHEMA
const Visitor = require("../models/enquiry.js"); // VISITOR SCHEMA
const Feedback = require("../models/feedback.js"); // FEEDBACK SCHEMA

// Admin Login Route (No authMiddleware)
router.post("/login", authMiddleware, (req, res) => {
  res.redirect("/admin/dashboard");
});

// Admin Dashboard (Protected)
router.get("/dashboard", (req, res) => {
  res.render("admin/home-admin");
});

// STUDENT ROUTES
// Show all students (Protected)
router.get("/students",async (req, res) => {
  try {
    const allStudents = await Student.find({});
    res.render("admin/students", { allStudents });
  } catch (error) {
    // console.error("Error fetching students:", error);
    res.status(500).send("Error loading students.");
  }
});

// Edit student (Protected)
// router.get("/admin/students/:id/edit", async (req, res) => {
//   let {id}=req.params;
//       const student = await Student.findById(id);
//       const allCourses= await Course.find({});
//       res.render("./admin-crud/student-edit.ejs",{student,allCourses});
// });

// Add new student (Protected)
router.get("/students/new", async (req, res) => {
  try {
    const allCourses = await Course.find({});
    res.render("admin-crud/student-new", { allCourses });
  } catch (error) {
    // console.error("Error loading course list:", error);
    res.status(500).send("Error loading new student form.");
  }
});

// COURSES ROUTES
// Show all courses (Protected)
router.get("/courses", async (req, res) => {
  try {
    const allCourses = await Course.find({});
    res.render("admin/courses-admin", { allCourses });
  } catch (error) {
    // console.error("Error fetching courses:", error);
    res.status(500).send("Error loading courses.");
  }
});

// // Edit course (Protected)
// router.get("/courses/edit/:id", async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     res.render("admin-crud/course-edit", { course });
//   } catch (error) {
//     console.error("Error fetching course:", error);
//     res.status(500).send("Error loading course details.");
//   }
// });

// Add new course (Protected)
router.get("/courses/new", (req, res) => {
  res.render("admin-crud/course-new");
});

// BLOG ROUTES
// Show all blogs (Protected)
router.get("/blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("admin/blogs-admin", { allBlogs });
  } catch (error) {
    // console.error("Error fetching blogs:", error);
    res.status(500).send("Error loading blogs.");
  }
});

// Edit blog (Protected)
// router.get("/blogs/edit/:id", authMiddleware, async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     res.render("admin-crud/blog-edit", { blog });
//   } catch (error) {
//     console.error("Error fetching blog:", error);
//     res.status(500).send("Error loading blog details.");
//   }
// });

// Add new blog (Protected)
router.get("/blogs/new",  (req, res) => {
  res.render("admin-crud/blog-new");
});

// ENQUIRY ROUTES
// Show all enquiries (Protected)
router.get("/enquiries", async (req, res) => {
  try {
    const allVisitors = await Visitor.find({});
    res.render("admin/enquiry-admin", { allVisitors });
  } catch (error) {
    // console.error("Error fetching enquiries:", error);
    res.status(500).send("Error loading enquiries.");
  }
});

// FEEDBACK ROUTES
// Show all feedbacks (Protected)
router.get("/feedbacks", async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find({});
    res.render("admin/feedback-admin", { allFeedbacks });
  } catch (error) {
    // console.error("Error fetching feedbacks:", error);
    res.status(500).send("Error loading feedbacks.");
  }
});

module.exports = router;
