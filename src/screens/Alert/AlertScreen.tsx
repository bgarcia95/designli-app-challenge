import React, {Component} from 'react';
import {API_URL, FINNHUB_API_KEY} from '@env';
import {Alert, Pressable, Text, TextInput, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {AppContext} from '../../context/AppContext';
import Icon from '@react-native-vector-icons/ionicons';
import {styles} from './styles';

const CloseIconComponent = () => <Icon name="close" size={25} color={'#fff'} />;

class AlertScreen extends Component {
  static contextType = AppContext;

  state = {
    data: [],
    value: '',
    open: false,
    valueLimit: '',
    selectedObject: {
      value: '',
      label: '',
      displaySymbol: '',
    },
    openMarket: false,
    marketValue: '',
    market: '',
    exchangeData: [],
    openExchange: false,
    exchangeValue: '',
    exchange: '',
  };

  markets = [
    {label: 'Stock', value: 'stock'},
    {label: 'Forex', value: 'forex'},
    {label: 'Crypto', value: 'crypto'},
  ];

  componentDidMount() {
    this.fetchExchangeData();
    this.fetchExchangeSymbols();
    this.fetchStocksSymbols();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.market !== this.state.market) {
      this.fetchExchangeData();
    }
    if (prevState.exchange !== this.state.exchange) {
      this.fetchExchangeSymbols();
    }
    if (prevState.market !== this.state.market) {
      this.fetchStocksSymbols();
    }
  }

  fetchExchangeData = async () => {
    const {market} = this.state;
    if (market === 'crypto' || market === 'forex') {
      try {
        const response = await fetch(
          `${API_URL}/${market}/exchange?token=${FINNHUB_API_KEY}`,
        );
        const data = await response.json();
        if (data !== undefined) {
          this.setState({
            exchangeData: data.map(item => ({
              label: item,
              value: item,
            })),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchExchangeSymbols = async () => {
    const {market, exchange} = this.state;
    if (market !== 'stock' && market !== '' && exchange !== '') {
      try {
        const response = await fetch(
          `${API_URL}/${market}/symbol?exchange=${exchange}&token=${FINNHUB_API_KEY}`,
        );
        const data = await response.json();
        if (data !== undefined) {
          this.setState({
            data: data.map(item => ({
              label: item.description,
              value: item.symbol,
              displaySymbol: item.displaySymbol,
            })),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchStocksSymbols = async () => {
    const {market} = this.state;
    if (market === 'stock') {
      try {
        const response = await fetch(
          `${API_URL}/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`,
        );
        const data = await response.json();
        this.setState({
          data: data.map(item => ({
            label: item.description,
            value: item.symbol,
            displaySimbol: item.displaySymbol,
          })),
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleMarketValueChanged = cb => {
    this.setState(state => ({marketValue: cb(state.value)}));
  };
  handleExchangeValueChanged = cb => {
    this.setState(state => ({exchangeValue: cb(state.value)}));
  };

  handleValueChanged = cb => {
    this.setState(state => ({value: cb(state.value)}));
  };

  render() {
    const {navigation} = this.props;
    const {addStock, stocks} = this.context;
    const {
      data,
      value,
      open,
      valueLimit,
      selectedObject,
      openMarket,
      marketValue,
      market,
      exchangeData,
      openExchange,
      exchangeValue,
      exchange,
    } = this.state;

    return (
      <View style={styles.container}>
        <>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back-sharp" size={24} color={'#fff'} />
          </Pressable>
          <Text style={styles.title}>Financial Markets</Text>
          <DropDownPicker
            zIndex={4000}
            zIndexInverse={1000}
            searchable
            open={openMarket}
            value={marketValue}
            items={this.markets}
            setOpen={openMarket => this.setState({openMarket})}
            setValue={this.handleMarketValueChanged}
            onSelectItem={item => {
              this.setState({market: item.value});
            }}
            style={styles.dropdownStyle}
            textStyle={styles.dropdownTextStyle}
            containerStyle={styles.dropdownStyle}
            searchContainerStyle={styles.dropdownBackgroundColor}
            searchTextInputStyle={styles.dropdownTextStyle}
            listItemContainerStyle={styles.dropdownBackgroundColor}
            modalContentContainerStyle={styles.dropdownBackgroundColor}
            listMessageTextStyle={styles.dropdownTextStyle}
            listMessageContainerStyle={styles.dropdownStyle}
            listMode="MODAL"
            CloseIconComponent={CloseIconComponent}
          />
          {(market === 'crypto' || market === 'forex') && (
            <View>
              <Text style={styles.title}>Exchanges</Text>
              <DropDownPicker
                zIndex={3000}
                zIndexInverse={2000}
                searchable
                open={openExchange}
                value={exchangeValue}
                items={exchangeData}
                setOpen={openExchange => this.setState({openExchange})}
                setValue={this.handleExchangeValueChanged}
                onSelectItem={item => {
                  this.setState({exchange: item.value});
                }}
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                containerStyle={styles.dropdownStyle}
                searchContainerStyle={styles.dropdownBackgroundColor}
                searchTextInputStyle={styles.dropdownTextStyle}
                listItemContainerStyle={styles.dropdownBackgroundColor}
                modalContentContainerStyle={styles.dropdownBackgroundColor}
                listMessageTextStyle={styles.dropdownTextStyle}
                listMessageContainerStyle={styles.dropdownStyle}
                itemSeparatorStyle={styles.dropdownStyle}
                listMode="MODAL"
                CloseIconComponent={CloseIconComponent}
              />
            </View>
          )}
          {!!exchange && (
            <>
              <Text style={styles.title}>Symbols</Text>
              <DropDownPicker
                zIndex={2000}
                zIndexInverse={3000}
                searchable
                open={open}
                value={value}
                items={data}
                setOpen={open => this.setState({open})}
                setValue={this.handleValueChanged}
                onSelectItem={item => {
                  if (
                    item.value ===
                    stocks.find(stock => stock.id === item.value)?.id
                  ) {
                    Alert.alert('Alert already set for this stock');
                  } else {
                    this.setState({selectedObject: item});
                  }
                }}
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                containerStyle={styles.dropdownStyle}
                searchContainerStyle={styles.dropdownBackgroundColor}
                searchTextInputStyle={styles.dropdownTextStyle}
                listItemContainerStyle={styles.dropdownBackgroundColor}
                modalContentContainerStyle={styles.dropdownBackgroundColor}
                listMessageTextStyle={styles.dropdownTextStyle}
                listMessageContainerStyle={styles.dropdownStyle}
                itemSeparatorStyle={styles.dropdownStyle}
                listMode="MODAL"
                CloseIconComponent={CloseIconComponent}
              />
            </>
          )}
          {market === 'stock' && (
            <>
              <Text style={styles.title}>Stock</Text>
              <DropDownPicker
                zIndex={1000}
                zIndexInverse={4000}
                searchable
                open={open}
                value={value}
                items={data}
                setOpen={open => this.setState({open})}
                setValue={this.handleValueChanged}
                onSelectItem={item => {
                  if (
                    item.value ===
                    stocks.find(stock => stock.id === item.value)?.id
                  ) {
                    Alert.alert('Alert already set for this stock');
                  } else {
                    this.setState({selectedObject: item});
                  }
                }}
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                containerStyle={styles.dropdownStyle}
                searchContainerStyle={styles.dropdownBackgroundColor}
                searchTextInputStyle={styles.dropdownTextStyle}
                listItemContainerStyle={styles.dropdownBackgroundColor}
                modalContentContainerStyle={styles.dropdownBackgroundColor}
                listMessageTextStyle={styles.dropdownTextStyle}
                listMessageContainerStyle={styles.dropdownStyle}
                itemSeparatorStyle={styles.dropdownStyle}
                listMode="MODAL"
                CloseIconComponent={CloseIconComponent}
              />
            </>
          )}
          <Text style={styles.title}>Price alert value</Text>
          <TextInput
            value={valueLimit}
            onChangeText={valueLimit => this.setState({valueLimit})}
            style={styles.textInputContainer}
          />
          <Pressable
            style={styles.addAlertBtn}
            onPress={() => {
              addStock({
                id: selectedObject.value,
                name: selectedObject.value,
                priceToWatch: parseFloat(valueLimit),
                displaySymbol: selectedObject.displaySymbol,
              });
              navigation.navigate('WatchlistScreen');
            }}>
            <Text style={styles.addAlertBtnText}>Set Alert</Text>
          </Pressable>
        </>
      </View>
    );
  }
}

export default AlertScreen;
