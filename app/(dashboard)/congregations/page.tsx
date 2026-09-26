"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CalendarDays,
  History,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BigButton, BigIconButton } from "@/components/ui/BigButton";
import { SearchInput, Field, SelectField, TextField, TextAreaField } from "@/components/ui/Input";
import { FilterChip, StatusPill } from "@/components/ui/StatusPill";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState, LoadingBlock } from "@/components/ui/Feedback";
import { Pagination } from "@/components/ui/Pagination";
import { statusLabel, statusTone } from "@/lib/status";

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

interface CongregationsResponse {
  data: Congregation[];
  total: number;
  totalPages: number;
}

const TITLES = [
  "Sdr.",
  "Sdri.",
  "Adik",
  "Ev.",
  "Pdt.",
  "Dkn.",
  "Pnt.",
];

const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

const PAGE_SIZES = [10, 20, 50];

const EMPTY_FORM = {
  name: "",
  title: "",
  birthday: "",
  whatsappNumber: "",
  address: "",
  status: "active",
};

export default function CongregationsPage() {
  const [congregations, setCongregations] = useState<Congregation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCongregation, setEditingCongregation] =
    useState<Congregation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Congregation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCongregations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const response = await fetch(`/api/congregations?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as CongregationsResponse;
        setCongregations(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching congregations:", error);
      toast.error("Gagal memuat data jemaat");
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

  const closeForm = () => {
    setShowModal(false);
    setEditingCongregation(null);
    setFormData(EMPTY_FORM);
  };

  const openCreate = () => {
    setEditingCongregation(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

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
        toast.success(
          editingCongregation
            ? "Jemaat berhasil diperbarui"
            : "Jemaat berhasil ditambahkan"
        );
        closeForm();
        fetchCongregations();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menyimpan jemaat");
      }
    } catch (error) {
      console.error("Error saving congregation:", error);
      toast.error("Gagal menyimpan jemaat");
    } finally {
      setIsSaving(false);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/congregations/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Jemaat berhasil dihapus");
        setDeleteTarget(null);
        fetchCongregations();
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
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <PageShell width="wide">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Data jemaat"
          title="Manajemen Jemaat"
          subtitle={`${total} jemaat terdaftar`}
          action={
            <BigButton onClick={openCreate} block>
              <Plus size={24} strokeWidth={3} />
              Tambah Jemaat
            </BigButton>
          }
        />

        <Card title="Cari & filter">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama jemaat, gelar, atau WhatsApp…"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <FilterChip
                key={filter.value}
                label={filter.label}
                active={statusFilter === filter.value}
                onClick={() => setStatusFilter(filter.value)}
              />
            ))}
          </div>
        </Card>

        {loading ? (
          <Card>
            <LoadingBlock label="Memuat jemaat…" />
          </Card>
        ) : congregations.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Users size={30} />}
              title="Belum ada jemaat"
              description="Tambahkan jemaat pertama untuk memulai"
              action={
                <BigButton onClick={openCreate} className="mt-2">
                  <Plus size={22} strokeWidth={3} />
                  Tambah Jemaat
                </BigButton>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {congregations.map((congregation) => {
              const age = calculateAge(congregation.birthday);

              return (
                <div
                  key={congregation.id}
                  className="rounded-[24px] border-2 border-edge bg-surface p-4 shadow-[0_4px_0_var(--device-edge-dark)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-bold text-ink sm:text-lg">
                          {congregation.title
                            ? `${congregation.title} ${congregation.name}`
                            : congregation.name}
                        </p>
                        <StatusPill tone={statusTone(congregation.status)}>
                          {statusLabel(congregation.status)}
                        </StatusPill>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                        {age !== null && (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {age} tahun
                          </span>
                        )}
                        {congregation.whatsappNumber && (
                          <a
                            href={`https://wa.me/${congregation.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-accent-dark"
                          >
                            <Phone size={14} />
                            {congregation.whatsappNumber}
                          </a>
                        )}
                        {congregation.address && (
                          <span className="inline-flex max-w-full items-center gap-1.5">
                            <MapPin size={14} className="shrink-0" />
                            <span className="truncate normal-case">
                              {congregation.address}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/attendance/${congregation.id}`}
                        aria-label={`Riwayat ${congregation.name}`}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge-dark)] transition-all duration-100 active:translate-y-[4px] active:shadow-none"
                      >
                        <History size={24} strokeWidth={2.5} />
                      </Link>
                      <BigIconButton
                        label={`Ubah ${congregation.name}`}
                        onClick={() => handleEdit(congregation)}
                      >
                        <Pencil size={24} strokeWidth={2.5} />
                      </BigIconButton>
                      <BigIconButton
                        label={`Hapus ${congregation.name}`}
                        variant="danger"
                        onClick={() => setDeleteTarget(congregation)}
                      >
                        <Trash2 size={24} strokeWidth={2.5} />
                      </BigIconButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Card>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            label="jemaat"
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
        title={editingCongregation ? "Ubah Jemaat" : "Tambah Jemaat"}
        subtitle={editingCongregation ? editingCongregation.name : "Data baru"}
        onClose={closeForm}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton variant="surface" size="lg" block onClick={closeForm}>
              Batal
            </BigButton>
            <BigButton
              type="submit"
              form="congregation-form"
              size="lg"
              block
              disabled={isSaving || !formData.name.trim()}
            >
              {isSaving
                ? "Menyimpan…"
                : editingCongregation
                  ? "Perbarui"
                  : "Simpan"}
            </BigButton>
          </div>
        }
      >
        <form
          id="congregation-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Field label="Nama">
            <TextField
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Nama lengkap jemaat"
            />
          </Field>

          <Field label="Gelar">
            <SelectField
              value={formData.title}
              onChange={(event) =>
                setFormData({ ...formData, title: event.target.value })
              }
            >
              <option value="">Tidak ada</option>
              {TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </SelectField>
          </Field>

          <Field label="Tanggal lahir">
            <TextField
              type="date"
              value={formData.birthday}
              onChange={(event) =>
                setFormData({ ...formData, birthday: event.target.value })
              }
            />
          </Field>

          <Field label="Nomor WhatsApp">
            <TextField
              inputMode="tel"
              value={formData.whatsappNumber}
              onChange={(event) =>
                setFormData({ ...formData, whatsappNumber: event.target.value })
              }
              placeholder="08xxxxxxxxxx"
            />
          </Field>

          <Field label="Alamat">
            <TextAreaField
              rows={3}
              value={formData.address}
              onChange={(event) =>
                setFormData({ ...formData, address: event.target.value })
              }
              placeholder="Alamat tempat tinggal"
            />
          </Field>

          <Field label="Status">
            <SelectField
              value={formData.status}
              onChange={(event) =>
                setFormData({ ...formData, status: event.target.value })
              }
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </SelectField>
          </Field>
        </form>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        title="Hapus Jemaat?"
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
          Data jemaat{" "}
          <span className="font-bold">{deleteTarget?.name}</span> akan dihapus
          permanen, termasuk riwayat kehadirannya.
        </p>
      </Sheet>
    </PageShell>
  );
}
