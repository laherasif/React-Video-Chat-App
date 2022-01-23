import React from 'react'
import { AppBar , Typography , } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyle = makeStyles({
    appbar:{
        height: '60px',
    },
    heading:{
        textAlign :'center',
        fontWeight : "bold"

    }
})

function Navbar() {
    const classes = useStyle()
    return (
        <>
        <AppBar position="static" className={classes.appbar} >
          <Typography varient="h4" className={classes.heading}>Video Chat App </Typography>
        </AppBar>
            
        </>
    )
}

export default Navbar
