import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import FormError from '../components/FormError';
import { LOCALSTORAGE_TOKEN } from '../constants';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface LoginForm {
  email: string;
  password: string;
  resultError?: string;
}

export default function Login() {
  const { register, getValues, errors, handleSubmit } = useForm<LoginForm>();

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data: loginMutation) => {
      const {
        login: { ok, token },
      } = data;
      if (ok && token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token);
        authTokenVar(token);
        isLoggedInVar(true);
      }
    },
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({ variables: { loginInput: { email, password } } });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="w-full max-w-lg pt-7 pb-12 rounded-lg text-center">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-white">
          Log In
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                ref={register({ required: 'Email is required' })}
                name="email"
                required
                type="email"
                placeholder="Email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {errors.email?.message && (
              <FormError errorMessage={errors.email?.message} />
            )}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={register({ required: 'Password is required' })}
                required
                name="password"
                type="password"
                placeholder="Password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              {errors.password?.message && (
                <FormError errorMessage={errors.password?.message} />
              )}
              {errors.password?.type === 'minLength' && (
                <FormError errorMessage="Password must be more than 10 chars." />
              )}
            </div>
          </div>
          <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 align-middle">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              'Log In'
            )}
          </button>
          <NavLink
            to="/sign-up"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 align-middle"
          >
            Sign Up
          </NavLink>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
}
