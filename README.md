I'll help you create a comprehensive README.md file for your project:

```markdown:README.md
# FitTrack - Gym Management System

## Project Overview
FitTrack is a comprehensive gym management system that helps track member enrollments, batch schedules, and payment status. The system allows members to:
- Register for gym batches
- Track payment status
- Request batch changes for upcoming months
- View available batch timings and capacities

## Project Structure

### Backend Structure
```
Backend/
├── src/
│   ├── config/
│   │   └── db.js         # Database configuration
│   ├── routes/
│   │   └── enrollment.routes.js  # API routes
│   └── index.js          # Server entry point
├── package.json
└── .env                  # Environment variables
```

### Frontend Structure
```
Frontend/fittrack/
├── src/
│   ├── components/
│   │   └── Navbar.jsx    # Navigation component
│   ├── lib/
│   │   └── axios.js      # API client configuration
│   ├── pages/
│   │   ├── Home.jsx      # Home page
│   │   ├── Register.jsx  # Batch registration
│   │   ├── Payments.jsx  # Payment status
│   │   └── ChangeBatch.jsx # Batch change requests
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── index.html
└── package.json
```

## Database Schema

### Database: gym_db

#### Tables Structure

**1. Members**
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Member's full name |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Member's email address |
| phone | VARCHAR(15) | NOT NULL | Contact number |
| address | TEXT | - | Physical address |

**2. GymBatches**
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| batch_time | TIME | PRIMARY KEY | Batch timing |
| monthly_fee | DECIMAL(10,2) | NOT NULL | Monthly fee for the batch |
| max_capacity | INT | NOT NULL | Maximum members allowed |
| current_capacity | INT | DEFAULT 0 | Current number of members |

**3. Enrollments**
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| member_id | INT | FOREIGN KEY | Reference to Members table |
| batch_time | TIME | FOREIGN KEY | Reference to GymBatches table |
| month | DATE | - | Enrollment month |
| amount | DECIMAL(10,2) | - | Fee amount |
| payment_status | ENUM('pending','paid') | DEFAULT 'pending' | Payment status |
| batch_change_requested | BOOLEAN | DEFAULT FALSE | Flag for batch change |
| new_batch_time | TIME | - | New requested batch time |

**4. Payments**
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| enrollment_id | INT | FOREIGN KEY | Reference to Enrollments table |
| amount | DECIMAL(10,2) | - | Payment amount |
| transaction_id | VARCHAR(100) | - | Unique transaction identifier |
| payment_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Payment timestamp |

#### Relationships

1. **Members to Enrollments** (One-to-Many)
   - One member can have multiple enrollments
   - `Members.id` → `Enrollments.member_id`

2. **GymBatches to Enrollments** (One-to-Many)
   - One batch can have multiple enrollments
   - `GymBatches.batch_time` → `Enrollments.batch_time`

3. **Enrollments to Payments** (One-to-Many)
   - One enrollment can have multiple payments
   - `Enrollments.id` → `Payments.enrollment_id`

#### Constraints
- Email must be unique for each member
- Batch capacity cannot exceed max_capacity
- Payment status can only be 'pending' or 'paid'
- Batch changes are tracked in the same enrollment record
- All foreign keys maintain referential integrity

## Setup Instructions

### Backend Setup
1. Navigate to backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure database:
- Create MySQL database named 'gym_db'
- Update password in src/config/db.js:
```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'student', // Update this
    database: 'gym_db'
});
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to frontend folder:
```bash
cd Frontend/fittrack
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Request Body Example |
|--------|----------|-------------|---------------------|
| GET | /api/enrollment/available-batches | Get available batch timings | - |
| POST | /api/enrollment/enroll | Register new member | `{ "name": "John Doe", "email": "john@example.com", "phone": "1234567890", "batch_time": "09:00:00", "payment_amount": 500, "payment_status": "pending" }` |
| GET | /api/enrollment/unpaid | Get all enrollments | - |
| GET | /api/enrollment/outstanding-dues | Get members with pending payments | - |
| POST | /api/enrollment/change-batch | Request batch change | `{ "email": "john@example.com", "name": "John Doe", "new_batch_time": "10:00:00" }` |
| GET | /api/enrollment/batch-change-requests | Get all batch change requests | - |

## Testing API Endpoints

### 1. Register New Member
```json
POST /api/enrollment/enroll
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "batch_time": "09:00:00",
    "payment_amount": 500,
    "address": "123 Main St",
    "payment_status": "pending"
}
```

### 2. Request Batch Change
```json
POST /api/enrollment/change-batch
{
    "email": "john@example.com",
    "name": "John Doe",
    "new_batch_time": "10:00:00"
}
```

### 3. Sample Batch Data
```sql
INSERT INTO GymBatches (batch_time, monthly_fee, max_capacity) VALUES
('09:00:00', 500, 10),
('10:00:00', 500, 10),
('16:00:00', 500, 10),
('17:00:00', 500, 10);
```

## Features
- Member registration with flexible batch selection
- Payment status tracking
- Batch change requests for next month
- Real-time batch capacity monitoring
- Payment history tracking
- Outstanding dues calculation

## Notes
- All times are in 24-hour format
- Batch changes take effect from the next month
- Payment status can be either 'pending' or 'paid'
- Each batch has a maximum capacity limit
```

This README provides:
1. Clear project structure
2. Complete database schema
3. Setup instructions
4. API documentation
5. Testing examples
6. Feature overview

Would you like me to:
1. Add more testing examples
2. Include troubleshooting steps
3. Add deployment instructions
4. Something else?
