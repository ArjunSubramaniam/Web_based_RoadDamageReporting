import { Modal } from './Modal.jsx'

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', tone = 'navy', onConfirm, onClose, busy }) {
  const buttonClass =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-navy-700 hover:bg-navy-800'

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`inline-flex h-11 items-center justify-center rounded-xl px-4 font-semibold text-white disabled:opacity-60 ${buttonClass}`}
          >
            {busy ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-6 text-slate-600">{message}</p>
    </Modal>
  )
}
