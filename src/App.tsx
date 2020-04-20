import React, { Fragment } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';

export default () => {
  return (
    <Fragment>
      <HashRouter>
        <Route path='/' exact component={Home}></Route>
        <Route path='/login' exact component={Login}></Route>
      </HashRouter>
    </Fragment>
  );
};
