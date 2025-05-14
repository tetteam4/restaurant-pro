import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ATTRIBUTE_API = `${BASE_URL}/core/attribute/`;
const CATEGORY_API = `${BASE_URL}/core/category/`;

const SubMenu3 = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const fetchData = async () => {
    try {
      const [catRes, attrRes] = await Promise.all([
        axios.get(CATEGORY_API),
        axios.get(ATTRIBUTE_API),
      ]);
      setCategories(catRes.data.results || []);
      setAttributes(attrRes.data.results || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !type) return;

    const payload = { name, category, type };

    try {
      if (editingId) {
        await axios.put(`${ATTRIBUTE_API}${editingId}/`, payload);
      } else {
        await axios.post(ATTRIBUTE_API, payload);
      }
      setName("");
      setType("");
      setCategory(null);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setType(item.type);
    setCategory(item.category);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ATTRIBUTE_API}${id}/`);
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">مدیریت خصوصیت‌ها</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="نام خصوصیت"
          className="border border-gray-300 p-2 rounded w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
          required
        >
          <option value="" disabled>
            انتخاب نوع
          </option>
          <option value="dropdown">Dropdown</option>
          <option value="input">Input</option>
          <option value="checkbox">Checkbox</option>
        </select>

        <select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
          required
        >
          <option value="" disabled>
            انتخاب کتگوری
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "ویرایش" : "اضافه کردن"}
        </button>
      </form>

      <ul className="space-y-2">
        {attributes.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                نوع: {item.type} | کتگوری:{" "}
                {categories.find((c) => c.id === item.category)?.name || "—"}
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
    </div>
  );
};

export default SubMenu3;
