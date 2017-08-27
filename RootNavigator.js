import React from 'react';
import {SignedIn, SignedOut} from './components/Navigators.js';
import { StackNavigator } from 'react-navigation';

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator({
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};
