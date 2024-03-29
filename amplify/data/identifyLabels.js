export function request(ctx) {
  return {
    method: 'POST',
    resourcePath: '/',
    params: {
      body: {
        Image: {
          S3Object: {
            Bucket: 'amplify-gen2atpredictions-predictionsforgen2bucket-htswpz5idzsx',
            Name: ctx.arguments.path
          }
        },
        MaxLabels: 10,
        MinConfidence: 55,
      },
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'RekognitionService.DetectLabels'
      }
    },
  }
}

export function response(ctx) {
  return JSON.parse(ctx.result.body)
    .Labels
    .map(label => label.Name)
    .join(',')
    .trim()
}