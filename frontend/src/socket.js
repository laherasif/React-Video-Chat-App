import { createContext, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
// live server path 
const socket = io('https://video-chats-app.herokuapp.com/')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {

  const [stream, setStream] = useState()
  const [me, setMe] = useState('')
  const [call, setCall] = useState({})
  const [callaccpted, setCallaccpted] = useState(false)
  const [callEnd, setCallEnd] = useState(false)
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

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

   

  }, [])



  const callAnswer = () => {
    setCallaccpted(true)
    const peer = new Peer({ initiator: false, trickle: false, stream })
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from })
    })

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream
    })
    peer.signal(call.signal)
    currentRef.current = peer;
  }


  const callUser = (id) => {
    const peers = new Peer({ initiator: true, trickle: false, stream })
    peers.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
    })

    peers.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream
    })

    socket.on('callacepted', (signal) => {
      setCallaccpted(true)
      peers.signal(signal)
    })

    currentRef.current = peers;


  }

  const leaveCall = () => {
    setCallEnd(true)
    currentRef.current.destroy()

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


