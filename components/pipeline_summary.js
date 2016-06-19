import React, { Component } from 'react';
import {
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

import Pipeline from './pipeline';

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
  }

  onRefresh(page, callback, options) {
    const {store} = this.props;
    const pipelines = store.pipelines.slice();
    callback(pipelines);
  }

  renderRow(pipeline) {
    const {store} = this.props;

    return (
      <Pipeline store={store} pipeline={pipeline} />
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
