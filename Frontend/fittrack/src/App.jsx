import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Payments from './pages/Payments'
import ChangeBatch from './pages/ChangeBatch'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/change-batch" element={<ChangeBatch />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  main: {
    flex: 1,
    width: '100%'
  }
}

export default App
