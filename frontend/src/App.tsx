import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Event from './pages/Events/Events'
import Team from './pages/Team/Team'
import Mentor from './pages/Mentor/Mentor'
import Contact from './pages/Contact/Contact'
import JudgeScoring from './pages/Judging/JudgeScoring'
import ScrollToTop from './components/ScrollTop'
import Nav from './components/nav/nav'
import Footer from './components/footer/footer'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event" element={<Event />} />
        <Route path="/team" element={<Team />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/judge" element={<JudgeScoring />} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App