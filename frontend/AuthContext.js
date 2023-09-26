import React from 'react';

const AuthContext = React.createContext();

export default AuthContext;


/* import React, { createContext, useContext, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
const AuthContext = createContext();

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContext;
  };

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContext = {
    signIn: async (email, password) => {
      // Simulate authentication by setting a dummy token.
      const dummyToken = 'dummy-auth-token';
      dispatch({ type: 'SIGN_IN', token: dummyToken });
    },
    signOut: () => {
      // Clear the user's authentication state (e.g., remove tokens).
      dispatch({ type: 'SIGN_OUT' });
    },
    restoreToken: (token) => {
      // Restore the user's token (e.g., from storage) when the app starts.
      dispatch({ type: 'RESTORE_TOKEN', token });
    },
  };

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};

*/