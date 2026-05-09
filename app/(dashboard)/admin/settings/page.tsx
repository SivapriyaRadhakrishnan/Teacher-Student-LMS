import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Settings"
        description="Manage LMS platform settings and preferences."
      />

      {/* ACCOUNT */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Account Settings
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <p className="font-medium">
              Admin Access
            </p>

            <p className="text-sm text-muted-foreground">
              Manage administrator
              account permissions.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Security
            </p>

            <p className="text-sm text-muted-foreground">
              Configure platform
              authentication and security.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Notifications
            </p>

            <p className="text-sm text-muted-foreground">
              Manage email and platform
              notifications.
            </p>
          </div>
        </div>
      </div>

      {/* PLATFORM */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Platform Settings
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <p className="font-medium">
              Storage Management
            </p>

            <p className="text-sm text-muted-foreground">
              Monitor uploaded files and
              storage usage.
            </p>
          </div>

          <div>
            <p className="font-medium">
              Batch Configuration
            </p>

            <p className="text-sm text-muted-foreground">
              Configure years and batch
              structures.
            </p>
          </div>

          <div>
            <p className="font-medium">
              System Maintenance
            </p>

            <p className="text-sm text-muted-foreground">
              Manage LMS operational
              settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}