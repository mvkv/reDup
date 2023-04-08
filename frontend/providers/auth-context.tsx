import Router, { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { doGoogleLogin, doLogout, doCookieLogin } from '../apiCalls/Auth';
import usePrevious from '../hooks/usePrevious';
import { Action, ActionType, AuthState, Service } from '../types/auth';

const DEFAULT_AUTH_STATE: AuthState = {
  isLoggedIn: false,
  errorMsg: '',
  email: '',
  profilePic: '',
};

const DEFAULT_ACTION: Action = {
  type: ActionType.UNDEFINED,
  service: Service.UNDEFINED,
  token: '',
};

type Dispatch = (action: Action) => void;
const AuthContext = createContext<
  { authState: AuthState; setLastCommand: Dispatch } | undefined
>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE);
  const [lastCommand, setLastCommand] = useState(DEFAULT_ACTION);
  const router = useRouter();

  const isLoggedIn = authState.isLoggedIn;
  const wasLoggedIn = usePrevious(isLoggedIn);
  const isOnHomepage = router.pathname == '/' || router.pathname == '';

  useEffect(() => {
    async function tryOnLoadLogin() {
      const body = await doCookieLogin();
      if (body.ok) {
        setAuthState({
          isLoggedIn: true,
          errorMsg: '',
          email: body.email,
          profilePic: body.profile_pic,
        });
      } else {
        // The user might not have the cookie set.
        // TODO: Use local storage to prevent firing unecessary request.
      }
    }
    if (!isLoggedIn && isOnHomepage) {
      tryOnLoadLogin();
    }
  }, [isLoggedIn, isOnHomepage]);

  useEffect(() => {
    async function processCommand() {
      switch (lastCommand.type) {
        case ActionType.LOGIN: {
          const body = await doGoogleLogin(lastCommand.token);
          if (body.ok) {
            setAuthState({
              isLoggedIn: true,
              errorMsg: '',
              email: body.email,
              profilePic: body.profile_pic,
            });
            // Redirect user to dashboard page on successful log-in.
            Router.push('/dashboard');
          } else {
            setAuthState({
              isLoggedIn: false,
              errorMsg: 'Error',
              email: '',
              profilePic: '',
            });
          }
          break;
        }
        case ActionType.LOGOUT: {
          const body = await doLogout();
          if (body.ok) {
            setAuthState(DEFAULT_AUTH_STATE);
          }
          break;
        }
        default: {
          break;
          // Do nothing.
        }
      }
    }
    processCommand();
  }, [lastCommand]);

  return (
    <AuthContext.Provider value={{ authState, setLastCommand }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('usePreference must be used within a PreferenceProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
