import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

interface TextModalProps {
  open: boolean
  title: string
  initial: string
  onOk: (value: string) => void
  onClose: () => void
}

export function TextModal({ open, title, initial, onOk, onClose }: TextModalProps) {
  const [val, setVal] = useState(initial)

  const handleOk = () => {
    onOk(val.trim() || initial)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fb-pop-overlay">
          <Dialog.Content className="fb-card" aria-describedby={undefined}>
            <Dialog.Title asChild><h4>{title}</h4></Dialog.Title>
            <div className="fb-row">
              <label>عنوان</label>
              <input
                type="text"
                value={val}
                autoFocus
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleOk() }}
              />
            </div>
            <div className="fb-actions">
              <button className="btn btn-ghost" onClick={onClose}>انصراف</button>
              <button className="btn btn-primary" onClick={handleOk}>تأیید</button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
