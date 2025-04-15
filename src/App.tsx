import { ThemeProvider } from './context/ThemeContext';
import { JournalProvider } from './context/JournalContext';
import Header from './components/ui/Header';
import JournalPage from './components/features/JournalPage';
import NeuralBackground from './components/ui/NeuralBackground';

function App() {
  return (
    <ThemeProvider>
      <JournalProvider>
        <div className="app-container">
          <NeuralBackground />
          <Header title="NeuroSpace" />
          <main className="main-content">
            <JournalPage />
          </main>
          <footer className="app-footer">
            <p>NeuroSpace &copy; {new Date().getFullYear()} - Your Personal Mental Wellness Journal</p>
          </footer>
        </div>
      </JournalProvider>
    </ThemeProvider>
  );
}

export default App;
