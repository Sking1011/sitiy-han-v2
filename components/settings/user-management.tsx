"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Pencil, Trash2, Mail, ShieldCheck, User as UserIcon } from "lucide-react"
import { UserDialog } from "./user-dialog"
import { deleteUser } from "@/app/actions/user.actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserManagementProps {
  initialUsers: any[]
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleAdd = () => {
    setSelectedUser(null)
    setOpen(true)
  }

  const confirmDelete = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold hidden md:block">Управление пользователями</h2>
        <Button size="sm" onClick={handleAdd} className="w-full md:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Логин</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.username}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {initialUsers.map((user) => (
          <Card key={user.id} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${user.role === 'ADMIN' ? 'bg-primary' : 'bg-secondary'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-muted">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{user.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">{user.username}</CardDescription>
                  </div>
                </div>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-3 w-3" />
                  {user.email || "Нет email"}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ShieldCheck className="mr-2 h-3 w-3" />
                  Роль: {user.role}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(user)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Изменить
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => confirmDelete(user.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <UserDialog 
        open={open} 
        onOpenChange={setOpen} 
        user={selectedUser} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-[400px] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Пользователь будет навсегда удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}