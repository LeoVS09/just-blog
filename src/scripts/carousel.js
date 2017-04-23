import './carousel.styl'

const carouselClass = 'carousel'
const carouselTrackClass = 'carousel-track'
const carouselSlideClass = 'carousel-slide'
const carouselSlideActiveClass = 'carousel-slide-active'
const transitionDuration = 1000



export default ({container, endless = true}) => {
    if(!container) throw new Error('Carousel need container')
    let {currentSlide, width, track, slides} = injectNodes(container, endless),
        currentOffset = 0,
        stepTimer = setInterval(function () {
            let currentState = makeStep({currentSlide,currentOffset, width, track, slides, endless})
            currentSlide = currentState.currentSlide
            currentOffset = currentState.currentOffset
            let direction = 1
            setTimeout(function () {
                relocateSlide({track,slides}, direction === 1)
                currentSlide -= direction
                let currentState = returnTrack({track, width, currentOffset, currentSlide})
                currentSlide = currentState.currentSlide
                currentOffset = currentState.currentOffset
            },transitionDuration)
            if(currentSlide == slides.length-1)
                clearInterval(stepTimer)
        },2000)
}

let injectNodes = (container,endless) => {
    let currentSlide = 0
    let width = container.offsetWidth
    let slides = Array.prototype.slice.call(container.childNodes)
        .map(wrapToSlide(width))
    remakeSlides(slides,endless)
    container.classList.add(carouselClass)
    slides[currentSlide].classList.add(carouselSlideActiveClass)
    let track = document.createElement('div')
    track.classList.add(carouselTrackClass)
    track.style.transitionDuration = transitionDuration + 'ms'
    track.innerHTML = slides.map(el => el.outerHTML).join('')
    container.innerHTML = track.outerHTML
    track = container.querySelector('.' + carouselTrackClass)
    slides = Array.prototype.slice.call(track.querySelectorAll('.' + carouselSlideClass))
    let trackWidth = calcTrackWidth(width, slides.length, endless)
    track.style.width =  trackWidth + 'px';
    return {currentSlide, width, track, slides}
}

function remakeSlides(slides,endless) {
    if(endless) {
        let first = slides[0].cloneNode(true)
        slides.push(first)
    }
}

function calcTrackWidth(initial,length,endless) {
    // if(endless)
    //     return initial*(length+1)
    // else
        return initial*length
}

let wrapToSlide = width => (element) => {
    let slide = document.createElement('div')
    slide.classList.add(carouselSlideClass)
    slide.style.width = width + 'px'
    slide.appendChild(element)
    return slide
}

function makeStep({slides, currentSlide, currentOffset, track, width, endless}, direction = 1) {
    slides[currentSlide].classList.remove(carouselSlideActiveClass)
    currentOffset += direction*width;
    track.style.transform = 'translateX(-' + currentOffset + 'px)';
    currentSlide += direction
    slides[currentSlide].classList.add(carouselSlideActiveClass)
    return {currentOffset, currentSlide}
}

function goTo({slides, currentSlide, currentOffset, track, width}, target) {
    slides[currentSlide].classList.remove(carouselSlideActiveClass)
    currentOffset = width*target;
    track.style.transform = 'translateX(-' + currentOffset + 'px)';
    currentSlide = target
    slides[currentSlide].classList.add(carouselSlideActiveClass)
    return { currentSlide, currentOffset }
}

function autoStep() {

}

function relocateSlide({track, slides},toEnd = true) {
    if(toEnd){
        let first = slides.shift()
        track.removeChild(first)
        track.appendChild(first)
        slides.push(first)
    } else {
        let last = slides.pop()
        track.removeChild(last)
        track.insertBefore(last, track.firstChild)
        slides.unshift(last)
    }
}

function returnTrack({track, width, currentOffset, currentSlide}) {
    track.style.transitionDuration = 0
    currentOffset = currentSlide*width
    track.style.transform = 'translateX(-' + currentOffset + 'px)'
    track.style.transitionDuration = transitionDuration + 'ms'
    return {currentOffset, currentSlide}
}