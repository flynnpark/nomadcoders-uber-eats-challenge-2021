import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from './apollo';
import LoggedInRouter from './routers/loggedInRouter';
import LoggedOutRouter from './routers/loggedOutRouter';


export default function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}
