import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import UserWrapper from './user';
import loginStyles from './styles/login-style';

@inject((stores) => {
  const { appState } = stores;
  return {
    appState,
    user: appState.user,
  };
}) @observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      accesstoken: '',
      helpText: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  getFrom(_location) {
    const { location } = this.props;
    _location = _location || location;
    const query = queryString.parse(_location.search);
    return query.from || '/user/info';
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    });
  }

  handleLogin() {
    const { accesstoken } = this.state;
    const { appState } = this.props;
    if (!accesstoken) {
      return this.setState({
        helpText: '必须填写',
      });
    }
    this.setState({
      helpText: '',
    });
    return appState.login(accesstoken)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes, user } = this.props;
    const { helpText, accesstoken } = this.state;
    const from = this.getFrom();
    const { isLogin } = user;
    if (isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={helpText}
            value={accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserWrapper>
    );
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(loginStyles)(UserLogin);
