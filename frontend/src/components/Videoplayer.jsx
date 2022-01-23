import { useContext } from 'react'
import { Grid, Container, Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { SocketContext } from '../socket'
const useStyle = makeStyles((theme) => ({
    root: {
        marginTop: '20px'
    },
    padding: {
        padding: '20px'
    },
    video: {
        width: '500px',
        [theme.breakpoints.down('md')]: {
            width: '450px',
        },
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    }
}))

function Videoplayer() {
    const classes = useStyle()
    const { myVideo, userVideo, stream, call, name, callAccpted, callEnded } = useContext(SocketContext)
    return (
        <Container>
            <Grid container className={classes.root} spacing={3}>
                <Grid item xs={12} md={6} >
                    {stream && (
                        <Paper className={classes.padding}>
                            <Typography varient="h4" gutterButtom>{name || "Name"}</Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                        </Paper>
                    )
                    }
                </Grid>
                <Grid item xs={12} md={6}>
                    {callAccpted && !callEnded && (
                        <Paper className={classes.padding}>
                            <Typography varient="h4">{call.name}</Typography>
                            <video playsInline  ref={userVideo} autoPlay className={classes.video} />
                        </Paper>
                    )
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Videoplayer
