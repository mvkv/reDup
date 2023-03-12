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
        setAuthState({ isLoggedIn: true, errorMsg: '', email: body.email });
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
            setAuthState({ isLoggedIn: true, errorMsg: '', email: body.email });
          } else {
            setAuthState({ isLoggedIn: false, errorMsg: 'Error', email: '' });
          }
          break;
        }
        case ActionType.LOGOUT: {
          const body = await doLogout();
          if (body.ok) {
            setAuthState({ isLoggedIn: false, errorMsg: 'Error', email: '' });
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

  useEffect(() => {
    // If the user log-in and was previously logged-out redirect them to the dashboard page.
    if (isLoggedIn && !wasLoggedIn) {
      Router.push('/dashboard');
    }
  }, [isLoggedIn, wasLoggedIn]);

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
