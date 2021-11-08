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
    ToastAndroid,
    StatusBar
} from "react-native"
import storage from "@react-native-firebase/storage"
import * as ImagePicker from 'react-native-image-picker';
import { TextInput } from "react-native-paper"
import auth from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore'
const { width, height } = Dimensions.get("window")

const primary_color = "#0d47a1"
const signup_screen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    if (loading) {
        return <View style={{ height: height, width: width, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color={primary_color} /></View>
    }
    const userSignUp = async () => {
        setLoading(true)
        if (!email || !password || !name || !image) {
            alert(" please add all feilds ")
        }
        try {
            const result = await auth().createUserWithEmailAndPassword(email, password)
            firestore().collection('users').doc(result.user.uid).set({
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                pic: image,
                status: "online"
            })
            setLoading(false)
        } catch (err) {
            alert("something went wrong")
        }

    }


    const selectFromGallery = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary({ options, includeBase64: true }, (res) => {


            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                const uploadTask = storage().ref().child(`/userprofile/${Date.now()}`).putFile(res.assets[0].uri)

                uploadTask.on('state_changed',
                    (snapshot) => {

                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (progress == 100) ToastAndroid.show("image uploaded", ToastAndroid.SHORT)

                    },
                    (error) => {
                        alert("error uploading image")
                    },
                    () => {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            setImage(downloadURL)
                        });
                    }
                );

            }
        });

    }
    return (
        <>

            <ScrollView style={{ width: "100%", height: "100%" }}>
                <View style={[styles.container]}>
                    <StatusBar barStyle='dark-content'
                        backgroundColor="#ffffff"
                    />
                    <Text style={styles.text}>Hello From SignUp </Text>
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
                            label="Name"
                            value={name}
                            onChangeText={(text) => {
                                setName(text)
                            }}
                            style={styles.text_input_style}
                            mode="flat"
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
                            selectFromGallery()
                        }}
                    >
                        <Text style={styles.text_in_buttom}>select Photo From Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttom}
                        onPress={() => {
                            if (!image || !email || !name || !password) {
                                ToastAndroid.show("please Enter All Data", ToastAndroid.SHORT)
                            } else {
                                userSignUp()
                            }
                        }}
                    >
                        <Text style={styles.text_in_buttom}>SignUp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttom}
                        onPress={() => {
                            navigation.navigate("login_screen")
                        }}
                    >
                        <Text style={styles.text_in_buttom}>LogIn</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: height,
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: height * .05
    },
    text: {
        fontSize: 20,
        color: primary_color
    },
    img: {
        width: height * .2,
        height: height * .2,
    },
    box_inputs: {
        paddingVertical: height * .04,
        justifyContent: "space-between",
        height: height * .4,
        backgroundColor: "white",
        width: width * .9,
        alignItems: "center",
        borderRadius: 30,
        elevation: 5,
        borderColor: primary_color,
        borderWidth: .5,
        backgroundColor: "#FFFFFF"
    },
    text_input_style: {
        width: 300,
    },
    buttom: {
        width: width * .9,
        height: height * .07,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 10,
        marginTop: height * .014,
        borderColor: primary_color,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text_in_buttom: {
        color: primary_color,
        fontSize: 20
    },
    buttom_gallery: {
        width: "90%",
        height: height * .07,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 10,
        marginTop: height * .015,
        borderColor: primary_color,
        borderWidth: .5,
        alignItems: "center",
        justifyContent: "center"
    }
})
export default signup_screen;