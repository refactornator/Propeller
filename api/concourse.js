let json = (response) => {
  return response.json();
};

class Concourse {
  constructor(host, token) {
    this.endpoint = `${host}/api/v1`;
    this.cookie = `ATC-Authorization=Basic ${token}`;
    this.baseOptions = {
      headers: {
        Cookie: this.cookie
      }
    };
  }

  fetchPipelines() {
    return fetch(`${this.endpoint}/pipelines`, this.baseOptions);
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
    return fetch(`${this.endpoint}/builds/${buildId}/plan`, this.baseOptions);
  }

  fetchBuildResources(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/resources`, this.baseOptions);
  }

  fetchBuildEvents(buildId) {
    return fetch(`${this.endpoint}/builds/${buildId}/events`, this.baseOptions);
  }

  pause(pipeline) {
    return fetch(`${this.endpoint}/pipelines/${pipeline}/pause`, Object.assign({}, this.baseOptions, {method: 'PUT'}));
  }

  unpause(pipeline) {
    return fetch(`${this.endpoint}/pipelines/${pipeline}/unpause`, Object.assign({}, this.baseOptions, {method: 'PUT'}));
  }
}

module.exports = Concourse;
