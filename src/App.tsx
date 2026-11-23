import { useCallback, useEffect, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { CloudSyncBar } from './components/CloudSyncBar';
import { ContactPage } from './components/ContactPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Footer } from './components/Footer';
import { GalleryPage } from './components/GalleryPage';
import { HomePage } from './components/HomePage';
import { Navbar } from './components/Navbar';
import { PpdbPage } from './components/PpdbPage';
import { ProgramsPage } from './components/ProgramsPage';
import { PhotoProvider } from './context/PhotoContext';
import { NAV_ITEMS, type PageId } from './data/mdaContent';

const VALID_PAGES = new Set<PageId>(NAV_ITEMS.map((item) => item.id));

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '').toLowerCase() as PageId;
  return VALID_PAGES.has(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => getInitialPage());

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const next = getInitialPage();
      setCurrentPage(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <ErrorBoundary>
      <PhotoProvider>
        <div className="min-h-screen flex flex-col bg-[#FAFBFA] text-[#0F1F1C]">
          <Navbar currentPage={currentPage} onNavigate={navigate} />

          <main className="flex-1">
            {currentPage === 'home' && <HomePage onNavigate={navigate} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'ppdb' && <PpdbPage />}
            {currentPage === 'programs' && <ProgramsPage onNavigate={navigate} />}
            {currentPage === 'gallery' && <GalleryPage />}
            {currentPage === 'contact' && <ContactPage />}
          </main>

          <Footer onNavigate={navigate} />
          <FloatingWidgets onNavigate={navigate} />
          <CloudSyncBar />
        </div>
      </PhotoProvider>
    </ErrorBoundary>
  );
}
