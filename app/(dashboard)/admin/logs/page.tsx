import { AuditService } from "@/services/audit.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminLogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const logs = await AuditService.getLogs();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Журнал действий</h1>
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {new Date(log.timestamp).toLocaleString("ru-RU")}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {log.user.name} ({log.user.role})
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm">
                <strong>Действие:</strong> {log.action}
              </p>
              {log.details && (
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {log.details}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
        {logs.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            Логов пока нет
          </p>
        )}
      </div>
    </div>
  );
}
