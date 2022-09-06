import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  let history = useNavigate()
  const [credentials, setcredentials] = useState({ name:"", email: "", password: "", cpassword:"" })
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password})
    });
    const json = await response.json()
    if (json.success) {
      // Redirect
      localStorage.setItem('token', json.authtoken)
      history("/")
      props.showAlert("Account Created Successfully", "success")
    }
    else {
      props.showAlert("Invalid Credentials", "danger")
    }
  }

  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='mt-3'>
      <h2>SignUp To Continue</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className='form-label'>Full Name</label>
          <input type="text" className="form-control" id="name" name='name' value={credentials.name} aria-describedby="emailHelp" placeholder="Enter Name" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className='form-label'>Email address</label>
          <input type="email" className="form-control" id="email" name='email' value={credentials.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className='form-label'>Password</label>
          <input type="password" className="form-control" id="password" name='password'
            value={credentials.password} placeholder="Password" onChange={onChange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className='form-label'>Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword'
            value={credentials.cpassword} placeholder="Confirm Password" onChange={onChange} minLength={5} required/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup