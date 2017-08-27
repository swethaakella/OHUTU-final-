import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage
} from 'react-native';
import Header from './Header.js';
import SignedOut from '../Navigators.js';

export default class Logout extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Logout'
  }

  async _onLogout() {
    try {
      await AsyncStorage.removeItem('token')
      .then(() => this.props.navigation.navigate('SignedOut'))
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header display='Logout' navOptions={() => this.props.navigation.navigate('DrawerOpen')}/>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <Text style={styles.registerText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEDFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  registerText: {
    fontFamily: 'Hind-Light',
    fontSize: 25,
    color: '#2191FB'
  },
});
