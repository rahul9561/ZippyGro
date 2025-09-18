# 🛒 ZippyGro –  Delivery Platform

ZippyGro is a ** e-commerce platform** inspired by Zepto and Blinkit.  
It allows users to browse groceries, add items to their cart, and place orders with ** delivery**.  

Built with a **React frontend** and **Django REST backend**, ZippyGro provides a seamless shopping experience with real-time authentication, cart management, and product filtering.

---

## 🚀 Features
- 🛍️ Product Browsing – View groceries with images, prices, and categories  
- 🔍 Filters & Search – Quickly find products by category or keyword  
- 🛒 Cart Management – Add, update, or remove items with live total calculation  
- 🔐 JWT Authentication – Secure login & registration system  
- ⚡ Delivery Concept – Optimized for speed and reliability  
- 📱 Responsive UI – Mobile-friendly React design  

---

## 🏗️ Tech Stack
**Frontend**
- React.js with Redux (state management)  
- Axios for API integration  
- Bootstrap / Tailwind CSS for styling  

**Backend**
- Django REST Framework (DRF)  
- JWT Authentication  
- SQLite / MySQL (configurable)  

**Deployment**
- Nginx + Gunicorn (Linux server)  
- GitHub Actions CI/CD for auto-deploy  

---


## 📂 Project Structure

ZippyGro/
│── frontend/ # React app
│── backend/ # Django project
│── db.sqlite3 # Database (SQLite default)
│── requirements.txt # Python dependencies
│── package.json # React dependencies
│── README.md # Project documentation



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rahul9561/ZippyGro.git
cd ZippyGro

2️⃣ Backend Setup (Django)
cd biharStore
python -m venv env
source env/bin/activate   # For Linux/Mac
env\Scripts\activate      # For Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend will run at 👉 http://127.0.0.1:8000/

3️⃣ Frontend Setup (React)
```bash
cd frontDev/ecom
npm install
npm start
```
Frontend will run at 👉 http://localhost:3000/
