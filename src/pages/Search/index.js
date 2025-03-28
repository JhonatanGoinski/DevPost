import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Container, AreaInput, Input, List } from "./styles";
import Feather from 'react-native-vector-icons/Feather';

import { getFirestore, collection, query, where, onSnapshot } from "@react-native-firebase/firestore";
import SearchList from "../../components/SearchList";

function Search() {

    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (input === '' || input === undefined) {
            setUsers([]);
            return;
        }

        const firestore = getFirestore();
        const usersRef = collection(firestore, 'users');
        const q = query(
            usersRef,
            where('nome', '>=', input),
            where('nome', '<=', input + "\uf8ff")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const listUsers = [];

            snapshot.forEach(doc => {
                listUsers.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });


            setUsers(listUsers); // Atualiza o estado dos usuários
        });

        // Cleanup
        return () => unsubscribe();
    }, [input]);

    return (
        <Container>
            <AreaInput>
                <Feather
                    name="search"
                    size={20}
                    color="#E52246"
                />
                <Input
                    placeholder="Procurando alguém?"
                    value={input}
                    onChangeText={(text) => setInput(text)}

                />
            </AreaInput>

            <List
                data={users}
                renderItem={({ item }) => <SearchList data={item} />}
            />
        </Container>
    );
}

export default Search; 