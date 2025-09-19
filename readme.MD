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
- Render / Vercel for deployment  

---

## 📂 Project Structure

Event_Lagbe/
│── backend/ # Spring Boot project
│ ├── src/main/java/ # Controllers, Services, Models
│ ├── resources/ # Config, application.properties
│
│── frontend/ # React project
│ ├── src/ # Components, Pages, Services
│ ├── public/ # Static assets
│
│── docs/ # ER diagrams, WBS, Gantt charts
│── README.md # Project documentation

yaml
Copy code

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js (v16+)
- Java 17
- MongoDB (running locally or cloud, e.g., MongoDB Atlas)
- Maven

### Backend Setup
cd backend
mvn spring-boot:run

shell
Copy code

### Frontend Setup
cd frontend
npm install
npm start

yaml
Copy code

Frontend runs on **http://localhost:3000**  
Backend runs on **http://localhost:8080**

---

## 📸 Screenshots

(Add screenshots of login page, event creation form, event listing, etc.)

---

## 📊 Project Management

- **ER Diagram** – for database schema  
- **Work Breakdown Structure (WBS)** – for task planning  
- **Gantt Chart** – for timeline tracking  

---

## 👨‍💻 Contributors

- Nakib Saleh (Frontend, UI/UX)  
- [Teammates’ names if applicable]  

---

## 📜 License

This project is licensed under the MIT License – feel free to use and modify.