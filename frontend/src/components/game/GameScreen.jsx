import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext.jsx';
import { useVoice } from '../../contexts/VoiceContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playHoverSound, setMuted } from '../../audio/audioEngine.js';
import RoomExploration from './RoomExploration.jsx';
import AudioRenderer from '../common/AudioRenderer.jsx';

export default function GameScreen() {
  const { state, actions } = useGame();
  const { isMuted, toggleMute, micError } = useVoice();
  const [activeTab, setActiveTab] = useState('role'); // role, location, suspects, timeline, clues
  const [phase, setPhase] = useState('briefing'); // briefing | exploring
  const [musicMuted, setMusicMuted] = useState(false);

  const toggleMusic = () => {
    setMusicMuted(prev => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  };

  const mystery = state.room?.mysteryData;
  const myPlayerId = state.playerId;

  // Find the suspect assigned to the current player
  const myRole = mystery?.suspects?.find(s => s.playerId === myPlayerId) || mystery?.suspects?.[0];
  const otherSuspects = mystery?.suspects?.filter(s => s.playerId !== myPlayerId) || [];

  if (!mystery) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 text-white font-mono">
        <h1 className="text-xl">Error: Mystery data not found.</h1>
      </div>
    );
  }

  // ── Room Exploration Phase ──
  if (phase === 'exploring') {
    return <RoomExploration />;
  }

  // ── Briefing Phase ──
  const tabs = [
    { id: 'role', label: 'Your Role' },
    { id: 'location', label: 'The Location' },
    { id: 'suspects', label: 'Other Suspects' },
    { id: 'timeline', label: 'Timeline & Clues' }
  ];

  return (
    <motion.div
      key="game-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-[color:var(--color-blood-dark)] flex justify-between items-start md:items-center gap-4 bg-black/80">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="game-title text-xl md:text-3xl truncate">
            {mystery.victim.name} is dead.
          </h1>
          <p className="game-subtitle text-xs md:text-sm mt-2 break-words whitespace-pre-wrap">
            {mystery.victim.backstory}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-3 shrink-0">
          <button
            onClick={toggleMusic}
            className={`text-xs px-3 py-1 border rounded transition-colors font-[family-name:var(--font-family-heading)] tracking-widest ${
              musicMuted ? 'text-[color:var(--color-moonlight)] border-[color:var(--color-moonlight)] bg-[color:var(--color-moonlight-dim)]' : 'text-[color:var(--color-blood-glow)] border-[color:var(--color-blood)] bg-[color:var(--color-crimson)]'
            }`}
            title="Toggle Background Music"
          >
            {musicMuted ? '[MUSIC ON]' : '[MUSIC OFF]'}
          </button>
          <button
            onClick={toggleMute}
            className={`text-xs px-3 py-1 border rounded transition-colors font-[family-name:var(--font-family-heading)] tracking-widest ${
              isMuted ? 'text-[color:var(--color-gold)] border-[color:var(--color-gold-dim)] bg-[color:var(--color-gold-dim)]' : 'text-[color:var(--color-blood-glow)] border-[color:var(--color-blood)] bg-[color:var(--color-crimson)]'
            }`}
            title={micError || 'Toggle Microphone'}
          >
            {isMuted ? '[MIC ON]' : '[MIC OFF]'}
          </button>
          <button
            onClick={() => {
              actions.closeRoom();
              window.location.href = '/';
            }}
            className="text-xs text-[color:var(--color-bone-dark)] hover:text-[color:var(--color-blood-glow)] transition-colors font-[family-name:var(--font-family-heading)] tracking-widest"
          >
            [LEAVE GAME]
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-[color:var(--color-blood-dark)] bg-black/60">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm tracking-widest uppercase font-[family-name:var(--font-family-heading)] transition-all ${
              activeTab === tab.id
                ? 'text-[color:var(--color-blood-glow)] border-b-2 border-[color:var(--color-blood)] bg-[color:var(--color-crimson)] bg-opacity-20'
                : 'text-[color:var(--color-bone-dark)] hover:text-[color:var(--color-bone)] hover:bg-white/5'
            }`}
          >
            [{tab.label}]
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 w-full relative">
        <AnimatePresence mode="wait">
          {activeTab === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-3xl mx-auto space-y-8"
            >
              <div className="text-center mb-10">
                <h2 className="font-[family-name:var(--font-family-heading)] text-[color:var(--color-gold-dim)] tracking-widest uppercase mb-2">You are</h2>
                <h1 className="game-title text-3xl md:text-5xl break-words leading-tight">{myRole?.name}</h1>
                <p className="game-subtitle text-lg md:text-xl mt-3">{myRole?.age} yrs • {myRole?.occupation}</p>
              </div>

              <div className="space-y-6">
                <section className="panel rounded">
                  <h3 className="panel-header mb-3">Public Background</h3>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 leading-relaxed break-words whitespace-pre-wrap text-[color:var(--color-bone)] text-lg">{myRole?.publicBackground}</p>
                </section>

                <section className="panel rounded border-[color:var(--color-blood)]">
                  <h3 className="panel-header bg-[color:var(--color-crimson)] bg-opacity-20 border-[color:var(--color-blood)] mb-3 text-[color:var(--color-blood-glow)]">Private Objective</h3>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 leading-relaxed text-gray-300 break-words whitespace-pre-wrap text-lg">{myRole?.privateObjective}</p>
                </section>

                <section className="panel rounded">
                  <h3 className="panel-header mb-3 text-[color:var(--color-moonlight)]">Hidden Information</h3>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 leading-relaxed break-words whitespace-pre-wrap text-[color:var(--color-bone)] text-lg">{myRole?.hiddenInformation}</p>
                </section>

                <section className="panel rounded">
                  <h3 className="panel-header mb-3 text-[color:var(--color-moonlight)]">Secret Relationship</h3>
                  <p className="px-5 pb-5 md:px-6 md:pb-6 leading-relaxed break-words whitespace-pre-wrap text-[color:var(--color-bone)] text-lg">{myRole?.secretRelationship}</p>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-3xl mx-auto"
            >
              <h2 className="game-title text-2xl md:text-4xl mb-8 break-words">{mystery.location.name}</h2>
              <p className="text-lg md:text-xl leading-relaxed text-[color:var(--color-bone)] border-l-2 border-[color:var(--color-blood)] pl-5 md:pl-8 py-2 break-words whitespace-pre-wrap">
                {mystery.location.description}
              </p>
            </motion.div>
          )}

          {activeTab === 'suspects' && (
            <motion.div
              key="suspects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {otherSuspects.map((suspect, idx) => (
                <div key={idx} className="panel p-5 md:p-6 rounded">
                  <h3 className="game-title text-xl md:text-2xl mb-1 break-words">{suspect.name}</h3>
                  <p className="game-subtitle text-sm mb-5 text-[color:var(--color-bone-dark)]">{suspect.age} yrs • {suspect.occupation}</p>
                  
                  <div className="space-y-4 text-base">
                    <div>
                      <span className="font-[family-name:var(--font-family-heading)] text-[color:var(--color-gold-dim)] uppercase tracking-wider text-xs block mb-1">Appearance</span>
                      <p className="break-words whitespace-pre-wrap text-[color:var(--color-bone)]">{suspect.physicalDescription}</p>
                    </div>
                    <div>
                      <span className="font-[family-name:var(--font-family-heading)] text-[color:var(--color-gold-dim)] uppercase tracking-wider text-xs block mb-1">Known Background</span>
                      <p className="break-words whitespace-pre-wrap text-[color:var(--color-bone)]">{suspect.publicBackground}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {/* Timeline */}
              <div>
                <h3 className="game-title text-2xl mb-6 border-b border-[color:var(--color-blood-dark)] pb-3">Timeline</h3>
                <div className="space-y-6">
                  {mystery.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-8 border-l-2 border-[color:var(--color-blood-dark)]">
                      <div className="absolute w-3 h-3 bg-[color:var(--color-blood-glow)] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_var(--color-blood)]" />
                      <span className="font-[family-name:var(--font-family-heading)] text-[color:var(--color-gold)] text-sm tracking-wider block mb-2 break-words">{event.time}</span>
                      <p className="text-lg text-[color:var(--color-bone)] break-words whitespace-pre-wrap">{event.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clues */}
              <div>
                <h3 className="game-title text-2xl mb-6 border-b border-[color:var(--color-blood-dark)] pb-3">Initial Clues</h3>
                <div className="space-y-5">
                  {mystery.initialClues.map((clue, idx) => (
                    <div key={idx} className="panel rounded overflow-hidden">
                      <h4 className="panel-header mb-3">{clue.name}</h4>
                      <p className="px-5 pb-5 md:px-6 md:pb-6 text-lg text-[color:var(--color-bone)] break-words whitespace-pre-wrap">{clue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Enter the Mansion Button ── */}
      <div
        className="px-6 py-5 border-t flex items-center justify-center"
        style={{ borderColor: 'rgba(139, 0, 0, 0.3)', background: 'rgba(5, 3, 2, 0.95)' }}
      >
        <button
          onClick={() => { playClickSound(); setPhase('exploring'); }}
          onMouseEnter={playHoverSound}
          className="relative overflow-hidden group transition-all duration-500"
          style={{
            fontFamily: 'var(--font-family-heading), Cinzel, serif',
            fontSize: '1.1rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#d4c5a9',
            background: 'linear-gradient(180deg, rgba(30,20,15,0.9) 0%, rgba(15,10,8,0.95) 100%)',
            border: '1px solid rgba(139, 0, 0, 0.5)',
            padding: '1rem 3rem',
            cursor: 'pointer',
            textShadow: '0 0 15px rgba(139, 0, 0, 0.6)',
            boxShadow: '0 0 25px rgba(139, 0, 0, 0.2), inset 0 0 15px rgba(139, 0, 0, 0.05)',
          }}
        >
          ⚰️ Enter the Mansion
        </button>
      </div>

      <AudioRenderer />
    </motion.div>
  );
}
