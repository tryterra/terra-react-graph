import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply } from 'react-native-terra-react-graphs';
import { Connections, initConnection, initTerra } from 'terra-react'; 

async function inits() {

  let token = "19969c6a1735eee74986a1b882cdf1cd0ed9c03de7d98e4580ddf268cb8ba9f1"

  var abc = await initTerra("testingJeffrey", "1")
  console.log("abc: " + abc.success)

  var def = await initConnection(Connections.APPLE_HEALTH, token, true)
  console.log("def: " + def.success)
}

export default function App() {
  inits()
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
