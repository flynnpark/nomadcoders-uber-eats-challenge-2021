import { gql, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from '../__type_graphql__/CreateAccountMutation';
import { UserRole } from '../__type_graphql__/globalTypes';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountFrom {
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    errors,
    getValues,
    formState,
  } = useForm<ICreateAccountFrom>({
    mode: 'onBlur',
    defaultValues: {
      role: UserRole.Host,
    },
  });
  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;

    if (ok) {
      alert('Account Created! Log in now!');
      history.push('/');
    }
  };
  const { email, password, role } = getValues();
  const [
    createAccountMutation,
    { data: createAccountResult, loading },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      variables: {
        createAccountInput: { email, password, role },
      },
      onCompleted,
    }
  );
  const _submit = () => {
    if (!loading) createAccountMutation();
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <Helmet>
        <title>Create Account | Nuber-podcasts</title>
      </Helmet>
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-lg mx-5 py-10">
        <h3 className="text-blue-400 text-3xl text-center mb-10 font-medium">
          Create Account
        </h3>
        <form
          onSubmit={handleSubmit(_submit)}
          className="w-full flex flex-col px-6"
        >
          <div className="mb-2 flex align-center text-blue-400">
            <svg
              className="w-5"
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
            <label className="text-sm pl-1">Email</label>
          </div>
          <input
            ref={register({
              required: {
                value: true,
                message: 'Email is required!',
              },
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Email address invalid',
              },
            })}
            className="border-b-2 border-blue-400 py-2 bg-transparent focus:outline-none w-full"
            name="email"
            type="email"
            placeholder="E-mail"
          ></input>
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}

          <div className="mt-8 mb-2 flex align-center text-blue-400">
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <label className="text-sm pl-1">Password</label>
          </div>
          <input
            ref={register({
              required: {
                value: true,
                message: 'Password is required!',
              },
              minLength: {
                value: 10,
                message: 'Password must be more than 10 characters',
              },
            })}
            className="border-b-2 border-blue-400 py-2 bg-transparent focus:outline-none w-full"
            name="password"
            type="password"
            placeholder="Password"
          ></input>
          <input
            ref={register({
              required: 'Password is required!',
              validate: (value) => value === getValues().password,
            })}
            className="mt-4 border-b-2 border-blue-400 py-2 bg-transparent focus:outline-none w-full"
            name="confirm_password"
            type="password"
            placeholder="Confirm"
          ></input>
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.confirm_password && (
            <FormError errorMessage="Password not matched" />
          )}

          <div className="mt-8 mb-2 flex align-center text-blue-400">
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <label className="text-sm pl-1">Role</label>
          </div>
          <select
            ref={register}
            name="role"
            className="border-b-2 border-blue-400 py-2 bg-transparent focus:outline-none"
          >
            {Object.keys(UserRole).map((role, idx) => (
              <option className="text-black" key={idx}>
                {role}
              </option>
            ))}
          </select>
          <Button
            className="mt-12"
            canClick={formState.isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccountResult?.createAccount.error && (
            <FormError errorMessage={createAccountResult.createAccount.error} />
          )}
          <span className="w-full text-center mt-3 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-blue-400 hover:underline">
              Log in!
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
