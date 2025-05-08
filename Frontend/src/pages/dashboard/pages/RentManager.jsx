import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment-jalaali";
import { RentForm } from "../ServiceManager/Hook/rentForm";
import { floors, months } from "../ServiceManager/Hook/rentConstant";
import { Edit, Trash } from "lucide-react";
import CustomerDetailsTable from "../ServiceManager/customerDetailsTable";
import useYearMonth from "../pages/useYearMonth.jsx";
import FilterRants from "../../dashboard/pages/FilterRants";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Rent() {
  const [rants, setRants] = useState([]);
  const [selectedRant, setSelectedRant] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const { years: availableYears } = useYearMonth(
    String(moment().jYear()),
    months[0].label
  );
  const [form, setForm] = useState({
    floor: 0,
    time: months[0].value,
    year: String(moment().jYear()),
    total: 0,
    customers_list: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterFloor, setFilterFloor] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const years = useMemo(() => availableYears, [availableYears]);

  useEffect(() => {
    fetchRants();
  }, [isDetailModalOpen]);

  const fetchRants = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/rent/`);
      setRants(data);
    } catch (error) {
      toast.error("دریافت اطلاعات کرایه‌ها ناکام شد!");
      console.error("Error fetching rants:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/rent/${editingId}/`, form);
        toast.success("کرایه با موفقیت ویرایش شد.");
      } else {
        await axios.post(`${BASE_URL}/rent/`, form);
        toast.success("کرایه با موفقیت اضافه شد.");
      }
      setForm({
        floor: 0,
        time: months[0].value,
        year: String(moment().jYear()),
        total: 0,
        customers_list: 0,
      });
      setEditingId(null);
      setIsFormVisible(false);
      fetchRants(); // Refetch data
    } catch (error) {
      const action = editingId ? "ویرایش" : "اضافه کردن";
      toast.error(`عملیات ${action} کرایه ناکام شد!`);
      console.error("Error submitting rent:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عملیات غیرقابل بازگشت است!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/rent/${id}/`);
        toast.success("رکورد مورد نظر با موفقیت حذف شد.");
        fetchRants(); // Refetch data
      } catch (error) {
        toast.error("حذف رکورد ناکام شد!");
        console.error("Error deleting rent:", error);
      }
    }
  };

  // Kept original handlers
  const handleRowClick = (rant) => {
    setSelectedRant(rant);
    setDetailModalOpen(true);
  };

  const handleEdit = (rant) => {
    setForm({ ...rant });
    setEditingId(rant.id);
    setIsFormVisible(true);
  };

  const filteredRants = useMemo(() => {
    let filtered = [...rants];

    if (filterYear) {
      filtered = filtered.filter(
        (rant) => String(rant.year) === String(filterYear)
      );
    }

    if (filterMonth) {
      const monthObject = months.find((m) => m.label === filterMonth);
      if (monthObject) {
        filtered = filtered.filter(
          (rant) => String(rant.time) === String(monthObject.value)
        );
      }
    }

    if (filterFloor) {
      const floorObject = floors.find((f) => f.label === filterFloor);
      if (floorObject) {
        filtered = filtered.filter(
          (rant) => String(rant.floor) === String(floorObject.value)
        );
      }
    }

    return filtered;
  }, [rants, filterYear, filterMonth, filterFloor, floors]); // Added floors as it's used in the filter logic now

  const pageCount = Math.ceil(filteredRants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRants = filteredRants.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md mx-1 ${
            // Added mx-1 for spacing
            currentPage === i
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  const totals = currentRants.reduce(
    (acc, rant) => {
      acc.total += parseFloat(rant.total) || 0;
      acc.total_taken += parseFloat(rant.total_taken) || 0;
      return acc;
    },
    { total: 0, total_taken: 0 }
  );

  totals.remaining = totals.total - totals.total_taken;

  const getFloorLabel = (value) =>
    floors.find((f) => f.value === value)?.label || value;
  const getMonthLabel = (value) =>
    months.find((m) => m.value === value)?.label || value;

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer
        position="top-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className=" mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">مدیریت کرایه</h2>
        {!isFormVisible && (
          <div className="my-5 flex justify-center">
            <button
              onClick={() => {
                setEditingId(null);
                setForm({
                  floor: 0,
                  time: months[0].value,
                  year: String(moment().jYear()),
                  total: 0,
                  customers_list: 0,
                });
                setIsFormVisible(true);
              }}
              className="mb-4 bg-green-500 cursor-pointer hover:bg-green-600 text-white p-2 rounded" // Added hover effect
            >
              اضافه کردن کرایه
            </button>
          </div>
        )}
        {isFormVisible && (
          <RentForm
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            setIsFormVisible={setIsFormVisible}
          />
        )}
        <FilterRants
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterFloor={filterFloor}
          setFilterFloor={setFilterFloor}
          years={years}
          months={months}
          floors={floors}
        />
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-t-md overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr className="bg-primary text-white text-md font-semibold uppercase tracking-wider">
                <th className="border border-gray-300 py-3 px-4">طبقه</th>
                <th className="border border-gray-300 py-3 px-4">سال</th>
                <th className="border border-gray-300 py-3 px-4">ماه</th>
                <th className="border border-gray-300 py-3 px-4">مجموعی</th>
                <th className="border border-gray-300 py-3 px-4">دریافتی</th>
                <th className="border border-gray-300 py-3 px-4">باقی</th>
                <th className="border border-gray-300 py-3 px-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {currentRants.length > 0 ? (
                currentRants.map((rant) => (
                  <tr
                    key={rant.id}
                    className="border-b border-gray-300 text-center hover:bg-gray-100 transition-colors duration-200" // Slightly adjusted hover/border
                  >
                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {getFloorLabel(rant.floor)}
                    </td>
                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {rant.year}
                    </td>
                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {getMonthLabel(rant.time)}
                    </td>

                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {rant.total?.toLocaleString()}{" "}
                    </td>
                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {rant.total_taken?.toLocaleString()}{" "}
                    </td>
                    <td
                      onClick={() => handleRowClick(rant)}
                      className="p-3 cursor-pointer"
                    >
                      {(rant.total - rant.total_taken)?.toLocaleString()}{" "}
                    </td>
                    <td className="p-2">
                      {" "}
                      <div className="flex justify-center items-center gap-3">
                        {" "}
                        <button
                          title="ویرایش" // Add tooltips
                          onClick={() => handleEdit(rant)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-110"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          title="حذف" // Add tooltips
                          onClick={() => handleDelete(rant.id)}
                          className="text-red-600 hover:text-red-800 transition-all transform duration-300 hover:scale-110"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    {rants.length === 0
                      ? "داده‌ای برای نمایش وجود ندارد."
                      : "هیچ رکوردی با فیلترهای انتخابی یافت نشد."}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold text-center text-gray-700">
              <tr>
                <td
                  colSpan="3"
                  className="py-3 px-4 border border-t-2 border-gray-300"
                >
                  جمع کل
                </td>
                <td className="py-3 px-4 border border-t-2 border-gray-300">
                  {totals.total.toLocaleString()}
                </td>
                <td className="py-3 px-4 border border-t-2 border-gray-300">
                  {totals.total_taken.toLocaleString()}
                </td>
                <td className="py-3 px-4 border border-t-2 border-gray-300">
                  {totals.remaining.toLocaleString()}
                </td>
                <td className="py-3 px-4 border border-t-2 border-gray-300">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* Original pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center p-4 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
            >
              قبلی
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
            >
              بعدی
            </button>
          </div>
        )}
      </div>

      {/* Original modal structure */}
      {isDetailModalOpen && selectedRant && (
        <div className="fixed inset-0 bg-black/50  backdrop-blur-md flex  justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-2/3  max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                جزئیات رکورد
              </h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-red-500 hover:text-red-700 text-2xl font-bold"
                aria-label="بستن" // Accessibility
              >
                بستن
              </button>
            </div>
            <CustomerDetailsTable
              setDetailModalOpen={setDetailModalOpen}
              data={selectedRant}
              type="rent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
