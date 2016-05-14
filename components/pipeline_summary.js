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

class Jobs extends Component {
  constructor(props) {
    super(props);

    const {pipelineName} = this.props;

    this.props.concourse.fetchJobs(pipelineName).then((jobs) => {
      this.setState({jobs});
    });

    this.state = {jobs: []};
  }

  _onPressJobBar = (jobName, build, inputs) => {
    const {navigator, pipelineName} = this.props;

    navigator.push({
      title: pipelineName,
      kind: 'build',
      jobName,
      build,
      inputs
    });
  }

  render() {
    const {jobs} = this.state;

    let jobBars = jobs.filter((job) => {
      return job.finished_build && job.finished_build.status === 'failed'
    }).map((job) => {
      return (
        <View key={job.name}>
          <TouchableHighlight onPress={this._onPressJobBar.bind(this, job.name, job.finished_build, job.inputs)}>
            <View key={job.name} style={styles.jobBar} onPress={this._onPressJobBar}>
              <Icon style={styles.jobBarIcon} name="times" size={16} color="white" /><Text style={styles.jobName}>{job.name}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    });

    return (
      <View>
        {jobBars}
      </View>
    );
  }
}

class PipelineSummary extends Component {
  render() {
    const {navigator, pipelines} = this.props;

    const pipelineViews = pipelines.map((pipeline) => {
      return (
        <View key={pipeline.name}>
          <View style={styles.pipelineRow}>
            <Text style={styles.pipelineName}>{pipeline.name}</Text>
            <TouchableHighlight onPress={this._onPressButton}>
              <View style={[styles.button, styles.paused]}>
                <Icon name="play" size={16} color="white" />
              </View>
            </TouchableHighlight>
          </View>
          <Jobs concourse={this.props.concourse} navigator={navigator} pipelineName={pipeline.name} />
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
    fontFamily: 'Courier',
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
  jobBar: {
    flexDirection: 'row',
    height: 44,
    marginBottom: 4,
    alignItems: 'center',
    backgroundColor: '#E74C3C'
  },
  jobBarIcon: {
    paddingLeft: 10
  },
  jobName: {
    color: 'white',
    fontFamily: 'Courier',
    paddingLeft: 10
  },
});

module.exports = PipelineSummary;
