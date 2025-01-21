import React, {Component, Context} from 'react';
import {ActivityIndicator, FlatList, Pressable, Text, View} from 'react-native';
import {AppContext, AppContextProps} from '../../context/AppContext';
import {FINNHUB_API_KEY} from '@env';
import Icon from '@react-native-vector-icons/ionicons';
import {Notifications} from 'react-native-notifications';
import {styles} from './styles';
import ListEmptyComponent from '../../components/ListEmptyComponent';

class WatchlistScreen extends Component {
  constructor(props: any) {
    super(props);
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any,
  ): void {
    const {stocks} = this.context;
    const {stockPrices} = this.state;

    stocks.forEach(stockToWatch => {
      const stock = stockPrices.find(s => s.name === stockToWatch.name);
      if (stock && stock.price <= stockToWatch.priceToWatch) {
        Notifications.postLocalNotification({
          title: 'Stock Alert',
          body: `${stock.name} has reached the target price of $${stockToWatch.priceToWatch}`,
          identifier: '',
          payload: undefined,
          sound: '',
          badge: 0,
          type: '',
          thread: '',
        });
      }
    });
  }

  static readonly contextType: Context<any> = AppContext;
  context!: React.ContextType<typeof AppContext>;
  websocket!: WebSocket;

  state = {
    stockPrices: [] as {
      name: string;
      price: number;
      dp: string;
      pc: number;
      displaySymbol: string;
    }[],
    loading: true,
  };

  componentDidMount() {
    this.fetchStockPrices();
    this.websocket = new WebSocket(
      `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`,
    );

    this.websocket.addEventListener('open', this.handleWebSocketOpen);
    this.websocket.addEventListener(
      'message',
      this.handleWebSocketMessage as any,
    );
  }

  componentWillUnmount() {
    this.websocket.removeEventListener('open', this.handleWebSocketOpen);
    this.websocket.removeEventListener(
      'message',
      this.handleWebSocketMessage as any,
    );
  }

  handleWebSocketOpen = () => {
    const {stocks} = this.context as {stocks: {name: string}[]};
    stocks.forEach((stock: {name: string}) => {
      this.websocket.send(
        JSON.stringify({type: 'subscribe', symbol: stock.name}),
      );
    });
  };

  handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    const {stockPrices} = this.state;
    const updatedStocks = stockPrices.map(
      (stock: {name: string; price: number; dp: string; pc: number}) => {
        const foundStock = data.data?.find(
          (d: {s: string}) => d?.s === stock?.name,
        );

        const change =
          data.data?.find((d: {s: string; p: number}) => d.s === stock.name)
            ?.p !== undefined
            ? (
                ((data.data?.find(
                  (d: {s: string; p: number}) => d?.s === stock?.name,
                )?.p -
                  stock.pc) /
                  stock.pc) *
                100
              ).toFixed(2)
            : 'N/A';

        if (foundStock?.s !== undefined && stock.name === foundStock.s) {
          return {
            ...stock,
            price:
              data?.data?.find((d: any) => d.s === stock.name)?.p !== undefined
                ? data?.data?.find((d: any) => d.s === stock.name)?.p
                : 'N/A',
            dp: change,
          };
        }

        return stock;
      },
    );

    this.setState({stockPrices: updatedStocks});
  };

  fetchStockPrices = async () => {
    this.setState(prevState => ({...prevState, loading: true}));
    const {stocks} = this.context as AppContextProps;
    const promises = stocks.map((stock: {name: string}) =>
      this.fetchStockPrice(stock.name),
    );
    const results = await Promise.all(promises);

    const updatedStocks = stocks.map((stock: {name: string}, index: number) => {
      return {
        ...stock,
        price: results[index]?.c,
        dp: results[index]?.dp,
        pc: results[index]?.pc,
      };
    });

    this.setState({stockPrices: updatedStocks, loading: false});
  };

  fetchStockPrice = async (stock: string) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${FINNHUB_API_KEY}`,
      );
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  render() {
    const {loading, stockPrices} = this.state;
    const {navigation} = this.props as {navigation: any};

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable
            onPress={() =>
              navigation.navigate('ChartScreen', {
                stocks: stockPrices,
              })
            }>
            <Icon name="analytics" size={36} color={'#fff'} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('AlertScreen')}>
            <Icon name="add" size={36} color={'#fff'} />
          </Pressable>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={45} />
          </View>
        ) : (
          <FlatList
            style={styles.flatlist}
            extraData={stockPrices}
            data={stockPrices}
            renderItem={({item}) => (
              <View style={styles.stockCard}>
                <View style={styles.stockCardHeader}>
                  <Text style={styles.greenText}>
                    {item.displaySymbol || item.name}
                  </Text>
                  <Text style={styles.whiteText}>$ {item.price}</Text>
                </View>
                <Text style={styles.whiteText}>{item.dp} %</Text>
              </View>
            )}
            keyExtractor={item => item.name}
            ListEmptyComponent={() => (
              <ListEmptyComponent
                onPress={() => navigation.navigate('AlertScreen')}
              />
            )}
          />
        )}

        <View style={styles.logoutContainer}>
          <Pressable onPress={() => this.context?.clearSession()}>
            <Icon name="exit-outline" size={30} color={'#fff'} />
          </Pressable>
        </View>
      </View>
    );
  }
}

export default WatchlistScreen;
