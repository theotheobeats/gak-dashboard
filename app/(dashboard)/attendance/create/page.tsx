"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Congregation {
  id: string;
  name: string;
  title: string | null;
}

interface Attendee {
  congregationId: string | null;
  name: string;
  isNewCongregation: boolean;
}

export default function CreateAttendancePage() {
  const router = useRouter();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [congregations, setCongregations] = useState<Congregation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCongregations = async () => {
      try {
        const response = await fetch("/api/congregations");
        const result = await response.json();
        if (result.data) {
          setCongregations(result.data);
        }
      } catch (error) {
        console.error("Error fetching congregations:", error);
        toast.error("Gagal memuat data jemaat");
      }
    };

    fetchCongregations();
  }, []);

  const filteredCongregations = congregations
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCongregation = (congregation: Congregation) => {
    setAttendees([
      ...attendees,
      {
        congregationId: congregation.id,
        name: congregation.name,
        isNewCongregation: false,
      },
    ]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const addNewCongregation = (name: string) => {
    if (name.trim()) {
      setAttendees([
        ...attendees,
        {
          congregationId: null,
          name: name.trim(),
          isNewCongregation: true,
        },
      ]);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  };

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (attendees.length === 0) {
      toast.error("Tambahkan minimal satu peserta");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendees }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Berhasil mencatat ${attendees.length} kehadiran`);
        router.push("/attendance");
      } else {
        toast.error(result.error || "Gagal mencatat kehadiran");
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
      toast.error("Gagal mencatat kehadiran");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHour = new Date().getHours();
  
  let currentSession = "";
  let isValidServiceTime = false;
  
  if (currentHour >= 6 && currentHour < 9) {
    currentSession = "Kebaktian Umum 1";
    isValidServiceTime = true;
  } else if (currentHour >= 9 && currentHour < 13) {
    currentSession = "Kebaktian Umum 2";
    isValidServiceTime = true;
  } else {
    currentSession = "Di luar jam kebaktian";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link
          href="/attendance"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Buat Absensi
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            {currentSession} • {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(true)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white cursor-pointer flex items-center justify-between text-sm hover:border-gray-300"
            >
              <span className={searchQuery ? "text-gray-900" : "text-gray-400"}>
                {searchQuery || "Cari atau tambah jemaat..."}
              </span>
              <Search size={18} className="text-gray-400" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm outline-none bg-transparent text-gray-900"
                      placeholder="Ketik nama jemaat..."
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredCongregations.length > 0 ? (
                    filteredCongregations.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => selectCongregation(c)}
                        className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 text-gray-900"
                      >
                        {c.title ? `${c.title} ` : ""}{c.name}
                      </div>
                    ))
                  ) : searchQuery ? (
                    <div className="p-3">
                      <button
                        type="button"
                        onClick={() => addNewCongregation(searchQuery)}
                        className="w-full px-4 py-3 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        <span>Tambah "{searchQuery}" sebagai jemaat baru</span>
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Ketik untuk mencari jemaat
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {attendees.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">
                {attendees.length} jemaat ditambahkan:
              </p>
              <div className="flex flex-wrap gap-2">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <span>{attendee.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttendee(index)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/attendance"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm text-center"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || attendees.length === 0 || !isValidServiceTime}
            className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors font-medium shadow-lg hover:shadow-primary/20 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
          </button>
        </div>

        {!isValidServiceTime && (
          <p className="text-xs text-orange-600 text-center">
            Absensi hanya dapat dicatat pada jam 06:00 - 13:00 (GMT+7)
          </p>
        )}
      </form>
    </div>
  );
}
