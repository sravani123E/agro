# Fresh Market - Online Grocery Store

A full-stack e-commerce application for buying fresh fruits and vegetables online.

## Features

- User Authentication (Login/Register)
- Product Browsing and Search
- Shopping Cart Management
- Order Placement and Tracking
- Admin Dashboard
- Responsive Design

## Tech Stack

### Frontend
- React.js
- TypeScript
- Material-UI
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fresh-market.git
cd fresh-market
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fresh-market
JWT_SECRET=your-secret-key-here
```

5. Start the development servers:

Backend:
```bash
npm run server
```

Frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
fresh-market/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── contexts/      # Context providers
│       ├── types/         # TypeScript types
│       └── App.tsx        # Main application component
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 