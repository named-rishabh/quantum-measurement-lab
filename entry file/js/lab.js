import "../css/style.css";
import Experience from "./webgl/sceneSetup/Experience.js";
import Navbar from "./components/navbar.js";
import InteractiveLab from "./section/Interactivelab.js";
import Footer from "./section/Footer.js";
import LoadingScreen from "./components/LoadingScreen.js";

function initApp() {
    const width = window.innerWidth;

    if (width < 768) {
        new Navbar('mobile')
        const mylab = new InteractiveLab('mobile', 'exploration');
        mylab.createMobile();
        mylab.eventListenerMobile();
        new InteractiveLab('mobile')
        new Footer('mobile')
    } 
    
    else if (width >= 768 && width < 1023) {
        console.log('tablets')
        const mylab = new InteractiveLab('desktop', 'exploration');
        const { canvasWrapper, canvas } = mylab.createDesktop();
        mylab.eventListenerDesktop();
        const loadingScreen = new LoadingScreen(canvasWrapper);
        new Experience(canvasWrapper, canvas, false, loadingScreen);
        new Footer('desktop')
    } 
    else {
        const mylab = new InteractiveLab('desktop', 'exploration');
        const { canvasWrapper, canvas } = mylab.createDesktop();
        mylab.eventListenerDesktop();
        new Footer('desktop');
        const loadingScreen = new LoadingScreen(canvasWrapper);
        new Experience(canvasWrapper, canvas, false, loadingScreen);
    }
}

initApp();