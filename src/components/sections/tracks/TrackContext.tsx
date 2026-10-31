"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

type TrackState = { track: number; setTrack: Dispatch<SetStateAction<number>> };

const TrackContext = createContext<TrackState | null>(null);

// One selected track shared by the Tracks terminal and the problem statement board, so picking
// a track in either section moves the other one with it.
export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState(0);
  return <TrackContext.Provider value={{ track, setTrack }}>{children}</TrackContext.Provider>;
}

// falls back to local state, so either component still works on its own
export function useTrack(): TrackState {
  const shared = useContext(TrackContext);
  const [track, setTrack] = useState(0);
  return shared ?? { track, setTrack };
}
