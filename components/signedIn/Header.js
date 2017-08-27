import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Header extends React.Component {
  render() {
    const ohutu = [
      {letter: 'o', color: '#57E2E5'},
      {letter: 'h', color: '#6A7FDB'},
      {letter: 'u', color: '#E08DAC'},
      {letter: 't', color: '#2191FB'},
      {letter: 'u', color: '#57E2E5'}
    ];

    return (
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <View style={styles.navButton}>
            <TouchableOpacity onPress={this.props.navOptions}>
              <View>
                <Icon name='navicon' size={20} color='#2191FB' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerText}> {this.props.display} </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={styles.ohutu}>
            {ohutu.map((item, index) =>
              <Text key={index} style={{color: item.color}}>
                {item.letter}
              </Text>
            )}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEDFF',
    justifyContent: 'space-between',
    paddingTop: 19,
    paddingBottom: 10,
    paddingHorizontal: 15
  },
  headerText: {
    fontFamily: 'Hind-Light',
    fontSize: 20,
    color: '#2191FB'
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#EBF5FF',
    borderWidth: 2
  },
  ohutu: {
    fontSize: 25,
    fontFamily: 'BalooBhaijaan-Regular'
  }
});
