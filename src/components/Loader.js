import {CircularProgress} from '@material-ui/core';
import React from "react"
function Loader(){
    return (
      <div style={{textAlign:'center',padding:'2rem'}}>
        <CircularProgress/>
      </div>
    )
  }

export default Loader;