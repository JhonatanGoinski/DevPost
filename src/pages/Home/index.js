import React, { useState, useContext, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import Feather from "react-native-vector-icons/Feather"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } from "@react-native-firebase/firestore";

import { Container, ButtonPost, ListPosts } from "./styles";
import Header from "../../components/Header";
import PostList from "../../components/PostsList";

function Home() {

    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [lastItem, setLastItem] = useState('');
    const [emptyList, setEmptyList] = useState(false);

    //Carregando posts para tela Home
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function fetchPosts() {
                try {
                    const firestore = getFirestore();

                    const postsQuery = query(
                        collection(firestore, "posts"),
                        orderBy("created", "desc"),
                        limit(5)
                    );

                    const snapshot = await getDocs(postsQuery);

                    if (isActive) {
                        const postList = snapshot.docs.map((doc) => ({
                            ...doc.data(),
                            id: doc.id,
                        }));

                        setEmptyList(!!snapshot.empty)
                        setPosts(postList);
                        setLastItem(snapshot.docs[snapshot.docs.length - 1])
                        setLoading(false);
                    }
                } catch (error) {
                    console.log("Erro ao buscar posts", error);
                }
            }

            fetchPosts();

            return () => {
                isActive = false;
            };
        }, [])
    );

    // Recarregando posts 
    async function handleRefreshPosts() {
        setLoadingRefresh(true);

        try {
            const firestore = getFirestore();

            const snapshot = await getDocs(
                query(
                    collection(firestore, "posts"),
                    orderBy("created", "desc"),
                    limit(5)
                )
            );

            setPosts([]); // Garante que os posts sejam redefinidos antes de carregar novos
            const postList = [];

            snapshot.docs.forEach((doc) => {
                postList.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });

            setEmptyList(snapshot.empty); // Verifica se a lista está vazia
            setPosts(postList);
            setLastItem(snapshot.docs[snapshot.docs.length - 1] || null);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
        }

        setLoadingRefresh(false); // Garante que o estado de refresh sempre seja atualizado
    }

    // Buscar mais posts quando chegar no final da lista
    async function getListPosts() {
        if (emptyList) {
            // Se já buscou toda a lista, desativa o loading
            setLoading(false);
            return null;
        }

        if (loading) return;

        try {
            const firestore = getFirestore();

            const snapshot = await getDocs(
                query(
                    collection(firestore, "posts"),
                    orderBy("created", "desc"),
                    limit(5),
                    startAfter(lastItem) // Pega os próximos registros após o último carregado
                )
            );

            const postList = [];

            snapshot.docs.forEach((doc) => {
                postList.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });

            setEmptyList(snapshot.empty);
            setLastItem(snapshot.docs[snapshot.docs.length - 1] || null);
            setPosts((oldPosts) => [...oldPosts, ...postList]);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar mais posts:", error);
        }
    }
    return (
        <Container>
            <Header />
            {
                loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={50} color="#E52246" />
                    </View>
                ) : (
                    <ListPosts
                        showsVerticalScrollIndicator={false}
                        data={posts}
                        renderItem={({ item }) => (
                            <PostList
                                data={item}
                                userId={user?.uid}
                            />
                        )}

                        refreshing={loadingRefresh}
                        onRefresh={handleRefreshPosts}
                        onEndReached={() => getListPosts()}
                        onEndReachedThreshold={0.1}
                    />
                )
            }


            <ButtonPost
                onPress={() => navigation.navigate("NewPost")}
                activeOpacity={0.5}>
                <Feather
                    name="edit-2"
                    color="#FFF"
                    size={25}
                />
            </ButtonPost>
        </Container>
    );
}

export default Home; 