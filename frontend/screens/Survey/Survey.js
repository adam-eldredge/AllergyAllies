// ***** SURVEY QUESTIONS ***** //
export default {
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
                            title: 'Automatic Dose Advancements',
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
                                title: 'Initial Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '10',
                                default: '0.05',
                                visibleIf: "{k1} = 'Customize'"
                            },
                            {
                                name: 'k3',
                                title: 'Volume Increment (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '0.50',
                                default: '0.05',
                                visibleIf: "{k1} = 'Customize'"
                            },
                            {
                                name: 'k4',
                                title: 'Max Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.50',
                                min: '0',
                                max: '10',
                                default: '0.50',
                                visibleIf: "{k1} = 'Customize'"
                            }
                            ]

                        }, {
                            name: 'l',
                            title: 'General Rules for Dose Adjustments',
                            type: 'panel',
                            elements:
                                [
                                    {
                                        name: 'l1',
                                        title: 'Automatic',
                                        type: 'radiogroup',
                                        colCount: '3',
                                        choices: ['Default', 'Customize', 'Disable'],
                                        seperateSpecialChoices: 'true'
                                    },
                                    {
                                        name: 'l2',
                                        title: 'What events trigger a dose adjustment?',
                                        type: 'checkbox',
                                        visibleIf: "{l1} = 'Customize'",
                                        choices: [
                                            {
                                                text: "Vial Test Reaction"
                                            },
                                            {
                                                text: "Large Local Reaction"
                                            },
                                            {
                                                text: "Missed Injection Adjustment"
                                            }
                                        ]
                                    },
                                    {
                                        name: 'l3',
                                        title: 'Vial Test Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Vial Test Reaction"',
                                        elements:
                                            [
                                                {
                                                    name: 'l3a',
                                                    title: 'Range 1',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l3a1',
                                                                title: 'Days Late Range 1 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l3a2',
                                                                title: 'Days Late Range 1 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            },
                                                            {
                                                                name: 'l3a3',
                                                                title: 'What adjustment should be made?',
                                                                type: 'radiogroup',
                                                                colCount: '3',
                                                                choices: ['1', '2', '3'],
                                                                seperateSpecialChoices: 'true'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l3b',
                                                    title: 'Range 2',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l3b1',
                                                                title: 'Days Late Range 2 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l3b2',
                                                                title: 'Days Late Range 2 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l3c',
                                                    title: 'Range 3',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l3c1',
                                                                title: 'Days Late Range 3 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l3c2',
                                                                title: 'Days Late Range 3 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                            ],
                                    },
                                    {
                                        name: 'l4',
                                        title: 'Large Local Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Large Local Reaction"',
                                        elements:
                                            [
                                                {
                                                    name: 'l4a',
                                                    title: 'Range 1',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l4a1',
                                                                title: 'Days Late Range 1 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l4a2',
                                                                title: 'Days Late Range 1 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            },
                                                            {
                                                                name: 'l4a3',
                                                                title: 'What adjustment should be made?',
                                                                type: 'radiogroup',
                                                                colCount: '3',
                                                                choices: ['1', '2', '3'],
                                                                seperateSpecialChoices: 'true'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l4b',
                                                    title: 'Range 2',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l4b1',
                                                                title: 'Days Late Range 2 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l4b2',
                                                                title: 'Days Late Range 2 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l4c',
                                                    title: 'Range 3',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l4c1',
                                                                title: 'Days Late Range 3 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l4c2',
                                                                title: 'Days Late Range 3 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                            ],
                                    },
                                    {
                                        name: 'l5',
                                        title: 'Missed Injection Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Missed Injection Adjustment"',
                                        elements:
                                            [
                                                {
                                                    name: 'l5a',
                                                    title: 'Range 1',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l5a1',
                                                                title: 'Days Late Range 1 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l5a2',
                                                                title: 'Days Late Range 1 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            },
                                                            {
                                                                name: 'l5a3',
                                                                title: 'What adjustment should be made?',
                                                                type: 'radiogroup',
                                                                colCount: '3',
                                                                choices: ['1', '2', '3'],
                                                                seperateSpecialChoices: 'true'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l5b',
                                                    title: 'Range 2',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l5b1',
                                                                title: 'Days Late Range 2 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l5b2',
                                                                title: 'Days Late Range 2 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l5c',
                                                    title: 'Range 3',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l5c1',
                                                                title: 'Days Late Range 3 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l5c2',
                                                                title: 'Days Late Range 3 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                },
                                                {
                                                    name: 'l5d',
                                                    title: 'Range 4',
                                                    type: 'panel',
                                                    elements:
                                                        [
                                                            {
                                                                name: 'l5d1',
                                                                title: 'Days Late Range 4 start',
                                                                maxLength: 25,
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '11',
                                                                min: '0',
                                                                max: '30',
                                                                default: '11'
                                                            },
                                                            {
                                                                name: 'l5d2',
                                                                title: 'Days Late Range 4 end',
                                                                maxLength: 25,
                                                                startWithNewLine: 'false',
                                                                type: 'text',
                                                                inputType: 'numeric',
                                                                placeholder: '13',
                                                                min: '0',
                                                                max: '30',
                                                                default: '13'
                                                            }
                                                        ]
                                                }
                                            ],
                                    },
                                ]

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