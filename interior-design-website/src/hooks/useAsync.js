import { useCallback, useEffect, useRef, useState } from 'react';

/** Runs an async loader on mount / when deps change and exposes { data, loading, error, reload, setData }. */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const alive = useRef(true);
  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return loader()
      .then((data) => alive.current && setState({ data, loading: false, error: null }))
      .catch((error) => alive.current && setState({ data: null, loading: false, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { alive.current = true; run(); return () => { alive.current = false; }; }, [run]);
  const setData = (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater }));
  return { ...state, reload: run, setData };
}
