import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Connections, getDaily, initConnection, initTerra } from 'terra-react';
import { TerraGraph } from 'react-native-terra-react-graphs';

async function inits() {
  let token =
    '233faf39e410eba5c3282ba04ec9821028f3d5835916e08fdbe93da254e7880a';

  var abc = await initTerra('testingJeffrey', '1');
  console.log('abc: ' + abc.success);

  var def = await initConnection(Connections.APPLE_HEALTH, token, true);
  console.log('def: ' + def.success);
}

async function getdata() {
  var s = new Date('2023-05-29');
  var e = new Date('2023-06-02');
  var ghi = await getDaily(Connections.APPLE_HEALTH, s, e, false);
  console.log('\n data: ' + ghi.success);
  JSON.stringify(ghi.data);
}
export default function App() {
  inits();
  getdata();
  var s = '2023-05-29';
  var e = '2023-06-02';

  let token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImRldi1pZCI6InRlc3RpbmciLCJ1c2VyX2lkIjoiY2Y4NGQxYmQtNmE3ZS00ZmM4LWFhNzYtMjVkMjY2Y2YzYjkxIiwianNvbl9ib2R5IjpudWxsfSwiZXhwaXJlcyI6MTY4NTk4MDg1MS41NTk0Njd9.Mec_lk6LJqF_dDFQ_OZOexqpSGhhiI3BkFy30WiaeIM';

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {
          <TerraGraph
            type={'SLEEP_ASLEEP_SUMMARY'}
            token={token}
            startDate={s}
            endDate={e}
            toWebhook={false}
            connections={Connections.APPLE_HEALTH}
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
    height: '50%',
  },
  box: {
    height: '60%',
  },
});
