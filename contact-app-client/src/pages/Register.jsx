import { useState } from "react"
import ButtonLogin from "../components/ButtonLogin"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Register = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const handleChange = (event) => {
        setInput({...input, [event.target.name]: event.target.value})
    }

    const handleRegister = (event) => {
        event.preventDefault()
        fetch('http://localhost:3000/register', {
        method: "POST",
        headers: {
            access_token : localStorage.access_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
       })
       .then(response => {
            if(!response.ok) {
                return response.json().then(error => {throw new Error(error.message)})
            }
            return response.json()
       })
       .then(data => {
            Swal.fire({
                position: 'top',
                title: 'Changes Saved',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/login')
       })
       .catch( error => {
            Swal.fire({
                position: 'top',
                title: 'Changes Saved',
                showConfirmButton: false,
                timer: 1500
            })
       })
    }
   
    return (
        <div className="container-fluid d-flex align-items-center justify-content-center flex-column gap-5" style={{height: "100vh"}}>
            <h1 className="text-success display-2 fw-bold">Contact App</h1>
            <div className="rounded-4 shadow-main d-flex align-items-center justify-content-center flex-column" style={{height: '50vh', width: '25vw'}}>
                <h3 className="mt-5 fw-bolder text-success">Sign in with your account</h3>
                <form className="w-100 h-100 p-5 " onSubmit={handleRegister}>
                    <div className="mb-3 w-100">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" name="email" onChange={handleChange} value={input.email}/>
                    </div>
                    <div className="mb-5 w-100">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" onChange={handleChange} value={input.password}/>
                    </div>
                    <ButtonLogin title={'Register'}/>
                </form>
            </div>
        </div>
    )
}

export default Register