import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children, title = 'محول الروابط إلى رموز QR' }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark', 'text-white');
    } else {
      document.body.classList.remove('bg-dark', 'text-white');
    }
  }, [darkMode]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="تحويل الروابط إلى رموز QR بسهولة وسرعة" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} mb-4`}>
        <div className="container">
          <a className="navbar-brand" href="#">
            QR Generator
          </a>
          <button
            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
          </button>
        </div>
      </nav>
      <main className={`container py-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
        {children}
      </main>
      <footer className={`${darkMode ? 'bg-dark text-white' : 'bg-light'} text-center py-3 mt-4`}>
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} برمجة يوسف حُميد</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;