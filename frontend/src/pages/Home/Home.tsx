import React from 'react'
import "./Home.css"
import Hero from './components/hero'
import About from './components/about'
import EventCard from './components/eventCard'

const Home: React.FC = () => {
  return (
    <div className="home-page-container">
      <Hero />
      <About />
      <EventCard />
    </div>
  )
}

export default Home
