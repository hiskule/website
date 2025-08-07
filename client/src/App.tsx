import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Event from './pages/Events'
import Team from './pages/Team'
import ScrollToTop from './components/ScrollTop'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <>

      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Router>
    </>
    
  )
}

export default App