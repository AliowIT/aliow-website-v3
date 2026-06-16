import React from 'react';
import Hero from './hero.jsx';
import { FunFactsReel } from './funfacts.jsx';
import { WhatWeDo, AliowThesis, AIPractice, Transform, Values, ReadyToTalk, FooterFinal } from './sections.jsx';

// app.jsx — page composition + mount.

function App() {
  return (
    <div className="page">
      <Hero />
      <WhatWeDo />
      <FunFactsReel />
      <AliowThesis />
      <AIPractice />
      <Transform />
      <Values />
      <ReadyToTalk />
      <FooterFinal />
    </div>
  );
}

export default App;
