/**
 * SoundContext - shared mute state for the split-flap sound toggle.
 */
import { createContext, useContext, useState } from 'react';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(true);

  function toggle() {
    setMuted((m) => !m);
  }

  return (
    <SoundContext.Provider value={{ muted, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  return ctx || { muted: true, toggle: () => {} };
}

export const SplitFlapAudioProvider = SoundProvider;
