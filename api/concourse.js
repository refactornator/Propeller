import EventSource from 'react-native-eventsource';

let json = (response) => {
  return response.json();
};

class Concourse {
  constructor(host, token) {
    this.host = host;
    this.endpoint = `${host}/api/v1`;
    this.cookie = `ATC-Authorization=Basic ${token}`;
    this.baseOptions = {
      headers: {
        Cookie: this.cookie
      }
    };
  }

  fetchPipelines() {
    return fetch(`${this.endpoint}/pipelines`, this.baseOptions).then(json);
  }

  fetchJobs(pipelineName) {
    return fetch(
      `${this.endpoint}/pipelines/${pipelineName}/jobs`, this.baseOptions
    ).then(json);
  }

  fetchResources(pipelineName) {
    return fetch(`${this.endpoint}/pipelines/${pipelineName}/resources`, this.baseOptions);
  }

  fetchBuilds() {
    return fetch(`${this.endpoint}/builds`, this.baseOptions);
  }

  // Job build endpoints
  fetchBuild(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}`, this.baseOptions);
  }

  fetchBuildPreparation(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/preparation`, this.baseOptions);
  }

  fetchBuildPlan(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/plan`, this.baseOptions).then(json);
  }

  fetchBuildResources(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/resources`, this.baseOptions).then(json);
  }

  fetchBuildEvents(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/events`, this.baseOptions);
  }

  startBuild(pipeline, job) {
    return fetch(`${this.host}/pipelines/${pipeline}/jobs/${job}/builds`, Object.assign({}, this.baseOptions, {method: 'POST'}));
  }

  pause(pipeline) {
    return fetch(`${this.endpoint}/pipelines/${pipeline}/pause`, Object.assign({}, this.baseOptions, {method: 'PUT'}));
  }

  unpause(pipeline) {
    return fetch(`${this.endpoint}/pipelines/${pipeline}/unpause`, Object.assign({}, this.baseOptions, {method: 'PUT'}));
  }

  initEventSourceForBuild(buildId) {
    return new EventSource(`${this.endpoint}/builds/${buildId}/events`, this.cookie);
  }
}

module.exports = Concourse;
