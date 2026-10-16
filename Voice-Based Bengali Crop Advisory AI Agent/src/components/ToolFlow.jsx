export default function ToolFlow({ steps }) {
  return (
    <ol className="steps">
      {steps.map((s) => (
        <li key={s.id} className={`step ${s.status}`}>
          <span className="step-mark">
            {s.status === 'done' ? '✓' : s.status === 'running' ? '…' : '○'}
          </span>
          {s.label}
        </li>
      ))}
    </ol>
  )
}
