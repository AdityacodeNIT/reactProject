import React from 'react'
import './Navbar.css' 

export default function Navbar(props){
    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark " data-bs-theme={`${props.backgroundColo}`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/">{props.title}</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/About">About</a>
              </li>
             
              <li className="nav-item">
                <a className="nav-link active "  href='/Contact'>Contact</a>
              </li>
            </ul>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" onClick={()=>{props.toggleColor('dark')}} role="switch" id="flexSwitchCheckDefault"/>
                <label className={`form-check-label text-${props.backgroundColo==='light'?'black':'white'}`} htmlForfor="flexSwitchCheckDefault" >{props.backgroundColo}</label>
              </div>
            <div className="color-palette" style={{display:'flex'}}>
                <div className="bg-primary rounded mx-2"  onClick={()=>{props.toggleMode('primary')}} style={{height:'30px', width:'30px'}}> </div> 
                <div className="bg-success rounded mx-2"  onClick={()=>{props.toggleMode('success')}} style={{height:'30px', width:'30px'}}> </div>
                <div className="bg-warning rounded mx-2"  onClick={()=>{props.toggleMode('warning')}} style={{height:'30px', width:'30px'}}> </div>
              </div>
          </div>
        </div>
      </nav>   
    )
}

       