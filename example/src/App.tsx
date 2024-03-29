import * as React from 'react';
import { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Connections, getUserId, initConnection, initTerra } from 'terra-react';
import {
  TerraGraph,
  GraphType,
  TimePeriod,
} from 'react-native-terra-react-graphs';
import { Config } from './Config';

async function inits(
  SDKToken: string,
  devID: string,
  refID: string,
  connection: Connections,
  schedulerOn: boolean,
  setUserId: React.Dispatch<React.SetStateAction<String | null>>
) {
  let initT = await initTerra(devID, refID);
  console.log('initTerra: ' + initT.success);
  let initUseId = await getUserId(connection);

  // only need to create a new connection if there is currently no user
  if (initUseId.userId == null) {
    let initC = await initConnection(connection, SDKToken, schedulerOn);
    console.log('initConnection: ' + initC.success);
    initUseId = await getUserId(connection);
  }

  const user_id = initUseId.userId;
  setUserId(user_id);
  console.log('initUseId: ' + initUseId.userId);
}
export default function App() {
  const [userId, setUserId] = useState<String | null>(null);
  const [graphToken, setGraphToken] = useState('');
  const getSDKTokenAndUserId = async () => {
    try {
      // Make this request in the backend instead. This is only for demo purposes.
      const url = `${Config.ProdUrl}/auth/generateAuthToken`;
      const headers = {
        'dev-id': Config.DevID,
        'x-api-key': Config.APIKEY,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
      });
      const SDKJson = await response.json();
      await inits(
        SDKJson.token,
        Config.DevID,
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
      // Make this request in the backend instead. This is only for demo purposes.
      const url = `${Config.ProdUrl}graphs/token?user_id=${userId}`;
      const headers = {
        'dev-id': Config.DevID,
        'x-api-key': Config.APIKEY,
      };
      const responseGraphToken = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
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
  const start = '2023-06-08';
  const end = '2023-06-23';
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TerraGraph
          type={GraphType.DAILY_STEPS_SUMMARY}
          styles={{ flex: 1, justifyContent: 'center' }}
          loadingComponent={<ActivityIndicator />}
          startDate={start}
          endDate={end}
          token={graphToken}
          timePeriod={TimePeriod.DAY}
          toWebhook={false}
          bgColor={'02327A'}
          lineColor={'05FFFA'}
          textColor={'8975FA'}
          enableHeader={true}
          htmlTitleContent={'my title'}
          enableHtmlTimePeriod={true}
          htmlTimePeriodContent={'my title timeperid'}
          enableFooter={true}
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
    height: '50%',
  },
});
