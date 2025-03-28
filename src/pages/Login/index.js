import React, { useState, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import {
    Container,
    Title,
    Input,
    Button,
    ButtonText,
    SignUpButton,
    SignUpButtonText
} from './styles'

import { AuthContext } from "../../contexts/auth";

import * as Animatable from 'react-native-animatable';

const TitleAnimated = Animatable.createAnimatableComponent(Title)
const InputAnimated = Animatable.createAnimatableComponent(Input)
const ButtonAnimated = Animatable.createAnimatableComponent(Button)
const SignUpButtonAnimated = Animatable.createAnimatableComponent(SignUpButton)

function Login() {

    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signUp, signIn, loadingAuth } = useContext(AuthContext);

    function toggleLogin() {
        setLogin(!login)
        setName('')
        setEmail('')
        setPassword('')
    }

    async function handleSignIn() {
        if (email === '' || password === '') {
            console.log("Preencha os campos")
            return;
        }
        await signIn(email, password)
    }

    async function handleSignUp() {
        if (name === '' || email === '' || password === '') {
            console.log("Preencha todos os campos")
            return;
        }

        await signUp(email, password, name)
    }

    if (login) {
        return (
            <Container>

                <TitleAnimated animation="slideInLeft">
                    Dev<Text style={{ color: '#E52246' }}>Post</Text>
                </TitleAnimated>

                <InputAnimated animation="slideInLeft"
                    placeholder="user@email.com"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <InputAnimated animation="slideInLeft"
                    placeholder="*******"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />

                <ButtonAnimated animation="slideInLeft" onPress={handleSignIn}>
                    {
                        loadingAuth ? (
                            <ActivityIndicator size={20} color="#FFF" />
                        ) : (
                            <ButtonText>Acessar</ButtonText>
                        )
                    }
                </ButtonAnimated>

                <SignUpButtonAnimated animation="slideInLeft" onPress={toggleLogin}>
                    <SignUpButtonText>Criar uma conta</SignUpButtonText>
                </SignUpButtonAnimated>

            </Container>
        );
    }

    return (
        <Container>

            <TitleAnimated animation="slideInRight">
                Dev<Text style={{ color: '#E52246' }}>Post</Text>
            </TitleAnimated>

            <InputAnimated animation="slideInRight"
                placeholder="Nome"
                value={name}
                onChangeText={(text) => setName(text)}
            />

            <InputAnimated animation="slideInRight"
                placeholder="user@email.com"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <InputAnimated animation="slideInRight"
                placeholder="*******"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <ButtonAnimated animation="slideInRight" onPress={handleSignUp}>
                {
                    loadingAuth ? (
                        <ActivityIndicator size={20} color="#FFF" />
                    ) : (
                        <ButtonText>Cadastrar</ButtonText>
                    )
                }
            </ButtonAnimated>

            <SignUpButtonAnimated animation="slideInRight" onPress={toggleLogin}>
                <SignUpButtonText>Já tenho uma conta</SignUpButtonText>
            </SignUpButtonAnimated>

        </Container>
    );
}

export default Login; 