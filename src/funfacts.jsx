import React from 'react';
import { Easing, clamp, Sprite, TimelineContext } from './animations.jsx';

// fun-facts.jsx — sprite-based fun-fact reel for the Aliow landing page.
//
// Uses the Sprite/TimelineContext/Easing primitives from animations.jsx
// but provides its OWN inline stage (no playback chrome) so the reel
// drops into a page section seamlessly. Mix of:
//   • abstract rounded-square choreography (chips, bars, grids)
//   • text-driven moments (count-ups, big phrases, eyebrow tags)
// Total duration: 5 scenes × 5s = 25s, looped.

// ─────────────────────────────────────────────────────────────────────────
// Inline stage — provides TimelineContext + auto-scale, no playback bar.
// ─────────────────────────────────────────────────────────────────────────
function ReelStage({ width = 1280, height = 540, duration = 25, playing = true, loop = true, onTick, seekRef, children }) {
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [narrow, setNarrow] = React.useState(false);
  const [time, setTime] = React.useState(0);

  // Auto-scale to fit container. On narrow viewports (< 700px) crop to the
  // left half of the canvas (where all text lives) at a larger scale so
  // headlines remain readable on mobile.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const isNarrow = r.width < 700;
      const s = isNarrow
        ? r.width / (width * 0.5625)
        : Math.min(r.width / width, r.height / height);
      setScale(s);
      setNarrow(isNarrow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  // Animation loop
  const tRef = React.useRef(0);
  React.useEffect(() => {
    if (!playing) return;
    let raf,last = null;
    const step = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      let next = tRef.current + dt;
      if (loop) {
        next = next % duration;
      } else if (next >= duration) {
        // Settle on the final frame and stop.
        tRef.current = duration;
        setTime(duration);
        if (onTick) onTick(duration);
        return;
      }
      tRef.current = next;
      setTime(next);
      if (onTick) onTick(next);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, onTick, loop]);

  // Expose an imperative seek (used by the Replay control)
  React.useEffect(() => {
    if (!seekRef) return;
    seekRef.current = (v) => {
      tRef.current = v;
      setTime(v);
      if (onTick) onTick(v);
    };
  }, [seekRef, onTick]);

  const ctx = React.useMemo(
    () => ({ time, duration, playing, setTime, setPlaying: () => {}, narrow }),
    [time, duration, playing, narrow]
  );

  return (
    <div ref={wrapRef} className="facts-stage-canvas">
      <div style={narrow ? {
        position: 'absolute',
        left: 0, top: 0,
        width, height,
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
      } : {
        position: 'absolute',
        left: '50%', top: '50%',
        width, height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center',
      }}>
        <TimelineContext.Provider value={ctx}>
          {children}
        </TimelineContext.Provider>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────
// Small helpers — colors, fonts, easings reused across scenes
// ─────────────────────────────────────────────────────────────────────────
const NAVY = '#021D33';
const GREEN = '#BFFE4C';
const WHITE = '#FFFFFF';
const DIM = 'rgba(255,255,255,0.55)';
const FAINT = 'rgba(255,255,255,0.12)';
const TINT = 'rgba(255,255,255,0.06)';
const DISP = '"PP Neue Montreal","Helvetica Neue",system-ui,sans-serif';
const UI = '"Inter",system-ui,sans-serif';

// "Pop in / pop out" envelope for a sprite child element. Returns
// { opacity, scale, ty } given local time, in/out durations, ease.
function envelope({ localTime, duration, inDur = 0.5, outDur = 0.5, inEase = Easing.easeOutBack, outEase = Easing.easeInQuad }) {
  let opacity = 1,scale = 1,ty = 0;
  const outStart = Math.max(0, duration - outDur);
  if (localTime < inDur) {
    const t = inEase(clamp(localTime / inDur, 0, 1));
    opacity = clamp(localTime / inDur, 0, 1);
    scale = 0.6 + 0.4 * t;
    ty = (1 - t) * 12;
  } else if (localTime > outStart) {
    const t = outEase(clamp((localTime - outStart) / outDur, 0, 1));
    opacity = 1 - t;
    scale = 1 + 0.05 * t;
    ty = -t * 8;
  }
  return { opacity, scale, ty };
}

// Abstract rounded-square chip with optional text label.
function Chip({ x, y, w, h, radius = 14, color = GREEN, textColor = NAVY, label, font = DISP, weight = 500, size = 16, style = {} }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: color,
      borderRadius: radius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: textColor,
      fontFamily: font, fontWeight: weight, fontSize: size,
      letterSpacing: '-0.005em',
      ...style
    }}>
      {label}
    </div>);

}

