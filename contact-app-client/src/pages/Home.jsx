import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Contact from "../components/Contact"

const Home = () => {
    const navigate = useNavigate()
    const [contacts, setContacts] = useState([])
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
    const handleChange = (event) => {
        setQuery(event.target.value)
    }
    
    const fetchContact = (filter) => {
        let url = 'http://localhost:3000/contact'
        if(filter) {
            url = 'http://localhost:3000/contact?' + 'query=' + filter
        }
        fetch(url, {
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
            setContacts(data)
            setQuery('')
            setLoading(false)
       })
       .catch( error => {
            console.log(error.message)
       })
    }
    useEffect(() => {
        fetchContact()
    }, [])

    if(loading) {
        return <h3>Loading....</h3>
    }

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{width: "100vw", height: "100vh"}}>
            <div className="d-flex flex-column shadow-main" style={{width: "30%", height: "75%"}}>
                <div className="d-flex justify-content-between px-5 align-items-center bg-success text-white" style={{height: "10%", width: "100%"}}>
                    <i className="bi bi-person-circle fs-1"></i>
                    <span className="fs-3 hoverable" onClick={handleLogout}>Logout</span>
                </div>
                <div className="w-100 d-flex justify-content-between align-items-center p-5 border-bottom">
                    <h3 className="fs-2 text-success fw-bold">Contacts</h3>
                    <div className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search by name" onChange={handleChange} value={query}/>
                        <button className="btn btn-outline-success" type="submit" onClick={() => fetchContact(query)}>Search</button>
                    </div>
                    <i className="bi bi-plus-circle text-success fs-1 hoverable" onClick={() => navigate('add')}></i>
                </div>
                {
                    contacts.map(contact => {
                        return <Contact key={contact.id} contact={contact} fetchContact={fetchContact}/>
                    })
                }
            </div>
        </div>
    )
}

export default Home