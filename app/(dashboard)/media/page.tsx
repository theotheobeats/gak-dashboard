"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { CalendarDays, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BigButton, BigIconButton } from "@/components/ui/BigButton";
import { Field, TextAreaField, TextField } from "@/components/ui/Input";
import { StatusPill } from "@/components/ui/StatusPill";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState, LoadingBlock } from "@/components/ui/Feedback";
import { formatDateID } from "@/lib/inventory";

interface Image {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  createdAt: string;
}

interface Album {
  id: string;
  name: string;
  description: string | null;
  date: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  images: Image[];
}

const todayValue = () => new Date().toISOString().split("T")[0];

export default function MediaPage() {
  const { data: session } = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: todayValue(),
  });

  const fetchAlbums = async () => {
    const response = await fetch("/api/albums");
    if (response.ok) {
      const data = (await response.json()) as Album[];
      setAlbums(data);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await fetchAlbums();
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast.error("Gagal memuat album");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!session?.user?.id) {
      toast.error("Anda harus login untuk membuat album");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          uploadedById: session.user.id,
        }),
      });

      if (response.ok) {
        toast.success("Album berhasil dibuat");
        setShowModal(false);
        setFormData({ name: "", description: "", date: todayValue() });
        await fetchAlbums();
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal membuat album");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Gagal membuat album");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/albums/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Album berhasil dihapus");
        setAlbums((previous) =>
          previous.filter((album) => album.id !== deleteTarget.id)
        );
        setDeleteTarget(null);
      } else {
        toast.error("Gagal menghapus album");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Gagal menghapus album");
    }
  };

  return (
    <PageShell width="wide">
      <div className="space-y-5">
        <PageHeader
          eyebrow="Album & foto"
          title="Galeri Media"
          subtitle={`${albums.length} album · kelola foto kegiatan gereja`}
          action={
            <BigButton onClick={() => setShowModal(true)} block>
              <Plus size={24} strokeWidth={3} />
              Buat Album
            </BigButton>
          }
        />

        {loading ? (
          <Card>
            <LoadingBlock label="Memuat album…" />
          </Card>
        ) : albums.length === 0 ? (
          <Card>
            <EmptyState
              icon={<ImageIcon size={30} />}
              title="Belum ada album"
              description="Buat album pertama untuk mulai mengelola foto"
              action={
                <BigButton className="mt-2" onClick={() => setShowModal(true)}>
                  <Plus size={22} strokeWidth={3} />
                  Buat Album
                </BigButton>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="overflow-hidden rounded-[24px] border-2 border-edge bg-surface shadow-[0_4px_0_var(--device-edge-dark)]"
              >
                <div className="relative aspect-video border-b-2 border-edge bg-canvas">
                  {album.images.length > 0 ? (
                    <Image
                      src={album.images[0].url}
                      alt={album.images[0].alt || album.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-mute" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <BigIconButton
                      label={`Hapus album ${album.name}`}
                      variant="danger"
                      onClick={() => setDeleteTarget(album)}
                    >
                      <Trash2 size={24} strokeWidth={2.5} />
                    </BigIconButton>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-ink">{album.name}</h3>
                    <StatusPill>{album.images.length} foto</StatusPill>
                  </div>
                  {album.description && (
                    <p className="text-sm text-mute">{album.description}</p>
                  )}
                  <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
                    <CalendarDays size={14} />
                    {formatDateID(album.date)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Sheet
        open={showModal}
        title="Buat Album Baru"
        subtitle="Album foto kegiatan"
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
              form="album-form"
              size="lg"
              block
              disabled={isSaving || !formData.name.trim()}
            >
              {isSaving ? "Menyimpan…" : "Buat Album"}
            </BigButton>
          </div>
        }
      >
        <form id="album-form" onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama album">
            <TextField
              required
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Contoh: Kebaktian Minggu 1"
            />
          </Field>

          <Field label="Deskripsi">
            <TextAreaField
              rows={3}
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              placeholder="Deskripsi singkat tentang album ini…"
            />
          </Field>

          <Field label="Tanggal">
            <TextField
              type="date"
              required
              value={formData.date}
              onChange={(event) =>
                setFormData({ ...formData, date: event.target.value })
              }
            />
          </Field>
        </form>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        title="Hapus Album?"
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
            <BigButton variant="danger" size="lg" block onClick={handleDeleteAlbum}>
              <Trash2 size={22} strokeWidth={3} />
              Hapus
            </BigButton>
          </div>
        }
      >
        <p className="text-base text-ink">
          Album <span className="font-bold">{deleteTarget?.name}</span> beserta{" "}
          {deleteTarget?.images.length || 0} foto di dalamnya akan dihapus
          permanen.
        </p>
      </Sheet>
    </PageShell>
  );
}
