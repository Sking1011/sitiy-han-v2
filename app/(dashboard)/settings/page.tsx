import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/settings/user-management"
import { SystemMonitoring } from "@/components/settings/system-monitoring"
import { ExportData } from "@/components/settings/export-data"
import { getUsers } from "@/app/actions/user.actions"
import { AuditService } from "@/services/audit.service"

export const dynamic = "force-dynamic"

export default function SettingsPage() {
  // We don't use await here if we want to stream, but for now let's keep it simple
  // Actually, getUsers and getLogs are async
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управление пользователями, мониторинг системы и экспорт данных.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="export">Выгруз</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <SettingsContentWrapper tab="users" />
        </TabsContent>
        <TabsContent value="system" className="space-y-4">
          <SettingsContentWrapper tab="system" />
        </TabsContent>
        <TabsContent value="export" className="space-y-4">
          <ExportData />
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function SettingsContentWrapper({ tab }: { tab: string }) {
  if (tab === "users") {
    const users = await getUsers()
    return <UserManagement initialUsers={users} />
  }
  
  if (tab === "system") {
    const logs = await AuditService.getLogs(50)
    // Convert dates to strings for client component
    const formattedLogs = logs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString()
    }))
    return <SystemMonitoring logs={formattedLogs as any} />
  }
  
  return null
}
