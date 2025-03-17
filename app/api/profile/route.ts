import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch the current user's profile
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update the current user's profile
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      name,
      bio, 
      location, 
      jobTitle, 
      company, 
      website, 
      twitterHandle, 
      githubHandle, 
      linkedinHandle,
      avatarUrl
    } = body;

    // Create profile if it doesn't exist
    if (!currentUser.profile) {
      await prisma.profile.create({
        data: {
          userId: currentUser.id,
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: name ?? currentUser.name,
        profile: {
          update: {
            bio: bio !== undefined ? bio : currentUser.profile?.bio,
            location: location !== undefined ? location : currentUser.profile?.location,
            jobTitle: jobTitle !== undefined ? jobTitle : currentUser.profile?.jobTitle,
            company: company !== undefined ? company : currentUser.profile?.company,
            website: website !== undefined ? website : currentUser.profile?.website,
            twitterHandle: twitterHandle !== undefined ? twitterHandle : currentUser.profile?.twitterHandle,
            githubHandle: githubHandle !== undefined ? githubHandle : currentUser.profile?.githubHandle,
            linkedinHandle: linkedinHandle !== undefined ? linkedinHandle : currentUser.profile?.linkedinHandle,
            avatarUrl: avatarUrl !== undefined ? avatarUrl : currentUser.profile?.avatarUrl,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
