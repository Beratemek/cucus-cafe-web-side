const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const wheelRoutes = require('./routes/wheelRoutes');


const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://cucus.online', 'https://cafe-web-site.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/wheel", wheelRoutes);

// Kök Dizin Mesajı (Render'da çalıştığını anlamak için)
app.get('/', (req, res) => {
  res.send('Ciao! CuCus Backend Service is Running ☕🍰');
});

const PORT = process.env.PORT || 4000;

// MongoDB bağlantısını dene, bağlanamasa bile devam et
db()
  .then(() => {
    console.log('✅ MongoDB Connected - Starting server...');
  })
  .catch(err => {
    console.warn('⚠️  MongoDB Connection Failed:', err.message);
    console.warn('⚠️  Server will start WITHOUT database connection');
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📝 Forgot Password: http://localhost:${PORT}/forgot-password.html`);
      console.log(`🔐 Reset Password: http://localhost:${PORT}/reset-password.html\n`);
    });
  });
