import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StackNavigator } from 'react-navigation';

import Login from './Login.js';
import Register from './Register.js'

export default class Home extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigate } = this.props.navigation;

    const ohutu = [
      {letter: 'o', color: '#57E2E5'},
      {letter: 'h', color: '#6A7FDB'},
      {letter: 'u', color: '#E08DAC'},
      {letter: 't', color: '#2191FB'},
      {letter: 'u', color: '#57E2E5'}
    ];

    return (
        <View style={styles.container}>
          <Animatable.Text style={styles.ohutu} direction='alternate' iterationCount='infinite' animation='pulse'>
            {ohutu.map((item, index) =>
              <Animatable.Text
                key={index} style={{color: item.color}}>{item.letter}
              </Animatable.Text>
            )}
          </Animatable.Text>
          <Text
            style={styles.login}
            onPress={() => navigate('Login')}>Login</Text>
          <Text
            style={styles.register}
            onPress={() => navigate('Register')}>Register</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCEDFF',
  },
  ohutu: {
    fontSize: 100,
    textAlign: 'center',
    fontFamily: 'BalooBhaijaan-Regular',
  },
  login: {
    textAlign: 'center',
    fontSize: 20,
    color: '#E08DAC',
    fontFamily: 'Hind-Light'
  },
  register: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6A7FDB',
    marginBottom: 5,
    fontFamily: 'Hind-Light'
  }
});
