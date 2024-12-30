#### Project link 
1. api - https://github.com/Sanskar-Bhushankar/fittrack-api
2. Frontend- https://github.com/Sanskar-Bhushankar/Fit-Track
3. Socials- https://linktr.ee/sanskar_izz
## Project Overview
Fit-Track is a comprehensive gym management system that helps track member enrollments, batch schedules, and payment status. The system allows members to:
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

### 1. Members
| Column  | Data Type    | Constraints                 |
| ------- | ------------ | --------------------------- |
| id      | INT          | PRIMARY KEY, AUTO_INCREMENT |
| name    | VARCHAR(100) | NOT NULL                    |
| email   | VARCHAR(100) | NOT NULL, UNIQUE            |
| phone   | VARCHAR(15)  | NOT NULL                    |
| address | TEXT         | -                           |

### 2. GymBatches
| Column           | Data Type     | Constraints |
| ---------------- | ------------- | ----------- |
| batch_time       | TIME          | PRIMARY KEY |
| monthly_fee      | DECIMAL(10,2) | NOT NULL    |
| max_capacity     | INT           | NOT NULL    |
| current_capacity | INT           | DEFAULT 0   |

### 3. Enrollments
| Column                 | Data Type              | Constraints                 |
| ---------------------- | ---------------------- | --------------------------- |
| id                     | INT                    | PRIMARY KEY, AUTO_INCREMENT |
| member_id              | INT                    | FOREIGN KEY                 |
| batch_time             | TIME                   | FOREIGN KEY                 |
| month                  | DATE                   | -                           |
| amount                 | DECIMAL(10,2)          | -                           |
| payment_status         | ENUM('pending','paid') | DEFAULT 'pending'           |
| batch_change_requested | BOOLEAN                | DEFAULT FALSE               |
| new_batch_time         | TIME                   | -                           |

### 4. Payments
| Column         | Data Type     | Constraints                 |
| -------------- | ------------- | --------------------------- |
| id             | INT           | PRIMARY KEY, AUTO_INCREMENT |
| enrollment_id  | INT           | FOREIGN KEY                 |
| amount         | DECIMAL(10,2) | -                           |
| transaction_id | VARCHAR(100)  | -                           |
| payment_date   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP   |

## Relationships

### One-to-Many Relationships
1. **Members to Enrollments**
   - One member can have multiple enrollments
   - Foreign Key: `Members.id` → `Enrollments.member_id`

2. **GymBatches to Enrollments**
   - One batch can have multiple enrollments
   - Foreign Key: `GymBatches.batch_time` → `Enrollments.batch_time`

3. **Enrollments to Payments**
   - One enrollment can have multiple payments
   - Foreign Key: `Enrollments.id` → `Payments.enrollment_id`

## Constraints

1. Data Integrity
   - Email must be unique for each member
   - Batch capacity cannot exceed max_capacity (Hardcoded 30 batch limit)
   - Payment status can only be 'pending' or 'paid'
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

| Method | Endpoint                              | Description                       |
| ------ | ------------------------------------- | --------------------------------- |
| GET    | /api/enrollment/available-batches     | Get available batch timings       |
| POST   | /api/enrollment/enroll                | Register new member               |
| GET    | /api/enrollment/unpaid                | Get all enrollments               |
| GET    | /api/enrollment/outstanding-dues      | Get members with pending payments |
| POST   | /api/enrollment/change-batch          | Request batch change              |
| GET    | /api/enrollment/batch-change-requests | Get all batch change requests     |

## Testing API Endpoints (Postman)

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