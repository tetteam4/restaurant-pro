import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/core/`)
      .then((response) => {
        setServices(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Services</h2>
      <ul className="space-y-2">
        {services.map((service) => (
          <li
            key={service.id}
            className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            {service.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
