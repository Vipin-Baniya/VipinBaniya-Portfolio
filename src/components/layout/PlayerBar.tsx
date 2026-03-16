"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePlayer } from "@/components/ui/PlayerContext";
import { Github, ExternalLink, X, Play, ChevronUp, ChevronDown, Star, GitFork, Eye, Video } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  active:    "bg-green/20 text-green",
  completed: "bg-blue-500/20 text-blue-400",
  research:  "bg-purple-500/20 text-purple-400",
};

export default function PlayerBar() {
  const { project, setProject } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => {
    if (project) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      setExpanded(false);
    }
  }, [project]);

  if (!project) return null;

  const hasDemo   = !!(project.demoUrl || project.liveUrl);
  const hasVideo  = !!project.videoUrl;
  const hasGithub = !!(project.githubOwner && project.githubRepo);

  function openDemo() {
    const url = project?.demoUrl || project?.liveUrl;
    if (url) window.open(url, "_blank", "noopener");
  }

  function openVideo() {
    if (project?.videoUrl) window.open(project.videoUrl, "_blank", "noopener");
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      {/* Expanded panel */}
      {expanded && (
        <div className="bg-[#0E0E0E] border-t border-border px-4 md:px-6 py-4
                        grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Stats */}
          <div>
            <p className="text-dim mb-2 uppercase tracking-widest text-[10px]">Repo Stats</p>
            <div className="space-y-1.5">
              {project.githubStars > 0 && (
                <div className="flex items-center gap-2 text-muted">
                  <Star size={11} className="text-yellow-400" />
                  <span>{project.githubStars.toLocaleString()} stars</span>
                </div>
              )}
              {project.githubForks > 0 && (
                <div className="flex items-center gap-2 text-muted">
                  <GitFork size={11} />
                  <span>{project.githubForks.toLocaleString()} forks</span>
                </div>
              )}
              {project.views > 0 && (
                <div className="flex items-center gap-2 text-muted">
                  <Eye size={11} />
                  <span>{project.views.toLocaleString()} views</span>
                </div>
              )}
              {!project.githubStars && !project.githubForks && !project.views && (
                <span className="text-dim">No stats yet</span>
              )}
            </div>
          </div>

          {/* Tech */}
          <div>
            <p className="text-dim mb-2 uppercase tracking-widest text-[10px]">Stack</p>
            <div className="flex flex-wrap gap-1">
              {project.techStack.map(t => (
                <span key={t} className="bg-surface border border-border text-dim px-2 py-0.5 rounded text-[10px]">{t}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-dim mb-2 uppercase tracking-widest text-[10px]">Links</p>
            <div className="space-y-1.5">
              <Link href={`/projects/${project.slug}`}
                className="flex items-center gap-2 text-muted hover:text-green transition-colors">
                <span className="w-3 h-3 rounded-full bg-green/20 flex-shrink-0" />
                View details
              </Link>
              {hasGithub && (
                <a href={`https://github.com/${project.githubOwner}/${project.githubRepo}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-text transition-colors">
                  <Github size={11} /> Repository
                </a>
              )}
              {hasDemo && (
                <button onClick={openDemo}
                  className="flex items-center gap-2 text-muted hover:text-green transition-colors w-full text-left">
                  <ExternalLink size={11} /> Live demo
                </button>
              )}
              {hasVideo && (
                <button onClick={openVideo}
                  className="flex items-center gap-2 text-muted hover:text-purple-400 transition-colors w-full text-left">
                  <Video size={11} /> Demo video
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-dim mb-2 uppercase tracking-widest text-[10px]">Info</p>
            <div className="space-y-1.5 text-muted">
              <div>Status: <span className={`${STATUS_COLOR[project.status]} px-1.5 py-0.5 rounded-full text-[10px]`}>{project.status}</span></div>
              {project.githubLanguage && <div>Language: <span className="text-text">{project.githubLanguage}</span></div>}
              {project.license && <div>License: <span className="text-text">{project.license}</span></div>}
            </div>
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="bg-surface/95 border-t border-border backdrop-blur-md
                      flex items-center gap-3 px-4 md:px-6 py-3 shadow-2xl">
        {/* Thumbnail */}
        <div className="shrink-0 relative">
          {project.banner ? (
            <img src={project.banner} alt={project.title}
              className="w-10 h-10 rounded-lg object-cover ring-1 ring-border" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center font-mono text-green/40 text-xs ring-1 ring-border">
              {"{}"}
            </div>
          )}
          {/* Animated playing indicator */}
          <div className="absolute -bottom-1 -right-1 flex items-end gap-px">
            {[3, 5, 4].map((h, i) => (
              <div key={i}
                className="w-1 bg-green rounded-full animate-pulse"
                style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/projects/${project.slug}`}
            className="font-semibold text-text text-sm hover:text-green transition-colors truncate block leading-tight">
            {project.slug === project.slug && project.title}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${STATUS_COLOR[project.status]}`}>
              {project.status}
            </span>
            {project.githubLanguage && (
              <span className="text-[10px] font-mono text-dim">{project.githubLanguage}</span>
            )}
            {project.githubStars > 0 && (
              <span className="text-[10px] font-mono text-dim flex items-center gap-0.5">
                <Star size={9} className="text-yellow-400" />{project.githubStars}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* PLAY = open demo/live/github */}
          <button
            onClick={() => {
              if (hasDemo) openDemo();
              else if (hasVideo) openVideo();
              else if (hasGithub) window.open(`https://github.com/${project.githubOwner}/${project.githubRepo}`, "_blank", "noopener");
              else window.location.href = `/projects/${project.slug}`;
            }}
            title={hasDemo ? "Open demo" : hasVideo ? "Watch video" : "Open GitHub"}
            className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-bg hover:opacity-90 transition-opacity shadow-lg shadow-green/20"
          >
            <Play size={14} className="ml-0.5" fill="currentColor" />
          </button>

          {hasGithub && (
            <a href={`https://github.com/${project.githubOwner}/${project.githubRepo}`}
              target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full text-dim hover:text-text hover:bg-white/5 transition-colors">
              <Github size={15} />
            </a>
          )}

          {hasDemo && (
            <a href={project.demoUrl || project.liveUrl!} target="_blank" rel="noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full text-dim hover:text-green hover:bg-white/5 transition-colors">
              <ExternalLink size={14} />
            </a>
          )}

          {/* Expand toggle */}
          <button onClick={() => setExpanded(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-dim hover:text-text hover:bg-white/5 transition-colors">
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {/* Dismiss */}
          <button onClick={() => setProject(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-dim hover:text-text hover:bg-white/5 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
