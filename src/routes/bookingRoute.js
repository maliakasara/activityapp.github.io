const express = require("express");
const {
  bookActivity,
  getMyBookings,
} = require("../controllers/bookingController");
const auth = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post(
  "/book",
  [body("activityId").notEmpty()],
  validate,
  auth,
  bookActivity
);

router.get("/my-bookings", auth, getMyBookings);

module.exports = router;
