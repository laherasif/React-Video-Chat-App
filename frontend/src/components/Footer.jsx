import { Typography , Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
const useStyle = makeStyles((theme) => ({
    box: {
        textAlign: 'center',
        height: '40px',
        backgroundColor:'gray',
        paddingTop:'25px',
        marginTop:'20px'
    },
    heading: {
        // fontsize: '20px',
        color:'white',
        fontweight: 'bold'
    }
    
}))

 const Footer = () =>{
     const classes = useStyle()
    const  today = new Date();
const  year = today.getFullYear();
     return(
         <>
         <Box className={classes.box}>
            <Typography className={classes.heading}> © Copyright {year} and Develop by Laher asif. All rights reserved.</Typography> 
         </Box>
         </>
     )
 }

 export default Footer