// src/pages/Dashboard.jsx
import { useTheme } from "../context/ThemeContext";
import { useRef } from "react";
import axios from "axios";
import { API } from "../services/api";
import formatINR from "../utils/formatCurrency";
import { useState, useEffect } from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, Users, DollarSign, TrendingUp, Phone, Mail, Calendar, 
  Plus, CheckCircle, Target, Clock, ArrowUpRight, ArrowDownRight,
  Activity, Star, RefreshCw, Download, Upload, FileText, MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { theme } = useTheme();
  const { token } = useAuth(); 
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const fileInputRef = useRef(null);
  
// 🔼 IMPORT
const handleImportClick = () => {
  fileInputRef.current.click();
};

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    //const token = 
   // localStorage.getItem("access_token") || 
    //localStorage.getItem("token");

    await axios.post(
      "http://127.0.0.1:8000/leads/import",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        } 
      }
  );  

  toast.success("Data imported successfully");
} catch (err) {
  toast.error("Import failed");
}

};

// 🔽 EXPORT
const handleExport = async () => {
  try {
   // const token =
      //localStorage.getItem("access_token") ||
      //localStorage.getItem("token");

    if (!token) {
      toast.error("Not logged in");
      return;
    }

    const res = await axios.get(
      "http://127.0.0.1:8000/leads/export",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.csv";
    link.click();

    toast.success("Export successful");
  } catch (err) {
    console.error(err);
    toast.error("Export failed");
  }
};


  // Enhanced stats with more detailed data and better colors
  const dashboardStats = [
    { 
      title: "Total Revenue", 
      value: stats ? formatINR(stats.total_revenue) : formatINR(0),
      change: "+12.5%", 
      icon: DollarSign, 
      trend: "up", 
      color: "emerald",
      subtext: "vs last month",
      chart: [65, 78, 85, 92, 98, 105, 112],
      gradient: "from-emerald-500 via-green-500 to-teal-500"
    },
    { 
      title: "Active Leads", 
      //value: "1,247", 
      value: stats ? stats.active_leads : "0",

      change: "+8.3%", 
      icon: Users, 
      trend: "up", 
      color: "blue",
      subtext: "424 new this week",
      chart: [45, 52, 48, 61, 67, 74, 82],
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      title: "Conversion Rate", 
      //value: "24.8%", 
      value: stats ? `${stats.conversion_rate}%` : "0%",

      change: "-2.1%", 
      icon: Target, 
      trend: "down", 
      color: "purple",
      subtext: "industry avg: 22%",
      chart: [28, 26, 29, 25, 23, 24, 25],
      gradient: "from-purple-500 via-violet-500 to-indigo-500"
    },
    { 
      title: "Deals Closed", 
      //value: "156", 
      value: stats ? stats.closed_deals : "0",

      change: "+18.2%", 
      icon: CheckCircle, 
      trend: "up", 
      color: "orange",
      //subtext: "$890K total value",
      subtext: "₹8.9L total value",
      chart: [12, 15, 18, 22, 28, 31, 35],
      gradient: "from-orange-500 via-amber-500 to-yellow-500"
    }
  ];

  

  const getActivityIcon = (type) => {
    const icons = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      'follow-up': Clock
    };
    return icons[type] || Activity;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-500 bg-red-100 dark:bg-red-900/30",
      medium: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
      low: "text-green-500 bg-green-100 dark:bg-green-900/30"
    };
    return colors[priority] || "text-gray-500";
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
  fetchStats();
  fetchActivities();
}, []);

const fetchStats = async () => {
  try {
    //const token =
      //localStorage.getItem("access_token") ||
      //localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load dashboard stats");
  }
};

