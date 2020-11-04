// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'djtbokrdrg'
export const apiEndpoint = `https://${apiId}.execute-api.ap-northeast-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-fqcn0nsk.us.auth0.com',            // Auth0 domain
  clientId: 'ELSl2R1WTsAa96XhpfleLJiEhrgeTbut',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
