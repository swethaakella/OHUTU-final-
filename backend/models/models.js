var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var markerSchema = new Schema ({
  description: {
    type: String,
    required: false
  },
  lat: {
    type: Number,
    required: true
  },
  long: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    expires: 60*60*1
  }
});

var User = mongoose.model('User', userSchema);
var Marker = mongoose.model('Marker', markerSchema);

module.exports = {
  User: User,
  Marker: Marker
}
