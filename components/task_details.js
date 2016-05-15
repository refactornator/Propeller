import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
  WebView
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import BuildHeader from './build_header';

var ansi_up = require('ansi_up');

const statusColors = {
  failed: '#E74C3C',
  paused: '#E74C3C',
  aborted: '#8F4B2D',
  errored: '#E67E22',
  succeeded: '#2ECC71'
}

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    const {concourse, messages, build, task} = props;
    const buildId = build.id;

    let tempLogs = messages.map((message) => {
      if(message.event === 'log') {
        if(task.id === message.data.origin.id) {
          let payload = message.data.payload.replace(new RegExp('\\r\\r', 'g'), '');
          let logline = ansi_up.ansi_to_html(ansi_up.escape_for_html(payload));
          return logline;
        }
      }
    });

    const html = `<html><body style='padding:10px; font-size:26px; font-weight:normal; line-height:1.4; color:#E6E7E8; background-color:#273747; font-family:monospace;'><pre>${tempLogs.join('')}</pre></body></html>`;

    this.state = {
      html
    };
  }

  render() {
    const {concourse, task, build} = this.props;

    const {html} = this.state;

    return (
      <View style={styles.container}>
        <View style={{height: 100}}>
          <BuildHeader concourse={concourse} build={build} />
          <View style={styles.taskBar}>
            <Text style={styles.taskName}>{task.name}</Text>
            <View style={styles.taskStatus}>
              {task.status === null ? <ActivityIndicatorIOS animating={true} style={[styles.centering, {paddingRight: 10}]} size="small" /> : null}
              {task.status === 'errored' ? <Icon name="exclamation-triangle" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null }
              {task.status === 'aborted' ? <Icon name="ban" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null }
              {task.status === 'succeeded' ? <Icon name="check" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null}
              {task.status === 'failed' ? <Icon name="times" size={14} color={statusColors[task.status]} style={styles.statusIcon} /> : null}
            </View>
          </View>
        </View>
        <WebView
          style={{
            flex: 1,
            paddingTop: 100,
            height: 667,
            backgroundColor: '#273747'
          }}
          source={{html}}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#273747',
  },
  logLine: {
    color: 'white',
    fontFamily: 'Courier',
  },
  taskBar: {
    backgroundColor: '#18212A',
    flexDirection: 'row',
    height: 44,
    marginBottom: 4,
    alignItems: 'center',
  },
  taskName: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
    fontFamily: 'Courier',
  },
  taskStatus: {
    width: 44,
    height: 43,
    marginTop: 1,
    paddingTop: 13
  },
  statusIcon: {
    alignSelf: 'center'
  },
});

module.exports = TaskDetails;
