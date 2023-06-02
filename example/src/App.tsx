/* eslint-disable */

import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
//import { multiply, TerraGraph } from 'react-native-terra-react-graphs';
import { Connections, initConnection, initTerra } from 'terra-react';

async function inits() {

  let token = "e7817e0d9b90ddd73be567cccd8eb76a0d5ac7c83dbb06ea806761b5e78bf563"

  try {
    var abc = await initTerra("testingJeffrey", "1")
    console.log("abc: " + abc.success)
  }
  catch{
    console.log("terra failed")
  }
  try {
    var def = await initConnection(Connections.APPLE_HEALTH, token, true)
    console.log("def: " + def.success)
  }
  catch{
    console.log("conn failed")
  }
}

export default function App() {


  inits()



   return (
    <View style={styles.container}>
      <Text>hi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
