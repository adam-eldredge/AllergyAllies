import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AuthContext, AuthProvider } from '../../App.js'
import axios from 'axios';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';

// ***** SURVEY QUESTIONS ***** //
const surveyJson = {
    title: "Allergy Allies - Initial Practice Survey",
    description: "Please fill out all fields to finish setting up your practice!",
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
                            isRequired: 'true'
                        },
                        {
                            name: 'b',
                            title: 'Treating Physician/Provider Name',
                            type: 'dropdown',
                            isRequired: 'true'
                        },
                        {
                            name: 'c',
                            title: 'Practice Logo',
                            type: 'file',
                            isRequired: 'true'
                        },
                        {
                            name: 'd',
                            title: 'Practice Scrolling Ads',
                            type: 'file',
                            isRequired: 'true'
                        },
                        {
                            name: 'e',
                            title: 'Practice Address',
                            type: 'text',
                            isRequired: 'true'
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
                            title: 'Starting frequency of injections',
                            type: 'radiogroup',
                            isRequired: 'true',
                            colCount: '3',
                            choices: ['1', '2', '3'],
                            seperateSpecialChoices: 'true',
                        }, {
                            name: 'g',
                            title: 'Frequency of Clinical Follow-up Appointments',
                            type: 'radiogroup',
                            isRequired: 'true',
                            colCount: '4',
                            choices: ['Once yearly', 'Twice yearly', 'Thrice yearly', '4x yearly'],
                            seperateSpecialChoices: 'true'
                        }, {
                            name: 'h',
                            title: 'Frequency of Progress Self-Assessment',
                            type: 'radiogroup',
                            isRequired: 'true',
                            colCount: '4',
                            choices: ['Once yearly', 'Twice yearly', 'Thrice yearly', '4x yearly'],
                            seperateSpecialChoices: 'true'
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
                            panelCount: '1',
                            maxPanelCount: '10',
                            confirmDelete: 'true',
                            isRequired: 'true',
                            templateElements: [{
                                name: 'i1',
                                title: 'Antigen',
                                type: 'text',
                            }, {
                                name: 'i2',
                                title: '#',
                                type: 'text',
                                inputType: 'number'
                            }]
                        }, {
                            name: 'j',
                            title: 'Number of treatment vials and label/name for each vial',
                            type: 'paneldynamic',
                            panelCount: '1',
                            maxPanelCount: '10',
                            confirmDelete: 'true',
                            isRequired: 'true',
                            templateElements: [{
                                name: 'j1',
                                title: 'Name of treatment vial',
                                type: 'text',
                            }, {
                                name: 'j2',
                                title: '#',
                                type: 'text',
                                inputType: 'number'
                            }]
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
                                isRequired: 'true',
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
                                isRequired: 'true',
                                visibleIf: "{k1} = 'Customize'"
                            }
                            ]

                        }, {
                            name: 'l',
                            title: 'Dose Adjustments',
                            type: 'text',
                            isRequired: 'true'
                        }, {
                            name: 'm',
                            title: 'General Rules for Adjustments',
                            type: 'text',
                            isRequired: 'true'
                        }, {
                            name: 'n',
                            title: 'Dose Adjustments Defaults',
                            type: 'text',
                            isRequired: 'true'
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
    survey.applyTheme(theme);

    return (<Survey model={survey} />);
}