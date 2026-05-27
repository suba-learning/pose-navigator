require('dotenv').config();
const express = require('express');
const cors = require('cors');
const posesRouter = require('./routes/poses');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/poses', posesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
