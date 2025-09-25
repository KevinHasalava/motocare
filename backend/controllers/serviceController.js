const Service = require("../models/Service");

// ➕ Add new service (Updated & Simplified)
const addService = async (req, res) => {
  try {
    const { name, description, duration, price, vehicleType } = req.body;

    if (!name || !duration || !price || !vehicleType) {
      return res.status(400).json({ message: "Name, duration, price, and vehicle type are required." });
    }

    // Check if a service with the same name and vehicle type already exists
//     const exists = await Service.findOne({ name, vehicleType });
//     if (exists) {
//       return res.status(400).json({ message: `A service named '${name}' already exists for '${vehicleType}'.` });
//     }

    const newService = new Service({ name, description, duration, price, vehicleType });
    await newService.save();

    res.status(201).json({ message: "✅ Service added successfully", service: newService });
  } catch (err) {
    // // Handle potential duplicate errors from the database index
    // if (err.code === 11000) {
    //     return res.status(400).json({ message: `A service named '${req.body.name}' already exists for '${req.body.vehicleType}'.` });
    // }
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all services (No changes needed)
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update service (Updated & Simplified)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    // Using runValidators ensures the 'enum' for vehicleType is checked on update
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "✅ Service updated successfully", service: updated });
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ message: `Another service has the same name and vehicle type.` });
    }
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete service (No changes needed)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "🗑️ Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addService, getServices, updateService, deleteService };