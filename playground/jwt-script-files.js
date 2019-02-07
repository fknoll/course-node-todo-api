'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
// use 'utf8' to get string instead of byte array
var privateKEY 	= fs.readFileSync('./playground/private-key.pem', 'utf8'); // to sign JWT
var publicKEY 	= fs.readFileSync('./playground/public-key.pem', 'utf8'); 	// to verify JWT

/*
 ====================   JST Signing =====================
*/

// Remember you dont want the payload to be as small as possible in size
// Because 1. You gonna have to pass it in each request
// Because 2. Informations are sensitive, even though JST is encryped, yet it sits inside unreliable client system
var payload = {
	data1: "Data 1",
	data2: "Data 2",
	data3: "Data 3",
	data4: "Data 4",
};

// To make the JWT more efficient we need 3 things
var i 	= 'Software Kompagniet - LUMOZ';			// Issuer (Software organization who issues the token)
var s 	= 'fk@swk.dk';			// Subject (intended user of the token)
var a 	= 'http://lumoz.dk';	// Audience (Domain within which this token will live and function)

// Token signing options
var signOptions = {
	issuer: 	i,
	subject: 	s,
	audience: 	a,
	expiresIn: 	"12h",
	algorithm: 	"RS256" 			// RSASSA options[ "RS256", "RS384", "RS512" ]
};

// Use private.key to sign JSON Web Token (JWT)
var token = jwt.sign(payload, privateKEY, signOptions);
console.log("Token (based on privateKEY):" + token);

/*
 ====================   JST Verify =====================
*/
var verifyOptions = {
	issuer: 	i,
	subject: 	s,
	audience: a,
	expiresIn: 	"12h",
	algorithm: 	["RS256"] // RSA Signature with SHA-256
};

// Use public.key to verify JSON Web Token (JWT)
var legit = jwt.verify(token, publicKEY, verifyOptions);
console.log("\nJWT verification result (based on publicKEY): " + JSON.stringify(legit));

/*
 ====================   JST Decode =====================
*/
var decoded =  jwt.decode(token, {complete: true});
console.log("\nDecoded JWT: "+ JSON.stringify(decoded));
