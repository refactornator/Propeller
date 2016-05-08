import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const statusColors = {
  failed: '#E74C3C',
  succeeded: '#2ECC71'
}

class BuildHeader extends Component {
  _onPressStartJob = (jobName, build, inputs) => {

  }

  render() {
    const {job_name, build_number, status} = this.props;

    return (
      <View style={styles.row}>
        <Text style={[styles.title, {backgroundColor: statusColors[status]}]}>
          {job_name} #{build_number}
        </Text>
        <TouchableHighlight onPress={this._onPressStartJob}>
          <View style={[styles.button, {backgroundColor: statusColors[status]}]}>
            <Icon name="plus-circle" size={20} color="white" />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: 'white',
    paddingTop: 16,
    paddingLeft: 10,
    fontWeight: '700',
    fontFamily: 'Courier',
  },
  button: {
    flex: 0,
    width: 44,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

module.exports = BuildHeader;
