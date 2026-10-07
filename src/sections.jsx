import React from 'react';

// sections.jsx — additional landing sections.
//
// In order down the page (after the FunFactsReel):
//   1) WhatWeDo     — 4-pillar quadrant grid (light bg)
//   2) AIPractice   — navy deep-dive on AI Readiness
//   3) Transform    — migration cards (light bg)
//   4) Values       — Courage / Integrity / Authenticity / Resilience
//   5) ReadyToTalk  — final CTA on navy
//   6) FooterFinal  — copyright + contact

// ─────────────────────────────────────────────────────────────
// Reveal-on-scroll helper
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.18) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    if (shown) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold, shown]);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = '', style = {}, as = 'div' }) {
  const [ref, shown] = useReveal();
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{
      transitionDelay: `${delay}ms`,
      ...style
    }}>{children}</Tag>);

}

// ─────────────────────────────────────────────────────────────
// Icon set — minimal, brand-aligned outlines
// ─────────────────────────────────────────────────────────────
const SVG = ({ size = 24, children, viewBox = '0 0 24 24' }) =>
<svg width={size} height={size} viewBox={viewBox} fill="none"
stroke="currentColor" strokeWidth="1.6"
strokeLinecap="round" strokeLinejoin="round"
aria-hidden="true">{children}</svg>;


// Pillar icons
const IconBrackets = (p) => <SVG {...p}><path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18" /></SVG>;
const IconBrain = (p) =>
<SVG {...p}>
    <path d="M9 5.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 4 3 3 0 0 0 4 1 3 3 0 0 0 3 1.5" />
    <path d="M15 5.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 4 3 3 0 0 1-4 1 3 3 0 0 1-3 1.5" />
    <path d="M12 4 V 20" />
  </SVG>;

const IconRefresh = (p) =>
<SVG {...p}>
    <path d="M21 12 a 9 9 0 0 1 -15.5 6.2" />
    <path d="M3 12 A 9 9 0 0 1 18.5 5.8" />
    <path d="M21 5 V 10 H 16" />
    <path d="M3 19 V 14 H 8" />
  </SVG>;

const IconLineChart = (p) =>
<SVG {...p}>
    <path d="M4 18 L4 5" />
    <path d="M4 18 L21 18" />
    <path d="M7 14 L11 10 L14 13 L20 6" />
    <circle cx="20" cy="6" r="1.2" fill="currentColor" stroke="none" />
  </SVG>;


// AI card icons
const IconRobot = (p) =>
<SVG {...p}>
    <rect x="4" y="7" width="16" height="12" rx="2.5" />
    <path d="M12 7 V 3" />
    <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M9 17 H 15" />
  </SVG>;

const IconCopilot = (p) =>
<SVG {...p}>
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 20 a 7 7 0 0 1 14 0" />
    <circle cx="18" cy="6" r="1.6" fill="currentColor" stroke="none" />
  </SVG>;

const IconBars = (p) =>
<SVG {...p}>
    <path d="M5 19 V 12" />
    <path d="M10 19 V 7" />
    <path d="M15 19 V 9" />
    <path d="M20 19 V 4" />
  </SVG>;


// Values icons (Courage, Integrity, Authenticity, Resilience)
const IconFlame = (p) =>
<SVG {...p}>
    <path d="M12 3 c 2 3.5 5 5 5 9 a 5 5 0 0 1 -10 0 c 0 -2 1 -3.5 2 -5 0 1.5 0.5 2 1.5 2.5 -0.5 -2 1 -4 1.5 -6.5z" />
  </SVG>;

const IconShieldCheck = (p) =>
<SVG {...p}>
    <path d="M12 3 L4 6 V 12 c 0 4.5 3.5 8 8 9 c 4.5 -1 8 -4.5 8 -9 V 6 z" />
    <path d="M9 12 L11 14 L15 10" />
  </SVG>;

const IconSparkle4 = (p) =>
<SVG {...p}>
    <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
  </SVG>;

const IconBolt = (p) =>
<SVG {...p}>
    <path d="M13 3 L5 14 H 11 L 9 21 L 18 9 H 12 z" />
  </SVG>;


// Down arrow used in scroll cue and tx-card
const IconArrowDown = (p) =>
<SVG {...p}><path d="M12 5 V 19 M6 13 L 12 19 L 18 13" /></SVG>;

const IconArrowRight = (p) =>
<SVG {...p}><path d="M5 12 H 19 M13 6 L 19 12 L 13 18" /></SVG>;


