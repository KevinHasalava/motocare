import React from "react";
import { deleteVehicle } from "../../api/vehicleService";

const VehicleList = ({ vehicles, onVehicleDeleted, onEdit }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      await deleteVehicle(id);
      onVehicleDeleted();
    }
  };

  return (
    <div className="mt-6 rounded-2xl shadow-lg bg-slate-800/60 backdrop-blur p-4">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
        🚗 Vehicle List
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-700/60 text-slate-200">
              <th className="p-3">Owner</th>
              <th className="p-3">Number</th>
              <th className="p-3">Type</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Model</th>
              <th className="p-3">Year</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, idx) => (
              <tr
                key={v._id}
                className={`${
                  idx % 2 === 0 ? "bg-slate-900/50" : "bg-slate-800/50"
                } hover:bg-slate-700/40 transition`}
              >
                <td className="p-3">{v.ownerName}</td>
                <td className="p-3">{v.vehicleNumber}</td>
                <td className="p-3">{v.type}</td>
                <td className="p-3">{v.brand}</td>
                <td className="p-3">{v.model}</td>
                <td className="p-3">{v.year}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(v)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-4 text-slate-400 italic"
                >
                  No vehicles found 🚘
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;
