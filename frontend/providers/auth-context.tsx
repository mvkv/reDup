import { createContext, useContext, useEffect, useState } from 'react';
import { doLogin } from '../apiCalls/Auth';
import { Action, ActionType, AuthState, Service } from '../types/auth';

const DEFAULT_AUTH_STATE: AuthState = {
  isLoggedIn: false,
  errorMsg: '',
  email: '',
};

const DEFAULT_ACTION = {
  type: ActionType.UNDEFINED,
  service: Service.UNDEFINED,
  token: '',
};

type Dispatch = (action: Action) => void;
const AuthContext = createContext<
  { authState: AuthState; setLastCommand: Dispatch } | undefined
>(undefined);

function AuthProvider({ children }: any) {
  const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE);
  const [lastCommand, setLastCommand] = useState(DEFAULT_ACTION);

  useEffect(() => {
    async function processCommand() {
      switch (lastCommand.type) {
        case ActionType.LOGIN: {
          const body = await doLogin(lastCommand.token);
          if (body.ok) {
            setAuthState({ isLoggedIn: true, errorMsg: '', email: body.email });
          } else {
            setAuthState({ isLoggedIn: false, errorMsg: 'Error', email: '' });
          }
        }
        case ActionType.LOGOUT: {
          // TODO Implement LOGOUT.
        }
        default: {
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
