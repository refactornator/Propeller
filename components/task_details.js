import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import BuildHeader from './build_header';
import Icon from 'react-native-vector-icons/FontAwesome';

class TaskDetails extends Component {
  render() {
    const {task, build} = this.props;

    return (
      <ScrollView style={styles.container}>
        <BuildHeader job_name={build.job_name} build_number={build.name} status={build.status} />
        <View style={styles.taskBar}>
          <Text style={styles.taskName}>{task.name}</Text>
          <View style={styles.taskStatus}>
            <Icon name="times" size={14} color="white" style={styles.statusIcon} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#273747',
  },
  taskBar: {
    backgroundColor: '#18212A',
    flexDirection: 'row',
    height: 44,
    marginBottom: 4,
    alignItems: 'center',
  },
  taskName: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
    fontFamily: 'Courier',
  },
  taskStatus: {
    width: 44,
    height: 43,
    marginTop: 1,
    paddingTop: 13,
    backgroundColor: '#E74C3C'
  },
  statusIcon: {
    alignSelf: 'center'
  },
});

module.exports = TaskDetails;
