const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes=require('./routes/productRoutes.js')
const cookieParser = require('cookie-parser');
const cors=require('cors');

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: "https://online-furniture-frontend.vercel.app/", 
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product',productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
