
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import * as AuthSession from 'expo-auth-session';
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLIENT_ID = '48a63b7ba151d441c9dd';
const SCOPE = 'read:user';
const USER_STORAGE = '@dowhile:user';
const TOKEN_STORAGE = '@dowhile:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigninIn: boolean;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSigninIn, setIsSigninIn] = useState(false);

  const signIn = useCallback(async () => {
    try {
      setIsSigninIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;

      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {
        const response = await api.post('/authenticate', {
          code: authSessionResponse.params.code
        });

        const { user, token } = response.data as AuthResponse;

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_STORAGE, token);

        setUser(user)
      }
      setIsSigninIn(false);
    } catch (error) {
      setIsSigninIn(false);
    }


  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);

  }, []);

  useEffect(() => {
    async function loadStorageData() {
      const user = await AsyncStorage.getItem(USER_STORAGE);
      const token = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (user && token) {
        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(JSON.parse(user));
      }
    }

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isSigninIn,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };