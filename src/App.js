import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Portfolio from './components/mainapp';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        
      </Routes>
    </Router>
  );
}

export default App;
