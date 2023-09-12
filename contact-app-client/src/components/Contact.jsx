import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Contact = ({contact, fetchContact}) => {
    const navigate = useNavigate()

    const handleDelete = () => {
        fetch('http://localhost:3000/contact/' + contact.id, {
            method: "delete",
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
            Swal.fire({
                position: 'top',
                title: 'Contact Deleted',
                showConfirmButton: false,
                timer: 1500
            })
            fetchContact()
        })
        .catch(error => {
            Swal.fire({
                position: 'top-end',
                title: error.message,
                showConfirmButton: false,
                timer: 1500
            })
        })
    }


    return (
        <div className="w-100 d-flex justify-content-between align-items-center p-5 border-bottom" style={{height:"12%"}}>
            <div className="d-flex gap-4 align-items-center">
                <i className="bi bi-person-circle fs-1"></i>
                <div className="d-flex flex-column">
                    <span className="fw-bold fs-5">{contact.nama}</span>
                    <span>{contact.email}</span>
                    <span>{contact.phoneNumber}</span>
                </div>
            </div>
            <div className="d-flex gap-4">
                <i className="bi bi-x-square-fill text-danger fs-3 hoverable" onClick={handleDelete}></i>
                <i className="bi bi-pencil-fill text-success fs-3 hoverable" onClick={() => navigate(`/edit/${contact.id}`)}></i>
            </div>
        </div>
    )
}

export default Contact