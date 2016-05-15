import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';
import moment from 'moment';
require('moment-duration-format');
import Icon from 'react-native-vector-icons/FontAwesome';

const BuildHeader = require('./build_header');

const statusColors = {
  failed: '#E74C3C',
  paused: '#E74C3C',
  aborted: '#8F4B2D',
  errored: '#E67E22',
  succeeded: '#2ECC71'
}

class JobBuildSummary extends Component {
  constructor(props) {
    super(props);
    const {concourse, build, inputs} = props;
    const buildId = build.id;

    this.state = {
      task: {},
      inputs,
      outputs: [],
      messages: []
    };

    concourse.fetchBuildResources(buildId).then((resources) => {
      this.setState({inputs: resources.inputs, outputs: resources.outputs});
    });

    concourse.fetchBuildPlan(buildId).then((plan) => {
      const task = {
        id: plan.plan.do[1].id,
        name: plan.plan.do[1].task.name,
        status: null
      };

      //populate input object with resource id
      let inputs = Object.assign([], this.state.inputs);
      inputs.forEach(input => {
        let inputResources = plan.plan.do[0].aggregate;
        inputResources.forEach(inputResource => {
          if(inputResource.get.name === input.name) {
            input.id = inputResource.id;
          }
        })
      });
      this.setState({inputs});

      let eventSource = concourse.initEventSourceForBuild(buildId);
      eventSource.onopen = () => {
        console.log('EventSource::onopen');
      };
      eventSource.onmessage = function(event) {
        let message, indexToReplace, inputToReplaceWith;
        try {
          message = JSON.parse(event.message);

          let newTask = Object.assign({}, task);
          if (message.event === 'finish-get') {
            indexToReplace = inputs.findIndex(input => input.name === message.data.plan.name);
            if(indexToReplace >= 0) {
              inputToReplaceWith = inputs[indexToReplace];
              if(message.data.exit_status === 0) {
                inputToReplaceWith.status = 'succeeded';
              } else if(message.data.exit_status > 0) {
                inputToReplaceWith.status = 'failed';
              }
              inputs.splice(indexToReplace, 1, inputToReplaceWith);
            }
          } else if (message.event === 'finish-task') {
            if(task.id === message.data.origin.id) {
              if(message.data.exit_status === 0) {
                newTask.status = 'succeeded';
              } else if (message.data.exit_status === 1) {
                newTask.status = 'failed';
              }
            }
          } else if (message.event === 'error') {
            if(task.id === message.data.origin.id) {
              if(message.data.message === 'interrupted') {
                newTask.status = 'aborted';
              } else {
                newTask.status = 'errored';
              }
            }
          } else if (message.event === 'log') {
            indexToReplace = inputs.findIndex(input => input.id === message.data.origin.id);
            if(indexToReplace >= 0) {
              inputToReplaceWith = Object.assign({}, inputs[indexToReplace]);
              if(inputToReplaceWith.logs == undefined) {
                inputToReplaceWith.logs = [];
              }
              inputToReplaceWith.logs.push(message.data.payload);
              inputs.splice(indexToReplace, 1, inputToReplaceWith);
            }
          }

          this.setState({inputs, task: newTask, messages: this.state.messages.concat([message])});
        } catch(error) {
          console.log(error);
        }
      }.bind(this);
      this.setState({task, eventSource});
    });
  }

  timeFromNow(timeFrom) {
    let now = moment();
    let time = moment.unix(timeFrom);
    let timeTotalHoursAgo = now.diff(time, 'hours');
    let timeDaysAgo = Math.floor(timeTotalHoursAgo / 24);
    let timeHoursAgo = timeTotalHoursAgo % 24;
    if(timeDaysAgo > 0) {
      return `${timeDaysAgo}d ${timeHoursAgo}h`;
    } else {
      return `${timeHoursAgo}h`;
    }
  }

  _onPressInputBar = (basicInput, build) => {
    const {navigator} = this.props;
    const {inputs} = this.state;

    const fullInput = inputs.find(input => basicInput.name === input.name);

    navigator.push({
      title: 'logs',
      kind: 'input',
      input: fullInput,
      build
    });
  }

