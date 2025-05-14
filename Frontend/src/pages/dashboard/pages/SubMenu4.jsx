import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VALUE_API = `${BASE_URL}/core/attribute/value/`;
const ATTRIBUTE_API = `${BASE_URL}/core/attribute/`;

const SubMenu4 = () => {
  const [name, setName] = useState("");
  const [attribute, setAttribute] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch values and attributes
  const fetchData = async () => {
    try {
      setLoading(true);
      const [attrRes, valRes] = await Promise.all([
        axios.get(ATTRIBUTE_API),
        axios.get(VALUE_API),
      ]);
      setAttributes(attrRes.data.results || []);
      setValues(valRes.data.results  || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attribute || !name) return;

    const payload = { name, attributes: attribute };

    try {
      if (editingId) {
        await axios.put(`${VALUE_API}${editingId}/`, payload);
      } else {
        await axios.post(VALUE_API, payload);
      }
      setName("");
      setAttribute(null);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setAttribute(item.attributes);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VALUE_API}${id}/`);
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">مدیریت مقدار خصوصیت‌ها</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="نام مقدار"
          className="border border-gray-300 p-2 rounded w-64"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={attribute || ""}
          onChange={(e) => setAttribute(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
          required
        >
          <option value="" disabled>
            انتخاب خصوصیت
          </option>
          {attributes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
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

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <ul className="space-y-2">
          {values.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  خصوصیت:{" "}
                  {attributes.find((a) => a.id === item.attributes)?.name ||
                    "—"}
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

export default SubMenu4;
