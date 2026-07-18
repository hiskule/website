import React from 'react'
import "./Home.css"
import Hero from '../../components/home_page/hero/hero'
import About from '../../components/home_page/about/about'
import EventCard from '../../components/home_page/eventCard/eventCard'

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
