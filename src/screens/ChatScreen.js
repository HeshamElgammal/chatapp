import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View } from "react-native"
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'

const primary_color = "#0d47a1"

const ChatScreen = ({ user, route }) => {
    const [messages, setMessages] = useState([]);
    const { uid } = route.params
    const getAllMessages = async ()=>{
        const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
        const querySanp = await firestore().collection('chatrooms')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt',"desc")
        .get()
       const allmsg =   querySanp.docs.map(docSanp=>{
            return {
                ...docSanp.data(),
                createdAt:docSanp.data().createdAt.toDate()
            }
        })
        setMessages(allmsg)

    
     }
    useEffect(() => {
        // getAllMessages()

        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const messageRef = firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc")

        const unSubscribe = messageRef.onSnapshot((querySnap) => {
            const allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data()
                if (data.createdAt) {
                    return {
                        ...docSanp.data(),
                        createdAt: docSanp.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...docSanp.data(),
                        createdAt: new Date()
                    }
                }

            })
            setMessages(allmsg)
        })


        return () => {
            unSubscribe()
        }


    }, [])
    const onSend = (messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

        firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })


    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <StatusBar barStyle='dark-content'
                        backgroundColor="#ffffff"
                    />
            <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: user.uid,
                }}
                renderBubble={(props) => {
                    return <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: primary_color,

                            }

                        }}
                    />
                }}

                renderInputToolbar={(props) => {
                    return <InputToolbar {...props}
                        containerStyle={{ borderTopWidth: 1.5, borderTopColor: primary_color }}
                        textInputStyle={{ color: "black" }}
                    />
                }}

            />
        </View>
    );
}

export default ChatScreen;

