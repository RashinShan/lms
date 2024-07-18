const mongoose = require('mongoose');

const bookIssuingSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  issuedUser: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
    required: true,
  },
  submittedDate: {
    type: Date,
    default: null,
  },
  fineOrPayment: {
    type: Number,
    default: 0,
  },
});

const BookIssuing = mongoose.model('BookIssuing', bookIssuingSchema);

module.exports = BookIssuing;
