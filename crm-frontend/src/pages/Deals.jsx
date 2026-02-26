// crm-sys/crm-frontend/src/pages/Deals.jsx
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import formatINR from "../utils/formatCurrency";
export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    value: "",
    stage: "new",
    close_date: "",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/deals";

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // Fetch all deals
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers });
      if (!res.ok) throw new Error("Failed to fetch deals");
      const data = await res.json();
      setDeals(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching deals");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update deal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to save deal");

      toast.success(editingId ? "Deal updated!" : "Deal added!");
      setFormData({ title: "", company: "", value: "", stage: "new", close_date: "", notes: "" });
      setEditingId(null);
      fetchDeals();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error saving deal");
    } finally {
      setSaving(false);
    }
  };

  // Edit deal
  const handleEdit = (deal) => {
    setFormData(deal);
    setEditingId(deal.id);
  };

  // Delete deal
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Failed to delete deal");
      toast.success("Deal deleted!");
      fetchDeals();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting deal");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-600" /> Deals Management
      </h1>

      {/* Add/Edit Deal Form */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Deal Title"
          required
          className="border rounded p-2"
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          className="border rounded p-2"
        />
        <input
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          placeholder="Amount (₹)"
          //placeholder="Value"
          className="border rounded p-2"
        />
        <select name="stage" value={formData.stage} onChange={handleChange} className="border rounded p-2">
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">won</option>
          <option value="lost">Lost</option>
        </select>
        <input
          name="close_date"
          type="date"
          value={formData.close_date}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border rounded p-2 col-span-1 md:col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className={`bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <Plus className="w-4 h-4" /> {editingId ? "Update Deal" : "Add Deal"}
        </button>
      </form>

      {/* Deals List */}
      {loading ? (
        <p>Loading deals...</p>
      ) : deals.length === 0 ? (
        <p className="text-gray-500">No deals found.</p>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-gray-50 p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">{deal.title}</h2>
                <p className="text-sm text-gray-600">{deal.company}</p>
                <p className="text-green-600 font-semibold">
                    {formatINR(deal.value)}
                </p>
                
                <p className="text-sm">Stage: <span className="font-medium">{deal.stage}</span></p>
                {deal.close_date && <p className="text-sm">Closing: {new Date(deal.close_date).toLocaleDateString()}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(deal)}
                  className="p-2 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(deal.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
