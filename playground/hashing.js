const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
console.log(`Password: ${password}`);

var salt = bcrypt.genSaltSync(10);
console.log(`Salt: ${salt}`);

var hash = bcrypt.hashSync(password, salt);
console.log(`Hash: ${hash}`);

var compare = bcrypt.compareSync('123abc!', hash); // true
console.log(`Compare: ${compare}`);

// // -------------------------------------------------
// SHA = Secure Hash Algorithm
// Eg. SHA256 is a cryptographic hash function
// HMAC - sometimes expanded as either
// keyed-Hash Message Authentication Code or
// Hash-based Message Authentication Code
//
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
// // -------------------------------------------------

// https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e

// // -------------------------------------------------
// var data = {
//   id: 4,
//   name: "Freddy Knoll",
//   age: 47
// };
// console.log(`Original: ${JSON.stringify(data)}`);
//
// mySecret = 'frodeguldfisk#1';
// token = jwt.sign(data, mySecret );
// console.log(`Signed (token): ${token}`);
//
// var decoded = jwt.verify(token, mySecret);
// console.log(`Decoded (token): ${JSON.stringify(decoded)}`);
// // -------------------------------------------------

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed. Do trust!')
// } else {
//   console.log('Data was changed. Do not trust!')
// };
