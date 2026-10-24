/**
 * SplitFlapText - airport departure board flip animation.
 * Each tile flips through random characters before settling.
 * Includes Web Audio click sounds and mute toggle.
 * @param {{ word: string }} props
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from './SoundContext.jsx';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FLIP_SPEED = 80;
const ANIM_STEPS = 5;

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function playClick(muted) {
  if (muted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const actx = new AudioCtx();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, actx.currentTime);
    gain.gain.setValueAtTime(0.05, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 0.02);
  } catch (_) {
    // Silently ignore audio errors
  }
}

function Tile({ targetChar, delay, isReplay, muted }) {
  const [displayChar, setDisplayChar] = useState(randomChar());
  const [isFlipping, setIsFlipping] = useState(false);
  const [settled, setSettled] = useState(false);
  const [flapAngle, setFlapAngle] = useState(-90);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let cancelled = false;

    if (prefersReduced) {
      setDisplayChar(targetChar);
      setSettled(true);
      return;
    }

    const flipCount = isReplay ? 4 : 8 + delay * 3;
    let flipped = 0;

    function doFlip() {
      if (cancelled) return;
      if (flipped < flipCount) {
        setIsFlipping(true);
        setFlapAngle(-90);
        setDisplayChar(randomChar());
        playClick(muted);

        // Animate flap from -90 to 0
        let step = 0;
        const stepTimer = setInterval(() => {
          if (cancelled) {
            clearInterval(stepTimer);
            return;
          }
          step++;
          setFlapAngle(-90 + (90 / ANIM_STEPS) * step);
          if (step >= ANIM_STEPS) {
            clearInterval(stepTimer);
          }
        }, FLIP_SPEED / ANIM_STEPS);

        flipped++;
        setTimeout(doFlip, FLIP_SPEED);
      } else {
        // Settle on real character
        setIsFlipping(false);
        setDisplayChar(targetChar);
        setSettled(true);
        playClick(muted);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    }

    const startDelay = isReplay ? delay * 80 : delay * 150;
    const startTimer = setTimeout(doFlip, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetChar, delay, isReplay, prefersReduced]);

  if (targetChar === ' ') {
    return (
      <span style={{ display: 'inline-block', width: '0.3em' }} aria-hidden="true" />
    );
  }

  const charStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: '1.05em',
    color: isFlipping ? '#F97316' : '#fff',
    fontFamily: '"Bebas Neue", Impact, sans-serif',
  };

  const flapStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden',
    transformOrigin: 'bottom center',
    transform: `rotateX(${flapAngle}deg)`,
    transition: `transform ${(FLIP_SPEED / ANIM_STEPS)}ms cubic-bezier(0.22,0.61,0.36,1)`,
    backfaceVisibility: 'hidden',
  };

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '0.65em',
        height: '1.05em',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Bebas Neue", Impact, sans-serif',
        fontSize: 'inherit',
        backgroundColor: isFlipping ? 'rgba(249,115,22,0.2)' : '#000',
        flexShrink: 0,
        opacity: 0,
        transform: 'translateY(20px)',
        animation: 'tile-mount 0.4s ease forwards',
        animationDelay: `${delay * 0.05}s`,
      }}
      aria-hidden="true"
    >
      {/* Bottom half: shows settled character clipped */}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <span style={{ ...charStyle, bottom: 0, top: 'auto', color: '#fff' }}>
          {settled ? displayChar : ' '}
        </span>
      </span>

      {/* Top half: shows current display char clipped */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <span style={charStyle}>{displayChar}</span>
      </span>

      {/* Flap overlay during flip */}
      {isFlipping && (
        <span style={flapStyle}>
          <span style={{ ...charStyle, color: '#F97316' }}>{displayChar}</span>
        </span>
      )}

      {/* Middle line divider */}
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 10,
          transform: 'translateY(-50%)',
        }}
      />
    </span>
  );
}

export function SplitFlapText({
  word,
  fontSize = 'clamp(4rem, 15vw, 14rem)',
  hideSoundToggle = false,
  noReplay = false,
  mutedOverride,
}) {
  const [replay, setReplay] = useState(0);
  const soundCtx = useSound();
  const muted = mutedOverride !== undefined ? mutedOverride : soundCtx.muted;
  const toggleMute = soundCtx.toggle;

  const handleMouseEnter = useCallback(() => {
    if (noReplay) return;
    setReplay((r) => r + 1);
  }, [noReplay]);

  const chars = String(word).split('');

  return (
    <div>
      <style>{`
        @keyframes tile-mount {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h1
        aria-label={word}
        onMouseEnter={handleMouseEnter}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-end',
          gap: '0.08em',
          perspective: '1000px',
          margin: 0,
          cursor: noReplay ? 'default' : 'default',
          userSelect: 'none',
          fontSize,
          lineHeight: 1,
        }}
      >
        {chars.map((ch, i) => (
          <Tile
            key={`${i}-${replay}`}
            targetChar={ch.toUpperCase()}
            delay={i}
            isReplay={replay > 0}
            muted={muted}
          />
        ))}
      </h1>

      {!hideSoundToggle && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            className="lp-mute-toggle"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute flip sound' : 'Mute flip sound'}
          >
            {muted ? (
              <VolumeX size={14} aria-hidden="true" />
            ) : (
              <Volume2 size={14} aria-hidden="true" />
            )}
            <span>{muted ? 'Sound Off' : 'Sound On'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
