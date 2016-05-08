import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const statusColors = {
  failed: '#E74C3C',
  succeeded: '#2ECC71'
}

class BuildHeader extends Component {
  render() {
    const {job_name, build_number, status} = this.props;

    return (
      <View style={styles.page}>
        <Text style={[styles.header, {backgroundColor: statusColors[status]}]}>
          {job_name} #{build_number}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#273747',
  },
  header: {
    color: 'white',
    fontSize: 14,
    fontWeight: "700",
    padding: 10
  }
});

module.exports = BuildHeader;
