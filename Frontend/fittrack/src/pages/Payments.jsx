import { useState, useEffect } from 'react'
import api from '../lib/axios'

function Payments() {
  const [unpaidMembers, setUnpaidMembers] = useState([])
  const [outstandingDues, setOutstandingDues] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    setLoading(true)
    try {
      // Fetch unpaid members
      const unpaidResponse = await api.get('/enrollment/unpaid')
      const formattedUnpaid = unpaidResponse.data.map(member => ({
        ...member,
        status: 'pending',
        formatted_date: new Date(member.month).toLocaleDateString()
      }))
      setUnpaidMembers(formattedUnpaid)

      // Fetch outstanding dues
      const duesResponse = await api.get('/enrollment/outstanding-dues')
      setOutstandingDues(duesResponse.data)
      setMessage('')
    } catch (error) {
      console.error('Fetch error:', error)
      setMessage('Error fetching payment data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter payments based on active tab
  const getDisplayedPayments = () => {
    switch(activeTab) {
      case 'unpaid':
        return unpaidMembers
      case 'paid':
        return [] // Currently we don't have paid data from backend
      default:
        return unpaidMembers // Showing all available data
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Payment Status</h2>
        {message && <div style={styles.error}>{message}</div>}

        <button 
          onClick={fetchPaymentData} 
          style={styles.refreshButton}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>

        {/* Payment Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'all' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('all')}
          >
            All Payments
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'paid' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('paid')}
          >
            Paid
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'unpaid' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('unpaid')}
          >
            Unpaid
          </button>
        </div>

        {/* Payments Table */}
        <div style={styles.section}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Batch Time</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {getDisplayedPayments().map((payment) => (
                  <tr key={`${payment.email}-${payment.month}`} style={styles.tr}>
                    <td style={styles.td}>{payment.name}</td>
                    <td style={styles.td}>{payment.email}</td>
                    <td style={styles.td}>
                      {new Date(`2000-01-01T${payment.batch_time}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>₹{payment.amount}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        backgroundColor: payment.status === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: payment.status === 'paid' ? '#166534' : '#92400e'
                      }}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={styles.td}>{payment.formatted_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outstanding Dues Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Outstanding Dues Summary</h3>
          {outstandingDues.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Total Due</th>
                    <th style={styles.th}>Pending Months</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingDues.map((due) => (
                    <tr key={due.email} style={styles.tr}>
                      <td style={styles.td}>{due.name}</td>
                      <td style={styles.td}>{due.email}</td>
                      <td style={styles.td}>₹{due.total_dues}</td>
                      <td style={styles.td}>{due.pending_months}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={styles.emptyMessage}>No outstanding dues</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
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
    maxWidth: '1200px',
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
    fontWeight: '700'
  },
  section: {
    marginTop: '2rem'
  },
  sectionTitle: {
    color: '#2c3e50',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  refreshButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    marginBottom: '1.5rem',
    '&:hover': {
      backgroundColor: '#4338ca'
    },
    '&:disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed'
    }
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '1rem'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#64748b',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  activeTab: {
    backgroundColor: '#4f46e5',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    maxHeight: '500px',
    overflowY: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    borderBottom: '2px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8fafc'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#1e293b'
  },
  tr: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  },
  error: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    color: '#721c24',
    textAlign: 'center'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#64748b',
    padding: '2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    display: 'inline-block'
  }
}

export default Payments 