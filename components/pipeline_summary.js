import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ActivityIndicatorIOS,
} from 'react-native';
import {observer} from 'mobx-react/native';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/FontAwesome';

import Concourse from '../api/concourse';

const HOST_STORAGE_KEY = '@Propeller:HOST';
const TOKEN_STORAGE_KEY = '@Propeller:TOKEN';

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

    props.concourse.fetchJobs(props.pipeline.name).then((jobs) => {
      this.setState({jobs, jobsFetched: true});
    });

    this.state = {jobs: [], jobsFetched: false, paused: props.pipeline.paused};
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

@observer
class PipelineSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {loggedIn: false};

    try {
      AsyncStorage.multiGet([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY], (error, stores) => {
        let host, token;
        stores.forEach((store) => {
          let key = store[0];
          let value = store[1];
          if(key === HOST_STORAGE_KEY) {
            host = value;
          } else if (key === TOKEN_STORAGE_KEY) {
            token = value;
          }
        });
        if(host && token) {
          this.login(host, token);
        } else {
          console.log('not currently logged in');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  login(host, token) {
    const {store} = this.props;
    this.concourse = new Concourse(window.fetch, host, token);
    this.setState({loggedIn: true});
    store.refreshPipelines(this.concourse);
    AsyncStorage.multiSet([[HOST_STORAGE_KEY, host], [TOKEN_STORAGE_KEY, token]]);
  }

  logout() {
    this.concourse = null;
    this.setState({loggedIn: false});
    AsyncStorage.multiRemove([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  }

  onRefresh(page, callback, options) {
    const {store} = this.props;
    const pipelines = store.pipelines.slice();
    callback(pipelines);
  }

  renderRow(pipeline) {
    return (
      <Pipeline concourse={this.concourse} pipeline={pipeline} />
    );
  }

  render() {
    const {pipelines} = this.props.store;

    return (
      <View style={styles.container}>
        {pipelines.length === 0 ? null :
          <GiftedListView
            rowView={this.renderRow.bind(this)}
            onFetch={this.onRefresh.bind(this)}
            firstLoader={true} // display a loader for the first fetching
            pagination={false} // enable infinite scrolling using touch to load more
            refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
            withSections={false} // enable sections
            enableEmptySections={true}
            customStyles={{
              paginationView: {
                backgroundColor: '#273747'
              }
            }}
            refreshableTintColor="white"
          />
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#273747',
  },
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

module.exports = PipelineSummary;
