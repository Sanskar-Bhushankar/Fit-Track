import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>FitTrack</Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/register" style={styles.link}>Register for Batch</Link>
          <Link to="/change-batch" style={styles.link}>Change Batch</Link>
          <Link to="/payments" style={styles.link}>Payment Status</Link>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#1a237e',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  links: {
    display: 'flex',
    gap: '2rem'
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  }
}

export default Navbar 