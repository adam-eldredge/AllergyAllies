import React, { useContext, useState } from 'react';
import { Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import theme from './theme.js';
import AuthContext from '../../AuthContext';
import jwt_decode from 'jwt-decode';

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
                            title: 'Starting frequency of injections',
                            type: 'radiogroup',
                            colCount: '3',
                            choices: ['1', '2', '3'],
                            seperateSpecialChoices: 'true',
                        }, {
                            name: 'g',
                            title: 'Frequency of Clinical Follow-up Appointments',
                            type: 'radiogroup',
                            colCount: '4',
                            choices: ['Once yearly', 'Twice yearly', 'Thrice yearly', '4x yearly'],
                            seperateSpecialChoices: 'true'
                        }, {
                            name: 'h',
                            title: 'Frequency of Progress Self-Assessment',
                            type: 'radiogroup',
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
                            }
                            ]

                        }, {
                            name: 'l',
                            title: 'Dose Adjustments',
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
    survey.applyTheme(theme);

    //return //(//<Survey model={survey} />)
    const rend = Platform.select({
        ios: <Text>Please continue on desktop</Text>,
        android: <Text>Please continue on desktop</Text>,
        default: <Survey model={survey}/>,
    });

    console.log(rend);
    return rend;
}
