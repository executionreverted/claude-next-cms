import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

// GET - Get a specific blog post by slug (public)
export async function GET(request: NextRequest, props: Params) {
  const params = await props.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                bio: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Error fetching blog post" },
      { status: 500 }
    );
  }
}