const fetchActivities = async () => {
  try {
    //const token =
      //localStorage.getItem("access_token") ||
      //localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/dashboard/activities",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setActivities(res.data);
  } catch (err) {
    console.error(err);
  }
};

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-2xl">
              <BarChart3 className="w-14 h-14 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>Loading Dashboard</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Preparing your professional CRM workspace...</p>
          <div className="mt-6 flex justify-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }
  const handleGenerateReport = async () => {
  try {
    //const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/dashboard/generate-report",
      {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    link.click();
  } catch (err) {
    toast.error("Report failed");
  }
};
const handleSendCampaign = async () => {
  try {
    //const token = localStorage.getItem("token");

    const res = await axios.post(
  "http://127.0.0.1:8000/dashboard/send-campaign",
  {
    title: "Summer Offer Campaign",
    description: "50% discount for premium customers"
  },
  {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  }
);

    toast.success(res.data.message);
  } catch (err) {
    toast.error("Campaign failed");
  }
};

const handleSyncData = async () => {
  try {
   // const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://127.0.0.1:8000/dashboard/sync-data",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success(res.data.message);
  } catch (err) {
    toast.error("Sync failed");
  }
};

  return (
    <div className="p-8 space-y-8">
      {/* Enhanced Stats Cards with Better Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (

        
          <div key={index} className={`${isDark ? 'bg-gray-800/70 border-gray-700/50' : 'bg-white/70 border-white/50'} rounded-3xl p-6 backdrop-blur-xl border hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-bold px-3 py-1 rounded-full ${stat.trend === "up" ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>{stat.value}</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm mb-3 font-semibold`}>{stat.title}</p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{stat.subtext}</p>
              
              {/* Enhanced Mini Chart */}
              <div className="mt-4 flex items-end space-x-1 h-8">
                {stat.chart.map((value, idx) => (
                  <div
                    key={idx}
                    className={`bg-gradient-to-t ${stat.gradient} rounded-sm opacity-70 hover:opacity-100 transition-opacity`}
                    style={{ height: `${(value / Math.max(...stat.chart)) * 100}%`, width: '10px' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Quick Actions */}
      <div className={`${isDark ? 'bg-gray-800/70 border-gray-700/50' : 'bg-white/70 border-white/50'} rounded-3xl p-8 backdrop-blur-xl border shadow-xl`}> 
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { icon: Plus, label: "Add Lead", color: "from-blue-500 to-blue-600", onClick: () => toast("Navigate to Leads page to add leads") },
            { icon: Upload, label: "Import Data", color: "from-green-500 to-green-600", onClick: handleImportClick },
            { icon: Download, label: "Export Report", color: "from-purple-500 to-purple-600", onClick: handleExport },
            { icon: FileText, label: "Generate Report", color: "from-orange-500 to-orange-600", onClick: handleGenerateReport },
            { icon: MessageSquare, label: "Send Campaign", color: "from-pink-500 to-pink-600", onClick: handleSendCampaign },
            { icon: RefreshCw, label: "Sync Data", color: "from-indigo-500 to-indigo-600", onClick: handleSyncData }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`p-6 ${isDark ? 'bg-gray-700/70 hover:bg-gray-600/70 text-gray-200' : 'bg-white/70 hover:bg-white/90 text-gray-700'} rounded-2xl transition-all hover:shadow-xl transform hover:scale-105 border ${isDark ? 'border-gray-600' : 'border-gray-300'} group`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
        />

      </div>

            {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Enhanced Recent Activities */}
        <div className="xl:col-span-8">
          <div className={`${isDark ? 'bg-gray-800/70 border-gray-700/50' : 'bg-white/70 border-white/50'} rounded-3xl p-6 backdrop-blur-xl border shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Activities</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Latest team actions</p>
              </div>
              <button 
                className={`text-sm ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} font-semibold transition-colors hover:underline`}
              >
                View All
              </button>
            </div>

            {/* ✅ Activities list was missing */}
            <div className="space-y-4">
               {activities.length === 0 ? (
                <p className="text-gray-500">No recent activities</p>
               ) : (
                  activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40"
                    >
                       <div>
                          <p className={`${isDark ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                             {activity.message}
                         </p>
                       <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.created_at).toLocaleString()}
                       </p>
                    </div>

                   {activity.amount && (
                      <span className="text-sm font-semibold">
                         {formatINR(activity.amount)}
                      </span>
                   )}
                </div>
               ))
             )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
