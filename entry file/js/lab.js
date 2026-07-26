import "../css/style.css";
import Experience from "./webgl/sceneSetup/Experience.js";
import Navbar from "./components/Navbar.js";
import InteractiveLab from "./section/Interactivelab.js";
import Footer from "./section/Footer.js";


if (window.matchMedia("(max-width: 768px)").matches){
    new Navbar('mobile')
    new InteractiveLab('mobile')
    new Footer('mobile')
}
else if (window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches){
    console.log('tablets')
    new Navbar('mobile')
    const interactiveLab = new InteractiveLab('desktop');
    const { canvasWrapper, canvas } = interactiveLab.createDesktop();
    interactiveLab.eventListenerDesktop();
    new Experience(canvasWrapper, canvas);
    new Footer('desktop')
}
else{
    new Navbar('desktop');
    const interactiveLab = new InteractiveLab('desktop');
    const { canvasWrapper, canvas } = interactiveLab.createDesktop();
    interactiveLab.eventListenerDesktop();
    new Footer('desktop');
    new Experience(canvasWrapper, canvas);
}