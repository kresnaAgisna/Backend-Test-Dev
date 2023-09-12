import { createBrowserRouter, redirect } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import ContactForm from '../pages/ContactForm'
import ContactEdit from '../pages/ContactEdit'
import Login from '../pages/Login'
import Register from '../pages/Register'

const router = createBrowserRouter([
    {
        element: <App/>,
        loader: async() => {
            if(!localStorage.access_token) {
                return redirect('/login')
            }
            try {
                const response = await fetch('http://localhost:3000/contact', {
                    method: 'GET',
                    headers: {
                        access_token: localStorage.access_token
                    }
                })
                const data = await response.json()
                if(!response.ok) {
                    throw({name: 'error'})
                }
            } catch (error) {
                localStorage.clear()
                return redirect('/login')
            }
            return null
        },
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/add',
                element: <ContactForm/>
            },
            {
                path: '/edit/:id',
                element: <ContactEdit/>
            }
        ],
    },
    {
        path: '/login',
        loader: () => {
            if(localStorage.access_token) {
                return redirect("/")
            }
            return null
        },
        element: <Login/>
    },
    {
        path: '/register',
        loader: () => {
            if(localStorage.access_token) {
                return redirect("/")
            }
            return null
        },
        element: <Register/>
    }
])

export default router