import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import Index from '../pages/index';

const App = () => {
  return (
    <Fragment>
      <Route exact path="/" component={Index} />
    </Fragment>
  );
};

export default App;
