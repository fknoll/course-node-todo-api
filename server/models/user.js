const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// To be able to define instance/document methods,
// we  have create to User model from a mongoose.Schema
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid e-mail'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

const mySecret = 'frodeguldfisk#1';

// OVERWRITE instance methods "toJSON" and ADD "generateAuthToken()"
// both to be used on the individual user instance/document
// OBS: We are going to user a regular old function, as
//      the ES6 Arrow Function DOES NOT bind the "this" keyword!

UserSchema.methods.toJSON = function () {
  var currentUserInstance = this;
  var userObject = currentUserInstance.toObject();

  return _.pick(userObject, ['_id', 'name', 'email']);
} ;

UserSchema.methods.generateAuthToken = function () {
  var currentUserInstance = this;
  var access = 'auth';
  var token = jwt.sign
    (
      // parameter 1: the data we want to sign
      {
        _id: currentUserInstance._id.toHexString(),
        access
      },
      // parameter 2: the secret
      mySecret
    ).toString();

  currentUserInstance.tokens = currentUserInstance.tokens.concat([{access, token}]);

  return currentUserInstance.save()
    .then
      (() => {
        return token; // token is returned as the success argument
                      // for the next then-call
      });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
};
