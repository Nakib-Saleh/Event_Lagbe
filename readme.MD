# Event Lagbe

Event Lagbe is a full-stack event management platform that allows users to create, browse, and manage events seamlessly. The platform is designed for universities, clubs, and organizations to handle everything from event announcements to participant registrations in one place.

---

## 🚀 Features

- **User Registration & Authentication**
  - Secure sign-up/login system
  - Role-based access (Admin, Organizer, Attendee)

- **Event Management**
  - Create and manage events with details (title, date, venue, description)
  - Upload banners and resources
  - Manage registrations and ticketing

- **Search & Discovery**
  - Browse upcoming events
  - Filter by category, date, or organizer

- **Notifications**
  - Real-time updates for registered users
  - Event reminders and announcements

- **Admin Dashboard**
  - Manage users, events, and analytics
  - Approve/reject event requests

---

## 🛠️ Tech Stack

**Frontend**
- React.js  
- Tailwind CSS / Bootstrap  
- Axios for API integration  

**Backend**
- Spring Boot (Java)  
- RESTful API with layered architecture  
- Spring Security for authentication  

**Database**
- MongoDB (event storage, user data)  

**Deployment**
- Docker for containerization  
- Vercel for deployment  

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js
- Java 
- MongoDB
- Maven

### Backend Setup
```
cd backend
$env:SPRING_PROFILES_ACTIVE="local"
./mvnw spring-boot:run
```

### Frontend Setup
```
cd frontend
npm install
npm run dev
```


Live Link: https://event-lagbe.vercel.app/

---
