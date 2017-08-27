import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Login from './Login';


const errorMessages = {
  userExists: 'This username already exists.',
  passwordNotMatch: "The passwords don't match.",
  userTooShort: 'Username must have at least 4 characters.',
  userNonAlphaNum: 'Username must only contain alphanumeric characters.',
  passNoLetter: 'Password must contain at least one number.',
  passNoNumber: 'Password must contain at least one letter.',
  passTooShort: 'Password must have at least 8 characters.',
  usernameEmpty: 'Please enter a username.',
  passwordEmpty: 'Please enter a password.',
  confirmPassEmpty: 'Please confirm your password.'
}

export default class Register extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      confirmPass: '',
      errors: [],
      success: []
    }
  };

  onChangeUsername(text) {
    this.setState({username: text}, function() {
      //check if a user already exists
      fetch('https://aqueous-sierra-69526.herokuapp.com/usernames', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username
        })
      })
      .then((user) => {
        let index = this.state.errors.indexOf(errorMessages.userExists)
        if (index !== -1) {
          let newErrors = this.state.errors.slice();
          newErrors.splice(index, 1);
          this.setState({errors: newErrors});
        }
        user.json()
        .then((user) => {
          if (user[0]) {
            let newErrors = this.state.errors.slice();
            newErrors.push(errorMessages.userExists);
            this.setState({errors: newErrors});
          }
        })
      });
    })
  }

  onChangePassword(text) {
    if (this.state.errors.includes(errorMessages.passTooShort) || this.state.errors.includes(errorMessages.passNoNumber) || this.state.errors.includes(errorMessages.passNoLetter)) {
      this.setState({errors: []});
    }
    var index = this.state.errors.indexOf(errorMessages.passwordNotMatch);
    if (index !== -1) {
      let newErrors = this.state.errors.slice();
      newErrors.splice(index, 1);
      this.setState({errors: newErrors});
    }
    this.setState({password: text}, function() {
      if (this.state.confirmPass && this.state.confirmPass !== this.state.password) {
        let newErrors = this.state.errors.slice();
        newErrors.push(errorMessages.passwordNotMatch);
        this.setState({errors: newErrors});
      }
    });
  }

  onChangePasswordConfirm(text) {
    if (this.state.errors.includes(errorMessages.passTooShort) || this.state.errors.includes(errorMessages.passNoNumber) || this.state.errors.includes(errorMessages.passNoLetter)) {
      this.setState({errors: []});
    }
    var index = this.state.errors.indexOf(errorMessages.passwordNotMatch);
    if (index !== -1) {
      let newErrors = this.state.errors.slice();
      newErrors.splice(index, 1);
      this.setState({errors: newErrors});
    }
    this.setState({confirmPass: text}, function() {
      if (this.state.confirmPass !== this.state.password) {
        let newErrors = this.state.errors.slice();
        newErrors.push(errorMessages.passwordNotMatch);
        this.setState({errors: newErrors});
      }
    });
  }

  register() {
    if (this.state.errors.length !== 0) {
      return;
    } else {
      fetch('https://aqueous-sierra-69526.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
      .then((data) => {
        data.json().then((message) => {
          console.log(message)
          if (message.success) {
            let newArray = [message]
            this.setState({success:newArray})
          } else {
            let newErrors = [];
            var validationErrors = message;
            validationErrors.forEach((error) => {
              newErrors.push(error.msg);
            });
            this.setState({errors: newErrors});
          }
        })
      })
      .catch((err) => {
        console.log('ERR', err);
      })
    }
  }

  render() {
    const { goBack, navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          onChangeText={(text) => this.onChangeUsername(text)}
        />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => this.onChangePassword(text)}
        />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Confirm Password"
          onChangeText={(text) => this.onChangePasswordConfirm(text)}
        />
        <View style={{height: 140, width: 350, alignItems: 'center', justifyContent: 'center'}}>
          {this.state.errors
            ? this.state.errors.map((error) =>
              (<Text key={error} style={styles.errors}>{error}</Text>))
            : '' }
          {this.state.success
            ? this.state.success.map((yay) =>
              (<Animatable.Text animation='pulse' direction='alternate' iterationCount='infinite'
                style={styles.success} key={yay.message}>
                {yay.message}
              </Animatable.Text>))
            : ''}
        </View>
        <TouchableOpacity onPress={ () => this.register() }>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => navigate('Login') }>
          <Text style={styles.loginText}>Go to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => goBack() }>
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
  text: {
    fontFamily: 'Hind-Light',
    fontSize: 20,
    color: '#5C5D67'
  },
  registerText: {
    fontFamily: 'Hind-Light',
    fontSize: 25,
    color: '#2191FB'
  },
  loginText: {
    fontFamily: 'Hind-Light',
    fontSize: 24,
    color: '#6A7FDB'
  },
  textInput: {
    fontFamily: 'Hind-Light',
    fontSize: 20,
    textAlign: 'left',
    borderBottomColor: '#57E2E5',
    borderBottomWidth: 1.5,
    width: 300,
    margin: 10,
    color: '#5C5D67'
  },
  errors: {
    color: '#6A7FDB',
    fontFamily: 'Hind-Light',
    fontSize: 13.5
  },
  success: {
    color: '#E08DAC',
    fontFamily: 'Hind-Light',
    fontSize: 15
  },
  register: {
    margin: 50
  }
});
