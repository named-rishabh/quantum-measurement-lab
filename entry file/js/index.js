import "../css/style.css";
import Experience from "./webgl/sceneSetup/Experience.js";
import Navbar from "./components/navbar.js";
import Hero from "./section/Hero.js";
import InteractiveLab from "./section/Interactivelab.js";
import Experiments from "./section/ExperminetCard.js";
import Team from "./section/Team.js";
import Contact from "./section/Contact.js";
import Footer from "./section/Footer.js";
import LoadingScreen from "./components/LoadingScreen.js";

function initApp() {
    const width = window.innerWidth;

    if (width < 768) {
        console.log('mobile');
        new Navbar('mobile');
        new Hero('mobile');
        new InteractiveLab('mobile');
        new Experiments("mobile");
        new Team('mobile');
        new Contact('mobile');
        new Footer('mobile');
    } 
    
    else if (width >= 768 && width < 1023) {
        console.log('tablet');
        new Navbar('mobile');
        new Hero('mobile');
        const interactiveLab = new InteractiveLab('desktop');
        const { canvasWrapper, canvas } = interactiveLab.createDesktop();
        interactiveLab.eventListenerDesktop();
        new Experiments("desktop");
        const loadingScreen = new LoadingScreen(canvasWrapper);
        new Experience(canvasWrapper, canvas, true, loadingScreen);
        new Team('mobile');
        new Contact('mobile');
        new Footer('desktop');
    } 
    else {
        console.log('desktop');
        new Navbar('desktop');
        new Hero('desktop');
        const interactiveLab = new InteractiveLab('desktop');
        const { canvasWrapper, canvas } = interactiveLab.createDesktop();
        interactiveLab.eventListenerDesktop();
        new Experiments('desktop');
        new Team('desktop');
        new Contact('desktop');
        new Footer('desktop');
        const loadingScreen = new LoadingScreen(canvasWrapper);
        new Experience(canvasWrapper, canvas, true, loadingScreen);
    }
}

initApp();