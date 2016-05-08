import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class PipelineSummary extends Component {
  render() {
    const {pipelines} = this.props;

    const pipelineViews = pipelines.map((pipeline) => {
      return (
        <View key={pipeline.name} style={styles.pipelineRow}>
          <Text style={styles.pipelineName}>{pipeline.name}</Text>
          <TouchableHighlight onPress={this._onPressButton}>
            <View style={[styles.button, styles.paused]}>
              <Icon name="play" size={16} color="white" />
            </View>
          </TouchableHighlight>
        </View>
      );
    });

    return (
      <ScrollView style={styles.container}>
        {pipelineViews}
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
  pipelineRow: {
    height: 44,
    backgroundColor: '#19252F',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  pipelineName: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
    alignSelf: 'center'
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  paused: {
    backgroundColor: '#3498DB'
  },
  unpaused: {
    backgroundColor: '#5D6D7E'
  },
});

module.exports = PipelineSummary;
