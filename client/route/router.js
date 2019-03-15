import React from 'react';
import {
  Switch, Route, Redirect, withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/user/login', search: `?from=${rest.path}` }} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

const InjectedPrivateRoute = withRouter(inject((stores) => {
  const { appState } = stores;
  return {
    isLogin: appState.user.isLogin,
  };
})(observer(PrivateRoute)));

const renderRoute = (route, i, extraProps) => {
  if (route.redirect) {
    return <Redirect key={route.key || i} from={route.from} to={route.to} />;
  }
  return route.isRequiredLogin
    ? (
      <InjectedPrivateRoute
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        component={route.component}
      />
    )
    : (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={props => (
          <route.component {...props} {...extraProps} route={route} />
        )}
      />
    );
};

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => {
  if (routes.length > 0) {
    return (
      <Switch {...switchProps}>
        {routes.map((route, i) => (
          renderRoute(route, i, extraProps)
        ))}
      </Switch>
    );
  }
  return (
    <div>这是一个空路由</div>
  );
};

export default renderRoutes;
