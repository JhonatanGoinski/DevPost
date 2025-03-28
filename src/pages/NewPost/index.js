import React, { useState, useLayoutEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native"
import { Container, Input, Button, ButtonText } from "./styles";
import { getFirestore, collection, addDoc } from "@react-native-firebase/firestore";
import { getStorage, ref, getDownloadURL } from "@react-native-firebase/storage";
import { AuthContext } from "../../contexts/auth";

function NewPost() {

    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState("");

    useLayoutEffect(() => {

        const options = navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handlePost()}>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )
        })

    }, [navigation, post])

    async function handlePost() {
        if (post === '') {
            console.log("Seu post contém conteúdo inválido");
            return;
        }

        let avatarUrl = null;
        const storage = getStorage();

        try {
            const avatarRef = ref(storage, `users/${user?.uid}`);
            avatarUrl = await getDownloadURL(avatarRef);
        } catch (err) {
            avatarUrl = null;
        }

        try {
            const firestore = getFirestore();
            await addDoc(collection(firestore, "posts"), {
                created: new Date(),
                content: post,
                autor: user?.nome,
                userId: user?.uid,
                likes: 0,
                avatarUrl,
            });

            setPost('');
            console.log("Post criado com sucesso");

        } catch (error) {
            console.log("Erro ao criar post", error);
        }
        navigation.goBack();
    }

    return (
        <Container>
            <Input
                placeholder="O que deseja compartilhar?"
                value={post}
                onChangeText={(text) => setPost(text)}
                autoCorrect={false}
                multiline={true}
                placeholderTextColor="#DDD"
                maxLength={300}
            />
        </Container>
    );
}

export default NewPost; 