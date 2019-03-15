import AppState from './app.state';
import TopicStore from './topic-store';

export { AppState, TopicStore };

const state = {
  appState: new AppState(),
  topicStore: new TopicStore(),
};

export default {
  AppState,
  TopicStore,
};

export const createStoreMap = () => state;
