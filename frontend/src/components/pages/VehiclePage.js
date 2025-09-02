import React, { useEffect, useState } from "react";
import { getVehicles } from "../../api/vehicleService";
import VehicleForm from "../vehicle/VehicleForm";
import VehicleList from "../vehicle/VehicleList";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    const res = await getVehicles();
    setVehicles(res.data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚗 Vehicle Management</h1>
      <VehicleForm
        onVehicleAdded={loadVehicles}
        editingVehicle={editingVehicle}
        onUpdateComplete={() => {
          loadVehicles();
          setEditingVehicle(null);
        }}
      />
      <VehicleList
        vehicles={vehicles}
        onVehicleDeleted={loadVehicles}
        onEdit={(vehicle) => setEditingVehicle(vehicle)}
      />
    </div>
  );
};

export default VehiclePage;
