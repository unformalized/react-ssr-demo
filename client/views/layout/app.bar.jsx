import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  inject,
  observer,
} from 'mobx-react';

import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

const onHomeIconClick = () => {
  window.location.href = '/list?tab=all';
};

const createButtonClick = () => {
  window.location.href = '/topic/create';
};

@inject((stores) => {
  const { appState } = stores;
  return {
    appState,
  };
})
@observer
class MainAppBar extends React.Component {
  loginButtonClick() {
    const { appState } = this.props;
    if (appState.user.isLogin) {
      window.location.href = '/user/info';
    } else {
      window.location.href = '/user/login';
    }
  }

  render() {
    const { classes } = this.props;
    const { appState } = this.props;
    return (
      <div>
        <AppBar position="fixed" color="secondary">
          <ToolBar>
            <IconButton color="inherit" onClick={() => onHomeIconClick()}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              LNODE
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => createButtonClick()}>
              新建话题
            </Button>
            <Button color="inherit" onClick={() => this.loginButtonClick()}>
              {
                appState.user.isLogin ? appState.user.info.loginname : '登录'
              }
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
