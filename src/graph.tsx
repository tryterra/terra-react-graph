/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';

import {
  Connections,
  getActivity,
  getBody,
  getDaily,
  getSleep,
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
    return 'error';
  }
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
}) {
  const [htmlString, sethtmlString] = useState<string>('<p> hi there </p>');

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
      },
      bottom: string,
      enableTitle: string,
      titleContent: string,
      getImg: string,
      getReactNative: string
    ) {
      var data = await functionMap(
        props.type,
        props.startDate,
        props.endDate,
        props.toWebhook,
        props.connections
      );
      data = JSON.stringify(data.data.data);
      //console.log(data)
      console.log('data fetch ');

      const response = await fetch(
        `http://127.0.0.1:8080/graphs/render_react?type=${props.type}&token=${props.token}&start_date=${props.startDate}&end_date=${props.endDate}${bottom}${enableTitle}${titleContent}${getImg}${getReactNative}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data,
          }),
        }
      );

      const resp = await response.text();
      sethtmlString(resp);
      console.log(resp);
    }

    fetchGraph(
      props,
      bottom,
      enableTitle,
      titleContent,
      getImg,
      getReactNative
    );
  });

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
