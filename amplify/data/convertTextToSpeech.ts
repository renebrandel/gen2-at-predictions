import { Schema } from "./resource";
import { PollyClient, StartSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly'
import { env } from '$amplify/env/convertTextToSpeech'

export const handler: Schema["convertTextToSpeech"]["functionHandler"] = async (event) => {
  const client = new PollyClient()
  const task = new StartSpeechSynthesisTaskCommand({
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: event.arguments.text,
    TextType: 'text',
    VoiceId: 'Amy',
    OutputS3BucketName: env.predictionsforgen2_BUCKET_NAME,
    OutputS3KeyPrefix: 'public/'
  })
  const result = await client.send(task)

  return result.SynthesisTask?.OutputUri?.replace(
    'https://s3.us-east-1.amazonaws.com/' + env.predictionsforgen2_BUCKET_NAME + '/public/', "") ?? ""
}