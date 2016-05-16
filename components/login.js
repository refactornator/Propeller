import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        <Text style={styles.label}>Host</Text>
        <TextInput style={styles.input}
          onChangeText={(host) => this.setState({host})}
          value={this.state.host}
          autoFocus={true}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry={true}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity onPress={this._onPressLoginButton}>
          <View style={styles.loginButton}>
            <LinearGradient colors={['#48C9D0', '#3498DB']} style={styles.linearGradient}>
              <Text style={styles.loginText}>Login</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 74,
    backgroundColor: '#273747',
  },
  label: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Courier',
  },
  input: {
    height: 32,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Courier',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    flex: 1,
    height: 44,
    marginTop: 20,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'transparent',
  },
  loginText: {
    color: 'white',
    fontFamily: 'Courier',
  }
});

module.exports = Login;
