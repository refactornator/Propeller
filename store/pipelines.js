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
  @observable concourse;
  @observable pipelines = [];

  constructor() {
    //this.refreshPipelines(WHERE_IS_CONCOURSE);
  }

  refreshPipelines() {
    return this.concourse.fetchPipelines()
      .then(pipelines => {
        extendObservable(this, {
          pipelines
        });
      });
  }
}

export default PipelinesStore;
