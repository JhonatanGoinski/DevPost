import React, { useContext, useState, useEffect } from "react";
import { Modal, Alert, Platform } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import {
    Container,
    Name,
    Button,
    ButtonText,
    Email,
    UploadButton,
    UploadText,
    Avatar,
    ModalContainer,
    ButtonBack,
    Input
} from "./styles";
import Feather from 'react-native-vector-icons/Feather';

import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


function Profile() {
    const { signOut, user, setUser, storageUser } = useContext(AuthContext);
    const [nome, setNome] = useState(user?.nome);
    const [url, setUrl] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function loadAvatar() {
            try {
                let response = await storage().ref('users').child(user?.uid).getDownloadURL();
                setUrl(response);
            } catch (error) {

            }
        }

        loadAvatar();

        return () => loadAvatar();
    }, [])

    async function handleSignOut() {
        Alert.alert(
            "Sair da conta",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: () => signOut()
                }
            ]
        );
    }

    // Atualizar o perfil
    async function upDateProfile() {
        if (nome === '') {
            return alert('Inválido');
        }

        try {
            const firestore = getFirestore();

            // Atualizar os dados do usuário
            await updateDoc(doc(firestore, 'users', user?.uid), {
                nome: nome
            });

            // Buscar todos os posts desse user e atualizar o nome dele
            const postQuery = query(
                collection(firestore, 'posts'),
                where('userId', '==', user?.uid)
            );

            const postDocs = await getDocs(postQuery);

            postDocs.forEach(async (documentSnapshot) => {
                const postRef = documentSnapshot.ref; // Referência do documento
                await updateDoc(postRef, { autor: nome });
            });

            let data = {
                uid: user.uid,
                nome: nome,
                email: user.email,
            };
            setUser(data);
            storageUser(data);
            setOpen(false);
        } catch (error) {
            console.error("Erro ao atualizar perfil", error);
            alert('Erro ao atualizar perfil');
        }
    }

    /////////// INICIO - Selecionar, Salvar e Atualizar Foto de Perfil
    const uploadFile = () => {
        const options = {
            noData: true,
            mediaType: 'photo'
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log("Cancelou")
            } else if (response.error) {
                console.log("Ops deu algum erro")
            } else {
                uploadFileFirebase(response)
                    .then(() => {
                        upLoadAvatarPosts(); // Chama após o upload da imagem
                    })

                setUrl(response.assets[0].uri);
            }
        })
    }

    const getFileLocalPath = (response) => {
        return response.assets[0].uri;
    }

    const uploadFileFirebase = async (response) => {
        const fileSource = getFileLocalPath(response);

        const storageRef = storage().ref('users').child(user?.uid);

        try {
            const uploadTask = storageRef.putFile(fileSource);

            uploadTask.on('state_changed', snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Progresso do upload: ${progress}%`);
            });

            await uploadTask;
            console.log('Arquivo carregado com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer upload do arquivo:', error);
        }
    }

    // Atualiza os posts com a nova URL da foto de perfil
    const upLoadAvatarPosts = async () => {
        const storageRef = storage().ref('users').child(user?.uid);
        const url = await storageRef.getDownloadURL(); // Obtém a URL da foto carregada

        try {
            const firestore = getFirestore();
            const postQuery = query(
                collection(firestore, 'posts'),
                where('userId', '==', user?.uid)
            );

            const postDocs = await getDocs(postQuery);

            postDocs.forEach(async (documentSnapshot) => {
                const postRef = documentSnapshot.ref;
                await updateDoc(postRef, { avatarUrl: url }); // Atualiza o avatarUrl nos posts
            });

            console.log('Posts atualizados com a nova foto de perfil!');
        } catch (error) {
            console.error('Erro ao atualizar os posts:', error);
        }
    }
    /////////// FIM - Selecionar, Salvar e Atualizar Foto de Perfil

    return (
        <Container>
            <Header />

            {
                url ? (
                    <UploadButton onPress={() => uploadFile()}>
                        <UploadText>+</UploadText>
                        <Avatar
                            source={{ uri: url }}
                        />
                    </UploadButton>
                ) : (
                    <UploadButton onPress={() => uploadFile()}>
                        <UploadText>+</UploadText>
                    </UploadButton>
                )
            }

            <Name>{user?.nome}</Name>
            <Email>{user?.email}</Email>

            <Button bg="#428cfd" onPress={() => setOpen(true)}>
                <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
            </Button>

            <Button bg="#ddd" onPress={handleSignOut}>
                <ButtonText color="#353840">Desconectar</ButtonText>
            </Button>

            <Modal visible={open} animationType="slide" transparent={true}>
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>

                    <ButtonBack onPress={() => setOpen(false)}>
                        <Feather
                            name="arrow-left"
                            size={22}
                            color="#121212"
                        />
                        <ButtonText color="#353840">Voltar</ButtonText>
                    </ButtonBack>

                    <Input
                        placeholder={user?.nome}
                        value={nome}
                        onChangeText={(text) => setNome(text)}
                    />

                    <Button bg="#428cfd" onPress={upDateProfile}>
                        <ButtonText color="#FFF">Salvar</ButtonText>
                    </Button>

                </ModalContainer>
            </Modal>

        </Container >
    );
}

export default Profile;
