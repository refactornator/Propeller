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

class JobBuildSummary extends Component {
  constructor(props) {
    super(props);
    const {concourse, build} = props;
    const buildId = build.id;

    this.state = {
      task: {},
      resources: {
        'inputs': [],
        'outputs': []
      },
      messages: []
    };

    concourse.fetchBuildResources(buildId).then((resources) => {
      this.setState({resources});
    });

    concourse.fetchBuildPlan(buildId).then((plan) => {
      const task = {
        id: plan.plan.do[1].id,
        name: plan.plan.do[1].task.name,
        status: null
      };
      let eventSource = concourse.initEventSourceForBuild(buildId);
      eventSource.onopen = () => {
        console.log('EventSource::onopen');
      };
      eventSource.onmessage = (event) => {
        let message;
        try {
          message = JSON.parse(event.message);

          if (message.event === 'finish-task') {
            if(task.id === message.data.origin.id) {
              const newTask = Object.assign({}, task, {status: message.data.exit_status});
              this.setState({task: newTask});
            }
          }

          this.setState({messages: this.state.messages.concat([message])});
        } catch(error) {
          console.log(error);
        }
      };
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
    const fullInput = this.state.resources.inputs.find((inputResource) => {
      return basicInput.name === inputResource.name;
    });

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
    const {task} = this.state;
    const {concourse, build, inputs} = this.props;
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
              <Icon name="check" size={14} color="#1DC762" style={styles.statusIcon} />
            </View>
          </View>
        </TouchableHighlight>
      );
    });

    let taskView;
    if(task) {
      taskView = (
        <TouchableHighlight onPress={this._onPressTaskBar.bind(this, task)}>
          <View key={task.id} style={styles.taskRow}>
            <Text style={styles.taskName}>{task.name}</Text>
            <View style={styles.taskStatus}>
              {task.status === null ? <ActivityIndicatorIOS animating={true} style={[styles.centering, {paddingRight: 10}]} size="small" /> : null}
              {task.status === 0 ? <Icon name="check" size={14} color="#1DC762" style={styles.statusIcon} /> : null}
              {task.status === 1 ? <Icon name="times" size={14} color="#E74C3C" style={styles.statusIcon} /> : null}
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
