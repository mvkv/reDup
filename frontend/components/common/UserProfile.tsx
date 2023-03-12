import { Popover } from '@headlessui/react';
import { useFloating, offset, shift } from '@floating-ui/react-dom';
import { User } from 'react-feather';
import { useAuth } from '../../providers/auth-context';
import { ActionType, Service } from '../../types/auth';
import ThemedButton from './ThemedButton';
import SignInWithGoogle from './SignInWithGoogle';

const UserProfile = () => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(10), shift({ padding: 5 })],
  });

  const button = (
    <User
      className="transition-colors duration-500 ease-in-out group-hover:animate-hop border-black border-2 p-1 rounded-full"
      size={32}
    />
  );

  return (
    <div>
      <Popover className="relative">
        <Popover.Button ref={reference}>{button}</Popover.Button>
        <Popover.Panel
          ref={floating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
          className="z-10 w-60"
        >
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
            <UserPanel />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default UserProfile;

const UserPanel = () => {
  const { authState, setLastCommand } = useAuth();

  return (
    <div className="flex flex-col gap-2 p-4 bg-spark-purple-50">
      {!authState.isLoggedIn && (
        <>
          <p>You need to log-in with your Google account to use reDup</p>
          <SignInWithGoogle />
        </>
      )}
      {authState.isLoggedIn && (
        <div className="flex flex-col gap-4 justify-center">
          <p>You are logged in as: </p>
          <span className="text-spark-purple-500 font-bold">
            {authState.email}!
          </span>
          <ThemedButton
            onClick={() =>
              setLastCommand({
                type: ActionType.LOGOUT,
                service: Service.UNDEFINED,
                token: '',
              })
            }
            label={'Log Out'}
          ></ThemedButton>
        </div>
      )}
    </div>
  );
};
