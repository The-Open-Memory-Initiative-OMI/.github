const { useState, useEffect, useRef } =
  (typeof window !== "undefined" && window.React) || {
    // Fallback shims so this file can be safely loaded in static GitHub Pages
    useState: (initial) => [initial, () => {}],
    useEffect: () => {},
    useRef: (value) => ({ current: value ?? null }),
  };

const TRACKS = [
  {
    id: "dev",
    num: "01",
    title: "Developers",
    subtitle: "tooling + automation + docs",
    icon: "⚡",
    color: "#00ffa3",
    desc: "You can contribute without touching hardware.",
    tasks: [
      "Build linters/checkers (naming rules, consistency checks, schema validation)",
      "Improve documentation pipelines (doc generation, CI, templates)",
      'Create "spec ↔ schematic ↔ validation" traceability helpers',
    ],
    fit: "Python, CI, GitHub Actions, docs engineering, automation.",
  },
  {
    id: "review",
    num: "02",
    title: "Reviewers",
    subtitle: "correctness + clarity + scope enforcement",
    icon: "🔍",
    color: "#00d4ff",
    desc: "You help keep OMI coherent.",
    tasks: [
      "Review docs/specs for internal consistency and missing assumptions",
      "Check that decisions are justified and scoped properly",
      'Turn "vibes" into structured review notes and actionable issues',
    ],
    fit: "Systems thinking, correctness, design review, documentation quality.",
  },
  {
    id: "test",
    num: "03",
    title: "Testers",
    subtitle: "validation evidence + reproducible reports",
    icon: "🧪",
    color: "#ff6b9d",
    desc: "You turn designs into reality checks.",
    tasks: [
      "Run validation steps on real platforms",
      "Submit structured test reports (platform details, procedure, results, failures)",
      "Help build the validation matrix (what works where, and why)",
    ],
    fit: "Hardware bring-up, debugging, measurement discipline, reporting.",
  },
];

const STEPS = [
  { label: "Open Repo", detail: "Open the main omi repository" },
  { label: "Read Guide", detail: "Read START_HERE.md and choose a track" },
  {
    label: "Pick Task",
    detail: "good-first-issue · review-needed · test-needed",
  },
  { label: "Submit", detail: "PR (docs/tooling) or Issue (review/validation)" },
];

const PRINCIPLES = [
  { left: "Reproducibility", right: "cleverness", symbol: ">" },
  { left: "Explicit assumptions", right: "hidden context", symbol: ">" },
  { left: "Structured review", right: "subjective debate", symbol: ">" },
  { left: "Evidence & traceability", right: '"it seems right"', symbol: ">" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Guard against environments without IntersectionObserver (older browsers, some tests/SSR)
    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new window.IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Section({ children, delay = 0 }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function GridBG() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(0,255,163,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,163,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }} />
  );
}

function Glow({ color, top, left, size = 400 }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      borderRadius: "50%", pointerEvents: "none", zIndex: 0,
    }} />
  );
}

