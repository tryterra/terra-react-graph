/* eslint-disable */

import React, { useState } from 'react';
import { WebView } from 'react-native-webview';

import {
  getDaily,
  getActivity,
  getSleep,
  getNutrition,
  getBody,
  getMenstruation,
  getAthlete,
  readGlucoseData,
  Connections,
} from 'terra-react';

export type GraphType =
  | 'ACTIVITY_HR_SAMPLES'
  | 'ACTIVITY_POWER_SAMPLES'
  | 'BODY_GLUCOSE_SUMMARY'
  | 'BODY_GLUCOSE_AGP'
  | 'DAILY_STEPS_SUMMARY'
  | 'DAILY_RHR_SUMMARY'
  | 'SLEEP_HR_SUMMARY'
  | 'SLEEP_HRV_SUMMARY'
  | 'SLEEP_ASLEEP_SUMMARY'
  | 'SLEEP_RHR_SUMMARY'
  | 'SLEEP_RESPIRATORY_RATE_SUMMARY'
  | 'SLEEP_REM_SUMMARY'
  | 'SLEEP_LIGHT_SUMMARY'
  | 'SLEEP_DEEP_SUMMARY'
  | 'SLEEP_REM_LIGHT_DEEP_PIE_SUMMARY';

type DataMessage = {
  success: Boolean;
  data: Object;
  error: String | null;
};

function functionMap(graph: GraphType, startDate: Date, endDate: Date, toWebhook=true, connection: Connections) {
  if (graph.includes('ACTIVITY')) {
     getActivity(connection, startDate, endDate, toWebhook).then(r => (r.success) ? r.data : `error: ${r.error}`)
  }
  else if (graph.includes('BODY')) {
    getBody(connection, startDate, endDate, toWebhook).then(r => (r.success) ? r.data : `error: ${r.error}`)
  }
  else if (graph.includes('DAILY')) {
    getDaily(connection, startDate, endDate, toWebhook).then(r => (r.success) ? r.data : `error: ${r.error}`)
  }
  else if (graph.includes('SLEEP')) {
    getSleep(connection, startDate, endDate, toWebhook).then(r => (r.success) ? r.data : `error: ${r.error}`)
  }
  else{
    return "custom";
  }
}

async function Graph(props: {
  type: GraphType;
  token: string;
  loadingComponent?: JSX.Element;
  styles?: React.CSSProperties;
  className?: string;
  test?: boolean;
  startDate: Date;
  endDate: Date;
  displayValueBottom?: boolean;
  enableTitle?: boolean;
  titleContent?: string;
  getImg?: boolean;
  getReactNative?: boolean;
  toWebhook: boolean;
  connections: Connections;
}) {
  const [loading, setLoading] = useState(true);

  let bottom = '';
  let enabletitle = '';
  let titlecontent = '';
  let getimg = '';
  let getreactnative = '';

  if (props.hasOwnProperty('displayValueBottom')) {
    bottom = `&display_value_bottom=${props.displayValueBottom}`;
  }
  if (props.hasOwnProperty('enableTitle')) {
    enabletitle = `&enable_html_title=${props.enableTitle}`;
  }
  if (props.hasOwnProperty('titleContent')) {
    titlecontent = `&html_title_content=${props.titleContent}`;
  }
  if (props.hasOwnProperty('getImg')) {
    getimg = `&get_img=${props.getImg}`;
  }
  if (props.hasOwnProperty('getReactNative')) {
    getreactnative = `&get_react_native=${props.getReactNative}`;
  }

  let data = functionMap(props.type, props.startDate, props.endDate, props.toWebhook, props.connections)

  let htmlstring = await fetch(`http://127.0.0.1:8080/graphs/render_react/${props.test ? 'test' : 'render'}?type=${props.type}&token=${
                        props.token}${props.startDate}${props.endDate}${bottom}${enabletitle}${titlecontent}${getimg}${getreactnative}`, {
    method: 'POST',
    //mode: "no-cors",
    body: JSON.stringify({
      data
    }),
  });

  return (
    <div style={props.styles ? props.styles : {}} className={props.className}>
                {loading && props.loadingComponent}
      <WebView
        originWhitelist={['*']}
        source={{ html: `${htmlstring}` }}
      />
    </div>
  );
}

export default Graph;
