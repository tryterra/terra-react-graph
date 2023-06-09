import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import {
  Connections,
  DataMessage,
  getActivity,
  getBody,
  getDaily,
  getSleep,
} from 'terra-react';
import { View } from 'react-native';
import { GraphPropsType, GraphType, TimePeriod } from './type';

const GraphPeriod = {
  DAY: 0,
  WEEK: 7,
  TWO_WEEK: 14,
  MONTH: 30,
  THREE_MONTHS: 90,
  HALF_YEAR: 160,
  YEAR: 365,
};

const funcMapErr: DataMessage = {
  success: false,
  data: {},
  error: 'Graph type not found',
};

/**
 * A function to retrieve data from the device
 * @param   {GraphType} graph the Graph type
 * @param   {string} startDate start date of the graph
 * @param   {string} endDate end date of the graph
 * @param   {boolean} toWebhook data send to webhook or not
 * @param   {Connections} connection Connections
 * @return  {DataMessage} data itself.
 */
async function functionMap(
  graph: GraphType,
  start: Date,
  end: Date,
  toWebhook = false,
  connection: Connections
) {
  const prefix = graph.split('_')[0]; // Extract the prefix from the graph
  switch (prefix) {
    case 'ACTIVITY':
      return await getActivity(connection, start, end, toWebhook);
    case 'BODY':
      return await getBody(connection, start, end, toWebhook);
    case 'DAILY':
      return await getDaily(connection, start, end, toWebhook);
    case 'SLEEP':
      return await getSleep(connection, start, end, toWebhook);
    default:
      return funcMapErr;
  }
}

function Graph(props: GraphPropsType) {
  const [loading, setLoading] = useState(true);
  const [htmlString, setHtmlString] = useState<string>(
    '<p> Graph loading... </p>'
  );
  // Determine the start data and end date
  const timePeriodKey: TimePeriod = props.timePeriod
    ? props.timePeriod
    : TimePeriod.WEEK;
  let startTime: Date, endTime: Date;
  if (props.startDate) {
    startTime = new Date(props.startDate);
    if (props.endDate) {
      endTime = new Date(props.endDate);
    } else {
      endTime = new Date(
        new Date(props.startDate).getTime() +
          GraphPeriod[timePeriodKey] * 24 * 60 * 60 * 1000
      );
    }
  } else {
    endTime = new Date();
    startTime = new Date(
      endTime.getTime() - GraphPeriod[timePeriodKey] * 24 * 60 * 60 * 1000
    );
  }
  // params of the Graph API render_SDK request
  const getImg = props.getImg ? `&get_img=${props.getImg}` : '';
  const imgWidth = props.imgWidth ? `&get_img=${props.imgWidth}` : '';
  const imgHeight = props.imgHeight ? `&get_img=${props.imgHeight}` : '';
  const getSmallTemplate = props.getSmallTemplate
    ? `&get_small_template=${props.getSmallTemplate}`
    : '';
  /**
   * A function to retrieve data from the device
   * @param   {GraphType} graph the Graph type
   * @param   {string} startDate start date of the graph
   * @param   {string} endDate end date of the graph
   * @param   {boolean} toWebhook data send to webhook or not
   * @param   {Connections} connection Connections
   * @return  {DataMessage} data itself.
   */
  async function fetchGraph() {
    console.log(startTime);
    console.log(endTime);
    const responseData: any = await functionMap(
      props.type,
      startTime,
      endTime,
      props.toWebhook,
      props.connections
    );

    if (responseData.success) {
      const data = JSON.stringify(responseData.data.data);
      const response = await fetch(
        `https://api.tryterra.co/v2/graphs/render_SDK?type=${props.type}&token=${props.token}${getImg}${imgWidth}${imgHeight}${getSmallTemplate}`,
        {
          method: 'POST',
          body: JSON.stringify({
            data,
          }),
        }
      );
      let resp = await response.text();
      setHtmlString(resp);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <View style={props.styles}>
      {loading && props.loadingComponent}
      <WebView
        scalesPageToFit={true}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        source={{ html: `${htmlString}` }}
      />
    </View>
  );
}

export default Graph;