  _onPressTaskBar = (task) => {
    const {navigator, build} = this.props;
    const {messages} = this.state;

    navigator.push({
      title: 'logs',
      kind: 'task',
      messages,
      build,
      task,
    });
  }

  render() {
    const {task, inputs} = this.state;
    const {concourse, build} = this.props;
    const {start_time, end_time} = build;

    let startTimeReadable = this.timeFromNow(start_time);
    let endTimeReadable = this.timeFromNow(end_time);
    let durationReadable = moment.duration(end_time - start_time, 's').format('d(d) h(h) m(m) s(s)', {
			escape: /\((.+?)\)/
		});

    const inputViews = inputs.map((input, index) => {
      return (
        <TouchableHighlight key={index} onPress={this._onPressInputBar.bind(this, input, build)}>
          <View style={styles.inputRow}>
            <Icon name="arrow-down" size={14} color="#B5BBC0" style={styles.arrowIcon} />
            <Text style={styles.inputName}>
              {input.name}
            </Text>
            <View style={styles.status}>
              {input.status === 'succeeded' ? <Icon name="check" size={14} color={statusColors[input.status]} style={styles.statusIcon} /> : null}
              {input.status === 'failed' ? <Icon name="times" size={14} color={statusColors[input.status]} style={styles.statusIcon} /> : null}
            </View>
          </View>
        </TouchableHighlight>
      );
    });

    let taskView;
    if(task) {
      let inputFailed = inputs.some(input => input.status === 'failed');
      taskView = (
        <TouchableHighlight onPress={this._onPressTaskBar.bind(this, task)}>
          <View key={task.id} style={styles.taskRow}>
            <Text style={styles.taskName}>{task.name}</Text>
            <View style={styles.taskStatus}>
              {inputFailed ? <Icon name="circle" size={14} color="#5D6D7E" style={styles.statusIcon} /> : null }
              {task.status === 'errored' ? <Icon name="exclamation-triangle" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null }
              {task.status === 'aborted' ? <Icon name="ban" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null }
              {!inputFailed && task.status === null ? <ActivityIndicatorIOS animating={true} style={[styles.centering, {paddingRight: 10}]} color="white" size="small" /> : null}
              {task.status === 'succeeded' ? <Icon name="check" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null}
              {task.status === 'failed' ? <Icon name="times" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null}
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      taskView = null;
    }

    return (
      <ScrollView style={styles.container}>
        <BuildHeader concourse={concourse} build={build} />

        <Text style={styles.time}>started {startTimeReadable} ago</Text>
        <Text style={styles.time}>ended {endTimeReadable} ago</Text>
        <Text style={styles.time}>duration {durationReadable}</Text>

        <View style={styles.inputs}>
          <Text style={styles.textHeader}>Inputs</Text>
          <View>{inputViews}</View>
        </View>

        <Text style={styles.textHeader}>Tasks</Text>
        {taskView}
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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: 'white',
    margin: 3,
    marginLeft: 10,
    padding: 3,
    paddingLeft: 0,
    fontFamily: 'Courier',
  },
  textHeader: {
    color: 'white',
    padding: 10,
    paddingBottom: 5,
    fontFamily: 'Courier',
  },
  inputs: {
    backgroundColor: '#34495E'
  },
  inputName: {
    flex: 1,
    paddingLeft: 4,
    color: '#B5BBC0',
    alignSelf: 'center',
    fontFamily: 'Courier',
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: '#5D6D7E',
    height: 44,
    paddingLeft: 10,
    marginBottom: 2
  },
  arrowIcon: {
    alignSelf: 'center',
  },
  status: {
    width: 44,
    height: 44,
    paddingTop: 14
  },
  statusIcon: {
    alignSelf: 'center'
  },
  taskRow: {
    flexDirection: 'row',
    backgroundColor: '#18212A',
    height: 44,
    paddingLeft: 10,
    marginBottom: 2
  },
  taskName: {
    flex: 1,
    color: '#B5BBC0',
    alignSelf: 'center',
    fontFamily: 'Courier',
  },
  taskStatus: {
    width: 44,
    height: 44,
    paddingTop: 14
  }
});

module.exports = JobBuildSummary;
