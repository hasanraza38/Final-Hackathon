// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//     <App />
// )
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import LoanPage from './pages/LoanPage.jsx'
import ApplicationPage from './pages/Application.jsx'
import DashboardPage from './pages/Dashboard.jsx'


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
                path: '/loan-page',
                element: <LoanPage/>
            },
            {
                path: '/application',
                element: <ApplicationPage/>
            },
            {
                path: '/dashboard',
                element: <DashboardPage/>
            },
            // {
            //     path: 'about',
            //     element: <About/>
            // },
          
            // {
            //     path: '/contact',
            //     element: <Contact/>
            // }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)