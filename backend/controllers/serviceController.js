const Service = require("../models/Service");

// ➕ Add new service
const addService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({ message: "Name, duration, price required" });
    }

    const exists = await Service.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const newService = new Service({ name, description, duration, price });
    await newService.save();

    res.status(201).json({ message: "✅ Service added", service: newService });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "✅ Service updated", service: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "🗑️ Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addService, getServices, updateService, deleteService };