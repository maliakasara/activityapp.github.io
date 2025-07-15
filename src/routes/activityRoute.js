const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
} = require("../controllers/activityController");

// Public route - list activities
router.get("/", getAllActivities);

// New route - add activity
router.post("/", createActivity);

module.exports = router;
