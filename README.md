# 🎓 College Management System

A complete **College Management System** built with **ASP.NET Core Web API** for managing student admissions, enrollment, examinations, and financial operations in an academic institution.

---

## 🚀 Features

- **Student Admissions** – Handle applications and student data registration.  
- **Authentication & Authorization** – Secure login and user management using JWT tokens.  
- **Enrollment Management** – Manage courses, subjects, and class assignments.  
- **Exam Management** – Create, update, and record exam information and results.  
- **Financial Management** – Track student fees, payments, and other financial transactions.  
- **Item Inventory** – Manage and monitor resources and college items.  
- **Online Application Portal** – Allow students to apply digitally and track their application status.

---

## 🧩 Project Structure

```
college_management_system/
│
├── api/
│   ├── Controllers/           # API endpoints (Admissions, Auth, Enrollment, etc.)
│   ├── Data/                  # Entity Framework database context
│   ├── Migrations/            # EF Core migrations
│   ├── appsettings.json       # App configuration
│   ├── Program.cs             # Application entry point
│   ├── college_management_system.csproj
│   └── crud.db                # Local SQLite database (for testing)
│
├── .github/workflows/         # CI/CD with GitHub Actions
├── .vscode/                   # VS Code project settings
├── college_management_system.sln
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [SQLite](https://www.sqlite.org/download.html) (or configure SQL Server in `appsettings.json`)
- Visual Studio or VS Code

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/college_management_system.git
   cd college_management_system/api
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run database migrations:
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
5. Open in browser or API client:
   ```
   https://localhost:5001/swagger
   ```

---

## 🧠 Tech Stack

- **Backend:** ASP.NET Core Web API  
- **Database:** SQLite / SQL Server (configurable)  
- **ORM:** Entity Framework Core  
- **Authentication:** JWT (JSON Web Token)  
- **CI/CD:** GitHub Actions  

---

## 🧪 API Endpoints

| Controller | Description |
|-------------|-------------|
| `/api/admissions` | Manage student admission data |
| `/api/auth` | Login, registration, and JWT authentication |
| `/api/enrollment` | Course and subject enrollment |
| `/api/exam` | Manage exams and grades |
| `/api/financial` | Fee and payment management |
| `/api/items` | College inventory management |
| `/api/onlineapplication` | Submit and track online applications |

---

## 🧑‍💻 Developer Notes

- The default database uses **SQLite** (`crud.db`) for simplicity.  
- You can change the connection string in `appsettings.json` to use SQL Server or MySQL.  
- Swagger is enabled by default for easy API testing.  

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork this repository, submit issues, or open pull requests.

---

## 💬 Contact

**Developer:** Franz Alverio  
📧 Email: franz.alveriobiz@aol.com  
🌐 GitHub: [Valiyantt](https://github.com/Valiyantt)