// ─────────────────────────────────────────────────────────────
// SECTION 1 — What we do (interactive 4-pillar explorer)
// ─────────────────────────────────────────────────────────────
const PILLARS = [
{
  n: '01',
  key: 'build',
  name: 'Build',
  icon: <IconBrackets size={28} />,
  headline: 'Ship things that hold.',
  body1: 'Enterprise-grade applications built at the speed your business actually needs, without the technical debt that turns your next release into a renovation project.',
  body2: 'Low-code where velocity matters. Traditional development where control is non-negotiable. We make our recommendation based on your constraints, not our comfort zone.',
  tags: ['Low-code', 'Traditional dev', 'Human-centered design']
},
{
  n: '02',
  key: 'intelligent',
  name: 'Intelligent',
  icon: <IconBrain size={28} />,
  headline: 'Make it think.',
  body1: 'AI that earns its place. Copilots that sit inside the tools your teams already open every day, agents that run real workflows E2E and the analytics and knowledge graphs underneath them.',
  body2: 'From autonomous agents to decision-support copilots, we identify the moments where AI shifts outcomes.',
  tags: ['AI Readiness', 'Copilots', 'AI Agents', 'AI Studio/ Knowledge Graph']
},
{
  n: '03',
  key: 'transform',
  name: 'Transform',
  icon: <IconRefresh size={28} />,
  headline: 'Move without breaking things.',
  body1: 'Legacy migrations are high-stakes operations. You will get access to real projects methodology, accelerators and the honesty to hear when the smartest migration is the one you should not do.',
  body2: 'OutSystems to Mendix. Microsoft 365 to Google Workspace. Low-code to traditional.',
  tags: ['OutSystems \u2192 Mendix', 'Microsoft 365 \u2192 Google Workspace', 'Low-code \u2192 Traditional']
},
{
  n: '04',
  key: 'advise',
  name: 'Advise',
  icon: <IconLineChart size={28} />,
  headline: 'Decisions that compound.',
  body1: 'We help you decide what\u2019s worth doing and what isn\u2019t, then we\u2019re still in the room when the building starts. The advice is something you can act on, because the people who wrote it can also deliver.',
  body2: 'Strategic counsel that connects technology choices to P&L outcomes.',
  tags: ['Digital strategy', 'Technology selection', 'Operating models', 'PMO']
}];


