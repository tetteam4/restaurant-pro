import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔁 Fetch roles on load
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/role/`);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editId) {
        // 🟡 Update role
        await axios.put(`${BASE_URL}/user/role/${editId}`, { name });
        setEditId(null);
      } else {
        // 🟢 Create new role
        await axios.post(`${BASE_URL}/user/role/`, { name });
      }
      setName("");
      fetchRoles();
    } catch (err) {
      console.error("Error saving role:", err);
    }
  };

  const handleEdit = (role) => {
    setName(role.name);
    setEditId(role.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/user/role/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Roles Management</h2>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="space-y-2">
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{role.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(role)}
                className="text-yellow-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(role.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
