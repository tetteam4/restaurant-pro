import React from "react";
import { floors } from "./Hook/rentConstant";
function FilterServices({
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
  filterFloor,
  setFilterFloor,
  years,
  shamsiMonths,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-2 text-right">فیلتر سرویس‌ها</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="filterYear"
            className="block text-right text-gray-700 text-md font-bold mb-2"
          >
            سال:
          </label>
          <select
            id="filterYear"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">همه سال‌ها</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filterMonth"
            className="block text-right text-gray-700 text-md font-bold mb-2"
          >
            ماه:
          </label>
          <select
            id="filterMonth"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">همه ماه‌ها</option>
            {shamsiMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="filterFloor"
            className="block text-right text-gray-700 text-md font-bold mb-2"
          >
            طبقه:
          </label>
          {/* <select
            id="filterFloor"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
          >
            <option value="">همه طبقات</option>
            {[1, 2, 3, 4, 5].map((floor) => (
              <option key={floor} value={String(floor)}>
                {floor}
              </option>
            ))}
          </select> */}

          <select
            id="filterFloor"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
          >
            <option value="">همه طبقات</option>
            {floors.map((floor) => (
              <option key={floor.value} value={String(floor.value)}>
                {floor.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterServices;
