import "../styles/style.scss";
import { Engine } from "./engine";

fetch("story.yaml")
    .then((res) => res.text())
    .then((text) => {
        const engine = new Engine(text);
        engine.start();
    });