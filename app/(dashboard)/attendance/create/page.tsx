"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { BigButton } from "@/components/ui/BigButton";
import { Card, PageShell } from "@/components/ui/Shell";
import { DisplayPanel } from "@/components/ui/DisplayPanel";
import {
  SESSIONS,
  attendanceKey,
  congregationLabel,
  sessionLabel,
  sortByLabel,
  type AttendanceRecord,
  type CongregationRecord,
} from "@/lib/attendance";
import { formatDayKey, wibDayKey } from "@/lib/wib";

interface TodayResponse {
  success: boolean;
  data: AttendanceRecord[];
  counts: Record<string, number>;
  total: number;
  date: string;
}

interface CongregationsResponse {
  data: CongregationRecord[];
}

interface CreateAttendanceResponse {
  success: boolean;
  error?: string;
}

interface NewAttendee {
  name: string;
}

const VISIBLE_MEMBERS = 60;

export default function CreateAttendancePage() {
  return (
    <Suspense
      fallback={
        <PageShell className="flex min-h-[320px] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </PageShell>
      }
    >
      <CreateAttendanceForm />
    </Suspense>
  );
}

function CreateAttendanceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSession = searchParams.get("session") || "";

  const [session, setSession] = useState<string>(initialSession);
  const [congregations, setCongregations] = useState<CongregationRecord[]>([]);
  const [presentKeys, setPresentKeys] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newAttendees, setNewAttendees] = useState<NewAttendee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [isNewPersonOpen, setIsNewPersonOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [congregationResponse, todayResponse] = await Promise.all([
          fetch("/api/congregations?pageSize=1000", { credentials: "include" }),
          fetch("/api/attendances/today", { credentials: "include" }),
        ]);

        const congregationResult =
          (await congregationResponse.json()) as CongregationsResponse;
        if (congregationResult.data) {
          setCongregations(sortByLabel(congregationResult.data));
        }

        const todayResult = (await todayResponse.json()) as TodayResponse;
        if (todayResult.success) {
          setPresentKeys(
            new Set(
              todayResult.data.map((attendance) =>
                attendanceKey(
                  attendance.congregation.id,
                  attendance.sermonSession.name
                )
              )
            )
          );
        }
      } catch (error) {
        console.error("Error fetching attendance form data:", error);
        toast.error("Gagal memuat data jemaat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const query = searchQuery.trim();
  const normalizedQuery = query.toLowerCase();

  const filteredMembers = useMemo(() => {
    if (!normalizedQuery) return congregations;
    return congregations.filter((congregation) =>
      congregationLabel(congregation).toLowerCase().includes(normalizedQuery)
    );
  }, [congregations, normalizedQuery]);

  const visibleMembers = showAllMembers
    ? filteredMembers
    : filteredMembers.slice(0, VISIBLE_MEMBERS);

  const hasExactMatch = useMemo(
    () =>
      congregations.some(
        (congregation) =>
          congregationLabel(congregation).toLowerCase() === normalizedQuery
      ),
    [congregations, normalizedQuery]
  );

  const totalSelected = selectedIds.size + newAttendees.length;
  const canSubmit = Boolean(session) && totalSelected > 0 && !isSubmitting;

  const toggleMember = (congregationId: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(congregationId)) {
        next.delete(congregationId);
      } else {
        next.add(congregationId);
      }
      return next;
    });
  };

  const addNewAttendee = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setNewAttendees((previous) => [...previous, { name: trimmed }]);
    setSearchQuery("");
    setNewPersonName("");
    setIsNewPersonOpen(false);
  };

  const removeNewAttendee = (index: number) => {
    setNewAttendees((previous) => previous.filter((_, i) => i !== index));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setNewAttendees([]);
    toast.success("Pilihan dikosongkan");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    const attendees = [
      ...congregations
        .filter((congregation) => selectedIds.has(congregation.id))
        .map((congregation) => ({
          congregationId: congregation.id,
          name: congregation.name,
          isNewCongregation: false,
        })),
      ...newAttendees.map((attendee) => ({
        congregationId: null,
        name: attendee.name,
        isNewCongregation: true,
      })),
    ];

    try {
      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ attendees, sessionName: session }),
      });

      const result = (await response.json()) as CreateAttendanceResponse;

      if (response.ok && result.success) {
        toast.success(`${attendees.length} kehadiran tersimpan`);
        router.push("/attendance");
      } else {
        toast.error(result.error || "Gagal menyimpan absensi");
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
      toast.error("Gagal menyimpan absensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageShell className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <form onSubmit={handleSubmit} className="space-y-5">
        <header className="flex items-center gap-3 px-1">
          <Link
            href="/attendance"
            aria-label="Kembali ke absensi"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge)] active:translate-y-[4px] active:shadow-none"
          >
            <ArrowLeft size={26} strokeWidth={3} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
              Isi Absensi
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:text-xs">
              {formatDayKey(wibDayKey(), {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </header>

        <DisplayPanel
          label="Akan disimpan"
          value={totalSelected}
          unit="orang"
          sub={session ? sessionLabel(session) : "Pilih kebaktian dulu"}
          hint="tekan ✓ untuk simpan"
        />

        <Card step={1} title="Pilih kebaktian">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SESSIONS.map((option) => {
              const isActive = session === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSession(option)}
                  className={`flex min-h-20 items-center justify-center gap-3 rounded-2xl border-2 px-4 text-xl font-bold uppercase tracking-wide transition-all duration-100 active:translate-y-[4px] active:shadow-none ${
                    isActive
                      ? "border-ink bg-ink text-screen-ink shadow-[0_6px_0_var(--device-ink-dark)]"
                      : "border-edge bg-surface text-ink shadow-[0_6px_0_var(--device-edge)]"
                  }`}
                >
                  {isActive && <Check size={28} strokeWidth={4} />}
                  {sessionLabel(option)}
                </button>
              );
            })}
          </div>
        </Card>

        <Card step={2} title="Tandai yang hadir">
          {!session ? (
            <p className="rounded-2xl border-2 border-dashed border-edge px-4 py-8 text-center text-base font-semibold text-mute">
              Pilih kebaktian pada langkah 1 dulu
            </p>
          ) : (
            <>
              <div className="relative">
                <Search
                  size={22}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (query && !hasExactMatch) addNewAttendee(query);
                    }
                  }}
                  placeholder="Ketik nama jemaat…"
                  className="h-16 w-full rounded-2xl border-2 border-edge bg-surface pr-4 pl-12 text-lg font-semibold text-ink placeholder:text-mute focus:border-accent focus:outline-none"
                />
              </div>

              {query && !hasExactMatch && (
                <button
                  type="button"
                  onClick={() => addNewAttendee(query)}
                  className="mt-3 flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 border-dashed border-accent bg-accent/10 px-4 py-2 text-left active:translate-y-[3px]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent text-accent-dark">
                    <UserPlus size={24} strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-dark">
                      Tambah orang baru
                    </span>
                    <span className="block truncate text-base font-bold text-ink sm:text-lg">
                      {query}
                    </span>
                  </span>
                </button>
              )}

              {!isNewPersonOpen ? (
                <BigButton
                  variant="surface"
                  size="lg"
                  block
                  className="mt-3"
                  onClick={() => setIsNewPersonOpen(true)}
                >
                  <UserPlus size={22} strokeWidth={3} />
                  Orang baru / tamu
                </BigButton>
              ) : (
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={newPersonName}
                    onChange={(event) => setNewPersonName(event.target.value)}
                    placeholder="Nama orang baru…"
                    autoFocus
                    className="h-14 flex-1 rounded-2xl border-2 border-edge bg-surface px-4 text-base font-semibold text-ink placeholder:text-mute focus:border-accent focus:outline-none"
                  />
                  <BigButton
                    variant="primary"
                    size="lg"
                    onClick={() => addNewAttendee(newPersonName)}
                    disabled={!newPersonName.trim()}
                  >
                    <Plus size={22} strokeWidth={3} />
                    Tambah
                  </BigButton>
                  <BigButton
                    variant="quiet"
                    size="lg"
                    onClick={() => {
                      setIsNewPersonOpen(false);
                      setNewPersonName("");
                    }}
                  >
                    Tutup
                  </BigButton>
                </div>
              )}

              {newAttendees.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-dark">
                    Orang baru ({newAttendees.length})
                  </p>
                  <div className="space-y-2">
                    {newAttendees.map((attendee, index) => (
                      <div
                        key={`${attendee.name}-${index}`}
                        className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-accent bg-accent/10 px-4 py-2"
                      >
                        <span className="truncate text-base font-bold text-ink sm:text-lg">
                          {attendee.name}
                        </span>
                        <button
                          type="button"
                          aria-label={`Hapus ${attendee.name}`}
                          onClick={() => removeNewAttendee(index)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface text-accent-dark active:translate-y-[3px]"
                        >
                          <X size={22} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                  {filteredMembers.length} jemaat · tekan nama untuk menandai
                </p>
                <div className="space-y-2">
                  {visibleMembers.map((congregation) => {
                    const isSelected = selectedIds.has(congregation.id);
                    const isAlreadyPresent = presentKeys.has(
                      attendanceKey(congregation.id, session)
                    );

                    return (
                      <button
                        key={congregation.id}
                        type="button"
                        disabled={isAlreadyPresent}
                        onClick={() => toggleMember(congregation.id)}
                        className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-100 ${
                          isSelected
                            ? "border-accent-dark bg-accent text-white shadow-[0_4px_0_var(--device-accent-dark)] active:translate-y-[4px] active:shadow-none"
                            : isAlreadyPresent
                              ? "border-edge bg-canvas text-mute"
                              : "border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge)] active:translate-y-[4px] active:shadow-none"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-base font-bold sm:text-lg">
                            {congregationLabel(congregation)}
                          </span>
                          {isAlreadyPresent && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                              sudah tercatat
                            </span>
                          )}
                        </span>
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-white bg-white text-accent-dark"
                              : isAlreadyPresent
                                ? "border-mute/40 bg-mute/15 text-mute"
                                : "border-edge bg-canvas text-mute"
                          }`}
                        >
                          {isSelected || isAlreadyPresent ? (
                            <Check size={24} strokeWidth={4} />
                          ) : (
                            <Plus size={24} strokeWidth={3} />
                          )}
                        </span>
                      </button>
                    );
                  })}

                  {filteredMembers.length === 0 && (
                    <p className="rounded-2xl border-2 border-dashed border-edge px-4 py-6 text-center text-base font-semibold text-mute">
                      Jemaat tidak ditemukan
                    </p>
                  )}
                </div>

                {!showAllMembers && filteredMembers.length > VISIBLE_MEMBERS && (
                  <BigButton
                    variant="surface"
                    block
                    className="mt-3"
                    onClick={() => setShowAllMembers(true)}
                  >
                    Tampilkan semua ({filteredMembers.length})
                  </BigButton>
                )}
              </div>
            </>
          )}
        </Card>

        <div className="sticky bottom-0 z-20 -mx-3 -mb-3 rounded-b-[30px] border-t-2 border-edge bg-canvas/95 px-3 pt-4 pb-3 backdrop-blur sm:-mx-5 sm:-mb-5 sm:px-5 sm:pb-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton
              variant="surface"
              size="xl"
              onClick={clearSelection}
              disabled={totalSelected === 0}
              className="sm:w-40"
            >
              Reset
            </BigButton>
            <BigButton
              type="submit"
              variant="primary"
              size="xl"
              block
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <Loader2 size={26} className="animate-spin" />
              ) : (
                <Check size={28} strokeWidth={4} />
              )}
              {isSubmitting ? "Menyimpan…" : `Simpan ${totalSelected}`}
            </BigButton>
          </div>
        </div>
      </form>
    </PageShell>
  );
}
