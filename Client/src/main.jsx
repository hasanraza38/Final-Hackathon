import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import LoanPage from './pages/LoanPage.jsx'
import ApplicationPage from './pages/Application.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import { isAuthenticated } from './utils/auth.js'

const ProtectedRoute = ({ children }) => {
    const isAuth = isAuthenticated()

    if (!isAuth) {
        return <Navigate to="/loans" replace />
    }

    return children
}

const router = createBrowserRouter([
    {
        path: '',
        element: <Layout />,
        errorElement: <h1>No screen found</h1>,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: '/loan-page',
                element: <LoanPage />
            },
            {
                path: '/application',
                element:
                    <ProtectedRoute>
                        <ApplicationPage />
                    </ProtectedRoute>
            },
            {
                path: '/dashboard',
                element: <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
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
    <RouterProvider router={router} />
)