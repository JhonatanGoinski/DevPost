import styled from "styled-components/native";

export const Container = styled.View`
flex: 1;
align-items: center;
background-color: #353840;
`;
export const Name = styled.Text`
margin-top: 20px;
margin-right: 20px;
margin-left: 20px;
font-size: 28px;
font-weight: bold;
color: #FFF;
`;
export const Email = styled.Text`
color: #FFF;
margin-right: 20px;
margin-left: 20px;
margin-top: 10px;
font-size: 18px;
font-style: italic;
`;
export const Button = styled.TouchableOpacity`
margin-top: 16px;
background-color: ${props => props.bg};
width: 80%;
height: 50px;
border-radius: 4px;
align-items: center;
justify-content: center;
`;
export const ButtonText = styled.Text`
font-size: 18px;
color: ${props => props.color};
`;
export const UploadButton = styled.TouchableOpacity`
margin-top: 20%;
background-color: #ddd;
width: 165px;
height: 165px;
border-radius: 90px;
align-items: center;
justify-content: center;
z-index: 9;
`;
export const UploadText = styled.Text`
font-size: 55px;
position: absolute;
color: #121212;
opacity: 0.3;
z-index: 99;
`;
export const Avatar = styled.Image`
width: 160px;
height: 160px;
border-radius: 80px;
`;
export const ModalContainer = styled.KeyboardAvoidingView`
width: 100%;
height: 55%;
background-color: #FFF;
position: absolute;
bottom: 0;
align-items: center;
justify-content: center;
`;
export const ButtonBack = styled.TouchableOpacity`
position: absolute;
top: 15px;
left: 25px;
flex-direction: row;
align-items: center;
`;
export const Input = styled.TextInput`
background-color: #DDD;
width: 80%;
border-radius: 4px;
padding: 10px;
font-size: 18px;
color: #121212;
text-align: center;
`; 