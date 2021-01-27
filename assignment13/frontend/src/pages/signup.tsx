import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import FormError from '../components/FormError';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

const SIGNUP_MUTATAION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface SignUpForm {
  email: string;
  password: string;
  role: UserRole;
  resultError?: string;
}

export default function SignUp() {
  const history = useHistory();
  const { register, getValues, errors, handleSubmit } = useForm<SignUpForm>();

  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    SIGNUP_MUTATAION,
    {
      onCompleted: (data: createAccountMutation) => {
        const {
          createAccount: { ok },
        } = data;
        if (ok) {
          alert('Account created! Please log in now!');
          history.push('/');
        }
      },
    }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: { input: { email, password, role } },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="w-full max-w-lg pt-7 pb-12 rounded-lg text-center">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign Up
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
          <div>
            <select
              ref={register({ required: 'Role is required' })}
              required
              name="role"
              placeholder="role"
              className="rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            >
              {Object.keys(UserRole).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
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
              'Sign Up'
            )}
          </button>
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
      </div>
    </div>
  );
}
