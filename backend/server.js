var express = require('express');

var bodyParser = require('body-parser');
var validator = require('express-validator');

var bcrypt = require('bcrypt');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var mongoose = require('mongoose');
var models = require('./models/models');
var User = models.User;
var Marker = models.Marker;

var saltRounds = parseInt(process.env.SALT_ROUNDS);

mongoose.connect(process.env.MONGODB_URI);

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRETKEY;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  var user = User.findById(jwt_payload.id, function(err, user) {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});


passport.use(strategy);

const app = express();

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(validator());


// returns the user if it exists in the database
app.post('/usernames', function(req, res) {
  User.find({username: req.body.username}, function(err, user) {
    if (err) {
      console.log('ERROR', err);
    } else {
      res.json(user);
    }
  });
})

// registers the user in database
app.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // req.checkBody('username', 'Please enter a username').notEmpty(); MOVE TO CLIENTSIDE
  req.checkBody('username', 'Username must have at least 4 characters.').isLength(4);
  req.checkBody('username', 'Username must only contain alphanumeric characters.').isAlphanumeric();

  // req.checkBody('password', 'Please enter a password').notEmpty(); MOVE TO CLIENTSIDE
  req.checkBody('password', 'Password must contain at least one number.').matches(/^(?=.*\d)/);
  req.checkBody('password', 'Password must contain at least one letter.').matches(/^(?=.*[A-Za-z])/);
  req.checkBody('password', 'Password must have at least 8 characters.').isLength(8);

  var errors = req.validationErrors()
  if (errors) {
    console.log(errors, 'validation errors');
    res.json(errors);
  } else {
    bcrypt.hash(password, saltRounds)
    .then(function(hash) {
      var newUser = new User({
        username: username,
        password: hash
      });
      newUser.save(function(err, user) {
        if (err) {
          console.log('ERROR IN SAVING USER', err);
          res.status(400);
        } else {
          console.log('NEW USER ADDED TO DATABASE', user);
          res.status(200).json({success: 'ok', message: 'Successfully registered! Go to login.'})
        }
      });
    });
  }
});

// authenticates user
app.post("/login", function(req, res) {
  if(req.body.username && req.body.password){
    var username = req.body.username;
    var password = req.body.password;
  }
  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      res.status(401).json({ message: 'Incorrect username or password.'} );
    } else {
      let resMessage = '';
      bcrypt.compare(password, user.password)
      .then(function(passMatches) {
        // passwords match
        if (passMatches) {
          var payload = { id: user.id };
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({message: 'ok', token: token});
          console.log(token, 'token')
        } else {
          res.status(401).json({message: 'Incorrect username or password.'})
        }
      });
    }
  });
});

// returns the id of the user making request
app.post('/getUser', passport.authenticate('jwt', { session: false }), function(req, res){
  jwt.verify(req.body.token, process.env.SECRETKEY, function(err, decoded) {
    res.json(decoded)
  });
});

// creates a new marker in the database
app.post('/createMarker', passport.authenticate('jwt', { session: false }), function(req, res) {
  var new_marker = new Marker(req.body);
  new_marker.save(function(err, marker) {
    if (err) {
      res.send(err)
    } else {
      res.json(marker)
    }
  });
});

// deletes marker from the database
app.delete('/deleteMarker', passport.authenticate('jwt', { session: false }), function(req, res) {
  Marker.remove({lat: req.body.lat, long: req.body.long, user: req.body.user}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({'success': 'deleted'});
    }
  });
});

// returns an array of all the markers in the database
app.get('/markerList', passport.authenticate('jwt', { session: false }), function(req, res) {
  Marker.find({}, function(err, markers) {
    if (err) {
      res.send(err)
    } else {
      res.json(markers)
    }
  });
});

// updates the description of the marker in database
app.post('/updateDesc', function(req, res) {
  Marker.findOne({lat: req.body.lat, long: req.body.long}, function(err, marker) {
    if (err)
      res.send(err)
    else {
      if (!marker) {
        res.send(err)
      }
      else {
        marker.description = req.body.description
        marker.save(function(err, newMarker) {
          if (err) {
            res.send(err)
          }
          res.json(newMarker)
        });
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Backend server running on port 3000!')
})
