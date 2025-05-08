import React, { useEffect, useState } from "react";
import axios from "axios";
import { shamsiMonths } from "../../../../utils/dateConvert";
import { FaPlus } from "react-icons/fa";
import StaffSalaryForm from "./staffSalaryForm";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const SalaryDetails = ({ data, setIsSalaryModalOpen }) => {
  const [shopkeepers, setShopKeepers] = useState([]);
  const [customers, setCustomers] = useState(data.customers_list);
  const [isSalaryForm, setIsSalaryForm] = useState(false);
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/staff/staff/`);
      setShopKeepers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (id, value, field) => {
    setCustomers((prev) => {
      const updated = {
        ...prev[id],
        [field]: parseFloat(value) || 0,
      };

      // Auto-calculate remainder when either value changes
      updated.remainder = (updated.salary || 0) - (updated.taken || 0);

      return {
        ...prev,
        [id]: updated,
      };
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`${BASE_URL}/staff/salaries/${data.id}/`, {
        customers_list: customers,
      });
      setIsSalaryModalOpen(false);
    } catch (err) {
      console.error("Error updating salary:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-2/3">
        <h1 className="text-3xl font-bold text-center mb-6">
          جزئیات پرداخت مشتریان
        </h1>

        <div key={data.id} className="mb-6 border p-4 rounded shadow">
          <p>
            <strong>سال:</strong> {data.year}
          </p>
          <p>
            <strong>ماه:</strong> {shamsiMonths[data.month - 1]}
          </p>
          <p>
            <strong>مجموع :</strong> {data.total}
          </p>
          <p>
            <strong>مقدار پرداخت شده:</strong> {data.total_taken}
          </p>
          <p>
            <strong>مقدار پرداخت نشده:</strong> {data.total - data.total_taken}
          </p>
          <table className="w-full mt-4 ">
            <thead>
              <tr className="bg-primary  text-white text-md font-semibold  uppercase tracking-wider">
                <th className="border p-2">کارمند</th>
                <th className="border p-2">مجموع</th>
                <th className="border p-2">مقدار پرداختی</th>
                <th className="border p-2">باقیمانده</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(customers).map(([id, customer]) => (
                <tr key={id} className="border-b text-center">
                  <td className="p-2">
                    {shopkeepers.find((shpkpr) => shpkpr.id == id)?.name ||
                      "در حال بارگزاری ..."}
                  </td>

                  {/* Editable Salary */}
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={customer.salary}
                      onChange={(e) =>
                        handleInputChange(id, e.target.value, "salary")
                      }
                    />
                  </td>

                  {/* Editable Taken */}
                  <td className="p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={customer.taken}
                      onChange={(e) =>
                        handleInputChange(id, e.target.value, "taken")
                      }
                    />
                  </td>

                  {/* Auto-calculated Remainder */}
                  <td className="p-2">{customer.salary - customer.taken}</td>
                </tr>
              ))}

              {/* Salary Form to Add New Staff */}
              {/* {isSalaryForm && ( */}
              <tr>
                <td colSpan={4}>
                  <StaffSalaryForm
                    id={data.id}
                    month={data.month}
                    year={data.year}
                  />
                </td>
              </tr>
              {/* )} */}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center items-center gap-5">
            <button
              className="bg-green-600 text-white py-2 px-7 rounded-md cursor-pointer hover:bg-green-700 transition-all"
              onClick={handleUpdate}
            >
              ثبت تغییرات
            </button>
            <button
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer py-2 px-4 rounded-md"
              onClick={() => setIsSalaryModalOpen(false)}
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
