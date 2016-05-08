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
} from 'react-native';

import PipelineSummary from './components/pipeline_summary';
import JobBuildSummary from './components/job_build_summary';
import InputDetails from './components/input_details';

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

class SingleProp extends Component {
  render() {
    let pipelines = [{"name":"main","url":"/pipelines/main","paused":false,"groups":[{"name":"apps-manager","jobs":["legacy-unit","legacy-deployment-pcf","legacy-integration-pcf","js-unit","js-deployment-pcf","js-integration-pcf","usage-unit","usage-deployment-pcf","usage-integration-pcf","create-pcf-release","js-deployment-pws-a1","js-deployment-pws-a1-edge","js-deployment-pws-prod"]},{"name":"docker","jobs":["build-base-docker-image","build-final-docker-image"],"resources":["apps-manager-base-dockerfile","apps-manager-final-dockerfile","apps-manager-js-base-docker-image","apps-manager-js-final-docker-image","apps-manager-js-package-json","legacy-gemfile","app-usage-service-gemfile","ubuntu-14.04"]}]},{"name":"salmon","url":"/pipelines/salmon","paused":false,"groups":[{"name":"salmon/example-aws","jobs":["build-runtime","acquire-environment-from-clean","manually-release-environment-to-dirty","upload-pivotal","configure-ert","import-stemcell","deploy-ert","run-cats"]},{"name":"housekeeping","jobs":["soil-unclaimed-clean-environments","acquire-environment-from-dirty","destroy-environment","deploy-ops-manager","configure-microbosh","deploy-microbosh","release-environment-to-clean"]}]},{"name":"environments","url":"/pipelines/environments","paused":false,"groups":[{"name":"mrblue","jobs":["mrblue-cloudformation","mrblue-bosh-deploy","mrblue-cf-deploy","mrblue-bosh-cleanup"]}]},{"name":"build-docker-image","url":"/pipelines/build-docker-image","paused":false,"groups":[{"name":"Docker Image Generation","jobs":["create-docker-image"]}]},{"name":"legacy","url":"/pipelines/legacy","paused":false}];

    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={{title: 'Pipeline Summary', kind: 'pipeline-summary'}}
        renderScene={(route, navigator) => {
          if(route.kind === 'pipeline-summary') {
            return (
              <PipelineSummary navigator={navigator} pipelines={pipelines} />
            );
          } else if(route.kind === 'build') {
            return (
              <JobBuildSummary navigator={navigator} build={route.build} inputs={route.inputs} />
            )
          } else if(route.kind === 'input') {
            return (
              <InputDetails navigator={navigator} build={route.build} input={route.input} />
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

AppRegistry.registerComponent('SingleProp', () => SingleProp);
