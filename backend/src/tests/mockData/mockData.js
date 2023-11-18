const mockPatient = {
    "_id":"652e3df42be9a8d93261735d",
    "firstName": "Harry",
    "lastName": "Potter",
    "email": "harry.potter@example.com",
    "practiceID": "655400881dae7e7b2c04aa8c",
    "phone": "123-456-7890",
    "password": "harry123",
    "DoB": "01-01-1980",
    "treatmentStartDate": "01-01-2005",
    "treatments": ["6542adb1690563abbc5985f6"],
    "maintenanceBottleNumber": [
      {
        "nameOfBottle": "Pollen",
        "maintenanceNumber": 5
      },
      {
        "nameOfBottle": "Insects/Pets",
        "maintenanceNumber": 5
      },
      {
        "nameOfBottle": "Insects/Pets",
        "maintenanceNumber": 5
      }
    ],
    "status": "DEFAULT",
    "statusDate": "10-23-2021",
    "tokens": 10,
    "needsRetestData": {
      "needsRetest": false,
      "needsRetestSnooze": {
        "active": null,
        "dateOfSnooze": null,
        "snoozeDuration": null
      }
    },
}

const mockProtocol = {
    "_id": "654e85d90acd8d8777989c41",
    "practiceID": "655400881dae7e7b2c04aa8c",
    "bottles": [
      {
        "bottleName": "pollen",
        "_id": {
          "$oid": "6553ef9d5a61d253f7af3d72"
        }
      },
      {
        "bottleName": "goat",
        "_id": "6553ef9d5a61d253f7af3d73"
      }
    ],
    "missedDoseAdjustment": {
      "doseAdjustMissedDays": 10,
      "range1": {
        "days": 13,
        "event": "Decrease Injection Volume",
        "injectionVolumeDecrease": 0.05,
        "decreaseVialConcentration": 1,
        "decreaseBottleNumber": 1
      },
      "range2": {
        "days": 20,
        "event": "Decrease Injection Volume",
        "injectionVolumeDecrease": 0.1,
        "decreaseVialConcentration": 2,
        "decreaseBottleNumber": 2
      },
      "range3": {
        "days": 27,
        "event": "Decrease Injection Volume",
        "injectionVolumeDecrease": 0.15,
        "decreaseVialConcentration": 3,
        "decreaseBottleNumber": 3
      },
      "range4": {
        "days": 28,
        "restartTreatment": true
      },
      "_id": {
        "$oid": "6553ef9d5a61d253f7af3d75"
      }
    },
    "__v": 0,
    "largeReactionsDoseAdjustment": {
      "whealLevelForAdjustment": 11,
      "event": "Decrease Injection Volume",
      "decreaseInjectionVol": 0.05,
      "_id": {
        "$oid": "6553ef9d5a61d253f7af3d76"
      }
    },
    "vialTestReactionAdjustment": {
      "whealLevelForAdjustment": 11,
      "event": "Decrease Injection Volume",
      "decreaseInjectionVol": 0.05,
      "_id": {
        "$oid": "6553ef9d5a61d253f7af3d74"
      }
    },
    "nextDoseAdjustment": {
      "injectionInterval": 10,
      "startingInjectionVol": 0.01,
      "maxInjectionVol": 0.5,
      "injectionVolumeIncreaseInterval": 0.02,
      "_id": {
        "$oid": "654e87340acd8d8777989c4b"
      }
    }
  }

const mockTreatment = {
    "nameOfPractice": "Leal Inc.",
    "patientFirstName": "John",
    "patientID": "652e3df42be9a8d93261735d",
    "patientLastName": "Smith",
    "bottles": [
      {
        "nameOfBottle": "Pollen",
        "injVol": 0.5,
        "injDilution": 0.1,
        "injLLR": 0.3,
        "currBottleNumber": "M",
        "date": {
          "$date": "2022-10-23T04:00:00.000Z"
        },
        "expirationDate": {
          "$date": "2023-11-20T05:00:00.000Z"
        },
        "injSumForBottleNumber": 249,
        "needsRefill": true
      },
      {
        "nameOfBottle": "Insects/Pets",
        "injVol": 0.5,
        "injDilution": 0.1,
        "injLLR": 0.1,
        "currBottleNumber": "M",
        "date": {
          "$date": "2022-10-23T04:00:00.000Z"
        },
        "expirationDate": {
          "$date": "2023-12-20T05:00:00.000Z"
        },
        "injSumForBottleNumber": 200,
        "needsRefill": false
      },
      {
        "nameOfBottle": "Molds",
        "injVol": 0.5,
        "injDilution": 0.1,
        "injLLR": 0.1,
        "currBottleNumber": "M",
        "date": {
          "$date": "2022-10-23T04:00:00.000Z"
        },
        "expirationDate": {
          "$date": "2023-11-10T05:00:00.000Z"
        },
        "injSumForBottleNumber": 241,
        "needsRefill": true
      }
    ],
    "attended": false,
    "date": "2022-10-23T04:00:00.000Z",
    "NPI": "12345"
}

module.exports = {
    mockPatient,
    mockProtocol,
    mockTreatment
}