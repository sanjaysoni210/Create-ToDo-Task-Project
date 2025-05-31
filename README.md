# Flask Todo API 
A simple RESTful API built with Flask that allows users to register, log in, and manage todo tasks.  
Each user belongs to an organization, and todos are shared within that organization.


---

## 🚀 Features

- User Authentication (JWT-based)
- Organization-based todo sharing
- Create / Read / Update / Delete todos
- Users can only update or delete **their own** todos
- All users in the same organization can **view** all todos

---

## Technologies Used

- Python 3
- Flask
- Flask SQLAlchemy
- Flask-JWT-Extended
- SQLite (for development)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sanjaysoni210/ToDO_Flask_API.git
   cd ToDO_Flask_API
