import { useContext , useState } from 'react'
import { Paper, Typography, Button, TextField, Grid, Container  , Box } from '@material-ui/core'
import { Phone, Assignment, PhoneDisabled } from '@material-ui/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { makeStyles } from '@material-ui/core/styles'
import { SocketContext } from '../socket'
let useStyle = makeStyles((theme) => ({
    container: {
        marginTop: '20px'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    account_head: {
        fontSize: '20px',
        fontWeight: 'bold'
    },
    account_name: {
        width: '400px',
        margin: 'auto'
    },
    account_btn: {
        width: '67%',
        marginTop: '20px',
        marginBottom: '10px',
    },
    
}))
function Information() {
    const classes = useStyle()
    const { name, setName, me,  callUser , leaveCall , call , callAccpted , callEnded , answerCall } = useContext(SocketContext)
    const [ callToUser , setCallToUser] = useState('')
   console.log("satte" , callToUser);
   
    return (
        
        <Container>
            <Grid container className={classes.container} spacing={3}>
                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                        <Typography className={classes.account_head}>User Account Information</Typography>
                        <TextField label="Name" className={classes.account_name} value={name} onChange={(e) => setName(e.target.value)} />
                        <CopyToClipboard text={me}>
                            <Button className={classes.account_btn} variant="contained" color="primary" startIcon={<Assignment />} fullwidth >Copy Your Id </Button>
                        </CopyToClipboard>
                        { call.isReceivingCall && !callAccpted && (                        
                        <Box>
                        <Button className={classes.account_btn} variant="contained" color="primary" onClick={answerCall} fullwidth >Answer</Button>
                        </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} >
                    <Paper className={classes.paper}>
                        <Typography className={classes.account_head}>Make a Call With Friend </Typography>
                        <TextField label="Id of Friend" className={classes.account_name} value={callToUser} onChange={(e) => setCallToUser(e.target.value)} />
                        {callAccpted && !callEnded ? (
                <Button variant="contained" className={classes.account_btn} color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} >
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" className={classes.account_btn} color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(callToUser)} >
                  Call
                </Button>
              )}
                        
                    </Paper></Grid>
            </Grid>
        </Container>
    )
}

export default Information
