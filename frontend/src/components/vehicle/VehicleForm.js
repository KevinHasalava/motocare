import React, { useState, useEffect } from "react";
import { addVehicle, updateVehicle } from "../../api/vehicleService";

const VehicleForm = ({ onVehicleAdded, editingVehicle, onUpdateComplete }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleNumber: "",
    type: "",
    brand: "",
    model: "",
    year: ""
  });

  // if editingVehicle data changes, load it into form
  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
    }
  }, [editingVehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        // update mode
        await updateVehicle(editingVehicle._id, formData);
        alert("✅ Vehicle updated successfully!");
        onUpdateComplete(); // refresh + clear edit mode
      } else {
        // add mode
        await addVehicle(formData);
        alert("✅ Vehicle added successfully!");
        onVehicleAdded();
      }

      setFormData({
        ownerName: "",
        vehicleNumber: "",
        type: "",
        brand: "",
        model: "",
        year: ""
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error saving vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-bold mb-2">
        {editingVehicle ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}
      </h2>

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
        disabled={!!editingVehicle} // number cannot change in edit
        className="block w-full mb-2 p-2 border bg-gray-200"
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

      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${
          editingVehicle ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
      </button>

      {editingVehicle && (
        <button
          type="button"
          onClick={onUpdateComplete}
          className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default VehicleForm;
