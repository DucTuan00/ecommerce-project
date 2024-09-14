const express = require('express');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});