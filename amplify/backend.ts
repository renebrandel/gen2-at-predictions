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