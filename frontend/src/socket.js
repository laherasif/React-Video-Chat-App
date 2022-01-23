import { createContext, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const socket = io('http://localhost:5000/')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {

    const [stream, setStream] = useState()
    const [me, setMe] = useState('')
    const [call, setCall] = useState({})
    const [callaccpted, setCallaccpted] = useState({})
    const [callEnd, setCallEnd] = useState({})
    const [name, setName] = useState('')

    const myVideo = useRef()
    const userVideo = useRef()
    const currentRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((userStream) => {
                setStream(userStream)
                myVideo.current.srcObject = userStream

            });

        socket.on('me', (id) => setMe(id))
                
        socket.on('callUser', ({ from, callerName, signal }) => {
            setCall({ isRecieveCall: true, from, callerName, signal })
        });

    }, [])


    const callAnswer = () => {
        setCallaccpted(true)
        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on('signal ', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        currentRef.current = peer;
    }


    const callUser = (id) => {

        const peer = new Peer({ initiator: true, trickle: false, stream })
        peer.on('signal ', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        socket.on('callacepted', (signal) => {
            setCallaccpted(true)
            peer.signal(signal)
        })

        currentRef.current = peer;


    }

    const leaveCall = () => {
        setCallEnd(true)
        currentRef.current.distroy()

        window.location.reload()

    }

    return (
        <SocketContext.Provider value={{
            stream,
            me,
            call,
            callaccpted,
            callEnd,
            name,
            setName,
            myVideo,
            userVideo,
            callAnswer,
            callUser,
            leaveCall,
        }}>
            {children}
        </SocketContext.Provider>
    )


}


export { SocketContext, SocketProvider }


