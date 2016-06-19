/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {Router, Scene} from 'react-native-mobx';

import store from './store/pipelines';

import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './components/login';
import PipelineSummary from './components/pipeline_summary';
import JobBuildSummary from './components/job_build_summary';
import InputDetails from './components/input_details';
import TaskDetails from './components/task_details';

class Propeller extends Component {
  render() {
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
