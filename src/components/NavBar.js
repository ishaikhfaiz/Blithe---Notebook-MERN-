import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  let history = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    history('/login')
  }
  let location = useLocation();
  useEffect(() => { }, [location]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Blithe</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>
        </div>
        {!localStorage.getItem('token') ? <form className="form-inline my-2 my-lg-0">
          <Link className='btn btn-primary mx-1' to="/login" role="button">Login</Link>
          <Link className='btn btn-primary mx-1' to="/signup" role="button">Signup</Link>
        </form> : <button onClick={handleLogout} className='btn btn-primary'>Logout</button>}
      </div>
    </nav>
  )
}

export default NavBar