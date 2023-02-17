import {useState} from "react";


import '../App.css'

function Timer(props) {
    const [dropDate, setDropDate] = useState(Date.parse(props.time));
    const [dateNow, setDateNow] = useState(Date.now());

    function renderTimer(){
        let secondsToDrop = Math.floor((dropDate - dateNow)/1000);  
        let timeConsidered = 0
        let days = Math.floor(secondsToDrop/(60*60*24))
        timeConsidered += days*60*60*24
        let hours = Math.floor((secondsToDrop-timeConsidered)/(60*60))
        timeConsidered += hours*60*60
        let minutes = Math.floor((secondsToDrop-timeConsidered)/(60))
        timeConsidered += minutes*60
        let seconds = (secondsToDrop-timeConsidered)
        return ` ${days < 10 ? '0' + days : days} : ${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes}  : ${seconds < 10 ? '0' + seconds : seconds} `
    }

    function startTimer(){
        let myInterval = setInterval(() => {
            if(Date.now()>Date.parse(props.time)){
                setDateNow(Date.parse(props.time))
            }else{
                setDateNow(Date.now())
            }
        }, 1000)
    }

    startTimer()

    return (
        renderTimer()
     );
}

export default Timer;


