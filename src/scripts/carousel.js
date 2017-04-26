import './carousel.styl'



class Carousel{
    carouselClass = 'carousel'
    carouselTrackClass = 'carousel-track'
    carouselSlideClass = 'carousel-slide'
    carouselSlideActiveClass = 'carousel-slide-active'
    carouselArrowClass = 'arrow'
    carouselLeftArrowClass = 'left'
    carouselRightArrowClass = 'right'
    transitionDuration = 1000
    // TODO: fix error with arrow show on first start
    transitionDelay = 10000

    constructor({container, endless = true, arrows = true}){
        if(!container) throw new Error('Carousel need container')
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

export default options =>
    new Carousel(options)




