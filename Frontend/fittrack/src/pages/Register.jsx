import { useState, useEffect } from 'react'
import api from '../lib/axios'

function Register() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [batches, setBatches] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch_time: '',
    payment_amount: '',
    address: '',
    payment_status: 'pending'
  })
  const [paymentType, setPaymentType] = useState('later')

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    try {
      const response = await api.get('/enrollment/available-batches')
      setBatches(response.data)
    } catch (error) {
      setMessage('Error fetching batches. Please try again.')
    }
  }

  // Update payment amount when batch is selected
  const handleBatchSelect = (e) => {
    const selectedBatch = batches.find(batch => batch.batch_time === e.target.value)
    setFormData(prev => ({
      ...prev,
      batch_time: e.target.value,
      payment_amount: selectedBatch ? selectedBatch.monthly_fee : ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const finalFormData = {
        ...formData,
        payment_status: paymentType === 'now' ? 'paid' : 'pending'
      }

      const response = await api.post('/enrollment/enroll', finalFormData)
      setMessage('Registration successful!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        batch_time: '',
        payment_amount: '',
        address: '',
        payment_status: 'pending'
      })
      setPaymentType('later')
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register for a Batch</h2>
        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('failed') ? '#f8d7da' : '#d4edda',
            borderColor: message.includes('failed') ? '#f5c6cb' : '#c3e6cb',
            color: message.includes('failed') ? '#721c24' : '#155724'
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name: *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email: *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone: *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter your address (optional)"
              rows="3"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Batch: *</label>
            <select
              name="batch_time"
              value={formData.batch_time}
              onChange={handleBatchSelect}
              required
              style={styles.select}
            >
              <option value="">Choose a batch timing</option>
              {batches.map((batch) => (
                <option 
                  key={batch.batch_time} 
                  value={batch.batch_time}
                  disabled={batch.current_capacity >= batch.max_capacity}
                >
                  {new Date(`2000-01-01T${batch.batch_time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - ₹{batch.monthly_fee} 
                  ({batch.max_capacity - batch.current_capacity} slots available)
                </option>
              ))}
            </select>
          </div>

          {formData.batch_time && (
            <div style={styles.feeInfo}>
              <p>Monthly Fee: ₹{formData.payment_amount}</p>
              
              <div style={styles.paymentOptions}>
                <p style={styles.paymentTitle}>Payment Option:</p>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="now"
                      checked={paymentType === 'now'}
                      onChange={(e) => setPaymentType(e.target.value)}
                      style={styles.radioInput}
                    />
                    Pay Now
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="later"
                      checked={paymentType === 'later'}
                      onChange={(e) => setPaymentType(e.target.value)}
                      style={styles.radioInput}
                    />
                    Pay at Gym
                  </label>
                </div>
              </div>

              {paymentType === 'later' && (
                <p style={styles.note}>Payment status will be marked as pending</p>
              )}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 64px)', // Subtract navbar height
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    padding: '2.5rem'
  },
  title: {
    textAlign: 'center',
    color: '#1a237e',
    marginBottom: '2rem',
    fontSize: '2.2rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1rem',
    marginBottom: '0.25rem'
  },
  input: {
    padding: '0.875rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#cbd5e1'
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  textarea: {
    padding: '0.875rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#cbd5e1'
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  select: {
    padding: '0.875rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#cbd5e1'
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  button: {
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginTop: '1.5rem',
    '&:hover': {
      backgroundColor: '#4338ca',
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  },
  message: {
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '1rem'
  },
  feeInfo: {
    backgroundColor: '#f8fafc',
    padding: '1.25rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '0.5rem'
  },
  note: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '0.5rem',
    fontStyle: 'italic'
  },
  paymentOptions: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  paymentTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#2c3e50'
  },
  radioGroup: {
    display: 'flex',
    gap: '1.5rem'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: '#2c3e50'
  },
  radioInput: {
    cursor: 'pointer'
  }
}

export default Register 