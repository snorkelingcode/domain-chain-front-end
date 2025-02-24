import { useState, type FC, useEffect } from 'react';
import ThirdwebProviderWrapper from './components/ThirdwebProviderWrapper';
import BuyerInterface from './components/BuyerInterface';
import Dashboard from './components/Dashboard';
import WalletButton from './components/WalletButton';
import { 
  Alert, 
  AlertDescription 
} from './components/ui/Alerts';
import { 
  AlertCircle 
} from 'lucide-react';
import { useAddress } from '@thirdweb-dev/react';

const AppContent: FC = () => {
  const [mode, setMode] = useState<'buy' | 'dashboard'>('buy');
  const [error, setError] = useState<string | null>(null);
  const address = useAddress();
  
  // Update mode if user disconnects
  useEffect(() => {
    if (!address && mode === 'dashboard') {
      setMode('buy');
    }
  }, [address, mode]);

  const handleSignOut = () => {
    setMode('buy');
  };

  const displayError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        {error && (
          <div className="absolute top-4 left-0 right-0 z-50 px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex flex-col items-center py-3 sm:py-6">
          {/* Mobile Header */}
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 sm:hidden relative px-4">
            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            <div className="w-full">
              <WalletButton 
                onDashboard={() => setMode('dashboard')}
                onSignOut={handleSignOut}
              />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex w-full relative justify-center items-center">
            <div className="absolute left-0" />

            <div className="flex-shrink-0">
              <img 
                src="/LogoHeader_Transparent_5972X_1080Y.png" 
                alt="Domain Chain Logo" 
                className="h-16 w-auto"
              />
            </div>

            <div className="absolute right-0 flex items-center gap-2">
              <WalletButton 
                onDashboard={() => setMode('dashboard')}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main>
          {mode === 'dashboard' ? (
            <Dashboard onBack={() => setMode('buy')} />
          ) : (
            <BuyerInterface />
          )}
        </main>
      </div>
    </div>
  );
};

const App: FC = () => {
  return (
    <ThirdwebProviderWrapper>
      <AppContent />
    </ThirdwebProviderWrapper>
  );
};

export default App;