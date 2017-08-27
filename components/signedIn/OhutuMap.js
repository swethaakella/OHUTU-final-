import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage,
  Modal
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';

import Header from './Header.js';
import DescModal from './Modal.js';

export default class OhutuMap extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Map View',
  }

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      markerIndex: 0,
      region: null,
      gpsAccuracy: null,
      modalVisible: false,
    }
  }

  componentWillMount() {

    //////////////////////////////////////
    // HANDLE LOCATION / WATCH LOCATION //
    //////////////////////////////////////

    this.watchID = navigator.geolocation.watchPosition((position) => {
      let newPos = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00125,
        longitudeDelta: 0.00125,
      }
      this.onRegionChange(newPos, position.coords.accuracy);
    }, (err) => console.log(err),
    {  enableHighAccuracy: false, timeout: 10000, maximumAge: 0, distanceFilter: 30});

    //////////////////////////////
    // UPDATE OTHER USER'S PINS //
    //////////////////////////////

    this.timerID = setInterval(() => {
      AsyncStorage.getItem('token')
      .then((token) => {
        axios.get('https://aqueous-sierra-69526.herokuapp.com/markerList', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        })
        .then((markers) => {
          fetch('https://aqueous-sierra-69526.herokuapp.com/getUser', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              token: token
            })
          })
          .then((data) => data.json())
          .then((user) => {
            var newMarkers = [];
            markers.data.forEach((marker) => {
              let color = '#57E2E5'
              if (user.id !== marker.user) {
                color = 'grey'
              }
              if (marker.description) {
                var newMarker = {
                  lat: marker.lat,
                  long: marker.long,
                  color: color,
                  description: marker.description,
                  createdAt: marker.createdAt
                }
              } else {
                var newMarker = {
                  lat: marker.lat,
                  long: marker.long,
                  color: color,
                  createdAt: marker.createdAt
                }
              }
              newMarkers.push(newMarker);
            });
            this.setState({ markers: newMarkers })
          })
        })
      })
    }, 5000);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    clearInterval(this.timerID)
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  updateMarkerIndex(index, cb) {
    this.setState({markerIndex: index}, cb)
  }

  createMarker(e) {

    var lat = e.nativeEvent.coordinate.latitude;
    var long = e.nativeEvent.coordinate.longitude;
    var date = Date.now();

    //////////////////////////////////////////
    //      CHECK IF MODAL SHOULD OPEN      //
    //  should be clicking on existing pin  //
    //  should be clicking on your own pin  //
    //////////////////////////////////////////

    var color = '#57E2E5'
    this.state.markers.forEach((marker, index) => {
      if (marker.lat === lat && marker.long === long && marker.color === color) {
        if (Object.keys(marker).length > 4) {
          return;
        }
        else {
          this.updateMarkerIndex(index, function() {
            this.setModalVisible(true);
          });
          return;
        }
      }
    });

    ////////////////////////////////////////////
    //    CHECK IF CLICKING ON EXISTING PIN   //
    //  pin is not your own pin: dont return  //
    ////////////////////////////////////////////

    var pinAlreadyThere = false;
    for (var k = 0; k < this.state.markers.length; k++) {
      if (lat === this.state.markers[k].lat) {
        if (long === this.state.markers[k].long) {
         pinAlreadyThere = true;
        }
      }
    }

    //////////////////////
    // CREATE A NEW PIN //
    //////////////////////

    if (!pinAlreadyThere) {
      // authenticate user and grab id
      AsyncStorage.getItem('token')
      .then((token) => {
        fetch('https://aqueous-sierra-69526.herokuapp.com/getUser', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            token: token
          })
        })
        .then((data) => data.json())
        // save marker with ref to user
        .then(data => {
          fetch('https://aqueous-sierra-69526.herokuapp.com/createMarker', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              lat: lat,
              long: long,
              user: data.id,
              createdAt: date
            })
          })
          .then(data => data.json())
          // save new marker to state
          .then(data => {
            var slicedMarkers = [...this.state.markers];
            var newMarker = {
              lat: data.lat,
              long: data.long,
              createdAt: date
            }
            slicedMarkers.push(newMarker);
            this.setState({
              markers: slicedMarkers
            });
          });
        });
      });
    }
  }

  deleteMarker() {
    var oldMarkers = [...this.state.markers]
    // authenticate user and grab id
    AsyncStorage.getItem('token')
    .then((token) => {
      fetch('https://aqueous-sierra-69526.herokuapp.com/getUser', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          token: token
        })
      })
      .then((data) => data.json())
      // delete marker with ref to user in database
      .then(data => {
        function reverse (a) {
          var b = [], counter = 0;
          for (var i = a.length-1; i >= 0; i -= 1) {
            b[counter] = a[i];
            counter += 1;
          }
          return b;
        }
        var markerToDelete;
        var index;
        var reversed = reverse(oldMarkers);
        for (var i = 0; i < reversed.length; i++) {
          if (reversed[i].color === '#57E2E5') {
            markerToDelete = reversed[i];
            index = i;
            break;
          }
        }
        if (index !== -1) {
          fetch('https://aqueous-sierra-69526.herokuapp.com/deleteMarker', {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              lat: markerToDelete.lat,
              long: markerToDelete.long,
              user: data.id
            })
          })
          .then(data => {
            oldMarkers.splice(index, 1);
          });
        }
      });
    });
  }

  updateDescription(text) {
    if (this.state.markers.length === 0) {
      alert('Need to drop a pin first!')
    } else {
      var slicedMarker = [...this.state.markers];
      var updatingMarker = Object.assign({}, slicedMarker[this.state.markerIndex], {description: text});
      slicedMarker[this.state.markerIndex] = updatingMarker;
      var lastDesc = slicedMarker[this.state.markerIndex].description
      this.setState({ markers: slicedMarker });
      fetch('https://aqueous-sierra-69526.herokuapp.com/updateDesc', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: slicedMarker[this.state.markerIndex].lat,
          long: slicedMarker[this.state.markerIndex].long,
          description: lastDesc
        })
      })
      .then(data => data.json())
      .then(data => console.log(data))
      .catch((err) => console.log("error fetching", err))
    }
  }

  onRegionChange(region, gpsAccuracy) {
    this.setState({
        region: region,
        gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Header display='Home' navOptions={() => this.props.navigation.navigate('DrawerOpen')}/>
        <DescModal visible={this.state.modalVisible} changeText={(text) => this.updateDescription(text)} hide={() => this.setModalVisible(!this.state.modalVisible)} />
        <MapView.Animated
          style={{flex: 1}}
          showsUserLocation={true}
          followUserLocation={true}
          loadingEnabled={true}
          zoomEnabled={true}
          ref='map'
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={(e) => this.createMarker(e)}
          >
            {this.state.markers.map((marker, i) => (
              <MapView.Marker key={i}
                coordinate={{latitude: parseFloat(marker.lat),
                longitude: parseFloat(marker.long)}}
                pinColor={marker.color}
                title={marker.description}
              />
            ))}
        </MapView.Animated>
        <TouchableOpacity onPress={() => this.deleteMarker()}>
          <View style={styles.undoButton}>
            <Icon name='undo' size={20} color='#E08DAC'/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  undoButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    height: 60,
    width: 60,
    backgroundColor: '#DCEDFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
