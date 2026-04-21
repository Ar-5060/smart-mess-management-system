# Smart Mess Management and Shared Expense Tracking System

## Project Overview

The **Smart Mess Management and Shared Expense Tracking System** is a web-based application designed to streamline meal tracking, shared expenses, rent collection, due calculations, notifications, and monthly reporting for students or people living together in a shared flat or mess. The system is developed using a modern stack that includes **React.js** for the frontend, **Spring Boot** for the backend, and **MySQL** for database management. 

This system aims to simplify and automate the tracking of expenses, rent payments, and meals, reducing manual errors and improving the overall management experience.

## Features

- **User Authentication**: Secure login and registration for mess managers, members, and owners.
- **Meal Tracking**: Track daily meals, meal rate calculations, and meal participation.
- **Expense Management**: Log, track, and split shared expenses.
- **Rent Payment Management**: Manage and calculate rent payments, including due calculations.
- **Notifications**: Send notifications for due payments, meal entries, and other important updates.
- **Monthly Summary**: Generate monthly reports with meal counts, expense summaries, and payment details.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Spring Boot
- **Database**: MySQL using XAMPP
- **Version Control**: GitHub (for collaboration and version management)

## Project Structure

The project is divided into several components to ensure better maintainability and scalability.

### Folder Structure:

```bash
smart-mess-management-system/
  ├── backend/        # Spring Boot application for backend services
  ├── frontend/       # React application for the frontend UI
  ├── database/       # SQL schema, sample data, and table relationships
  ├── docs/           # Documentation, diagrams, meeting notes, etc.
  Key Modules:
Frontend:
React components to handle user interactions.
Forms for meal entry, expense tracking, and rent payment.
API integration for fetching and submitting data to the backend.

Backend:
Spring Boot REST API to handle business logic for user authentication, meal tracking, expenses, and rent management.
JPA entities and repositories for database interaction.
Controllers for routing API requests.

Database:
SQL scripts for creating and populating database tables (users, messes, meals, expenses, rent_payments, monthly_summaries, etc.).
Installation and Setup
Prerequisites

To run the project locally, you need to have the following installed:
Git: Version control system (for cloning and pushing changes to GitHub)
Node.js: Required for running the frontend
Java JDK: Required for building the Spring Boot backend
XAMPP: For running MySQL database locally
Steps to Set Up the Project

Clone the Repository:
Clone the project from GitHub:
git clone https://github.com/Ar-5060/smart-mess-management-system.git

Set Up the Backend (Spring Boot):
Navigate to the backend folder:
cd smart-mess-management-system/backend
Build and run the Spring Boot application using Maven:
mvn spring-boot:run

Set Up the Frontend (React.js):
Navigate to the frontend folder:
cd smart-mess-management-system/frontend
Install dependencies:
npm install
Run the React development server:
npm start

Set Up the Database:
Open XAMPP and start the MySQL server.
Use the database/schema.sql file to create the necessary tables and populate the database.
Running the Application

Once the backend and frontend are up and running, the application should be accessible at:
Frontend: http://localhost:3000
Backend API: http://localhost:8080/api/

Usage
User Roles:
Manager: Manages the mess, adds members, and tracks meals and expenses.
Member: Logs daily meals, tracks shared expenses, and makes rent payments.
Owner: Oversees rent collection and final settlements.

Basic Flow:
Login: Users can log in with their credentials.
Meal Entry: Members log their daily meals.
Expense Logging: Expenses are tracked and divided among all members.
Rent Payment: Rent payments are managed and members are notified.
Monthly Summary: A report summarizing all the activities for the month.

GitHub Workflow
Branching Strategy:
main: Stable version of the code, ready for deployment or production.
develop: Integration branch where all features are merged.
Personal Branches: Each team member works in their personal branch (anis-dev, rahat-dev, etc.) and merges changes into the develop branch once they are tested.

Pull Request Process:
Work on your personal branch (<your-username>-dev).
Once you finish a feature, push changes to the remote branch.
Create a pull request from your branch to develop.
After team review, merge into develop.
When develop is stable, merge into main.

Contributors
Anis: Project Lead, Backend Developer, Repository Owner
Rahat: Frontend Developer
Sourov: Database and Business Logic Developer
Amit: Backend Developer

Future Enhancements
Real-Time Notifications: Implement real-time updates for meal tracking, expenses, and rent payments.
Admin Panel: Create an admin panel for system-wide management.
Mobile App: Develop a mobile version of the application for better accessibility.
