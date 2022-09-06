import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    let history = useNavigate()
    const [credentials, setcredentials] = useState({email:"",password:""})
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        if (json.success){
            // Redirect
            localStorage.setItem('token', json.authtoken)
            props.showAlert("Logged In Successfully", "success")
            history("/")

        }
        else{
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-3'>
            <h2>Login To Continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className='form-label'>Email address</label>
                    <input type="email" className="form-control" id="email" name='email' value={credentials.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="mb-3">
                    <label htmlFor="Password" className='form-label'>Password</label>
                    <input type="password" className="form-control" id="password" name='password'
                        value={credentials.password} placeholder="Password" onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login