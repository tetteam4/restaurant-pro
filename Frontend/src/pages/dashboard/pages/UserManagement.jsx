import { useEffect, useState } from "react";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: null,
    password: "",
    password_confirm: "",
  });

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/role/`);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/create/`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      
      await axios.post(`${BASE_URL}/user/create/`, formData);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: null,
        password: "",
        password_confirm: "",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="p-2 border rounded"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="p-2 border rounded"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-2 border rounded"
        />
        <input
          name="password_confirm"
          type="password"
          value={formData.password_confirm}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded"
        >
          Create User
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
