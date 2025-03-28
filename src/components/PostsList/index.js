import React, { useState } from "react";

import {
    Container,
    Header,
    Avatar,
    Name,
    ContentView,
    Content,
    Actions,
    LikeButton,
    Like,
    TimePost
} from "./styles";
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native'

function PostList({ data, userId }) {

    const navigation = useNavigation();
    const [likePost, setLikePost] = useState(data?.likes)

    async function handleLikePost(id, likes) {
        const docId = `${userId}_${id}`;
        const firestore = getFirestore();

        // Referência para o documento 'likes' e 'posts'
        const likeRef = doc(firestore, 'likes', docId);
        const postRef = doc(firestore, 'posts', id);

        try {
            // Checar se o post já foi curtido
            const docSnap = await getDoc(likeRef);

            if (docSnap.exists) {  // Aqui fazemos a verificação correta com 'exists'
                // Já curtiu esse post, precisamos remover esse like
                await updateDoc(postRef, {
                    likes: likes - 1,
                });
                await deleteDoc(likeRef)
                    .then(() => {
                        setLikePost(likes - 1);
                    });
            } else {
                // Precisamos dar like no post
                await setDoc(likeRef, {
                    postId: id,
                    userId: userId,
                });
                await updateDoc(postRef, {
                    likes: likes + 1,
                })
                    .then(() => {
                        setLikePost(likes + 1);
                    });
            }
        } catch (error) {
            console.error("Erro ao curtir post:", error);
        }
    }

    function formatTimePOst() {
        const datePost = new Date(data.created.seconds * 1000);

        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

    return (
        <Container>

            <Header onPress={() => navigation.navigate("PostsUser", { title: data.autor, userId: data.userId, avatar: data.avatarUrl })}>
                {data.avatarUrl ? (
                    <Avatar
                        source={{ uri: data.avatarUrl }}
                    />
                ) : (
                    <Avatar
                        source={require('../../assets/avatar.png')}
                    />
                )}
                <Name numberOfLines={1}>{data?.autor}</Name>
            </Header>

            <ContentView>
                <Content>{data?.content}</Content>
            </ContentView>

            <Actions>
                <LikeButton onPress={() => handleLikePost(data.id, likePost)}>
                    <MaterialCommunityIcons
                        name={likePost === 0 ? 'heart-plus-outline' : 'cards-heart'}
                        size={20}
                        color="#E52246"
                    />
                    <Like >
                        {likePost === 0 ? '' : likePost}
                    </Like>
                </LikeButton>

                <TimePost>
                    {formatTimePOst()}
                </TimePost>
            </Actions>

        </Container>
    );
}

export default PostList; 