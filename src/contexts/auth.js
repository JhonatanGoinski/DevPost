import React, { useState, createContext, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from '@react-native-firebase/firestore';

import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true)
    const [loadingAuth, setLoadingAuth] = useState(false);

    //Buscar informações de login caso haja no AsyncStorage
    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('@devapp');

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();
    }, [])

    // Cadastrar usuário
    async function signUp(email, password, name) {

        setLoadingAuth(true);

        try {
            const auth = getAuth(); // obtém a instância do Auth
            const firestore = getFirestore(); // obtém a instância do Firestore

            const value = await createUserWithEmailAndPassword(auth, email, password); // criação do usuário

            const uid = value.user.uid;

            // adicionando usuário ao Firestore
            await setDoc(doc(firestore, 'users', uid), {
                nome: name,
                createdAt: new Date(),
            });

            let data = {
                uid: uid,
                nome: name,
                email: value.user.email,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);

        } catch (error) {
            console.log(error);
            setLoadingAuth(false);
        }
    }

    // Login usuário
    async function signIn(email, password) {

        setLoadingAuth(true);

        try {
            const auth = getAuth(); // Obtém a instância do Auth
            const firestore = getFirestore(); // Obtém a instância do Firestore

            const value = await signInWithEmailAndPassword(auth, email, password); // Autenticação do usuário

            const uid = value.user.uid;

            // Obtendo os dados do usuário no Firestore
            const userDoc = await getDoc(doc(firestore, "users", uid));

            if (userDoc.exists) { // Correção: Removendo os parênteses
                const userData = userDoc.data();

                let data = {
                    uid: uid,
                    nome: userData.nome,
                    email: value.user.email,
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);

            } else {
                console.log("Usuário não encontrado no Firestore");
            }
        } catch (error) {
            console.log(error);
            setLoadingAuth(false);
        }
    }

    //Função para deslogar usuário do aplicativo
    async function signOut() {
        await getAuth().signOut();
        await AsyncStorage.clear()
            .then(() => {
                setUser(null);
            })
    }

    //Salvando dados usuário. 
    async function storageUser(data) {
        await AsyncStorage.setItem('@devapp', JSON.stringify(data))
    }


    return (
        <AuthContext.Provider value={{
            signed: !!user,
            signUp,
            signIn,
            signOut,
            loadingAuth,
            loading,
            user,
            setUser,
            storageUser
        }}>

            {children}

        </AuthContext.Provider>
    );
}

export default AuthProvider;
