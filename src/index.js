import './styles/index.styl'

import Carousel from './scripts/carousel'


setTimeout( () =>
    document.querySelectorAll('.paper').forEach(el =>
        el.classList.add('showed')
    )
, 1000)


let carousel = Carousel({
    container: document.querySelector('.slider-papers')
})