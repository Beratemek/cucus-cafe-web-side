# 📚 CUCUS API Dokümantasyonu - Bölüm 1

## 🚀 Genel Bilgiler

- **Base URL**: `http://localhost:4000/api`
- **Port**: `4000`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

### 🔐 Authentication Header Format

Tüm korumalı endpoint'lerde aşağıdaki header'ı kullanın:

```
Authorization: Bearer <JWT_TOKEN>
```

### 👥 Kullanıcı Rolleri

- **customer**: Normal müşteri
- **admin**: Yönetici (tüm endpoint'lere erişebilir)

---

## 📋 İçindekiler

1. [Auth API](#-1-auth-api)
2. [Admin API](#-2-admin-api)
3. [Products API](#-3-products-api)
4. [Orders API](#-4-orders-api)

---

## 🔑 1. Auth API

**Base Path**: `/api/auth`

### 1.1. Kayıt Ol

Yeni kullanıcı oluşturur ve otomatik olarak sadakat numarası atar.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/auth/register`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "name": "Ali",
  "surname": "Veli",
  "email": "ali@example.com",
  "password": "123456"
}
```

- **Success Response (201)**:
```json
{
  "message": "Kullanıcı başarıyla oluşturuldu!",
  "user": {
    "name": "Ali",
    "surname": "Veli",
    "email": "ali@example.com",
    "sadakat_no": 12345678,
    "points": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Response (400)**:
```json
{
  "message": "Lütfen tüm alanları doldurun!"
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/auth/register`
  - Body (raw JSON):
    ```json
    {
      "name": "Ali",
      "surname": "Veli",
      "email": "ali@example.com",
      "password": "123456"
    }
    ```

---

### 1.2. Giriş Yap

Kullanıcı girişi yapar ve JWT token döner.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/auth/login`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

- **Success Response (200)**:
```json
{
  "message": "Giriş başarılı!",
  "user": {
    "name": "Ali",
    "surname": "Veli",
    "email": "ali@example.com",
    "role": "customer",
    "sadakat_no": 12345678,
    "points": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error Response (400)**:
```json
{
  "message": "Şifre Hatalı!"
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/auth/login`
  - Body (raw JSON):
    ```json
    {
      "email": "ali@example.com",
      "password": "123456"
    }
    ```
  - Response'dan gelen `token` değerini kopyalayın, diğer endpoint'lerde kullanacaksınız!

---

### 1.3. Kullanıcı Bilgilerini Getir (Me)

Token ile kullanıcının profil bilgilerini getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/auth/me`
- **Auth**: Gerekli (Customer veya Admin token)
- **Headers**:
  ```
  Authorization: Bearer <TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "message": "Kullanıcı bilgileri",
  "user": {
    "id": "65f123abc456def789",
    "name": "Ali",
    "surname": "Veli",
    "email": "ali@example.com",
    "role": "customer",
    "sadakat_no": 12345678,
    "points": 100,
    "history": [
      {
        "date": "2025-01-01T10:00:00.000Z",
        "amount": 10,
        "type": "earn",
        "description": "Sipariş ödülü"
      }
    ]
  }
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/auth/me`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (login'den gelen token)

---

### 1.4. Çıkış Yap

Kullanıcı çıkışı yapar (token'ı invalid etmez, frontend'de silin).

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/auth/logout`
- **Auth**: Gerekli
- **Headers**:
  ```
  Authorization: Bearer <TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "message": "Çıkış yapıldı!"
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/auth/logout`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <TOKEN>`

---

### 1.5. Şifre Sıfırlama Token Oluştur

Şifre sıfırlama için token oluşturur (10 dakika geçerli).

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/auth/forgot-password`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "email": "ali@example.com"
}
```

- **Success Response (200)**:
```json
{
  "message": "Şifre sıfırlama token oluşturuldu.",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/auth/forgot-password`
  - Body (raw JSON):
    ```json
    {
      "email": "ali@example.com"
    }
    ```

---

### 1.6. Şifre Sıfırla

Token ile şifreyi sıfırlar.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/auth/reset-password`
- **Auth**: Gerekmez (token body'de gelir)
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "yeniSifre123"
}
```

- **Success Response (200)**:
```json
{
  "message": "Şifre başarıyla güncellendi."
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/auth/reset-password`
  - Body (raw JSON):
    ```json
    {
      "token": "<FORGOT_PASSWORD_DENEN_RESET_TOKEN>",
      "newPassword": "yeniSifre123"
    }
    ```

---

## 👨‍💼 2. Admin API

**Base Path**: `/api/admin`

> ⚠️ **ÖNEMLİ**: Tüm Admin endpoint'leri için **ADMIN TOKEN** gereklidir!  
> Veritabanında `role: "admin"` olan bir kullanıcıyla login yapıp token alın.

---

### 2.1. Tüm Kullanıcıları Getir

Tüm kullanıcıları listeler.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/admin/users`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "message": "Kullanıcılar başarıyla getirildi",
  "count": 10,
  "users": [
    {
      "_id": "65f123abc456def789",
      "name": "Ali",
      "surname": "Veli",
      "email": "ali@example.com",
      "role": "customer",
      "loyalty": {
        "sadakat_no": 12345678,
        "points": 100,
        "history": []
      },
      "coupons": [],
      "wheelSpins": [],
      "lastWheelSpin": null,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/admin/users`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 2.2. Email ile Kullanıcı Ara

Email adresine göre kullanıcı arar.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/admin/users/search?email=ali@example.com`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Query Parameters**:
  - `email` (zorunlu): Aranacak email adresi

- **Success Response (200)**:
```json
{
  "user": {
    "_id": "65f123abc456def789",
    "name": "Ali",
    "surname": "Veli",
    "email": "ali@example.com",
    "role": "customer",
    "loyalty": {
      "sadakat_no": 12345678,
      "points": 100,
      "history": []
    }
  }
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/admin/users/search?email=ali@example.com`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 2.3. Tek Kullanıcı Detayı

Belirli bir kullanıcının detaylı bilgilerini getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/admin/users/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kullanıcı ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "user": {
    "_id": "65f123abc456def789",
    "name": "Ali",
    "surname": "Veli",
    "email": "ali@example.com",
    "role": "customer",
    "loyalty": {
      "sadakat_no": 12345678,
      "points": 100,
      "history": []
    },
    "coupons": [],
    "wheelSpins": []
  }
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/admin/users/65f123abc456def789`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 2.4. Kullanıcı Sil

Kullanıcıyı veritabanından siler.

- **Method**: `DELETE`
- **URL**: `http://localhost:4000/api/admin/users/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kullanıcı ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "message": "Kullanıcı başarıyla silindi."
}
```

- **Postman Örneği**:
  - Method: `DELETE`
  - URL: `http://localhost:4000/api/admin/users/65f123abc456def789`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 2.5. Kullanıcının Puan Geçmişi

Kullanıcının sadakat puanı geçmişini getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/admin/users/:id/history`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kullanıcı ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "userId": "65f123abc456def789",
  "sadakat_no": 12345678,
  "points": 120,
  "history": [
    {
      "date": "2025-01-01T10:00:00.000Z",
      "amount": 10,
      "type": "earn",
      "description": "Sipariş ödülü"
    },
    {
      "date": "2025-01-02T11:00:00.000Z",
      "amount": 50,
      "type": "spend",
      "description": "Sipariş indirimi"
    }
  ]
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/admin/users/65f123abc456def789/history`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

## 🛍️ 3. Products API

**Base Path**: `/api/products`

---

### 3.1. Tüm Ürünleri Getir (Public)

Tüm ürünleri listeler. Authentication gerekmez.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/products`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "count": 3,
  "products": [
    {
      "_id": "65f123abc456def789",
      "name": "Latte",
      "price": 60,
      "category": "coffee",
      "description": "Sıcak içecek",
      "createdBy": "adminUserId",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "_id": "65f123abc456def790",
      "name": "Cappuccino",
      "price": 65,
      "category": "coffee",
      "description": "Sıcak içecek",
      "createdBy": "adminUserId",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/products`

---

### 3.2. Tek Ürün Getir (Public)

Belirli bir ürünün detaylarını getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/products/:id`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Ürün ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "_id": "65f123abc456def789",
  "name": "Latte",
  "price": 60,
  "category": "coffee",
  "description": "Sıcak içecek",
  "createdBy": "adminUserId",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/products/65f123abc456def789`

---

### 3.3. Ürün Oluştur (Admin)

Yeni ürün ekler. Sadece admin yapabilir.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/products`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "name": "Latte",
  "price": 60,
  "category": "coffee",
  "description": "Sıcak içecek"
}
```

- **Required Fields**:
  - `name` (string)
  - `price` (number)
  - `category` (string)

- **Success Response (201)**:
```json
{
  "message": "Ürün başarıyla eklendi!",
  "product": {
    "_id": "65f123abc456def789",
    "name": "Latte",
    "price": 60,
    "category": "coffee",
    "description": "Sıcak içecek",
    "createdBy": "adminUserId",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/products`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`
    - Key: `Content-Type`
    - Value: `application/json`
  - Body (raw JSON):
    ```json
    {
      "name": "Latte",
      "price": 60,
      "category": "coffee",
      "description": "Sıcak içecek"
    }
    ```

---

### 3.4. Ürün Güncelle (Admin)

Mevcut ürünü günceller. Sadece admin yapabilir.

- **Method**: `PUT`
- **URL**: `http://localhost:4000/api/products/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Ürün ID'si (MongoDB ObjectId)

- **Request Body** (kısmi veya tam güncelleme):
```json
{
  "name": "Büyük Latte",
  "price": 70
}
```

- **Success Response (200)**:
```json
{
  "message": "Ürün güncellendi!",
  "product": {
    "_id": "65f123abc456def789",
    "name": "Büyük Latte",
    "price": 70,
    "category": "coffee",
    "description": "Sıcak içecek",
    "createdBy": "adminUserId",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-02T10:00:00.000Z"
  }
}
```

- **Postman Örneği**:
  - Method: `PUT`
  - URL: `http://localhost:4000/api/products/65f123abc456def789`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`
    - Key: `Content-Type`
    - Value: `application/json`
  - Body (raw JSON):
    ```json
    {
      "name": "Büyük Latte",
      "price": 70
    }
    ```

---

### 3.5. Ürün Sil (Admin)

Ürünü veritabanından siler. Sadece admin yapabilir.

- **Method**: `DELETE`
- **URL**: `http://localhost:4000/api/products/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Ürün ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "message": "Ürün silindi!"
}
```

- **Postman Örneği**:
  - Method: `DELETE`
  - URL: `http://localhost:4000/api/products/65f123abc456def789`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

## 🛒 4. Orders API

**Base Path**: `/api/orders`

---

### 4.1. Sipariş Oluştur (Kasa Ekranı / Admin)

Kasiyer/admin tarafından sipariş oluşturulur. Kupon ve puan kullanımı desteklenir.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/orders/create`
- **Auth**: Admin Token gerekli (kasiyer/admin kullanıcısının token'ı)
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "loyaltyNo": 12345678,
  "items": [
    {
      "product": "65f123abc456def789",
      "quantity": 2
    },
    {
      "product": "65f123abc456def790",
      "quantity": 1
    }
  ],
  "pointsUsed": 50,
  "couponCode": "WHEEL10-ABCDEF"
}
```

- **Required Fields**:
  - `loyaltyNo` (number): Müşterinin sadakat numarası
  - `items` (array): Ürün listesi
    - `product` (string): Ürün ID'si
    - `quantity` (number): Adet

- **Optional Fields**:
  - `pointsUsed` (number): Kullanılacak puan
  - `couponCode` (string): Kullanılacak kupon kodu

- **Success Response (201)**:
```json
{
  "message": "Success",
  "order": {
    "_id": "65f123abc456def791",
    "user": "65f123abc456def789",
    "cashier": "adminUserId",
    "items": [
      {
        "product": "65f123abc456def789",
        "quantity": 2,
        "price": 60
      },
      {
        "product": "65f123abc456def790",
        "quantity": 1,
        "price": 65
      }
    ],
    "totalAmount": 130,
    "pointsEarned": 13,
    "pointsUsed": 50,
    "couponCode": "WHEEL10-ABCDEF",
    "discountAmount": 20,
    "status": "Tamamlandı",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  },
  "userPoints": 500
}
```

- **Notlar**:
  - Kupon indirimi yüzdelik olarak hesaplanır (örn: %10)
  - Puan kullanımı toplam tutardan düşülür
  - Siparişten kazanılan puan = (son tutar * 0.10)
  - `totalAmount`: Kupon ve puan düşüldükten sonraki net ödenen tutar

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/orders/create`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`
    - Key: `Content-Type`
    - Value: `application/json`
  - Body (raw JSON):
    ```json
    {
      "loyaltyNo": 12345678,
      "items": [
        { "product": "65f123abc456def789", "quantity": 2 },
        { "product": "65f123abc456def790", "quantity": 1 }
      ],
      "pointsUsed": 50,
      "couponCode": "WHEEL10-ABCDEF"
    }
    ```

---

### 4.2. Tüm Siparişleri Getir (Admin)

Tüm siparişleri listeler. Sadece admin erişebilir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/orders`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "count": 10,
  "orders": [
    {
      "_id": "65f123abc456def791",
      "user": {
        "_id": "65f123abc456def789",
        "name": "Ali",
        "surname": "Veli",
        "email": "ali@example.com",
        "loyalty": {
          "sadakat_no": 12345678
        }
      },
      "cashier": {
        "_id": "adminUserId",
        "name": "Admin",
        "surname": "User",
        "email": "admin@example.com"
      },
      "items": [
        {
          "product": {
            "_id": "65f123abc456def789",
            "name": "Latte",
            "price": 60,
            "category": "coffee"
          },
          "quantity": 2,
          "price": 60
        }
      ],
      "totalAmount": 130,
      "pointsEarned": 13,
      "pointsUsed": 50,
      "couponCode": "WHEEL10-ABCDEF",
      "discountAmount": 20,
      "status": "Tamamlandı",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/orders`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 4.3. Tek Sipariş Detayı

Belirli bir siparişin detaylarını getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/orders/:id`
- **Auth**: Gerekli (Customer veya Admin)
- **Headers**:
  ```
  Authorization: Bearer <TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Sipariş ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "order": {
    "_id": "65f123abc456def791",
    "user": {
      "_id": "65f123abc456def789",
      "name": "Ali",
      "surname": "Veli",
      "email": "ali@example.com",
      "loyalty": {
        "sadakat_no": 12345678
      }
    },
    "cashier": {
      "_id": "adminUserId",
      "name": "Admin",
      "surname": "User",
      "email": "admin@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "65f123abc456def789",
          "name": "Latte",
          "price": 60,
          "category": "coffee"
        },
        "quantity": 2,
        "price": 60
      }
    ],
    "totalAmount": 130,
    "pointsEarned": 13,
    "pointsUsed": 50,
    "couponCode": "WHEEL10-ABCDEF",
    "discountAmount": 20,
    "status": "Tamamlandı",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/orders/65f123abc456def791`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <TOKEN>`

---

### 4.4. Kullanıcının Siparişleri

Belirli bir kullanıcının siparişlerini listeler.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/orders/user/:userId`
- **Auth**: Gerekli
- **Headers**:
  ```
  Authorization: Bearer <TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `userId`: Kullanıcı ID'si (MongoDB ObjectId)

- **Notlar**:
  - Admin token ile: Herhangi bir kullanıcının siparişlerini görebilir
  - Customer token ile: Kendi siparişlerini görmesi için kendi `userId`'sini kullanmalı

- **Success Response (200)**:
```json
{
  "count": 3,
  "orders": [
    {
      "_id": "65f123abc456def791",
      "items": [
        {
          "product": {
            "_id": "65f123abc456def789",
            "name": "Latte",
            "price": 60,
            "category": "coffee"
          },
          "quantity": 2,
          "price": 60
        }
      ],
      "totalAmount": 130,
      "pointsEarned": 13,
      "pointsUsed": 50,
      "status": "Tamamlandı",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/orders/user/65f123abc456def789`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <TOKEN>`

---

### 4.5. Sipariş İptal Et (Admin)

Siparişi iptal eder ve puanları geri verir.

- **Method**: `PUT`
- **URL**: `http://localhost:4000/api/orders/:id/cancel`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Sipariş ID'si (MongoDB ObjectId)

- **Notlar**:
  - Kullanılan puanlar geri eklenir (type: "earn", "Sipariş iptali - puan iadesi")
  - Kazanılan puanlar geri alınır (type: "spend", "Sipariş iptali - kazanılan puan iadesi")

- **Success Response (200)**:
```json
{
  "message": "Sipariş iptal edildi",
  "order": {
    "_id": "65f123abc456def791",
    "status": "İptal Edildi",
    ...
  }
}
```

- **Postman Örneği**:
  - Method: `PUT`
  - URL: `http://localhost:4000/api/orders/65f123abc456def791/cancel`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

## 📝 Bölüm 1 Sonu

**Devamı için**: `API_DOCUMENTATION_PART2.md` dosyasına bakın.

İçerik:
- Campaigns API
- Wheel API

---

**Hazırlayan**: Backend Development Team  
**Son Güncelleme**: 2025-01-01  
**Versiyon**: 1.0.0

# 📚 CUCUS API Dokümantasyonu - Bölüm 2

## 🚀 Genel Bilgiler

- **Base URL**: `http://localhost:4000/api`
- **Port**: `4000`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

### 🔐 Authentication Header Format

Tüm korumalı endpoint'lerde aşağıdaki header'ı kullanın:

```
Authorization: Bearer <JWT_TOKEN>
```

### 👥 Kullanıcı Rolleri

- **customer**: Normal müşteri
- **admin**: Yönetici (tüm endpoint'lere erişebilir)

---

## 📋 İçindekiler

1. [Campaigns API](#-5-campaigns-api)
2. [Wheel API](#-6-wheel-api)
3. [Hata Kodları](#-hata-kodları-ve-mesajları)
4. [Örnek Kullanım Senaryoları](#-örnek-kullanım-senaryoları)

---

## 🎯 5. Campaigns API

**Base Path**: `/api/campaigns`

---

### 5.1. Tüm Kampanyaları Getir (Public)

Tüm kampanyaları listeler. Authentication gerekmez.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/campaigns`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **Query Parameters** (opsiyonel):
  - `active` (string): `true` değeri gönderilirse, sadece aktif ve süresi dolmamış kampanyalar getirilir.

- **Success Response (200)**:
```json
{
  "count": 2,
  "campaigns": [
    {
      "_id": "65f123abc456def792",
      "title": "Yeni Yıl İndirimi",
      "description": "Tüm sıcak içeceklerde %20 indirim",
      "discountType": "percent",
      "discountValue": 20,
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.000Z",
      "isActive": true,
      "image": "https://example.com/campaign.png",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "_id": "65f123abc456def793",
      "title": "Kış Kampanyası",
      "description": "Kahve ve çaylarda %15 indirim",
      "discountType": "percent",
      "discountValue": 15,
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-02-15T23:59:59.000Z",
      "isActive": false,
      "image": null,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

- **Postman Örneği - Tüm Kampanyalar**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/campaigns`

- **Postman Örneği - Sadece Aktif Kampanyalar**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/campaigns?active=true`

---

### 5.2. Tek Kampanya Getir (Public)

Belirli bir kampanyanın detaylarını getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/campaigns/:id`
- **Auth**: Gerekmez
- **Headers**:
  ```
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kampanya ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "_id": "65f123abc456def792",
  "title": "Yeni Yıl İndirimi",
  "description": "Tüm sıcak içeceklerde %20 indirim",
  "discountType": "percent",
  "discountValue": 20,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z",
  "isActive": true,
  "image": "https://example.com/campaign.png",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

- **Error Response (404)**:
```json
{
  "message": "Kampanya bulunamadı!"
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/campaigns/65f123abc456def792`

---

### 5.3. Kampanya Oluştur (Admin)

Yeni kampanya oluşturur. Sadece admin yapabilir.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/campaigns`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **Request Body**:
```json
{
  "title": "Yeni Yıl İndirimi",
  "description": "Tüm sıcak içeceklerde %20 indirim",
  "discountType": "percent",
  "discountValue": 20,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-31T23:59:59.000Z",
  "isActive": true,
  "image": "https://example.com/campaign.png"
}
```

- **Required Fields**:
  - `title` (string): Kampanya başlığı
  - `discountValue` (number): İndirim değeri
  - `endDate` (string, ISO 8601): Bitiş tarihi

- **Optional Fields**:
  - `description` (string): Kampanya açıklaması
  - `discountType` (string): `"percent"` veya `"amount"` (varsayılan: `"percent"`)
  - `startDate` (string, ISO 8601): Başlangıç tarihi (varsayılan: şimdi)
  - `isActive` (boolean): Aktiflik durumu (varsayılan: `true`)
  - `image` (string): Kampanya görsel URL'si

- **Success Response (201)**:
```json
{
  "message": "Kampanya başarıyla oluşturuldu!",
  "campaign": {
    "_id": "65f123abc456def792",
    "title": "Yeni Yıl İndirimi",
    "description": "Tüm sıcak içeceklerde %20 indirim",
    "discountType": "percent",
    "discountValue": 20,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.000Z",
    "isActive": true,
    "image": "https://example.com/campaign.png",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

- **Error Response (400)**:
```json
{
  "message": "Başlık, indirim değeri ve bitiş tarihi zorunludur!"
}
```

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/campaigns`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`
    - Key: `Content-Type`
    - Value: `application/json`
  - Body (raw JSON):
    ```json
    {
      "title": "Yeni Yıl İndirimi",
      "description": "Tüm sıcak içeceklerde %20 indirim",
      "discountType": "percent",
      "discountValue": 20,
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.000Z",
      "isActive": true,
      "image": "https://example.com/campaign.png"
    }
    ```

---

### 5.4. Kampanya Güncelle (Admin)

Mevcut kampanyayı günceller. Sadece admin yapabilir.

- **Method**: `PUT`
- **URL**: `http://localhost:4000/api/campaigns/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kampanya ID'si (MongoDB ObjectId)

- **Request Body** (kısmi veya tam güncelleme):
```json
{
  "title": "Yeni Yıl İndirimi (Güncellendi)",
  "discountValue": 25,
  "isActive": false
}
```

- **Success Response (200)**:
```json
{
  "message": "Kampanya güncellendi!",
  "campaign": {
    "_id": "65f123abc456def792",
    "title": "Yeni Yıl İndirimi (Güncellendi)",
    "description": "Tüm sıcak içeceklerde %20 indirim",
    "discountType": "percent",
    "discountValue": 25,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-31T23:59:59.000Z",
    "isActive": false,
    "image": "https://example.com/campaign.png",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-02T10:00:00.000Z"
  }
}
```

- **Error Response (404)**:
```json
{
  "message": "Kampanya bulunamadı!"
}
```

- **Postman Örneği**:
  - Method: `PUT`
  - URL: `http://localhost:4000/api/campaigns/65f123abc456def792`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`
    - Key: `Content-Type`
    - Value: `application/json`
  - Body (raw JSON):
    ```json
    {
      "title": "Yeni Yıl İndirimi (Güncellendi)",
      "isActive": false
    }
    ```

---

### 5.5. Kampanya Sil (Admin)

Kampanyayı veritabanından siler. Sadece admin yapabilir.

- **Method**: `DELETE`
- **URL**: `http://localhost:4000/api/campaigns/:id`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kampanya ID'si (MongoDB ObjectId)

- **Success Response (200)**:
```json
{
  "message": "Kampanya silindi!"
}
```

- **Error Response (404)**:
```json
{
  "message": "Kampanya bulunamadı!"
}
```

- **Postman Örneği**:
  - Method: `DELETE`
  - URL: `http://localhost:4000/api/campaigns/65f123abc456def792`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

### 5.6. Kampanya Aktif/Pasif Toggle (Admin)

Kampanyanın aktif/pasif durumunu değiştirir. Sadece admin yapabilir.

- **Method**: `PATCH`
- **URL**: `http://localhost:4000/api/campaigns/:id/toggle`
- **Auth**: Admin Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `id`: Kampanya ID'si (MongoDB ObjectId)

- **Success Response (200) - Aktif Edildi**:
```json
{
  "message": "Kampanya aktif hale getirildi!",
  "campaign": {
    "_id": "65f123abc456def792",
    "title": "Yeni Yıl İndirimi",
    "isActive": true,
    ...
  }
}
```

- **Success Response (200) - Pasif Edildi**:
```json
{
  "message": "Kampanya pasif hale getirildi!",
  "campaign": {
    "_id": "65f123abc456def792",
    "title": "Yeni Yıl İndirimi",
    "isActive": false,
    ...
  }
}
```

- **Error Response (404)**:
```json
{
  "message": "Kampanya bulunamadı!"
}
```

- **Postman Örneği**:
  - Method: `PATCH`
  - URL: `http://localhost:4000/api/campaigns/65f123abc456def792/toggle`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <ADMIN_TOKEN>`

---

## 🎰 6. Wheel API

**Base Path**: `/api/wheel`

> ⚠️ **ÖNEMLİ**: Tüm Wheel endpoint'leri için **CUSTOMER TOKEN** gereklidir!  
> Normal kullanıcı token'ı ile login yapıp token alın.

---

### 6.1. Çark Çevir

Kullanıcı çarkı çevirir ve ödül kazanır. Günde sadece 1 kez çevrilebilir.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/wheel/spin`
- **Auth**: Customer Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <CUSTOMER_TOKEN>
  Content-Type: application/json
  ```

- **Request Body**: Yok

- **Ödül Tipleri**:
  - **Points**: 10, 25, 50, 100, 250 puan (ağırlıklı rastgele)
  - **Coupon**: %5, %10, %15, %20 indirim kuponu (ağırlıklı rastgele)
  - **Retry**: Şanssız, yarın tekrar deneyin

- **Success Response (200) - Puan Kazanıldı**:
```json
{
  "success": true,
  "reward": {
    "type": "points",
    "value": 50,
    "message": "Tebrikler! 50 sadakat puanı kazandınız!"
  }
}
```

- **Success Response (200) - Kupon Kazanıldı**:
```json
{
  "success": true,
  "reward": {
    "type": "coupon",
    "value": 10,
    "code": "WHEEL10-ABCDEF",
    "expiryDate": "2025-02-01T00:00:00.000Z",
    "message": "Tebrikler! %10 indirim kuponu kazandınız!"
  }
}
```

- **Success Response (200) - Şanssız**:
```json
{
  "success": true,
  "reward": {
    "type": "retry",
    "value": 0,
    "message": "Maalesef bu sefer şansınız yaver gitmedi. Yarın tekrar deneyin!"
  }
}
```

- **Error Response (400) - Limit Aşıldı**:
```json
{
  "message": "Çarkı 5 saat sonra tekrar çevirebilirsiniz!"
}
```

- **Notlar**:
  - Kullanıcı 24 saatte en fazla 1 kez çark çevirebilir
  - Kuponlar 30 gün geçerlidir
  - Puanlar otomatik olarak kullanıcı hesabına eklenir
  - Kuponlar kullanıcının kupon listesine eklenir

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/wheel/spin`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <CUSTOMER_TOKEN>`

---

### 6.2. Kullanıcının Kuponlarını Getir

Kullanıcının geçerli (kullanılmamış ve süresi dolmamış) kuponlarını listeler.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/wheel/coupons`
- **Auth**: Customer Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <CUSTOMER_TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "count": 2,
  "coupons": [
    {
      "code": "WHEEL10-ABCDEF",
      "discountType": "percent",
      "discountValue": 10,
      "expiryDate": "2025-02-01T00:00:00.000Z",
      "isUsed": false,
      "earnedFrom": "wheel",
      "createdAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "code": "WHEEL15-XYZ123",
      "discountType": "percent",
      "discountValue": 15,
      "expiryDate": "2025-02-15T00:00:00.000Z",
      "isUsed": false,
      "earnedFrom": "wheel",
      "createdAt": "2025-01-02T10:00:00.000Z"
    }
  ]
}
```

- **Notlar**:
  - Sadece `isUsed: false` ve `expiryDate > şimdi` olan kuponlar döner
  - Kullanılmış veya süresi dolmuş kuponlar filtrelenir

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/wheel/coupons`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <CUSTOMER_TOKEN>`

---

### 6.3. Çark Geçmişi

Kullanıcının çark çevirme geçmişini getirir.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/wheel/history`
- **Auth**: Customer Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <CUSTOMER_TOKEN>
  Content-Type: application/json
  ```

- **Success Response (200)**:
```json
{
  "count": 5,
  "history": [
    {
      "date": "2025-01-01T10:00:00.000Z",
      "reward": "points",
      "rewardValue": 50
    },
    {
      "date": "2025-01-02T10:00:00.000Z",
      "reward": "coupon",
      "rewardValue": {
        "code": "WHEEL10-ABCDEF",
        "value": 10
      }
    },
    {
      "date": "2025-01-03T10:00:00.000Z",
      "reward": "retry",
      "rewardValue": 0
    }
  ],
  "lastSpin": "2025-01-05T10:00:00.000Z"
}
```

- **Notlar**:
  - `lastSpin`: Son çark çevirme tarihi (24 saat kontrolü için kullanılır)
  - `rewardValue`: Points için sayı, coupon için obje, retry için 0

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/wheel/history`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <CUSTOMER_TOKEN>`

---

### 6.4. Kupon Kullanma

Kuponu kullanıldı olarak işaretler.

- **Method**: `POST`
- **URL**: `http://localhost:4000/api/wheel/coupons/:code/use`
- **Auth**: Customer Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <CUSTOMER_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `code`: Kupon kodu (örn: `WHEEL10-ABCDEF`)

- **Success Response (200)**:
```json
{
  "message": "Kupon başarıyla kullanıldı!",
  "coupon": {
    "code": "WHEEL10-ABCDEF",
    "discountType": "percent",
    "discountValue": 10
  }
}
```

- **Error Response (404)**:
```json
{
  "message": "Kupon bulunamadı veya zaten kullanılmış!"
}
```

- **Error Response (400)**:
```json
{
  "message": "Kuponun süresi dolmuş!"
}
```

- **Notlar**:
  - Kupon `isUsed: true` olarak işaretlenir
  - Kupon sipariş oluşturulurken kullanılır (order controller'da kontrol edilir)

- **Postman Örneği**:
  - Method: `POST`
  - URL: `http://localhost:4000/api/wheel/coupons/WHEEL10-ABCDEF/use`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <CUSTOMER_TOKEN>`

---

### 6.5. Kupon Doğrulama

Kuponun geçerli olup olmadığını kontrol eder.

- **Method**: `GET`
- **URL**: `http://localhost:4000/api/wheel/coupons/:code/validate`
- **Auth**: Customer Token gerekli
- **Headers**:
  ```
  Authorization: Bearer <CUSTOMER_TOKEN>
  Content-Type: application/json
  ```

- **URL Parameters**:
  - `code`: Kupon kodu (örn: `WHEEL10-ABCDEF`)

- **Success Response (200) - Geçerli**:
```json
{
  "valid": true,
  "message": "Kupon geçerli!",
  "coupon": {
    "code": "WHEEL10-ABCDEF",
    "discountType": "percent",
    "discountValue": 10,
    "expiryDate": "2025-02-01T00:00:00.000Z"
  }
}
```

- **Error Response (404) - Bulunamadı**:
```json
{
  "valid": false,
  "message": "Kupon bulunamadı!"
}
```

- **Error Response (400) - Kullanılmış**:
```json
{
  "valid": false,
  "message": "Kupon zaten kullanılmış!"
}
```

- **Error Response (400) - Süresi Dolmuş**:
```json
{
  "valid": false,
  "message": "Kuponun süresi dolmuş!"
}
```

- **Postman Örneği**:
  - Method: `GET`
  - URL: `http://localhost:4000/api/wheel/coupons/WHEEL10-ABCDEF/validate`
  - Headers:
    - Key: `Authorization`
    - Value: `Bearer <CUSTOMER_TOKEN>`

---

## ❌ Hata Kodları ve Mesajları

### 4xx - İstemci Hataları

| HTTP Kodu | Açıklama | Örnek Mesaj |
|-----------|----------|-------------|
| 400 | Bad Request | "Lütfen tüm alanları doldurun!" |
| 401 | Unauthorized | "Yetkisiz erişim: Token yok!" |
| 403 | Forbidden | "Bu işlem için yetkin yok!" |
| 404 | Not Found | "Kullanıcı bulunamadı." |

### 5xx - Sunucu Hataları

| HTTP Kodu | Açıklama | Örnek Mesaj |
|-----------|----------|-------------|
| 500 | Internal Server Error | "Sunucu hatası!" |

---

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: Yeni Kullanıcı Kaydı ve İlk Sipariş

1. **Kullanıcı Kaydı**:
   ```
   POST /api/auth/register
   Body: { "name": "Ali", "surname": "Veli", "email": "ali@example.com", "password": "123456" }
   Response: { "token": "...", "user": { "sadakat_no": 12345678, "points": 0 } }
   ```

2. **Ürünleri Görüntüleme**:
   ```
   GET /api/products
   Response: { "products": [...] }
   ```

3. **Çark Çevirme** (24 saat sonra):
   ```
   POST /api/wheel/spin
   Headers: { "Authorization": "Bearer <TOKEN>" }
   Response: { "reward": { "type": "points", "value": 50 } }
   ```

4. **Kupon Kontrolü**:
   ```
   GET /api/wheel/coupons
   Headers: { "Authorization": "Bearer <TOKEN>" }
   ```

### Senaryo 2: Admin - Sipariş Oluşturma

1. **Admin Login**:
   ```
   POST /api/auth/login
   Body: { "email": "admin@example.com", "password": "admin123" }
   Response: { "token": "<ADMIN_TOKEN>", "role": "admin" }
   ```

2. **Sipariş Oluşturma**:
   ```
   POST /api/orders/create
   Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
   Body: {
     "loyaltyNo": 12345678,
     "items": [{ "product": "PRODUCT_ID", "quantity": 2 }],
     "pointsUsed": 50,
     "couponCode": "WHEEL10-ABCDEF"
   }
   ```

3. **Siparişleri Görüntüleme**:
   ```
   GET /api/orders
   Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
   ```

### Senaryo 3: Kampanya Yönetimi

1. **Kampanya Oluşturma**:
   ```
   POST /api/campaigns
   Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
   Body: {
     "title": "Yeni Yıl İndirimi",
     "discountValue": 20,
     "endDate": "2025-01-31T23:59:59.000Z"
   }
   ```

2. **Aktif Kampanyaları Görüntüleme** (Public):
   ```
   GET /api/campaigns?active=true
   ```

3. **Kampanya Toggle**:
   ```
   PATCH /api/campaigns/<CAMPAIGN_ID>/toggle
   Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
   ```

---

## 🔗 Hızlı Linkler

- **Bölüm 1**: `API_DOCUMENTATION_PART1.md`
  - Auth API
  - Admin API
  - Products API
  - Orders API

- **Bölüm 2**: `API_DOCUMENTATION_PART2.md` (bu dosya)
  - Campaigns API
  - Wheel API

---

## 💡 İpuçları

1. **Token Yönetimi**:
   - Login/Register'dan gelen token'ı saklayın
   - Token 7 gün geçerlidir
   - Token'ı her istekte `Authorization: Bearer <TOKEN>` header'ında gönderin

2. **Admin vs Customer Token**:
   - Admin endpoint'leri için mutlaka admin token kullanın
   - Customer endpoint'leri için customer token kullanın

3. **Çark Çevirme**:
   - 24 saatte 1 kez çevrilebilir
   - `GET /api/wheel/history` ile son çevirme zamanını kontrol edin

4. **Kupon Kullanımı**:
   - Kupon sipariş oluşturulurken kullanılır
   - Kupon doğrulama endpoint'i ile önceden kontrol edebilirsiniz

5. **Sipariş Oluşturma**:
   - `loyaltyNo` ile müşteri bulunur
   - Kupon ve puan birlikte kullanılabilir
   - Siparişten kazanılan puan = (net tutar * 0.10)



**Hazırlayan**: Backend Development Team  
**Son Güncelleme**: 2025-01-01  
**Versiyon**: 1.0.0

