import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root.jsx'; 

const Homepage = () => {
  return <Root pageName='home' />;
}

const Explorepage = () => { 
  return <Root pageName='explore' />;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />
    },
    {
      path: "/explore",
      element: <Explorepage />
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;