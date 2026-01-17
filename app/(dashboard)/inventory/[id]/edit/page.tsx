"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Plus, Trash2, Save, Wrench, ClipboardCheck } from "lucide-react";
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
  updatedAt: string;
  maintenances: Maintenance[];
  inspections: Inspection[];
}

interface Maintenance {
  id: string;
  name: string;
  description: string | null;
  status: string;
  cost: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface Inspection {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    category: "OTHER",
    status: "GOOD",
    price: 0,
    purchaseDate: "",
  });
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    name: "",
    description: "",
    status: "ONGOING",
    cost: 0,
    quantity: 1,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; maintenanceId: string | null; maintenanceName: string }>({
    show: false,
    maintenanceId: null,
    maintenanceName: "",
  });

  const fetchInventory = useCallback(async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/inventories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setInventory(data);
      setFormData({
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        status: data.status,
        price: data.price,
        purchaseDate: data.purchaseDate.split("T")[0],
      });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Gagal memuat data inventaris");
      router.push("/inventory");
    } finally {
      setLoading(false);
    }
  }, [params, router]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSaveInventory = async () => {
    setSaving(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/inventories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update inventory");
      toast.success("Inventaris berhasil diperbarui");
      fetchInventory();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Gagal memperbarui inventaris");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMaintenance = async () => {
    if (!maintenanceForm.name) {
      toast.error("Nama perawatan wajib diisi");
      return;
    }

    try {
      const { id } = await params;
      const response = await fetch(`/api/inventories/${id}/maintenances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(maintenanceForm),
      });

      if (!response.ok) throw new Error("Failed to add maintenance");
      toast.success("Perawatan berhasil ditambahkan");
      setMaintenanceForm({
        name: "",
        description: "",
        status: "ONGOING",
        cost: 0,
        quantity: 1,
      });
      setShowMaintenanceForm(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adding maintenance:", error);
      toast.error("Gagal menambahkan perawatan");
    }
  };

  const handleDeleteMaintenance = async (maintenanceId: string, maintenanceName: string) => {
    setDeleteConfirm({ show: true, maintenanceId, maintenanceName });
  };

  const confirmDeleteMaintenance = async () => {
    if (!deleteConfirm.maintenanceId) return;

    try {
      const response = await fetch(`/api/inventories/${inventory?.id}/maintenances/${deleteConfirm.maintenanceId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete maintenance");
      toast.success("Perawatan berhasil dihapus");
      setDeleteConfirm({ show: false, maintenanceId: null, maintenanceName: "" });
      fetchInventory();
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast.error("Gagal menghapus perawatan");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      GOOD: "Baik",
      DAMAGED: "Rusak",
      MAINTENANCE: "Perawatan",
      DISPOSED: "Dibuang",
      ONGOING: "Sedang Berjalan",
      COMPLETED: "Selesai",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      GOOD: "bg-green-100 text-green-700",
      DAMAGED: "bg-red-100 text-red-700",
      MAINTENANCE: "bg-yellow-100 text-yellow-700",
      DISPOSED: "bg-gray-100 text-gray-700",
      ONGOING: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!inventory) {
    return null;
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/inventory")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Kembali ke daftar inventaris"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Inventaris</h1>
            <p className="text-sm text-gray-500">{inventory.name}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="inventory-name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  id="inventory-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inventory-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    id="inventory-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900"
                  >
                    <option value="SOUNDSYSTEM">Sound System</option>
                    <option value="MULTIMEDIA">Multimedia</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="inventory-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="inventory-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900"
                  >
                    <option value="GOOD">Baik</option>
                    <option value="DAMAGED">Rusak</option>
                    <option value="MAINTENANCE">Perawatan</option>
                    <option value="DISPOSED">Dibuang</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inventory-quantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                  <input
                    id="inventory-quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="inventory-price" className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input
                    id="inventory-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="inventory-purchase-date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembelian</label>
                <input
                  id="inventory-purchase-date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
              <button
                onClick={handleSaveInventory}
                disabled={saving}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-white" />}
                Simpan Perubahan
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-gray-900" />
                  Riwayat Perawatan
                </h2>
                <button
                  onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 text-sm"
                >
                  <Plus size={16} className="text-white" />
                  Tambah
                </button>
              </div>

              {showMaintenanceForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div>
                    <label htmlFor="maintenance-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Perawatan</label>
                    <input
                      id="maintenance-name"
                      type="text"
                      value={maintenanceForm.name}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Penggantian speaker"
                    />
                  </div>
                  <div>
                    <label htmlFor="maintenance-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                      id="maintenance-description"
                      value={maintenanceForm.description}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none text-gray-900 placeholder-gray-400"
                      rows={2}
                      placeholder="Detail perawatan..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="maintenance-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        id="maintenance-status"
                        value={maintenanceForm.status}
                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900"
                      >
                        <option value="ONGOING">Sedang Berjalan</option>
                        <option value="COMPLETED">Selesai</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="maintenance-cost" className="block text-sm font-medium text-gray-700 mb-1">Biaya</label>
                      <input
                        id="maintenance-cost"
                        type="number"
                        value={maintenanceForm.cost}
                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="maintenance-quantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input
                      id="maintenance-quantity"
                      type="number"
                      value={maintenanceForm.quantity}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddMaintenance}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setShowMaintenanceForm(false)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {inventory.maintenances.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Belum ada riwayat perawatan
                </div>
              ) : (
                <div className="space-y-3">
                  {inventory.maintenances.map((maintenance) => (
                    <div
                      key={maintenance.id}
                      className="p-4 bg-gray-50 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{maintenance.name}</h3>
                          {maintenance.description && (
                            <p className="text-xs text-gray-500 mt-1">{maintenance.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteMaintenance(maintenance.id, maintenance.name)}
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                          aria-label={`Hapus perawatan ${maintenance.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                          {getStatusLabel(maintenance.status)}
                        </span>
                        <span className="text-xs text-gray-500">{formatPrice(maintenance.cost)}</span>
                        <span className="text-xs text-gray-500">x{maintenance.quantity}</span>
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(maintenance.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <ClipboardCheck className="w-5 h-5 text-gray-900" />
                Riwayat Inspeksi
              </h2>

              {inventory.inspections.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Belum ada riwayat inspeksi
                </div>
              ) : (
                <div className="space-y-3">
                  {inventory.inspections.map((inspection) => (
                    <div
                      key={inspection.id}
                      className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                          {getStatusLabel(inspection.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(inspection.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {deleteConfirm.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <h2 id="delete-confirm-title" className="text-lg font-bold text-gray-900 mb-2">
              Hapus Perawatan
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus catatan perawatan "{deleteConfirm.maintenanceName}"? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, maintenanceId: null, maintenanceName: "" })}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteMaintenance}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
