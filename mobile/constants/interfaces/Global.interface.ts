export interface AuthContext {
  signIn: Function;
}

export interface AuthState {
  isLoading: Boolean;
  userToken: String | null;
}
