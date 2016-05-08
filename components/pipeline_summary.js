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

    if(pipelineName === 'main') {
      this.state = {
        jobs: [{"name":"build-base-docker-image","url":"/pipelines/main/jobs/build-base-docker-image","next_build":null,"finished_build":{"id":5355,"name":"25","status":"succeeded","job_name":"build-base-docker-image","url":"/pipelines/main/jobs/build-base-docker-image/builds/25","api_url":"/api/v1/builds/5355","pipeline_name":"main","start_time":1462317364,"end_time":1462318330},"inputs":[{"name":"ci","resource":"ci","trigger":false},{"name":"apps-manager-base-dockerfile","resource":"apps-manager-base-dockerfile","trigger":true},{"name":"ubuntu-14.04","resource":"ubuntu-14.04","trigger":true}],"outputs":[{"name":"apps-manager-js-base-docker-image","resource":"apps-manager-js-base-docker-image"}],"groups":["docker"]},{"name":"build-final-docker-image","url":"/pipelines/main/jobs/build-final-docker-image","next_build":null,"finished_build":{"id":5411,"name":"87","status":"succeeded","job_name":"build-final-docker-image","url":"/pipelines/main/jobs/build-final-docker-image/builds/87","api_url":"/api/v1/builds/5411","pipeline_name":"main","start_time":1462404881,"end_time":1462406185},"inputs":[{"name":"ci","resource":"ci","trigger":false},{"name":"app-usage-service-gemfile","resource":"app-usage-service-gemfile","trigger":true},{"name":"legacy-gemfile","resource":"legacy-gemfile","trigger":true},{"name":"apps-manager-js-package-json","resource":"apps-manager-js-package-json","trigger":true},{"name":"apps-manager-final-dockerfile","resource":"apps-manager-final-dockerfile","trigger":true},{"name":"apps-manager-js-base-docker-image","resource":"apps-manager-js-base-docker-image","passed":["build-base-docker-image"],"trigger":true}],"outputs":[{"name":"apps-manager-js-final-docker-image","resource":"apps-manager-js-final-docker-image"}],"groups":["docker"]},{"name":"legacy-unit","url":"/pipelines/main/jobs/legacy-unit","next_build":null,"finished_build":{"id":5448,"name":"285","status":"succeeded","job_name":"legacy-unit","url":"/pipelines/main/jobs/legacy-unit/builds/285","api_url":"/api/v1/builds/5448","pipeline_name":"main","start_time":1462484640,"end_time":1462484862},"inputs":[{"name":"legacy","resource":"legacy","trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"legacy-deployment-pcf","url":"/pipelines/main/jobs/legacy-deployment-pcf","next_build":null,"finished_build":{"id":5449,"name":"198","status":"succeeded","job_name":"legacy-deployment-pcf","url":"/pipelines/main/jobs/legacy-deployment-pcf/builds/198","api_url":"/api/v1/builds/5449","pipeline_name":"main","start_time":1462484866,"end_time":1462485089},"inputs":[{"name":"legacy","resource":"legacy","passed":["legacy-unit"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"legacy-integration-pcf","url":"/pipelines/main/jobs/legacy-integration-pcf","next_build":null,"finished_build":{"id":5450,"name":"159","status":"failed","job_name":"legacy-integration-pcf","url":"/pipelines/main/jobs/legacy-integration-pcf/builds/159","api_url":"/api/v1/builds/5450","pipeline_name":"main","start_time":1462485091,"end_time":1462485737},"inputs":[{"name":"legacy","resource":"legacy","passed":["legacy-deployment-pcf"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"js-unit","url":"/pipelines/main/jobs/js-unit","next_build":null,"finished_build":{"id":5476,"name":"221","status":"succeeded","job_name":"js-unit","url":"/pipelines/main/jobs/js-unit/builds/221","api_url":"/api/v1/builds/5476","pipeline_name":"main","start_time":1462555955,"end_time":1462556030},"inputs":[{"name":"js","resource":"js","trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"js-deployment-pcf","url":"/pipelines/main/jobs/js-deployment-pcf","next_build":null,"finished_build":{"id":5468,"name":"205","status":"succeeded","job_name":"js-deployment-pcf","url":"/pipelines/main/jobs/js-deployment-pcf/builds/205","api_url":"/api/v1/builds/5468","pipeline_name":"main","start_time":1462495779,"end_time":1462496028},"inputs":[{"name":"js","resource":"js","passed":["js-unit"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"js-integration-pcf","url":"/pipelines/main/jobs/js-integration-pcf","next_build":null,"finished_build":{"id":5471,"name":"189","status":"succeeded","job_name":"js-integration-pcf","url":"/pipelines/main/jobs/js-integration-pcf/builds/189","api_url":"/api/v1/builds/5471","pipeline_name":"main","start_time":1462496036,"end_time":1462496232},"inputs":[{"name":"js","resource":"js","passed":["js-deployment-pcf"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[{"name":"pcf-screenshots","resource":"pcf-screenshots"}],"groups":["apps-manager"]},{"name":"usage-unit","url":"/pipelines/main/jobs/usage-unit","next_build":null,"finished_build":{"id":5104,"name":"25","status":"succeeded","job_name":"usage-unit","url":"/pipelines/main/jobs/usage-unit/builds/25","api_url":"/api/v1/builds/5104","pipeline_name":"main","start_time":1461711893,"end_time":1461712055},"inputs":[{"name":"usage","resource":"usage","trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"usage-deployment-pcf","url":"/pipelines/main/jobs/usage-deployment-pcf","next_build":null,"finished_build":{"id":5105,"name":"17","status":"succeeded","job_name":"usage-deployment-pcf","url":"/pipelines/main/jobs/usage-deployment-pcf/builds/17","api_url":"/api/v1/builds/5105","pipeline_name":"main","start_time":1461712057,"end_time":1461712206},"inputs":[{"name":"usage","resource":"usage","passed":["usage-unit"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"usage-integration-pcf","url":"/pipelines/main/jobs/usage-integration-pcf","next_build":null,"finished_build":{"id":5106,"name":"15","status":"succeeded","job_name":"usage-integration-pcf","url":"/pipelines/main/jobs/usage-integration-pcf/builds/15","api_url":"/api/v1/builds/5106","pipeline_name":"main","start_time":1461712210,"end_time":1461712311},"inputs":[{"name":"usage","resource":"usage","passed":["usage-deployment-pcf"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"create-pcf-release","url":"/pipelines/main/jobs/create-pcf-release","next_build":null,"finished_build":{"id":5357,"name":"169","status":"succeeded","job_name":"create-pcf-release","url":"/pipelines/main/jobs/create-pcf-release/builds/169","api_url":"/api/v1/builds/5357","pipeline_name":"main","start_time":1462317909,"end_time":1462318208},"inputs":[{"name":"js","resource":"js","passed":["js-integration-pcf"],"trigger":false},{"name":"legacy","resource":"legacy","passed":["legacy-integration-pcf"],"trigger":false},{"name":"usage","resource":"usage","passed":["usage-integration-pcf"],"trigger":false},{"name":"ci","resource":"ci","trigger":false},{"name":"release","resource":"release","trigger":false},{"name":"release-tarball","resource":"release-tarball","trigger":false}],"outputs":[{"name":"release","resource":"release"},{"name":"release-tarball","resource":"release-tarball"},{"name":"release-tarball-md5","resource":"release-tarball-md5"},{"name":"release-metadata","resource":"release-metadata"}],"groups":["apps-manager"]},{"name":"js-deployment-pws-a1","url":"/pipelines/main/jobs/js-deployment-pws-a1","next_build":null,"finished_build":{"id":5478,"name":"139","status":"succeeded","job_name":"js-deployment-pws-a1","url":"/pipelines/main/jobs/js-deployment-pws-a1/builds/139","api_url":"/api/v1/builds/5478","pipeline_name":"main","start_time":1462579537,"end_time":1462579631},"inputs":[{"name":"js","resource":"js","passed":["js-integration-pcf"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[{"name":"js-deployed-to-a1","resource":"js-deployed-to-a1"}],"groups":["apps-manager"]},{"name":"js-deployment-pws-a1-edge","url":"/pipelines/main/jobs/js-deployment-pws-a1-edge","next_build":null,"finished_build":{"id":5479,"name":"138","status":"succeeded","job_name":"js-deployment-pws-a1-edge","url":"/pipelines/main/jobs/js-deployment-pws-a1-edge/builds/138","api_url":"/api/v1/builds/5479","pipeline_name":"main","start_time":1462579543,"end_time":1462579640},"inputs":[{"name":"js","resource":"js","passed":["js-integration-pcf"],"trigger":true},{"name":"ci","resource":"ci","trigger":false}],"outputs":[],"groups":["apps-manager"]},{"name":"js-deployment-pws-prod","url":"/pipelines/main/jobs/js-deployment-pws-prod","next_build":null,"finished_build":{"id":4833,"name":"6","status":"succeeded","job_name":"js-deployment-pws-prod","url":"/pipelines/main/jobs/js-deployment-pws-prod/builds/6","api_url":"/api/v1/builds/4833","pipeline_name":"main","start_time":1461197711,"end_time":1461197933},"inputs":[{"name":"js","resource":"js","passed":["js-integration-pcf"],"trigger":false},{"name":"ci","resource":"ci","trigger":false}],"outputs":[{"name":"js-deployed-to-prod","resource":"js-deployed-to-prod"}],"groups":["apps-manager"]}]
      };
    } else {
      this.state = { jobs: [] };
    }
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
      return job.finished_build.status === 'failed'
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
          <Jobs navigator={navigator} pipelineName={pipeline.name} />
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
    paddingLeft: 10
  },
});

module.exports = PipelineSummary;
