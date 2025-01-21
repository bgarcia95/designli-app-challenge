import React from 'react';
import {Circle} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';

function ToolTip({
  x,
  y,
}: {
  readonly x: SharedValue<number>;
  readonly y: SharedValue<number>;
}) {
  return <Circle cx={x} cy={y} r={8} color={'grey'} opacity={0.8} />;
}

export default ToolTip;
