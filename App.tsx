import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Schedule from './pages/Schedule';

type Route = 'dashboard' | 'board' | 'team' | 'reports' | 'schedule';

function App() {
  const [activeRoute, setActiveRoute] = useState<Route>('dashboard');

  const renderPage = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'board':
        return <Board />;
      case 'team':
        return <Team />;
      case 'reports':
        return <Reports />;
      case 'schedule':
        return <Schedule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeRoute={activeRoute} 
        onRouteChange={setActiveRoute} 
      />
      <main className="ml-64 flex-1 p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;