function WhatWeDo() {
  const [active, setActive] = React.useState(0);
  const [sectionRef, sectionShown] = useReveal(0.15);
  const p = PILLARS[active];

  // Keyboard navigation when the section is in view
  React.useEffect(() => {
    if (!sectionShown) return;
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActive((a) => (a + 1) % PILLARS.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActive((a) => (a - 1 + PILLARS.length) % PILLARS.length);
      }
    };
    // Only attach when explorer has focus-within — guard with focus state via ref
    const el = sectionRef.current;
    if (!el) return;
    let focused = false;
    const onFocusIn = () => {focused = true;};
    const onFocusOut = () => {focused = false;};
    const guardedKey = (e) => {if (focused) onKey(e);};
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    window.addEventListener('keydown', guardedKey);
    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('keydown', guardedKey);
    };
  }, [sectionShown, sectionRef]);

  // Allow other sections (e.g. the hero cards) to select a pillar by index
  React.useEffect(() => {
    const onSelect = (e) => {
      const i = e.detail;
      if (typeof i === 'number' && i >= 0 && i < PILLARS.length) setActive(i);
    };
    window.addEventListener('aliow:select-pillar', onSelect);
    return () => window.removeEventListener('aliow:select-pillar', onSelect);
  }, []);

  return (
    <section
      id="what"
      ref={sectionRef}
      className={`what-section section-lift ${sectionShown ? 'is-in' : ''}`}
      data-screen-label="02 What we do">

      <a className="scroll-cue seam-cue" href="#facts" aria-label="Scroll to ways of working">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 4 V15 M5.5 11 L10 15.5 L14.5 11"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <div className="what-eyebrow">
        What we do
      </div>
      <h2 className="what-title">
        Four capabilities.<br />
        One <em>team</em> behind all of them.
      </h2>
      <p className="what-sub">Most engagements fail not from lack of talent but from misaligned capability between the people who set the strategy and the people who build it. Between the slide deck and the systems that are supposed to run 24/7.
We keep all four disciplines under one roof so nothing falls into those gaps.


      </p>

      <div className="pillars-explorer" role="tablist" aria-orientation="vertical">
        {/* Left rail — pillar selector */}
        <div className="pillar-rail">
          {PILLARS.map((pl, i) =>
          <button
            key={pl.key}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="pillar-stage"
            tabIndex={i === active ? 0 : -1}
            className={`pillar-tab ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}>

              <span className="pillar-tab-n">{pl.n}</span>
              <span className="pillar-tab-icon">{pl.icon}</span>
              <span className="pillar-tab-name">{pl.name}</span>
              <span className="pillar-tab-bar" aria-hidden="true"></span>
            </button>
          )}
        </div>

        {/* Right stage — active pillar's content */}
        <div id="pillar-stage" className="pillar-stage" role="tabpanel" aria-live="polite">
          <div className="pillar-stage-bgnum" aria-hidden="true" key={`bg-${p.key}`}>
            {p.n}
          </div>
          <div className="pillar-panel" key={p.key}>
            <div className="pillar-panel-eyebrow">
              <span>{p.n}</span>
              <span className="sep" aria-hidden="true"></span>
              <span>{p.name}</span>
            </div>
            <h3 className="pillar-panel-headline">{p.headline}</h3>
            <p className="pillar-panel-body">{p.body1}</p>
            <p className="pillar-panel-body muted">{p.body2}</p>
            <div className="tag-row">
              {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            <a className="pillar-link" href="#contact">
              Learn more
              <IconArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Trusted-by client band — wordmark placeholders until real logos drop in */}
      <div className="trusted-band" aria-label="Trusted by">
        <div className="trusted-label">Trusted by</div>
        <div className="trusted-marquee" role="list">
          <div className="trusted-track">
            {[
            'CIMPOR', 'Engie', 'KEMIRA', 'LIDL',
            'Rabobank', 'Schwarz Group', 'Taiwan Cement', 'Teixeira Duarte', 'Vodafone'].
            concat([
            'CIMPOR', 'Engie', 'KEMIRA', 'LIDL',
            'Rabobank', 'Schwarz Group', 'Taiwan Cement', 'Teixeira Duarte', 'Vodafone']
            ).map((name, i) =>
            <span key={i} className="trusted-mark" role="listitem">{name}</span>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// SECTION — The Aliow thesis (standalone pull-quote)
// ─────────────────────────────────────────────────────────────
function AliowThesis() {
  return (
    <section id="thesis" className="thesis-section section-lift" data-screen-label="04 The Aliow thesis">
      <Reveal as="div" className="aliow-thesis">
        <h2 className="thesis-label">
          <span className="thesis-dot" aria-hidden="true"></span>
          The Aliow thesis
        </h2>
        <p className="thesis-body">
          The gap between good strategy and good outcomes is almost always{' '}
          <em>execution</em>. We close it by holding strategy, technology,
          intelligence, and change management in the same pair of hands, from diagnosis
          to delivery.
        </p>
      </Reveal>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — AI Practice
// ─────────────────────────────────────────────────────────────
const AI_CARDS = [
{
  icon: <IconCopilot size={26} />,
  kicker: 'Builds confidence',
  title: 'Copilots',
  desc: 'Embedded intelligence that makes your teams faster and builds confidence with the tools they already use.'
},
{
  icon: <IconRobot size={26} />,
  kicker: 'Delivers transformation',
  title: 'AI Agents',
  desc: 'Autonomous processes that actually act, decide, and execute. Delivering transformation from internal processes to customer workflows.'
},
{
  icon: <IconBars size={26} />,
  kicker: 'Makes it intelligent',
  title: 'AI Studio & Knowledge Graph',
  desc: 'Advanced analytics, predictive modelling and connected knowledge in order to make autonomous intelligent decisions.'
}];


function AIPractice() {
  return (
    <section id="ai" className="ai-section section-lift" data-screen-label="05 AI Practice">
      <div className="ai-grid">
        <div>
          <Reveal as="div" className="ai-eyebrow">AI Practice</Reveal>
          <Reveal as="h2" delay={60} className="ai-title">
            Not sure where AI fits in your business?<br />
            <em>Start here.</em>
          </Reveal>
          <Reveal as="p" delay={120} className="ai-sub">
            Our AI Readiness Assessment gives you a clear, honest map of where
            AI creates value in your specific context and just as useful, where
            it does not.<br />No hype, no vendor agenda.
          </Reveal>
          <Reveal as="div" delay={180}>
            <a className="ai-cta" href="#contact">
              Book the AI readiness assessment
              <IconArrowRight size={14} />
            </a>
          </Reveal>
        </div>
        <div className="ai-cards">
          {AI_CARDS.map((c, i) =>
          <Reveal as="div" key={c.title} delay={i * 120} className="ai-card">
              <div className="ai-card-icon">{c.icon}</div>
              <div>
                <div className="ai-card-kicker">{c.kicker}</div>
                <h3 className="ai-card-title">{c.title}</h3>
                <p className="ai-card-desc">{c.desc}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — Transform / Migration
// ─────────────────────────────────────────────────────────────
const TX_ROUTES = [
{
  from: 'OutSystems',
  to: 'Mendix',
  text: 'Preserve your investment, gain flexibility and lower licensing costs.'
},
{
  from: 'Low-code',
  to: 'Traditional dev',
  text: 'When you need full ownership on every layer of the stack.'
},
{
  from: 'Microsoft 365',
  to: 'Google Workspace',
  text: 'Strategic migration with zero-surprise delivery.'
}];

const TX_STEPS = [
{ title: 'Assess', text: 'Apps, data, integrations and dependencies, mapped.' },
{ title: 'Blueprint', text: 'Target architecture, migration waves and business case.' },
{ title: 'Migrate', text: 'AI-accelerated conversion, data migration and testing, wave by wave.' },
{ title: 'Run & Evolve', text: 'Go-live, hypercare and continuous evolution.' }];

const TX_PROOFS = [
{
  id: 'scale',
  ring: 'PROVEN AT SCALE · PROVEN AT SCALE · ',
  title: 'Proven at scale.',
  text: 'Some of the largest migrations in the world, delivered without stopping the business.',
  icon: <path d="M4 18 V6 M4 18 H20 M7 14 L11 10 L14 13 L19 7" />
},
{
  id: 'any',
  ring: 'ANY ORIGIN · ANY DESTINATION · ',
  title: 'Any origin. Any destination.',
  text: 'Open code you fully own, or a platform. We recommend what fits each application.',
  icon: <path d="M12 20 V12 M12 12 L6 5 M12 12 L18 5" />
},
{
  id: 'ai',
  ring: 'AI-ACCELERATED · AI-ACCELERATED · ',
  title: 'Our accelerators, AI-powered.',
  text: 'Proprietary tooling converts code, data and tests faster, with fewer surprises.',
  icon: <path d="M13 3 L5 14 H11 L10 21 L19 9 H13 Z" />
},
{
  id: 'future',
  ring: 'FUTURE-PROOF · FUTURE-PROOF · ',
  title: 'Built for what’s next.',
  text: 'We track the market and adopt the best tools and practices, so what we build scales and stays compatible as technology evolves.',
  icon: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" />
}];

function ProofBadge({ id, ring, icon }) {
  const path = `tx-ring-${id}`;
  return (
    <svg className="tx-badge" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id={path} d="M50 50 m-39 0 a39 39 0 1 1 78 0 a39 39 0 1 1 -78 0" />
      </defs>
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--aliow-green)" strokeWidth="1" />
      <text className="tx-badge-ring" fill="var(--aliow-green)">
        <textPath href={`#${path}`} startOffset="0" textLength="242" lengthAdjust="spacing">{ring}</textPath>
      </text>
      <circle cx="50" cy="50" r="24" fill="var(--aliow-green)" />
      <g transform="translate(38 38)" fill="none" stroke="var(--aliow-navy)"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</g>
    </svg>);

}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8 H13 M9 4 L13 8 L9 12" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

function Transform() {
  return (
    <section id="replatforming" className="transform-section section-lift" data-screen-label="06 Migrations">
      <div className="tx-top">
        <div className="tx-intro">
          <Reveal as="div" className="tx-eyebrow">Replatforming &amp; Migrations</Reveal>
          <Reveal as="h2" delay={60} className="tx-title">
            We’ve done it before.<br />
            <em>We’ll do it right.</em>
          </Reveal>
          <Reveal as="p" delay={80} className="tx-sub">
            Migrations carry real risk, and we won’t pretend otherwise. We’ve run
            some of the largest in the world, with a proven method, our own
            accelerators and honest counsel.
          </Reveal>
          <Reveal as="dl" delay={120} className="tx-meta">
            <div><dt>Origins</dt><dd>Low-code, legacy, suites</dd></div>
            <div><dt>Destinations</dt><dd>Open code or platform</dd></div>
          </Reveal>
        </div>

        <Reveal as="div" delay={100} className="tx-exit">
          <span className="tx-exit-tag"><i />OutSystems exit</span>
          <div className="tx-exit-stat"><span>2</span>/4</div>
          <p className="tx-exit-title">
            of the world’s largest OutSystems exits.<br />
            <em>Delivered by aliow.</em>
          </p>
          <p className="tx-exit-text">
            We migrate OutSystems applications to open, standard stacks (.NET,
            Java, React…) with AI-accelerated tooling, or to other platforms such as Mendix.
          </p>
          <a href="#contact" className="tx-btn tx-btn-green">
            Book your OutSystems Exit Assessment <Arrow />
          </a>
          <p className="tx-exit-note">Cost, risk and timeline for your estate, in 2 weeks.</p>
        </Reveal>
      </div>

      <div className="tx-routes">
        <div className="tx-routes-head">
          <div>
            <Reveal as="div" className="tx-eyebrow tx-eyebrow-sm">Migration routes</Reveal>
            <Reveal as="h3" delay={40} className="tx-h3">Routes we know <em>by heart.</em></Reveal>
          </div>
          <Reveal as="p" delay={80} className="tx-routes-note">
            Every route has its own traps. We’ve mapped them, built accelerators
            for them and walked them at scale.
          </Reveal>
        </div>
        <ul className="tx-route-list">
          {TX_ROUTES.map((r, i) =>
          <Reveal as="li" key={r.from} delay={i * 90} className="tx-route">
              <span className="tx-route-n">R/0{i + 1}</span>
              <span className="tx-route-from">{r.from}</span>
              <span className="tx-route-line" aria-hidden="true" />
              <span className="tx-route-to">{r.to}</span>
              <span className="tx-route-text">{r.text}</span>
            </Reveal>
          )}
        </ul>
      </div>

      <Reveal as="div" className="tx-how">
        <div className="tx-how-head">
          <div>
            <div className="tx-eyebrow tx-eyebrow-sm tx-on-dark">How we do it</div>
            <h3 className="tx-h3">Four steps. <em>Zero surprises.</em></h3>
            <p className="tx-routes-note tx-how-note">
              No big bang. Your business keeps running while we move it, wave by wave.
            </p>
          </div>
        </div>

        <ol className="tx-steps">
          {TX_STEPS.map((st, i) =>
          <li key={st.title} className="tx-step">
              <span className="tx-step-n">0{i + 1}</span>
              <h4>{st.title}</h4>
              <p>{st.text}</p>
            </li>
          )}
        </ol>

        <div className="tx-hold">
          <div className="tx-eyebrow tx-eyebrow-sm tx-on-dark">What you can hold us to</div>
          <div className="tx-proofs">
            {TX_PROOFS.map((p) =>
            <div key={p.id} className="tx-proof">
                <ProofBadge id={p.id} ring={p.ring} icon={p.icon} />
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tx-cta">
          <p>Not sure you should move at all? <em>That’s the first thing we’ll tell you.</em></p>
          <a href="#contact" className="tx-btn tx-btn-ghost">Talk to a migration lead <Arrow /></a>
        </div>
      </Reveal>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — Values  (sits within transform-section's flow)
// ─────────────────────────────────────────────────────────────
const VALUES = [
{ name: 'Courage', icon: <IconFlame size={32} /> },
{ name: 'Integrity', icon: <IconShieldCheck size={32} /> },
{ name: 'Authenticity', icon: <IconSparkle4 size={32} /> },
{ name: 'Resilience', icon: <IconBolt size={32} /> }];


function Values() {
  return (
    <section id="values" className="values-section" data-screen-label="07 Values">
      <h2 className="values-eyebrow">Our values</h2>
      <div className="values-grid">
        {VALUES.map((v, i) =>
        <Reveal as="div" key={v.name} delay={i * 90} className="value">
            <div className="value-icon">{v.icon}</div>
            <div className="value-name">{v.name}</div>
          </Reveal>
        )}
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — Ready to talk?
// ─────────────────────────────────────────────────────────────
function ReadyToTalk() {
  return (
    <section id="contact" className="cta-section section-lift" data-screen-label="08 Ready to talk">
      <Reveal as="h2" className="cta-title">
        <span>Ready to talk</span><span className="accent">?</span>
      </Reveal>
      <Reveal as="p" delay={80} className="cta-sub">
        Whether you have a defined project or just a problem that keeps
        bothering you, let’s work together on it!
      </Reveal>
      <Reveal as="div" delay={160} className="cta-buttons">
        <a className="btn-primary" href="mailto:info@aliow.it">Let's talk about your project</a>
      </Reveal>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// Final footer (replaces the small one used during build)
// ─────────────────────────────────────────────────────────────
function FooterFinal() {
  return (
    <footer className="footer-strip">
      <div>© 2026 aliow</div>
      <div className="contact-line">
        <a href="mailto:info@aliow.it">info@aliow.it</a>
        <span>·</span>
        <a href="tel:+351216073796">+351 216 073 796</a>
      </div>
    </footer>);

}

export { WhatWeDo, AliowThesis, AIPractice, Transform, Values, ReadyToTalk, FooterFinal };