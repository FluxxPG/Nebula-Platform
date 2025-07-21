import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n'; // Import i18n configuration
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apolloClient.ts'

// Add global CSS custom properties for themes
const style = document.createElement('style');
style.textContent = `
  :root {
    --transition-theme: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
  
  .light-theme {
    --bg-primary: rgba(255, 255, 255, 0.15);
    --bg-secondary: rgba(255, 255, 255, 0.08);
    --text-primary: rgba(255, 255, 255, 0.95);
    --text-secondary: rgba(255, 255, 255, 0.75);
    --border-light: rgba(255, 255, 255, 0.25);
  }
  
  .dark-theme {
    --bg-primary: rgba(0, 0, 0, 0.4);
    --bg-secondary: rgba(0, 0, 0, 0.25);
    --text-primary: rgba(255, 255, 255, 0.95);
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border-light: rgba(255, 255, 255, 0.15);
  }
  
  * {
    transition: var(--transition-theme);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>
);