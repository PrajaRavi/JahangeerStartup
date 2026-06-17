import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Change this to your verified Indian personal phone number
const TEST_NUMBER = '+919769479166'; 

/**
 * STEP 1: Send the OTP
 */
async function sendOTP() {
    try {
        const verification = await client.verify.v2
            .services(verifyServiceSid)
            .verifications.create({ to: TEST_NUMBER, channel: 'sms' });

        console.log(`✅ Success! OTP status: ${verification.status}`);
        console.log("Check your phone, the code should arrive shortly.");
    } catch (error) {
        console.error("❌ Error sending OTP:", error.message);
    }
}

/**
 * STEP 2: Verify the OTP (Run this after you get the SMS)
 * @param {string} userEnteredCode - The 4 or 6 digit code received on your phone
 */
async function verifyOTP(userEnteredCode) {
    try {
        const verificationCheck = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to: TEST_NUMBER, code: userEnteredCode });

        if (verificationCheck.status === 'approved') {
            console.log("🎉 SUCCESS! The OTP matches. User is verified.");
        } else {
            console.log("❌ FAILED! Incorrect or expired OTP.");
        }
    } catch (error) {
        console.error("❌ Error checking OTP:", error.message);
    }
}

// --- Run the test ---
sendOTP();

// Once you receive the code, comment out sendOTP(), 
// uncomment the line below with your code, and run it again:
// verifyOTP('123456');