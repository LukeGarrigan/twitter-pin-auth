const oauth = require('oauth');
const readline = require("readline");
const open = require('open');
require('dotenv').config();

const consumer =  new oauth.OAuth("https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
                                  process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET, "1.0A", "oob", "HMAC-SHA1");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


performAuth();

async function performAuth() {
    const authRequest = await getAuthRequestToken();
    const pin = await getUserPin();
    const authAccess = await getAuthAccessToken(authRequest.oauthToken, authRequest.oauthTokenSecret, pin);
    const followers = await getFollowers(authAccess.oauthAccessToken, authAccess.oauthAccessTokenSecret);
    console.log('followers', followers);
}

async function getAuthRequestToken() {
  return new Promise((resolve, reject) => {
    consumer.getOAuthRequestToken(async (error, oauthToken, oauthTokenSecret, results) => {
      if (error) {
        reject(error);
      } else {
        await open(`https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`);
        resolve({
          oauthToken,
          oauthTokenSecret
        });
      }
    });
  });
}


async function getAuthAccessToken(oauthToken, oauthTokenSecret, pin) {
  return new Promise((resolve, reject) => {
    consumer.getOAuthAccessToken(oauthToken, oauthTokenSecret, pin, (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
      if (error) {
        reject(error);
      } else {
        console.log('Successfully authorised with twitter');
        resolve({
          oauthAccessToken,
          oauthAccessTokenSecret
        })
      }
    })
  });
}

async function getUserPin() {
  return new Promise((resolve, reject) => {
    rl.question('Enter your code...\n', (pin) => {
      console.log(`you entered ${pin}`);
      resolve(pin);
      rl.close();
    });
  })
}

async function getFollowers(oauthAccessToken, oauthAccessTokenSecret) {
  console.log('Retrieving followers...')
  return new Promise((resolve, reject) => {
    consumer.get("https://api.twitter.com/1.1/followers/list.json", oauthAccessToken, oauthAccessTokenSecret, function (error, data, response) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  })
}
