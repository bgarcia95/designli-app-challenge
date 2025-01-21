import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flatlist: {
      marginTop: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContentContainer: {
      paddingBottom: 20,
    },
    greenText: {color: '#71EB96'},
    stockCard: {
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
      padding: 20,
      backgroundColor: '#0e0f13',
    },
    stockCardHeader: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    whiteText: {color: '#fff'},
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#71EB96',
      padding: 10,
      borderRadius: 5,
      width: 100,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutContainer: {position: 'absolute', bottom: 20, right: 20},
    textBlack: {color: '#000'},
  });
