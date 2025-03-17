import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

export interface Profile {
  id: string;
  bio?: string | null;
  location?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  website?: string | null;
  twitterHandle?: string | null;
  githubHandle?: string | null;
  linkedinHandle?: string | null;
  avatarUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  profile?: Profile | null;
  createdAt: Date;
  updatedAt: Date;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}
