import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ButtonLogin from "../components/ButtonLogin"
import Swal from "sweetalert2"

const ContactForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [input, setInput] = useState({
        nama: "",
        email: "",
        phoneNumber: "",
        UserId: 0,
    })
    const handleChange = (event) => {
        setInput({...input, [event.target.name]: event.target.value})
    }

    const handleEdit = (event) => {
        event.preventDefault()
        fetch('http://localhost:3000/contact/' + id, {
        method: "PUT",
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
            navigate('/')
       })
       .catch( error => {
        Swal.fire({
            position: 'top',
            title: error.message,
            showConfirmButton: false,
            timer: 1500
        })
       })
    }

    const fetchDetail = () => {
        fetch('http://localhost:3000/contact/' + id, {
            method: "GET",
            headers: {
                access_token: localStorage.access_token
            }
        })
        .then(response => {
            if(!response.ok) {
                return response.json().then(error => {throw new Error(error.message)})
            }
            return response.json()
        })
        .then(data => {
           setInput(data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchDetail()
    }, [])

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{width: "100vw", height: "100vh"}}>
            <div className="d-flex flex-column shadow-main" style={{width: "30%", height: "75%"}}>
                <div className="d-flex px-5 align-items-center bg-success text-white gap-3" style={{height: "10%", width: "100%"}}>
                     <i className="bi bi-arrow-left fs-1 hoverable" onClick={() => navigate(-1)}></i>
                     <span className="fs-2 fw-bold">Edit Contact</span >
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center p-5 text-success" style={{height: "90%", width: "100%"}}>
                    <i className="bi bi-person-circle display-1"></i>
                    <form className="w-100 h-100 p-5 " onSubmit={handleEdit}>
                    <div className="mb-3 w-100">
                        <label className="form-label fw-bold fs-5">Nama</label>
                        <input type="nama" className="form-control" name="nama" onChange={handleChange} value={input.nama}/>
                    </div>
                    <div className="mb-3 w-100">
                        <label className="form-label fw-bold fs-5">Email</label>
                        <input type="email" className="form-control" name="email" onChange={handleChange} value={input.email}/>
                    </div>
                    <div className="mb-5 w-100">
                        <label className="form-label fw-bold fs-5">Phone Number</label>
                        <input type="phoneNumber" className="form-control" name="phoneNumber" onChange={handleChange} value={input.phoneNumber}/>
                    </div>
                    <ButtonLogin title={'Save'}/>
                </form>
                </div>
            </div>
        </div>
    )
}

export default ContactForm