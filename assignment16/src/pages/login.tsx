import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import { LS_TOKEN } from '../constants';
import {
  LoginMutation,
  LoginMutationVariables,
} from '../__type_graphql__/LoginMutation';

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: (data: LoginMutation) => {
      const {
        login: { ok, token },
      } = data;
      if (ok && token) {
        localStorage.setItem(LS_TOKEN, token);
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
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <Helmet>
        <title>Log In | Nuber-podcasts</title>
      </Helmet>
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-3xl mx-5 flex justify-between">
        <div className="hidden sm:block sm:w-7/12 bg-gradient-to-tr from-green-400 to-blue-400  flex justify-center items-center rounded-tl-lg rounded-bl-lg">
          {/*Right Side*/}
          <div className="w-full h-full flex flex-col justify-center text-white text-right p-6">
            <h3 className="text-4xl font-medium">Wanna listen?</h3>
            <span className="mt-4 text-medium">
              Just Subscribe! Deliver all podcasts to your ears.
            </span>
          </div>
        </div>
        <div className="w-full sm:w-5/12 py-16">
          {/*Left Side*/}
          <h3 className="text-blue-400 text-3xl text-center mb-10 font-medium">
            Nuber-Podcasts
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col px-14"
          >
            <div className="border-b-2 border-blue-400 py-2 bg-transparent flex">
              <svg
                className="w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                ref={register({
                  required: 'Email is required!',
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Please enter a valid email',
                  },
                })}
                className="focus:outline-none pl-2 w-full"
                name="email"
                type="email"
                placeholder="E-mail"
              ></input>
            </div>
            {errors.email?.message && (
              <FormError errorMessage={errors.email.message} />
            )}
            <div className="mt-8 border-b-2 border-blue-400 py-2 bg-transparent flex">
              <svg
                className="w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <input
                ref={register({
                  required: 'Password is required!',
                  minLength: 10,
                })}
                className="focus:outline-none pl-2 w-full"
                name="password"
                type="password"
                placeholder="Password"
              ></input>
            </div>
            {errors.password?.message && (
              <FormError errorMessage={errors.password.message} />
            )}
            {errors.password?.type === 'minLength' && (
              <FormError errorMessage="Password must be more than 10 characters" />
            )}
            <Button
              type="submit"
              className="mt-12"
              disabled={!formState.isValid}
              loading={loading}
              actionText="Login"
            />
            {loginMutationResult?.login.error && (
              <FormError errorMessage={loginMutationResult.login.error} />
            )}
            <span className="w-full text-center mt-3 text-sm text-gray-500">
              Don't have an account?
              <br />
              Create{' '}
              <Link
                to="/create-account"
                className="text-blue-400 hover:underline"
              >
                here!
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
