const express = require('express');
const app = express();
const authRoutes = require('./routes/auth'); 
const cors = require("cors");
const UserModel = require('./models/User');


app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


