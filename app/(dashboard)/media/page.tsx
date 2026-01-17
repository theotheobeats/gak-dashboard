"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Calendar, Trash2, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

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

export default function MediaPage() {
  const { data: session } = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/albums");
        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        toast.error("Gagal memuat album");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Anda harus login untuk membuat album");
      return;
    }

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
        setFormData({
          name: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        
        const albumsResponse = await fetch("/api/albums");
        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal membuat album");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error("Gagal membuat album");
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus album ini? Semua foto di dalam album akan terhapus.")) return;

    try {
      const response = await fetch(`/api/albums/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Album berhasil dihapus");
        setAlbums(albums.filter((a) => a.id !== id));
      } else {
        toast.error("Gagal menghapus album");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Gagal menghapus album");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
            Galeri Media
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Kelola foto dan album kegiatan gereja
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Buat Album</span>
          <span className="sm:hidden">Buat</span>
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-sm mb-2">
            Belum ada album
          </p>
          <p className="text-gray-400 text-xs">
            Buat album pertama Anda untuk mulai mengelola foto
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 relative">
                {album.images.length > 0 ? (
                  <Image
                    src={album.images[0].url}
                    alt={album.images[0].alt || album.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Hapus Album"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{album.name}</h3>
                {album.description && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{album.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(album.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon size={12} />
                    <span>{album.images.length} foto</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Buat Album Baru</h2>
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
                  Nama Album *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="Contoh: Kebaktian Minggu 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  placeholder="Deskripsi singkat tentang album ini..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                  Buat Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
