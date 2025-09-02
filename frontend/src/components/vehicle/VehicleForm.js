import React, { useState } from "react";
import { addVehicle } from "../../api/vehicleService";

const VehicleForm = ({ onVehicleAdded }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleNumber: "",
    type: "",
    brand: "",
    model: "",
    year: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(formData);
      alert("✅ Vehicle added successfully!");
      setFormData({
        ownerName: "",
        vehicleNumber: "",
        type: "",
        brand: "",
        model: "",
        year: ""
      });
      onVehicleAdded(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error adding vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Add Vehicle</h2>
      <input
        type="text"
        name="ownerName"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />
      <input
        type="text"
        name="vehicleNumber"
        placeholder="Vehicle Number"
        value={formData.vehicleNumber}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      >
        <option value="">Select Type</option>
        <option value="Car">Car</option>
        <option value="Three Wheel">Three Wheel</option>
        <option value="Bike">Bike</option>
        <option value="Van">Van</option>
      </select>
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={formData.model}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />
      <input
        type="number"
        name="year"
        placeholder="Year"
        value={formData.year}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Vehicle
      </button>
    </form>
  );
};

export default VehicleForm;
