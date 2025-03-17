import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      password: undefined, // Never return the password
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}