import { Outlet } from 'react-router-dom'
import Footer from '../../components/footer/footer'
import Nav from '../../components/nav/nav'
import ScrollToTop from '../../components/ScrollTop'

export function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
