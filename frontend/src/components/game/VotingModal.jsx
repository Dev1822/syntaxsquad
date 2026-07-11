import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext.jsx';
import { playClickSound, playHoverSound } from '../../audio/audioEngine.js';

const AVATARS = ['🕵️', '🧙', '💀', '🦇', '🐍', '🌙', '⚗️', '🗡️'];

export default function VotingModal() {
  const { state, actions } = useGame();
  const { votingPhase, votingResults, accusation, room, playerId, gameState } = state;

  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(votingPhase?.timeLimit || 120);
  const [showResults, setShowResults] = useState(false);

  const suspects = votingPhase?.suspects || room?.mysteryData?.suspects?.map(s => ({
    name: s.name,
    occupation: s.occupation,
    physicalDescription: s.physicalDescription
  })) || [];

  const votesCast = votingPhase?.votesCast || 0;
  const totalPlayers = (room?.players || []).filter(p => p.isConnected).length;

  useEffect(() => {
    if (votingResults) setShowResults(true);
  }, [votingResults]);

  useEffect(() => {
    if (!votingPhase?.isActive || hasVoted || showResults) return;
    setTimeLeft(votingPhase.timeLimit || 120);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [votingPhase?.isActive, hasVoted, showResults]);

  const handleCastVote = async () => {
    if (!selectedSuspect || hasVoted) return;
    playClickSound();
    await actions.castVote(selectedSuspect);
    setHasVoted(true);
  };

  const timerPct = (timeLeft / (votingPhase?.timeLimit || 120)) * 100;
  const timerColor = timeLeft > 60 ? '#4ade80' : timeLeft > 30 ? '#facc15' : '#f87171';

  if (gameState !== 'voting' && !showResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
    >
      {/* Results Modal */}
      <AnimatePresence>
        {showResults && votingResults && (
          <ResultsModal votingResults={votingResults} room={room} suspects={suspects} />
        )}
      </AnimatePresence>

      {/* Voting UI */}
      {!showResults && (
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-panel w-full max-w-2xl mx-4 flex flex-col"
          style={{
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {/* Header */}
          <div className="px-8 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-stone-100"
                style={{ fontFamily: 'var(--font-family-heading)' }}
              >
                ⚖️ Cast Your Vote
              </h2>
              {/* Timer */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-3xl font-mono font-bold" style={{ color: timerColor }}>
                  {timeLeft}s
                </span>
                <div className="w-24 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ background: timerColor, width: `${timerPct}%`, transition: 'width 1s linear, background 1s' }}
                  />
                </div>
              </div>
            </div>

            {/* Accusation context */}
            {accusation?.accusedName && (
              <p className="text-sm text-stone-400 font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)' }}>
                {accusation.accuserName} accused {accusation.accusedName}.{' '}
                {accusation.defense && (
                  <span className="text-green-400 normal-case font-normal">
                    Defense: "{accusation.defense.slice(0, 60)}{accusation.defense.length > 60 ? '...' : ''}"
                  </span>
                )}
              </p>
            )}

            {/* Vote progress */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ background: 'rgba(218,165,32,0.8)', width: totalPlayers > 0 ? `${(votesCast / totalPlayers) * 100}%` : '0%' }}
                  layout
                />
              </div>
              <span className="text-xs font-mono font-bold shrink-0 text-stone-400 uppercase tracking-wider">
                {votesCast}/{totalPlayers} voted
              </span>
            </div>
          </div>

          {/* Suspects Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {hasVoted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <span className="text-6xl">✓</span>
                <p className="text-2xl font-bold uppercase tracking-widest text-stone-100" style={{ fontFamily: 'var(--font-family-heading)' }}>
                  Vote Cast
                </p>
                <p className="text-sm font-semibold uppercase tracking-wider text-stone-400" style={{ fontFamily: 'var(--font-family-body)' }}>
                  You voted for <span style={{ color: '#daa520' }}>{selectedSuspect}</span>
                </p>
                <p className="text-xs text-stone-500 mt-2 uppercase tracking-wider">
                  Waiting for others... ({votesCast}/{totalPlayers})
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suspects.map((suspect, idx) => {
                  const isSelected = selectedSuspect === suspect.name;
                  return (
                    <motion.button
                      key={suspect.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => { playClickSound(); setSelectedSuspect(suspect.name); }}
                      onMouseEnter={playHoverSound}
                      className="p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: isSelected ? 'rgba(218, 165, 32, 0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(218, 165, 32, 0.5)' : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: isSelected ? '0 0 20px rgba(218,165,32,0.15)' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                          style={{
                            background: isSelected ? 'rgba(218,165,32,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isSelected ? 'rgba(218,165,32,0.3)' : 'rgba(255,255,255,0.1)'}`
                          }}
                        >
                          {AVATARS[idx % AVATARS.length]}
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-bold text-base"
                            style={{ fontFamily: 'var(--font-family-body)', color: isSelected ? '#daa520' : '#f0ece6' }}
                          >
                            {suspect.name}
                          </p>
                          <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                            {suspect.occupation}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-xl" style={{ color: '#daa520' }}>✓</span>
                        )}
                      </div>
                      {suspect.physicalDescription && (
                        <p className="text-xs leading-relaxed text-stone-400 mt-1">
                          {suspect.physicalDescription.slice(0, 80)}{suspect.physicalDescription.length > 80 ? '...' : ''}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer — Cast Vote */}
          {!hasVoted && (
            <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={handleCastVote}
                disabled={!selectedSuspect}
                onMouseEnter={selectedSuspect ? playHoverSound : undefined}
                className="premium-btn w-full py-4 rounded-full tracking-widest uppercase text-sm font-bold transition-all duration-300 disabled:opacity-30"
                style={{
                  fontFamily: 'var(--font-family-heading)',
                  background: selectedSuspect ? 'rgba(10,10,10,0.9)' : 'rgba(40,40,40,0.4)',
                  color: selectedSuspect ? '#daa520' : 'rgba(200,200,200,0.4)',
                  borderColor: selectedSuspect ? 'rgba(218,165,32,0.6)' : 'rgba(255,255,255,0.08)',
                  cursor: selectedSuspect ? 'pointer' : 'not-allowed'
                }}
              >
                {selectedSuspect ? `Vote for ${selectedSuspect}` : 'Select a Suspect First'}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Results Modal ──────────────────────────────────────
function ResultsModal({ votingResults, room, suspects }) {
  const { voteCounts = {}, winner, isTie } = votingResults;
  const maxVotes = Math.max(...Object.values(voteCounts), 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[80] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        className="glass-panel w-full max-w-lg mx-4 p-8 flex flex-col gap-6"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4"
          >
            ⚖️
          </motion.div>
          <h2
            className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-stone-100"
            style={{ fontFamily: 'var(--font-family-heading)' }}
          >
            {isTie ? 'The Vote is Split' : 'The Jury Has Spoken'}
          </h2>
          {isTie && (
            <p className="text-sm mt-2 text-stone-400 font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-family-body)' }}>
              No clear majority — the truth remains veiled...
            </p>
          )}
        </div>

        {/* Vote bars */}
        <div className="flex flex-col gap-4">
          {suspects
            .sort((a, b) => (voteCounts[b.name] || 0) - (voteCounts[a.name] || 0))
            .map((suspect, idx) => {
              const count = voteCounts[suspect.name] || 0;
              const pct = (count / maxVotes) * 100;
              const isWinner = suspect.name === winner;
              return (
                <motion.div
                  key={suspect.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{
                        fontFamily: 'var(--font-family-body)',
                        color: isWinner ? '#daa520' : '#e2ddd8'
                      }}
                    >
                      {suspect.name} {isWinner && '⚖️'}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      {count} vote{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                      style={{
                        background: isWinner
                          ? 'linear-gradient(90deg, #daa520, #b8860b)'
                          : 'rgba(255,255,255,0.15)'
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm font-semibold uppercase tracking-widest text-stone-500"
          style={{ fontFamily: 'var(--font-family-heading)' }}
        >
          Prepare yourself for the truth...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