// ─────────────────────────────────────────────────────────────────────────
// SCENE 1 (0–5s)  ·  "Did you know?"  ·  language chips converging
// ─────────────────────────────────────────────────────────────────────────
function Scene1() {
  return (
    <Sprite start={0} end={5}>
      {({ localTime }) => {
        // Eyebrow
        const eyeProg = clamp(localTime / 0.6, 0, 1);
        const eyeOut = clamp((localTime - 4.4) / 0.6, 0, 1);
        const eyeOp = Easing.easeOutCubic(eyeProg) * (1 - Easing.easeInQuad(eyeOut));

        // Headline appears at 0.4s
        const hStart = 0.4,hInDur = 0.6;
        const hP = clamp((localTime - hStart) / hInDur, 0, 1);
        const hOut = clamp((localTime - 4.4) / 0.6, 0, 1);
        const hOp = Easing.easeOutCubic(hP) * (1 - Easing.easeInQuad(hOut));
        const hY = (1 - Easing.easeOutCubic(hP)) * 16;

        // Chips animate in two waves: AI platforms first (green, primary),
        // traditional languages second (tinted, secondary).
        const langs = ['Mendix', 'AI Studio', 'Python', 'TypeScript', 'Java', 'Knowledge Graph', 'and more!'];
        // Final cluster positions — AI-first, languages-second visual hierarchy.
        const positions = [
        { x: 760, y: 100, w: 168, h: 64, r: 18, c: GREEN, t: NAVY }, // Mendix — accent
        { x: 945, y: 110, w: 200, h: 64, r: 18, c: GREEN, t: NAVY }, // AI Studio — accent
        { x: 800, y: 198, w: 200, h: 64, r: 18, c: GREEN, t: NAVY }, // Python — accent
        { x: 1020, y: 198, w: 130, h: 56, r: 16, c: TINT, t: WHITE }, // TypeScript
        { x: 770, y: 290, w: 130, h: 56, r: 16, c: TINT, t: WHITE }, // Java
        { x: 920, y: 290, w: 200, h: 56, r: 16, c: TINT, t: WHITE }, // Knowledge Graph
        { x: 830, y: 380, w: 170, h: 56, r: 16, c: TINT, t: WHITE }]; // and more!


        return (
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* Eyebrow */}
            <div style={{
              position: 'absolute', left: 80, top: 92,
              opacity: eyeOp,
              fontFamily: DISP, fontWeight: 500, fontSize: 16, letterSpacing: '0.18em',
              color: GREEN, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ width: 36, height: 1, background: GREEN }} />
              Did you know
            </div>

            {/* Headline */}
            <div style={{
              position: 'absolute', left: 80, top: 150,
              opacity: hOp, transform: `translateY(${hY}px)`,
              fontFamily: DISP, fontWeight: 500, fontSize: 88, lineHeight: 0.96,
              letterSpacing: '-0.025em', color: WHITE, maxWidth: 640
            }}>
              Your stack.<br />
              <span style={{ color: GREEN }}>Smarter.</span> Intelligence.
            </div>

            {/* Subline */}
            <div style={{
              position: 'absolute', left: 80, top: 410,
              opacity: hOp,
              fontFamily: DISP, fontWeight: 500, fontSize: 20, lineHeight: '28px',
              color: DIM, maxWidth: 520
            }}>
              We meet your technology where it already lives and bring intelligence to it. No rip-and-replace, just make what you already run work smarter.
            </div>

            {/* Language chips fly in with stagger from the right edge */}
            {positions.map((p, i) => {
              const dStart = 0.35 + i * 0.085;
              const dDur = 0.55;
              const dP = clamp((localTime - dStart) / dDur, 0, 1);
              const dE = Easing.easeOutBack(dP);
              const dOut = clamp((localTime - 4.4) / 0.6, 0, 1);

              const fromX = 1320;
              const x = p.x + (1 - dE) * (fromX - p.x);
              const op = clamp(dP * 1.4, 0, 1) * (1 - Easing.easeInQuad(dOut));
              const scale = 0.85 + 0.15 * dE;

              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: x, top: p.y,
                  width: p.w, height: p.h,
                  borderRadius: p.r,
                  background: p.c,
                  border: p.c === TINT ? `1px solid ${FAINT}` : 'none',
                  opacity: op,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: DISP, fontWeight: 500,
                  fontSize: p.c === GREEN ? 22 : 19,
                  color: p.t,
                  letterSpacing: '-0.005em'
                }}>
                  {langs[i]}
                </div>);

            })}
          </div>);

      }}
    </Sprite>);

}

