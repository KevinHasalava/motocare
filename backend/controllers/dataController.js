const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");

// ----------------------------------------------------------------------
// 1. GET USER'S REGISTERED VEHICLES 
// ----------------------------------------------------------------------
/**
 * Retrieves a specific user's vehicles based on their email.
 * Used by the frontend walk-in form to check if the user is registered.
 */
const getVehiclesByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // 1. Find the User
    const user = await User.findOne({ email });

    if (!user) {
      // If user is not found, return an empty array and the status 200 (OK)
      // The frontend will treat this as a new customer.
      return res.status(200).json({ userExists: false, vehicles: [] }); 
    }

    // 2. Find all vehicles owned by this user
    const vehicles = await Vehicle.find({ owner: user._id });

    // Return the user's ID along with vehicles, so the frontend can use it if needed
    res.status(200).json({ userExists: true, userId: user._id, vehicles });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user vehicles: " + err.message });
  }
};

// ----------------------------------------------------------------------
// 2. GET ALL AVAILABLE MECHANICS 
// ----------------------------------------------------------------------
/**
 * Retrieves all users with userType: 'mechanic'.
 * Used to populate the mechanic assignment dropdown.
 */
const getAvailableMechanics = async (req, res) => {
  try {
    // Filter users by userType 'mechanic' and select only name and _id
    const mechanics = await User.find({ userType: 'mechanic' }, 'name _id'); 
    
    // Add the "Auto Assign" option at the start
    const mechanicList = [{ _id: 'AUTO_ASSIGN', name: 'Auto Assign' }, ...mechanics];

    res.status(200).json(mechanicList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching mechanics: " + err.message });
  }
};

// ----------------------------------------------------------------------
// 3. GET ALL SERVICES
// ----------------------------------------------------------------------

/**
 * Retrieves all existing services from the Service collection.
 * Used to populate the service type dropdown.
 */
const getAllServices = async (req, res) => {
    try {
        // Select only necessary fields for efficiency
        const services = await Service.find({}, 'name _id duration vehicleType price');
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Error fetching services: " + err.message });
    }
};


module.exports = {
  getVehiclesByEmail,
  getAvailableMechanics,
  getAllServices
};
