import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { AppRouter } from './routes/AppRouter';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black-900">
        <Navbar />
        <div className="flex-1">
          <AppRouter />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
