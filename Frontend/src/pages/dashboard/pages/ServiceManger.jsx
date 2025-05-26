import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ServiceManager() {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [visibleAttributes, setVisibleAttributes] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attributeValues, setAttributeValues] = useState([]);
  const [attributeInputs, setAttributeInputs] = useState({});
  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/attribute/value/`)
      .then((res) => {
        setAttributeValues(res.data.results);
        console.log(res.data.results);
      })

      .catch((err) => console.error("Failed to load attribute values:", err));
  }, []);

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

  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/category`)
      .then((res) => setCategories(res.data.results))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/attribute`)
      .then((res) => setAttributes(res.data.results))
      .catch((err) => console.error("Failed to load attributes:", err));
  }, []);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const filtered = attributes.filter((attr) => attr.category === catId);
    setVisibleAttributes(filtered);
  };

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
        attributes: attributeInputs, // ⬅️ Add this line
      };

      console.log("Submitting payload:", payload);

      await axios.post(`${BASE_URL}/orders/`, payload);
      setMessage("سفارش با موفقیت ثبت شد.");

      // Reset the form
      setCustomerName("");
      setSelectedType(types[0]?.id || "");
      setSelectedCategory("");
      setVisibleAttributes([]);
      setAttributeInputs({});
    } catch (error) {
      console.error("Order submission failed:", error);
      setMessage("ارسال سفارش ناکام ماند.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        مدیریت خدمات
      </h2>

      {/* Type Tabs */}
      <div className="flex flex-wrap justify-center gap-3 border-b pb-4">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              setSelectedCategory("");
              setVisibleAttributes([]);
            }}
            className={`px-5 py-2 rounded-full transition-all duration-300 font-semibold 
            ${
              selectedType === type.id
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:scale-105"
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Category Buttons */}
      {selectedType && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories
            .filter((cat) => cat.type === selectedType)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-4 rounded-xl border transition-all duration-300 text-sm md:text-base font-medium 
                ${
                  selectedCategory === cat.id
                    ? "bg-green-500 text-white border-green-500 shadow-lg scale-105"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-green-100 hover:scale-105"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      )}

      {/* Attribute List */}
      {visibleAttributes.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            ویژگی‌های این کتگوری
          </h3>
          <div className="space-y-4">
            {visibleAttributes.map((attr) => {
              const attrName = attr.name; // Use name instead of ID
              const attrType = attr.type;
              const value = attributeInputs[attrName] || "";

              const options = attributeValues.filter(
                (val) => val.attributes === attr.id
              );

              return (
                <div key={attr.id}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {attrName}
                  </label>

                  {attrType === "input" && (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={value}
                      onChange={(e) =>
                        setAttributeInputs({
                          ...attributeInputs,
                          [attrName]: e.target.value,
                        })
                      }
                    />
                  )}

                  {attrType === "checkbox" && (
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={!!value}
                      onChange={(e) =>
                        setAttributeInputs({
                          ...attributeInputs,
                          [attrName]: e.target.checked,
                        })
                      }
                    />
                  )}

                  {attrType === "dropdown" && (
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={value} // <- you're storing the selected attribute name
                      onChange={(e) =>
                        setAttributeInputs({
                          ...attributeInputs,
                          [attrName]:
                            options.find(
                              (opt) => String(opt.id) === e.target.value
                            )?.name || "",
                        })
                      }
                    >
                      <option value="">انتخاب کنید</option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Input */}
      <div className="mt-6">
        <label className="block text-gray-700 font-semibold mb-2">
          نام مشتری
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="نام مشتری را وارد کنید"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-full font-bold shadow-md disabled:opacity-50"
        >
          {submitting ? "در حال ارسال..." : "ثبت سفارش"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <p
          className={`text-center font-medium mt-4 ${
            message.includes("موفق") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
