import React, { useEffect, useState } from "react";
import axios from "axios";

const CATEGORY_API = "http://localhost:8000/core/category/";
const TYPE_API = "http://localhost:8000/core/";

const SubMenu2 = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState(null);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch types and categories
  const fetchData = async () => {
    try {
      setLoading(true);
      const [typeRes, categoryRes] = await Promise.all([
        axios.get(TYPE_API),
        axios.get(CATEGORY_API),
      ]);
      setTypes(typeRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Failed fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return;

    try {
      const payload = { name, type };
      if (editingId) {
        await axios.put(`${CATEGORY_API}${editingId}/`, payload);
      } else {
        await axios.post(CATEGORY_API, payload);
      }
      setName("");
      setType(null);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setType(item.type);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${CATEGORY_API}${id}/`);
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SubMenu2 - Categories</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کتگوری را وارد کنید"
          className="border border-gray-300 p-2 rounded w-64"
          required
        />

        <select
          value={type || ""}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
          required
        >
          <option value="" disabled>
            نوع را انتخاب کنید
          </option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "ویرایش" : "اضافه کردن"}
          </button>
        </div>
      </form>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  نوع: {types.find((t) => t.id === item.type)?.name || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubMenu2;
