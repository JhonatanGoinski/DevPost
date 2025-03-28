import React, { useLayoutEffect, useState, useCallback, useContext } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native'
import { getFirestore, collection, query, where, orderBy, getDocs } from '@react-native-firebase/firestore'; // Importação correta do Firestore

import { AuthContext } from "../../contexts/auth";
import PostList from "../../components/PostsList";
import { Container, ListPosts } from "./styles";

function PostsUser() {

    const navigation = useNavigation();
    const route = useRoute();
    const [title, setTitle] = useState(route.params?.title)
    const [avatar, setavatar] = useState(route.params?.avatar)
    const { user } = useContext(AuthContext)

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: title,
            headerRight: () =>
                avatar ? (
                    <Image
                        source={{ uri: avatar }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                ) : null,
        });
    }, [navigation, title, avatar]);


    // Usando useFocusEffect para carregar os posts do usuário
    useFocusEffect(
        useCallback(() => {
            let isActive = true; // Definindo isActive 

            // Função para buscar os posts
            async function fetchPosts() {
                try {
                    const firestore = getFirestore(); // Agora estamos usando getFirestore
                    const postsQuery = query(
                        collection(firestore, 'posts'),
                        where('userId', '==', route.params?.userId),
                        orderBy('created', 'desc')
                    );

                    const snapshot = await getDocs(postsQuery);

                    const postList = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id
                    }));

                    if (isActive) {
                        setPosts(postList); // Atualizando o estado com os posts
                        setLoading(false); // Desativando o loading após os posts serem carregados
                    }
                } catch (error) {
                    console.error("Erro ao buscar posts", error);
                }
            }

            fetchPosts();

            // Cleanup para evitar a atualização do estado após o componente ser desmontado
            return () => {
                isActive = false;
            };

        }, [route.params?.userId]) // Dependência de userId para recarregar posts se mudar
    );

    return (
        <Container>
            {
                loading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={50} color="#E52246" />
                    </View>
                ) : (
                    <ListPosts
                        showsVerticalScrollIndicator={false}
                        data={posts}
                        renderItem={({ item }) => <PostList data={item} userId={user.uid} />}
                    />
                )
            }
        </Container>
    );
}

export default PostsUser; 