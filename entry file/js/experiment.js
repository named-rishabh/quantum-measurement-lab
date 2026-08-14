import "../css/style.css";
import Footer from "./section/Footer";
import DeviceError from "./experiments/error";
import ExperimentComingSoon from "./experiments/comingsoon";

function initApp(){
    const width = window.innerWidth;
    const exp = window.localStorage.getItem('selectedExperiment') 

    if (width < 768) {
        new DeviceError('mobile')
        new Footer('mobile')
    }

    else if (width >= 768 && width < 1023) {
        new ExperimentComingSoon('desktop')
        new Footer('desktop')
    } 
    else {
        new ExperimentComingSoon('desktop')
        new Footer('desktop')
    }   
    
}

initApp();