"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit, Trash2, User, Phone, MapPin, Calendar, X, ChevronLeft, ChevronRight, History } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCongregations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const response = await fetch(
        `/api/congregations?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setCongregations(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching congregations:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCongregations();
  }, [fetchCongregations]);

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
        toast.success(editingCongregation ? "Jemaat berhasil diperbarui" : "Jemaat berhasil ditambahkan");
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menyimpan jemaat");
      }
    } catch (error) {
      console.error("Error saving congregation:", error);
      toast.error("Gagal menyimpan jemaat");
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
        toast.success("Jemaat berhasil dihapus");
      } else {
        toast.error("Gagal menghapus jemaat");
      }
    } catch (error) {
      console.error("Error deleting congregation:", error);
      toast.error("Gagal menghapus jemaat");
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Manajemen Jemaat
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Kelola anggota jemaat dan informasi mereka
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
          className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Jemaat</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari jemaat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">Memuat...</div>
          </div>
        ) : congregations.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              Tidak ada jemaat ditemukan. Tambahkan jemaat pertama Anda untuk memulai.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Nama
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Usia
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      WhatsApp
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Alamat
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Status
                    </th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700 text-xs">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {congregations.map((congregation) => (
                    <tr
                      key={congregation.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {congregation.name}
                          </div>
                          {congregation.title && (
                            <div className="text-xs text-gray-500">
                              {congregation.title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-sm">
                        {congregation.birthday ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {calculateAge(congregation.birthday)} tahun
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {congregation.whatsappNumber ? (
                          <a
                            href={`https://wa.me/${congregation.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:text-primary-dark font-medium text-sm"
                          >
                            <Phone size={14} />
                            {congregation.whatsappNumber}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {congregation.address ? (
                          <div className="flex items-start gap-1.5 text-gray-600 max-w-xs text-sm">
                            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{congregation.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            congregation.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {congregation.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/attendance/${congregation.id}`}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-primary"
                            title="Riwayat Kehadiran"
                          >
                            <History size={16} />
                          </Link>
                          <button
                            onClick={() => handleEdit(congregation)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(congregation.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Menampilkan</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 rounded-md border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span>per halaman</span>
                  <span className="text-gray-400">|</span>
                  <span>
                    {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} dari {total}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} className="text-gray-600" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-md font-medium transition-colors text-xs ${
                            page === pageNum
                              ? "bg-primary text-white"
                              : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCongregation ? "Edit Jemaat" : "Tambah Jemaat"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nama *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Gelar
                </label>
                <select
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="">Tidak ada</option>
                  <option value="Sdr.">Sdr.</option>
                  <option value="Sdri.">Sdri.</option>
                  <option value="Adik">Adik</option>
                  <option value="Ev.">Ev.</option>
                  <option value="Pdt.">Pdt.</option>
                  <option value="Dkn.">Dkn.</option>
                  <option value="Pnt.">Pnt.</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Alamat
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors font-medium shadow-lg hover:shadow-primary/20 text-sm"
                >
                  {editingCongregation ? "Perbarui" : "Buat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
