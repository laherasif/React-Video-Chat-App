import { useContext } from 'react'
import { Paper, Typography, Button, TextField, Grid, Container  } from '@material-ui/core'
import { Phone, Assignment, PhoneDisabled } from '@material-ui/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import { SocketContext } from '../socket'
let useStyle = makeStyles((theme) => ({
    container: {
      marginTop:'20px'
    },
    paper:{
        display:'flex',
        flexDirection:'column'
    },
    account_head:{
        padding:'10px',
        fontSize:'20px',
        fontWeight:'bold'
    },
    account_name:{
        maxWidth:'400px',
        margin:'auto'
    }
}))
function Information() {
    const classes = useStyle()
    const { name, setName, me, } = useContext(SocketContext)
    return (
        <Container>
            <Grid container className={classes.container} spacing={3}>
                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                    <Typography className={classes.account_head}>Account Information</Typography>
                    <TextField label="Name"  className={classes.account_name} value={name} onChange={(e) => setName(e.target.value)} />
                    <CopyToClipboard text={me}>
                        <Button className={classes.account_btn} varient="contained" color="primary" startIcon={<Assignment />} fullwidth >Copy Your Id </Button>
                    </CopyToClipboard>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} ></Grid>
            </Grid>
        </Container>
    )
}

export default Information
