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

class InputDetails extends Component {
  render() {
    const {input, build} = this.props;

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
        <BuildHeader job_name={build.job_name} build_number={build.name} status={build.status} />
        <View style={styles.jobBar}>
          <Text style={styles.input}>{input.name}</Text>
          <Icon style={styles.jobBarIcon} name="check" size={16} color="white" />
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
    color: 'white',
    padding: 14,
    backgroundColor: '#2FCC71'
  },
  details: {
    color: 'white',
    fontFamily: 'Courier',
  }
});

module.exports = InputDetails;
