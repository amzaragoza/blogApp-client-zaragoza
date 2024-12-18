import './App.css';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import AddPost from './components/AddPost';
import PostDetails from './components/PostDetails';

import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import {useState, useEffect} from 'react';

function App() {
  // store user info and validate if a user is logged in on the app or not
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  //function for clearing localstorage on logout
  function unsetUser(){
    localStorage.clear();
  };

  // This fetch the user details to set as its user state.
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (localStorage.getItem('token')) {
          try {
              const response = await fetch('http://localhost:4000/users/details', {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
              });
              const data = await response.json();

              if (data._id === undefined) {
                  setUser({ id: null, isAdmin: null });
                  
              } else {
                  setUser({ id: data._id, isAdmin: data.isAdmin });
              }
          } catch (error) {
              setUser({ id: null, isAdmin: null });
          }
      } else {
          setUser({ id: null, isAdmin: null });
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <UserProvider value = {{user, setUser, unsetUser}}>
          <Router>
            <AppNavbar/>
            <Container>
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/posts" element={<Posts/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/posts/getPost/:id" element={<PostDetails />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </Container>
          </Router>
      </UserProvider>
    </>
  );
}

export default App;