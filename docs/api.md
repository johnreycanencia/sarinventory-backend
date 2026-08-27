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

## Products

### Get All Products

Description: Retrieve a list of all products in the inventory.

Requires authentication via `accessToken` and `refreshToken` cookies

Note: The credentials `include` option in the request indicates that the request should include credentials, such as cookies, for authentication.

**Endpoint:** `/api/products`

**Method:** `GET`

**Credentials:** `include` 

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Products Retrieved",
  "data": {
    "products": [
      {
        "id": "string",
        "name": "string",
        "costPrice": 0,
        "sellingPrice": 0,
        "imageUrl": "string" || null,
        "stock": 0,
        "createdAt": "2024-06-01T00:00:00.000Z",
        "updatedAt": "2024-06-01T00:00:00.000Z",
        "categoryId": "string" || null,
        "category": {
          "id": "string",
          "name": "string",
        } || null
      }
    ]
  }
}
```

### Get Product by ID

Description: Retrieve details of a specific product by its ID.

**Endpoint:** `/api/products/{id}`

**Method:** `GET`

**Credentials:** `include`

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Product Retrieved",
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "costPrice": 0,
      "sellingPrice": 0,
      "imageUrl": "string",
      "stock": 0,
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-01T00:00:00.000Z",
      "categoryId": "string" || null,
      "category": {
        "id": "string",
        "name": "string",
      } || null
    }
  }
}
```

**Error Response:**

Product not found

**Code:** `404 Not Found`
**Content:**
```json
{
  "success": false,
  "error": {
    "message": "Product Not Found",
    "code": "NOT_FOUND"
  }
}
```

### Insert Product

Description: Insert a new product into the inventory.

**Endpoint:** `/api/products`

**Method:** `POST`

**Credentials:** `include`

**Request Body:**
```json
{
  "name": "string",
  "costPrice": number,
  "sellingPrice": number,
  "stock": number,
  "imageUrl"?: "string" || null,
  "categoryId"?: "string" || null
}
```

**Success Response:**

**Code:** `201 Created`

**Content:**
```json
{
  "success": true,
  "message": "Product Added",
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "costPrice": 0,
      "sellingPrice": 0,
      "imageUrl": "string" || null,
      "stock": 0,
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-01T00:00:00.000Z",
      "categoryId": "string" || null,
      "category": {
        "id": "string",
        "name": "string",
      } || null
    }
  }
}
```

### Partial Update Product

Description: Partially update an existing product in the inventory.

**Endpoint:** `/api/products/{id}`

**Method:** `PATCH`

**Credentials:** `include`

**Request Body:**
```json
{
  "name"?: "string",
  "costPrice"?: number,
  "sellingPrice"?: number,
  "stock"?: number,
  "imageUrl"?: "string" || null,
  "categoryId"?: "string" || null
}
```

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Product Updated",
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "costPrice": 0,
      "sellingPrice": 0,
      "imageUrl": "string" || null,
      "stock": 0,
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-01T00:00:00.000Z",
      "categoryId": "string" || null,
      "userId": "string",
    }
  }
}
```

### Delete Product

Description: Delete an existing product from the inventory.

**Endpoint:** `/api/products/{id}`

**Method:** `DELETE`

**Credentials:** `include`

**Success Response:**

**Code:** `200 OK`

**Content:**
```json
{
  "success": true,
  "message": "Product Deleted"
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "costPrice": 0,
      "sellingPrice": 0,
      "imageUrl": "string" || null,
      "stock": 0,
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-01T00:00:00.000Z",
      "categoryId": "string" || null,
      "userId": "string",
    }
  }
}
```