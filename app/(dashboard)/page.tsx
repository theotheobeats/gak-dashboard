"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Users, Calendar, CheckSquare } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">
            Welcome to GAK Dashboard. Manage your congregation and activities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Congregations"
          value="0"
          trend="up"
          trendLabel="Active members"
          variant="primary"
        />
        <StatCard
          title="Active Members"
          value="0"
          trend="up"
          trendLabel="Currently active"
        />
        <StatCard
          title="Attendance Today"
          value="0"
          trend="up"
          trendLabel="Recorded today"
        />
        <StatCard
          title="Pending Tasks"
          value="0"
          trend="up"
          trendLabel="Need attention"
        />

        <div className="xl:col-span-2 min-h-[300px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/congregations"
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Congregations</h4>
                <p className="text-sm text-gray-500">View and edit members</p>
              </div>
            </a>
            <a
              href="/congregations"
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Record Attendance</h4>
                <p className="text-sm text-gray-500">Track member presence</p>
              </div>
            </a>
            <a
              href="/congregations"
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Schedule</h4>
                <p className="text-sm text-gray-500">Upcoming events</p>
              </div>
            </a>
            <a
              href="/congregations"
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Reports</h4>
                <p className="text-sm text-gray-500">Analytics and insights</p>
              </div>
            </a>
          </div>
        </div>

        <div className="xl:col-span-2 min-h-[300px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Welcome to GAK Dashboard</p>
                <p className="text-xs text-gray-500">Get started by adding your first congregation member</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">System initialized</p>
                <p className="text-xs text-gray-500">All systems are running smoothly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
