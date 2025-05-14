import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/core/";

const SubMenu1 = () => {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, { name });
      } else {
        await axios.post(API_URL, { name });
      }
      setName("");
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SubMenu1 - CRUD</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 p-2 rounded w-64"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{item.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubMenu1;
