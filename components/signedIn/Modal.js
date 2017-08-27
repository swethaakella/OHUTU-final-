import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  AsyncStorage,
  Modal,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class DescModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal animationType={'slide'} transparent={true} visible={this.props.visible}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.textBubble}>
              <Text style={styles.headerText}> Write a lil' blurb about this pin. </Text>
              <Text style={styles.captionText}> (40 character max) </Text>
              <TextInput onChangeText={this.props.changeText} maxLength={40} multiline={true} style={styles.input} placeholder="Type description here..."></TextInput>
              <TouchableOpacity onPress={this.props.hide}>
                <Text style={styles.close}> Done </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textBubble: {
    marginTop: 150,
    height: 250,
    width: 300,
    backgroundColor: '#DCEDFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    marginTop: 15,
    fontFamily: 'Hind-Light',
    textAlign: 'center',
    fontSize: 20,
    color: '#6A7FDB'
  },
  captionText: {
    fontFamily: 'Hind-Light',
    textAlign: 'center',
    fontSize: 10,
    color: '#5C5D67'
  },
  input: {
    margin: 15,
    fontFamily: 'Hind-Light',
    fontSize: 15,
    textAlign: 'left',
    justifyContent: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#57E2E5',
    borderRadius: 10,
    width: 250,
    height: 90,
    color: '#5C5D67',
    padding: 10
  },
  close: {
    fontFamily: 'Hind-Light',
    textAlign: 'center',
    fontSize: 15,
    color: '#E08DAC'
  }
})
