import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { observer } from 'mobx-react/native';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/FontAwesome';

import Concourse from '../api/concourse';

import Pipeline from './pipeline';

const HOST_STORAGE_KEY = '@Propeller:HOST';
const TOKEN_STORAGE_KEY = '@Propeller:TOKEN';

const statusColors = {
  failed: '#E74C3C',
  paused: '#E74C3C',
  aborted: '#8F4B2D',
  errored: '#E67E22',
  succeeded: '#2ECC71'
}

@observer
class PipelineSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {loggedIn: false};

    try {
      AsyncStorage.multiGet([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY], (error, stores) => {
        let host, token;
        stores.forEach((store) => {
          let key = store[0];
          let value = store[1];
          if(key === HOST_STORAGE_KEY) {
            host = value;
          } else if (key === TOKEN_STORAGE_KEY) {
            token = value;
          }
        });
        if(host && token) {
          this.login(host, token);
        } else {
          console.log('not currently logged in');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  login(host, token) {
    const {store} = this.props;
    this.concourse = new Concourse(window.fetch, host, token);
    this.setState({loggedIn: true});
    store.refreshPipelines(this.concourse);
    AsyncStorage.multiSet([[HOST_STORAGE_KEY, host], [TOKEN_STORAGE_KEY, token]]);
  }

  logout() {
    this.concourse = null;
    this.setState({loggedIn: false});
    AsyncStorage.multiRemove([HOST_STORAGE_KEY, TOKEN_STORAGE_KEY]);
  }

  onRefresh(page, callback, options) {
    const {store} = this.props;
    const pipelines = store.pipelines.slice();
    callback(pipelines);
  }

  renderRow(pipeline) {
    return (
      <Pipeline concourse={this.concourse} pipeline={pipeline} />
    );
  }

  render() {
    const {pipelines} = this.props.store;

    return (
      <View style={styles.container}>
        {pipelines.length === 0 ? null :
          <GiftedListView
            rowView={this.renderRow.bind(this)}
            onFetch={this.onRefresh.bind(this)}
            firstLoader={true} // display a loader for the first fetching
            pagination={false} // enable infinite scrolling using touch to load more
            refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
            withSections={false} // enable sections
            enableEmptySections={true}
            customStyles={{
              paginationView: {
                backgroundColor: '#273747'
              }
            }}
            refreshableTintColor="white"
          />
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#273747',
  }
});

module.exports = PipelineSummary;
