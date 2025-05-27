const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Artifact = require('../models/Artifact');
const upload = require('../utils/upload');

// Upload de múltiplas imagens
router.post('/', 
  authMiddleware, 
  upload.array('photos', 5), // Aceita até 5 imagens
  async (req, res) => {
    try {
      const { description, longitude, latitude, isPublic } = req.body;
      
      const artifact = new Artifact({
        user: req.userId,
        photos: req.files.map(file => ({
          url: `/uploads/artifacts/${file.filename}`,
          description
        })),
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        public: isPublic === 'true'
      });

      await artifact.save();
      res.status(201).json(artifact);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// routes/artifacts.js
router.get('/public', async (req, res) => {
    const artifacts = await Artifact.find({ public: true }).sort({ createdAt: -1 });
    res.json(artifacts);
});

module.exports = router;