// ─────────────────────────────────────────────────────────────────────────
// SCENE 2 (5–10s)  ·  parallel timelines — "traditional" vs "aliow"
// ─────────────────────────────────────────────────────────────────────────
function Scene2() {
  return (
    <Sprite start={5} end={10}>
      {({ localTime }) => {
        const inP = clamp(localTime / 0.6, 0, 1);
        const outP = clamp((localTime - 4.4) / 0.6, 0, 1);
        const wrapOp = Easing.easeOutCubic(inP) * (1 - Easing.easeInQuad(outP));

        // Traditional: 4 segments separated by handoff gaps. Slow, never reaches finish.
        const tradStart = 0.6;
        const tradP = clamp((localTime - tradStart) / 3.8, 0, 1);
        const segments = [
        { from: 0.00, to: 0.18 },
        { from: 0.28, to: 0.46 },
        { from: 0.56, to: 0.74 },
        { from: 0.84, to: 0.96 }];


        // aliow: continuous, hits 100% by 2.8s, then live-pulse.
        const aliowStart = 0.6;
        const aliowFinish = 2.8;
        const aliowP = clamp((localTime - aliowStart) / (aliowFinish - aliowStart), 0, 1);
        const aliowFill = Easing.easeOutCubic(aliowP);
        const aliowDone = aliowP >= 1;
        const pulseT = aliowDone ? localTime - aliowFinish : 0;
        const pulseGlow = aliowDone ? 0.5 + 0.5 * Math.sin(pulseT * 2.4) : 0;

        const TX = 700,TW = 500,TH = 14;
        const milestones = ['Brief', 'Prototype', 'Pilot', 'Production'];

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: wrapOp }}>
            <div style={{
              position: 'absolute', left: 80, top: 92,
              fontFamily: DISP, fontWeight: 500, fontSize: 16, letterSpacing: '0.18em',
              color: GREEN, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ width: 36, height: 1, background: GREEN }} />
              Speed-up
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 150,
              fontFamily: DISP, fontWeight: 500, fontSize: 88, lineHeight: 0.96,
              letterSpacing: '-0.025em', color: WHITE
            }}>
              Ideas reach<br />
              production while<br />
              competitors <span style={{ color: GREEN }}>plan.</span>
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 430,
              fontFamily: DISP, fontWeight: 500, fontSize: 20, lineHeight: '28px',
              color: DIM, maxWidth: 520
            }}>
              Discovery, build and ship by one team & one cadence.<br />
              No handoffs. No waiting.
            </div>

            {/* Traditional track header */}
            <div style={{
              position: 'absolute', left: TX, top: 138,
              fontFamily: UI, fontSize: 11, color: DIM,
              letterSpacing: '0.12em', textTransform: 'uppercase'
            }}>
              Traditional · handoffs
            </div>
            <div style={{
              position: 'absolute', left: TX, top: 168,
              width: TW, height: TH, borderRadius: TH / 2,
              background: TINT, border: `1px solid ${FAINT}`
            }} />
            {segments.map((s, i) => {
              const segP = clamp((tradP - s.from) / (s.to - s.from), 0, 1);
              const left = s.from * TW;
              const w = (s.to - s.from) * TW * Easing.easeOutCubic(segP);
              return (
                <div key={`t${i}`} style={{
                  position: 'absolute', left: TX + left, top: 168,
                  width: w, height: TH, borderRadius: TH / 2,
                  background: 'rgba(255,255,255,0.55)'
                }} />);

            })}
            <div style={{
              position: 'absolute', left: TX, top: 198,
              fontFamily: UI, fontSize: 11, color: DIM, opacity: 0.7,
              letterSpacing: '0.04em'
            }}>
              still building…
            </div>

            {/* Milestone labels (between tracks) */}
            {milestones.map((m, i) => {
              const x = (i + 0.5) * (TW / 4);
              const milestoneT = (i + 1) * 0.55;
              const reached = localTime - aliowStart > milestoneT;
              return (
                <div key={`m${i}`} style={{
                  position: 'absolute',
                  left: TX + x - 60, top: 250,
                  width: 120, textAlign: 'center',
                  fontFamily: UI, fontSize: 10,
                  color: reached ? GREEN : DIM,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  transition: 'color 180ms'
                }}>
                  {m}
                </div>);

            })}

            {/* aliow track */}
            <div style={{
              position: 'absolute', left: TX, top: 290,
              fontFamily: UI, fontSize: 11, color: GREEN,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3, background: GREEN,
                boxShadow: '0 0 8px rgba(191,254,76,0.7)'
              }} />
              aliow · one cadence
            </div>
            <div style={{
              position: 'absolute', left: TX, top: 320,
              width: TW, height: TH, borderRadius: TH / 2,
              background: TINT, border: `1px solid ${FAINT}`
            }} />
            <div style={{
              position: 'absolute', left: TX, top: 320,
              width: aliowFill * TW, height: TH, borderRadius: TH / 2,
              background: GREEN,
              boxShadow: aliowDone ?
              `0 0 ${14 + pulseGlow * 18}px rgba(191,254,76,${0.35 + pulseGlow * 0.4})` :
              '0 0 10px rgba(191,254,76,0.3)'
            }} />
            <div style={{
              position: 'absolute', left: TX, top: 350,
              fontFamily: UI, fontSize: 11,
              color: aliowDone ? GREEN : DIM,
              letterSpacing: '0.04em',
              transition: 'color 200ms'
            }}>
              {aliowDone ? 'live in production' : 'shipping…'}
            </div>

            {/* Finish line marker */}
            <div style={{
              position: 'absolute', left: TX + TW + 6, top: 162,
              width: 2, height: 172,
              background: GREEN, opacity: 0.35
            }} />
            <div style={{
              position: 'absolute', left: TX + TW + 14, top: 240,
              fontFamily: UI, fontSize: 10, color: GREEN,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              writingMode: 'vertical-rl'
            }}>
              Finish
            </div>
          </div>);

      }}
    </Sprite>);

}

