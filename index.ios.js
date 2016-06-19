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
} from 'react-native';
import {Router, Scene} from 'react-native-mobx';
import Icon from 'react-native-vector-icons/FontAwesome';

import store from './store/pipelines';
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
          this.login(host, token, store);
        } else {
          console.log('not currently logged in');
        }
      });
    } catch (error) {
      console.log(error);
    }

    this.state = {loggedIn: false};
  }

  login(host, token, store) {
    this.setState({loggedIn: true});
    store.concourse = new Concourse(window.fetch, host, token);
    store.refreshPipelines();
    AsyncStorage.multiSet([[HOST_STORAGE_KEY, host], [TOKEN_STORAGE_KEY, token]]);
  }

  logout() {
    store.concourse = null;
    this.setState({loggedIn: false});
    AsyncStorage.multiRemove([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  }

  render() {
    const {loggedIn} = this.state;

    if(loggedIn) {
      return (
        <Router store={store}>
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
