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
// OBS: We are going to use a regular old fashioned function, because
//      ES6 arrow functions (=>) DOES NOT bind the "this" keyword!

UserSchema.methods.toJSON = function () {
  var currentUserInstance = this;
  var userObject = currentUserInstance.toObject();

  return _.pick(userObject, ['_id', 'name', 'email']);
} ;

// Create an instance method by assigning a function to UserSchema.methods

UserSchema.methods.generateAuthToken = function () {
  // An instance method is called by
  // the indiviual instance/document as the this binding
  var userInstance = this;

  var access = 'auth';
  var token = jwt.sign
    (
      // parameter 1: the data we want to sign
      {
        _id: userInstance._id.toHexString(),
        access
      },
      // parameter 2: the secret
      mySecret
    ).toString();

  userInstance.tokens = userInstance.tokens.concat([{access, token}]);

  return userInstance.save()
    .then
      (() => {
        return token; // token is returned as the success argument
                      // for the next then-call
      });
};

// Create a model method by adding a function to UserSchema.statics
UserSchema.statics.findByToken = function (token) {
  // A model method is called by
  // the model as the this binding.
  var UserModel = this;
  var decodedToken;

  try {
    decodedToken = jwt.verify(token, mySecret)
  }
  catch (error) {
    return Promise.reject(error);
  };

  return UserModel.findOne({
    _id: decodedToken._id,
    'tokens.token': token,  // FK: interesting that "tokens" list can
    'tokens.access': 'auth' //     be seached in this way!?
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
};
