const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  photos: [{
    url: { type: String, required: true },
    description: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  public: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Índice para buscas geográficas
artifactSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Artifact', artifactSchema);
