import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VALUE_API = `${BASE_URL}/core/attribute/value/`;
const ATTRIBUTE_API = `${BASE_URL}/core/attribute/`;
const CATEGORY_API = `${BASE_URL}/core/category/`;
const TYPE_API = `${BASE_URL}/core/`;

const SubMenu4 = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [attribute, setAttribute] = useState("");

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, typeRes, attrRes, valRes] = await Promise.all([
        axios.get(CATEGORY_API),
        axios.get(TYPE_API),
        axios.get(ATTRIBUTE_API),
        axios.get(VALUE_API),
      ]);
      setCategories(catRes.data.results);
      setTypes(typeRes.data.results);
      setAttributes(attrRes.data.results || []);
      setValues(valRes.data.results || []);
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
    if (!name || !attribute) return;

    const payload = { name, attributes: attribute };

    try {
      if (editingId) {
        await axios.put(`${VALUE_API}${editingId}/`, payload);
      } else {
        await axios.post(VALUE_API, payload);
      }
      setName("");
      setAttribute("");
      setType("");
      setCategory("");
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setAttribute(item.attributes);
    const attr = attributes.find((a) => a.id === item.attributes);
    if (attr) {
      setCategory(attr.category.toString());
      setType(attr.type.toString());
    }
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

  const filteredCategories = categories.filter(
    (c) => c.type === parseInt(type)
  );

  const filteredAttributes = attributes.filter(
    (a) => a.category === parseInt(category)
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">مدیریت مقدار خصوصیت‌ها</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {/* Step 1: Type */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCategory("");
            setAttribute("");
          }}
          className="border border-gray-300 p-2 rounded w-64"
          required
        >
          <option value="">انتخاب نوع</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Step 2: Category (depends on Type) */}
        {type && (
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setAttribute("");
            }}
            className="border border-gray-300 p-2 rounded w-64"
            required
          >
            <option value="">انتخاب کتگوری</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* Step 3: Attribute (depends on Category) */}
        {category && (
          <select
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
            className="border border-gray-300 p-2 rounded w-64"
            required
          >
            <option value="">انتخاب خصوصیت</option>
            {filteredAttributes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        )}

        {/* Step 4: Name + Submit (depends on Attribute) */}
        {attribute && (
          <>
            <input
              type="text"
              placeholder="نام مقدار"
              className="border border-gray-300 p-2 rounded w-64"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "ویرایش" : "اضافه کردن"}
            </button>
          </>
        )}
      </form>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <ul className="space-y-2">
          {(attribute
            ? values.filter((v) => v.attributes === parseInt(attribute)) // ✅ filter when attribute is selected
            : values
          ) // ✅ otherwise show all values
            .map((item) => {
              const attr = attributes.find((a) => a.id === item.attributes);
              return (
                <li
                  key={item.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      خصوصیت: {attr?.name || "—"}
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
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default SubMenu4;
