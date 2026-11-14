import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'

const finePointer = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches

/** Sets a <select>'s value the way React and react-hook-form expect, so their onChange handlers run. */
function choose(select, value) {
  Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, value)
  select.dispatchEvent(new Event('input', { bubbles: true }))
  select.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Replaces the browser's plain dropdown popup with a styled list for EVERY <select> on the site.
 * The real <select> stays in the page (forms, validation and screen readers keep working); only the popup is ours.
 * Touch devices keep their native picker.
 */
export default function SelectEnhancer() {
  const [open, setOpen] = useState(null) // { el, rect }
  const [active, setActiveState] = useState(0)
  const activeRef = useRef(0)
  const setActive = useCallback((n) => { const v = typeof n === 'function' ? n(activeRef.current) : n; activeRef.current = v; setActiveState(v) }, [])
  const popup = useRef(null)
  const typed = useRef({ text: '', t: 0 })

  const items = useMemo(() => (open ? [...open.el.options].map((o, i) => ({ i, value: o.value, label: o.textContent, disabled: o.disabled })) : []), [open])
  const close = useCallback((refocus = true) => { setOpen((o) => { if (o && refocus) o.el.focus({ preventScroll: true }); o?.el.removeAttribute('aria-expanded'); return null }) }, [])

  const show = useCallback((el) => {
    if (el.disabled || el.multiple || el.size > 1 || el.dataset.native !== undefined || !finePointer()) return false
    el.focus({ preventScroll: true })
    el.setAttribute('aria-expanded', 'true')
    setActive(Math.max(0, el.selectedIndex))
    setOpen({ el, rect: el.getBoundingClientRect() })
    return true
  }, [setActive])

  // Open on mouse press and on Space / Enter / Alt+Down for a focused select.
  useEffect(() => {
    const onDown = (e) => {
      const el = e.target.closest?.('select')
      if (!el || e.button !== 0) return
      if (el.disabled || el.multiple || el.size > 1 || el.dataset.native !== undefined || !finePointer()) return
      e.preventDefault() // blocks the native popup
      open?.el === el ? close() : show(el)
    }
    const onKey = (e) => {
      const el = document.activeElement
      if (open || !(el instanceof HTMLSelectElement)) return
      if (e.key === ' ' || e.key === 'Enter' || (e.key === 'ArrowDown' && e.altKey)) { if (show(el)) e.preventDefault() }
    }
    document.addEventListener('mousedown', onDown, true)
    document.addEventListener('keydown', onKey, true)
    return () => { document.removeEventListener('mousedown', onDown, true); document.removeEventListener('keydown', onKey, true) }
  }, [open, show, close])

  // While open: keyboard control, close on outside click / resize / scroll elsewhere.
  useEffect(() => {
    if (!open) return
    const move = (d) => setActive((a) => { let n = a; for (let k = 0; k < items.length; k++) { n = (n + d + items.length) % items.length; if (!items[n].disabled) return n } return a })
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
      else if (e.key === 'Home') { e.preventDefault(); setActive(items.findIndex((x) => !x.disabled)) }
      else if (e.key === 'End') { e.preventDefault(); setActive(items.length - 1 - [...items].reverse().findIndex((x) => !x.disabled)) }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const it = items[activeRef.current]; if (it && !it.disabled) choose(open.el, it.value); close() }
      else if (e.key === 'Tab') close(false)
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { // type to jump
        const now = Date.now(); typed.current = { text: (now - typed.current.t < 700 ? typed.current.text : '') + e.key.toLowerCase(), t: now }
        const hit = items.findIndex((x) => !x.disabled && x.label.trim().toLowerCase().startsWith(typed.current.text)); if (hit >= 0) setActive(hit)
      }
    }
    const onOutside = (e) => { if (!popup.current?.contains(e.target) && e.target !== open.el) close(false) }
    const onScroll = (e) => { if (!popup.current?.contains(e.target)) close(false) }
    window.addEventListener('keydown', onKey, true)
    document.addEventListener('mousedown', onOutside)
    window.addEventListener('resize', onScroll)
    window.addEventListener('scroll', onScroll, true)
    return () => { window.removeEventListener('keydown', onKey, true); document.removeEventListener('mousedown', onOutside); window.removeEventListener('resize', onScroll); window.removeEventListener('scroll', onScroll, true) }
  }, [open, items, close, setActive])

  // Place the list under the select (or above it when there is no room) and keep the active row in view.
  const [pos, setPos] = useState(null)
  useLayoutEffect(() => {
    if (!open) { setPos(null); return }
    const r = open.el.getBoundingClientRect()
    const h = Math.min(items.length * 38 + 12, 288)
    const below = window.innerHeight - r.bottom
    const up = below < h + 12 && r.top > below
    setPos({ left: Math.max(8, Math.min(r.left, window.innerWidth - Math.max(r.width, 160) - 8)), width: Math.max(r.width, 160), top: up ? undefined : r.bottom + 6, bottom: up ? window.innerHeight - r.top + 6 : undefined, maxHeight: Math.max(120, Math.min(288, (up ? r.top : below) - 16)) })
  }, [open, items.length])
  useEffect(() => { popup.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }) }, [active, pos])

  if (!open || !pos) return null
  const selected = open.el.selectedIndex
  return createPortal(
    <ul ref={popup} role="listbox" aria-label={open.el.getAttribute('aria-label') || 'Options'} onMouseDown={(e) => e.preventDefault()}
      className="fixed z-[200] overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-lift ring-1 ring-black/5"
      style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}>
      {items.map((it, k) => (
        <li key={it.i} role="option" aria-selected={it.i === selected} aria-disabled={it.disabled} data-active={k === active}
          onMouseEnter={() => !it.disabled && setActive(k)}
          onClick={() => { if (it.disabled) return; choose(open.el, it.value); close() }}
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${it.disabled ? 'cursor-not-allowed text-slate-400' : k === active ? 'bg-primary-50 text-primary' : 'text-ink'} ${it.i === selected ? 'font-medium' : ''}`}>
          <span className="min-w-0 truncate">{it.label || ' '}</span>
          {it.i === selected && <Check size={15} className="shrink-0 text-accent" aria-hidden />}
        </li>
      ))}
    </ul>,
    document.body,
  )
}
