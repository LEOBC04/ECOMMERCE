import './App.css';
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/home.jsx';
import NavBar from './components/NavBar/navBar.jsx';
import Shopping from './components/Shopping/shopping.jsx';
import User from './components/User/user.jsx';
import WishList from './components/WishList/wishList.jsx';
import AddBook from './components/BookForm/addBook.jsx';
import GiftCard from './components/GiftCard/giftCard';
import GitftPayment10 from './components/GiftCard/gitftPayment10';
import { ToastContainer } from 'react-toastify'



function App() {
  return (
    <div className="App">
    <ToastContainer />
     <Routes>
      <Route path='/' element={< NavBar />}>
        <Route path="/" element={< Home />} />
        <Route path='shopping' element={< Shopping />} />
        <Route path='user' element={< User />} />
        <Route path='user/newBook' element={< AddBook />} />
        <Route path='wish' element={< WishList />} />
        <Route path='gift' element={< GiftCard />} />
      </Route>
      <Route path='/payment10' element={ < GitftPayment10 /> }/>
     </Routes>
    </div>
  ); 
}

export default App;
