import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-black border-b-4 border-dotted border-white p-4">
      <div className="flex items-center justify-center gap-8">
        <Link 
          to="/" 
          className="text-yellow-400 text-2xl font-bold underline hover:text-yellow-300"
          style={{ textShadow: '2px 2px 0px #000', fontFamily: 'Comic Sans MS' }}
        >
          VOTING
        </Link>
        <Link 
          to="/leaderboard" 
          className="text-yellow-400 text-2xl font-bold underline hover:text-yellow-300"
          style={{ textShadow: '2px 2px 0px #000', fontFamily: 'Comic Sans MS' }}
        >
          LEADERBOARD
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

