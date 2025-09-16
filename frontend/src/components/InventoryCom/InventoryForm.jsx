import React, { useState } from "react";
import axios from "axios";

const InventoryForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    partId: "",
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    unit: "",
    lowStockThreshold: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ cast number fields to real numbers
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        lowStockThreshold: Number(form.lowStockThreshold),
      };

      const res = await axios.post("http://localhost:5001/api/inventory", payload);
      onAdd(res.data);

      // clear form after success
      setForm({
        partId: "",
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "",
        unit: "",
        lowStockThreshold: ""
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="partId" placeholder="Part ID" value={form.partId} onChange={handleChange} />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
      <input name="lowStockThreshold" type="number" placeholder="Low Stock Threshold" value={form.lowStockThreshold} onChange={handleChange} />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default InventoryForm;
