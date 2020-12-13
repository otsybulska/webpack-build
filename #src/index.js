// Styles
import 'normalize.css';
import './scss/global.scss'
import './scss/hello.scss'

// JS module
import component from './scripts/component'

// SVG
import moon from './assets/icons/moon.svg'

// Appending to the DOM
const logo = document.createElement('img')
logo.src = moon

const text = document.createElement('p')
text.innerHTML = component

const app = document.querySelector('.hello__js')
app.append(logo, text)

// Try babel example
async function tryBabel() {
    await fetch('rtet')
}