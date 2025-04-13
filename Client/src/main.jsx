import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Layout from './Layout.jsx'

const router = createBrowserRouter([
    {
        path: '',
        element: <Layout/>,
        errorElement: <h1>No screen found</h1>,
        children: [
            {
                path: '',
                element: <Home/>
            },
            {
                path: 'about',
                element: <About/>
            },
          
            {
                path: '/contact',
                element: <Contact/>
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)