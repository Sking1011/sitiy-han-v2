import { AuditService } from "@/services/audit.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { LogsTable } from "@/components/admin/logs-table";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const logs = await AuditService.getLogs(100); // Get last 100 logs

  // Serialize logs for client component
  const serializedLogs = logs.map(log => ({
    ...log,
    timestamp: log.timestamp.toISOString()
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Журнал действий</h1>
        <p className="text-muted-foreground">
          Полная история операций в системе для аудита и безопасности.
        </p>
      </div>
      
      <LogsTable logs={serializedLogs} />
    </div>
  );
}
