const Vehicle = require('../models/Vehicle');


// Add new vehicle
const addVehicle = async (req, res) => {
  try {
    const { ownerName, vehicleNumber, type, brand, model, year } = req.body;

    // validation
    if (!ownerName || !vehicleNumber || !type || !brand || !model || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check enum validation
    const allowedTypes = ['Car', 'Three Wheel', 'Bike', 'Van'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Allowed: ${allowedTypes.join(', ')}` });
    }

    // check duplicate vehicle number
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle number already exists" });
    }

    const newVehicle = new Vehicle({
      ownerName,
      vehicleNumber,
      type,
      brand,
      model,
      year
    });

    await newVehicle.save();
    res.status(201).json({ message: "✅ Vehicle added successfully", vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.type) {
      const allowedTypes = ['Car', 'Three Wheel', 'Bike', 'Van'];
      if (!allowedTypes.includes(updatedData.type)) {
        return res.status(400).json({ message: "Invalid vehicle type" });
      }
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "✅ Vehicle updated successfully", vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "🗑️ Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addVehicle, getVehicles, updateVehicle, deleteVehicle };
