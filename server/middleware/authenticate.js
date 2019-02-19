const {User} = require('../models/user.js');

var authenticate = (req, res, next) => {

  // Fetch the token from the header
  var token = req.header('X-Auth');

  User.findByToken(token)
    .then
      (
        (user) => {
          if (!user) {
            // res.status(401).send() // Unauthorized
            return Promise.reject({
                "name": "LumozAPIError",
                "message": "No user matches the access token provided in the HTTP Authorization header."
            });   // this will cause catch
                  // to be activated
          };

          // res.send(user);
          req.user = user;
          req.token = token;
          next();

        }
      )
    .catch
      (
        (error) => {
          res.status(401).send(error); // Unauthorized
        }
      )
  ;
};

module.exports = {
  authenticate: authenticate
};
