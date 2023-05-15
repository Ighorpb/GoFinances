import { createContext, ReactNode, useContext } from "react";
import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user?: User;
    signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
    const user = {
        id: '125487',
        name: 'Ighor Barbosa',
        email: 'pb.ighor@gmail.com',
    };

    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '971988043524-uj2k654o8hb9itkn9ad61cl36p1fogff.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@ttriquetra/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            console.log('Botão pressionado'); // Adicionando console.log aqui

            const response = await AuthSession.startAsync({ authUrl });
            console.log(response);
        } catch (error) {
            if (typeof error === 'string') {
                throw new Error(error);
            } else {
                throw error;
            }
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };
