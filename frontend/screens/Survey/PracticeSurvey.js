import React, { useCallback, useContext, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, IconButton } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';
import User from '../../User.js';

// ***** SURVEY QUESTIONS ***** //
const surveyJson = {
    title: "Allergy Allies - Initial Practice Survey",
    description: `Welcome , Please fill out all fields to finish setting up your practice!`,
    textAlign: "center",
    pages:
        [
            {
                name: 'Practice Info',
                title: 'Practice Information',
                elements:
                    [
                        {
                            name: 'a',
                            title: 'Practice Name',
                            type: 'text',

                        },
                        {
                            name: 'b',
                            title: 'Treating Physician/Provider Name',
                            type: 'dropdown'
                        },
                        {
                            name: 'c',
                            title: 'Practice Logo',
                            type: 'file',
                        },
                        {
                            name: 'd',
                            title: 'Practice Scrolling Ads',
                            type: 'file',
                        },
                        {
                            name: 'e',
                            title: 'Practice Address',
                            type: 'text',

                        }
                    ],
                showQuestionNumbers: 'false'
            },
            {
                name: 'Protocols',
                title: 'Protocols',
                elements:
                    [
                        {
                            name: 'f',
                            title: 'Starting frequency of injections (# weekly)',
                            type: 'radiogroup',
                            colCount: '3',
                            choices: ['1', '2', '3'],
                            seperateSpecialChoices: 'true',
                        }, {
                            name: 'g',
                            title: 'Frequency of Clinical Follow-up Appointments (# yearly)',
                            type: 'radiogroup',
                            colCount: '4',
                            choices: ['1', '2', '3', '4'],
                            seperateSpecialChoices: 'true'
                        }, {
                            name: 'h',
                            title: 'Frequency of Progress Self-Assessment (# yearly)',
                            type: 'radiogroup',
                            colCount: '4',
                            choices: ['1', '2', '3', '4'],
                            seperateSpecialChoices: 'true'
                        }
                    ]
            },
            {
                name: 'Treatment',
                title: 'Treatment',
                elements:
                    [
                        {
                            name: 'j',
                            title: 'Treatment Vials',
                            type: 'paneldynamic',
                            panelCount: '0',
                            maxPanelCount: '100',
                            confirmDelete: 'true',
                            templateElements: [{
                                name: 'j1',
                                title: 'Vial Name',
                                type: 'text',
                            }]
                        }
                    ]
            },
            {
                name: 'Antigens',
                title: 'Antigens',
                elements:
                    [
                        {
                            name: 'i',
                            title: 'Antigens Tested',
                            type: 'paneldynamic',
                            panelCount: '0',
                            maxPanelCount: '100',
                            confirmDelete: 'true',
                            templateElements: [{
                                name: 'i1',
                                title: 'Antigen Name',
                                type: 'text',
                            }
                            ]
                        }
                    ]
            },
            {
                name: 'Dose Adjustments',
                title: 'Dose Adjustments',
                elements:
                    [
                        {
                            name: 'k',
                            title: 'Dose Advancements',
                            type: 'panel',
                            elements: [{
                                name: 'k1',
                                title: 'Automatic',
                                type: 'radiogroup',
                                colCount: '3',
                                choices: ['Default', 'Customize', 'Disable'],
                                seperateSpecialChoices: 'true'
                            },
                            {
                                name: 'k2',
                                title: 'Advancement (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '0.50',
                                default: '0.05',
                                visibleIf: "{k1} = 'Customize'"
                            },
                            {
                                name: 'k3',
                                title: 'Dose Adjustment Threshold (Days Missed)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '10',
                                min: '0',
                                max: '30',
                                default: '10',
                                visibleIf: "{k1} = 'Customize'"
                            },
                            {
                                name: 'k4',
                                title: 'What events trigger a dose adjustment?',
                                type: 'checkbox',
                                visibleIf: "{k1} = 'Customize'",
                                choices: [
                                    {
                                        text: "Vial Test Reaction",
                                    },
                                    {
                                        text: "Immediate Injection Reaction",
                                    },
                                    {
                                        text: "Delayed Injection Reaction",
                                    },
                                    {
                                        text: "Missed Injection Adjustment"
                                    }
                                ]
                            }
                            ]

                        }, {
                            name: 'l',
                            title: 'General Rules for Dose Adjustments',
                            type: 'text',

                        }, {
                            name: 'm',
                            title: 'General Rules for Adjustments',
                            type: 'text',

                        }, {
                            name: 'n',
                            title: 'Dose Adjustments Defaults',
                            type: 'text',

                        }
                    ]
            }
        ],
    showTOC: 'true',
    completeText: 'Submit',
    showPreviewBeforeComplete: 'showAllQuestions',
    showQuestionNumbers: 'false',
    questionErrorLocation: 'bottom',
};

export default function PracticeSurvey() {
    // ***** SURVEY OBJECT ***** //
    const survey = new Model(surveyJson);

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