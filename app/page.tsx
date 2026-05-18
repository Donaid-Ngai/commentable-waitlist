"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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

      <motion.section
        className="hero-section"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.p className="eyebrow" variants={fadeUp}>
          Commentable
        </motion.p>
        <motion.h1 variants={fadeUp}>Comment on any website.</motion.h1>
        <motion.p className="lede" variants={fadeUp}>
          Highlight the page. Leave feedback in context. Save it for your contractor or your AI
          workflow.
        </motion.p>

        <motion.form className="waitlist-form" onSubmit={handleSubmit} variants={fadeUp}>
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
        </motion.form>

        <motion.p className={`status ${status.type}`} aria-live="polite" variants={fadeUp}>
          {status.type === "idle" ? "Scroll for a quick preview." : status.message}
        </motion.p>
      </motion.section>

      <section className="story-stack">
        <motion.section
          className="showcase-panel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="panel-copy">
            <p className="section-label">Live page review</p>
            <h2>Click the page itself.</h2>
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
                  <p className="panel-label">Comments</p>
                  <div className="comment-thread">
                    <div className="thread-targets">
                      <span>Headline</span>
                      <span>CTA</span>
                    </div>
                    <p>Clearer. Stronger. Less formal.</p>
                  </div>
                  <div className="comment-thread">
                    <div className="thread-targets">
                      <span>Section copy</span>
                    </div>
                    <p>Shorten this.</p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="info-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.article className="info-card" variants={fadeUp}>
            <p className="section-label">Stored cleanly</p>
            <h3>Page</h3>
            <ul>
              <li>Selected elements</li>
              <li>Saved thread</li>
              <li>Context preserved</li>
            </ul>
          </motion.article>

          <motion.article className="info-card" variants={fadeUp}>
            <p className="section-label">Ready to hand off</p>
            <h3>Next step</h3>
            <ul>
              <li>Send to contractor</li>
              <li>Send to AI agent</li>
              <li>Ship the revision</li>
            </ul>
          </motion.article>
        </motion.section>
      </section>
    </main>
  );
}
