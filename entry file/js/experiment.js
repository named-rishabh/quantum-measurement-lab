import "../css/style.css";
import Footer from "./section/Footer";
import DeviceError from "./experiments/error";
import ExperimentComingSoon from "./experiments/comingsoon";

function getExperiment(exp) {
    if (exp === 'one-tone-spectroscopy'){
        return import('./experiments/frequencybasedexp/FreqExp1.js').then(module => {
            new module.default('desktop');
        });
    } else if (exp === 'two-tone-spectroscopy'){
        // return import('./experiments/frequencybasedexp/FreqExp2.js').then(module => {
        //     new module.default('desktop');
        // });
        return new ExperimentComingSoon('desktop');
    } else if (exp === 'rabi-oscillations'){
        return new ExperimentComingSoon('desktop');
    } else if (exp === 'ramsey-interferometry'){
        return new ExperimentComingSoon('desktop');
    } 
}

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
        getExperiment(exp)
        
    }   
    
}

initApp();