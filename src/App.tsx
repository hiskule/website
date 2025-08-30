import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Event from './pages/Events/Events'
import Team from './pages/Team'
import Mentor from './pages/Mentor'
import Contact from './pages/Contact'
import ScrollToTop from './components/ScrollTop'
import Footer from './components/footer/footer'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (


      <Router>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/team" element={<Team />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer/>

      </Router>

    
  )
}

export default App