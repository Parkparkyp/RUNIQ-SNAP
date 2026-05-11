import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("RUNIQ App: Starting render process...");
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("RUNIQ App: Root element found, rendering...");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("RUNIQ App: Root element NOT found!");
}
