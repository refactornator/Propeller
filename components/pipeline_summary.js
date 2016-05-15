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

class Pipeline extends Component {
  constructor(props) {
    super(props);

    this.props.concourse.fetchJobs(props.pipeline.name).then((jobs) => {
      this.setState({jobs});
    });

    this.state = {jobs: [], paused: props.pipeline.paused};
  }

  _onPressJobBar = (jobName, build, inputs) => {
    const {navigator, pipeline} = this.props;

    navigator.push({
      title: pipeline.name,
      kind: 'build',
      jobName,
      build,
      inputs
    });
  }

  _onPressPauseButton = () => {
    const {concourse, pipeline} = this.props;

    this.setState({paused: !this.state.paused});
    
    if(pipeline.paused) {
      concourse.unpause(pipeline.name).then(response => {
        if(response.status === 200) {
          //everything worked a-ok, trigger pipeline refresh
        } else {
          this.setState({paused: true});
        }
      });
    } else {
      concourse.pause(pipeline.name).then(response => {
        if(response.status === 200) {
          //everything worked a-ok, trigger pipeline refresh
        } else {
          this.setState({paused: false});
        }
      });
    }
  }

  render() {
    const {jobs, paused} = this.state;
    const {pipeline} = this.props;

    let jobBars = jobs.filter((job) => {
      return job.finished_build && job.finished_build.status === 'failed'
    }).map((job) => {
      return (
        <View key={job.name}>
          <TouchableHighlight onPress={this._onPressJobBar.bind(this, job.name, job.finished_build, job.inputs)}>
            <View key={job.name} style={styles.jobBar}>
              <Icon style={styles.jobBarIcon} name="times" size={16} color="white" /><Text style={styles.jobName}>{job.name}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    });

    return (
      <View>
        <View style={styles.pipelineRow}>
          <Text style={styles.pipelineName}>{pipeline.name}</Text>
          <TouchableHighlight onPress={this._onPressPauseButton}>
            <View style={[styles.button, paused ? styles.paused : styles.unpaused]}>
              {paused ? <Icon name="play" size={16} color="white" /> : <Icon name="pause" size={16} color="white" />}
            </View>
          </TouchableHighlight>
        </View>
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
          <Pipeline concourse={this.props.concourse} navigator={navigator} pipeline={pipeline} />
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
