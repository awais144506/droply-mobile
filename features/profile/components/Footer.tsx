import React from 'react';
import { Text, View, Image } from 'react-native';
import { footerStyles as styles } from '../style/profile-styles';

export const Footer = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.titleText}>
                Rider App
            </Text>

            <Text style={styles.versionText}>
                Version 1.0.0
            </Text>

            <Text style={styles.copyrightText}>
                © 2026 Droply Technologies
            </Text>
        </View>
    );
};