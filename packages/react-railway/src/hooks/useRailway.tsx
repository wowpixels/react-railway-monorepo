import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "react";

type RailwayId = string;

type State = {
  runningId: RailwayId | null;
  isCompletedSet: Set<RailwayId>;
  isViewedSet: Set<RailwayId>;
  railwayOrder: RailwayId[];
  registered: Set<RailwayId>;
};

type Action =
  | { type: "REGISTER"; id: RailwayId }
  | { type: "UNREGISTER"; id: RailwayId }
  | { type: "SET_RUNNING"; id: RailwayId | null }
  | { type: "SET_COMPLETED"; id: RailwayId; value: boolean }
  | { type: "SET_VIEWED"; id: RailwayId; value: boolean }
  | { type: "SET_ORDER"; ids: RailwayId[] };

const storageKey = (id: RailwayId, what: "completed" | "viewed") =>
  `railway:${id}:${what}`;

// SSR-safe read/write
const safeReadBool = (key: string) => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};
const safeWriteBool = (key: string, val: boolean) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(val));
  } catch {}
};

const initialState: State = {
  runningId: null,
  isCompletedSet: new Set<RailwayId>(),
  isViewedSet: new Set<RailwayId>(),
  railwayOrder: [],
  registered: new Set<RailwayId>(),
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "REGISTER": {
      if (state.registered.has(action.id)) return state;
      const nextRegistered = new Set(state.registered).add(action.id);

      // Pull persisted flags for this id the first time we see it
      const completed = safeReadBool(storageKey(action.id, "completed"));
      const viewed = safeReadBool(storageKey(action.id, "viewed"));

      const nextCompleted = new Set(state.isCompletedSet);
      const nextViewed = new Set(state.isViewedSet);
      if (completed) nextCompleted.add(action.id);
      if (viewed) nextViewed.add(action.id);

      const nextOrder = state.railwayOrder.includes(action.id)
        ? state.railwayOrder
        : [...state.railwayOrder, action.id];

      return {
        ...state,
        registered: nextRegistered,
        isCompletedSet: nextCompleted,
        isViewedSet: nextViewed,
        railwayOrder: nextOrder,
      };
    }
    case "UNREGISTER": {
      const nextRegistered = new Set(state.registered);
      nextRegistered.delete(action.id);

      const nextOrder = state.railwayOrder.filter((x) => x !== action.id);
      const runningId = state.runningId === action.id ? null : state.runningId;

      return {
        ...state,
        registered: nextRegistered,
        railwayOrder: nextOrder,
        runningId,
      };
    }
    case "SET_RUNNING":
      return { ...state, runningId: action.id };
    case "SET_COMPLETED": {
      const next = new Set(state.isCompletedSet);
      if (action.value) next.add(action.id);
      else next.delete(action.id);
      return { ...state, isCompletedSet: next };
    }
    case "SET_VIEWED": {
      const next = new Set(state.isViewedSet);
      if (action.value) next.add(action.id);
      else next.delete(action.id);
      return { ...state, isViewedSet: next };
    }
    case "SET_ORDER":
      // Keep only registered ids & preserve uniqueness
      return { ...state, railwayOrder: Array.from(new Set(action.ids)) };
    default:
      return state;
  }
}

type Ctx = {
  // state
  runningId: RailwayId | null;
  isRunning: boolean;
  isCompleted: RailwayId[];
  isViewed: RailwayId[];
  railwayOrder: RailwayId[];

  // actions
  registerRailway: (id: RailwayId) => void;
  unregisterRailway: (id: RailwayId) => void;
  startEngine: (id: RailwayId) => void;
  stopEngine: (id: RailwayId) => void;
  setCompleted: (id: RailwayId, value?: boolean) => void;
  setViewed: (id: RailwayId, value?: boolean) => void;
  setRailwayOrder: (ids: RailwayId[]) => void;
};

const RailwayContext = createContext<Ctx | null>(null);

export function RailwayProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const registerRailway = useCallback((id: RailwayId) => {
    dispatch({ type: "REGISTER", id });
  }, []);

  const unregisterRailway = useCallback((id: RailwayId) => {
    dispatch({ type: "UNREGISTER", id });
  }, []);

  const startEngine = useCallback((id: RailwayId) => {
    // Enforce single runner
    dispatch({ type: "SET_RUNNING", id });
  }, []);

  const stopEngine = useCallback(
    (id: RailwayId) => {
      // Only stop if this id is the runner
      // (no-op if a different one has preempted)
      if (state.runningId === id) {
        dispatch({ type: "SET_RUNNING", id: null });
      }
    },
    [state.runningId]
  );

  const setCompleted = useCallback((id: RailwayId, value = true) => {
    safeWriteBool(storageKey(id, "completed"), value);
    dispatch({ type: "SET_COMPLETED", id, value });
  }, []);

  const setViewed = useCallback((id: RailwayId, value = true) => {
    safeWriteBool(storageKey(id, "viewed"), value);
    dispatch({ type: "SET_VIEWED", id, value });
  }, []);

  const setRailwayOrder = useCallback((ids: RailwayId[]) => {
    dispatch({ type: "SET_ORDER", ids });
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      runningId: state.runningId,
      isRunning: state.runningId !== null,
      isCompleted: Array.from(state.isCompletedSet),
      isViewed: Array.from(state.isViewedSet),
      railwayOrder: state.railwayOrder,

      registerRailway,
      unregisterRailway,
      startEngine,
      stopEngine,
      setCompleted,
      setViewed,
      setRailwayOrder,
    }),
    [
      state.runningId,
      state.isCompletedSet,
      state.isViewedSet,
      state.railwayOrder,
      registerRailway,
      unregisterRailway,
      startEngine,
      stopEngine,
      setCompleted,
      setViewed,
      setRailwayOrder,
    ]
  );

  return (
    <RailwayContext.Provider value={ctx}>{children}</RailwayContext.Provider>
  );
}

export function useRailway(): Ctx {
  const ctx = useContext(RailwayContext);
  if (!ctx) {
    throw new Error("useRailway must be used inside <RailwayProvider>");
  }
  return ctx;
}

/**
 * Convenience hook for components with a fixed id.
 * Auto-registers on mount and unregister on unmount.
 */
export function useRegisterRailway(id: RailwayId) {
  const { registerRailway, unregisterRailway } = useRailway();
  useEffect(() => {
    registerRailway(id);
    return () => unregisterRailway(id);
  }, [id, registerRailway, unregisterRailway]);
}
