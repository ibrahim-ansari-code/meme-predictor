const LeaderboardPage = () => {
  // Generate grid items starting from #4
  const gridItems = Array.from({ length: 15 }, (_, i) => i + 4)

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)'
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto" style={{
          background: 'linear-gradient(to bottom, #ff00ff 0%, #8000ff 25%, #0080ff 50%, #00ff00 100%)',
          padding: '40px'
        }}>
          {/* Header with RedWhiteDivider */}
          <div className="text-center mb-8">
            <div className="bg-yellow-400 border-4 border-black p-6 mb-4 inline-block">
              <h1 className="text-5xl font-bold text-black">LEADERBOARD</h1>
            </div>
            <img 
              src="/RedWhiteDivider.jpg" 
              alt="divider" 
              className="mx-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          {/* Podium Section */}
          <div className="mb-12">
            <div className="flex items-end justify-center gap-6" style={{ flexWrap: 'nowrap' }}>
              {/* #2 - Left */}
              <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                <h2 className="text-4xl font-bold text-black mb-4">#2</h2>
                <img 
                  src="/BlueWhiteDividier.jpg" 
                  alt="divider" 
                  className="mb-4"
                  style={{ width: '280px', height: 'auto' }}
                />
                <div 
                  style={{
                    width: '280px',
                    height: '300px',
                    background: '#ff8c00',
                    border: '6px solid #000080',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">IMAGE PLACEHOLDER</span>
                  </div>
                </div>
              </div>

              {/* #1 - Center (Taller) */}
              <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                <h2 className="text-4xl font-bold text-black mb-4">#1</h2>
                <img 
                  src="/BlueWhiteDividier.jpg" 
                  alt="divider" 
                  className="mb-4"
                  style={{ width: '320px', height: 'auto' }}
                />
                <div 
                  style={{
                    width: '320px',
                    height: '350px',
                    background: '#ff8c00',
                    border: '6px solid #000080',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">IMAGE PLACEHOLDER</span>
                  </div>
                </div>
              </div>

              {/* #3 - Right */}
              <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                <h2 className="text-4xl font-bold text-black mb-4">#3</h2>
                <img 
                  src="/BlueWhiteDividier.jpg" 
                  alt="divider" 
                  className="mb-4"
                  style={{ width: '280px', height: 'auto' }}
                />
                <div 
                  style={{
                    width: '280px',
                    height: '300px',
                    background: '#ff8c00',
                    border: '6px solid #000080',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">IMAGE PLACEHOLDER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gridItems.map((rank) => (
              <div key={rank} className="flex flex-col items-center">
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '220px',
                    height: '200px',
                    background: '#ff8c00',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '8px'
                  }}
                >
                  <div className="text-black font-bold text-lg mb-2" style={{ fontFamily: 'Comic Sans MS' }}>
                    #{rank}
                  </div>
                  <div className="bg-gray-200 w-full flex-1 flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">IMAGE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage

