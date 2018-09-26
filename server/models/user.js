var mongoose = require('mongoose');

var User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true,
    default: 'Copenhagen',
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  }
});

module.exports = {
  User: User
};
