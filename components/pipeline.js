import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

const statusColors = {
  failed: '#E74C3C',
  paused: '#E74C3C',
  aborted: '#8F4B2D',
  errored: '#E67E22',
  succeeded: '#2ECC71'
}

class Pipeline extends Component {
  constructor(props) {
    super(props);

    props.store.concourse.fetchJobs(props.pipeline.name).then((jobs) => {
      this.setState({jobs, jobsFetched: true});
    });

    this.state = {jobs: [], jobsFetched: false, paused: props.pipeline.paused};
  }

  _onPressJobBar = (jobName, build, inputs) => {
    const {store, pipeline} = this.props;

    Actions.jobBuildSummary({text: pipeline.name, store, jobName, build, inputs});
  }

  _onPressPauseButton = () => {
    const {store, pipeline} = this.props;
    const {concourse} = store;

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
    const {jobs, paused, jobsFetched} = this.state;
    const {pipeline} = this.props;

    let jobBars = jobs.filter((job) => {
      return job.finished_build && job.finished_build.status !== 'succeeded'
    }).map((job) => {
      const status = job.finished_build.status;
      return (
        <View key={job.name}>
          <TouchableHighlight onPress={this._onPressJobBar.bind(this, job.name, job.finished_build, job.inputs)}>
            <View key={job.name} style={[styles.jobBar, {backgroundColor: statusColors[status]}]}>
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
          {jobsFetched ? (
            <TouchableHighlight onPress={this._onPressPauseButton}>
              <View style={[styles.button, paused ? styles.paused : styles.unpaused]}>
                {paused ? <Icon name="play" size={16} color="white" /> : <Icon name="pause" size={16} color="white" />}
              </View>
            </TouchableHighlight>
          ) : (
            <ActivityIndicatorIOS
              animating={true}
              style={[styles.centering, {height: 44, paddingRight: 12}]}
              size="small"
            />
          )}
        </View>
        {jobBars}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
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

module.exports = Pipeline;
