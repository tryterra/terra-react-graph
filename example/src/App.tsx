import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Connections, initConnection, initTerra } from 'terra-react';
import { TerraGraph } from 'react-native-terra-react-graphs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function inits(
  SDKToken: string,
  devID: string,
  refID: string,
  connection: Connections,
  schedulerOn: boolean
) {
  var initT = await initTerra(devID, refID);
  console.log('initTerra: ' + initT.success);

  var initC = await initConnection(connection, SDKToken, schedulerOn);
  console.log('initConnection: ' + initC.success);
}

export default function App() {
  //inits();
  var start = '2023-06-01';
  var end = '2023-06-06';

  let graphToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImRldi1pZCI6InRlc3RpbmciLCJ1c2VyX2lkIjoiY2Y4NGQxYmQtNmE3ZS00ZmM4LWFhNzYtMjVkMjY2Y2YzYjkxIiwianNvbl9ib2R5IjpudWxsfSwiZXhwaXJlcyI6MTY4NjA2MTIzNS42MTE0NTh9.Ww3HbAadINUgxskkih3W1UYVFY4CCm1B27wQBaGaU_k';

  let SDKToken =
    'c1d05c2e11ca26dde793c863fed232d258c77a0352ec77f60b861d6266ab69e7';

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {
          <TerraGraph
            type={'SLEEP_ASLEEP_SUMMARY'}
            token={graphToken}
            startDate={start}
            endDate={end}
            toWebhook={false}
            connections={Connections.APPLE_HEALTH}
            SDKToken={SDKToken}
            devID={'testingJeffrey'}
            refID={'1'}
            schedulerOn={true}
          />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    top: '5%',
  },
  box: {
    height: '40%',
  },
});
