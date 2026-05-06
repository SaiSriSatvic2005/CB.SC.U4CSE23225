// auth.js — Registration + token management

const axios = require("axios");
const { TEST_SERVER_BASE_URL } = require("./config");
require("dotenv").config();

let authToken = null;
let tokenExpiry = null;

// Call ONCE → save clientID + clientSecret to .env
async function register() {
  try {
    const response = await axios.post(`${TEST_SERVER_BASE_URL}/register`, {
      companyName: process.env.COMPANY_NAME,
      ownerName: process.env.OWNER_NAME,
      rollNo: process.env.ROLL_NO,
      ownerEmail: process.env.OWNER_EMAIL,
      accessCode: process.env.ACCESS_CODE,
    });

    console.log("Registration successful!");
    console.log("Client ID:", response.data.clientID);
    console.log("Client Secret:", response.data.clientSecret);
    console.log("COPY THESE INTO YOUR .env FILE NOW!");
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
}

// Returns a valid Bearer token (auto-refreshes when expired)
async function getAuthToken() {
  // Return cached token if still valid (60s buffer before expiry)
  if (authToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return authToken;
  }

  try {
    const response = await axios.post(`${TEST_SERVER_BASE_URL}/auth`, {
      companyName: process.env.COMPANY_NAME,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      ownerName: process.env.OWNER_NAME,
      ownerEmail: process.env.OWNER_EMAIL,
      rollNo: process.env.ROLL_NO,
    });

    authToken = response.data.access_token;
    tokenExpiry = new Date(response.data.expires_in).getTime();
    console.log("Token obtained, expires:", new Date(tokenExpiry).toISOString());
    return authToken;
  } catch (error) {
    console.error("Token failed:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { register, getAuthToken };
