import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';

const ws = new WebSocket('ws://54.198.45.10:8081');

export default function Chat({ route, navigation }) {
    const { userId } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const scrollViewRef = useRef();

    const getMessages = async () => {
        const response = await fetch('http://54.198.45.10:8080/messages');
        const m = await response.json();
        setMessages(m);
    }

    const sendMessage = () => {
        const body = {
            content: message,
            userId: userId,
        }
        ws.send(JSON.stringify(body));
        setMessage('');
    };

    useEffect(() => {
        getMessages();
        ws.onmessage = (msg) => {
            const jsonMessage = JSON.parse(msg.data);
            setMessages(prev => [...prev, jsonMessage]);
        };
        return () => {
            ws.close();
        };
    }, []);


    return (
        <SafeAreaView style={styles.chatView}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                keyboardVerticalOffset={Platform.OS === 'ios' ? 62 : 100}
                style={{ flexGrow: 1 }}
                onLayout={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    style={{ flex: 1 }}
                >
                    {messages.map(m => (
                        <View key={m.id} style={[ m.userId == userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
                            <Text style={[styles.chatMessageEmail , m.userId == userId ? { textAlign: 'right' } : { textAlign: 'left' }]} >{m.email}</Text>
                            <View style={styles.chatMessageView}>
                                <Text style={styles.chatMessageViewText}>{m.content}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.chatInputGroup}>
                    <TextInput 
                        value={message}
                        onChangeText={setMessage}
                        style={styles.chatInputText} 
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        style={styles.chatInputButton}
                    >
                        <Text style={styles.chatInputButtonText}>{'➤'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatView: {
        flexGrow: 1,
    },
    chatInputGroup: {
        flexDirection: 'row',
    },
    chatInputText: {
        width: '85%',
        height: 50,
        borderColor: '#9ca3af',
        borderWidth: 2,
        padding: 10,
        fontSize: 20,
    },
    chatInputButton: {
        width: '15%',
        height: 50,
        backgroundColor: '#9ca3af',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatInputButtonText: {
        fontSize: 30,
        color: '#ffffff',
    },
    chatMessageView: {
        padding: 10,
        margin: 10,
        backgroundColor: '#9ca3af',
        borderRadius: 10,
    },
    chatMessageViewText: {
        fontSize: 20,
        color: '#ffffff',
    },
    chatMessageEmail: {
        fontSize: 10,
        marginHorizontal: 10,
    },
});