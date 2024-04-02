import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./Pages/HomePage.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Item} from "./Pages/Item.jsx";

const router = createBrowserRouter([
    {path: '/', element: <HomePage/>},
    {path: '/Items/:itemId', element: <Item/>}



    ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
