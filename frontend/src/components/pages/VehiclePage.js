import React, { useEffect, useState } from "react";
import { getVehicles } from "../../api/vehicleService";
import VehicleForm from "../vehicle/VehicleForm";
import VehicleList from "../vehicle/VehicleList";

// /Users/waruna/Documents/Waruna  Bopitiya/SLIIT/Projects/Moto-Care/frontend/src/components/VehicleForm.js
// /Users/waruna/Documents/Waruna  Bopitiya/SLIIT/Projects/Moto-Care/frontend/src/components/pages/VehiclePage.js
const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);

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
      <VehicleForm onVehicleAdded={loadVehicles} />
      <VehicleList vehicles={vehicles} onVehicleDeleted={loadVehicles} />
    </div>
  );
};

export default VehiclePage;
