export type AuthState = {
  isLoggedIn: boolean;
  errorMsg: string;
  email: string;
};

export enum ActionType {
  UNDEFINED = 0,
  LOGIN = 1,
  LOGOUT = 2,
}

export enum Service {
  UNDEFINED = 0,
  GOOGLE = 1,
}

export type Action = {
  type: ActionType;
  service: Service;
  token: string;
};
