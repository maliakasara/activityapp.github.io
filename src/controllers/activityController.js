const Activity = require("../models/Activity");


exports.createActivity = async (req, res) => {
  try {
    const { title, description, location, date, time } = req.body;

    
    if (!title || !location || !date || !time) {
      return res
        .status(400)
        .json({ message: "Title, location and datetime are required" });
    }

    const activity = new Activity({
      title,
      description,
      location,
      date,
      time,
    });

    await activity.save();

    res
      .status(201)
      .json({ message: "Activity created successfully", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating activity" });
  }
};

//////////////////////////////////////////////////////////////


exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};
