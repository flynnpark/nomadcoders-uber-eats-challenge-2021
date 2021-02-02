import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Detail from '../pages/detail';
import Home from '../pages/home';

export default function LoggedInRouter() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:id">
            <Detail />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
}
