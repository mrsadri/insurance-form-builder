import { fa } from '../i18n/fa'

interface StepperProps {
  steps: { title: string }[]
  current: number
  onStepClick?: (i: number) => void
  fullWidth?: boolean
}

export function Stepper({ steps, current, onStepClick, fullWidth }: StepperProps) {
  return (
    <div className="stepper" style={fullWidth ? { maxWidth: 'none' } : undefined}>
      {steps.map((st, i) => {
        const done = i < current
        const cur = i === current
        return (
          <div
            key={i}
            className={`stp${done ? ' done' : cur ? ' cur' : ''}`}
            onClick={() => onStepClick?.(i)}
          >
            <div className="bar" />
            <div className="bub">{done ? '✓' : fa(i + 1)}</div>
            <div className="lbl">{st.title}</div>
          </div>
        )
      })}
    </div>
  )
}
