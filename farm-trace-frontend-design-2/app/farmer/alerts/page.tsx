"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

const mockAlerts = [
  {
    id: 1,
    type: "Quality Check",
    message: "Batch #BT001 AI analysis complete - Very Fresh rating (95%)",
    severity: "info" as const,
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Price Alert",
    message: "Tomato prices below market average. Consider adjusting pricing.",
    severity: "warning" as const,
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "Transport Update",
    message: "Batch #BT002 has been picked up by distributor",
    severity: "info" as const,
    time: "1 day ago",
  },
  {
    id: 4,
    type: "Data Mismatch",
    message: "Weight discrepancy detected in Batch #BT003 during pickup",
    severity: "high" as const,
    time: "2 days ago",
  },
]

export default function FarmerAlertsPage() {
  return (
    <DashboardLayout role="farmer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated on important events for your batches</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  alert.severity === "high"
                    ? "bg-red-50 border-red-200"
                    : alert.severity === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex-shrink-0">
                  {alert.severity === "high" && <AlertCircle className="h-5 w-5 text-red-600" />}
                  {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  {alert.severity === "info" && <Info className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-gray-900">{alert.type}</span>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "warning"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
