const mongoose = require('mongoose');

const NftSchema = new mongoose.Schema({ 
  
  ryoshiId: {
    type: Number,
    required: true
  },
  zksyncId: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('nftId', NftSchema);
