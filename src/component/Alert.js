import React from 'react'

function Alert(props) {
  return (
    <div style={{height:'50px'}}>
  {props.alert &&  <div className={`alert  alert-dismissible fade show `} role="alert" style={{backgroundColor:props.backgroundColo==='dark'?'#032845':'orange', color:props.backgroundColo==='dark'?'white':'black', position:'relative'}}>
    <strong>{props.alert.msg}</strong>
    
  </div>}
  </div>
  )
}

export default Alert
