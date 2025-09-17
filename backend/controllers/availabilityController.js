const Availability = require("../models/Availability");
const Job = require("../models/Job");

// Admin sets availability
const setAvailability = async (req, res) => {
  try {
    const { mechanic, date, startTime, endTime, isAvailable } = req.body;

    const record = new Availability({ mechanic, date, startTime, endTime, isAvailable });
    await record.save();

    res.status(201).json({ message: "✅ Availability saved", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get availability slots (for frontend dropdown/disable times)
const getAvailability = async (req, res) => {
  try {
    const { date, mechanicId } = req.query;
    const day = new Date(date);

    // 1. Get base availability records
    let query = { date: day };
    if (mechanicId) query.mechanic = mechanicId;

    const availability = await Availability.find(query);
    if (!availability) return res.json({ slots: [] });

    // 2. Fetch all jobs for that mechanic/day
    const jobs = await Job.find({
      mechanic: mechanicId,
      startTime: { $gte: new Date(day.setHours(0,0,0)), $lt: new Date(day.setHours(23,59,59)) },
      status: { $in: ["Booked", "Ongoing"] }
    });

    // 3. Build slots (8am-5pm default) then mark disabled ones
    let slots = [];
    availability.forEach(a => {
      let start = parseInt(a.startTime.split(":")[0]);
      let end = parseInt(a.endTime.split(":")[0]);
      for (let h = start; h < end; h++) {
        slots.push({ time: `${h}:00`, available: a.isAvailable });
      }
    });

    // Disable slots overlapping jobs
    jobs.forEach(j => {
      const hh = j.startTime.getHours();
      slots = slots.map(s => s.time.startsWith(`${hh}`) ? { ...s, available: false } : s);
    });

    res.json({ slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { setAvailability, getAvailability };