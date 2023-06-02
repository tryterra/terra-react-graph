import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Connections, getDaily, initConnection, initTerra } from 'terra-react';
import { TerraGraph } from 'react-native-terra-react-graphs';

async function inits() {

  let token = "204b63d10b72e49219ac7fe00163743cdad164114286ec992d4d893bf2b8c727"

  var abc = await initTerra("testingJeffrey", "1")
  console.log("abc: " + abc.success)

  var def = await initConnection(Connections.APPLE_HEALTH, token, true)
  console.log("def: " + def.success)
}

async function getdata(){
  var s = new Date('2023-05-28');
  var e = new Date('2023-06-02');
  console.log('before this')
  var ghi = await getDaily(Connections.APPLE_HEALTH, s, e, false);
  console.log('\n data: ' + ghi.success);
  JSON.stringify(ghi.data);
}
export default async function App() {
  inits();
  getdata();
  var s = '2023-05-28';
  var e = '2023-06-02';

  let token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7ImRldi1pZCI6InRlc3RpbmciLCJ1c2VyX2lkIjoiY2Y4NGQxYmQtNmE3ZS00ZmM4LWFhNzYtMjVkMjY2Y2YzYjkxIiwianNvbl9ib2R5IjpudWxsfSwiZXhwaXJlcyI6MTY4NTcyMTkwMy40NjM0fQ.LYBPx6U1ZteilcKKo7zUnCssUs6NXMtKjnkGaXjoWW4';
  return (
    <View>
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
