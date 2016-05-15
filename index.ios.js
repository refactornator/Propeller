/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
} from 'react-native';

import Concourse from './api/concourse';

import Login from './components/login';
import PipelineSummary from './components/pipeline_summary';
import JobBuildSummary from './components/job_build_summary';
import InputDetails from './components/input_details';
import TaskDetails from './components/task_details';

let HOST_STORAGE_KEY = '@Propeller:HOST';
let TOKEN_STORAGE_KEY = '@Propeller:TOKEN';

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {`< ${route.title}`}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    if(route.kind === 'pipeline-summary') {
      return (
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          {route.title}
        </Text>
      );
    } else {
      return null;
    }
  },

};

class Propeller extends Component {
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

  refreshPipelines() {
    return this.concourse.fetchPipelines().then(pipelines => {
      this.setState({pipelines});
      return pipelines;
    });
  }

  login = (host, token) => {
    this.concourse = new Concourse(host, token);
    this.setState({loggedIn: true});
    this.refreshPipelines().then(() => {
      return AsyncStorage.multiSet([[HOST_STORAGE_KEY, host], [TOKEN_STORAGE_KEY, token]]);
    });
  };

  render() {
    let {pipelines} = this.state;

    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={{title: 'Pipeline Summary', kind: 'pipeline-summary'}}
        renderScene={(route, navigator) => {
          if(!this.state.loggedIn) {
            return (
              <Login onLogin={this.login} />
            );
          }

          if(route.kind === 'pipeline-summary') {
            return (
              <PipelineSummary concourse={this.concourse} navigator={navigator} pipelines={pipelines} refreshPipelines={this.refreshPipelines.bind(this)} />
            );
          } else if(route.kind === 'build') {
            return (
              <JobBuildSummary concourse={this.concourse} navigator={navigator} build={route.build} inputs={route.inputs} />
            )
          } else if(route.kind === 'input') {
            return (
              <InputDetails concourse={this.concourse} navigator={navigator} build={route.build} input={route.input} />
            )
          } else if(route.kind === 'task') {
            return (
              <TaskDetails concourse={this.concourse} navigator={navigator} build={route.build} task={route.task} messages={route.messages} />
            )
          }
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#273747',
  },
  navBar: {
    backgroundColor: '#19252F',
  },
  navBarText: {
    fontFamily: 'Courier',
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: 'white',
    fontFamily: 'Courier',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
});

StatusBar.setBarStyle('light-content', true);

AppRegistry.registerComponent('Propeller', () => Propeller);
