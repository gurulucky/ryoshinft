const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  voucher: {
    type: Object,
  },
  approve: {
    type: Boolean,
    required: true
  },
});

module.exports = mongoose.model('voucher', VoucherSchema);
