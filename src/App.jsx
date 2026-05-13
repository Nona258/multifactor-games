import { HomePage } from './components/pages/HomePage';
import { UIProvider } from './store/UIContext';
import './styles/farmingTheme.css';

function App() {
  return (
    <UIProvider>
      <HomePage />
    </UIProvider>
  );
}

export default App;
