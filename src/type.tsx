import type { ViewStyle } from 'react-native';
import type { Connections } from 'terra-react';

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

export type TimePeriod =
  | 'DAY'
  | 'WEEK'
  | 'TWO_WEEK'
  | 'MONTH'
  | 'THREE_MONTHS'
  | 'HALF_YEAR'
  | 'YEAR';

export type GraphPropsType = {
  type: GraphType;
  token: string;
  loadingComponent?: JSX.Element;
  styles?: ViewStyle;
  className?: string;
  test?: boolean;
  startDate?: string;
  endDate?: string;
  timePeriod?: TimePeriod;
  getImg?: boolean;
  imgWidth?: bigint;
  imgHeight?: bigint;
  getSmallTemplate?: boolean;
  toWebhook: boolean;
  connections: Connections;
  SDKToken?: string;
  devID?: string;
  refID?: string;
  schedulerOn?: boolean;
};
