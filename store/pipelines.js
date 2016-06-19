import {
  extendObservable,
  reaction,
  observable,
  observe,
  computed,
  autorun
} from 'mobx';
import autobind from 'autobind-decorator'

@autobind
class PipelinesStore {
  @observable pipelines = [];

  constructor() {
    //this.refreshPipelines(WHERE_IS_CONCOURSE);
  }

  refreshPipelines(concourse) {
    return concourse.fetchPipelines()
      .then(pipelines => {
        extendObservable(this, {
          pipelines
        });
      });
  }
}

export default new PipelinesStore();
