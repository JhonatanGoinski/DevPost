import React from "react";
import { Text } from "react-native";
import { Container, Title } from "./styles";

function Header() {
    return (
        <Container>
            <Title style={{ fontStyle: 'italic' }}>
                Dev
                <Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#E52246' }}>Post</Text>
            </Title>
        </Container>
    );
}

export default Header; 