# Quest Management Frontend Application

A modern React-based frontend application for the Gaming Platform. This application provides user authentication, quest management, and an interactive gaming interface.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

### User Features
- User Authentication (login, signup, logout)
- Profile Management
- Quest Discovery and Participation
- Quest Progress Tracking
- Leaderboard View
- Real-time Updates

### Admin Features
- Quest Creation and Management
- User Management
- Analytics Dashboard
- System Configuration

### Technical Features
- Protected Routes for Different User Roles
- Responsive Design
- Real-time Updates
- Offline Support
- Error Handling
- Loading States

## Technology Stack

- **Core Framework**: React 18+
- **Language**: TypeScript 4.x
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Styling**: CSS Modules + Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **Package Manager**: npm/yarn


## Prerequisites

- Node.js 14+ (LTS recommended)
- npm 6+ or yarn 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running (see backend documentation)


## Installation

1. Clone the repository:


```shellscript
git clone https://github.com/your-org/gaming-frontend.git
cd gaming-frontend
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

3. Create environment file:


```shellscript
cp .env.example .env
```

4. Update environment variables in `.env`:


```plaintext
VITE_API_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
```

5. Start the development server:


```shellscript
npm run dev
# or
yarn dev
```

## Configuration

### Feature Flags

Feature flags can be configured in `src/config/features.ts`:

## Available Scripts

| Command | Description
|-----|-----|-----
| `npm run dev` | Start development server
| `npm run build` | Build for production
| `npm run test` | Run tests
| `npm run lint` | Lint code
| `npm run format` | Format code


## Key Components

### Authentication Components

#### `AuthProvider`

```typescript
// src/context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### Protected Routes

```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

### Quest Components

#### `QuestCard`

```typescript
// src/components/QuestCard.tsx
interface QuestCardProps {
  quest: Quest;
  onJoin: (questId: string) => void;
  onComplete: (questId: string) => void;
}
```

## State Management

The application uses React Context for state management:

```typescript
// src/context/QuestContext.tsx
interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  error: Error | null;
  fetchQuests: () => Promise<void>;
  joinQuest: (questId: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
}
```

## Routing

```typescript
// src/App.tsx
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/quests" element={<QuestList />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  </Router>
);
```

## API Integration

### API Service Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Quest Service Example

```typescript
// src/services/questService.ts
export const questService = {
  getQuests: () => api.get('/quests'),
  getQuest: (id: string) => api.get(`/quests/${id}`),
  createQuest: (data: CreateQuestDTO) => api.post('/quests', data),
  joinQuest: (id: string) => api.post(`/quests/${id}/join`),
  completeQuest: (id: string) => api.post(`/quests/${id}/complete`),
};
```

## Styling

The application uses CSS Modules with Tailwind CSS for styling:

```css
/* src/styles/QuestCard.module.css */
.card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.title {
  @apply text-xl font-bold text-gray-800;
}

.description {
  @apply text-gray-600 mt-2;
}
```

## Testing

### Component Testing Example

```typescript
// src/components/QuestCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestCard } from './QuestCard';

describe('QuestCard', () => {
  it('renders quest information correctly', () => {
    const quest = {
      id: '1',
      title: 'Test Quest',
      description: 'Test Description',
    };
    
    render(<QuestCard quest={quest} />);
    
    expect(screen.getByText('Test Quest')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

## Deployment

1. Build the application:


```shellscript
npm run build
```

2. The build output will be in the `dist` directory.
3. Deploy to Vercel:


```shellscript
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`