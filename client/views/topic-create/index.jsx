import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import IconReply from '@material-ui/icons/Reply';
import SnackBar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

import SimpleMDE from 'react-simplemde-editor';
import Container from '../layout/container';
import createStyles from './styles';
import { tabs } from '../../utils/variable-define';


@inject((stores) => {
  const { topicStore, appState } = stores;
  return {
    topicStore,
    appState,
  };
})
@observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      tab: 'dev',
      open: false,
      message: '',
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    });
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    });
  }

  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value,
    });
  }

  handleCreate() {
    const {
      tab,
      title,
      content,
    } = this.state;
    const { topicStore } = this.props;
    const { router } = this.context;
    if (!title) {
      this.showMessage('title 必须填写');
      return;
    }
    if (!content) {
      this.showMessage('内容必须填写');
      return;
    }
    topicStore.createTopic(title, tab, content)
      .then(() => {
        router.history.push('/list');
      })
      .catch((err) => {
        this.showMessage(err.message);
      });
  }

  showMessage(message) {
    this.setState({
      open: true,
      message,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const { classes } = this.props;
    const {
      message,
      open, title, newReply, tab,
    } = this.state;
    return (
      <Container>
        <SnackBar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={message}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="标题"
            value={title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            id="samplemdeCreateTopic"
            onChange={this.handleContentChange}
            value={newReply}
            className="samplemdeCreateTopic"
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: '发表你的精彩意见',
            }}
          />
          <div>
            {
              Object.keys(tabs).map((_tab) => {
                if (_tab !== 'all' && _tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={_tab}>
                      <Radio
                        value={_tab}
                        checked={_tab === tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[_tab]}
                    </span>
                  );
                }
                return null;
              })
            }
          </div>
          <Button fab="true" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    );
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
};

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(createStyles)(TopicCreate);
