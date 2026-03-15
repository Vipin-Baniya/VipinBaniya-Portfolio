import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import PublicLayout from "@/components/layout/PublicLayout";
import PostView from "@/components/public/PostView";

const OWNER_ID = process.env.OWNER_ID || "vipin";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug, ownerId: OWNER_ID, published: true }).lean() as any;
    if (post) return { title: post.title, description: post.excerpt || post.title };
  } catch {}
  return { title: "Note — Structify" };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  return <PublicLayout active="blog"><PostView slug={params.slug} /></PublicLayout>;
}
