"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BigButton, BigIconButton } from "@/components/ui/BigButton";
import {
  Field,
  SearchInput,
  SelectField,
  TextField,
} from "@/components/ui/Input";
import { FilterChip, StatusPill } from "@/components/ui/StatusPill";
import { Sheet } from "@/components/ui/Sheet";
import { DisplayPanel } from "@/components/ui/DisplayPanel";
import { EmptyState, LoadingBlock } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import {
  INVENTORY_CATEGORIES,
  INVENTORY_STATUSES,
  categoryLabel,
  formatDateID,
  formatRupiah,
  inventoryStatusLabel,
} from "@/lib/inventory";
import { statusTone } from "@/lib/status";

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

interface InventoriesResponse {
  data: Inventory[];
  total: number;
  totalPages: number;
}

const PAGE_SIZES = [10, 20, 50];

const EMPTY_FORM = {
  name: "",
  quantity: "",
  category: "OTHER",
  status: "GOOD",
  price: "",
  purchaseDate: "",
};

export default function InventoryPage() {
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
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inventory | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

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
        const data = (await response.json()) as InventoriesResponse;
        setInventories(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      toast.error("Gagal memuat inventaris");
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/inventories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Inventaris berhasil ditambahkan");
        setShowModal(false);
        setFormData(EMPTY_FORM);
        fetchInventories();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menyimpan inventaris");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);
      toast.error("Gagal menyimpan inventaris");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/inventories/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Inventaris berhasil dihapus");
        setDeleteTarget(null);
        fetchInventories();
      } else {
        toast.error("Gagal menghapus inventaris");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error("Gagal menghapus inventaris");
    }
  };

  return (
    <PageShell width="wide">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Aset & peralatan"
          title="Manajemen Inventaris"
          subtitle="Kelola peralatan dan aset gereja"
          action={
            <BigButton
              onClick={() => {
                setFormData(EMPTY_FORM);
                setShowModal(true);
              }}
              block
            >
              <Plus size={24} strokeWidth={3} />
              Tambah Inventaris
            </BigButton>
          }
        />

        <DisplayPanel
          label="Total inventaris"
          value={total}
          unit="item"
          sub={`Halaman ${page} dari ${Math.max(1, totalPages)}`}
          hint="tekan tambah untuk mencatat"
        />

        <Card title="Cari & filter">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama inventaris…"
          />

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                Kategori
              </span>
              <FilterChip
                label="Semua"
                active={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
              />
              {INVENTORY_CATEGORIES.map((category) => (
                <FilterChip
                  key={category}
                  label={categoryLabel(category)}
                  active={categoryFilter === category}
                  onClick={() => setCategoryFilter(category)}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                Status
              </span>
              <FilterChip
                label="Semua"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />
              {INVENTORY_STATUSES.map((status) => (
                <FilterChip
                  key={status}
                  label={inventoryStatusLabel(status)}
                  active={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                />
              ))}
            </div>
          </div>
        </Card>

        {loading ? (
          <Card>
            <LoadingBlock label="Memuat inventaris…" />
          </Card>
        ) : inventories.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Package size={30} />}
              title="Belum ada inventaris"
              description="Tambahkan peralatan atau aset pertama"
              action={
                <BigButton
                  className="mt-2"
                  onClick={() => {
                    setFormData(EMPTY_FORM);
                    setShowModal(true);
                  }}
                >
                  <Plus size={22} strokeWidth={3} />
                  Tambah Inventaris
                </BigButton>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {inventories.map((inventory) => (
              <div
                key={inventory.id}
                className="rounded-[24px] border-2 border-edge bg-surface p-4 shadow-[0_4px_0_var(--device-edge-dark)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-ink sm:text-lg">
                      {inventory.name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusPill>{categoryLabel(inventory.category)}</StatusPill>
                      <StatusPill tone={statusTone(inventory.status)}>
                        {inventoryStatusLabel(inventory.status)}
                      </StatusPill>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                      <span className="text-ink">
                        {inventory.quantity} unit
                      </span>
                      <span>{formatRupiah(inventory.price)}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {formatDateID(inventory.purchaseDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <BigIconButton
                      label={`Ubah ${inventory.name}`}
                      onClick={() => router.push(`/inventory/${inventory.id}/edit`)}
                    >
                      <Pencil size={24} strokeWidth={2.5} />
                    </BigIconButton>
                    <BigIconButton
                      label={`Hapus ${inventory.name}`}
                      variant="danger"
                      onClick={() => setDeleteTarget(inventory)}
                    >
                      <Trash2 size={24} strokeWidth={2.5} />
                    </BigIconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Card>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            label="item"
            onPageChange={setPage}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-edge pt-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              Per halaman
            </span>
            {PAGE_SIZES.map((size) => (
              <FilterChip
                key={size}
                label={size.toString()}
                active={pageSize === size}
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            ))}
          </div>
        </Card>
      </div>

      <Sheet
        open={showModal}
        title="Tambah Inventaris"
        subtitle="Data barang baru"
        onClose={() => setShowModal(false)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton
              variant="surface"
              size="lg"
              block
              onClick={() => setShowModal(false)}
            >
              Batal
            </BigButton>
            <BigButton
              type="submit"
              form="inventory-form"
              size="lg"
              block
              disabled={isSaving || !formData.name.trim()}
            >
              {isSaving ? "Menyimpan…" : "Simpan"}
            </BigButton>
          </div>
        }
      >
        <form id="inventory-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama barang">
            <TextField
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Contoh: Speaker aktif 12 inci"
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

          <Field label="Jumlah">
            <TextField
              type="number"
              required
              min="0"
              inputMode="numeric"
              value={formData.quantity}
              onChange={(event) =>
                setFormData({ ...formData, quantity: event.target.value })
              }
            />
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

          <Field label="Harga (IDR)">
            <TextField
              type="number"
              required
              min="0"
              inputMode="numeric"
              value={formData.price}
              onChange={(event) =>
                setFormData({ ...formData, price: event.target.value })
              }
            />
          </Field>

          <Field label="Tanggal pembelian">
            <TextField
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(event) =>
                setFormData({ ...formData, purchaseDate: event.target.value })
              }
            />
          </Field>
        </form>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        title="Hapus Inventaris?"
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
            <BigButton variant="danger" size="lg" block onClick={handleDelete}>
              <Trash2 size={22} strokeWidth={3} />
              Hapus
            </BigButton>
          </div>
        }
      >
        <p className="text-base text-ink">
          Data <span className="font-bold">{deleteTarget?.name}</span> beserta
          riwayat pemeriksaan dan perawatannya akan dihapus permanen.
        </p>
      </Sheet>
    </PageShell>
  );
}
