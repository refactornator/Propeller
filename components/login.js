import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import base64 from 'base-64';
import Icon from 'react-native-vector-icons/FontAwesome';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: '',
      username: '',
      password: ''
    };
  }
  _onPressLoginButton = () => {
    let {onLogin} = this.props;
    let {host, username, password} = this.state;

    let base64UsernamePassword = base64.encode(`${username}:${password}`);
    fetch(`${host}/login/basic`, {
      headers: {
        Authorization: `Basic ${base64UsernamePassword}`
      }
    }).then((response) => {
      if(response.status === 200) {
        let cookie = response.headers.map['set-cookie'][0];
        let token = cookie.substring(24, cookie.indexOf(';'));
        onLogin(host, token);
      }
    }).catch((error) => {
      Alert.alert('Login Failed', 'login failed, try again');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Host:</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(host) => this.setState({host})}
          value={this.state.host}
          autoFocus={true}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Text>Username:</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Text>Password:</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableHighlight onPress={this._onPressLoginButton}>
          <View style={styles.loginButton}>
            <Text>Login</Text>
          </View>
        </TouchableHighlight>
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
  loginButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = Login;
