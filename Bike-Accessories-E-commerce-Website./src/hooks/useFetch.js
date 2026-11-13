import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Run an async service call with loading / error / data state.
 *   const { data, loading, error, reload } = useFetch(() => productService.list(params), [params])
 */
export default function useFetch(fn, deps = [], { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null })
  const fnRef = useRef(fn)
  fnRef.current = fn
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fnRef.current()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick, enabled])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
