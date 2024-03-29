import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';

export const convertTextToSpeech = defineFunction({
  entry: './convertTextToSpeech.ts'
})

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization([a.allow.owner(), a.allow.public().to(['read'])]),

  translate: a.query()
    .arguments({
      sourceLanguage: a.string().required(),
      targetLanguage: a.string().required(),
      text: a.string().required()
    })
    .returns(a.string())
    .authorization([a.allow.public()])
    .handler(a.handler.custom({
      dataSource: "TranslateDataSource",
      entry: './translate.js'
    })),

  identifyText: a.query()
    .arguments({
      path: a.string(),
    })
    .returns(a.string())
    .authorization([a.allow.public()])
    .handler(a.handler.custom({
      entry: './identifyText.js',
      dataSource: 'RekognitionDataSource'
    })),

  identifyLabels: a.query()
    .arguments({
      path: a.string(),
    })
    .returns(a.string())
    .authorization([a.allow.public()])
    .handler(a.handler.custom({
      entry: './identifyLabels.js',
      dataSource: 'RekognitionDataSource'
    })),

  convertTextToSpeech: a.mutation()
    .arguments({
      text: a.string().required()
    })
    .returns(a.string().required())
    .authorization([a.allow.public()])
    .handler(a.handler.function(convertTextToSpeech))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

