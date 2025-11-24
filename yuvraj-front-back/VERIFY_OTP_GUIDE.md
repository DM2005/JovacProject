# Verify OTP - Testing Guide

## Endpoint
```
POST http://localhost:5000/api/bookings/verify-otp
```

## Headers Required
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

## Request Body
```json
{
  "bookingId": "RPH88901964",
  "otp": "123456"
}
```

## Step-by-Step Testing

### Step 1: Create a Booking
First, create a booking to get a bookingId and OTP:

**POST** `http://localhost:5000/api/bookings`

Response will include:
```json
{
  "bookingId": "RPH88901964",
  "email": "your@email.com",
  "otpSent": true,
  "message": "Booking created. Please check your email for OTP."
}
```

**Important:** 
- Check your email for the OTP (6-digit code)
- OR check server console for OTP (in development mode if email fails)

### Step 2: Get the OTP
- **From Email:** Check your inbox for the OTP email
- **From Console:** If email fails, check server console output:
  ```
  📧 OTP for booking RPH88901964 : 123456
  ```

### Step 3: Verify OTP
**POST** `http://localhost:5000/api/bookings/verify-otp`

Body:
```json
{
  "bookingId": "RPH88901964",
  "otp": "123456"
}
```

## Expected Responses

### ✅ Success (200 OK)
```json
{
  "message": "Booking verified successfully!",
  "booking": {
    "_id": "...",
    "bookingId": "RPH88901964",
    "status": "confirmed",
    "emailVerified": true
  }
}
```

### ❌ Error Responses

#### 1. Missing Fields (400)
```json
{
  "message": "Booking ID is required"
}
```
or
```json
{
  "message": "OTP is required"
}
```

#### 2. Booking Not Found (404)
```json
{
  "message": "Booking not found. Please check your booking ID."
}
```

**Possible causes:**
- Wrong bookingId
- Booking belongs to different user
- Booking doesn't exist

#### 3. Already Verified (400)
```json
{
  "message": "Booking already verified",
  "booking": {
    "bookingId": "RPH88901964",
    "status": "confirmed",
    "emailVerified": true
  }
}
```

#### 4. No OTP Found (400)
```json
{
  "message": "No OTP found for this booking. Please request a new OTP.",
  "bookingId": "RPH88901964"
}
```

**Solution:** Use resend OTP endpoint

#### 5. OTP Expired (400)
```json
{
  "message": "OTP has expired. Please request a new one using resend OTP.",
  "bookingId": "RPH88901964"
}
```

**Solution:** OTP expires after 10 minutes. Request a new one.

#### 6. Invalid OTP (400)
```json
{
  "message": "Invalid OTP. Please check and try again.",
  "hint": "Make sure you entered the correct 6-digit code from your email."
}
```

**Possible causes:**
- Wrong OTP entered
- OTP from different booking
- Typo in OTP

## Common Issues & Solutions

### Issue 1: "Booking not found"
**Solution:**
- Make sure you're using the correct `bookingId` from the create booking response
- Verify you're logged in as the same user who created the booking
- Check the booking exists by calling GET `/api/bookings`

### Issue 2: "Invalid OTP"
**Solution:**
- Double-check the OTP from email/console
- Make sure you're using the OTP for the correct booking
- OTP is 6 digits, no spaces or dashes
- Try resending OTP if unsure

### Issue 3: "OTP has expired"
**Solution:**
- OTP expires after 10 minutes
- Use the resend OTP endpoint to get a new one:
  ```
  POST /api/bookings/resend-otp
  Body: { "bookingId": "RPH88901964" }
  ```

### Issue 4: "No OTP found"
**Solution:**
- The booking might have been created before OTP was added
- Use resend OTP to generate a new one

## Testing in Postman

1. **Set Authorization:**
   - Go to Authorization tab
   - Select "Bearer Token"
   - Enter your token (from login/register)

2. **Set Headers:**
   - `Content-Type: application/json`

3. **Set Body:**
   - Select "raw" and "JSON"
   - Enter:
   ```json
   {
     "bookingId": "YOUR_BOOKING_ID",
     "otp": "YOUR_OTP"
   }
   ```

4. **Send Request**

## Complete Test Flow

1. **Register/Login** → Get token
2. **Create Booking** → Get bookingId, check email/console for OTP
3. **Verify OTP** → Use bookingId and OTP
4. **Get Bookings** → Verify status changed to "confirmed"

## Tips

- OTP is case-sensitive (though it's all numbers)
- OTP expires in 10 minutes
- Each booking has its own unique OTP
- Once verified, you cannot verify again (use resend if needed)
- Check server console for detailed error logs

