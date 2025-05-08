import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../state/userSlice/userSlice";
import { toast } from "react-toastify";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiActivity,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateUser = () => {
  const dispatch = useDispatch();
  const { loading: createLoading, error: createError } = useSelector(
    (state) => state.user
  );
  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "",
    password: "",
    password_confirm: "",
  });

  const roles = {
    0: "ادمین",
    1: "مدیر",
    3: "صاحب امتیاز",
  };

  const fetchUsers = async () => {
    setListLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/user/`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setListError(err.message);
      toast.error("خطا در دریافت لیست کاربران");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      toast.error("گذرواژه و تکرار آن مطابقت ندارند!");
      return;
    }

    try {
      await dispatch(
        createUser({
          ...formData,
          role: parseInt(formData.role),
        })
      ).unwrap();

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: "",
        password: "",
        password_confirm: "",
      });

      await fetchUsers();
      setShowModal(false);
      toast.success("کاربر با موفقیت ایجاد شد!");
    } catch (err) {
      toast.error(
        `خطا در ایجاد کاربر: ${err?.detail || err || "خطای ناشناخته"}`
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="w-full max-w-8xl mx-auto p-6 space-y-8 font-vazir"
      dir="rtl"
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        rtl={true}
        theme="colored"
        bodyClassName="font-vazir"
      />

      {/* Create User Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
        >
          <FiPlus className="text-lg" />
          ایجاد کاربر جدید
        </button>
      </div>

      {/* Users List Table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">لیست کاربران</h2>
        </div>

        {listLoading ? (
          <div className="p-8 text-center text-gray-500">
            <PulseLoader size={10} color="#3B82F6" />
            <p className="mt-4">در حال دریافت کاربران...</p>
          </div>
        ) : listError ? (
          <div className="p-8 text-center text-red-500">خطا: {listError}</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            هیچ کاربری یافت نشد
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium text-center w-20"></th>
                  <th className="px-4 py-3 font-medium text-right">
                    نام کاربر
                  </th>
                  <th className="px-4 py-3 font-medium text-right">ایمیل</th>
                  <th className="px-4 py-3 font-medium text-right">نقش</th>
                  <th className="px-4 py-3 font-medium text-center">وضعیت</th>
                  <th className="px-4 py-3 font-medium text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center">
                      {user.profile_pic_url ? (
                        <img
                          src={`${BASE_URL}${user.profile_pic_url}`}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mx-auto">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                        {roles[user.role] || "نا مشخص"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl shadow-lg mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                ایجاد کاربر جدید
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  icon: FiUser,
                  name: "first_name",
                  label: "نام",
                  type: "text",
                },
                {
                  icon: FiUser,
                  name: "last_name",
                  label: "نام خانوادگی",
                  type: "text",
                },
                { icon: FiMail, name: "email", label: "ایمیل", type: "email" },
                {
                  icon: FiPhone,
                  name: "phone_number",
                  label: "شماره تماس",
                  type: "tel",
                },
                {
                  icon: FiChevronDown,
                  name: "role",
                  label: "نقش",
                  type: "select",
                  options: Object.entries(roles),
                },
                {
                  icon: FiLock,
                  name: "password",
                  label: "گذرواژه",
                  type: "password",
                },
                {
                  icon: FiLock,
                  name: "password_confirm",
                  label: "تکرار گذرواژه",
                  type: "password",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                      >
                        <option value="">انتخاب کنید</option>
                        {field.options.map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder={field.label}
                        required={field.type !== "tel"}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="md:col-span-2 flex gap-4 justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-red-600 hover:bg-red-500 hover:text-white rounded-lg border transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-60 transition-all"
                >
                  {createLoading ? (
                    <PulseLoader size={8} color="#fff" />
                  ) : (
                    "ایجاد کاربر"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateUser;

