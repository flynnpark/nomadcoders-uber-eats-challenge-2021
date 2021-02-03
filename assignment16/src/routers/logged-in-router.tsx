import { isLoggedInVar } from '../apollo';
import { LS_TOKEN } from '../constants';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Podcasts } from '../pages/listener/podcasts';
import { NotFound } from '../404';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { Episodes } from '../pages/listener/episodes';

const ListenerRoutes = [
  <Route key={1} path="/" exact>
    <Podcasts />
  </Route>,
  <Route key={2} path="/podcasts/:id">
    <Episodes />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  const handleClick = () => {
    localStorage.removeItem(LS_TOKEN);
    isLoggedInVar(false);
  };
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === 'Listener' && ListenerRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
