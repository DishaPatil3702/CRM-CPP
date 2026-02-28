// src/components/Sidebar.jsx
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <ul>
          <li className="mb-2">Dashboard</li>
          <li className="mb-2">Leads</li>
          <li className="mb-2">Settings</li>
        </ul>
      </div>

      {/* Bottom User Profile Section */}
      <div className="bg-gray-700 p-3 rounded-lg flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{user?.name || "User"}</p>
          <p className="text-sm text-gray-300 capitalize">
            {user?.role || "Role"}
          </p>
        </div>
      </div>

    </div>
  );
}