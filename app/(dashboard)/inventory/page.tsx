"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, X, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Inventory {
  id: string;
  name: string;
  quantity: number;
  category: string;
  status: string;
  price: number;
  purchaseDate: string;
  createdAt: string;
}

export default function InventoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "OTHER",
    status: "GOOD",
    price: "",
    purchaseDate: "",
  });

  const fetchInventories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const response = await fetch(`/api/inventories?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInventories(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/inventories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Inventaris berhasil ditambahkan");
        setShowModal(false);
        setFormData({
          name: "",
          quantity: "",
          category: "OTHER",
          status: "GOOD",
          price: "",
          purchaseDate: "",
        });
        fetchInventories();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menyimpan inventaris");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      toast.error("Gagal menyimpan inventaris");
    }
  };

  const handleEdit = (inventory: Inventory) => {
    router.push(`/inventory/${inventory.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus inventaris ini?")) return;

    try {
      const response = await fetch(`/api/inventories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Inventaris berhasil dihapus");
        fetchInventories();
      } else {
        toast.error("Gagal menghapus inventaris");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Gagal menghapus inventaris");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      SOUNDSYSTEM: "Sound System",
      MULTIMEDIA: "Multimedia",
      OTHER: "Lainnya",
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      GOOD: "Baik",
      DAMAGED: "Rusak",
      MAINTENANCE: "Perbaikan",
      DISPOSED: "Dibuang",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      GOOD: "bg-green-100 text-green-700",
      DAMAGED: "bg-red-100 text-red-700",
      MAINTENANCE: "bg-yellow-100 text-yellow-700",
      DISPOSED: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500 text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Manajemen Inventaris
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Kelola peralatan dan aset gereja
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              quantity: "",
              category: "OTHER",
              status: "GOOD",
              price: "",
              purchaseDate: "",
            });
            setShowModal(true);
          }}
          className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah Inventaris</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari inventaris..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            >
              <option value="all">Semua Kategori</option>
              <option value="SOUNDSYSTEM">Sound System</option>
              <option value="MULTIMEDIA">Multimedia</option>
              <option value="OTHER">Lainnya</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="GOOD">Baik</option>
              <option value="DAMAGED">Rusak</option>
              <option value="MAINTENANCE">Perbaikan</option>
              <option value="DISPOSED">Dibuang</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">Memuat...</div>
          </div>
        ) : inventories.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              Tidak ada inventaris ditemukan. Tambahkan inventaris pertama Anda untuk memulai.
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
                      Kategori
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Jumlah
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-xs">
                      Harga
                    </th>
                    <th className="text-right py-3 px-3 font-semibold text-gray-700 text-xs">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventories.map((inventory) => (
                    <tr
                      key={inventory.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900 text-sm">
                          {inventory.name}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">
                        {getCategoryLabel(inventory.category)}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">
                        {inventory.quantity}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(inventory.status)}`}
                        >
                          {getStatusLabel(inventory.status)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">
                        {formatPrice(inventory.price)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(inventory)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(inventory.id)}
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
                Tambah Inventaris
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="SOUNDSYSTEM">Sound System</option>
                  <option value="MULTIMEDIA">Multimedia</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Jumlah
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="GOOD">Baik</option>
                  <option value="DAMAGED">Rusak</option>
                  <option value="MAINTENANCE">Perbaikan</option>
                  <option value="DISPOSED">Dibuang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Harga (IDR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tanggal Pembelian
                </label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
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
                  Buat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
