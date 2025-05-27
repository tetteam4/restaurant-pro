import { useEffect, useState } from "react";
import axios from "axios";

export default function BackgroundColorPicker({ userId }) {
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    axios
      .get(`/api/user/settings/${userId}`)
      .then((res) => {
        const savedColor = res.data.backgroundColor || "#ffffff";
        setBgColor(savedColor);
        document.body.style.backgroundColor = savedColor;
      })
      .catch((err) => console.error("Failed to load color", err));
  }, [userId]);

  const handleChange = async (e) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    document.body.style.backgroundColor = newColor;

    try {
      await axios.patch(`/api/user/settings/${userId}`, {
        backgroundColor: newColor,
      });
    } catch (err) {
      console.error("Failed to save color:", err);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-gray-700 font-medium">رنگ پس‌زمینه:</label>
      <input
        type="color"
        value={bgColor}
        onChange={handleChange}
        className="w-16 h-10 border rounded cursor-pointer"
      />
    </div>
  );
}
