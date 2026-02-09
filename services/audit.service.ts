import { prisma } from "@/lib/prisma";

export class AuditService {
  static async log(userId: string, action: string, details?: any) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          details: details ? JSON.stringify(details) : null,
        },
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  }

  static async getLogs(limit = 100, offset = 0) {
    return prisma.auditLog.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        timestamp: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
