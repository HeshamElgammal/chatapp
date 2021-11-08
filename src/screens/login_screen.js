import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    ToastAndroid
} from "react-native"
import { useTheme } from 'react-native-paper'

import { TextInput } from "react-native-paper"
import auth from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore'
const primary_color = "#0d47a1"
const { width, height } = Dimensions.get("window")

const login_screen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <ActivityIndicator size="large" color={primary_color} />
    }
    const userLogIn = async () => {
        setLoading(true)
        if (!email || !password) {
            alert(" please add all feilds ")
        }
        try {
            const result = await auth().signInWithEmailAndPassword(email, password)

            setLoading(false)
        } catch (err) {
            alert("something went wrong")
        }

    }

    return (
        <>

            <ScrollView style={{ width: "100%" }}>
                <View style={[styles.container]}> 
                    <StatusBar barStyle='dark-content'
                        backgroundColor="#ffffff"
                    />
                    <Text style={styles.text}>Hello From LogIn </Text>
                    <Image
                        source={require('../images/chatting.png')}
                        style={styles.img}
                    />
                    <View style={styles.box_inputs}>
                        <TextInput
                            label="Email"
                            value={email}

                            onChangeText={(text) => {
                                setEmail(text)
                            }}
                            mode="flat"
                            style={styles.text_input_style}
                            theme={{
                                colors: {
                                    primary: primary_color,
                                    underlineColor: primary_color, background: 'transparent'
                                }
                            }}
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                            mode="flat"
                            theme={{
                                colors: {
                                    primary: primary_color,
                                    underlineColor: primary_color, background: 'transparent'
                                }
                            }}
                            style={styles.text_input_style}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.buttom}
                        onPress={() => {
                            if (!email || !password) {
                                ToastAndroid.show("please Enter All Data", ToastAndroid.SHORT)
                            } else {
                                userLogIn()
                            }
                        }}
                    >
                        <Text style={styles.text_in_buttom}>LogIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttom}
                        onPress={() => {
                            navigation.navigate("signup_screen")
                        }}
                    >
                        <Text style={styles.text_in_buttom}>SignUp</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingTop: height * .05
    },
    text: {
        fontSize: 22,
        color: primary_color
    },
    img: {
        width: height * .2,
        height: height * .2,
    },
    box_inputs: {
        paddingVertical: height * .04,
        justifyContent: "space-between",
        height: height * .3,
        backgroundColor: "#FFFFFF",
        width: width * .9,
        alignItems: "center",
        borderRadius: 30,
        elevation: 5,
        borderColor: primary_color,
        borderWidth: 1,
        marginBottom: height * .05
    },
    text_input_style: {
        width: 300,

    },
    buttom: {
        width: width*.9,
        height: height * .08,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 10,
        marginTop: height * .015,
        borderColor: primary_color,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text_in_buttom: {
        color: primary_color,
        fontSize: 22
    }
})
export default login_screen;