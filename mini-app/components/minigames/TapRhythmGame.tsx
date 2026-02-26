import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minigame } from '../../../shared/content/minigames';

interface TapRhythmGameProps {
  game: Minigame;
  onComplete: (score: number, perfect: boolean) => void;
  onExit: () => void;
}

interface Beat {
  id: number;
  time: number;
  hit: boolean;
  accuracy?: 'perfect' | 'good' | 'miss';
}

export const TapRhythmGame: React.FC<TapRhythmGameProps> = ({ game, onComplete, onExit }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(game.timeLimit || 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();

  // Initialize beat pattern
  useEffect(() => {
    if (game.mechanics.pattern) {
      const beatPattern = game.mechanics.pattern.map((beat, index) => ({
        id: index,
        time: index * 600, // 600ms between beats
        hit: false
      }));
      setBeats(beatPattern);
    }
  }, [game.mechanics.pattern]);

  // Game timer
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      endGame();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  // Beat animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const now = Date.now();
        setBeats(prevBeats => 
          prevBeats.map(beat => {
            if (!beat.hit && now >= beat.time && now <= beat.time + 200) {
              return { ...beat, hit: true, accuracy: getAccuracy(now - beat.time) };
            }
            return beat;
          })
        );
        
        // Check for missed beats
        setBeats(prevBeats => {
          const updatedBeats = prevBeats.map(beat => {
            if (!beat.hit && now > beat.time + 200) {
              return { ...beat, hit: true, accuracy: 'miss' as const };
            }
            return beat;
          });
          
          // Update current beat index
          const nextUnhitIndex = updatedBeats.findIndex(beat => !beat.hit);
          if (nextUnhitIndex !== -1) {
            setCurrentBeatIndex(nextUnhitIndex);
          }
          
          return updatedBeats;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const getAccuracy = (timing: number): 'perfect' | 'good' | 'miss' => {
    if (timing <= 100) return 'perfect';
    if (timing <= 200) return 'good';
    return 'miss';
  };

  const handleTap = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    
    const currentBeat = beats[currentBeatIndex];
    if (!currentBeat || currentBeat.hit) return;
    
    const now = Date.now();
    const timing = Math.abs(now - currentBeat.time);
    const accuracy = getAccuracy(timing);
    
    // Update beat
    setBeats(prevBeats =>
      prevBeats.map(beat =>
        beat.id === currentBeatIndex
          ? { ...beat, hit: true, accuracy }
          : beat
      )
    );
    
    // Update score and combo
    let points = 0;
    let feedbackText = '';
    
    switch (accuracy) {
      case 'perfect':
        points = 100;
        feedbackText = 'PERFECT!';
        setCombo(prev => {
          const newCombo = prev + 1;
          setMaxCombo(max => Math.max(max, newCombo));
          return newCombo;
        });
        break;
      case 'good':
        points = 50;
        feedbackText = 'GOOD!';
        setCombo(prev => {
          const newCombo = prev + 1;
          setMaxCombo(max => Math.max(max, newCombo));
          return newCombo;
        });
        break;
      case 'miss':
        points = 0;
        feedbackText = 'MISS';
        setCombo(0);
        break;
    }
    
    setScore(prev => prev + points);
    setFeedback(feedbackText);
    
    // Create particle effect
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const newParticle = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      setParticles(prev => [...prev, newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    }
    
    // Clear feedback
    setTimeout(() => setFeedback(''), 500);
  }, [isPlaying, beats, currentBeatIndex]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeRemaining(game.timeLimit || 60);
    setCurrentBeatIndex(0);
    setBeats(prevBeats => prevBeats.map(beat => ({ ...beat, hit: false })));
  };

  const endGame = () => {
    setIsPlaying(false);
    const perfect = score >= game.maxScore * 0.95;
    onComplete(score, perfect);
  };

  const progress = (beats.filter(beat => beat.accuracy !== 'miss').length / beats.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="text-lg font-bold">Score: {score}</div>
            <div className="text-yellow-400">Combo: {combo}</div>
            <div className="text-purple-400">Max: {maxCombo}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeRemaining}s
            </div>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">{game.name}</h2>
              <p className="text-gray-400 mb-8">{game.description}</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-xl font-bold rounded-xl transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          ) : (
            <div
              ref={gameAreaRef}
              className="relative w-full h-full flex items-center justify-center"
              onClick={handleTap}
            >
              {/* Beat indicators */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-8">
                  {beats.slice(currentBeatIndex, currentBeatIndex + 4).map((beat, index) => (
                    <motion.div
                      key={beat.id}
                      className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all ${
                        beat.hit
                          ? beat.accuracy === 'perfect'
                            ? 'bg-green-500 border-green-400 scale-110'
                            : beat.accuracy === 'good'
                            ? 'bg-yellow-500 border-yellow-400 scale-105'
                            : 'bg-red-500 border-red-400 opacity-50'
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: beat.hit ? 1 : 1.1 }}
                      whileTap={{ scale: beat.hit ? 1 : 0.95 }}
                    >
                      {beat.hit ? (
                        beat.accuracy === 'perfect' ? '🔥' :
                        beat.accuracy === 'good' ? '✨' : '❌'
                      ) : (
                        <span className="text-gray-400">TAP</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-center mt-2 text-sm text-gray-400">
                  Progress: {Math.round(progress)}%
                </div>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 1.5, y: -50 }}
                    exit={{ opacity: 0, scale: 0.8, y: -100 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold"
                  >
                    {feedback === 'PERFECT!' && <span className="text-green-400">{feedback}</span>}
                    {feedback === 'GOOD!' && <span className="text-yellow-400">{feedback}</span>}
                    {feedback === 'MISS' && <span className="text-red-400">{feedback}</span>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Particles */}
              <AnimatePresence>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{ opacity: 0, scale: 2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute w-8 h-8 bg-yellow-400 rounded-full"
                    style={{
                      left: particle.x - 16,
                      top: particle.y - 16
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {isPlaying && (
        <div className="absolute top-24 left-8 bg-gray-800 bg-opacity-90 p-4 rounded-lg max-w-xs">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Tap the circles when they reach the center</li>
            <li>• Perfect timing = 100 points</li>
            <li>• Good timing = 50 points</li>
            <li>• Build combos for bonus points</li>
            <li>• Complete before time runs out!</li>
          </ul>
        </div>
      )}
    </div>
  );
};
