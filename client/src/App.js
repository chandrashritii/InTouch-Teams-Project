import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import { Switch, Route } from 'react-router';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import MeetingRoom from './videocall/src/components/MeetingRoom/index';
import ErrorBoundary from './components/common/ErrorBoundary';
import SignIn from './UserLanding/Signin';
import { UserProfile } from './context/profile.context';
import Homevideo from './videocall/src/components/Home/index';
import Home from './UserLanding/Home';

function App() {
  return (
    <ErrorBoundary>
      <UserProfile>
        <Switch>
        <PublicRoute exact path="/signin">
            <SignIn />
          </PublicRoute>
          <PrivateRoute exact path="/chat/:chatId">
            <Home />
          </PrivateRoute>
          <Route exact path="/videocall">
            <Homevideo />
          </Route>
          <Route exact path="/:chatId">
            <MeetingRoom />
          </Route>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </UserProfile>
    </ErrorBoundary>
  );
}

export default App;
