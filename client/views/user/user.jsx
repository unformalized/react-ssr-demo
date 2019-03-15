import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';

import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

import UserIcon from '@material-ui/icons/AccountCircle';

import Container from '../layout/container';
import userStyles from './styles/user-style';

@inject((stores) => {
  const { appState } = stores;
  return {
    appState,
  };
})
@observer
class User extends React.Component {
  componentDidMount() {
    // do someting here
  }

  render() {
    const { classes, appState, children } = this.props;
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            appState.user.info.avatar_url
              ? (
                <Avatar
                  className={classes.avatarImg}
                  src={appState.user.info.avatar_url}
                />
              )
              : (
                <Avatar className={classes.avatarImg}>
                  <UserIcon />
                </Avatar>
              )
          }
          <span className={classes.userName}>{appState.user.info.loginname || '未登录'}</span>
        </div>
        {children}
      </Container>
    );
  }
}

User.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default withStyles(userStyles)(User);
