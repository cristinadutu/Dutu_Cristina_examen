import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Article from './components/article';
import Reference from './components/reference';

function App() {
  return (
    <Router>
      <Routes>
       <Route path='/' element={<Article/>}></Route>
       <Route path='/:articleId/references' element={<Reference/>}></Route>
      </Routes>
    </Router>
   );
}

export default App;
