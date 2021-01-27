import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Login from '../pages/login';
import SignUp from '../pages/signup';

export default function LoggedOutRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}
