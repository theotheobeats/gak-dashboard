"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, User, Phone, MapPin, Calendar, X, MoreVertical } from "lucide-react";

interface Congregation {
  id: string;
  name: string;
  title: string | null;
  nameWithoutTitle: string | null;
  birthday: string | null;
  age: number | null;
  status: string;
  whatsappNumber: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CongregationsPage() {
  const [congregations, setCongregations] = useState<Congregation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCongregation, setEditingCongregation] =
    useState<Congregation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    birthday: "",
    whatsappNumber: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    fetchCongregations();
  }, [search, statusFilter]);

  const fetchCongregations = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `/api/congregations?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setCongregations(data);
      }
    } catch (error) {
      console.error("Error fetching congregations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCongregation
        ? `/api/congregations/${editingCongregation.id}`
        : "/api/congregations";
      const method = editingCongregation ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCongregation(null);
        setFormData({
          name: "",
          title: "",
          birthday: "",
          whatsappNumber: "",
          address: "",
          status: "active",
        });
        fetchCongregations();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save congregation");
      }
    } catch (error) {
      console.error("Error saving congregation:", error);
      alert("Failed to save congregation");
    }
  };

  const handleEdit = (congregation: Congregation) => {
    setEditingCongregation(congregation);
    setFormData({
      name: congregation.name,
      title: congregation.title || "",
      birthday: congregation.birthday
        ? new Date(congregation.birthday).toISOString().split("T")[0]
        : "",
      whatsappNumber: congregation.whatsappNumber || "",
      address: congregation.address || "",
      status: congregation.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this congregation?")) {
      return;
    }

    try {
      const response = await fetch(`/api/congregations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCongregations();
      } else {
        alert("Failed to delete congregation");
      }
    } catch (error) {
      console.error("Error deleting congregation:", error);
      alert("Failed to delete congregation");
    }
  };

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Congregation Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage your congregation members and their information
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCongregation(null);
            setFormData({
              name: "",
              title: "",
              birthday: "",
              whatsappNumber: "",
              address: "",
              status: "active",
            });
            setShowModal(true);
          }}
          className="px-4 sm:px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Congregation</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search congregations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : congregations.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">
              No congregations found. Add your first congregation to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Age
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    WhatsApp
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {congregations.map((congregation) => (
                  <tr
                    key={congregation.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {congregation.name}
                        </div>
                        {congregation.title && (
                          <div className="text-sm text-gray-500">
                            {congregation.title}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {congregation.birthday ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {calculateAge(congregation.birthday)} years
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {congregation.whatsappNumber ? (
                        <a
                          href={`https://wa.me/${congregation.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                        >
                          <Phone size={16} />
                          {congregation.whatsappNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {congregation.address ? (
                        <div className="flex items-start gap-2 text-gray-600 max-w-xs">
                          <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{congregation.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          congregation.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {congregation.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(congregation)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(congregation.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCongregation ? "Edit Congregation" : "Add Congregation"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors font-medium shadow-lg hover:shadow-primary/20"
                >
                  {editingCongregation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
