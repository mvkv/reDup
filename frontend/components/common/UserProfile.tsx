import { Popover } from '@headlessui/react';
import { useFloating, offset, shift } from '@floating-ui/react-dom';
import { User } from 'react-feather';
import { useAuth } from '../../providers/auth-context';
import { ActionType, Service } from '../../types/auth';
import ThemedButton from './ThemedButton';
import SignInWithGoogle from './SignInWithGoogle';
import Image from 'next/image';

const UserProfile = () => {
  const { authState } = useAuth();
  const userWithProfilePic =
    authState.isLoggedIn && authState.profilePic.length > 0;
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(10), shift({ padding: 5 })],
  });

  const button = (
    <div className="group hover:animate-hop">
      {!userWithProfilePic && (
        <User
          className="transition-colors duration-500 ease-in-out p-1 rounded-full
                  border-black border-2 
                 group-hover:stroke-spark-purple-700 group-hover:border-spark-purple-700 "
          size={32}
        />
      )}
      {userWithProfilePic && (
        <Image
          alt="Profile picture"
          src={authState.profilePic}
          width={36}
          height={36}
          className="rounded-full border-spark-purple-700 border-2"
        />
      )}
    </div>
  );

  return (
    <div>
      <Popover className="relative flex">
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
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border-solid border-spark-purple-900 border-2">
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
