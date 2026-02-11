"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createUser(data: {
  username: string
  name: string
  email?: string
  password: string
  role: Role
}) {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    })
    revalidatePath("/settings")
    return { success: true, user }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, data: {
  username?: string
  name?: string
  email?: string
  role?: Role
  password?: string
}) {
  try {
    const updateData: any = { ...data }
    
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10)
    }
    
    // Always delete 'password' property as it doesn't exist in Prisma model
    delete updateData.password

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })
    revalidatePath("/settings")
    return { success: true, user }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    })
    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}