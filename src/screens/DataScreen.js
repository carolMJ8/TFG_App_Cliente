import React, { useState, useEffect } from 'react';
import {Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Accelerometer, Magnetometer, Barometer, Gyroscope, LightSensor } from 'expo-sensors';
import still from '../../assets/ModosTransporte/quieto.png';
import walking from '../../assets/ModosTransporte/andando.png';
import running from '../../assets/ModosTransporte/corriendo.png';
import bike from '../../assets/ModosTransporte/bici.png';
import car from '../../assets/ModosTransporte/coche.png';
import bus from '../../assets/ModosTransporte/bus.png';
import metro from '../../assets/ModosTransporte/metro.png';
import train from '../../assets/ModosTransporte/tren.png';
import axios from 'axios';

export default function DataScreen() {
    
    const [accelerometerDataArray, setAccelerometerDataArray] = useState([]);
    const [magnetometerDataArray, setMagnetometerDataArray] = useState([]);
    const [barometerDataArray, setBarometerDataArray] = useState([]);
    const [gyroscopeDataArray, setGyroscopeDataArray] = useState([]);

    const [windowsAcelX, setWindowsAcelX] = useState([]);
    const [windowsAcelY, setWindowsAcelY] = useState([]);
    const [windowsAcelZ, setWindowsAcelZ] = useState([]);

    const [windowsMagX, setWindowsMagX] = useState([]);
    const [windowsMagY, setWindowsMagY] = useState([]);
    const [windowsMagZ, setWindowsMagZ] = useState([]);

    const [windowsGirosX, setWindowsGirosX] = useState([]);
    const [windowsGirosY, setWindowsGirosY] = useState([]);
    const [windowsGirosZ, setWindowsGirosZ] = useState([]);

    const [windowsPres, setWindowsPres] = useState([]);

    const [entroPres, setEntroPres] = useState(0);
    const [entroRequest, setEntroRequest] = useState(false);
    
    const [requestSent, setRequestSent] = useState(false);
    const [windowsAcelCreated, setWindowsAcelCreated] = useState(false);
    const [windowsMagCreated, setWindowsMagCreated] = useState(false);
    const [windowsGirosCreated, setWindowsGirosCreated] = useState(false);
    const [windowsPresCreated, setWindowsPresCreated] = useState(false);

    const [transportMode, setTransportMode] = useState("");
    const [answer, setAnswer] = useState("");

    const windowSize = 500;

    useEffect(() => {
        const magnetometerDataHandler = (data) => {
            setMagnetometerDataArray(prevData => {
                const newData = [...prevData, data];
                if (newData.length > windowSize) {
                    return newData.slice(-windowSize);
                } else {
                    return newData;
                }
            });
            
            if (magnetometerDataArray.length === windowSize && windowsMagCreated === false){
                const magnetometerWindows = createMagnetometerArrays(magnetometerDataArray);
                windowsMagX.push(magnetometerWindows.x[0]);
                windowsMagY.push(magnetometerWindows.y[0]);
                windowsMagZ.push(magnetometerWindows.z[0]);
                setWindowsMagCreated(true);
            }

            if (requestSent === false  && windowsAcelCreated === true
            && windowsMagCreated === true && windowsGirosCreated === true && entroRequest === false) {
                setEntroRequest(true);
                const windows = {
                    windowsAcelX,
                    windowsAcelY,
                    windowsAcelZ,
                    windowsMagX,
                    windowsMagY,
                    windowsMagZ,
                    windowsGirosX,
                    windowsGirosY,
                    windowsGirosZ
                };
                sendRequest();

                for (const key in windows) {
                    if (windows.hasOwnProperty(key)) {
                        windows[key].shift();
                    }
                }
                setRequestSent(false)
                setWindowsAcelCreated(false);
                setWindowsMagCreated(false);
                setWindowsGirosCreated(false);
                setAccelerometerDataArray([]);
                setMagnetometerDataArray([]);
                setGyroscopeDataArray([]);
                setEntroRequest(false);
            }

        };

        Magnetometer.addListener(data => {
            if (data) {
                magnetometerDataHandler(data)
            }
        
        });
        Magnetometer.setUpdateInterval(100);

        return () => {
            Magnetometer.removeAllListeners();
        };

    }, [magnetometerDataArray]);

    useEffect(() => {
        const giroscopeDataHandler = (data) => {
            const dupData = Array.from({length: 2}, () => ({ ...data }));
            setGyroscopeDataArray(prevData => {
                const newData = [...prevData, data];
                if (newData.length > windowSize) {
                    return newData.slice(-windowSize);
                } else {
                    return newData;
                }
            });
            
            if (gyroscopeDataArray.length === windowSize && windowsGirosCreated === false){
                const gyroscopeWindows = createGyroscopeArrays(gyroscopeDataArray);
                windowsGirosX.push(gyroscopeWindows.x[0]);
                windowsGirosY.push(gyroscopeWindows.y[0]);
                windowsGirosZ.push(gyroscopeWindows.z[0]);
                setWindowsGirosCreated(true);
            }

        };

        Gyroscope.addListener(data => {
            if (data) {
                giroscopeDataHandler(data)
            }
        
        });
        Gyroscope.setUpdateInterval(100);

        return () => {
            Gyroscope.removeAllListeners();
        };
    }, [gyroscopeDataArray]);

    useEffect(() => {
        const accelerometerDataHandler = (data) => {
            setAccelerometerDataArray(prevData => {
                const newData = [...prevData, data];
                if (newData.length > windowSize) {
                    return newData.slice(-windowSize);
                } else {
                    return newData;
                }
            });
            
            if (accelerometerDataArray.length === windowSize && windowsAcelCreated === false){
                const accelerometerWindows = createAccelerometerArrays(accelerometerDataArray);
                windowsAcelX.push(accelerometerWindows.x[0]);
                windowsAcelY.push(accelerometerWindows.y[0]);
                windowsAcelZ.push(accelerometerWindows.z[0]);
                setWindowsAcelCreated(true);
            }
    
        };

        Accelerometer.addListener(data => {
            if (data) {
                accelerometerDataHandler(data)
            }
        
        });
        Accelerometer.setUpdateInterval(100);

        return () => {
            Accelerometer.removeAllListeners();
        };
    }, [accelerometerDataArray]);

    function createAccelerometerArrays(data){
        let arrayAuxAcelX = [];
        let arrayAuxAcelY = [];
        let arrayAuxAcelZ = [];
    
        data.forEach(element => {
            arrayAuxAcelX.push(element.x)
            arrayAuxAcelY.push(element.y);
            arrayAuxAcelZ.push(element.z);
        });

        if (arrayAuxAcelX.length === windowSize && arrayAuxAcelY.length === windowSize && arrayAuxAcelZ.length === windowSize && windowsAcelCreated === false){
            setAccelerometerDataArray([]);
            let normAcelX = calculateZScoreFromArrays(arrayAuxAcelX);
            let normAcelY = calculateZScoreFromArrays(arrayAuxAcelY);
            let normAcelZ = calculateZScoreFromArrays(arrayAuxAcelZ);
            let windows = createSlidingWindows({'X': normAcelX._j, 'Y': normAcelY._j, 'Z': normAcelZ._j}, windowSize, "acel");

            return windows; 
        }
    }

    function createMagnetometerArrays(data){
        let arrayAuxMagX = [];
        let arrayAuxMagY = [];
        let arrayAuxMagZ = [];
    
        data.forEach(element => {
            arrayAuxMagX.push(element.x)
            arrayAuxMagY.push(element.y);
            arrayAuxMagZ.push(element.z);
        });

        if (arrayAuxMagX.length === windowSize && arrayAuxMagY.length === windowSize && arrayAuxMagZ.length === windowSize && windowsMagCreated === false){
            setMagnetometerDataArray([]);
            let normMaglX = calculateZScoreFromArrays(arrayAuxMagX);
            let normMaglY = calculateZScoreFromArrays(arrayAuxMagY);
            let normMaglZ = calculateZScoreFromArrays(arrayAuxMagZ);
            let windows = createSlidingWindows({'X': normMaglX._j, 'Y': normMaglY._j, 'Z': normMaglZ._j}, windowSize, "mag");

            return windows;
        }
    }

    function createGyroscopeArrays(data){
        let arrayAuxGyrosX = [];
        let arrayAuxGyrosY = [];
        let arrayAuxGyrosZ = [];
    
        data.forEach(element => {
            arrayAuxGyrosX.push(element.x)
            arrayAuxGyrosY.push(element.y);
            arrayAuxGyrosZ.push(element.z);
        });

        if (arrayAuxGyrosX.length === windowSize && arrayAuxGyrosY.length === windowSize && arrayAuxGyrosZ.length === windowSize && windowsGirosCreated === false){
            setGyroscopeDataArray([]);
            let normGyrosX = calculateZScoreFromArrays(arrayAuxGyrosX);
            let normGyrosY = calculateZScoreFromArrays(arrayAuxGyrosY);
            let normGyrosZ = calculateZScoreFromArrays(arrayAuxGyrosZ);
            let windows = createSlidingWindows({'X': normGyrosX._j, 'Y': normGyrosY._j, 'Z': normGyrosZ._j}, windowSize, "gyros");
            
            return windows;
        }
    }

    function createSlidingWindows(data, windowSize, sensor){
        const tamArrays = data.X.length;
        let xWindows = [];
        let yWindows = [];
        let zWindows = [];
        
        if (sensor === "pres" && tamArrays < windowSize) {
            for (let i=0; i < tamArrays; i++){
                windowsPres.push([data.X[i]]);
            }
            return;
        }

        for (let j=0; j < tamArrays; j+=windowSize){
            let XAux = [];
            let YAux = [];
            let ZAux = [];
            for (let i=j; i < windowSize; i++) {
                const sectionX = [data.X[i]];
                const sectionY = [data.Y[i]];
                const sectionZ = [data.Z[i]];
                XAux.push(sectionX);
                YAux.push(sectionY);
                ZAux.push(sectionZ);
            }
            xWindows.push(XAux);
            yWindows.push(YAux);
            zWindows.push(ZAux);

        }

        return {x: xWindows, y: yWindows, z: zWindows};
    }



    async function calculateZScoreFromArrays(array) {
        //Z-core = (dato - media) / desv. estandar

        //Media
        const data = array.reduce((acc, val) => acc + val, 0);
        const mean = data / array.length;

        //Desv. Estandar
        const sumSqrtDiff = array.reduce((acc, val) => {
            const dif = val - mean;
            return acc + Math.pow(dif, 2);
        }, 0)
        const variance = sumSqrtDiff / array.length;
        const standardDev = Math.sqrt(variance);

        return array.map(value => (value - mean) / standardDev);
    }

    async function sendRequest() {
        console.log("Enviando peticion");

        axios.post("https://render-tfg-django-app.onrender.com/modelo/", {
            windowsAcelX: windowsAcelX[0],
            windowsAcelY: windowsAcelY[0],
            windowsAcelZ: windowsAcelZ[0],
            windowsMagX: windowsMagX[0],
            windowsMagY: windowsMagY[0],
            windowsMagZ: windowsMagZ[0],
            windowsGirosX: windowsGirosX[0],
            windowsGirosY: windowsGirosY[0],
            windowsGirosZ: windowsGirosZ[0]
        })
        .then(response => {
            const res = response.data.respuesta;
            const clase = response.data.clase;
            if (clase === 0) {
                setTransportMode("Quieto");
            }
            else if (clase === 1) {
                setTransportMode("Andando");

            }
            else if (clase === 2) {
                setTransportMode("Corriendo");
            }
            else if (clase === 3) {
                setTransportMode("Bicicleta");
            }
            else if (clase === 4) {
                setTransportMode("Coche");
            }
            else if (clase === 5) {
                setTransportMode("Autobús");
            }
            else if (clase === 6) {
                setTransportMode("Tren");
            }
            else if (clase === 7) {
                setTransportMode("Metro");
            }
        })
        .catch(error => {
            console.error("Error al enviar los datos a Django",  error);
        });

        setRequestSent(true);

    }

    const whichTransport = () => {
        switch(transportMode) {
            case "Quieto":
                return <Image source={still} style={styles.image}/>
            case "Andando":
                return <Image source={walking} style={styles.image}/>
            case "Corriendo":
                return <Image source={running} style={styles.image}/>
            case "Bicicleta":
                return <Image source={bike} style={styles.image}/>
            case "Coche":
                return <Image source={car} style={styles.image}/>
            case "Autobús":
                return <Image source={bus} style={styles.image}/>
            case "Tren":
                return <Image source={train} style={styles.image}/>
            case "Metro":
                return <Image source={metro} style={styles.image}/>
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.image_container}>
                <Text>Método de transporte: {transportMode}</Text>
                <View>
                    {/* <Text>{answer}</Text> */}
                </View>
                <View>
                    {whichTransport()}
                </View>
            </View>
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
    image_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
  });

