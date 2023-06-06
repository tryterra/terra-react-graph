import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

import {
  Connections,
  getActivity,
  getBody,
  getDaily,
  getSleep,
  initConnection,
  initTerra,
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

const funcMapErr: DataMessage = {
  success: false,
  data: {},
  error: 'Graph type not found',
};
async function functionMap(
  graph: GraphType,
  startDate: string,
  endDate: string,
  toWebhook = true,
  connection: Connections
) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  if (graph.includes('ACTIVITY')) {
    return await getActivity(connection, start, end, toWebhook);
  } else if (graph.includes('BODY')) {
    return await getBody(connection, start, end, toWebhook);
  } else if (graph.includes('DAILY')) {
    return await getDaily(connection, start, end, toWebhook);
  } else if (graph.includes('SLEEP')) {
    return await getSleep(connection, start, end, toWebhook);
  } else {
    return funcMapErr;
  }
}

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

function Graph(props: {
  type: GraphType;
  token: string;
  loadingComponent?: JSX.Element;
  styles?: React.CSSProperties;
  className?: string;
  test?: boolean;
  startDate: string;
  endDate: string;
  displayValueBottom?: boolean;
  enableTitle?: boolean;
  titleContent?: string;
  getImg?: boolean;
  getReactNative?: boolean;
  toWebhook: boolean;
  connections: Connections;
  SDKToken?: string;
  devID?: string;
  refID?: string;
  schedulerOn?: boolean;
}) {
  var dataRetrieved = false;

  const [htmlString, sethtmlString] = useState<string>(
    '<p> Graph loading... </p>'
  );

  let bottom = props.hasOwnProperty('displayValueBottom')
    ? `&display_value_bottom=${props.displayValueBottom}`
    : '';
  let enableTitle = props.hasOwnProperty('enableTitle')
    ? `&enable_html_title=${props.enableTitle}`
    : '';
  let titleContent = props.hasOwnProperty('enableTitle')
    ? `&enable_html_title=${props.enableTitle}`
    : '';
  let getImg = props.hasOwnProperty('getImg') ? `&get_img=${props.getImg}` : '';
  let getReactNative = props.hasOwnProperty('getReactNative')
    ? `&get_react_native=${props.getReactNative}`
    : '';

  useEffect(() => {
    async function fetchGraph(
      props: {
        type: any;
        token: any;
        loadingComponent?: JSX.Element | undefined;
        styles?: React.CSSProperties | undefined;
        className?: string | undefined;
        test?: boolean | undefined;
        startDate: any;
        endDate: any;
        displayValueBottom?: boolean | undefined;
        enableTitle?: boolean | undefined;
        titleContent?: string | undefined;
        getImg?: boolean | undefined;
        getReactNative?: boolean | undefined;
        toWebhook: any;
        connections: any;
        SDKToken?: string;
        devID?: string;
        refID?: string;
        schedulerOn?: boolean;
      },
      bottom: string,
      enableTitle: string,
      titleContent: string,
      getImg: string,
      getReactNative: string
    ) {
      if (
        props.hasOwnProperty('SDKToken') &&
        props.hasOwnProperty('devID') &&
        props.hasOwnProperty('refID') &&
        props.hasOwnProperty('schedulerOn')
      ) {
        await inits(
          props.SDKToken as string,
          props.devID as string,
          props.refID as string,
          props.connections,
          props.schedulerOn as boolean
        );
      }

      var data: any = await functionMap(
        props.type,
        props.startDate,
        props.endDate,
        props.toWebhook,
        props.connections
      );

      if (data.success) {
        data = JSON.stringify(data.data.data);
      }

      const response = await fetch(
        `http://127.0.0.1:8080/graphs/render_react?type=${props.type}&token=${props.token}&start_date=${props.startDate}&end_date=${props.endDate}${bottom}${enableTitle}${titleContent}${getImg}${getReactNative}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data,
          }),
        }
      );
      let resp = await response.text();
      sethtmlString(resp);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dataRetrieved = true;
    }

    fetchGraph(
      props,
      bottom,
      enableTitle,
      titleContent,
      getImg,
      getReactNative
    );
  }, [dataRetrieved]);

  return (
    <WebView
      scalesPageToFit={true}
      javaScriptEnabled={true}
      originWhitelist={['*']}
      source={{ html: `${htmlString}` }}
    />
  );
}

export default Graph;
