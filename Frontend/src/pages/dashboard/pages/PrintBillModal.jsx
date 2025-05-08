import React from "react";
import moment from "moment-jalaali";

const PrintBillModal = ({ isOpen, onClose, customerData, companyInfo }) => {
  const defaults = {
    name: "  مارکیت تجارتی حسین زاده ستی سنتر ",
    address: "آدرس دشت برچی، گولای مهتاب قلعه ",
    logo: "/logo.png",
    contact: " hzcitycente.com |+93 72 950 2724",
  };
  const currentCompanyInfo = { ...defaults, ...companyInfo };

  if (!isOpen || !customerData) return null;

  const handlePrint = () => window.print();

  const todayJalali = moment().format("jYYYY/jMM/jDD");
  const billNumber =
    customerData.billNumber ||
    `INV-${String(customerData.id || Math.floor(Math.random() * 1000)).padStart(
      4,
      "0"
    )}`;

  const formatCurrency = (amount) =>
    (amount ?? 0).toLocaleString("fa-IR") + " افغانی";

  const takenAmount = customerData.taken ?? 0;
  const remainderAmount = customerData.remainder ?? 0;
  const totalDue = takenAmount + remainderAmount;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center z-50 print:bg-transparent print:p-0 print:items-start">
      <div
        id="printable-area"
        className="bg-white shadow-xl w-[148mm] h-[210mm] overflow-hidden relative print:shadow-none print:w-full print:h-full"
        style={{ direction: "rtl" }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-10 print:opacity-15 z-0">
          <img
            src={currentCompanyInfo.logo}
            alt="Watermark"
            className="w-full h-full object-contain object-center"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className="mb-2 border-b-8 border-red-600">
            <div className="bg-primary text-white p-3 flex flex-col items-center">
              <h1 className="text-xl font-bold mb-1">
                {currentCompanyInfo.name}
              </h1>
              <div className="text-xs text-center">
                {currentCompanyInfo.address}
              </div>
            </div>
          </div>

          <div className="px-4 py-1 bg-gray-100 flex justify-between text-xs mb-3">
            <div>
              <span className="font-semibold">شماره سند: </span>
              <span className="font-mono">{billNumber}</span>
            </div>
            <div>
              <span className="font-semibold">تاریخ: </span>
              {todayJalali}
            </div>
          </div>

          <div className="px-4 flex-grow">
            <div className="mb-4">
              <div className="p-2 rounded mb-2">
                <h3 className="text-xs font-semibold text-blue-800 mb-1">
                  مشخصات پرداخت کننده
                </h3>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <strong>نام:</strong> {customerData.name || "______"}
                  </div>
                  <div>
                    <strong>نام پدر:</strong>{" "}
                    {customerData.father_name || "______"}
                  </div>
                  <div>
                    <strong>شماره دوکان:</strong>{" "}
                    {customerData.shop || "______"}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment details section */}
            <div className="p-2 rounded">
              <h3 className="text-xs font-semibold text-green-800 mb-2">
                جزئیات پرداخت
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span>مبلغ کل:</span>
                  <span className="text-red-600">
                    {formatCurrency(totalDue)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>مبلغ دریافت شده:</span>
                  <span className="font-semibold">
                    {formatCurrency(takenAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>باقیمانده قبلی:</span>
                  <span className="font-semibold">
                    {formatCurrency(remainderAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature and footer section */}
          <div className="px-4 mt-auto pb-4">
            <div className="border-t border-gray-300 pt-2 flex justify-between">
              <div className="text-center">
                <div className="mb-4 border-t-2 border-dashed w-28 mx-auto pt-1">
                  <span className="text-xs text-gray-600">
                    امضای دریافت کننده
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-4 border-t-2 border-dashed w-28 mx-auto pt-1">
                  <span className="text-xs text-gray-600">
                    مهر و امضای مجاز
                  </span>
                </div>
              </div>
            </div>

            {/* Company contact information footer */}
            <div className="bg-primary mt-6 text-white text-center py-1 rounded-b">
              <div dir="ltr" className="text-xs">
                {currentCompanyInfo.contact}
              </div>
            </div>
          </div>
        </div>

        {/* Print-specific styles */}
        <style jsx global>{`
          @media print {
            @page {
              size: A5 portrait;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              background: white !important;
              margin: 0;
              padding: 0;
            }
            #printable-area {
              width: 148mm !important;
              height: 210mm !important;
              box-shadow: none !important;
              margin: 0;
              padding: 0;
            }
            .bg-gray-100 {
              background-color: #f3f4f6 !important;
            }
            .bg-primary {
              background-color: #3b82f6 !important;
            }
            .text-blue-800 {
              color: #1e40af !important;
            }
            .text-green-800 {
              color: #166534 !important;
            }
          }
        `}</style>
      </div>

      {/* Action buttons (hidden when printing) */}
      <div className="absolute bottom-10 left-4 print:hidden flex gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          بستن
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          چاپ رسید
        </button>
      </div>
    </div>
  );
};

export default PrintBillModal;
