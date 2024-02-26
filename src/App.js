import './App.css';
import React from 'react';
import Navbar from './component/Navbar';
import TextForm from './component/TextForm' ;
import About from './component/About';
import Alert from './component/Alert';

import { useState } from 'react';
import Contact from './component/Contact'

import { BrowserRouter, Route, Routes } from "react-router-dom";



function App() {

  const[alert,SetAlert]=useState(null);
  const[backgroundColo,setBackgroundColo]=useState('light');
 
  const showAlert=(message,type)=>{
    SetAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      SetAlert(null);
    },1700);
  }
  const removeBodyClasses=()=>{
    document.body.classList.remove('bg-light')
    document.body.classList.remove('bg-dark')
    document.body.classList.remove('bg-warning')
    document.body.classList.remove('bg-success')
    document.body.classList.remove('bg-primary')
    document.body.classList.remove('bg-light')
  }
  const toggleMode = (cls) => {
    removeBodyClasses();
    document.body.classList.add('bg-' + cls);
    showAlert(`${cls} mode has been enabled`, 'success');
  };
    const toggleColor=()=>{
      if(backgroundColo==='light'){
        setBackgroundColo('dark');
        document.body.style.backgroundColor='#032845';
        

        showAlert("dark mode has been enabled", "success")
        }
        else{
          setBackgroundColo('light');
          document.body.style.backgroundColor='white';
          showAlert("light mode has been enabled", "success")
        }
     }
 
  return (
    <> 
 <Navbar title="Parmarth" backgroundColo={backgroundColo}  toggleMode={toggleMode} toggleColor={toggleColor}/>
 
 <Alert alert={alert} backgroundColo={backgroundColo}/>
 
 <div className="container my-3">
  <BrowserRouter>
  <Routes>
          <Route path="/About" element={<About  backgroundColo={backgroundColo}  showAlert={showAlert} toggleColor={toggleColor}/>}/>
          <Route path="/" element={<TextForm backgroundColo={backgroundColo} showAlert={showAlert} toggleColor={toggleColor} />} />
          <Route path="/Contact" element={<Contact/>}/>  
          </Routes>
    </BrowserRouter>
 </div>

</>   
  );
}  



export default App;
