import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import login_screen from './src/screens/login_screen';
import signup_screen from './src/screens/sigup_screen';
import HomeScreen from './src/screens/home_screen';
import auth from "@react-native-firebase/auth"
import ChatScreen from './src/screens/ChatScreen';
import { Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import AccountScreen from './src/screens/AccountScreen';

const color = "#003489"

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFFFFF',
    accent: '#123',
  },
};

const Stack = createStackNavigator();
const App = () => {
  const [user, setUser] = useState('')
  useEffect(() => {
    const unRegister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist)
        firestore().collection('users').doc(userExist.uid).update({ status: "online" })
      }
      else setUser('')

    })

    return () => {
      unRegister()
    }
  }, [])

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="signup_screen" screenOptions={{
          headerTintColor: "#0d47a1"
        }}>
          {user ?
            <>
              <Stack.Screen name="home_screen"
                options={{
                  title: "Chats"
                }}
              >
                {props => <HomeScreen {...props} user={user} />}

              </Stack.Screen>
              <Stack.Screen name="Chat" options={({ route }) => ({
                title:
                  <View><Text style={{color:"black"}}>
                    {route.params.name}
                  </Text>
                    <Text style={{color:"grey"}}>{route.params.status}</Text>
                  </View>
              })}  >
                {props => <ChatScreen {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="account" options={({routes})=>({
                title:"Profile"
              })} >
                {props => <AccountScreen {...props} user={user} />}
              </Stack.Screen>
            </>
            :
            <>
              <Stack.Screen name="login_screen" component={login_screen} options={{ headerShown: false }} />
              <Stack.Screen name="signup_screen" component={signup_screen} options={{ headerShown: false }} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer >
    </PaperProvider >
  );
};


export default App;




// /chatrooms/8wP73VkyNROT3SOtB8EP2TFqJNi2-SXzclO7O0pfafNTLgoJ3jciHMw93