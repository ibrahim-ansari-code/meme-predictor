import { useState, useEffect } from 'react'
import { type Character } from '../lib/supabase'
import { getLeaderboard } from '../lib/voting'

const LeaderboardPage = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const leaderboard = await getLeaderboard()
      setCharacters(leaderboard)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get top 3 for podium
  const topThree = characters.slice(0, 3)
  const rest = characters.slice(3)

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)'
    }}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto" style={{
          background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)',
          padding: '20px'
        }}>
          {/* Header with RedWhiteDivider */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-yellow-400 border-4 border-black p-3 sm:p-6 mb-4 inline-block">
              <h1 className="text-3xl sm:text-5xl font-bold text-black" style={{ fontFamily: 'Comic Sans MS' }}>LEADERBOARD</h1>
            </div>
            <img 
              src="/RedWhiteDivider.jpg" 
              alt="divider" 
              className="mx-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* Podium Section */}
          {loading ? (
            <div className="mb-12 text-center">
              <p className="text-2xl font-bold text-black" style={{ fontFamily: 'Comic Sans MS' }}>LOADING...</p>
            </div>
          ) : topThree.length >= 3 ? (
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6">
                {/* #2 - Left */}
                <div className="flex flex-col items-center w-full sm:w-auto" style={{ flex: '0 0 auto' }}>
                  <h2 className="text-2xl sm:text-4xl font-bold text-black mb-2 sm:mb-4" style={{ fontFamily: 'Comic Sans MS' }}>#2</h2>
                  <img 
                    src="/BlueWhiteDividier.jpg" 
                    alt="divider" 
                    className="mb-2 sm:mb-4"
                    style={{ width: '100%', maxWidth: '280px', height: 'auto' }}
                  />
                  <div 
                    className="w-full"
                    style={{
                      maxWidth: '280px',
                      height: '250px',
                      background: '#ff8c00',
                      border: '4px solid #000080',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '8px'
                    }}
                  >
                    <p className="text-black font-bold text-lg mb-2" style={{ fontFamily: 'Comic Sans MS' }}>
                      {topThree[1].name.toUpperCase()}
                    </p>
                    <p className="text-black font-bold text-xs sm:text-sm mb-2" style={{ fontFamily: 'Comic Sans MS' }}>ELO: {topThree[1].elo_rating.toFixed(2)}</p>
                    {topThree[1].image_url ? (
                      <img 
                        src={topThree[1].image_url} 
                        alt={topThree[1].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          flex: 1,
                          minHeight: 0
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-gray-200 w-full flex-1 flex items-center justify-center"
                        style={{ minHeight: 0 }}
                      >
                        <span className="text-gray-600 text-xs font-bold">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* #1 - Center (Taller) */}
                <div className="flex flex-col items-center w-full sm:w-auto order-first sm:order-none" style={{ flex: '0 0 auto' }}>
                  <h2 className="text-2xl sm:text-4xl font-bold text-black mb-2 sm:mb-4" style={{ fontFamily: 'Comic Sans MS' }}>#1</h2>
                  <img 
                    src="/BlueWhiteDividier.jpg" 
                    alt="divider" 
                    className="mb-2 sm:mb-4"
                    style={{ width: '100%', maxWidth: '320px', height: 'auto' }}
                  />
                  <div 
                    className="w-full"
                    style={{
                      maxWidth: '320px',
                      height: '280px',
                      background: '#ff8c00',
                      border: '4px solid #000080',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '8px'
                    }}
                  >
                    <p className="text-black font-bold text-xl mb-2" style={{ fontFamily: 'Comic Sans MS' }}>
                      {topThree[0].name.toUpperCase()}
                    </p>
                    <p className="text-black font-bold text-xs sm:text-sm mb-2" style={{ fontFamily: 'Comic Sans MS' }}>ELO: {topThree[0].elo_rating.toFixed(2)}</p>
                    {topThree[0].image_url ? (
                      <img 
                        src={topThree[0].image_url} 
                        alt={topThree[0].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          flex: 1,
                          minHeight: 0
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-gray-200 w-full flex-1 flex items-center justify-center"
                        style={{ minHeight: 0 }}
                      >
                        <span className="text-gray-600 text-xs font-bold">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* #3 - Right */}
                <div className="flex flex-col items-center w-full sm:w-auto" style={{ flex: '0 0 auto' }}>
                  <h2 className="text-2xl sm:text-4xl font-bold text-black mb-2 sm:mb-4" style={{ fontFamily: 'Comic Sans MS' }}>#3</h2>
                  <img 
                    src="/BlueWhiteDividier.jpg" 
                    alt="divider" 
                    className="mb-2 sm:mb-4"
                    style={{ width: '100%', maxWidth: '280px', height: 'auto' }}
                  />
                  <div 
                    className="w-full"
                    style={{
                      maxWidth: '280px',
                      height: '250px',
                      background: '#ff8c00',
                      border: '4px solid #000080',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '8px'
                    }}
                  >
                    <p className="text-black font-bold text-lg mb-2" style={{ fontFamily: 'Comic Sans MS' }}>
                      {topThree[2].name.toUpperCase()}
                    </p>
                    <p className="text-black font-bold text-xs sm:text-sm mb-2" style={{ fontFamily: 'Comic Sans MS' }}>ELO: {topThree[2].elo_rating.toFixed(2)}</p>
                    {topThree[2].image_url ? (
                      <img 
                        src={topThree[2].image_url} 
                        alt={topThree[2].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          flex: 1,
                          minHeight: 0
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-gray-200 w-full flex-1 flex items-center justify-center"
                        style={{ minHeight: 0 }}
                      >
                        <span className="text-gray-600 text-xs font-bold">NO IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12 text-center">
              <p className="text-xl font-bold text-black" style={{ fontFamily: 'Comic Sans MS' }}>Need at least 3 characters for leaderboard</p>
            </div>
          )}

          {/* Grid Section */}
          {rest.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {rest.map((character, index) => {
                const rank = index + 4 // Start from #4 (after top 3)
                return (
                  <div key={character.id} className="flex flex-col items-center">
                    <div 
                      className="w-full"
                      style={{
                        maxWidth: '220px',
                        height: '180px',
                        background: '#ff8c00',
                        border: '3px solid #000080',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: '6px'
                      }}
                    >
                      <div className="text-black font-bold text-lg mb-1" style={{ fontFamily: 'Comic Sans MS' }}>
                        #{rank}
                      </div>
                      <p className="text-black font-bold text-xs mb-1" style={{ fontFamily: 'Comic Sans MS' }}>
                        {character.name.toUpperCase()}
                      </p>
                      <p className="text-black font-bold text-xs mb-1" style={{ fontFamily: 'Comic Sans MS' }}>ELO: {character.elo_rating.toFixed(2)}</p>
                      {character.image_url ? (
                        <img 
                          src={character.image_url} 
                          alt={character.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            flex: 1,
                            minHeight: 0
                          }}
                        />
                      ) : (
                        <div 
                          className="bg-gray-200 w-full flex-1 flex items-center justify-center"
                          style={{ minHeight: 0 }}
                        >
                          <span className="text-gray-600 text-xs font-bold">NO IMAGE</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {!loading && characters.length === 0 && (
            <div className="text-center">
              <p className="text-xl font-bold text-black" style={{ fontFamily: 'Comic Sans MS' }}>No characters yet. Add some to see the leaderboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage

