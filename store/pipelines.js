import {
  extendObservable,
  reaction,
  observable,
  observe,
  computed,
  autorun
} from 'mobx';
import autobind from 'autobind-decorator';

import Concourse from '../api/concourse';

@autobind
class PipelinesStore {
  @observable concourse;
  @observable pipelines = [];

  initConcourse(host, token) {
    this.concourse = new Concourse(window.fetch, host, token);
  }

  refreshPipelines() {
    if (this.concourse) {
      return this.concourse.fetchPipelines()
        .then(pipelines => {
          extendObservable(this, {
            pipelines
          });
        });
    } else {
      console.log('tried to fetch pipelines, but concourse was not initialized.');
    }
  }
}

export default PipelinesStore;
