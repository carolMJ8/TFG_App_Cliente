import React, { useState, useEffect } from 'react';
import {AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Magnetometer, Barometer, Gyroscope, LightSensor } from 'expo-sensors';
import * as FileSystemExpo from 'expo-file-system';
//import { appendFile } from 'react-native-fs';
//import { FileSystem } from 'react-native-file-access';
import { Parser } from '@json2csv/plainjs';
import AppNavigation from './src/navigation';
//import {init, end, send} from './funct_botons';



export default function App() {
  const [accelerometerData, setAccelerometerData] = useState({});
  const [accelerometerDataArray, setAccelerometerDataArray] = useState([]);

  const [magnetometerData, setMagnetometerData] = useState({});
  const [magnetometerDataArray, setMagnetometerDataArray] = useState([]);
  
  const [barometerData, setBarometerData] = useState({});
  const [barometerDataArray, setBarometerDataArray] = useState([]);

  const [gyroscopeData, setGyroscopeData] = useState({});
  const [gyroscopeDataArray, setGyroscopeDataArray] = useState([]);

  const [lightSensorData, setLightSensorData] = useState({});
  const [lightSensorDataArray, setLightSensorDataArray] = useState([]);

  /*const [PulsadoInit, setPulsadoInit] = useState(null);
  const [PulsadoEnd, setPulsadoEnd] = useState(null);
  const [PulsadoSend, setPulsadoSend] = useState(null);*/

  const [baseFilename, setBaseFilename] = useState("generic_basefilename");

  
  //alert(process.cwd())
  const rutaMaestra = FileSystemExpo.documentDirectory + 'HARdocs/';
  let nombrefile;
  const [finalContAcc, setFinalContAcc] = useState(0);
  let contador_acc = 0;
  const [finalContMag, setFinalContMag] = useState(0);
  let contador_mag = 0;
  const [finalContBar, setFinalContBar] = useState(0);
  let contador_bar = 0;
  const [finalContGyr, setFinalContGyr] = useState(0);
  let contador_gyr = 0;
  const [finalContLig, setFinalContLig] = useState(0);
  let contador_lig = 0;

  //console.log("Inicialización completa... Esperando acción de usuario");
  useEffect(() => {
    console.log("Estableciendo nombreBaseFile: " + baseFilename);
    }, [baseFilename]);


  async function checkDirectory() {
    try {
      const dirInfo = await FileSystemExpo.getInfoAsync(rutaMaestra);
      if (!dirInfo.exists) {
        await FileSystemExpo.makeDirectoryAsync(rutaMaestra, { intermediates: true });
        console.log("Creado directorio: " + rutaMaestra )
      }
      else {
        console.log("El directorio " + rutaMaestra + " ya existe!")
      }
    } catch (error) {
      console.log(error);
    }
    return
  }


  async function joinFiles(ruta, nombreFile) {
    
    try{

    // Crear un archivo de salida
    const archivoSalida = ruta + nombreFile + '.csv';

    // Obtener la lista de archivos en la ruta
    const files = await FileSystemExpo.readDirectoryAsync(ruta);

    content = "";
    for (const file of files) {
      if (file.startsWith(nombreFile)){
        console.log("Leido la info de " + file)
        const filePath = `${ruta}${file}`;
        // read the contents of the file
        const content_aux = await FileSystemExpo.readAsStringAsync(filePath);
        content = content + content_aux
      }
    }

    console.log("Creando el archivo " + nombreFile)
    await FileSystemExpo.writeAsStringAsync(archivoSalida, content, { encoding: FileSystemExpo.EncodingType.UTF8 });
    } catch(error){
      console.error(error)
    }

  }  
  
  async function deleteFiles(ruta, nombreFile) {
    // Obtener la lista de archivos en la ruta
    const archivos = await FileSystemExpo.readDirectoryAsync(ruta);
    // Iterar sobre los archivos en la ruta

    for (const archivo of archivos) {
      console.log(nombreFile + ' ' + archivo)
      if (archivo.startsWith(nombreFile) && archivo !== nombreFile.concat('.csv')){
        console.log(archivo + " esta siendo eliminado");
        await FileSystemExpo.deleteAsync(`${ruta}${archivo}`);
      }
    }
  }
  
  async function obtenerFechaHoraActual() {
    const fecha = new Date(); // crea un objeto Date con la fecha y hora actuales
    console.log(fecha)
    const fechaStr = fecha.toLocaleDateString(); // obtiene la fecha en formato legible
    console.log("Fecha: " + fechaStr);
    const horaStr = fecha.toLocaleTimeString(); // obtiene la hora en formato legible
    console.log("Hora: " + horaStr);
    cadena = fechaStr.concat('_' + horaStr).replace('/', '_').replace('/', '_').replace(':', '_').replace(':', '_')
    setBaseFilename(cadena); // devuelve una cadena con la fecha y hora
    //Wait para que le de tiempo a actualizar el nombre de baseFilename 
    // TODO OOJOO!!!!!!!!!!!!!!!! es una solucion momentanea, tiene que haber otra forma
    setTimeout(() => {}, 100);
    
    console.log("BaseFileName asignado: " + baseFilename)
    
    return cadena
  }

  async function write_file(nombrefile, arrayData){
    try{
      if (arrayData.length > 0){
        console.log("Escribiendo archivo " + nombrefile)
        //console.log("Data:" + JSON.stringify(arrayData));
        /*const fields = arrayData[0].keys();
        console.log(fields)
        const parser = new Parser({ fields });*/

        const opts = {};
        const parser = new Parser(opts);
        const csv = parser.parse(arrayData);
        //console.log(csv);
        await FileSystemExpo.writeAsStringAsync(rutaMaestra + nombrefile, csv, { encoding: FileSystemExpo.EncodingType.UTF8 });
      }
      else{
        console.log(nombrefile + " no ha recibido ningun dato");
        await FileSystemExpo.writeAsStringAsync(rutaMaestra + nombrefile, JSON.stringify(-1), { encoding: FileSystemExpo.EncodingType.UTF8 });

      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteArray(array){
    while(array.length > 0){
      array.pop();
    }
    return array
  }

  async function funct_init(){

    console.log("Buscando directorio ".concat(rutaMaestra).concat("..."));
    // Comprueba si existe una ruta universal donde escribir los archivos y , si no, la crea
    await checkDirectory();
    console.log("Estableciendo nombreBaseFile...");
    //Establecemos el nombre base de todos los archivos temporales hasta que se pulse el boton de end (en funcion de un nonce y/o la fecha y hora)
    cadaux = await obtenerFechaHoraActual();

    // Añadimos todos los listeners

    const interval = 100;
    const max_length = 20;
    let length_acc = 0;
    let length_mag = 0;
    let length_bar = 0;
    let length_gyr = 0;
    let length_lig = 0;
    
    Accelerometer.addListener(data => {
      setAccelerometerData(data);
      accelerometerDataArray.push(data);
      //setAccelerometerDataArray((prevArray) => [...prevArray, data]);
      length_acc = length_acc + 1;
      
      if (length_acc > max_length){
        //Creamos los nombres concatenando la fecha y hora, el sensor correspondiente y un nonce
        nombrefile = cadaux.concat("_ACC_").concat(contador_acc).concat(".csv");
        contador_acc = contador_acc + 1;
        setFinalContAcc(contador_acc);
        write_file(nombrefile, accelerometerDataArray);
        deleteArray(accelerometerDataArray);
        length_acc = 0;
      }

    });
    Accelerometer.setUpdateInterval(interval);

    Magnetometer.addListener(data => {
      setMagnetometerData(data);
      magnetometerDataArray.push(data);
      //setMagnetometerDataArray((prevArray) => [...prevArray, data]);
      length_mag = length_mag + 1;

      if (length_mag > max_length){
        nombrefile = cadaux.concat("_MAG_").concat(contador_mag).concat(".csv");
        contador_mag = contador_mag + 1;
        setFinalContMag(contador_mag);
        write_file(nombrefile, magnetometerDataArray);
        deleteArray(magnetometerDataArray);
        length_mag = 0;
      }
    });
    Magnetometer.setUpdateInterval(interval);

    Barometer.addListener(data => {
      setBarometerData(data);
      barometerDataArray.push(data);
      setBarometerDataArray((prevArray) => [...prevArray, data]);
      length_bar = length_bar + 1;

      if (length_bar > max_length){
        nombrefile = cadaux.concat("_BAR_").concat(contador_bar).concat(".csv");
        contador_bar = contador_bar + 1;
        setFinalContBar(contador_bar);
        write_file(nombrefile, barometerDataArray);
        deleteArray(barometerDataArray);
        length_bar = 0;
      }
    }); 
    Barometer.setUpdateInterval(interval);

    Gyroscope.addListener(data => {
      setGyroscopeData(data);
      gyroscopeDataArray.push(data);
      setGyroscopeDataArray((prevArray) => [...prevArray, data]);
      length_gyr = length_gyr + 1;

      if (length_gyr > max_length){
        nombrefile = cadaux.concat("_GYR_").concat(contador_gyr).concat(".csv");
        contador_gyr = contador_gyr + 1;
        setFinalContGyr(contador_gyr);
        write_file(nombrefile, gyroscopeDataArray);
        deleteArray(gyroscopeDataArray);
        length_gyr = 0;
      }
    });
    Gyroscope.setUpdateInterval(interval);

    LightSensor.addListener(data => {
      setLightSensorData(data);
      lightSensorDataArray.push(data);
      setLightSensorDataArray((prevArray) => [...prevArray, data]);
      length_lig = length_lig + 1;
      
      if (length_lig > max_length){
        nombrefile = cadaux.concat("_LIG_").concat(contador_lig).concat(".csv");
        contador_lig = contador_lig + 1;
        setFinalContLig(contador_lig);
        write_file(nombrefile, lightSensorDataArray);
        deleteArray(lightSensorDataArray);
        length_lig = 0;
      }
    });
    LightSensor.setUpdateInterval(interval);


    return
  }

  async function init(){
    console.log("function_init")
    await funct_init()
    console.log("Fin function_init")
    return  
  }

  async function removeListeners(){
    Accelerometer.removeAllListeners()
    Magnetometer.removeAllListeners()
    Barometer.removeAllListeners()
    Gyroscope.removeAllListeners()
    LightSensor.removeAllListeners()
    return
  }

  async function resetCounters(){
    contador_acc = 0;
    contador_mag = 0;
    contador_bar = 0;
    contador_gyr = 0;
    contador_lig = 0;
    return
  }

  async function writeFinalFiles(){
    console.log("Dentro de finalfiles: " + baseFilename)
    nombrefile = baseFilename.concat("_ACC_").concat(finalContAcc).concat(".csv");
    await write_file(nombrefile, accelerometerDataArray);
    deleteArray(accelerometerDataArray);
    console.log("Acc_final escrito con " + accelerometerDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_MAG_").concat(finalContMag).concat(".csv");
    await write_file(nombrefile, magnetometerDataArray);
    deleteArray(magnetometerDataArray);
    console.log("Mag_final escrito con " + magnetometerDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_BAR_").concat(finalContBar).concat(".csv");
    await write_file(nombrefile, barometerDataArray);
    deleteArray(barometerDataArray);
    console.log("Bar_final escrito con " + barometerDataArray)

    nombrefile = baseFilename.concat("_GYR_").concat(finalContGyr).concat(".csv");
    await write_file(nombrefile, gyroscopeDataArray);
    deleteArray(gyroscopeDataArray);
    console.log("Gyr_final escrito con " + gyroscopeDataArray.length + " datos.")

    nombrefile = baseFilename.concat("_LIG_").concat(finalContLig).concat(".csv");
    await write_file(nombrefile, lightSensorDataArray);
    deleteArray(lightSensorDataArray);
    console.log("Lig_final escrito con " + lightSensorDataArray.length + " datos.")

    return
  }

  async function funct_end(){
    console.log("Dentro de end " + baseFilename)
    // Quitamos todos los listeners
    console.log("Quitando los listeners...")
    await removeListeners()

    
    // Reseteamos los contadores de nuevo

    console.log("Reseteando contadores...")
    await resetCounters()

    //Escribimos a un archivo temporal los datos que tenemos hasta ahora en los array de datos

    console.log("Escribiendo archivos finales...")
    await writeFinalFiles()
    
    //Reunimos todos los archivos temporales y los unificamos en uno mismo

    console.log("Uniendo archivos temporales...")
    // Unificamos todos los archivos con el mismo nombre
    await joinFiles(rutaMaestra, baseFilename + '_ACC')
    await joinFiles(rutaMaestra, baseFilename + '_MAG')
    await joinFiles(rutaMaestra, baseFilename + '_BAR')
    await joinFiles(rutaMaestra, baseFilename + '_GYR')
    await joinFiles(rutaMaestra, baseFilename + '_LIG')

    console.log("Eliminando archivos temporales...")
    // Eliminamos los archivos temporales
    await deleteFiles(rutaMaestra, baseFilename + '_ACC')
    await deleteFiles(rutaMaestra, baseFilename + '_MAG')
    await deleteFiles(rutaMaestra, baseFilename + '_BAR')
    await deleteFiles(rutaMaestra, baseFilename + '_GYR')
    await deleteFiles(rutaMaestra, baseFilename + '_LIG')

    return
  }

  async function end(){
    console.log("function_end")
    await funct_end()
    console.log("Fin function_end")
    return    
  }   
  
  function printFiles(files) {
    files.forEach((file) => {
      console.log(file);
    });
  }

  async function deleteAllFilesInDirectory(directory) {
    try {
      const files = await FileSystemExpo.readDirectoryAsync(directory);
      // Loop through the files in the directory and delete them one by one
      for (const file of files) {
        await FileSystemExpo.deleteAsync(`${directory}/${file}`);
      }
    } catch (error) {
      console.error(`Failed to delete files in directory ${directory}: ${error}`);
    }
  }

  async function funct_send(){
    //Seleccionamos todos los archivos generados guardados y los encviamos a una direccion IP "hardcodeada"
    const archivos = await FileSystemExpo.readDirectoryAsync(rutaMaestra);
    console.log("Archivos en el directorio....")
    console.log(rutaMaestra);
    printFiles(archivos.sort()); // Array de nombres de archivo
    //Eliminamos estos archivos para que no se vuelvan a enviar
    console.log("Eliminando todos los archivos del directorio...")
    await deleteAllFilesInDirectory(rutaMaestra)
    /*for (const archivo of archivos) {
      if (archivo.endsWith('.csv')) {
        console.log(archivo)
        const contenido = await FileSystemExpo.readAsStringAsync(`${rutaMaestra}/${archivo}`);
        console.log(contenido)
      }
    }*/
  }

  async function send(){
    console.log("function_send")
    await funct_send()
    console.log("Fin function_send")
    return
  }
  return(
    <AppNavigation/>
    // <View style={styles.container}>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Acelerómetro</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>Eje X: {accelerometerData.x} m/s^2</Text>
    //     <Text>Eje Y: {accelerometerData.y} m/s^2</Text>
    //     <Text>Eje Z: {accelerometerData.z} m/s^2</Text>
    //   </View>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Magnetómetro</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>Eje X: {magnetometerData.x} micro T</Text>
    //     <Text>Eje Y: {magnetometerData.y} micro T</Text>
    //     <Text>Eje Z: {magnetometerData.z} micro T</Text>
    //   </View>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Giroscopio</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>Eje X: {gyroscopeData.x} rad/s</Text>
    //     <Text>Eje Y: {gyroscopeData.y} rad/s</Text>
    //     <Text>Eje Z: {gyroscopeData.z} rad/s</Text>
    //   </View>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Presión</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>{barometerData.pressure} hPa</Text>
    //   </View>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Altitud</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>{barometerData.altitude} m</Text>
    //   </View>
    //   <View style={styles.acc_container}>
    //     <Text style={styles.sensor_title}>Iluminación</Text>
    //   </View>
    //   <View style={styles.data_container}>
    //     <Text>{lightSensorData.illuminance} lux</Text>
    //   </View>
    //   <Pressable style={styles.button_init} onPress={() => {
    //     init()
    //   }}>
    //     <Text style={styles.text_buttons}>Empezar</Text>
    //   </Pressable>
    //   <Pressable style={styles.button_end} onPress={() => {
    //     end()
    //   }}>
    //     <Text style={styles.text_buttons}>Terminar</Text>
    //   </Pressable>
    //   <Pressable style={styles.button_send} onPress={() => {
    //     send()
    //   }}>
    //     <Text style={styles.text_buttons}>Enviar</Text>
    //   </Pressable>
    // </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sensor_title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  acc_container: {
    padding: 10,
    backgroundColor: "lightblue",
  },
  data_container:{
    padding: 10,
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
  },
  button_end: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  button_send: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  }
});