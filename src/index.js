const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// const adapter = new PrismaPg(pool);
// 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import route definitions
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const recordRoutes = require('./routes/recordRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Mount routes under the /api/v1 prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MediCore API is running smoothly.' });
});

// Final catch-all Error Handling Middleware
app.use(errorHandler);

// Export for testing
module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 MediCore Server running on http://localhost:${PORT}`);
    try {
      await prisma.$connect();
      console.log('🗄️  Database connected successfully via pg adapter');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  });
}