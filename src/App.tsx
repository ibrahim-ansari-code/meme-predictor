import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import WelcomePopup from './components/WelcomePopup'
import VotingPage from './pages/VotingPage'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <Router>
      <div className="min-h-screen">
        {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
        <Navbar />
        <Routes>
          <Route path="/" element={<VotingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
        <Analytics />
      </div>
    </Router>
  )
}

export default App