// ─────────────────────────────────────────────────────────────────────────
// SCENE 3 (10–15s)  ·  "From idea to launch in 60 days" — arrive at strength
// ─────────────────────────────────────────────────────────────────────────
function Scene3() {
  return (
    <Sprite start={10} end={15}>
      {({ localTime }) => {
        const inP = clamp(localTime / 0.6, 0, 1);
        const outP = clamp((localTime - 4.4) / 0.6, 0, 1);
        const wrapOp = Easing.easeOutCubic(inP) * (1 - Easing.easeInQuad(outP));

        // Count from 180 → 60 days (large delta — dramatic arrival)
        const cP = clamp((localTime - 0.4) / 2.4, 0, 1);
        const days = Math.round(180 - 120 * Easing.easeOutCubic(cP));

        const segCount = 12;
        const preFilledN = 9; // 75% arrives pre-filled
        const preFillEnter = (i) => clamp((localTime - 0.3 - i * 0.025) / 0.3, 0, 1);

        // Last 3 cells tick in live
        const tickTimes = [2.1, 3.0, 3.85];
        const tickP = (i) => clamp((localTime - tickTimes[i]) / 0.4, 0, 1);
        const ticksDone = tickTimes.filter((t) => localTime > t + 0.4).length;
        const filledN = preFilledN + ticksDone;
        const overallPct = filledN / segCount;
        const allDone = filledN === segCount;
        const completePulse = allDone ? clamp((localTime - 4.25) / 0.35, 0, 1) : 0;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: wrapOp }}>
            <div style={{
              position: 'absolute', left: 80, top: 92,
              fontFamily: DISP, fontWeight: 500, fontSize: 16, letterSpacing: '0.18em',
              color: GREEN, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ width: 36, height: 1, background: GREEN }} />
              Time to value
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 150,
              fontFamily: DISP, fontWeight: 500, fontSize: 88, lineHeight: 0.96,
              letterSpacing: '-0.025em', color: WHITE,
              transform: `scale(${1 + completePulse * 0.018})`,
              transformOrigin: 'left center',
              transition: 'transform 200ms'
            }}>
              From idea<br />
              to launch in<br />
              <span style={{ color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{days}</span> days.
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 430,
              fontFamily: DISP, fontWeight: 500, fontSize: 20, lineHeight: '28px',
              color: DIM, maxWidth: 520
            }}>
              One team, shipping what we promised at the end of every sprint.
              <div style={{
                marginTop: 14, color: GREEN, fontSize: 15,
                letterSpacing: '0.06em', textTransform: 'uppercase'
              }}>
                Backed by 50+ successful deliveries.
              </div>
            </div>

            {/* Right side — progress squares */}
            <div style={{ position: 'absolute', left: 740, top: 180, width: 420 }}>
              <div style={{
                fontFamily: UI, fontSize: 12, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: DIM, marginBottom: 16
              }}>
                Sprint progress
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 90px)',
                gap: 12
              }}>
                {Array.from({ length: segCount }).map((_, i) => {
                  let isOn, scale, opacity, glow;
                  if (i < preFilledN) {
                    const p = preFillEnter(i);
                    isOn = p > 0.4;
                    scale = 0.85 + 0.15 * Easing.easeOutCubic(p);
                    opacity = p;
                    glow = 0;
                  } else {
                    const tIdx = i - preFilledN;
                    const p = tickP(tIdx);
                    isOn = p > 0.5;
                    scale = 0.55 + 0.45 * Easing.easeOutBack(p);
                    opacity = isOn ? 1 : 0.55 + 0.45 * p;
                    glow = isOn ? Math.max(0, 1 - (localTime - tickTimes[tIdx] - 0.4) / 0.7) : 0;
                  }
                  return (
                    <div key={i} style={{
                      width: 90, height: 56,
                      borderRadius: 14,
                      background: isOn ? GREEN : TINT,
                      border: isOn ? 'none' : `1px solid ${FAINT}`,
                      opacity,
                      transform: `scale(${scale})`,
                      transformOrigin: 'center',
                      boxShadow: glow > 0 ? `0 0 ${18 * glow}px rgba(191,254,76,${0.45 * glow})` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: UI, fontSize: 11, color: isOn ? NAVY : DIM,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      fontWeight: 600,
                      transition: 'background 120ms, border 120ms, color 120ms'
                    }}>
                      wk {i + 1}
                    </div>);

                })}
              </div>

              <div style={{
                marginTop: 32,
                height: 6, borderRadius: 3, background: FAINT, overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(overallPct * 100)}%`,
                  background: GREEN,
                  borderRadius: 3,
                  transition: 'width 200ms ease-out'
                }} />
              </div>
              <div style={{
                marginTop: 8, fontFamily: UI, fontSize: 12,
                color: allDone ? GREEN : DIM,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em',
                transition: 'color 200ms'
              }}>
                {Math.round(overallPct * 100)}% delivered{allDone ? ' · live' : ''}
              </div>
            </div>
          </div>);

      }}
    </Sprite>);

}

// ─────────────────────────────────────────────────────────────────────────
// SCENE 4 (15–20s)  ·  Task-label cells flip from manual → automated
// ─────────────────────────────────────────────────────────────────────────
const SCENE4_TASKS = [
'Invoice review',
'Contract analysis',
'Supply and inventory',
'Fraud detection',
'Lead routing',
'Asset Maintenance',
'Dynamic pricing',
'Outage triage',
'Expense audit',
'Compliance check',
'KPI summaries',
'Churn prediction'];

const SCENE4_FLIPS = [
0.6, 1.0, // slow start
1.4, 1.55, 1.7, // cluster
2.05, 2.18, 2.3, // cluster
2.6, 2.7, 2.8, 2.85 // burst (all-at-once feel)
];

function Scene4() {
  return (
    <Sprite start={15} end={20}>
      {({ localTime }) => {
        const inP = clamp(localTime / 0.6, 0, 1);
        const outP = clamp((localTime - 4.4) / 0.6, 0, 1);
        const wrapOp = Easing.easeOutCubic(inP) * (1 - Easing.easeInQuad(outP));

        const flipDur = 0.35;
        const flippedN = SCENE4_FLIPS.filter((t) => localTime > t + flipDur * 0.5).length;
        const hoursPerTask = 3.5;
        const hoursSaved = Math.round(flippedN * hoursPerTask);

        const COLS = 4,ROWS = 3;
        const CW = 144,CH = 80,GAP = 14;
        const GX = 700,GY = 160;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: wrapOp }}>
            <div style={{
              position: 'absolute', left: 80, top: 92,
              fontFamily: DISP, fontWeight: 500, fontSize: 16, letterSpacing: '0.18em',
              color: GREEN, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ width: 36, height: 1, background: GREEN }} />
              AI built-in
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 150,
              fontFamily: DISP, fontWeight: 500, fontSize: 88, lineHeight: 0.96,
              letterSpacing: '-0.025em', color: WHITE
            }}>
              Your processes<br />
              run. Your people<br />
              <span style={{ color: GREEN }}>think.</span>
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 430,
              fontFamily: DISP, fontWeight: 500, fontSize: 20, lineHeight: '28px',
              color: DIM, maxWidth: 520
            }}>
              Built into the workflows you already run.<br />
              Your team focuses on decisions. Our agents handle the rest.
            </div>

            {/* Hours counter */}
            <div style={{
              position: 'absolute', left: GX, top: 92,
              display: 'flex', alignItems: 'baseline', gap: 10
            }}>
              <span style={{
                fontFamily: DISP, fontWeight: 500, fontSize: 44,
                color: GREEN, fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em', lineHeight: 1
              }}>
                {hoursSaved}
              </span>
              <span style={{
                fontFamily: UI, fontSize: 11, color: DIM,
                letterSpacing: '0.12em', textTransform: 'uppercase'
              }}>
                hrs / mo saved · climbing
              </span>
            </div>

            {/* Task grid — flip from manual to automated */}
            {SCENE4_TASKS.map((task, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              const x = GX + col * (CW + GAP);
              const y = GY + row * (CH + GAP);
              const flipT = SCENE4_FLIPS[i];
              const fp = clamp((localTime - flipT) / flipDur, 0, 1);
              const flipped = fp > 0.5;
              const sX = Math.max(0.04, Math.abs(1 - 2 * fp));
              const glowAge = clamp(localTime - flipT - flipDur, 0, 1.2);
              const glow = Math.max(0, 1 - glowAge / 1.0);

              return (
                <div key={i} style={{
                  position: 'absolute', left: x, top: y,
                  width: CW, height: CH,
                  borderRadius: 14,
                  background: flipped ? GREEN : TINT,
                  border: flipped ? 'none' : `1px solid ${FAINT}`,
                  transform: `scaleX(${sX})`,
                  transformOrigin: 'center',
                  boxShadow: flipped && glow > 0 ?
                  `0 0 ${16 * glow}px rgba(191,254,76,${0.4 * glow})` :
                  'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-start', justifyContent: 'center',
                  padding: '0 14px',
                  transition: 'background 80ms, border 80ms'
                }}>
                  <div style={{
                    fontFamily: UI, fontSize: 9,
                    color: flipped ? 'rgba(2,29,51,0.62)' : DIM,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    marginBottom: 4,
                    fontWeight: 600
                  }}>
                    {flipped ? 'Automated' : 'Manual'}
                  </div>
                  <div style={{
                    fontFamily: DISP, fontWeight: 500, fontSize: 14,
                    color: flipped ? NAVY : WHITE,
                    letterSpacing: '-0.005em',
                    lineHeight: 1.2, height: "17px", width: "120px"
                  }}>
                    {task}
                  </div>
                </div>);

            })}
          </div>);

      }}
    </Sprite>);

}

// ─────────────────────────────────────────────────────────────────────────
// SCENE 5 (20–25s)  ·  "One partner. Every stage." — horizontal journey
// ─────────────────────────────────────────────────────────────────────────
// Deterministic ambient dots — generated once at module load so they
// don't reshuffle every animation frame.
const SCENE5_DOTS = (() => {
  const rng = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  return Array.from({ length: 110 }).map((_, i) => ({
    x: rng(i * 3 + 1),
    y: rng(i * 3 + 2),
    r: 0.3 + rng(i * 3 + 3) * 1.2,
    a: 0.05 + rng(i * 3 + 4) * 0.30
  }));
})();

const SCENE5_STAGES = [
{ pct: 0, title: 'Assess', sub: 'the honest diagnosis' },
{ pct: 22, title: 'Design', sub: 'a plan you can act on' },
{ pct: 44, title: 'Build', sub: 'apps & AI built to hold' },
{ pct: 66, title: 'Launch', sub: 'into production' },
{ pct: 88, title: 'Run & evolve', sub: 'And we don\u2019t disappear!' }];

const SCENE5_TIMES = [0.2, 0.9, 1.7, 2.5, 3.3];
const SCENE5_FILLS = [2, 22, 44, 66, 88];
const SCENE5_ALLDONE_T = 4.1;
const SCENE5_FOOTER_T = 4.6;

function Scene5({ onReplay }) {
  const { narrow } = React.useContext(TimelineContext);
  return (
    <Sprite start={20} end={25}>
      {({ localTime }) => {
        const inP = clamp(localTime / 0.6, 0, 1);
        const outP = clamp((localTime - 4.4) / 0.6, 0, 1);
        const wrapOp = Easing.easeOutCubic(inP) * (1 - Easing.easeInQuad(outP));

        // Determine current stage index
        let activeIdx = -1;
        for (let i = 0; i < SCENE5_TIMES.length; i++) {
          if (localTime >= SCENE5_TIMES[i]) activeIdx = i;
        }
        const allDone = localTime >= SCENE5_ALLDONE_T;

        // Smoothly ease the fill bar from previous → current target
        let fillPct = 0;
        if (allDone) {
          const p = clamp((localTime - SCENE5_ALLDONE_T) / 0.6, 0, 1);
          fillPct = 88 + (100 - 88) * Easing.easeOutCubic(p);
        } else if (activeIdx >= 0) {
          const t0 = SCENE5_TIMES[activeIdx];
          const nextT = activeIdx + 1 < SCENE5_TIMES.length ?
          SCENE5_TIMES[activeIdx + 1] :
          SCENE5_ALLDONE_T;
          const segP = clamp((localTime - t0) / Math.min(0.6, nextT - t0), 0, 1);
          const start = activeIdx === 0 ? 0 : SCENE5_FILLS[activeIdx - 1];
          const end = SCENE5_FILLS[activeIdx];
          fillPct = start + (end - start) * Easing.easeOutCubic(segP);
        }

        const footerP = clamp((localTime - SCENE5_FOOTER_T) / 0.4, 0, 1);

        const TRACK_X = 90,TRACK_W = 1100,TRACK_Y = 388;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: wrapOp }}>
            {/* Ambient background dots */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
              {SCENE5_DOTS.map((d, i) =>
              <circle
                key={i}
                cx={d.x * 1280}
                cy={d.y * 540}
                r={d.r}
                fill={`rgba(180,200,220,${d.a})`} />

              )}
            </svg>

            <div style={{
              position: 'absolute', left: 80, top: 80,
              fontFamily: DISP, fontWeight: 500, fontSize: 16, letterSpacing: '0.18em',
              color: GREEN, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ width: 36, height: 1, background: GREEN }} />
              05 · The point
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 130,
              fontFamily: DISP, fontWeight: 500, fontSize: 76, lineHeight: 1.0,
              letterSpacing: '-0.025em', color: WHITE
            }}>
              One partner.<br />
              <span style={{ color: GREEN }}>Every stage.</span>
            </div>

            <div style={{
              position: 'absolute', left: 80, top: 282,
              fontFamily: DISP, fontWeight: 500, fontSize: 20, lineHeight: '28px',
              color: DIM, whiteSpace: narrow ? 'normal' : 'nowrap', maxWidth: narrow ? 560 : undefined
            }}>From the first question to the last deployment <span style={{ color: GREEN }}>. . .</span>  and everything that runs after.

            </div>

            {/* Journey track */}
            <div style={{
              position: 'absolute', left: TRACK_X, top: TRACK_Y,
              width: TRACK_W, height: 2,
              background: 'rgba(255,255,255,0.08)', borderRadius: 1
            }} />
            <div style={{
              position: 'absolute', left: TRACK_X, top: TRACK_Y,
              width: fillPct / 100 * TRACK_W, height: 2,
              background: GREEN, borderRadius: 1,
              boxShadow: '0 0 12px rgba(191,254,76,0.45)'
            }} />

            {/* Stage nodes */}
            {SCENE5_STAGES.map((s, i) => {
              const nx = TRACK_X + s.pct / 100 * TRACK_W;
              const visT = SCENE5_TIMES[i];
              const visP = clamp((localTime - visT) / 0.4, 0, 1);
              const isVisible = localTime >= visT;
              const isActive = i === activeIdx && !allDone;
              const isDone = i < activeIdx || allDone;
              const ty = (1 - Easing.easeOutCubic(visP)) * 8;

              const dotBg = isActive || isDone ? GREEN : 'rgba(255,255,255,0.10)';
              const dotBorder = isActive || isDone ? GREEN : 'rgba(255,255,255,0.22)';
              const dotGlow = isActive ? '0 0 0 6px rgba(191,254,76,0.18)' : 'none';
              const titleColor = isActive ? GREEN : WHITE;

              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: nx - 90, top: TRACK_Y - 18,
                  width: 180,
                  opacity: isVisible ? visP : 0,
                  transform: `translateY(${ty}px)`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12,
                  transition: 'opacity 200ms, transform 200ms'
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    background: dotBg,
                    border: `2px solid ${dotBorder}`,
                    boxShadow: dotGlow,
                    transition: 'background 320ms, border 320ms, box-shadow 320ms'
                  }} />
                  <div style={{
                    fontFamily: DISP, fontWeight: 500, fontSize: 17,
                    color: titleColor,
                    textAlign: 'center', lineHeight: 1.25,
                    transition: 'color 320ms'
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontFamily: DISP, fontWeight: 500, fontSize: 13,
                    color: 'rgba(255,255,255,0.40)',
                    textAlign: 'center', lineHeight: 1.3,
                    marginTop: -6, maxWidth: 160
                  }}>
                    {s.sub}
                  </div>
                </div>);

            })}

            {/* Replay */}
            <button
              onClick={onReplay}
              style={{
                position: 'absolute', left: 80, top: 490,
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: DISP, fontWeight: 500, fontSize: 16,
                color: GREEN, background: 'transparent',
                border: `1px solid ${GREEN}`, borderRadius: 500,
                padding: '12px 22px', cursor: 'pointer',
                opacity: footerP,
                pointerEvents: footerP > 0.6 ? 'auto' : 'none',
                transition: 'opacity 300ms, background 160ms, color 160ms'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = GREEN;e.currentTarget.style.color = NAVY;}}
              onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.color = GREEN;}}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12.5 1.5 V5 H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Replay
            </button>
          </div>);

      }}
    </Sprite>);

}

// ─────────────────────────────────────────────────────────────────────────
// Reel root
// ─────────────────────────────────────────────────────────────────────────
function FunFactsReel() {
  const DURATION = 25;
  const SCENES = 5;
  const [playing, setPlaying] = React.useState(true);
  const [t, setT] = React.useState(0);
  const seekRef = React.useRef(null);

  const replay = React.useCallback(() => {
    if (seekRef.current) seekRef.current(0);
    setPlaying(true);
  }, []);

  const sceneIdx = Math.min(SCENES - 1, Math.floor(t / 5));

  return (
    <section id="facts" className="facts-section" data-screen-label="03 Ways of working">
      <div className="facts-eyebrow">
        <span className="label">WAYS OF WORKING</span>
      </div>
      <h2 className="facts-title">
        Why teams count on <em>us</em>.
      </h2>

      <div className="facts-stage">
        <ReelStage
          width={1280}
          height={540}
          duration={DURATION}
          playing={playing}
          loop={true}
          seekRef={seekRef}
          onTick={(nt) => setT(nt)}>
          
          <Scene1 />
          <Scene2 />
          <Scene3 />
          <Scene4 />
          <Scene5 onReplay={replay} />
        </ReelStage>

        {/* Scene pips */}
        <div className="scene-rail">
          {Array.from({ length: SCENES }).map((_, i) => {
            const localT = t - i * 5;
            const f = i === sceneIdx ? clamp(localT / 5, 0, 1) : i < sceneIdx ? 1 : 0;
            return (
              <div key={i} className="pip">
                <div className="fill" style={{ transform: `scaleX(${f})` }} />
              </div>);

          })}
        </div>

        {/* Controls */}
        <div className="scene-controls">
          <span className="scene-label">{String(sceneIdx + 1).padStart(2, '0')} / {String(SCENES).padStart(2, '0')}</span>
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause reel' : 'Play reel'}>
            {playing ?
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="2" width="3" height="10" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" fill="currentColor" />
              </svg> :

            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M3 2 L12 7 L3 12 Z" fill="currentColor" />
              </svg>
            }
          </button>
        </div>
      </div>
    </section>);

}

export { FunFactsReel, ReelStage };
export default FunFactsReel;