export default function OMIReadme() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const quizQuestions = [
    {
      q: "What excites you most?",
      options: [
        { label: "Automating workflows", track: "dev" },
        { label: "Finding inconsistencies", track: "review" },
        { label: "Testing on real hardware", track: "test" },
      ],
    },
    {
      q: "Preferred tools?",
      options: [
        { label: "Python, CI/CD, scripts", track: "dev" },
        { label: "Docs, specs, checklists", track: "review" },
        { label: "Oscilloscopes, boards, probes", track: "test" },
      ],
    },
    {
      q: "Your superpower?",
      options: [
        { label: "Making things automatic", track: "dev" },
        { label: "Spotting what's missing", track: "review" },
        { label: "Breaking things (on purpose)", track: "test" },
      ],
    },
  ];

  const computeQuiz = () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) return;
    const counts = { dev: 0, review: 0, test: 0 };
    Object.values(quizAnswers).forEach((t) => counts[t]++);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxScore = sorted[0][1];
    const topTracks = sorted.filter(([, score]) => score === maxScore);
    if (maxScore === 0 || topTracks.length !== 1) {
      // No clear single best match (either tie or no answers).
      setQuizResult(null);
      return;
    }
    const best = topTracks[0][0];
    setQuizResult(best);
    setActiveTrack(best);
  };

  const font = "'IBM Plex Mono', 'SF Mono', 'Fira Code', monospace";
  const fontSans = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

  return (
    <div className="omi-readme-widget" style={{
      minHeight: "100vh",
      background: "#0a0e14",
      color: "#c5cdd8",
      fontFamily: fontSans,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        /* NOTE: Fonts used by this component (DM Sans, IBM Plex Mono, Anybody)
         * must be loaded by the hosting document, e.g. via
         * <link rel="preconnect"> and <link rel="stylesheet"> tags in <head>.
         * This <style> block is reserved for local rules only. */
        .omi-readme-widget * { box-sizing: border-box; margin: 0; padding: 0; }
        .omi-readme-widget ::-webkit-scrollbar { width: 6px; }
        .omi-readme-widget ::-webkit-scrollbar-track { background: #0a0e14; }
        .omi-readme-widget ::-webkit-scrollbar-thumb { background: #1a2030; border-radius: 3px; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      <GridBG />

      {/* Scanline effect */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        overflow: "hidden", opacity: 0.03,
      }}>
        <div style={{
          width: "100%", height: "4px", background: "#00ffa3",
          animation: "scanline 4s linear infinite",
        }} />
      </div>

      <div style={{
        maxWidth: 880, margin: "0 auto", padding: "0 24px",
        position: "relative", zIndex: 2,
      }}>

        {/* ═══ HEADER ═══ */}
        <Section>
          <header style={{ paddingTop: 80, paddingBottom: 64, position: "relative" }}>
            <Glow color="#00ffa3" top={-100} left={-200} size={500} />
            <div style={{
              fontFamily: font, fontSize: 11, letterSpacing: 4,
              color: "#00ffa3", textTransform: "uppercase", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#00ffa3", display: "inline-block",
                animation: "pulse 2s ease infinite",
              }} />
              Open Memory Initiative
            </div>
            <h1 style={{
              fontFamily: "'Anybody', sans-serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#eef1f6",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}>
              No black boxes.
              <br />
              <span style={{
                background: "linear-gradient(135deg, #00ffa3, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                If it can't be inspected,
              </span>
              <br />
              it can't be trusted.
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.7, maxWidth: 560, color: "#8891a0",
            }}>
              Building an open, verifiable memory design & documentation ecosystem
              — making memory systems explainable, reviewable, and reproducible.
            </p>
          </header>
        </Section>

        {/* ═══ WHAT OMI IS / ISN'T ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {
                  key: "is",
                  title: "OMI is",
                  color: "#00ffa3",
                  items: [
                    "A community effort to document and design memory systems with auditability and repeatable validation",
                    "A place where assumptions are explicit, decisions are documented, and review is structured",
                    "A collaboration between developers, reviewers, and testers",
                  ],
                },
                {
                  key: "isnt",
                  title: "OMI is not",
                  color: "#ff4d6a",
                  items: [
                    "A place to share NDA/proprietary vendor material, leaked docs, or anything violating IP boundaries",
                    'A "trust me bro" spec dump — we prefer evidence, references, and clear assumptions',
                  ],
                },
              ].map(({ key, title, color, items }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSection(key)}
                  aria-expanded={!!expandedSections[key]}
                  aria-controls={`section-${key}`}
                  style={{
                    background: expandedSections[key] ? "#111722" : "#0d1119",
                    border: `1px solid ${expandedSections[key] ? color + "40" : "#1a2030"}`,
                    borderRadius: 12,
                    padding: "20px 24px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s ease",
                    color: "inherit",
                  }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: expandedSections[key] ? 16 : 0,
                  }}>
                    <span style={{
                      fontFamily: font, fontWeight: 600, fontSize: 15,
                      color: color,
                    }}>
                      {title}
                    </span>
                    <span style={{
                      fontFamily: font, fontSize: 18, color: "#4a5568",
                      transform: expandedSections[key] ? "rotate(45deg)" : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }}>
                      +
                    </span>
                  </div>
                  <div
                    id={`section-${key}`}
                    style={{
                      maxHeight: expandedSections[key] ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.4s ease",
                    }}
                  >
                    {items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: 10,
                        fontSize: 14, lineHeight: 1.6, color: "#8891a0",
                      }}>
                        <span style={{ color, flexShrink: 0, marginTop: 2 }}>
                          {key === "is" ? "✓" : "✗"}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══ WHERE TO START ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 28, fontWeight: 800,
              color: "#eef1f6", marginBottom: 24,
            }}>
              Where to start
            </h2>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0d1119, #111a28)",
                border: "1px solid #1a2030",
                borderRadius: 12, padding: 24, position: "relative", overflow: "hidden",
              }}>
                <Glow color="#00ffa3" top={-60} left={-60} size={200} />
                <div style={{
                  fontFamily: font, fontSize: 11, letterSpacing: 3,
                  color: "#00ffa3", textTransform: "uppercase", marginBottom: 12,
                }}>
                  ⭐ Main Project
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#eef1f6", marginBottom: 8 }}>
                  OMI Core Repository
                </div>
                <div style={{
                  fontFamily: font, fontSize: 13, color: "#00ffa3",
                  background: "#00ffa308", padding: "6px 12px",
                  borderRadius: 6, display: "inline-block", marginBottom: 8,
                }}>
                  START_HERE.md
                </div>
                <div style={{ fontSize: 13, color: "#6b7685", lineHeight: 1.6 }}>
                  Beginner-friendly entry points and contribution tracks
                </div>
              </div>
              <div style={{
                background: "#0d1119", border: "1px solid #1a2030",
                borderRadius: 12, padding: 24,
              }}>
                <div style={{
                  fontFamily: font, fontSize: 11, letterSpacing: 3,
                  color: "#00d4ff", textTransform: "uppercase", marginBottom: 12,
                }}>
                  💬 Community
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#eef1f6", marginBottom: 12 }}>
                  Communication Channels
                </div>
                {[
                  { label: "GitHub Discussions", desc: "Questions, proposals, design RFCs" },
                  { label: "Issues", desc: "Actionable tasks, review findings, validation reports" },
                ].map((ch, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, marginBottom: 8,
                    fontSize: 13, color: "#8891a0", lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#00d4ff", flexShrink: 0 }}>→</span>
                    <span><strong style={{ color: "#c5cdd8" }}>{ch.label}</strong> — {ch.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ═══ FIND YOUR TRACK QUIZ ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => { setShowQuiz(!showQuiz); setQuizResult(null); setQuizAnswers({}); }}
              aria-expanded={showQuiz}
              {...(showQuiz ? { "aria-controls": "quiz-panel" } : {})}
              style={{
                fontFamily: font, fontSize: 13, fontWeight: 600,
                background: showQuiz ? "#1a2030" : "linear-gradient(135deg, #00ffa320, #00d4ff20)",
                border: "1px solid #00ffa340",
                color: "#00ffa3", padding: "12px 28px",
                borderRadius: 8, cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: 1,
              }}
            >
              {showQuiz ? "✗  Close Quiz" : "⚡  Find Your Track — Take the Quiz"}
            </button>
          </div>

          {showQuiz && (
            <div
              id="quiz-panel"
              role="region"
              aria-label="Track finder quiz"
              style={{
                background: "#0d1119", border: "1px solid #1a2030",
                borderRadius: 16, padding: 32, marginBottom: 32,
                position: "relative", overflow: "hidden",
              }}
            >
              <Glow color="#00d4ff" top={-80} left={300} size={300} />
              <h3 style={{
                fontFamily: font, fontSize: 14, fontWeight: 600,
                color: "#00d4ff", letterSpacing: 2, marginBottom: 24,
                textTransform: "uppercase",
              }}>
                Track Finder
              </h3>
              {quizQuestions.map((qq, qi) => (
                <div key={qi} style={{ marginBottom: 24 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: "#eef1f6",
                    marginBottom: 12,
                  }}>
                    {qi + 1}. {qq.q}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {qq.options.map((opt, oi) => (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => setQuizAnswers((p) => ({ ...p, [qi]: opt.track }))}
                        aria-pressed={quizAnswers[qi] === opt.track}
                        style={{
                          fontFamily: font, fontSize: 12,
                          padding: "8px 16px", borderRadius: 6,
                          border: `1px solid ${quizAnswers[qi] === opt.track ? "#00ffa3" : "#1a2030"}`,
                          background: quizAnswers[qi] === opt.track ? "#00ffa315" : "transparent",
                          color: quizAnswers[qi] === opt.track ? "#00ffa3" : "#6b7685",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={computeQuiz}
                disabled={Object.keys(quizAnswers).length < 3}
                style={{
                  fontFamily: font, fontSize: 13, fontWeight: 600,
                  padding: "10px 24px", borderRadius: 8,
                  background: Object.keys(quizAnswers).length >= 3
                    ? "linear-gradient(135deg, #00ffa3, #00d4ff)"
                    : "#1a2030",
                  color: Object.keys(quizAnswers).length >= 3 ? "#0a0e14" : "#4a5568",
                  border: "none", cursor: Object.keys(quizAnswers).length >= 3 ? "pointer" : "default",
                  transition: "all 0.3s ease",
                }}
              >
                Get My Result
              </button>
              {quizResult && (() => {
                const selectedTrack = TRACKS.find((t) => t.id === quizResult);
                if (!selectedTrack) return null;
                return (
                  <div style={{
                    marginTop: 20, padding: 16, borderRadius: 8,
                    background: selectedTrack.color + "10",
                    border: `1px solid ${selectedTrack.color}30`,
                  }}>
                    <span style={{ fontSize: 22, marginRight: 8 }}>
                      {selectedTrack.icon}
                    </span>
                    <span style={{
                      fontFamily: font, fontWeight: 600, fontSize: 15,
                      color: selectedTrack.color,
                    }}>
                      You're a {selectedTrack.title}!
                    </span>
                    <div style={{ fontSize: 13, color: "#8891a0", marginTop: 6 }}>
                      Scroll down to explore your track details below.
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </Section>

        {/* ═══ TRACKS ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 28, fontWeight: 800,
              color: "#eef1f6", marginBottom: 8,
            }}>
              Pick a track
            </h2>
            <p style={{ fontSize: 14, color: "#6b7685", marginBottom: 24 }}>
              Click a track to explore what you'll be doing.
            </p>

            {/* Track selector */}
            <div role="group" aria-label="Contribution tracks" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={activeTrack === t.id}
                  onClick={() => setActiveTrack(activeTrack === t.id ? null : t.id)}
                  style={{
                    flex: 1, padding: "14px 16px",
                    background: activeTrack === t.id ? t.color + "12" : "#0d1119",
                    border: `1px solid ${activeTrack === t.id ? t.color + "60" : "#1a2030"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    fontFamily: font, fontSize: 10, color: t.color,
                    letterSpacing: 2, marginBottom: 4, opacity: 0.7,
                  }}>
                    TRACK {t.num}
                  </div>
                  <div style={{
                    fontWeight: 700, fontSize: 15,
                    color: activeTrack === t.id ? "#eef1f6" : "#6b7685",
                    transition: "color 0.3s ease",
                  }}>
                    {t.icon} {t.title}
                  </div>
                  <div style={{
                    fontFamily: font, fontSize: 11, color: "#4a5568", marginTop: 2,
                  }}>
                    {t.subtitle}
                  </div>
                </button>
              ))}
            </div>

            {/* Track detail panel */}
            {activeTrack && (() => {
              const t = TRACKS.find((tr) => tr.id === activeTrack);
              if (!t) return null;
              return (
                <div
                  role="region"
                  aria-label={`${t.title} track details`}
                  style={{
                    background: "#0d1119",
                    border: `1px solid ${t.color}30`,
                    borderRadius: 12, padding: 28,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <Glow color={t.color} top={-40} left={-40} size={200} />
                  <div style={{
                    fontSize: 15, color: "#c5cdd8", marginBottom: 20,
                    lineHeight: 1.6,
                  }}>
                    {t.desc}
                  </div>
                  <div style={{
                    fontFamily: font, fontSize: 11, letterSpacing: 2,
                    color: t.color, textTransform: "uppercase", marginBottom: 12,
                  }}>
                    What you'll do
                  </div>
                  {t.tasks.map((task, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, marginBottom: 10,
                      fontSize: 14, color: "#8891a0", lineHeight: 1.6,
                    }}>
                      <span style={{
                        fontFamily: font, color: t.color, fontSize: 12,
                        flexShrink: 0, marginTop: 2,
                      }}>
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      {task}
                    </div>
                  ))}
                  <div style={{
                    marginTop: 20, padding: "12px 16px",
                    background: t.color + "08",
                    borderRadius: 8, borderLeft: `3px solid ${t.color}40`,
                  }}>
                    <span style={{ fontFamily: font, fontSize: 11, color: t.color, letterSpacing: 1 }}>
                      GOOD FIT IF YOU LIKE:
                    </span>
                    <div style={{ fontSize: 13, color: "#8891a0", marginTop: 4, lineHeight: 1.5 }}>
                      {t.fit}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </Section>

        {/* ═══ CONTRIBUTION FAST PATH ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 28, fontWeight: 800,
              color: "#eef1f6", marginBottom: 8,
            }}>
              How contributions work
            </h2>
            <p style={{
              fontFamily: font, fontSize: 11, letterSpacing: 2,
              color: "#00ffa3", textTransform: "uppercase", marginBottom: 24,
            }}>
              Fast path — click each step
            </p>

            <div role="group" aria-label="Contribution steps" style={{ display: "flex", gap: 0, marginBottom: 16 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ flex: 1, position: "relative" }}>
                  <button
                    type="button"
                    aria-pressed={activeStep === i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      width: "100%", padding: "16px 12px",
                      background: activeStep === i ? "#111722" : "transparent",
                      border: "none",
                      borderBottom: `2px solid ${activeStep === i ? "#00ffa3" : "#1a2030"}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                    }}
                  >
                    <div style={{
                      fontFamily: font, fontSize: 22, fontWeight: 700,
                      color: activeStep === i ? "#00ffa3" : "#2a3444",
                      transition: "color 0.3s ease",
                      marginBottom: 4,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{
                      fontFamily: font, fontSize: 11,
                      color: activeStep === i ? "#c5cdd8" : "#4a5568",
                      transition: "color 0.3s ease",
                    }}>
                      {step.label}
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div
              role="region"
              aria-label={`Step ${activeStep + 1}: ${STEPS[activeStep].label}`}
              style={{
                background: "#0d1119", border: "1px solid #1a2030",
                borderRadius: 8, padding: "16px 20px",
                fontFamily: font, fontSize: 14, color: "#8891a0",
                lineHeight: 1.6,
                minHeight: 56, display: "flex", alignItems: "center",
              }}
            >
              <span style={{ color: "#00ffa3", marginRight: 10 }}>$</span>
              {STEPS[activeStep].detail}
              <span style={{ animation: "blink 1s step-end infinite", marginLeft: 2, color: "#00ffa3" }}>▌</span>
            </div>
          </div>
        </Section>

        {/* ═══ PRINCIPLES ═══ */}
        <Section delay={100}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 28, fontWeight: 800,
              color: "#eef1f6", marginBottom: 24,
            }}>
              Contribution standards
            </h2>
            <style>{`
              .omi-principle-row {
                background: #0d1119;
                border: 1px solid #1a2030;
                border-radius: 8px;
                transition: all 0.3s ease;
                outline: none;
              }
              .omi-principle-row:hover,
              .omi-principle-row:focus-visible {
                border-color: #00ffa340;
                background: #111722;
              }
            `}</style>
            <div style={{ display: "grid", gap: 8 }}>
              {PRINCIPLES.map((p, i) => (
                <div
                  key={i}
                  className="omi-principle-row"
                  tabIndex={0}
                  aria-label={`${p.left} over ${p.right}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 20px",
                  }}
                >
                  <span style={{
                    fontFamily: font, fontWeight: 700, fontSize: 15,
                    color: "#00ffa3", flex: 1,
                  }}>
                    {p.left}
                  </span>
                  <span style={{
                    fontFamily: font, fontSize: 18, color: "#00ffa3",
                    opacity: 0.5,
                  }}>
                    {p.symbol}
                  </span>
                  <span style={{
                    fontFamily: font, fontSize: 13, color: "#4a5568",
                    flex: 1, textAlign: "right",
                    textDecoration: "line-through",
                    textDecorationColor: "#4a556840",
                  }}>
                    {p.right}
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              fontFamily: font, fontSize: 12, color: "#4a5568",
              marginTop: 16, lineHeight: 1.6, padding: "0 4px",
            }}>
              If something feels ambiguous, open a Discussion or issue first —
              we'd rather clarify early than merge confusion.
            </div>
          </div>
        </Section>

        {/* ═══ LICENSE & CTA ═══ */}
        <Section delay={100}>
          <div style={{
            marginBottom: 40, padding: "20px 24px",
            background: "#0d1119", border: "1px solid #1a2030",
            borderRadius: 12,
          }}>
            <div style={{
              fontFamily: font, fontSize: 11, letterSpacing: 2,
              color: "#ff6b9d", textTransform: "uppercase", marginBottom: 10,
            }}>
              ⚠ Licensing & Safety
            </div>
            <div style={{ fontSize: 14, color: "#8891a0", lineHeight: 1.7 }}>
              Each repo may have its own <code style={{
                fontFamily: font, background: "#1a2030", padding: "2px 6px",
                borderRadius: 4, fontSize: 12, color: "#c5cdd8",
              }}>LICENSE</code>. If a repo has no license file, assume contributions shouldn't be
              reused externally until licensing is clarified — and open an issue to fix it.
            </div>
          </div>
        </Section>

        <Section delay={100}>
          <div style={{
            marginBottom: 100, textAlign: "center", padding: "48px 24px",
            background: "linear-gradient(135deg, #00ffa308, #00d4ff08)",
            border: "1px solid #1a2030",
            borderRadius: 16, position: "relative", overflow: "hidden",
          }}>
            <Glow color="#00ffa3" top={-60} left="30%" size={300} />
            <div style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 24, fontWeight: 800,
              color: "#eef1f6", marginBottom: 12,
            }}>
              Want to help but unsure where?
            </div>
            <p style={{
              fontSize: 14, color: "#8891a0", lineHeight: 1.7,
              maxWidth: 480, margin: "0 auto 20px",
            }}>
              Open a Discussion titled <strong style={{ color: "#c5cdd8" }}>
              "I want to contribute — help me pick a starter task"</strong>
            </p>
            <div style={{
              fontFamily: font, fontSize: 12, color: "#6b7685", lineHeight: 1.6,
            }}>
              Include: your skills, available time, and whether you can test on hardware.
            </div>
            <div style={{
              fontFamily: "'Anybody', sans-serif", fontSize: 20, fontWeight: 800,
              color: "#00ffa3", marginTop: 28,
              letterSpacing: 1,
            }}>
              Welcome aboard.
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
