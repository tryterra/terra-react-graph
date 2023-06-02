import { NativeModules, Platform } from 'react-native';

import Graph, { GraphType as g } from './graph';

export const TerraGraph = Graph;
export type GraphType = g;

const LINKING_ERROR =
  `The package 'react-native-terra-react-graphs' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TerraReactGraphs = NativeModules.TerraReactGraphs
  ? NativeModules.TerraReactGraphs
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );



export function multiply(a: number, b: number): Promise<number> {
  return TerraReactGraphs.multiply(a, b);
}
