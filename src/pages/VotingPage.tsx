import { useState, useEffect } from 'react'
import { type Character } from '../lib/supabase'
import { getRandomMatchup, processVote } from '../lib/voting'

const VotingPage = () => {
  const [characterA, setCharacterA] = useState<Character | null>(null)
  const [characterB, setCharacterB] = useState<Character | null>(null)
  const [loading, setLoading] = useState(false)
  const [eloChanges, setEloChanges] = useState<{
    characterA: { name: string; change: number; newElo: number }
    characterB: { name: string; change: number; newElo: number }
  } | null>(null)

  // Load initial matchup
  useEffect(() => {
    loadMatchup()
  }, [])

  const loadMatchup = async () => {
    setLoading(true)
    try {
      const matchup = await getRandomMatchup()
      if (matchup) {
        setCharacterA(matchup[0])
        setCharacterB(matchup[1])
      }
    } catch (error) {
      console.error('Error loading matchup:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (winnerId: string) => {
    if (!characterA || !characterB) return

    setLoading(true)
    try {
      const result = await processVote(characterA.id, characterB.id, winnerId)
      
      // Show ELO changes below
      setEloChanges({
        characterA: {
          name: result.characterA.name,
          change: result.eloChanges.characterA.change,
          newElo: result.characterA.elo_rating
        },
        characterB: {
          name: result.characterB.name,
          change: result.eloChanges.characterB.change,
          newElo: result.characterB.elo_rating
        }
      })

      // Update local state with new ELO ratings
      setCharacterA(result.characterA)
      setCharacterB(result.characterB)

      // Load new matchup after 3 seconds
      setTimeout(() => {
        setEloChanges(null)
        loadMatchup()
      }, 3000)
    } catch (error) {
      console.error('Error processing vote:', error)
      alert('Error processing vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setEloChanges(null)
    loadMatchup()
  }

  const handleDraw = async () => {
    if (!characterA || !characterB) return

    setLoading(true)
    try {
      const result = await processVote(characterA.id, characterB.id, null) // null = draw
      
      // Show ELO changes below
      setEloChanges({
        characterA: {
          name: result.characterA.name,
          change: result.eloChanges.characterA.change,
          newElo: result.characterA.elo_rating
        },
        characterB: {
          name: result.characterB.name,
          change: result.eloChanges.characterB.change,
          newElo: result.characterB.elo_rating
        }
      })

      // Update local state
      setCharacterA(result.characterA)
      setCharacterB(result.characterB)

      // Load new matchup after 3 seconds
      setTimeout(() => {
        setEloChanges(null)
        loadMatchup()
      }, 3000)
    } catch (error) {
      console.error('Error processing draw:', error)
      alert('Error processing draw. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)'
    }}>
      {/* Main content area with dotted borders */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto" style={{
          border: '8px dotted white',
          background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)',
          padding: '40px'
        }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              <span className="text-5xl font-bold text-black" style={{ fontFamily: 'Comic Sans MS' }}>
                OR
              </span>
            </div>
          </div>

          {/* Two voting cards side by side */}
          <div className="flex justify-center gap-8 mb-8 flex-wrap">
            {/* Card 1 */}
            <div 
              className="relative cursor-pointer"
              onClick={() => characterA && !loading && handleVote(characterA.id)}
              style={{
                border: '4px dotted white',
                background: loading ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                padding: '20px',
                minWidth: '300px',
                maxWidth: '400px',
                opacity: loading ? 0.6 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-black mb-4">
                  {characterA ? characterA.name.toUpperCase() : 'LOADING...'}
                </h2>
                <div className="bg-gray-200 h-64 flex items-center justify-center mb-4 overflow-hidden">
                  {loading ? (
                    <span className="text-gray-600 text-xl font-bold">LOADING...</span>
                  ) : characterA && characterA.image_url ? (
                    <img 
                      src={characterA.image_url} 
                      alt={characterA.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xl font-bold">IMAGE PLACEHOLDER</span>
                  )}
                </div>
                <p className="text-black font-bold text-lg">CLICK TO VOTE</p>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="relative cursor-pointer"
              onClick={() => characterB && !loading && handleVote(characterB.id)}
              style={{
                border: '4px dotted white',
                background: loading ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                padding: '20px',
                minWidth: '300px',
                maxWidth: '400px',
                opacity: loading ? 0.6 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-black mb-4">
                  {characterB ? characterB.name.toUpperCase() : 'LOADING...'}
                </h2>
                <div className="bg-gray-200 h-64 flex items-center justify-center mb-4 overflow-hidden">
                  {loading ? (
                    <span className="text-gray-600 text-xl font-bold">LOADING...</span>
                  ) : characterB && characterB.image_url ? (
                    <img 
                      src={characterB.image_url} 
                      alt={characterB.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xl font-bold">IMAGE PLACEHOLDER</span>
                  )}
                </div>
                <p className="text-black font-bold text-lg">CLICK TO VOTE</p>
              </div>
            </div>
          </div>

          {/* ELO Changes Display */}
          {eloChanges && (
            <div className="mb-8 text-center">
              <div className="inline-block bg-yellow-400 p-6 border-4 border-black">
                <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Comic Sans MS' }}>
                  ELO CHANGES
                </h3>
                <div className="flex justify-center gap-8 flex-wrap">
                  <div>
                    <p className="text-xl font-bold text-black">{eloChanges.characterA.name.toUpperCase()}</p>
                    <p className="text-3xl font-bold text-black">
                      {eloChanges.characterA.change > 0 ? '+' : ''}{eloChanges.characterA.change.toFixed(2)}
                    </p>
                    <p className="text-sm text-black">New ELO: {eloChanges.characterA.newElo.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">{eloChanges.characterB.name.toUpperCase()}</p>
                    <p className="text-3xl font-bold text-black">
                      {eloChanges.characterB.change > 0 ? '+' : ''}{eloChanges.characterB.change.toFixed(2)}
                    </p>
                    <p className="text-sm text-black">New ELO: {eloChanges.characterB.newElo.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skip and Draw buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="px-8 py-4 text-xl cursor-pointer transition-colors"
              style={{
                fontFamily: 'Comic Sans MS',
                fontWeight: 'bold',
                color: '#000',
                background: 'transparent',
                border: 'none',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'yellow'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="underline">SKIP</span>
            </button>
            <button
              onClick={handleDraw}
              disabled={loading || !characterA || !characterB}
              className="px-8 py-4 text-xl cursor-pointer transition-colors"
              style={{
                fontFamily: 'Comic Sans MS',
                fontWeight: 'bold',
                color: '#000',
                background: 'transparent',
                border: 'none',
                opacity: loading || !characterA || !characterB ? 0.5 : 1,
                cursor: loading || !characterA || !characterB ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading && characterA && characterB) {
                  e.currentTarget.style.background = 'yellow'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="underline">DRAW/TIE</span>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-green-400 p-4 border-4 border-black">
              <p className="text-black font-bold">
                <span className="text-2xl">⭐</span> WHO ARE YOU LETTING HIT? <span className="text-2xl">⭐</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotingPage

