import { useState } from 'react'

interface WelcomePopupProps {
  onClose: () => void
}

const WelcomePopup = ({ onClose }: WelcomePopupProps) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.8)'
      }}
      onClick={handleClose}
    >
      <div 
        className="relative p-8 text-center"
        style={{
          background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)',
          border: '8px dotted white',
          maxWidth: '90%',
          maxHeight: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold text-black mb-4"
          style={{ fontFamily: 'Comic Sans MS' }}
        >
          TAP ON WHO YOUR LETTING HIT / TAKE YOUR BUTT
        </h1>
        <button
          onClick={handleClose}
          className="mt-6 px-8 py-4 text-2xl font-bold text-black underline"
          style={{
            fontFamily: 'Comic Sans MS',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'yellow'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          START
        </button>
      </div>
    </div>
  )
}

export default WelcomePopup

