# react-native-terra-react-graphs

Terra SDK for Graphs API

# Docs

All docs can be found here:

https://docs.tryterra.co/reference/graph-react-native-sdk

## Installation

```sh
npm install react-native-terra-react-graphs
```

## Example Usage

```js
import { TerraGraph } from 'react-native-terra-react-graphs';
import { ActivityIndicator } from 'react-native';

// ...

<TerraGraph
    type={GraphType.DAILY_RHR_SUMMARY}
    styles={{ flex: 1, justifyContent: 'center' }}
    loadingComponent={<ActivityIndicator />}
    startDate={start}
    endDate={end}
    token={graphToken}
    timePeriod={TimePeriod.WEEK}
    toWebhook={false}
    connections={Connections.APPLE_HEALTH}
/>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
# terra-react-graph
