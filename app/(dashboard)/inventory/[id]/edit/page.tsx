"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClipboardCheck, Plus, Save, Trash2, Wrench } from "lucide-react";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BigButton, BigIconButton } from "@/components/ui/BigButton";
import {
  Field,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sheet } from "@/components/ui/Sheet";
import { DisplayPanel } from "@/components/ui/DisplayPanel";
import { EmptyState, LoadingBlock } from "@/components/ui/Feedback";
import {
  INVENTORY_CATEGORIES,
  INVENTORY_STATUSES,
  categoryLabel,
  formatDateID,
  formatRupiah,
  inventoryStatusLabel,
} from "@/lib/inventory";
import { statusLabel, statusTone } from "@/lib/status";

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

const EMPTY_MAINTENANCE_FORM = {
  name: "",
  description: "",
  status: "ONGOING",
  cost: 0,
  quantity: 1,
};

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
  const [maintenanceForm, setMaintenanceForm] = useState(
    EMPTY_MAINTENANCE_FORM
  );
  const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/inventories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = (await response.json()) as Inventory;
      setInventory(data);
      setFormData({
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        status: data.status,
        price: data.price,
        purchaseDate: data.purchaseDate
          ? data.purchaseDate.split("T")[0]
          : "",
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

  const handleAddMaintenance = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!maintenanceForm.name.trim()) {
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
      setMaintenanceForm(EMPTY_MAINTENANCE_FORM);
      setShowMaintenanceForm(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adding maintenance:", error);
      toast.error("Gagal menambahkan perawatan");
    }
  };

  const confirmDeleteMaintenance = async () => {
    if (!deleteTarget || !inventory) return;

    try {
      const response = await fetch(
        `/api/inventories/${inventory.id}/maintenances/${deleteTarget.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete maintenance");
      toast.success("Perawatan berhasil dihapus");
      setDeleteTarget(null);
      fetchInventory();
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast.error("Gagal menghapus perawatan");
    }
  };

  if (loading) {
    return (
      <PageShell width="wide">
        <LoadingBlock label="Memuat inventaris…" />
      </PageShell>
    );
  }

  if (!inventory) {
    return null;
  }

  return (
    <PageShell width="wide">
      <div className="space-y-5">
        <PageHeader
          backHref="/inventory"
          backLabel="Kembali ke daftar inventaris"
          eyebrow="Ubah inventaris"
          title={inventory.name}
          subtitle={`${categoryLabel(inventory.category)} · ${inventory.quantity} unit`}
        />

        <DisplayPanel
          label="Kondisi barang"
          value={inventoryStatusLabel(inventory.status)}
          unit={`${inventory.quantity} unit`}
          sub={`${formatRupiah(inventory.price)} · dibeli ${formatDateID(
            inventory.purchaseDate
          )}`}
          hint={`${inventory.maintenances.length} perawatan · ${inventory.inspections.length} inspeksi`}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Informasi dasar">
            <div className="space-y-4">
              <Field label="Nama barang">
                <TextField
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                />
              </Field>

              <Field label="Kategori">
                <SelectField
                  value={formData.category}
                  onChange={(event) =>
                    setFormData({ ...formData, category: event.target.value })
                  }
                >
                  {INVENTORY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabel(category)}
                    </option>
                  ))}
                </SelectField>
              </Field>

              <Field label="Status">
                <SelectField
                  value={formData.status}
                  onChange={(event) =>
                    setFormData({ ...formData, status: event.target.value })
                  }
                >
                  {INVENTORY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {inventoryStatusLabel(status)}
                    </option>
                  ))}
                </SelectField>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Jumlah">
                  <TextField
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={formData.quantity}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(event.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field label="Harga (IDR)">
                  <TextField
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={formData.price}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        price: parseInt(event.target.value) || 0,
                      })
                    }
                  />
                </Field>
              </div>

              <Field label="Tanggal pembelian">
                <TextField
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(event) =>
                    setFormData({ ...formData, purchaseDate: event.target.value })
                  }
                />
              </Field>

              <BigButton
                block
                size="lg"
                onClick={handleSaveInventory}
                disabled={saving || !formData.name.trim()}
              >
                <Save size={22} strokeWidth={3} />
                {saving ? "Menyimpan…" : "Simpan Perubahan"}
              </BigButton>
            </div>
          </Card>

          <div className="space-y-4">
            <Card
              title="Riwayat perawatan"
              action={
                <BigButton
                  size="md"
                  onClick={() => setShowMaintenanceForm(true)}
                >
                  <Plus size={20} strokeWidth={3} />
                  Tambah
                </BigButton>
              }
            >
              {inventory.maintenances.length === 0 ? (
                <EmptyState
                  icon={<Wrench size={28} />}
                  title="Belum ada perawatan"
                  description="Catat perawatan agar riwayat barang tetap rapi"
                />
              ) : (
                <div className="space-y-3">
                  {inventory.maintenances.map((maintenance) => (
                    <div
                      key={maintenance.id}
                      className="rounded-2xl border-2 border-edge bg-canvas p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-ink">
                            {maintenance.name}
                          </p>
                          {maintenance.description && (
                            <p className="mt-1 text-sm text-mute">
                              {maintenance.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusPill tone={statusTone(maintenance.status)}>
                              {statusLabel(maintenance.status)}
                            </StatusPill>
                            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                              {formatRupiah(maintenance.cost)} · x
                              {maintenance.quantity}
                            </span>
                          </div>
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
                            {formatDateID(maintenance.createdAt)}
                          </p>
                        </div>
                        <BigIconButton
                          label={`Hapus perawatan ${maintenance.name}`}
                          variant="danger"
                          onClick={() => setDeleteTarget(maintenance)}
                        >
                          <Trash2 size={24} strokeWidth={2.5} />
                        </BigIconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Riwayat inspeksi">
              {inventory.inspections.length === 0 ? (
                <EmptyState
                  icon={<ClipboardCheck size={28} />}
                  title="Belum ada inspeksi"
                  description="Hasil pemeriksaan barang akan tampil di sini"
                />
              ) : (
                <div className="space-y-2">
                  {inventory.inspections.map((inspection) => (
                    <div
                      key={inspection.id}
                      className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-edge bg-canvas px-4 py-3"
                    >
                      <StatusPill tone={statusTone(inspection.status)}>
                        {statusLabel(inspection.status)}
                      </StatusPill>
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
                        {formatDateID(inspection.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Sheet
        open={showMaintenanceForm}
        title="Tambah Perawatan"
        subtitle={inventory.name}
        onClose={() => setShowMaintenanceForm(false)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton
              variant="surface"
              size="lg"
              block
              onClick={() => setShowMaintenanceForm(false)}
            >
              Batal
            </BigButton>
            <BigButton
              type="submit"
              form="maintenance-form"
              size="lg"
              block
              disabled={!maintenanceForm.name.trim()}
            >
              Simpan
            </BigButton>
          </div>
        }
      >
        <form
          id="maintenance-form"
          onSubmit={handleAddMaintenance}
          className="space-y-4"
        >
          <Field label="Nama perawatan">
            <TextField
              required
              value={maintenanceForm.name}
              onChange={(event) =>
                setMaintenanceForm({ ...maintenanceForm, name: event.target.value })
              }
              placeholder="Contoh: Penggantian speaker"
            />
          </Field>

          <Field label="Deskripsi">
            <TextAreaField
              rows={3}
              value={maintenanceForm.description}
              onChange={(event) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  description: event.target.value,
                })
              }
              placeholder="Detail perawatan…"
            />
          </Field>

          <Field label="Status">
            <SelectField
              value={maintenanceForm.status}
              onChange={(event) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  status: event.target.value,
                })
              }
            >
              <option value="ONGOING">Sedang Berjalan</option>
              <option value="COMPLETED">Selesai</option>
            </SelectField>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Biaya (IDR)">
              <TextField
                type="number"
                min="0"
                inputMode="numeric"
                value={maintenanceForm.cost}
                onChange={(event) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    cost: parseInt(event.target.value) || 0,
                  })
                }
              />
            </Field>
            <Field label="Jumlah">
              <TextField
                type="number"
                min="1"
                inputMode="numeric"
                value={maintenanceForm.quantity}
                onChange={(event) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    quantity: parseInt(event.target.value) || 1,
                  })
                }
              />
            </Field>
          </div>
        </form>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        title="Hapus Perawatan?"
        subtitle={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton
              variant="surface"
              size="lg"
              block
              onClick={() => setDeleteTarget(null)}
            >
              Batal
            </BigButton>
            <BigButton
              variant="danger"
              size="lg"
              block
              onClick={confirmDeleteMaintenance}
            >
              <Trash2 size={22} strokeWidth={3} />
              Hapus
            </BigButton>
          </div>
        }
      >
        <p className="text-base text-ink">
          Catatan perawatan{" "}
          <span className="font-bold">{deleteTarget?.name}</span> akan dihapus
          permanen.
        </p>
      </Sheet>
    </PageShell>
  );
}
