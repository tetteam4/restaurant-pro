import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../../state/userSlice/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundColorPicker from "./BackgroundColorPicker";

const PageSetting = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [userSettings, setUserSettings] = useState({
    email: "", // Initialize with empty strings
    phone_number: "",
    old_password: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUserSettings({
        email: currentUser.email || "",
        phone_number: currentUser.phone_number || "",
        old_password: "",
        password: "",
        confirm_password: "",
      });
    }
  }, [currentUser]);

  const handleChange = (field, value) => {
    setUserSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userSettings.password !== userSettings.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      if (!currentUser || !currentUser.id) {
        toast.error("User ID is not available. Please refresh the page.");
        return;
      }

      const userId = currentUser.id;
      const response = await dispatch(
        updateUser({ id: userId, userData: userSettings })
      );

      if (response.payload.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(response.payload.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("An error occurred while updating settings.");
    }
  };

  if (loading) {
    return <div>Loading settings...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div className="p-6 bg-gray-100 ">
      <BackgroundColorPicker />
    </div>
  );
};

export default PageSetting;
