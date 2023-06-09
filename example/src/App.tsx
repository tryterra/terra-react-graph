import * as React from 'react';
import { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Connections, getUserId, initConnection, initTerra } from 'terra-react';
import { TerraGraph } from 'react-native-terra-react-graphs';

async function inits(
  SDKToken: string,
  devID: string,
  refID: string,
  connection: Connections,
  schedulerOn: boolean,
  setUserId: React.Dispatch<React.SetStateAction<String | null>>
) {
  var initT = await initTerra(devID, refID);
  console.log('initTerra: ' + initT.success);
  var initC = await initConnection(connection, SDKToken, schedulerOn);
  console.log('initConnection: ' + initC.success);
  if (initC.success) {
    var initUseId = await getUserId(connection);
    const user_id = initUseId.userId;
    setUserId(user_id);
    console.log('initUseId: ' + initUseId.userId);
  }
}
export default function App() {
  var start = '2023-06-03';
  var end = '2023-06-10';
  const [userId, setUserId] = useState<String | null>(null);
  const [graphToken, setGraphToken] = useState('');
  const getSDKTokenAndUserId = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8081/auth/generateAuthToken'
      );
      const SDKJson = await response.json();
      await inits(
        SDKJson.token,
        'testingJeffrey',
        '1',
        Connections.APPLE_HEALTH,
        true,
        setUserId
      );
    } catch (error) {
      console.error(error);
    }
  };
  const getGraphToken = async () => {
    try {
      const responseGraphToken = await fetch(
        `http://127.0.0.1:8081/graphs/token?user_id=${userId}`
      );
      const GraphJson = await responseGraphToken.json();
      setGraphToken(GraphJson.token);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // Access the updated userId here
    if (userId !== null) {
      getGraphToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    setUserId('');
    setGraphToken('');
    getSDKTokenAndUserId();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TerraGraph
          type={'SLEEP_REM_SUMMARY'}
          styles={{ flex: 1, justifyContent: 'center' }}
          loadingComponent={<ActivityIndicator />}
          token={graphToken}
          startDate={start}
          endDate={end}
          toWebhook={false}
          connections={Connections.APPLE_HEALTH}
        />
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
