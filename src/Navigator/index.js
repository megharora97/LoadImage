import * as React from 'react';
import { View, Text, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import Details from '../Screens/Details';



const Stack = createStackNavigator();

function MainApp() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="Details" component={Details}
                    options={{
                        headerShown: false
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainApp;