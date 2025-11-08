import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    if (!showBubble) return

    const handleScroll = () => {
      setShowBubble(false)
    }

    const handleClick = () => {
      setShowBubble(false)
    }

    window.addEventListener('scroll', handleScroll, true)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('click', handleClick, true)
    }
  }, [showBubble])

  return (
    <nav className="bg-black border-b-4 border-dotted border-white p-2 sm:p-4">
      <div className="flex items-center justify-center gap-2 sm:gap-8 flex-wrap">
        <Link 
          to="/" 
          className="text-yellow-400 text-lg sm:text-2xl font-bold underline hover:text-yellow-300 px-3 py-2 sm:px-0 sm:py-0"
          style={{ textShadow: '2px 2px 0px #000', fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
        >
          VOTING
        </Link>
        <Link 
          to="/leaderboard" 
          className="text-yellow-400 text-lg sm:text-2xl font-bold underline hover:text-yellow-300 px-3 py-2 sm:px-0 sm:py-0"
          style={{ textShadow: '2px 2px 0px #000', fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
        >
          LEADERBOARD
        </Link>
        <div className="relative">
          <Link 
            to="/upload" 
            className="text-yellow-400 text-lg sm:text-2xl font-bold underline hover:text-yellow-300 px-3 py-2 sm:px-0 sm:py-0"
            style={{ textShadow: '2px 2px 0px #000', fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
          >
            UPLOAD
          </Link>
          {showBubble && (
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
              style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', sans-serif" }}
            >
              {/* Speech bubble */}
              <div 
                className="bg-white border-4 border-black px-3 py-2 rounded-lg relative"
                style={{
                  boxShadow: '4px 4px 0px #000',
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="text-black font-bold text-sm sm:text-base">CLICK ME!</span>
                {/* Tail pointing up */}
                <div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '12px solid black'
                  }}
                />
                <div 
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid white'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

