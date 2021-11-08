import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { FAB } from 'react-native-paper'
const primary_color = "#0d47a1"
const HomeScreen = ({ user, navigation }) => {
    const [users, setUsers] = useState()
    const getUser = async () => {
        const querySanp = await firestore().collection('users').where('uid', '!=', user.uid).get()
        const allUsers = querySanp.docs.map(docSanp => docSanp.data())
        console.log(allUsers)
        setUsers(allUsers)
    }

    useEffect(() => {
        getUser()
    }, [])

    const RenderCard = ({ item }) => {
        return (
            <>
                <TouchableOpacity style={styles.mycard}
                    onPress={() => {
                        navigation.navigate('Chat', {
                            name: item.name,
                            uid: item.uid,
                            status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
                        })
                    }}
                >
                    <Image source={{ uri: item.pic }}
                        style={styles.img} />
                    <View>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>{item.email}</Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    }


    return (
        <>
            <View styl={styles.container}>
            <StatusBar barStyle='dark-content'
                        backgroundColor="#ffffff"
                    />
                <FlatList
                    data={users}
                    renderItem={({ item, index }) => <RenderCard item={item} />}
                    keyExtractor={(item) => item.uid}
                />

            </View>
            <FAB
                style={styles.fab}
                icon="face-profile"
                color={primary_color}
                onPress={() => navigation.navigate("account")}
            />
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary_color,
        alignItems: "center",
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: primary_color
    },
    text: {
        fontSize: 17,
        marginLeft: 15,
        color:"grey",
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: primary_color,
        alignItems:"center"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 20,
        backgroundColor: "#FFFFFF"
    },
})
export default HomeScreen;