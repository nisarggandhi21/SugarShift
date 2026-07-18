const TONE_CLASSES = {
  default: 'bg-ink text-cream',
  success: 'bg-status-good text-white',
  error: 'bg-status-critical text-white',
}

function Toast({ message, tone = 'default' }) {
  if (!message) return null
  return (
    <div
      className={`animate-toast-in fixed bottom-7 left-1/2 z-[100] -translate-x-1/2 rounded-full border-2 border-line px-[22px] py-3 text-[13.5px] font-bold shadow-hard ${TONE_CLASSES[tone]}`}
    >
      {message}
    </div>
  )
}

export default Toast
