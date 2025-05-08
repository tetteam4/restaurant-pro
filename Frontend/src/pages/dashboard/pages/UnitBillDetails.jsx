import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const hijriMonths = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];

const UnitBillDetails = ({ data, setIsUnitBillModalOpen }) => {
  const [unitDetails, setUnitDetails] = useState(data.unit_details_list || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (unitId, value, field) => {
    setUnitDetails((prev) => {
      const currentUnitData = prev[unitId] || {};
      const updatedUnit = {
        ...currentUnitData,
        [field]: value,
      };

      if (field === "service_charge" || field === "amount_paid") {
        const charge = parseFloat(updatedUnit.service_charge || "0");
        const paid = parseFloat(updatedUnit.amount_paid || "0");
        updatedUnit.remainder = String(charge - paid);
      }

      return {
        ...prev,
        [unitId]: updatedUnit,
      };
    });
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {};
      for (const unitId in unitDetails) {
        const detail = unitDetails[unitId];
        dataToSend[unitId] = {
          ...detail, 
          service_charge: String(
            parseFloat(detail.service_charge || "0").toFixed(2)
          ),
          amount_paid: String(parseFloat(detail.amount_paid || "0").toFixed(2)),
          remainder: String(
            (
              parseFloat(detail.service_charge || "0") -
              parseFloat(detail.amount_paid || "0")
            ).toFixed(2)
          ),
          current_water_reading: String(
            parseFloat(detail.current_water_reading || "0").toFixed(2)
          ),
          current_electricity_reading: String(
            parseFloat(detail.current_electricity_reading || "0").toFixed(2)
          ),
        };
      }

      await axios.patch(`${BASE_URL}/units/bills/${data.id}/`, {
        unit_details_list: dataToSend,
      });

      toast.success("جزئیات بل با موفقیت بروزرسانی شد.");
      setIsUnitBillModalOpen(false);
    } catch (err) {
      console.error(
        "Error updating unit bill details:",
        err.response?.data || err.message
      );
      toast.error("خطا در بروزرسانی جزئیات بل.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    let currentTotalCharge = 0;
    let currentTotalPaid = 0;
    Object.values(unitDetails).forEach((detail) => {
      currentTotalCharge += parseFloat(detail.service_charge || "0");
      currentTotalPaid += parseFloat(detail.amount_paid || "0");
    });
    return {
      totalCharge: currentTotalCharge,
      totalPaid: currentTotalPaid,
      totalRemainder: currentTotalCharge - currentTotalPaid,
    };
  };
  const totals = calculateTotals();

  const formatNumber = (numStr) => {
    const num = parseFloat(numStr);
    if (isNaN(num)) {
      return "0.00";
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-md flex  justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-2/3  max-h-[90vh] overflow-y-auto">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800">
          جزئیات بل واحدها (قابل ویرایش)
        </h1>

        <div className="mb-6 border border-gray-200 bg-gray-50 p-4 rounded-md shadow-sm grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <p>
            <strong>سال:</strong> {data.year}
          </p>
          <p>
            <strong>ماه:</strong> {hijriMonths[data.month - 1]}
          </p>
          <p className="font-semibold">
            <strong>مجموع شارژ:</strong> {formatNumber(totals.totalCharge)}
          </p>
          <p>
            <strong>مجموع پرداختی:</strong> {formatNumber(totals.totalPaid)}
          </p>
          <p className="font-semibold">
            <strong>مجموع باقی:</strong> {formatNumber(totals.totalRemainder)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-primary text-white text-xs font-semibold uppercase tracking-wider text-center">
                <th className="border border-gray-300 p-2">نمبر واحد</th>
                <th className="border border-gray-300 p-2">نام ساکن</th>
                <th className="border border-gray-300 p-2">شارژ خدماتی</th>
                <th className="border border-gray-300 p-2">کنتور آب فعلی</th>
                <th className="border border-gray-300 p-2">کنتور برق فعلی</th>
                <th className="border border-gray-300 p-2">مقدار پرداختی</th>
                <th className="border border-gray-300 p-2">باقیمانده</th>
                <th className="border border-gray-300 p-2">توضیحات</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(unitDetails).length > 0 ? (
                Object.entries(unitDetails).map(([unitId, detail]) => (
                  <tr
                    key={unitId}
                    className="border-b border-gray-200 text-center hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 p-2 font-medium text-gray-800">
                      {detail.unit_number || "-"}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-700">
                      {detail.customer_name || "-"}
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full p-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={detail.service_charge || ""}
                        onChange={(e) =>
                          handleInputChange(
                            unitId,
                            e.target.value,
                            "service_charge"
                          )
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full p-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={detail.current_water_reading || ""}
                        onChange={(e) =>
                          handleInputChange(
                            unitId,
                            e.target.value,
                            "current_water_reading"
                          )
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full p-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={detail.current_electricity_reading || ""}
                        onChange={(e) =>
                          handleInputChange(
                            unitId,
                            e.target.value,
                            "current_electricity_reading"
                          )
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full p-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={detail.amount_paid || ""}
                        onChange={(e) =>
                          handleInputChange(
                            unitId,
                            e.target.value,
                            "amount_paid"
                          )
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-800">
                      {formatNumber(
                        parseFloat(detail.service_charge || "0") -
                          parseFloat(detail.amount_paid || "0")
                      )}
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        type="text"
                        className="w-full p-1.5 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={detail.description || ""}
                        onChange={(e) =>
                          handleInputChange(
                            unitId,
                            e.target.value,
                            "description"
                          )
                        }
                        placeholder="نوت..."
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    هیچ واحدی در این دوره بل وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" /* SVG */></svg>
            ) : (
              "ثبت تغییرات"
            )}
          </button>
          <button
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer py-2 px-5 rounded-md transition-colors disabled:opacity-50"
            onClick={() => setIsUnitBillModalOpen(false)}
            disabled={isLoading}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitBillDetails;
