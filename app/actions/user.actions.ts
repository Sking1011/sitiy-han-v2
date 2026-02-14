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
        email: data.email && data.email.trim() !== "" ? data.email : null,
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
    const updateData: any = {}
    
    if (data.username) updateData.username = data.username
    if (data.name) updateData.name = data.name
    if (data.role) updateData.role = data.role
    
    // Convert empty string to null to avoid Unique Constraint conflicts
    if (data.email === "" || data.email === null) {
      updateData.email = null
    } else if (data.email) {
      updateData.email = data.email
    }
    
    if (data.password && data.password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(data.password, 10)
    }

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