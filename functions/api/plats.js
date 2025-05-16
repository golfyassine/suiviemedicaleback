const express = require('express');
const router = express.Router();
const { db } = require('../../firebase/admin');

const platsCollection = db.collection('plats');

// Récupérer tous les plats
router.get('/', async (req, res) => {
  try {
    const snapshot = await platsCollection.get();
    const plats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(plats);
  } catch (error) {
    console.error('Erreur récupération plats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des plats' });
  }
});

// Récupérer un plat par ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await platsCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Plat non trouvé' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erreur récupération plat:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du plat' });
  }
});

// Ajouter un nouveau plat
router.post('/', async (req, res) => {
  try {
    const { nom, description, moment, calories, glucides, image, favori } = req.body;

    // Vérifier que tous les champs sont présents
    if (
      !nom ||
      !description ||
      !moment ||
      calories === undefined ||
      glucides === undefined ||
      !image ||
      favori === undefined
    ) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const newPlat = {
      nom,
      description,
      moment,
      calories,
      glucides,
      image,
      favori,
      createdAt: new Date()
    };

    const docRef = await platsCollection.add(newPlat);
    res.status(201).json({ id: docRef.id, ...newPlat });
  } catch (error) {
    console.error('Erreur création plat:', error);
    res.status(500).json({ error: 'Erreur lors de la création du plat' });
  }
});

module.exports = router;
