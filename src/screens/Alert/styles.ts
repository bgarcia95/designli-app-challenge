import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        marginVertical: 20,
        zIndex: -1,
    },
    dropdownStyle: {
        backgroundColor: '#0e0f13',
        borderColor: '#2D2E34',
    },
    dropdownBackgroundColor: {
        backgroundColor: '#0e0f13',
    },
    dropdownTextStyle: {
        color: '#fff',
    },
    textInputContainer: {
        height: 50,
        backgroundColor: '#0e0f13',
        width: '100%',
        borderColor: '#2D2E34',
        borderWidth: 1,
        borderRadius: 5,
        color: '#fff',
        paddingHorizontal: 10,
        zIndex: -1,
    },
    addAlertBtn: {
        marginTop: 24,
        zIndex: -1,
        backgroundColor: '#71EB96',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 15,
    },
    addAlertBtnText: {
        color: '#000',
        textAlign: 'center',
    },
});
