import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Welcome to FitTrack</h1>
          <p style={styles.subtitle}>Your journey to fitness begins here</p>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🏋️‍♂️</div>
              <h3 style={styles.featureTitle}>Expert Trainers</h3>
              <p style={styles.featureText}>Get guidance from certified fitness professionals</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>⏰</div>
              <h3 style={styles.featureTitle}>Flexible Timings</h3>
              <p style={styles.featureText}>Choose from multiple batch timings</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>💪</div>
              <h3 style={styles.featureTitle}>Modern Equipment</h3>
              <p style={styles.featureText}>Train with state-of-the-art facilities</p>
            </div>
          </div>

          <div style={styles.cta}>
            <button 
              onClick={() => navigate('/register')}
              style={styles.primaryButton}
            >
              Register for a Batch
            </button>
            <button 
              onClick={() => navigate('/payments')}
              style={styles.secondaryButton}
            >
              Check Payment Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#f8fafc'
  },
  hero: {
    width: '100%',
    background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
    padding: '4rem 2rem',
    color: 'white',
    textAlign: 'center',
    minHeight: 'calc(100vh - 64px)' // Subtract navbar height
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#e8eaf6',
    marginBottom: '3rem'
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  },
  feature: {
    flex: '1',
    minWidth: '250px',
    maxWidth: '300px',
    padding: '2rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#ffffff'
  },
  featureText: {
    color: '#e8eaf6',
    lineHeight: '1.5'
  },
  cta: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#43a047',
      transform: 'translateY(-2px)'
    }
  },
  secondaryButton: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)'
    }
  }
}

export default Home 