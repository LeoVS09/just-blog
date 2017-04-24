import './carousel.styl'



class Carousel{
    carouselClass = 'carousel'
    carouselTrackClass = 'carousel-track'
    carouselSlideClass = 'carousel-slide'
    carouselSlideActiveClass = 'carousel-slide-active'
    transitionDuration = 1000
    transitionDelay = 2000

    constructor({container, endless = true}){
        if(!container) throw new Error('Carousel need container')
        this.container = container
        this.endless = endless
        this.injectNodes()
        this.currentOffset = 0
        this.startStep()
    }

    injectNodes(){
        this.currentSlide = 0
        this.width = this.container.offsetWidth
        let slides = Array.prototype.slice.call(this.container.childNodes)
            .map(this.wrapToSlide.bind(this))
        // remakeSlides(slides,endless)
        this.container.classList.add(this.carouselClass)
        slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
        let track = document.createElement('div')
        track.classList.add(this.carouselTrackClass)
        track.style.transitionDuration = this.transitionDuration + 'ms'
        track.innerHTML = slides.map(el => el.outerHTML).join('')
        this.container.innerHTML = track.outerHTML
        track = this.container.querySelector('.' + this.carouselTrackClass)
        this.track = track
        slides = Array.prototype.slice.call(track.querySelectorAll('.' + this.carouselSlideClass))
        this.slides = slides
        let trackWidth = this.calcTrackWidth()
        track.style.width =  trackWidth + 'px';
    }

    calcTrackWidth() {
        // if(endless)
        //     return initial*(length+1)
        // else
        return this.width*this.slides.length
    }

    startStep(){
        this.stepTimer = this.autoStep()
    }

    autoStep = () => setInterval(() => {
        this.makeStep()
        let direction = 1
        setTimeout(() => {
            this.relocateSlide(direction === 1)
            this.currentSlide -= direction
            this.returnTrack()
        },this.transitionDuration)
        if(this.currentSlide == this.slides.length-1)
            clearInterval(this.stepTimer)
    },this.transitionDelay)

    wrapToSlide(element){
        let slide = document.createElement('div')
        slide.classList.add(this.carouselSlideClass)
        slide.style.width = this.width + 'px'
        slide.appendChild(element)
        return slide
    }

    relocateSlide(toEnd = true) {
        if(toEnd){
            let first = this.slides.shift()
            this.track.removeChild(first)
            this.track.appendChild(first)
            this.slides.push(first)
        } else {
            let last = this.slides.pop()
            this.track.removeChild(last)
            this.track.insertBefore(last, this.track.firstChild)
            this.slides.unshift(last)
        }
    }

    returnTrack() {
        this.track.style.transitionDuration = '0ms'
        this.currentOffset = this.currentSlide*this.width
        this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)'
    }

    makeStep(direction = 1) {
        this.track.style.transitionDuration = this.transitionDuration + 'ms'
        this.slides[this.currentSlide].classList.remove(this.carouselSlideActiveClass)
        this.currentOffset += direction*this.width;
        this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)';
        this.currentSlide += direction
        this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
    }

    goTo(target) {
        this.track.style.transitionDuration = transitionDuration + 'ms'
        this.slides[this.currentSlide].classList.remove(this.carouselSlideActiveClass)
        this.currentOffset = this.width*target;
        this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)';
        this.currentSlide = target
        this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
    }
}

export default options =>
    new Carousel(options)




