import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    trend?: "up" | "down";
    trendLabel?: string;
    variant?: "primary" | "white";
}

export function StatCard({ title, value, trend, trendLabel, variant = "white" }: StatCardProps) {
    const isPrimary = variant === "primary";

    return (
        <div
            className={`p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isPrimary ? "bg-primary text-white" : "bg-white text-gray-900"
                }`}
        >
            {/* Background blobs for primary card */}
            {isPrimary && (
                <>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                </>
            )}

            <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className={`font-medium text-sm ${isPrimary ? "text-white/90" : "text-gray-500"}`}>
                    {title}
                </h3>
                <div
                    className={`p-1.5 rounded-full ${isPrimary ? "bg-white/20 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                >
                    <ArrowUpRight size={16} />
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-3xl font-bold mb-1.5 tracking-tight">{value}</div>
                {trendLabel && (
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`text-[10px] px-1 py-0.5 rounded border flex items-center gap-0.5 ${isPrimary
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-green-50 border-green-100 text-green-700"
                                }`}
                        >
                            {trend === "up" ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
                        </span>
                        <span className={`text-[10px] ${isPrimary ? "text-white/80" : "text-gray-400"}`}>
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
