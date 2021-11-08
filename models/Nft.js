const mongoose = require('mongoose');

const NftSchema = new mongoose.Schema({
  
  tokenUri: {
    type: String,
    required: true
  },
  minPrice: {
    type: Number,
    required: true
  },
  approveOwners: [
    {
      address: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      key: {
        type: String,
        required: true
      }
    }
  ],
  mintOwners: [
    {
      address: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }
  ],
  nftIds:[Number],
  amount: {
    type:Number,
    required: true
  },
  left:{
    type:Number,
    required: true
  },
  emailContents:[
    {
      name:{
        type:String,
      },
      content:{
        type:String
      }
    }
  ],
  maxAmount:{
    type:Number
  },
  show:{
    type: Number,
    default: 3
  },
});

module.exports = mongoose.model('nft', NftSchema);
