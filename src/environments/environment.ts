// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'SUA_API_KEY',
    authDomain: 'SEU_AUTH_DOMAIN',
    projectId: 'SEU_PROJECT_ID',
    storageBucket: 'SEU_STORAGE_BUCKET',
    messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
    appId: 'SEU_APP_ID',
    measurementId: 'SEU_MEASUREMENT_ID'
  },
  timePerQuestion: 30 // Adicione essa linha para definir o tempo por pergunta
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
