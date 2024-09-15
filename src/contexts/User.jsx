import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import { query, collection, where, getDocs } from "firebase/firestore";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [theme, setTheme] = useState('green');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const q = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    // console.log("User document data:", userDoc.data());
                    setUserData(userDoc.data());
                } else {
                    // console.log("No such document!");
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // console.log("Auth User:", user);
    // console.log("User Data:", userData);

    const toggleTheme = () => {
        setTheme(theme === 'green' ? 'yellow' : 'green');
    };

    return (
        <UserContext.Provider value={{ user, userData, theme, toggleTheme }}>
            {children}
        </UserContext.Provider>
    );
};