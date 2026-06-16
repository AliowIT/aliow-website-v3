import React from 'react';

// hero.jsx — Aliow landing hero. Nav + big headline + service cards + scroll cue.

function Wordmark() {
  return (
    <a href="#top" className="wordmark" aria-label="aliow home">
      <svg
        className="wordmark-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 161 44"
        fill="none"
        role="img"
        aria-label="aliow">
        <path
          d="M31.748 11.753V0H0v11.898h28.463A31.36 31.36 0 0 0 9.36 21.041C3.409 27.023.135 34.989.135 43.47h11.25c0-5.513 2.115-10.678 5.974-14.554 3.802-3.82 8.865-5.95 14.276-5.994V43.47h11.948V11.742H31.748z"
          fill="var(--aliow-green, #BFFE4C)" />
        <path
          d="M99.822 5h-5.31v5.288h5.31zM80.313 33.917c-.225 0-.608 0-.608-2.017V21.503c0-5.422-3.07-8.28-8.898-8.28s-10.238 2.992-10.508 8.213l-.022.493h5.388l.034-.426c.192-2.6.979-3.831 4.928-3.831s3.859 1.927 3.859 2.554c0 1.793-1.744 2.196-5.378 2.88-4.995.94-9.878 2.34-9.878 8.1 0 5.758 3.184 6.946 7.92 6.946 4.737 0 5.862-1.098 7.56-3.204.473 1.95 1.688 2.8 3.904 2.8s1.553-.09 2.34-.28l.36-.09v-3.584l-.54.09c-.225.033-.337.033-.461.033m-5.828-5.714c0 3.44-2.373 5.49-6.356 5.49s-3.409-.874-3.409-2.823c0-1.95 1.395-3.026 5.344-3.81 1.98-.414 3.477-.795 4.433-1.255v2.398zM90.955 5h-5.31v33.185h5.31zm8.867 8.93h-5.31v24.21h5.31zm14.738-.718c-7.223 0-11.88 4.907-11.88 12.503s4.646 12.459 11.846 12.459 11.846-4.907 11.846-12.504-4.635-12.458-11.801-12.458zm0 20.436c-4.005 0-6.402-2.97-6.402-7.933s.619-7.932 6.402-7.932c5.782 0 6.311 2.969 6.311 7.932s-2.363 7.933-6.311 7.933m40.497-19.718-4.534 16.839-4.421-16.84h-5.142l-4.41 16.829-4.5-16.828h-5.726l7.335 24.21h5.209l4.601-16.793 4.59 16.794h5.209l7.335-24.211z"
          fill="var(--aliow-white, #fff)" />
      </svg>
    </a>);

}

function Nav() {
  return (
    <header className="hero-nav">
      <Wordmark />
      <nav className="nav-links" aria-label="Primary">
        <a href="#what">What we do</a>
        <a href="#facts">Ways of working</a>
        <a href="#ai">AI Practice</a>
        <a href="#replatforming">Replatforming</a>
        <a href="#contact" className="contact">Contact us</a>
      </nav>
    </header>);

}

/* ---- Icon glyphs — shared with section 3's "Four capabilities" pillars ---- */
const HeroSVG = ({ size = 22, children }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none"
stroke="currentColor" strokeWidth="1.6"
strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;

const IconBrackets = (p) => <HeroSVG {...p}><path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18" /></HeroSVG>;
const IconBrain = (p) =>
<HeroSVG {...p}>
    <path d="M9 5.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 4 3 3 0 0 0 4 1 3 3 0 0 0 3 1.5" />
    <path d="M15 5.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 4 3 3 0 0 1-4 1 3 3 0 0 1-3 1.5" />
    <path d="M12 4 V 20" />
  </HeroSVG>;
const IconRefresh = (p) =>
<HeroSVG {...p}>
    <path d="M21 12 a 9 9 0 0 1 -15.5 6.2" />
    <path d="M3 12 A 9 9 0 0 1 18.5 5.8" />
    <path d="M21 5 V 10 H 16" />
    <path d="M3 19 V 14 H 8" />
  </HeroSVG>;
const IconLineChart = (p) =>
<HeroSVG {...p}>
    <path d="M4 18 L4 5" />
    <path d="M4 18 L21 18" />
    <path d="M7 14 L11 10 L14 13 L20 6" />
    <circle cx="20" cy="6" r="1.2" fill="currentColor" stroke="none" />
  </HeroSVG>;

function ServiceCard({ icon, kicker, title, pillar }) {
  const onClick = () => {
    window.dispatchEvent(new CustomEvent('aliow:select-pillar', { detail: pillar }));
  };
  return (
    <a className="card" href="#what" onClick={onClick}>
      <div className="icon-chip">{icon}</div>
      <div>
        <p className="card-kicker">{kicker}</p>
        <h3>{title}</h3>
      </div>
    </a>);

}

function ServiceGrid() {
  return (
    <div className="cards">
      <ServiceCard icon={<IconBrackets />} kicker="Build" title="Enterprise App Development" pillar={0} />
      <ServiceCard icon={<IconBrain />} kicker="Intelligent" title="AI & automation" pillar={1} />
      <ServiceCard icon={<IconRefresh />} kicker="Transform" title="Replatforming & Migrations" pillar={2} />
      <ServiceCard icon={<IconLineChart />} kicker="Advise" title="IT Business Consultancy" pillar={3} />
    </div>);

}

function LocationPill() {
  return (
    <div className="loc-pill" role="status" aria-label="Based in Lisbon, working globally">
      <span className="loc-dot" aria-hidden="true">
        <span className="loc-dot-core" />
        <span className="loc-dot-ring" />
        <span className="loc-dot-ring loc-dot-ring--delay" />
      </span>
      <span className="loc-text">
        <span className="loc-word">Based in Portugal</span>
        <span className="loc-sep" aria-hidden="true">·</span>
        <span className="loc-word">Working globally</span>
      </span>
      <span className="loc-shimmer" aria-hidden="true" />
    </div>);

}

function Hero() {
  return (
    <section id="top" className="hero" data-screen-label="01 Hero">
      <Nav />
      <div className="hero-grid">
        <div className="hero-copy">
          <LocationPill />
          <p className="hero-kicker">
            Got a challenge technology should solve but not sure how?
          </p>
          <h1 className="hero-statement">
            <span className="hs-line">We figure it out.</span>
            <span className="hs-line hs-line--italic" style={{ fontSize: "62px" }}>Then we build it.</span>
          </h1>
          <p className="lede" style={{ color: "rgb(255, 255, 255)" }}>aliow helps mid-market and enterprise companies deliver AI, modernize platforms, and build applications that actually work. With a pace of a startup and the rigour of a top consultancy.



          </p>
        </div>
        <ServiceGrid />
      </div>
    </section>);

}

export default Hero;