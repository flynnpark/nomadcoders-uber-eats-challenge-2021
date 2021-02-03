import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
    <Helmet>
      <title>Page Not Founds | Nuber-podcasts</title>
    </Helmet>
    <h2 className="text-4xl font-semibold">Page Not Found</h2>
    <h3 className="text-xl mt-6 ">
      The page you are looking for does not exist or has moved.
    </h3>
    <Link className="mt-4 text-blue-400 hover:underline" to="/">
      Go back home →
    </Link>
  </div>
);
