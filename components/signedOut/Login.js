import React from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';

import { SignedIn } from '../Navigators.js';

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errors: []
    }
  };

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue)
      .then(() => this.props.navigation.navigate('SignedIn'))
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };

  login() {
    this.setState({errors: []}, function() {
      fetch('https://aqueous-sierra-69526.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
      .then(data => data.json())
      .then(resp => {
        if (!resp.token) {
          let newErrors = [resp];
          this.setState({errors: newErrors})
        } else {
          this._onValueChange('token', resp.token)
        }
      })
      .catch(err => console.log(err))
    })

  }

  render() {
    const { navigate, goBack } = this.props.navigation;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <View style={{height: 120, width: 300, alignItems: 'center', justifyContent: 'center'}}>
          {this.state.errors
            ? this.state.errors.map((error) =>
              (<Text key={error} style={styles.errors}>{error.message}</Text>))
            : '' }
        </View>
        <TouchableOpacity onPress={ () => {this.login()} }>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => goBack()}>
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCEDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: 'Hind-Light',
    fontSize: 25,
    color: '#6A7FDB'
  },
  text: {
    fontFamily: 'Hind-Light',
    fontSize: 20,
    color: '#5C5D67'
  },
  textInput: {
    fontFamily: 'Hind-Light',
    fontSize: 20,
    textAlign: 'left',
    borderBottomColor: '#E08DAC',
    borderBottomWidth: 1.5,
    width: 300,
    margin: 10,
    color: '#5C5D67'
  },
  errors: {
    color: '#2191FB',
    fontFamily: 'Hind-Light',
    fontSize: 13.5
  }
});
