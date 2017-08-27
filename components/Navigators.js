import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage
} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Home from './signedOut/Home.js';
import Login from './signedOut/Login.js';
import Register from './signedOut/Register.js';
import OhutuMap from './signedIn/OhutuMap.js';
import Logout from './signedIn/Logout.js';

export const SignedOut = StackNavigator({
  Home: { screen: Home },
  Login: { screen: Login },
  Register: { screen: Register },
})

export const SignedIn = DrawerNavigator({
  Map: { screen: OhutuMap },
  Logout: { screen: Logout }
})
