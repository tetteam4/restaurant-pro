import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ServiceManager() {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load types and set default selectedType
  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/`)
      .then((res) => {
        setTypes(res.data.results);
        if (res.data.results.length > 0) {
          setSelectedType(res.data.results[0].id);
        }
      })
      .catch((err) => console.error("Failed to load types:", err));
  }, []);

  // Load all categories
  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/category`)
      .then((res) => setCategories(res.data.results))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const handleSubmit = async () => {
    if (!customerName || !selectedType || !selectedCategory) {
      setMessage("لطفاً تمام فیلدها را تکمیل کنید.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        customer: customerName,
        category: selectedCategory,
        type: selectedType,
      };

      await axios.post(`${BASE_URL}/orders/`, payload);
      setMessage("سفارش با موفقیت ثبت شد.");

      setCustomerName("");
      setSelectedType(types[0]?.id || "");
      setSelectedCategory("");
    } catch (error) {
      console.error("Order submission failed:", error);
      setMessage("ارسال سفارش ناکام ماند.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Type Tabs */}
      <div className="flex space-x-3 mb-6 border-b border-gray-300 pb-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              setSelectedCategory("");
            }}
            className={`
          px-5 py-2 rounded-t-lg font-semibold transition
          ${
            selectedType === type.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }
        `}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Category Buttons */}
      {selectedType && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories
            .filter((cat) => cat.type === selectedType)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
              p-3 rounded-lg border font-medium transition
              ${
                selectedCategory === cat.id
                  ? "bg-green-500 text-white border-green-500 shadow-lg"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-green-100"
              }
            `}
              >
                {cat.name}
              </button>
            ))}
        </div>
      )}
    </>
  );
}
