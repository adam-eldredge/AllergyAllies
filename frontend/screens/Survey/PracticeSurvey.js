import React, { useCallback, useContext, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, IconButton } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';
import User from '../../User.js';
import Survey from './Survey.js';

export default function PracticeSurvey() {
    // ***** SURVEY OBJECT ***** //
    const survey = new Model(Survey);

    // Apply theme to survey
    survey.applyTheme(theme);

    // Function to handle survey completion
    const user = User();
    const saveResults = useCallback((sender) => {
        const json = sender.data;
        console.log(json);
        sendSurvey(user, json);
    });

    // Attach function to survey
    survey.onComplete.add(saveResults);

    const rend = Platform.select({
        ios: <Text>Please continue on desktop</Text>,
        android: <Text>Please continue on desktop</Text>,
        default: <Survey model={survey} />
    });

    console.log(rend);
    return rend;
}

const sendSurvey = async (user, json) => {
    // First, check if this user is a practice
    if (user.role == 2) {
        console.log('patient');
        return
    }
    else {
        const userID = user.id;
        console.log(userID);
        const provider = await axios.get(`http://localhost:5000/api/getProvider/${userID}`);

        if (provider.status === 404) {
            console.log('provider not found');
        }
        else if (provider.status === 200) {
            const pID = provider.data.practiceID;
            console.log(`practiceID: ${pID}`);
            console.log(`JSON: ${json}`);
            const surveyData = JSON.stringify(createSurveyObj(json));
            const data = { pID, surveyData };
            const posted = axios.post('http://localhost:5000/api/addSurvey', data);
        }
    }

}

const createSurveyObj = (json) => {
    const survey = {
        practiceInfo: {
            practiceName: json.a,
            providerName: json.b,
            practiceLogo: json.c,
            praciceScrollingAds: json.d,
            practiceAddress: json.e
        },
        protocols: {
            startingFrequency: json.f,
            frequencyFollowUp: json.g,
            frequencySelfAssess: json.h
        },
        antigens: {
            antigensTested: {
                antigen: json.i1,
                vialNum: json.i2
            },
            numVials: {
                vialName: json.j1,
                vialNum: json.j2
            }
        },
        doseAdjustments: {
            doseAdvancements: {
                default: json.k1,
                advancement: json.k2
            },
            doseAdjustment: json.l,
            adjustmentRules: json.m,
            adjustmentDefaults: json.n
        }

    };
    return survey;
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        fontSize: 40,
        marginTop: 40,
        fontWeight: '600',
        marginLeft: 100,
        color: '#1059d5',
        marginBottom: 10,
    },
    table: {
        marginLeft: 100,
        width: 800,
    },
    tableHeader: {
        backgroundColor: '#cbdeff',
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        color: 'black',
    },
    tableRow2: {
        backgroundColor: '#ebebeb',
    },
    providerDashboardItem: {
        borderRadius: 8,
        height: 100,
        width: 100,
        marginBottom: 10,
        alignItems: 'center',
    },
    providerDashboardText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: -10,
    },
})