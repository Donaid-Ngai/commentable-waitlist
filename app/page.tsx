"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitState>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to join the waitlist right now.");
      }

      setStatus({ type: "success", message: data.message ?? "You are on the list." });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to join the waitlist right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="backdrop" />
      <section className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">Commentable</p>
          <h1>Any website, fully commentable.</h1>
          <p className="lede">
            Highlight any element on a live page, attach feedback to it, and keep every comment
            organized for an AI agent or your website contractor.
          </p>

          <div className="proof-points" aria-label="Key product points">
            <span>Highlight elements</span>
            <span>Save feedback in context</span>
            <span>Hand off to AI or your contractor</span>
          </div>

          <form className="waitlist-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join the waitlist"}
            </button>
          </form>

          <p className={`status ${status.type}`} aria-live="polite">
            {status.type === "idle"
              ? "Built for freelancers, agencies, and product teams."
              : status.message}
          </p>
        </div>

        <div className="mockup-shell" aria-hidden="true">
          <div className="browser-frame">
            <div className="browser-bar">
              <span />
              <span />
              <span />
            </div>

            <div className="browser-content">
              <div className="site-preview">
                <div className="site-nav">
                  <div className="nav-logo" />
                  <div className="nav-links">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="site-hero">
                  <div className="hero-kicker" />
                  <div className="hero-line hero-line-long is-highlighted">
                    <div className="comment-badge">1</div>
                  </div>
                  <div className="hero-line hero-line-mid" />
                  <div className="hero-line hero-line-copy" />
                  <div className="hero-line hero-line-copy short is-highlighted">
                    <div className="comment-badge">2</div>
                  </div>

                  <div className="button-row">
                    <div className="preview-button is-highlighted">
                      <div className="comment-badge">3</div>
                    </div>
                    <div className="preview-button secondary" />
                  </div>
                </div>

                <div className="preview-grid">
                  <div className="preview-card">
                    <div className="card-line title" />
                    <div className="card-line" />
                    <div className="card-line short" />
                  </div>
                  <div className="preview-card">
                    <div className="card-line title" />
                    <div className="card-line" />
                    <div className="card-line short" />
                  </div>
                </div>
              </div>

              <aside className="comment-panel">
                <p className="panel-label">Captured comments</p>
                <div className="comment-thread">
                  <div className="thread-targets">
                    <span>Hero headline</span>
                    <span>Primary CTA</span>
                  </div>
                  <p>Make this clearer and less formal. Push the main action harder.</p>
                </div>
                <div className="comment-thread">
                  <div className="thread-targets">
                    <span>Section copy</span>
                  </div>
                  <p>Good direction. Needs simpler wording for a non-technical buyer.</p>
                </div>
                <div className="handoff-row">
                  <div className="handoff-pill">Saved to project</div>
                  <div className="handoff-arrow" />
                  <div className="handoff-pill accent">Send to AI or contractor</div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
