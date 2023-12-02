# AllergyAllies


AllergyAlly includes a mobile application for patients undergoing subcutaneous immunotherapy for environmental allergy desensitization, as well as a practitioner web application for patient monitoring. The app has a variety of functionalities, including calculating the patient’s next dosage, tracking their appointment attendance, and alerting practitioners of patients who are at risk of attrition. This will be a highly useful tool in ensuring the effectiveness of patients’ therapy, as poor compliance with injection schedules can set treatment backwards. Additionally, it will help to reduce rates of attrition for patients. To build the frontend of the app, we used React Native with Expo. We also used a MongoDB database to maintain patient and practice accounts that include all relevant data, and an Express and Node backend to tie together all functionalities of the app.


Frontend instructions:
1. Install Node, React, and React Native
2. Install Expo CLI globally by running the command npm i -g expo cli
3. cd into frontend
4. run (one time): 

        npm install @react-navigation/native

        npx expo install react-native-screens react-native-safe-area-context

5. To run the frontend:

        npx expo start

6. To run the app on desktop, press w. To run it on your mobile device, download the Expo Go app and scan the QR code.


Backend instructions:

1. cd into backend from a separate terminal window

2. run:

        npm start

run backend (restart on changes): npm run server (may need to npm install --save-dev nodemon)

run unit tests: npm test <file_path> 



*NOTES*

To run this project on mobile using the Expo Go app, there are some things you need to do to ensure it runs.

1. Comment out these 3 import statements:

import 'survey-core/defaultV2.min.css'; <br>
import { Model } from 'survey-core'; <br>
import { Survey } from 'survey-react-ui';

in these files:

screens/Injection/Injections.js <br>
screens/Injection/MaintenanceBottleNum.js <br>
screens/survey/PracticeSurvey.js

The library used to load the Practice Survey is not available on React Native mobile. Although the survey is not needed on mobile, the app cannot run with these import statements.

SOLUTION: either find a different survey library that is compatible with mobile, or to separate the mobile and desktop apps into 2 separate codebases (recommended for the scope of the app).

2. Change the IP address in any files that make Axios requests to the backend:

You can find the IP address under the QR code after running npx expo start. 
For example:
Metro waiting on exp://172.16.10.16:8081
Here, the IP address is 172.16.10.16 (whatever is after the // and before the :)

Example request:
         const response = await axios.post('http://172.16.10.16:5000/auth/', authData);
 (don't change the port)        


Use localhost for web:
Example request:
         const response = await axios.post('http://localhost:5000/auth/', authData);    

These are the files that make Axios requests:     
ProviderSignInScreen.js
PatientSignInScreen.js
PatientProgress.js
PatientProfile.js
ViewAllAppointments.js
PatientAppointments.js  

If you don't change the IP address on a certain screen, it will be stuck on "Loading..." because it cannot grab the data properly. The app will still run. On the sign in screens, if you don't change the IP address on the signin screen, it will not let you sign in.

SOLUTION: It would be best if the IP address could be stored as a variable so that you don't have to manually go in and change it in all of these files. It would also be ideal if you could grab the patient and treatment data in one file and then just use it throughout the whole app, so that you don't have to have repeated code and make new requests on every screen. We did not figure out how to implement this in the given timeframe, but it would be ideal for convenience and scalability.


*COMMON ERRORS*
If you are unable to login and are getting Network Errors, or an error that says "Patients.findOne() buffering timed out", make sure your IP address is added on MongoDB. On mongodb.com, sign in and access the database, go to Network Access, and add current IP address.

You should have both the frontend and backend running in two different terminal windows.

Sometimes, the mobile app does not work on certain public WiFi networks (error about LAN URL). Eduroam and most private WiFi networks should work.


*RECOMMENDED CODE IMPROVEMENTS*
Minimize repeated code on the Patient mobile app by putting the Axios requests in one separate file if possible.

Separate the patient and provider code into two separate code bases if possible.

Separate the user authentication for patients and providers so that patients are unable to login on desktop and vice versa.

Use third-party user auth such as Firebase for better security, and to implement forgot password, verify email, etc. functionality.

*FEATURES IN BACKLOG*
Push notification reminders about upcoming appointment deadline for patients
Patient tokens displaying on frontend of patient app
SNOT Surveys to track patient symptoms
Patient ability to upload pictures and send to providers
Provider ability to download reports as a PDF or CSV
Display provider's scrolling ads on patient home screen (uploaded by provider in practice survey)
Fully integrate patient reporting of adverse reactions
Make app deployable







