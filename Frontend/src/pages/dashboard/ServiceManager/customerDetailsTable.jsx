import React, { useEffect, useState } from "react";
import axios from "axios";
import { floors, months } from "./Hook/rentConstant";
import AddCustomers from "./Hook/AddCustomer";
import PrintBillModal from "../pages/PrintBillModal";
import Swal from "sweetalert2";
import { Printer, ArrowDownToLine } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;


const CustomerDetailsTable = ({
  setIsDetailModalOpen,
  data,
  type,
  setIsDetailFormOpen,
}) => {
  const [customers, setCustomers] = useState(data.customers_list || {}); // Ensure initial state is object
  const [shopkeepers, setShopKeepers] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [error, setError] = useState(null); // Add error state



  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedCustomerForPrint, setSelectedCustomerForPrint] =
    useState(null);

  const apiUrl =
    type === "service"
      ? `${BASE_URL}/services/${data.id}/`
      : `${BASE_URL}/rent/${data.id}/`;

  const handleInputChange = (customerId, field, value) => {
    const parsedValue = parseFloat(value) || 0;

    setCustomers((prev) => {
      const currentCustomer = prev[customerId] || {}; // Handle case where customer might not exist yet
      const updatedCustomer = {
        ...currentCustomer,
        [field]: parsedValue,
      };

      // Dynamically calculate remainder
      const total = parseFloat(
        type === "service" ? updatedCustomer.service : updatedCustomer.rant || 0
      );
      const taken = parseFloat(updatedCustomer.taken || 0);
      const remainder = total - taken;

      return {
        ...prev,
        [customerId]: {
          ...updatedCustomer,
          remainder: isNaN(remainder) ? 0 : remainder, // Ensure remainder is a number
        },
      };
    });

    // Prepare data for PATCH request
    setUpdatedData((prev) => {
      const currentUpdate = prev[customerId] || {};
      // Calculate remainder for the PATCH data as well
      const total = parseFloat(
        type === "service"
          ? field === "service"
            ? parsedValue
            : customers[customerId]?.service || 0
          : field === "rant"
          ? parsedValue
          : customers[customerId]?.rant || 0
      );
      const taken = parseFloat(
        field === "taken" ? parsedValue : customers[customerId]?.taken || 0
      );
      const calculatedRemainder = total - taken;

      return {
        ...prev,
        [customerId]: {
          ...currentUpdate, // Keep other potential fields if needed
          [field]: parsedValue, // Update the changed field
          // We don't strictly need to send remainder, backend recalculates, but good for consistency
          remainder: isNaN(calculatedRemainder) ? 0 : calculatedRemainder,
        },
      };
    });
  };

  const handleSubmit = async () => {
    // Filter out entries from updatedData where only remainder was calculated client-side
    const dataToSend = {};
    for (const [custId, custData] of Object.entries(updatedData)) {
      // Only include if 'rant'/'service' or 'taken' was explicitly changed
      if (
        custData.hasOwnProperty("rant") ||
        custData.hasOwnProperty("service") ||
        custData.hasOwnProperty("taken")
      ) {
        // Create a clean object without the possibly stale client-side remainder
        const { remainder, ...rest } = custData;
        dataToSend[custId] = rest;

        // Optionally ensure 'taken' is present if 'rant'/'service' changed but 'taken' didn't
        if (!dataToSend[custId].hasOwnProperty("taken")) {
          dataToSend[custId].taken = customers[custId]?.taken || 0;
        }
        // Optionally ensure 'rant'/'service' is present if 'taken' changed but 'rant'/'service' didn't
        const totalField = type === "service" ? "service" : "rant";
        if (!dataToSend[custId].hasOwnProperty(totalField)) {
          dataToSend[custId][totalField] = customers[custId]?.[totalField] || 0;
        }
      }
    }

    // Only send if there's actual data changed by the user
    if (Object.keys(dataToSend).length === 0) {
      console.log("No changes detected to submit.");
      // setDetailModalOpen(false); // Optionally close if no changes
      alert("هیچ تغییری برای ثبت وجود ندارد.");
      return;
    }

    try {
      await axios.patch(apiUrl, {
        floor: data.floor,
        time: data.time,
        year: data.year,
        customers_list: dataToSend, // Send only the changes
      });
      Swal.fire({
        icon: "success",
        title: "سفارش بروزرسانی شد",
        text: `وضعیت سفارش به 'کامل' تغییر کرد.`,
        confirmButtonText: "باشه",
      });
      setIsDetailModalOpen(false); // Close modal on successful save
      setIsDetailFormOpen(false);
    } catch (error) {
      console.error("خطا در به‌روزرسانی اطلاعات:", error);
      // Provide more specific error feedback if possible
      let errorMsg = "به‌روزرسانی ناموفق بود.";
      if (error.response && error.response.data) {
        // Try to get specific errors from backend response
        errorMsg += `\n ${JSON.stringify(error.response.data)}`;
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/customers/`);
      setShopKeepers(response.data);
      setError(null); // Clear error on successful fetch
    } catch (err) {
      setError("خطا در دریافت اطلاعات مشتریان");
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // Set initial state for updatedData based on fetched customers,
    // so subsequent calculations work correctly if user only changes one field.
    setUpdatedData(data.customers_list || {});
  }, [data.customers_list]); // Rerun if the initial data changes

  // --- Handlers for Print Modal ---
  const handlePrintClick = (customerId, customerRowData) => {
    const shopkeeper = shopkeepers.find((shpkpr) => shpkpr.id == customerId);
    if (!shopkeeper) {
      console.warn("Shopkeeper data not found for ID:", customerId);
      alert("اطلاعات کامل مشتری برای چاپ یافت نشد.");
      return;
    }

    const printData = {
      name: shopkeeper.name,
      father_name: shopkeeper.father_name, // Make sure this field exists in your API response
      shop: customerRowData.shop, // Get shop from the row data (added in backend)
      taken: customerRowData.taken,
      remainder: customerRowData.remainder,
      floor: customerRowData.floor,
      // Optional: Add total if needed
      // totalAmount: type === 'service' ? customerRowData.service : customerRowData.rant,
      // type: type
    };
    setSelectedCustomerForPrint(printData);
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setSelectedCustomerForPrint(null);
  };
  // --- End Handlers for Print Modal ---

  // Calculate totals locally based on current `customers` state for display
  const localTotals = React.useMemo(() => {
    let total_rent_service = 0;
    let total_taken = 0;
    Object.values(customers).forEach((cust) => {
      const amount = parseFloat(
        type === "service" ? cust.service : cust.rant || 0
      );
      const taken = parseFloat(cust.taken || 0);
      if (!isNaN(amount)) {
        total_rent_service += amount;
      }
      if (!isNaN(taken)) {
        total_taken += taken;
      }
    });
    const total_remainder = total_rent_service - total_taken;
    return {
      total: total_rent_service,
      total_taken: total_taken,
      total_remainder: total_remainder,
    };
  }, [customers, type]);

  return (
    // Added key to force re-render if data.id changes, ensuring fresh state
    <div key={data.id}>
      <div className="container mx-auto p-6 text-right">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <p>
            <strong>منزل:</strong>{" "}
            {floors.find((floor) => floor.value == data.floor)?.label ||
              data.floor}
          </p>
          <p>
            <strong>سال:</strong> {data.year}
          </p>
          <p>
            <strong>ماه:</strong>
            {months.find((month) => month.value == data.time)?.label ||
              data.time}
          </p>
          <p>
            <strong>مجموع ({type === "service" ? "خدمات" : "کرایه"}):</strong>{" "}
            {localTotals.total?.toLocaleString()}
          </p>
          <p>
            <strong>مجموع گرفته‌شده:</strong>{" "}
            {localTotals.total_taken?.toLocaleString()}
          </p>
          <p>
            <strong>مجموع باقیمانده:</strong>{" "}
            {localTotals.total_remainder?.toLocaleString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">مشتری</th>
                <th className="border p-2">شماره دوکان</th>
                {/* Add Shop Header */}
                <th className="border p-2">
                  مجموع ({type === "service" ? "خدمات" : "کرایه"})
                </th>
                <th className="border p-2">دریافتی</th>
                <th className="border p-2">باقیمانده</th>
                <th className="border p-2 print:hidden">چاپ رسید</th>{" "}
                {/* Add Print Header */}
              </tr>
            </thead>
            <tbody>
              {Object.entries(customers).length > 0 ? (
                Object.entries(customers).map(([id, customer]) => {
                  // Calculate remainder dynamically for display
                  const displayTotal = parseFloat(
                    type === "service" ? customer.service : customer.rant || 0
                  );
                  const displayTaken = parseFloat(customer.taken || 0);
                  const displayRemainder =
                    isNaN(displayTotal) || isNaN(displayTaken)
                      ? "N/A"
                      : (displayTotal - displayTaken).toLocaleString();

                  return (
                    <tr
                      key={id}
                      className="border hover:bg-gray-50 text-center"
                    >
                      <td className="border p-2">
                        {shopkeepers.find((shpkpr) => shpkpr.id == id)?.name ||
                          "..."}
                      </td>
                      <td className="border p-2">
                        {customer.shop
                          ? customer.shop.replace(/[\[\]']/g, "") || "نامشخص"
                          : "نامشخص"}
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={
                            type === "service"
                              ? customer.service ?? "" // Use empty string if null/undefined
                              : customer.rant ?? ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              id,
                              type === "service" ? "service" : "rant",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded text-right"
                          min="0" // Prevent negative numbers
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={customer.taken ?? ""} // Use empty string if null/undefined
                          onChange={(e) =>
                            handleInputChange(id, "taken", e.target.value)
                          }
                          className="w-full p-1 border rounded text-right"
                          min="0" // Prevent negative numbers
                        />
                      </td>
                      <td className="border p-2">
                        {/* Display calculated remainder */}
                        {displayRemainder}
                      </td>
                      {/* Print Button Cell */}
                      <td className="border p-2 print:hidden">
                        <button
                          onClick={() => handlePrintClick(id, customer)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="چاپ رسید برای این مشتری" // Tooltip
                        >
                          <Printer size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    هیچ مشتری در این لیست وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="  justify-between items-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
            disabled={Object.keys(updatedData).length === 0} // Disable if no changes tracked
          >
            ثبت تغییرات
          </button>
          {/* AddCustomers Button (assuming it opens its own modal) */}
          <AddCustomers
            type={type}
            data={data}
            // Removed setIsRentModalOpen prop if AddCustomers handles its own state
            setIsDetailModalOpen={setIsDetailModalOpen} // To potentially close parent after adding
            setIsDetailFormOpen={setIsDetailFormOpen}
          />
        </div>
      </div>

      {/* Render the Print Modal */}
      <PrintBillModal
        isOpen={isPrintModalOpen}
        onClose={handleClosePrintModal}
        customerData={selectedCustomerForPrint}
        // logoUrl="/path/to/your/logo.png" // Optional: Pass logo URL if needed here
      />
    </div>
  );
};

export default CustomerDetailsTable;
