import { ShieldCheck, Users, Lock, Key, UserCheck, ShieldAlert, Eye, Settings, FileText, Database, Shield } from "lucide-react";
import { WikiArticle } from "../types";
import { cn } from "@/lib/utils";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);

export const rolesSecurity: WikiArticle = {
  id: "roles-security",
  categoryId: "admin",
  title: "Роли и Доступ",
  content: "Матрица прав доступа и разграничение полномочий внутри системы Sitiy Han. Безопасность данных и аудит действий.",
  render: () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-background to-blue-500/5 p-8 md:p-12 border border-blue-500/20 shadow-inner">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-blue-600 text-white mb-4">Безопасность</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Ролевая модель <br />
            <span className="text-blue-600">и уровни доступа</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Система <strong>Sitiy Han</strong> использует строгую RBAC-модель (Role-Based Access Control) для защиты коммерческой информации и разграничения ответственности сотрудников.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              RBAC стандарт
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-5 h-5 text-blue-500" />
              Защита финансов
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="w-5 h-5 text-purple-500" />
              Аудит логов
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Role Matrix */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          Матрица полномочий
        </h3>
        <div className="rounded-[2rem] border overflow-hidden shadow-sm bg-card">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground border-b">Роль</th>
                <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground border-b">Описание и Ключевые права</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-primary tracking-tighter">ADMIN</span>
                    <Badge className="bg-red-100 text-red-700 w-fit">Full Access</Badge>
                  </div>
                </td>
                <td className="p-6 text-sm text-muted-foreground space-y-2">
                  <p><strong>Максимальные полномочия:</strong> управление пользователями, удаление данных, изменение системных настроек, просмотр всех финансовых отчетов.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-[9px]">Settings</Badge>
                    <Badge variant="outline" className="text-[9px]">Audit Logs</Badge>
                    <Badge variant="outline" className="text-[9px]">User Mgmt</Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-primary tracking-tighter">DIRECTOR</span>
                    <Badge className="bg-blue-100 text-blue-700 w-fit">Management</Badge>
                  </div>
                </td>
                <td className="p-6 text-sm text-muted-foreground space-y-2">
                  <p><strong>Управленческий учет:</strong> полный доступ к Бухгалтерии, аналитике прибыли, закупкам и продажам. Без прав на удаление пользователей.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-[9px]">Finance</Badge>
                    <Badge variant="outline" className="text-[9px]">Reports</Badge>
                    <Badge variant="outline" className="text-[9px]">Inventory</Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-primary tracking-tighter">OPERATOR</span>
                    <Badge className="bg-green-100 text-green-700 w-fit">Production</Badge>
                  </div>
                </td>
                <td className="p-6 text-sm text-muted-foreground space-y-2">
                  <p><strong>Производственный блок:</strong> создание варок, закуп сырья, управление складом. Закрыт доступ к финансовым отчетам и чистой прибыли.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-[9px]">Production</Badge>
                    <Badge variant="outline" className="text-[9px]">Stock</Badge>
                    <Badge variant="outline" className="text-[9px]">Procurement</Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-primary tracking-tighter">ACCOUNTANT</span>
                    <Badge className="bg-purple-100 text-purple-700 w-fit">Accounting</Badge>
                  </div>
                </td>
                <td className="p-6 text-sm text-muted-foreground space-y-2">
                  <p><strong>Финансовый контроль:</strong> просмотр транзакций, выгрузка данных для налогового учета, сверка остатков денежных средств.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-[9px]">Transactions</Badge>
                    <Badge variant="outline" className="text-[9px]">Export</Badge>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logging */}
      <div className="p-8 md:p-12 rounded-[2.5rem] bg-muted/30 border space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center border shadow-sm">
             <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Журнал аудита (Audit Log)</h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Любое значимое действие в системе (удаление товара, завершение варки, изменение цены) записывается в нередактируемый журнал. Это позволяет восстановить хронологию событий при возникновении спорных ситуаций.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span className="text-sm">Фиксация ID пользователя и IP-адреса</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                <span className="text-sm">Логирование параметров "До" и "После" изменения</span>
            </div>
        </div>
      </div>

      {/* Security Tip */}
      <div className="flex items-start gap-4 p-8 rounded-3xl bg-blue-500/[0.05] border border-blue-500/20">
         <ShieldAlert className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
         <div className="space-y-2">
            <h4 className="font-bold text-blue-800">Рекомендация по безопасности</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Используйте роль <strong>OPERATOR</strong> для сотрудников цеха. Это ограничит их доступ к финансовой информации предприятия (выручка, маржа), оставив полный функционал для учета производства.
            </p>
         </div>
      </div>
    </div>
  )
};

import { CheckCircle2 } from "lucide-react";
