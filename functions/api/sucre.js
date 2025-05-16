const express = require('express');
const { admin, db } = require('../../firebase/admin');

const router = express.Router();

// Ajouter une nouvelle entrée glycémie
router.post('/ajouter', async (req, res) => {
  try {
    let { value, note } = req.body;
    if (!value) {
      return res.status(400).json({ error: 'Le champ "value" est requis.' });
    }

    // Accepte la virgule comme séparateur décimal
    value = value.toString().replace(',', '.');
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return res.status(400).json({ error: 'Valeur glycémie invalide.' });
    }

    const date = admin.firestore.Timestamp.now();

    const entry = {
      value: numericValue,
      note: note || '',
      date: date,
    };

    const docRef = await db.collection('glycemie').add(entry);

    // On renvoie une date lisible pour le frontend
    res.status(200).json({
      id: docRef.id,
      value: numericValue,
      note: note || '',
      date: date.toDate().toISOString(), // Date bien formatée
    });
  } catch (err) {
    console.error('Erreur ajout glycémie :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Obtenir toutes les entrées
router.get('/liste', async (req, res) => {
  try {
    const snapshot = await db.collection('glycemie').orderBy('date', 'desc').get();
    const entries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        value: data.value,
        note: data.note,
        date: data.date.toDate().toISOString(), // Date formatée pour le frontend
      };
    });
    res.status(200).json(entries);
  } catch (err) {
    console.error('Erreur récupération glycémie :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Supprimer une entrée
router.delete('/supprimer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('glycemie').doc(id).delete();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur suppression glycémie :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
