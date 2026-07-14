# API Documentation

The backend service exposes a set of RESTful APIs for interacting with the application. The following sections provide detailed information about each API endpoint, including request and response formats, authentication requirements, and error handling.

## Authentication

### Register

Description: Register a new user account.

**Endpoint:** `/api/auth/register`

**Method:** `POST`

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string" (optional)
}
```

**Success Response:**

**Code:** `201 Created`

**Content:**
```json
{
  "success": true,
  "message": "Registered Successfully",
  "data": {
    "user": {
        "username": "string",
        "email": "string" || null
    }
  }
}
```

This response automatically sets two secure, httpOnly cookies in the user's browser: `accessToken` and `refreshToken`. These cookies are used for authentication in subsequent requests. For more information on how to use these cookies for authentication, please refer to the [Authentication Guide](./authentication.md).

**Error Responses:**

Already registered user

**Code:** `409 Conflict`

**Content:**
```json
{
  "success": false,
  "error": {
    "message": "User Already Exists",
    "code": "USER_ALREADY_EXISTS"
  }
}
```

Invalid input

**Code:** `400 Bad Request`

**Content:**
```json
{
  "success": false,
  "error": {
    "message": [
        "Username must be at least 4 characters long",
        "Username cannot exceed 20 characters",
        "Username can only contain letters, numbers, and [ . _ - * ]",
        "Username cannot contain @",
        "Please enter a valid email address",
        "Password must be at least 8 characters long",
        "Password is too long",
    ],
    "code": "INVALID_INPUT"
  }
}
```

### Login

Description: Authenticate a user and obtain authentication cookies.

**Endpoint:** `/api/auth/login`

**Method:** `POST`

**Request Body:**
```json
{
  "identifier": "string",
  "password": "string"
}
```

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Login Successful",
  "data": {
    "user": {
        "username": "string",
        "email": "string" || null
    }
  }
}
```

This response automatically sets two secure, httpOnly cookies in the user's browser: `accessToken` and `refreshToken`. These cookies are used for authentication in subsequent requests. For more information on how to use these cookies for authentication, please refer to the [Authentication Guide](./authentication.md).

**Error Responses:**

User not found

**Code:** `409 Conflict`

**Content:**
```json
{
  "success": false,
  "error": {
    "message": "User Doesn't Exist",
    "code": "USER_NOT_EXIST"
  }
}
```

Password mismatch

**Code:** `401 Unauthorized`

**Content:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_INPUT"
  }
}
```

Invalid input

**Code:** `400 Bad Request`
**Content:**
```json
{
  "success": false,
  "error": {
    "message": [
        "Invalid email or password",
    ],
    "code": "INVALID_INPUT"
  }
}
```

### Logout

Description: Logout a user and clear authentication cookies.

**Endpoint:** `/api/auth/logout`

**Method:** `POST`

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```