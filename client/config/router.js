import TopicList from '../views/topic-list';
import TopicDetail from '../views/topic-detail';
import ApiTest from '../views/test/api.text';
import UserLogin from '../views/user/login';
import UserInfo from '../views/user/info';
import TopicCreate from '../views/topic-create';

export default [
  {
    path: '/list',
    component: TopicList,
  },
  {
    path: '/apitest',
    component: ApiTest,
  },
  {
    path: '/detail/:id',
    component: TopicDetail,
  },
  {
    path: '/user/login',
    component: UserLogin,
  },
  {
    path: '/user/info',
    component: UserInfo,
    isRequiredLogin: true,
  },
  {
    path: '/topic/create',
    component: TopicCreate,
    isRequiredLogin: true,
  },
  // redirect 使用Switch必须放在最后
  {
    to: '/list',
    from: '/',
    redirect: true,
  },
];
