import { useNavigate } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import InventoryForm from "./components/InventoryCom/InventoryForm.jsx";
import InventoryList from "./components/InventoryCom/InventoryList.jsx";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const handleAdd = () => setRefresh(!refresh);

  return (
    <div className="App">
      <h1 className='h1'>hello</h1>
      <center>
        <button onClick={() => navigate("/home")}>click</button>
      </center>
      <header/>

      {/* Inventory feature */}
      <h2>Inventory Management</h2>
      <InventoryForm onAdd={handleAdd} />
      <InventoryList refresh={refresh} />
    </div>
  );
}

export default App;
