import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar } from "react-native"
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import auth from '@react-native-firebase/auth'

const primary_color = "#0d47a1"
const { width, height } = Dimensions.get("window")
function AccountScreen({ user }) {
    const [profile, setProfile] = useState('')

    useEffect(() => {
        firestore().collection('users').doc(user.uid).get().then(docSnap => {
            setProfile(docSnap.data())
        })
    }, [])

    if (!profile) {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color={primary_color} /></View>
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle='dark-content'
                backgroundColor="#ffffff"
            />
            <Image style={styles.img} source={{ uri: profile.pic }}
            />
            <View style={styles.box_name}>
                <Feather name="user" size={30} color={primary_color} />
                <Text style={styles.text}>{profile.name}</Text>
            </View>
            <View style={styles.box_name}>
                <Feather name="mail" size={30} color={primary_color} />
                <Text style={[styles.text]}>{profile.email}</Text>
            </View>
            <TouchableOpacity
                style={styles.btn}

                onPress={() => {
                    firestore().collection('users')
                        .doc(user.uid)
                        .update({
                            status: firestore.FieldValue.serverTimestamp()
                        }).then(() => {
                            auth().signOut()
                        })
                }}
            >
                <Text style={[styles.text, { marginLeft: 0 }]}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
    },
    img: {
        width: height * .3,
        height: height * .3,
        borderRadius: height * .15,
        borderWidth: 2,
        borderColor: primary_color,
        marginBottom: height * .05,
    },
    text: {
        fontSize: 19,
        color: primary_color,
        marginLeft: 10

    },
    btn: {
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        height: height * .08,
        width: width * .6,
        elevation: 3,
        borderRadius: width * .1,
        backgroundColor: "#FFFFFF",
        borderColor: primary_color
    },
    box_name: {
        width: "90%",
        borderWidth: 0,
        padding: 20,
        borderRadius: 20,
        marginBottom: height * .05,
        borderColor: primary_color,
        elevation: 2,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center"
    }
})


export default AccountScreen;