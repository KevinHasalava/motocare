import React, { useState, useEffect } from "react";
import { addVehicle, updateVehicle } from "../../api/vehicleService";

const VehicleForm = ({ onVehicleAdded, editingVehicle, onUpdateComplete }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleNumber: "",
    type: "",
    brand: "",
    model: "",
    year: "",
  });

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
        await updateVehicle(editingVehicle._id, formData);
        alert("✅ Vehicle updated successfully!");
        onUpdateComplete();
      } else {
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
        year: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error saving vehicle");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
        {editingVehicle ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={formData.vehicleNumber}
          onChange={handleChange}
          disabled={!!editingVehicle}
          className={`p-3 rounded-lg border ${
            editingVehicle
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          }`}
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
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
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
            editingVehicle
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
        </button>

        {editingVehicle && (
          <button
            type="button"
            onClick={onUpdateComplete}
            className="px-5 py-2 rounded-lg font-semibold bg-slate-600 hover:bg-slate-700 text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default VehicleForm;
