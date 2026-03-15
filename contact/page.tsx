"use client";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";

interface ContactLink { label: string; href: string; icon: string; color: string; }

export default function ContactPage() {
  const [links, setLinks]       = useState<ContactLink[]>([]);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) {
          setLinks(Array.isArray(d.links) ? d.links : []);
          setResumeUrl(d.resumeUrl ?? "");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PublicLayout active="contact">
      <div className="max-w-lg">
        <h1 className="text-3xl font-black text-text mb-1">Contact</h1>
        <p className="text-muted text-sm mb-8">{"Let's build something together."}</p>

        {links.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {links.map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-green/20 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border"
                  style={{ background: l.color + "15", borderColor: l.color + "30", color: l.color }}
                >
                  {l.icon}
                </div>
                <div>
                  <p className="font-semibold text-text text-sm group-hover:text-green transition-colors">
                    {l.label}
                  </p>
                  <p className="font-mono text-[10px] text-muted">↗ Open</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 border border-green/30 text-green rounded-xl hover:bg-green/5 transition-colors font-mono text-sm"
          >
            ↓ Download Resume
          </a>
        )}
      </div>
    </PublicLayout>
  );
}
