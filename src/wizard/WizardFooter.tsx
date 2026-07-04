// Prev / Next navigation bar for the wizard; shows a loading spinner while the next step is being submitted.
interface WizardFooterProps {
  isFirst: boolean
  isLast: boolean
  loading?: boolean
  onBack: () => void
  onNext: () => void
  fullWidth?: boolean
}

export function WizardFooter({ isFirst, isLast, loading, onBack, onNext, fullWidth }: WizardFooterProps) {
  return (
    <div className="wnav" style={fullWidth ? { maxWidth: 'none' } : undefined}>
      <button className="btn btn-ghost" disabled={isFirst} onClick={onBack}>مرحله قبل</button>
      <span className="spacer" />
      <button className="btn btn-primary" onClick={onNext} disabled={loading}>
        {loading
          ? <><span className="spin" />در حال پردازش…</>
          : isLast ? 'ثبت استعلام' : 'مرحله بعد'}
      </button>
    </div>
  )
}
