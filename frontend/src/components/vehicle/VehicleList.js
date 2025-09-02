import React from "react";
import { deleteVehicle } from "../../api/vehicleService";

const VehicleList = ({ vehicles, onVehicleDeleted, onEdit }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      await deleteVehicle(id);
      onVehicleDeleted(); // refresh list
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Vehicle List</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Owner</th>
            <th className="border p-2">Number</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v._id}>
              <td className="border p-2">{v.ownerName}</td>
              <td className="border p-2">{v.vehicleNumber}</td>
              <td className="border p-2">{v.type}</td>
              <td className="border p-2">{v.brand}</td>
              <td className="border p-2">{v.model}</td>
              <td className="border p-2">{v.year}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => onEdit(v)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-2">
                No vehicles found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;
