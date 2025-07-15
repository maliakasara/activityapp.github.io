const Booking = require("../models/Booking");
const Activity = require("../models/Activity");

exports.bookActivity = async (req, res) => {
  try {
    const { activityId } = req.body;
    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ msg: "Activity not found" });

    const booking = new Booking({
      user: req.user.id,
      activity: activityId,
    });

    await booking.save();
    res.status(201).json({ msg: "Activity booked successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "activity"
    );
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
