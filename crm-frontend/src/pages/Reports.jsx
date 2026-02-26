// Reports.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent } from "../components/ui/Card1";
import { Loader2, AlertCircle } from "lucide-react";
import formatINR from "../utils/formatCurrency";
export default function Reports() {
  const [revenueData, setRevenueData] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL + "/reports";
 // update if backend hosted

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const [revenueRes, repsRes] = await Promise.all([
          axios.get(`${API_BASE}/revenue-by-month`),
          axios.get(`${API_BASE}/top-sales`)
        ]);

        setRevenueData(revenueRes.data || []);
        setSalesReps(repsRes.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <span className="ml-2 text-lg">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-red-500">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      {/* Revenue by Month */}
      <Card className="shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Revenue by Month</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatINR(value)}
                />
                <Legend />
                <Bar dataKey="total_sales" fill="#6366f1" name="Revenue" /> 
                {/* ✅ fixed to match backend key */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Sales Reps & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sales Reps */}
        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Top Sales Reps</h2>
            <ul className="space-y-2">
              {salesReps.map((rep, idx) => (
                <li key={idx} className="flex justify-between border-b py-2">
                  <span className="font-medium">{rep.rep_name}</span>
                  <span className="text-indigo-600 font-semibold">
                    {formatINR(rep.total_sales)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pie Chart - Sales Distribution */}
        <Card className="shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Sales Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesReps}
                    dataKey="total_sales"
                    nameKey="rep_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {salesReps.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatINR(value)}
                  />
                  </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
