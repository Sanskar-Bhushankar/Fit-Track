import { useState, useEffect } from 'react'
import api from '../lib/axios'

function ChangeBatch() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [batches, setBatches] = useState([])
  const [currentBatch, setCurrentBatch] = useState(null)
  const [batchChangeRequests, setBatchChangeRequests] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    new_batch_time: ''
  })

  useEffect(() => {
    fetchBatches()
    fetchBatchChangeRequests()
  }, [])

  const fetchBatches = async () => {
    try {
      const response = await api.get('/enrollment/available-batches')
      setBatches(response.data)
    } catch (error) {
      setMessage('Error fetching batches. Please try again.')
    }
  }

  const fetchBatchChangeRequests = async () => {
    try {
      const response = await api.get('/enrollment/batch-change-requests')
      setBatchChangeRequests(response.data)
    } catch (error) {
      console.error('Error fetching batch change requests:', error)
    }
  }

  const handleEmailChange = async (e) => {
    const email = e.target.value
    setFormData(prev => ({ ...prev, email }))
    
    if (email) {
      try {
        const response = await api.get(`/enrollment/member/${email}/current-batch`)
        setCurrentBatch(response.data)
        if (response.data.batch_change_requested) {
          setMessage('Warning: You already have a pending batch change request for next month')
        }
      } catch (error) {
        setCurrentBatch(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await api.post('/enrollment/change-batch', {
        ...formData,
        batch_change_requested: true
      })
      
      setMessage('Batch change request successful! New batch will be effective from next month.')
      setFormData({
        name: '',
        email: '',
        new_batch_time: ''
      })
      setCurrentBatch(null)
      // Refresh the batch change requests table
      fetchBatchChangeRequests()
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      handleEmailChange(e)
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const nextMonthName = new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  ).toLocaleString('default', { month: 'long' })

  return (
    <div style={styles.pageContainer}>
      {/* Form Section */}
      <div style={styles.formSection}>
        <div style={styles.card}>
          <h2 style={styles.title}>Change Batch</h2>
          <p style={styles.subtitle}>Request batch change for next month</p>
          
          {message && (
            <div style={{
              ...styles.message,
              backgroundColor: message.includes('Error') ? '#f8d7da' : 
                             message.includes('Warning') ? '#fff3cd' : '#d4edda',
              borderColor: message.includes('Error') ? '#f5c6cb' : 
                          message.includes('Warning') ? '#ffeeba' : '#c3e6cb',
              color: message.includes('Error') ? '#721c24' : 
                     message.includes('Warning') ? '#856404' : '#155724'
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
                placeholder="Enter your registered name"
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
                placeholder="Enter your registered email"
              />
            </div>

            {currentBatch && (
              <div style={styles.currentBatchInfo}>
                <h3 style={styles.infoTitle}>Current Batch Details</h3>
                <p>Current Batch Time: {
                  new Date(`2000-01-01T${currentBatch.batch_time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }</p>
                <p>Status: {currentBatch.payment_status}</p>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Select New Batch for {nextMonthName}: *</label>
              <select
                name="new_batch_time"
                value={formData.new_batch_time}
                onChange={handleChange}
                required
                style={styles.select}
                disabled={currentBatch?.batch_change_requested}
              >
                <option value="">Choose new batch timing</option>
                {batches.map((batch) => (
                  <option 
                    key={batch.batch_time} 
                    value={batch.batch_time}
                    disabled={batch.current_capacity >= batch.max_capacity || 
                             batch.batch_time === currentBatch?.batch_time}
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

            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: (loading || currentBatch?.batch_change_requested) ? 0.7 : 1,
                cursor: (loading || currentBatch?.batch_change_requested) ? 'not-allowed' : 'pointer'
              }}
              disabled={loading || currentBatch?.batch_change_requested}
            >
              {loading ? 'Processing...' : 
               currentBatch?.batch_change_requested ? 'Change Already Requested' : 
               'Request Batch Change'}
            </button>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div style={styles.tableSection}>
        <div style={styles.card}>
          <h2 style={styles.tableTitle}>Batch Change Requests</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Current Batch</th>
                  <th style={styles.th}>New Batch</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {batchChangeRequests.map((request) => (
                  <tr key={`${request.email}-${request.month}`} style={styles.tr}>
                    <td style={styles.td}>{request.name}</td>
                    <td style={styles.td}>{request.email}</td>
                    <td style={styles.td}>
                      {new Date(`2000-01-01T${request.current_batch_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>
                      {new Date(`2000-01-01T${request.new_batch_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge}>
                        Change Requested
                      </span>
                    </td>
                  </tr>
                ))}
                {batchChangeRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" style={styles.emptyMessage}>
                      No batch change requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const additionalStyles = {
  currentBatchInfo: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem'
  },
  infoTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  }
}

const styles = {
  pageContainer: {
    width: '100%',
    padding: '2rem',
    display: 'flex',
    gap: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 64px)'
  },
  formSection: {
    flex: '1',
    minWidth: '400px'
  },
  tableSection: {
    flex: '1',
    minWidth: '600px'
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#1e293b'
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b'
  },
  tableTitle: {
    color: '#1a237e',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem'
  },
  container: {
    width: '100%',
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 64px)',
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
    marginBottom: '0.5rem',
    fontSize: '2.2rem',
    fontWeight: '700'
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '2rem'
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
    fontSize: '1rem'
  },
  input: {
    padding: '0.875rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    transition: 'all 0.3s ease',
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
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  },
  message: {
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    border: '1px solid',
    textAlign: 'center',
    fontWeight: '500'
  },
  ...additionalStyles
}

export default ChangeBatch 