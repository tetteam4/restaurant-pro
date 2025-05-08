import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Plus, X } from "lucide-react";

import ServiceTable from "../ServiceManager/ServiceTable";
import CustomerDetailsModal from "../ServiceManager/CustomerDetailsModal";
import FilterServices from "../ServiceManager/FilterServices";
import useServiceData from "../ServiceManager/Hook/useServiceData";
import useCustomerData from "../ServiceManager/Hook/useCustomerData";
import { shamsiMonths } from "../../../utils/dateConvert";
import ServiceForm from "../ServiceManager/ServiceForm";
export default function ServiceManager() {
  const [newService, setNewService] = useState({
    floor: 0,
    year: "",
    time: "",
  });

  const [editingService, setEditingService] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [isDetailFormOpen, setIsDetailFormOpen] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerServiceDetails, setCustomerServiceDetails] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const startYear = 1400;
  const endYear = 1430;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const {
    services,
    isLoading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
  } = useServiceData();
  const { customersList, customersInfo } = useCustomerData(
    services,
    selectedFloor
  );
  const [selectedServiceYear, setSelectedServiceYear] = useState("");
  const [selectedServiceTime, setSelectedServiceTime] = useState("");

  const handleYearSelect = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthSelect = (e) => {
    setSelectedMonth(e.target.value);
  };

  const closeModal = () => {
    setCustomerServiceDetails(null);
  };

  const handleOpenModal = () => {
    setShowServiceForm(true);
  };

  const saveService = async () => {
    if (!selectedYear || !selectedMonth) {
      console.log(newService.floor, selectedYear, selectedMonth);
      toast.error("لطفا طبقه, سال و ماه را وارد کنید!", {
        position: "top-left",
      });
      return;
    }

    const monthNumber = shamsiMonths.indexOf(selectedMonth) + 1;

    const serviceData = {
      floor: newService.floor,
      year: selectedYear,
      month: monthNumber,
      time: monthNumber,
      is_approved: newService.is_approved,
      customers_list: 0,
    };

    const success = editingService
      ? await updateService(editingService.id, serviceData)
      : await addService(serviceData);
    if (success) {
      resetForm();
      fetchServices();
    }
  };

  const removeService = async (id) => {
    const success = await deleteService(id);
    if (success) {
      fetchServices();
    }
  };

  const editService = useCallback(
    (service) => {
      const monthIndex = parseInt(service.month) - 1;

      setNewService({
        floor: service.floor,
        year: service.year,
        time: service.time,
        is_approved: service.is_approved,
      });
      setSelectedYear(service.year);
      setSelectedMonth(shamsiMonths[monthIndex]);
      setEditingService(service);
      setShowServiceForm(true);
    },
    [shamsiMonths]
  );

  const resetForm = useCallback(() => {
    setNewService({
      floor: 0,
      year: "",
      time: "",
      is_approved: false,
    });
    setSelectedYear("");
    setSelectedMonth("");
    setEditingService(null);
    setShowServiceForm(false);
  }, []);

  useEffect(() => {
    const fetchCustomerServiceDetails = async () => {
      if (selectedCustomer) {
        const customerData = customersList[selectedCustomer];
        if (customerData) {
          setCustomerServiceDetails(customerData);

          let serviceFound = null;
          for (const service of services) {
            if (
              service.customers_list &&
              service.customers_list[selectedCustomer]
            ) {
              serviceFound = service;
              break;
            }
          }

          if (serviceFound) {
            setSelectedServiceYear(serviceFound.year);
            setSelectedServiceTime(serviceFound.time);
          } else {
            setSelectedServiceYear("");
            setSelectedServiceTime("");
            console.warn("No service found for customer", selectedCustomer);
          }
        } else {
          setCustomerServiceDetails(null);
          console.warn(
            `Customer data not found in customersList for customer ID: ${selectedCustomer}`
          );
        }
      } else {
        setCustomerServiceDetails(null);
        setSelectedServiceYear("");
        setSelectedServiceTime("");
      }
    };

    fetchCustomerServiceDetails();
  }, [selectedCustomer, customersList, services]);

  useEffect(() => {
    fetchServices();
    console.log(isDetailFormOpen);
    setIsDetailFormOpen(true);
  }, [isDetailFormOpen]);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (filterYear) {
      filtered = filtered.filter((service) => service.year === filterYear);
    }

    if (filterMonth) {
      const monthIndex = shamsiMonths.indexOf(filterMonth) + 1;
      filtered = filtered.filter((service) => service.month === monthIndex);
    }

    if (filterFloor) {
      filtered = filtered.filter((service) => {
        return String(service.floor) === filterFloor;
      });
    }

    return filtered;
  }, [services, filterYear, filterMonth, filterFloor, shamsiMonths]);

  return (
    <div className="p-6 flex gap-6 relative">
      <ToastContainer
        position="top-left" // Adjusted for RTL layout potentially
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // Ensure Toastify respects RTL
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4 text-center">مدیریت سرویس‌ها</h2>
        {!showServiceForm && (
          <div className="my-5 flex justify-center">
            <button
              onClick={handleOpenModal}
              className="bg-green-500 hover:bg-green-700 cursor-pointer text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              افزودن سرویس
            </button>
          </div>
        )}

        {showServiceForm && (
          <ServiceForm
            newService={newService}
            setNewService={setNewService}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearSelect={handleYearSelect}
            onMonthSelect={handleMonthSelect}
            saveService={saveService}
            years={years}
            shamsiMonths={shamsiMonths}
            editingService={editingService}
            setShowServiceForm={setShowServiceForm}
          />
        )}

        <FilterServices
          filterYear={filterYear}
          setFilterYear={setFilterYear}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterFloor={filterFloor}
          setFilterFloor={setFilterFloor}
          years={years}
          shamsiMonths={shamsiMonths}
        />

        {isLoading && <p className="text-center">در حال بارگیری خدمات...</p>}
        {error && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}

        {filteredServices.length === 0 && !isLoading && (
          <p className="text-center">هیچ سرویسی یافت نشد</p>
        )}
        {filteredServices.length > 0 && (
          <ServiceTable
            setIsDetailFormOpen={setIsDetailFormOpen}
            services={filteredServices}
            fetchServices={fetchServices}
            editService={editService}
            removeService={removeService}
          />
        )}
      </div>
      <CustomerDetailsModal
        onClose={closeModal}
        customerServiceDetails={customerServiceDetails}
        customersInfo={customersInfo}
        selectedCustomer={selectedCustomer}
        selectedServiceYear={selectedServiceYear}
        selectedServiceTime={selectedServiceTime}
      />
    </div>
  );
}
