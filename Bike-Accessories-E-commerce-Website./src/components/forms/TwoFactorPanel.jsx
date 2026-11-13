import { useState } from 'react'
import { ShieldCheck, ShieldOff, Copy, KeyRound, Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'
import FormField from './FormField'
import LoadingButton from './LoadingButton'
import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

/**
 * Two-factor authentication (authenticator app) setup / removal.
 * `mandatory` hides the disable option (admins must keep it on).
 */
export default function TwoFactorPanel({ mandatory = false }) {
  const { user, refreshUser, adoptSession } = useAuth()
  const [step, setStep] = useState('idle') // idle | password | scan | codes | disable
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [setup, setSetup] = useState(null)
  const [codes, setCodes] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn) => {
    setBusy(true); setError('')
    try { await fn() } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const reset = () => { setStep('idle'); setPassword(''); setCode(''); setSetup(null); setError('') }

  const start = (e) => { e.preventDefault(); run(async () => { setSetup(await authService.setup2fa(password)); setPassword(''); setStep('scan') }) }
  const enable = (e) => { e.preventDefault(); run(async () => { const r = await authService.enable2fa(code); setCodes(r.recoveryCodes); setCode(''); setStep('codes') /* the profile refreshes only after the codes are saved, so a forced-enrolment screen cannot disappear first */ }) }
  const disable = (e) => { e.preventDefault(); run(async () => { const r = await authService.disable2fa(password, code); adoptSession(r); toast.success('Two-factor authentication turned off'); reset() }) }
  const copy = (text) => navigator.clipboard?.writeText(text).then(() => toast.success('Copied'), () => {})

  return (
    <div className="rounded-2xl border border-line bg-ink-800 p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${user.twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{user.twoFactorEnabled ? <ShieldCheck size={22} /> : <ShieldOff size={22} />}</span>
        <div>
          <h2 className="text-lg font-bold">Two-factor authentication {user.twoFactorEnabled ? <span className="ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 align-middle text-xs text-emerald-300">On</span> : <span className="ml-1 rounded-full bg-amber-500/15 px-2 py-0.5 align-middle text-xs text-amber-300">Off</span>}</h2>
          <p className="text-sm text-muted">Adds a 6-digit code from an authenticator app (Google Authenticator, Authy, 1Password…) to your password, so a stolen password alone is useless.{mandatory && ' Required for admin accounts.'}</p>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-brand/40 bg-brand-soft p-3 text-sm text-brand-light">{error}</p>}

      {step === 'idle' && !user.twoFactorEnabled && <button onClick={() => setStep('password')} className="btn-primary"><KeyRound size={16} /> Set up two-factor authentication</button>}
      {step === 'idle' && user.twoFactorEnabled && !mandatory && <button onClick={() => setStep('disable')} className="btn-ghost">Turn off…</button>}
      {step === 'idle' && user.twoFactorEnabled && mandatory && <p className="text-sm text-emerald-300">Your account is protected. This cannot be turned off for admins.</p>}

      {step === 'password' && (
        <form onSubmit={start} className="space-y-4" noValidate>
          <FormField label="Confirm your password to continue" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-2"><LoadingButton type="submit" loading={busy} className="btn-primary">Continue</LoadingButton><button type="button" onClick={reset} className="btn-ghost">Cancel</button></div>
        </form>
      )}

      {step === 'scan' && setup && (
        <form onSubmit={enable} className="space-y-4" noValidate>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-white/85">
            <li>Open your authenticator app and add an account <b>manually</b> (or tap the link below on your phone).</li>
            <li>
              Enter this key: <span className="mt-1 flex flex-wrap items-center gap-2"><code className="select-all rounded bg-ink px-3 py-1.5 font-mono tracking-widest text-brand-light">{setup.secret.match(/.{1,4}/g).join(' ')}</code><button type="button" onClick={() => copy(setup.secret)} className="btn-ghost px-3 py-1.5 text-xs"><Copy size={13} /> Copy</button></span>
              {setup.otpauthUrl.startsWith('otpauth://') && <a href={setup.otpauthUrl} className="mt-2 inline-flex items-center gap-1.5 text-brand underline"><Smartphone size={14} /> Open in authenticator app</a>}
            </li>
            <li>Type the 6-digit code the app shows:</li>
          </ol>
          <FormField label="6-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
          <div className="flex gap-2"><LoadingButton type="submit" loading={busy} className="btn-primary">Turn on</LoadingButton><button type="button" onClick={reset} className="btn-ghost">Cancel</button></div>
        </form>
      )}

      {step === 'codes' && (
        <div className="space-y-4">
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100"><b>Save these recovery codes now.</b> Each works once if you lose your phone. They will not be shown again.</p>
          <ul className="grid grid-cols-2 gap-2 font-mono text-sm">{codes.map((c) => <li key={c} className="select-all rounded bg-ink px-3 py-2 text-center">{c}</li>)}</ul>
          <div className="flex gap-2"><button onClick={() => copy(codes.join('\n'))} className="btn-ghost"><Copy size={15} /> Copy all</button><button onClick={async () => { await refreshUser(); reset() }} className="btn-primary">I have saved them</button></div>
        </div>
      )}

      {step === 'disable' && (
        <form onSubmit={disable} className="space-y-4" noValidate>
          <FormField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <FormField label="Authenticator code or recovery code" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
          <div className="flex gap-2"><LoadingButton type="submit" loading={busy} className="btn-primary">Turn off</LoadingButton><button type="button" onClick={reset} className="btn-ghost">Cancel</button></div>
        </form>
      )}
    </div>
  )
}
