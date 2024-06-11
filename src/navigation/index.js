import { View, Text, StyleSheet, Pressable, Platform, AppRegistry } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import Data from "../screens/DataScreen";

//AppRegistry.registerComponent('main', ()=> App);
const stack_navigation = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <stack_navigation.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <stack_navigation.Screen name="Welcome" component={WelcomeScreen}></stack_navigation.Screen>
                <stack_navigation.Screen name="Data" component={Data}></stack_navigation.Screen>
            </stack_navigation.Navigator>
        
        </NavigationContainer>
    );
}