# 🔧 Google OAuth Redirect URI Fix - Backend Prompt

## 📋 **Masalah**

Saat ini, Google OAuth callback redirect ke backend (`http://localhost:8000/auth/google/callback`), sehingga user melihat JSON response di browser. Seharusnya Google redirect ke frontend (`http://localhost:5173/auth/google/callback`) agar frontend yang handle callback dan redirect ke dashboard.

## 🎯 **Solusi**

Ubah `redirect_uri` di Google OAuth configuration agar mengarah ke frontend, bukan ke backend.

## 📝 **Yang Perlu Diubah di Backend**

### **Option 1: Ubah redirect_uri langsung ke frontend (Recommended)**

1. **Cari konfigurasi Google OAuth** di backend (biasanya di file config atau environment variables)
2. **Ubah `redirect_uri`** dari:

   ```
   http://localhost:8000/auth/google/callback
   ```

   Menjadi:

   ```
   http://localhost:5173/auth/google/callback
   ```

3. **Update di Google Cloud Console**:
   - Buka Google Cloud Console → APIs & Services → Credentials
   - Edit OAuth 2.0 Client ID
   - Tambahkan `http://localhost:5173/auth/google/callback` ke **Authorized redirect URIs**

### **Option 2: Backend redirect ke frontend setelah callback**

Jika ingin tetap menggunakan backend endpoint sebagai callback, ubah endpoint `/auth/google/callback` di backend agar setelah berhasil exchange code dengan token, backend melakukan redirect ke frontend:

```python
# Contoh implementasi di backend (Python/FastAPI)
@router.get("/auth/google/callback")
async def google_callback(code: str, state: Optional[str] = None):
    try:
        # Exchange code with Google untuk mendapatkan access token
        # ... your existing code to exchange code with token ...

        # Setelah berhasil, redirect ke frontend dengan code
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        redirect_url = f"{frontend_url}/auth/google/callback?code={code}"
        if state:
            redirect_url += f"&state={state}"

        return RedirectResponse(url=redirect_url)
    except Exception as e:
        # Handle error - redirect ke frontend dengan error parameter
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(
            url=f"{frontend_url}/auth/google/callback?error={str(e)}"
        )
```

**Tapi ini kurang ideal karena:** Frontend tetap perlu call backend lagi untuk exchange code dengan token.

### **Option 3: Hybrid Approach (Best Practice)**

1. **Backend endpoint `/auth/google/callback` tetap ada** untuk exchange code dengan token
2. **Ubah `redirect_uri` di Google OAuth** agar mengarah ke frontend: `http://localhost:5173/auth/google/callback`
3. **Frontend handle callback**, kemudian frontend call backend endpoint `/auth/google/callback` dengan code untuk mendapatkan token

**Flow:**

```
1. User klik "Continue with Google"
2. Frontend dapat authUrl dari backend (redirect_uri sudah ke frontend)
3. User redirect ke Google
4. Google redirect ke: http://localhost:5173/auth/google/callback?code=xxx
5. Frontend (GoogleCallbackPage) handle callback
6. Frontend call backend: GET /auth/google/callback?code=xxx
7. Backend exchange code dengan token, return token + user data
8. Frontend save token, redirect ke dashboard
```

## 🔍 **Yang Perlu Dicek di Backend**

1. **Cari file yang generate Google OAuth URL** (biasanya di endpoint `/auth/google/url`)
   - Cari parameter `redirect_uri` di Google OAuth URL
   - Pastikan menggunakan environment variable untuk frontend URL

2. **Cek environment variables**:

   ```env
   FRONTEND_URL=http://localhost:5173
   # atau
   GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/google/callback
   ```

3. **Update kode backend** untuk menggunakan frontend URL:

   ```python
   # Contoh (Python/FastAPI)
   frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
   redirect_uri = f"{frontend_url}/auth/google/callback"

   # Build Google OAuth URL
   google_auth_url = (
       f"https://accounts.google.com/o/oauth2/v2/auth?"
       f"client_id={CLIENT_ID}&"
       f"redirect_uri={redirect_uri}&"
       f"scope=profile email&"
       f"response_type=code&"
       f"access_type=offline&"
       f"prompt=consent"
   )
   ```

4. **Cek endpoint `/auth/google/callback`** di backend:
   - Pastikan masih bisa menerima `code` parameter
   - Return token dan user data dalam format JSON (untuk frontend call)
   - Jangan redirect langsung ke dashboard (biarkan frontend yang handle)

## 📋 **Checklist**

- [ ] Ubah `redirect_uri` di Google OAuth URL generation ke frontend URL
- [ ] Tambahkan environment variable untuk frontend URL
- [ ] Update Google Cloud Console dengan redirect URI frontend
- [ ] Test flow: Google → Frontend callback → Backend API call → Dashboard

## ⚠️ **Catatan Penting**

- Pastikan frontend URL sesuai dengan environment (development: `localhost:5173`, production: domain production)
- Update Google Cloud Console dengan semua redirect URIs yang digunakan
- Untuk production, pastikan menggunakan HTTPS

---

**Frontend sudah siap untuk handle callback di `/auth/google/callback` dan akan redirect ke dashboard setelah berhasil!**
