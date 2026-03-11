import { createContext, useState, useEffect, ReactNode } from "react";

type User= {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    async function signIn(email: string, password: string) {

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }); 

        const data = await response.json();

        const token = data.token;

        localStorage.setItem("token", token);

        await loadUser(token);
        }

        async function loadUser(token: string) {
            const response = await fetch("http://localhost:3000/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            
            setUser(data);
            setIsLoading(false);
        }   

        function signOut() {
            localStorage.removeItem("token");
            setUser(null);
            setIsLoading(false);    
        }   

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                loadUser(token);
            } else {
                setIsLoading(false);
            }   

        }, []);

        return (
            <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                isLoading, 
                signIn, 
                signOut 
                }}>
                {children}
            </AuthContext.Provider>
        );
        
}