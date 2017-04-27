import './carousel.styl'



class Carousel{
    defineClasses() {
        this.carouselClass = 'carousel'
        this.carouselTrackClass = 'carousel-track'
        this.carouselSlideClass = 'carousel-slide'
        this.carouselSlideActiveClass = 'carousel-slide-active'
        this.carouselArrowClass = 'arrow'
        this.carouselLeftArrowClass = 'left'
        this.carouselRightArrowClass = 'right'
    }
    transitionDuration = 1000
    // TODO: fix error with arrow show on first start
    transitionDelay = 2000

    constructor({container, endless = true, arrows = true, ...options}){
        if(!container) throw new Error('Carousel need container')
        this.defineClasses()
        this.height = options.height
        this.container = container
        this.endless = endless
        this.injectNodes()
        this.currentOffset = 0
        this.play()
        this.container.addEventListener('mouseover',() => this.mouseover())
        this.container.addEventListener('mouseout',() => this.mouseout())

    }

    injectNodes(){
        this.currentSlide = 0
        this.width = this.container.offsetWidth
        let slides = Array.prototype.slice.call(this.container.childNodes)
            .map(this.wrapToSlide.bind(this))
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
        let {left, right} = this.createArrows()
        this.container.insertBefore(left, this.container.firstChild)
        this.container.appendChild(right)
    }

    createArrows(){
        let left = document.createElement('div')
        let right = document.createElement('div')
        left.classList.add(this.carouselArrowClass)
        right.classList.add(this.carouselArrowClass)
        left.classList.add(this.carouselLeftArrowClass)
        right.classList.add(this.carouselRightArrowClass)
        let leftClick = () => {
            this.prev()
            left.removeEventListener('click',leftClick)
            setTimeout(() => left.addEventListener('click',leftClick),this.transitionDuration)
        }
        left.addEventListener('click', leftClick)
        let rightClick = () => {
            this.next()
            right.removeEventListener('click',rightClick)
            setTimeout(() => right.addEventListener('click',rightClick),this.transitionDuration)
        }
        right.addEventListener('click', rightClick)
        return {left, right}
    }

    mouseover(){
        this.stop()
    }

    mouseout(){
        this.play()
    }

    calcTrackWidth() {
        // if(endless)
        //     return initial*(length+1)
        // else
        return this.width*this.slides.length
    }

    play(){
        this.stop()
        this.stepTimer = this.autoStep()
    }

    autoStep = () => setInterval(() => {
        this.next()
        if(this.needStop())
            this.stop()
    },this.transitionDelay)

    needStop(){
        if(this.endless)
            return false
        else
            return this.currentSlide == this.slides.length - 1
    }

    stop(){
        clearInterval(this.stepTimer)
    }

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
            this.currentSlide--
            this.slides.push(first)
            this.returnTrack()
        } else {
            let last = this.slides.pop()
            this.track.removeChild(last)
            this.track.insertBefore(last, this.track.firstChild)
            this.currentSlide++
            this.slides.unshift(last)
            this.returnTrack(1)
        }
    }

    returnTrack() {
        this.track.style.transitionDuration = '0ms'
        this.currentOffset = this.currentSlide*this.width
        this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)'
    }

    next(){
        this.moveTo(this.currentSlide + 1)
    }

    prev(){
        this.moveTo(this.currentSlide - 1)
    }

    moveTo(target) {
        this.slides[this.currentSlide].classList.remove(this.carouselSlideActiveClass)
        if(this.endless)
            if(target == this.slides.length) {
                this.relocateSlide()
                target--
            }
            else if(target == -1) {
                this.relocateSlide(false)
                target++
            }
        setTimeout( () => {
            this.track.style.transitionDuration = this.transitionDuration + 'ms'

            this.currentOffset = this.width * target;
            this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)';
            this.currentSlide = target
            this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
        },20)
    }
}

export default options => {
    if(options.style == 'cards')
        return new Cards(options)
    else
        return new Carousel(options)
}


class Cards extends Carousel{
    zOffset = 100
    xOffset = 300
    perspective = 500
    defineClasses() {
        this.carouselClass = 'cards-carousel'
        this.carouselTrackClass = 'cards-carousel-track'
        this.carouselSlideClass = 'cards-carousel-slide'
        this.carouselSlideActiveClass = 'cards-carousel-slide-active'
        this.carouselSlidePrevClass = 'cards-carousel-slide-prev'
        this.carouselSlideNextClass = 'cards-carousel-slide-next'
        this.carouselArrowClass = 'arrow'
        this.carouselLeftArrowClass = 'left'
        this.carouselRightArrowClass = 'right'
    }

    constructor(options){
        super(options)
        this.setSlidesPositions()
    }

    injectNodes(){
        this.currentSlide = 1
        this.width = this.container.offsetWidth
        if(this.height)
            this.container.style.height = `${this.height}px`
        let slides = Array.prototype.slice.call(this.container.childNodes)
            .map(this.wrapToSlide.bind(this))
        this.container.classList.add(this.carouselClass)
        slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
        this.container.innerHTML = slides.map(el => el.outerHTML).join('')
        slides = Array.prototype.slice.call(this.container.querySelectorAll('.' + this.carouselSlideClass))
        this.slides = slides
    }

    wrapToSlide(element){
        let slide = super.wrapToSlide.call(this,element)
        slide.style.transitionDuration = this.transitionDuration + 'ms'
        return slide
    }

    translate3d(x,y,z){
        return `perspective(${this.perspective}px) translate3d(${x}px,${y}px,${z}px)`
    }

    // TODO: add dark gradient for not active slides
    next(){
        this.slides[this.currentSlide - 1].style.transform = this.translate3d(0,0,-this.zOffset)
        this.slides[this.currentSlide].style.transform = this.translate3d(-(this.width + this.xOffset/2)/2,0,-this.zOffset/2)
        this.slides[this.currentSlide+1].style.transform = this.translate3d((this.width + this.xOffset/2)/2,0,-this.zOffset/2)

        setTimeout(() => {

            this.slides[this.currentSlide].classList.remove(this.carouselSlideActiveClass)
            this.slides[this.currentSlide + 1].classList.remove(this.carouselSlideNextClass)
            this.currentSlide++
            this.slides[this.currentSlide - 1].classList.add(this.carouselSlidePrevClass)
            this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)

            this.slides[this.currentSlide - 1].style.transform = this.translate3d(-this.xOffset,0,-this.zOffset)
            this.slides[this.currentSlide].style.transform = this.translate3d(0,0,0)
            setTimeout(() => {
                this.slides[this.currentSlide - 2].classList.remove(this.carouselSlidePrevClass)
                this.slides[this.currentSlide + 1].classList.add(this.carouselSlideNextClass)
                this.slides[this.currentSlide + 1].style.transform = this.translate3d(this.xOffset, 0, -this.zOffset)
            }, this.transitionDuration/2)
        },this.transitionDuration)
    }
    setSlidesPositions(){
        this.slides[this.currentSlide - 1].style.transform = this.translate3d(-this.xOffset,0,-this.zOffset)
        this.slides[this.currentSlide - 1].classList.add(this.carouselSlidePrevClass)
        this.slides[this.currentSlide].style.transform = this.translate3d(0,0,0)
        this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
        this.slides[this.currentSlide + 1].style.transform = this.translate3d(this.xOffset,0,-this.zOffset)
        this.slides[this.currentSlide + 1].classList.add(this.carouselSlideNextClass)
    }
}

