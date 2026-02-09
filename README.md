# Insurance Consulting System

Technical challenge: **Insurance Consulting**

This solution implements a small insurance consulting system following clean architecture principles, using **ASP.NET Core**, **Angular**, **SQL Server**, and **Stored Procedures**.

---

## 🧱 Solution Architecture

The solution is composed of **three independent applications**:

### 1️⃣ Backend – ASP.NET Core Web API

- Clean Architecture
  - Domain
  - Application
  - Infrastructure
  - API
- Entity Framework Core
- SQL Server
- Stored Procedures
- JWT Authentication
- PDF generation using **iTextSharp**

### 2️⃣ Frontend Admin – Angular

- Angular 16+ (standalone components)
- Angular Material
- JWT authentication
- Guards for protected routes
- CRUD operations:
  - Users
  - Clients
  - Insurances
  - Client–Insurance assignment

### 3️⃣ Frontend Public – ASP.NET MVC

- ASP.NET MVC 6+
- Bootstrap 5
- Public access (no login, no guards)
- Main query screen:
  - Search by **Client Identification**
  - Search by **Insurance Code**
- Generates **filtered PDF reports** by calling the API

---

## 🗂 Project Structure
