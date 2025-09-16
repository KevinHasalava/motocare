import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryList = ({ refresh }) => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/inventory/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateItem = async (id) => {
    const newName = prompt("Enter new name:");
    const newQuantity = prompt("Enter new quantity:");
    if (!newName || !newQuantity) return;

    try {
      await axios.put(`http://localhost:5001/api/inventory/${id}`, {
        name: newName,
        quantity: Number(newQuantity), // ✅ cast to number
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  return (
    <div>
      <h2>Inventory Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity}  
            <button onClick={() => updateItem(item._id)}>Update</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryList;
