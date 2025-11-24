// Test email configuration
// Run this file to test if email is configured correctly
// Usage: node src/utils/testEmail.js

require('dotenv').config();
const { sendOTPEmail, generateOTP } = require('./emailService');

async function testEmail() {
    console.log('Testing email configuration...\n');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'not set');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'not set');
    console.log('SMTP_USER:', process.env.SMTP_USER || 'not set');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***set***' : 'not set');
    console.log('');
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ Email not configured! Please set SMTP_USER and SMTP_PASS in .env file.');
        process.exit(1);
    }
    
    // Test sending email
    const testEmail = process.env.SMTP_USER; // Send to yourself
    const testOTP = generateOTP();
    const testBookingId = 'TEST123456';
    
    console.log(`Sending test email to: ${testEmail}`);
    console.log(`Test OTP: ${testOTP}`);
    console.log('');
    
    const result = await sendOTPEmail(testEmail, testOTP, testBookingId);
    
    if (result) {
        console.log('✅ Email sent successfully! Check your inbox.');
    } else {
        console.error('❌ Failed to send email. Check the error messages above.');
        process.exit(1);
    }
}

testEmail().catch(console.error);

