"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
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
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.12, delayChildren: 0.08 },
          },
        }}
      >
        <motion.p className="eyebrow" variants={fadeUp}>
          Commentable
        </motion.p>
        <motion.h1 variants={fadeUp}>Any website, fully commentable.</motion.h1>
        <motion.p className="lede" variants={fadeUp}>
          Highlight any element on a live page, save feedback in context, and hand those comments
          to an AI agent or your website contractor.
        </motion.p>

        <motion.div className="proof-points" variants={fadeUp} aria-label="Key product points">
          <span>Highlight any element</span>
          <span>Store comments with context</span>
          <span>Route feedback into execution</span>
        </motion.div>

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
          {status.type === "idle"
            ? "Scroll to see how the review flow works."
            : status.message}
        </motion.p>
      </motion.section>

      <section className="story-stack">
        <motion.section
          className="story-panel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="section-copy">
            <p className="section-label">Live review layer</p>
            <h2>Turn the website itself into the feedback surface.</h2>
            <p>
              Instead of collecting comments in email or scattered documents, reviewers click
              directly on headlines, buttons, cards, and sections. Every note stays attached to
              the thing they meant.
            </p>
          </div>

          <motion.div
            className="mockup-shell"
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
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
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="story-panel split-panel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="diagram-card">
            <p className="section-label">Structured storage</p>
            <div className="flow-blocks">
              <div className="flow-block">
                <strong>Selected targets</strong>
                <span>headline</span>
                <span>primary CTA</span>
                <span>pricing card</span>
              </div>
              <div className="flow-connector" />
              <div className="flow-block">
                <strong>Saved thread</strong>
                <p>
                  “These three areas should sound more confident and more direct for decision-makers.”
                </p>
              </div>
              <div className="flow-connector vertical" />
              <div className="flow-block accent-block">
                <strong>Stored with context</strong>
                <span>page path</span>
                <span>element IDs</span>
                <span>text snapshot</span>
              </div>
            </div>
          </div>

          <div className="section-copy">
            <p className="section-label">Stored for action</p>
            <h2>Comments stay organized instead of turning into cleanup work.</h2>
            <p>
              Each note is saved with the page, the selected elements, and the exact context it was
              left in. That makes it useful later for project tracking, contractor revisions, or
              agent-driven updates.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="story-panel final-panel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
        >
          <div className="section-copy">
            <p className="section-label">Execution handoff</p>
            <h2>Send the feedback to the person or system that will actually make the change.</h2>
            <p>
              Once comments are captured cleanly, they can move downstream to a website contractor,
              an internal team, or an AI workflow that proposes the next revision.
            </p>
          </div>

          <div className="handoff-board">
            <div className="handoff-column">
              <p>Review session</p>
              <div className="handoff-item">3 selected elements</div>
              <div className="handoff-item">1 consolidated comment</div>
              <div className="handoff-item">Saved to project</div>
            </div>
            <div className="handoff-track" />
            <div className="handoff-column accent">
              <p>Next step</p>
              <div className="handoff-item">Send to AI agent</div>
              <div className="handoff-item">Send to contractor</div>
              <div className="handoff-item">Ship revision faster</div>
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
}
