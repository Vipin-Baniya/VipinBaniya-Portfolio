import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getRepoInfo, getRepoTopics } from "@/lib/github";
import { requireAdmin, ok, err, OWNER_ID } from "@/lib/apiHelpers";

// POST /api/projects/sync
// body: { id: string }
// Pulls latest GitHub stats into the project document

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();

    const { id } = await req.json();

    const project = await Project.findOne({
      _id: id,
      ownerId: OWNER_ID,
    });

    if (!project) return err("Project not found", 404);

    if (!project.githubOwner || !project.githubRepo) {
      return err("Project has no GitHub repo linked");
    }

    // Fetch GitHub repo info and topics
    const [info, topics] = await Promise.all([
      getRepoInfo(project.githubOwner, project.githubRepo),
      getRepoTopics(project.githubOwner, project.githubRepo),
    ]);

    // Ensure info is never null
    const safeInfo = info || {
      stars: 0,
      forks: 0,
      language: "",
      updatedAt: "",
      openIssues: 0,
      license: "",
    };

    await Project.findByIdAndUpdate(id, {
      $set: {
        githubStars: safeInfo.stars || 0,
        githubForks: safeInfo.forks || 0,
        githubLanguage: safeInfo.language || "",
        githubUpdatedAt: safeInfo.updatedAt || "",
        openIssues: safeInfo.openIssues || 0,
        license: safeInfo.license || "",
        topics: topics || [],
      },
    });

    const updated = await Project.findById(id).lean();

    return ok(updated);

  } catch (e: any) {
    console.error("GitHub Sync Error:", e);
    return err(e.message || "Sync failed", 500);
  }
}
