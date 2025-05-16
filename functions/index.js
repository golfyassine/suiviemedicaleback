const express = require('express');
const { db } = require('../firebase/admin');  // ← chemin corrigé
const platsRoutes = require('./api/plats');
const sucreRoutes = require('./api/sucre');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/plats', platsRoutes);
app.use('/sucre', sucreRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
