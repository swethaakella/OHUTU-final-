import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage
} from 'react-native';

import { createRootNavigator } from '../RootNavigator.js';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  isSignedIn() {
    return new Promise((resolve, reject) => {
      let token = '';
      AsyncStorage.getItem('token')
      .then(data => {
        if (data !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
    });
  }

  componentWillMount() {
   this.isSignedIn()
     .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
     .catch(err => console.log(err, 'ERROR'));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />
  }
}
