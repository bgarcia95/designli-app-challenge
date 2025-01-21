import React, {useEffect, useState} from 'react';

import {
  LinearGradient,
  useFont,
  vec,
  Text as SKText,
} from '@shopify/react-native-skia';
import {Pressable, Text, useColorScheme, View} from 'react-native';
import {useDerivedValue} from 'react-native-reanimated';
import {
  Area,
  CartesianChart,
  Line,
  useChartPressState,
  useChartTransformState,
} from 'victory-native';

import {generateChartData} from '../../utils/chartData';
import Icon from '@react-native-vector-icons/ionicons';
import ToolTip from '../../components/Tooltip';
import {styles} from './styles';

const inter = require('../../../assets/fonts/inter-medium.ttf');
const interBold = require('../../../assets/fonts/inter-bold.ttf');

export const ChartScreen = props => {
  const font = useFont(inter, 10);
  const chartFont = useFont(interBold, 24);

  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.route.params.stocks) {
      setChartData(generateChartData(props.route.params.stocks));
      setIsLoading(false);
    }
  }, [props.route.params.stocks]);

  const {state, isActive} = useChartPressState({
    x: 0,
    y: {price: 0},
  });
  const colorMode = useColorScheme();

  const value = useDerivedValue(() => {
    return '$' + state.y.price.value.value.toFixed(2);
  }, [state]);

  const labelColor = colorMode === 'dark' ? 'white' : 'black';
  const lineColor = colorMode === 'dark' ? 'lightgrey' : 'black';

  const transformState = useChartTransformState({
    scaleX: 1.0,
    scaleY: 1.0,
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={() => props.navigation.goBack()}>
        <Icon name="arrow-back-sharp" size={24} color={'#fff'} />
      </Pressable>
      <View style={styles.content}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <CartesianChart
            data={chartData}
            xKey="stock"
            yKeys={['price']}
            domainPadding={{top: 30}}
            axisOptions={{
              font,
              labelColor,
              lineColor,
              formatXLabel: (value: string) =>
                props.route.params?.stocks?.[value]?.name || '',
            }}
            transformState={transformState.state}
            chartPressState={state}>
            {({points, chartBounds}) => {
              return (
                <>
                  <SKText
                    x={chartBounds.left + 10}
                    y={30}
                    font={chartFont}
                    text={value}
                    color={labelColor}
                    style={'fill'}
                  />
                  <Line
                    points={points.price}
                    color="lightgreen"
                    strokeWidth={3}
                    animate={{type: 'timing', duration: 500}}
                  />
                  <Area
                    points={points.price}
                    y0={chartBounds.bottom}
                    animate={{type: 'timing', duration: 500}}>
                    <LinearGradient
                      start={vec(chartBounds.bottom, 200)}
                      end={vec(chartBounds.bottom, chartBounds.bottom)}
                      colors={['green', '#90ee9050']}
                    />
                  </Area>

                  {isActive ? (
                    <ToolTip x={state.x.position} y={state.y.price.position} />
                  ) : null}
                </>
              );
            }}
          </CartesianChart>
        )}
      </View>
    </View>
  );
};
