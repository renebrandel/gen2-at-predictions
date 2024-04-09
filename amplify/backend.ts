import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, convertTextToSpeech } from './data/resource';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  convertTextToSpeech
});

const dataStack = Stack.of(backend.data)

const translateDataSource = backend.data.addHttpDataSource("TranslateDataSource", `https://translate.${dataStack.region}.amazonaws.com`, {
  authorizationConfig: {
    signingRegion: dataStack.region,
    signingServiceName: 'translate'
  }
})

translateDataSource.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
  actions: ['translate:TranslateText'],
  resources: ['*']
}))

// For Mo: check out this line. Basically this allows an unauth'ed user to call the translation API.
// You don't have to activily "provision" a translation endpoint. It's just purely a policy.
backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(new PolicyStatement({
  actions: ['translate:TranslateText'],
  resources: ['*']
}))

// For Mo: this might change before GA but it effectively allows us to populate the `amplifyconfiguration.json` with the necessary info
// See main.tsx file to see that there's still a manual step involved that'll be resolved before GA.
backend.addOutput({
  custom: {
    Predictions: {
      convert: {
        translateText: {
          defaults: {
            sourceLanguage: 'en',
            targetLanguage: 'es'
          },
          proxy: false,
          region: Stack.of(backend.auth.resources.unauthenticatedUserIamRole).region
        }
      }
    }
  }
})

const rekognitionDataSource = backend.data.addHttpDataSource("RekognitionDataSource", `https://rekognition.${dataStack.region}.amazonaws.com`, {
  authorizationConfig: {
    signingRegion: dataStack.region,
    signingServiceName: 'rekognition'
  }
})

rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
  actions: ['rekognition:DetectText', 'rekognition:DetectLabels'],
  resources: ['*'] 
}))

backend.storage.resources.bucket.grantRead(rekognitionDataSource.grantPrincipal)

backend.convertTextToSpeech.resources.lambda.addToRolePolicy(new PolicyStatement({
  actions: ['polly:StartSpeechSynthesisTask'],
  resources: ['*']
}))