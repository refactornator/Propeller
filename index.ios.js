/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  StatusBar,
  View,
  Text
} from 'react-native';
import {Router, Scene} from 'react-native-mobx';
import Icon from 'react-native-vector-icons/FontAwesome';

import PipelinesStore from './store/pipelines';
import Concourse from './api/concourse';

import Login from './components/login';
import PipelineSummary from './components/pipeline_summary';
import JobBuildSummary from './components/job_build_summary';
import InputDetails from './components/input_details';
import TaskDetails from './components/task_details';

const HOST_STORAGE_KEY = '@Propeller:HOST';
const TOKEN_STORAGE_KEY = '@Propeller:TOKEN';

class Propeller extends Component {
  constructor(props) {
    super(props);

    this.store = new PipelinesStore();

    try {
      AsyncStorage.multiGet([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY], (error, stuff) => {
        let host, token;
        stuff.forEach((thing) => {
          let key = thing[0];
          let value = thing[1];
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

    this.state = {loading: true, loggedIn: false};
  }

  login(host, token) {
    this.setState({loading: false, loggedIn: true});
    this.store.concourse = new Concourse(window.fetch, host, token);
    this.store.refreshPipelines();
    AsyncStorage.multiSet([[HOST_STORAGE_KEY, host], [TOKEN_STORAGE_KEY, token]]);
  }

  logout() {
    this.store.concourse = null;
    this.setState({loading: false, loggedIn: false});
    AsyncStorage.multiRemove([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  }

  render() {
    const {loading, loggedIn} = this.state;

    if(loading) {
      return <View><Text>Loading...</Text></View>;
    } else {
      if(loggedIn) {
        return (
          <Router store={this.store}>
            <Scene key="root" navigationBarStyle={styles.navigationBarStyle} titleStyle={styles.titleStyle}>
              <Scene key="pipelineSummary" component={PipelineSummary} title="Pipeline Summary"/>
              <Scene key="jobBuildSummary" component={JobBuildSummary} title="Job Build Summary"/>
              <Scene key="inputDetails" component={InputDetails} title="logs"/>
              <Scene key="taskDetails" component={TaskDetails} title="logs"/>
            </Scene>
          </Router>
        );
      } else {
        return <Scene key="login" component={Login} title="Login"/>;
      }
    }
  }
}

const styles = StyleSheet.create({
  navigationBarStyle: {
    backgroundColor: '#19252F',
    borderBottomColor: '#273747'
  },
  titleStyle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Courier'
  }
});

StatusBar.setBarStyle('light-content', true);

AppRegistry.registerComponent('Propeller', () => Propeller);
