import { View, Text, StyleSheet, Pressable, } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

export default function WelcomeScreen() {

  const nav = useNavigation();
  
  const [answer, setAnswer] = useState("");

	async function sendRequest() {
		console.log("Dentro de sendRequest");

		axios.post("https://render-tfg-django-app.onrender.com/modelo/", {
			mensaje: "holaaaaaa"
		})
		.then(response => {
			const res = response.data.respuesta;
			console.log("HE RECIBIDO LA PUTA RESPUESTA JODEEEEER");
			setAnswer("Se mandan y reciben bien las peticiones al server :)" + res);
		})
		.catch(error => {
			console.error("Error al enviar los datos a Django",  error);
		});

		//setRequestSent(true);
	}

	function whichAnswer(){
		if (answer === "")
			return <Text>No se mandó bien la respuesta</Text>
		else
			return <Text>{answer}</Text>
	}

	return (
		<View style={styles.container}>
			<View style={styles.app_title}>
				<Text style={{
				textAlign:'center',
				fontSize: 20,}}>
					Bienvenidos a la aplicación del Trabajo de Fin de Grado de Carolina Monedero Juzgado
				</Text>
			</View>
			<View>
				<Pressable style={styles.button_init} onPress={() => {
					nav.navigate("Data")
				}}>
					<Text style={styles.text_buttons}>Empezar</Text>
				</Pressable>           
			</View>
			{/* <View>
				<Pressable style={styles.button_init} onPress={() => {
					sendRequest();
				}}>
					<Text style={styles.text_buttons}>Prueba mandar peticion</Text>
				</Pressable>
                <View>
                    {whichAnswer()}
                </View>    
			</View> */}
		</View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
    },
    app_title: {
        padding: 20,
    },
    text_buttons: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    button_init: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'green',
    }
  });