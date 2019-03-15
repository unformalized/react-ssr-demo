import React from 'react';
import {
  observer,
  inject,
} from 'mobx-react';
import Helmet from 'react-helmet';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import qs from 'query-string';

import Container from '../layout/container';
import TopicListItem from '../../components/list-item';
import { tabs } from '../../utils/variable-define';

const getTab = (location) => {
  const query = qs.parse(location.search);
  return query.tab || 'all';
};

@inject((stores) => {
  const { appState, topicStore } = stores;
  return {
    appState,
    topicStore,
  };
})
@observer
class TopicList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.router = context.router;
  }

  componentDidMount() {
    // do something here
    const { topicStore, location } = this.props;
    topicStore.fetchTopics(getTab(location));
  }

  componentWillReceiveProps(nextProps) {
    const { location, topicStore } = this.props;
    if (nextProps.location.search !== location.search) {
      topicStore.fetchTopics(getTab(nextProps.location));
    }
  }

  onChangeTab(event, value) {
    this.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    });
  }

  bootstrap() {
    const { location, topicStore } = this.props;
    const { tab } = qs.parse(location.search);
    return topicStore.fetchTopics(tab || 'all').then(() => true).catch(() => false);
  }

  listClick(topic) {
    const { router } = this.context;
    router.history.push(`/detail/${topic.id}`);
  }

  render() {
    const { topicStore, location, appState } = this.props;
    const topicList = topicStore.topics;
    const syncingTopics = topicStore.syncing;
    const tab = getTab(location);
    const { createdTopics } = topicStore;
    return (
      <Container>
        <Helmet>
          <title>this is TopicList</title>
          <meta name="description" content="this is a description" />
        </Helmet>
        <Tabs value={tab} onChange={(e, v) => this.onChangeTab(e, v)}>
          {
            Object.keys(tabs).map(key => <Tab key={key} label={tabs[key]} value={key} />)
          }
        </Tabs>
        {
          createdTopics && createdTopics.length > 0 ? (
            <List style={{ backgroundColor: '#dfdfdf' }}>
              {
                createdTopics.map((topic, index) => {
                  topic = Object.assign({}, topic, {
                    author: appState.user.info,
                  });
                  return (
                    <TopicListItem
                      key={topic.key || index}
                      onClick={() => this.listClick(topic)}
                      topic={topic}
                    />
                  );
                })
              }
            </List>
          ) : null
        }
        <List style={{ backgroundColor: '#dfdfdf' }}>
          {
            topicList.map((topic, index) => (
              <TopicListItem
                key={topic.key || index}
                onClick={() => this.listClick(topic)}
                topic={topic}
              />
            ))
          }
        </List>
        {
          syncingTopics ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '40px 0',
              }}
            >
              <CircularProgress color="primary" size={100} />
            </div>
          ) : null
        }
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
};

TopicList.wrappedComponent.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default TopicList;
