import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from '../pages/login';

export default function LoggedOutRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/sign-up">
          <>SignUp</>
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}
