import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Occurrence } from './Occurrence';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.datasetKey.route;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <Occurrence id={routeProps.match.params.key} {...props} {...routeProps}/>}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
