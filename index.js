const express = require('express');
const axios = require('axios');
const oauth = require('oauth');
const open = require('open');
require('dotenv').config();


performAuth();

async function performAuth() {
    const authToken = await getAuthRequestToken();
    // await user response
}



function consumer() {
  return new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
    process.env.TWITTER_API_KEY, process.env.TWITTER_API_SECRET, "1.0A", "oob", "HMAC-SHA1");
}

async function getAuthRequestToken() {
  await consumer().getOAuthRequestToken(async (error, oauthToken, oauthTokenSecret, results) => {
    if (error) {
      console.log(error);
    } else {
      await open(`https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`);
      return {
        oauthToken,
        oauthTokenSecret
      };
    }
  })
}

