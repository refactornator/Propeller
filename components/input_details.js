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

const statusColors = {
  failed: '#E74C3C',
  paused: '#E74C3C',
  aborted: '#8F4B2D',
  errored: '#E67E22',
  succeeded: '#2ECC71'
}

class InputDetails extends Component {
  render() {
    const {store, input, build} = this.props;
    const {concourse} = this.props;

    const metadata = input.metadata.map((line, i) => {
      return (
        <View key={i} style={styles.metadata}>
          <Text style={[styles.name, styles.details]}>{line.name}</Text>
          <Text style={[styles.value, styles.details]}>{line.value}</Text>
        </View>
      )
    });

    return (
      <ScrollView style={styles.container}>
        <BuildHeader concourse={concourse} build={build} />
        <View style={styles.jobBar}>
          <Text style={styles.input}>{input.name}</Text>
          {input.status === 'succeeded' ? <Icon name="check" size={14} color={statusColors[input.status]} style={styles.jobBarIcon} /> : null}
          {input.status === 'failed' ? <Icon name="times" size={14} color={statusColors[input.status]} style={styles.jobBarIcon} /> : null}
        </View>
        <View style={{padding: 10}}>
          <Text style={styles.details}>ref {input.version.ref}</Text>
          <Text style={styles.details}>{input.first_occurrence ? '' : 'using version of resource found in cache'}</Text>
          {metadata}
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
  metadata: {
    flexDirection: 'row'
  },
  name: {
    flex: 2
  },
  value: {
    flex: 4
  },
  jobBar: {
    backgroundColor: '#5D6D7E',
    flexDirection: 'row',
    height: 44,
    marginBottom: 4,
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Courier',
    color: 'white',
    flex: 1,
    paddingLeft: 10
  },
  jobBarIcon: {
    paddingRight: 10,
    flex: 0,
    width: 44,
    height: 44,
    padding: 14
  },
  details: {
    color: 'white',
    fontFamily: 'Courier',
  }
});

module.exports = InputDetails;
