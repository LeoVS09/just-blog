import './carousel.styl'


const timeout = (time, f) =>
    new Promise(resolve =>
        setTimeout(() =>
                resolve(f()),
            time)
    );


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
    transitionDelay = 4000

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

    next = async () => {
        await this.moveTo(this.currentSlide + 1)
    }

    prev = async () => {
        await this.moveTo(this.currentSlide - 1)
    }

    moveTo = async target => {
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
        await timeout(20, () => {
            this.track.style.transitionDuration = this.transitionDuration + 'ms'

            this.currentOffset = this.width * target;
            this.track.style.transform = 'translateX(-' + this.currentOffset + 'px)';
            this.currentSlide = target
            this.slides[this.currentSlide].classList.add(this.carouselSlideActiveClass)
        })
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
        this.carouselWrapperClass = 'cards-carousel-wrapper'
        this.carouselTrackClass = 'cards-carousel-track'
        this.carouselSlideClass = 'cards-carousel-slide'
        this.carouselSlideActiveClass = 'cards-carousel-slide-active'
        this.carouselSlidePrevClass = 'cards-carousel-slide-prev'
        this.carouselSlidePrevBeforeClass = 'cards-carousel-slide-prev-before'
        this.carouselSlideMiddleBeforeClass = 'cards-carousel-slide-middle-before'
        this.carouselSlideNextAfterClass = 'cards-carousel-slide-next-after'
        this.carouselSlideNextClass = 'cards-carousel-slide-next'
        this.carouselArrowClass = 'arrow'
        this.carouselLeftArrowClass = 'left'
        this.carouselRightArrowClass = 'right'

        this.moveToEdgeFromBack = 'moving-to-edge-from-back'
        this.moveToMiddle = 'moving-to-middle'
        this.moveToEdgeFromForward = 'moving-to-edge-from-forward'
        this.moveToBack = 'moving-to-back'
        this.nowOnMiddle = 'now-on-middle'

    }

    constructor(options){
        super(options)

        this.setSlidesPositions()
    }

    injectNodes(){
        this.currentSlide = 1
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.width = this.container.offsetWidth
        if(this.height)
            this.container.style.height = `${this.height}px`
        let slides = Array.prototype.slice.call(this.container.childNodes)
            .map(this.wrapToSlide.bind(this))
        let wrapper = document.createElement('div')
        wrapper.classList.add(this.carouselWrapperClass)
        this.container.parentNode.replaceChild(wrapper,this.container)
        wrapper.appendChild(this.container)
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

    translate3d(x = 0,y = 0,z = 0){
        return `perspective(${this.perspective}px) translate3d(${x}px,${y}px,${z}px)`
    }

    previousSlide = () =>
        this.slides[this.slideNumber(-1)];

    middleSlide = () =>
        this.slides[this.slideNumber()];

    nextSlide = () =>
        this.slides[this.slideNumber(1)];

    classes(slide){
        let res = {
            remove: name => {
                slide.classList.remove(name)
                return res;
            },
            add: name => {
                slide.classList.add(name)
                return res;
            }
        }
        return res;
    }

    // TODO: add dark gradient for not active slides
    next = async () => {
        this.classes(this.previousSlide())
            .remove(this.moveToBack)
        ;
        this.classes(this.middleSlide())
            .remove(this.moveToMiddle)
            .remove(this.nowOnMiddle)
            .add(this.moveToEdgeFromForward)
        ;
        this.classes(this.nextSlide())
            .remove(this.moveToBack)
            .add(this.moveToEdgeFromBack)
        ;

        this.previousSlide().style.transform = this.translate3d(0,0,-this.zOffset)
        this.middleSlide().style.transform = this.translate3d(-(this.width + this.xOffset/2)/2,0,-this.zOffset/2)
        this.middleSlide().style.animationDuration = this.transitionDuration + 'ms'
        this.nextSlide().style.transform = this.translate3d((this.width + this.xOffset/2)/2,0,-this.zOffset/2)
        this.nextSlide().style.animationDuration = this.transitionDuration + 'ms'

        await timeout(this.transitionDuration, () => {
            this.classes(this.middleSlide())
                .remove(this.carouselSlideActiveClass)
                .remove(this.moveToEdgeFromForward)
            ;
            this.classes(this.nextSlide())
                .remove(this.moveToEdgeFromBack)
            ;
            this.clearNextSlide(this.nextSlide())
            this.currentSlide = this.slideNumber(1)
            this.setPrevSlide(this.previousSlide())
            this.classes(this.previousSlide())
                .add(this.carouselSlidePrevBeforeClass)
                .add(this.moveToBack)
            ;
            this.previousSlide().style.animationDuration = this.transitionDuration/2 + 'ms'
            this.classes(this.middleSlide())
                .add(this.carouselSlideActiveClass)
                .add(this.moveToMiddle)
            ;
            this.middleSlide().style.animationDuration = this.transitionDuration/2 + 'ms'
            this.previousSlide().style.transform = this.translate3d(-this.xOffset,0,-this.zOffset)
            this.middleSlide().style.transform = this.translate3d(0,0,0)
        })
        await timeout(this.transitionDuration/2, () => {
            this.classes(this.middleSlide())
                .add(this.nowOnMiddle)
            ;
            this.clearPrevSlide(this.slides[this.slideNumber(-2)])
            this.classes(this.previousSlide())
                .remove(this.carouselSlidePrevBeforeClass)
            ;
            this.setNextSlide(this.nextSlide())
            this.nextSlide().style.transform = this.translate3d(this.xOffset, 0, -this.zOffset)
            this.classes(this.nextSlide())
                .add(this.moveToBack)
            ;

        })
    }

    prev = async () =>{
        this.classes(this.nextSlide())
            .remove(this.moveToBack)
        ;
        this.classes(this.middleSlide())
            .remove(this.moveToMiddle)
            .remove(this.nowOnMiddle)
            .add(this.moveToEdgeFromForward)
        ;
        this.classes(this.previousSlide())
            .remove(this.moveToBack)
            .add(this.moveToEdgeFromBack)
            .add(this.carouselSlideNextAfterClass)
        ;

        this.nextSlide().style.transform = this.translate3d(0,0,-this.zOffset)
        this.middleSlide().style.transform = this.translate3d((this.width + this.xOffset/2)/2,0,-this.zOffset/2)
        this.middleSlide().style.animationDuration = this.transitionDuration + 'ms'
        this.previousSlide().style.transform = this.translate3d(-(this.width + this.xOffset/2)/2,0,-this.zOffset/2)
        this.previousSlide().style.animationDuration = this.transitionDuration + 'ms'
        this.slides[this.slideNumber(-2)].style.transform = this.translate3d(0,0,-this.zOffset)
        this.slides[this.slideNumber(-2)].style.transitionDuration = 0
        this.setPrevSlide(this.slides[this.slideNumber(-2)])
        this.classes(this.slides[this.slideNumber(-2)])
            .add(this.carouselSlideMiddleBeforeClass)

        await timeout(this.transitionDuration, () => {
            this.classes(this.middleSlide())
                .remove(this.carouselSlideActiveClass)
                .remove(this.moveToEdgeFromForward)
            ;
            this.classes(this.previousSlide())
                .remove(this.moveToEdgeFromBack)
            ;
            this.clearNextSlide(this.nextSlide())
            this.clearPrevSlide(this.previousSlide())

            this.currentSlide = this.slideNumber(-1)

            this.setNextSlide(this.nextSlide())

            this.classes(this.nextSlide())
                .add(this.moveToBack)
            ;

            this.nextSlide().style.animationDuration = this.transitionDuration/2 + 'ms'
            this.classes(this.middleSlide())
                .add(this.carouselSlideActiveClass)
                .add(this.moveToMiddle)
            ;
            this.classes(this.previousSlide())
                .remove(this.carouselSlideMiddleBeforeClass)
            ;
            this.middleSlide().style.animationDuration = this.transitionDuration/2 + 'ms'
            this.nextSlide().style.transform = this.translate3d(this.xOffset,0,-this.zOffset)
            this.previousSlide().style.transitionDuration = this.transitionDuration
            this.previousSlide().style.transform = this.translate3d(-this.xOffset, 0, -this.zOffset)
            this.middleSlide().style.transform = this.translate3d(0,0,0)
        })

        await timeout(this.transitionDuration/2, () => {
            this.classes(this.middleSlide())
                .add(this.nowOnMiddle)
            ;

            this.classes(this.middleSlide())
                .remove(this.carouselSlideNextAfterClass)
            ;

            this.classes(this.previousSlide())
                .add(this.moveToBack)
            ;

        })
    }

    setSlidesPositions(){
        this.slides[this.slideNumber(-1)].style.transform = this.translate3d(-this.xOffset,0,-this.zOffset)
        this.slides[this.slideNumber(-1)].classList.add(this.carouselSlidePrevClass)
        this.slides[this.slideNumber(-1)].classList.add(this.moveToBack)
        this.slides[this.slideNumber(1)].classList.add(this.moveToBack)
        this.slides[this.slideNumber()].style.transform = this.translate3d(0,0,0)
        this.slides[this.slideNumber()].classList.add(this.carouselSlideActiveClass)
        this.slides[this.slideNumber()].classList.add(this.moveToMiddle)
        this.slides[this.slideNumber()].classList.add(this.nowOnMiddle)
        this.slides[this.slideNumber(1)].style.transform = this.translate3d(this.xOffset,0,-this.zOffset)
        this.setNextSlide(this.slides[this.slideNumber(1)])
        this.setPrevSlide(this.slides[this.slideNumber(-1)])
   }

    setNextSlide(slide){
        slide.classList.add(this.carouselSlideNextClass)
        slide.addEventListener('click', this.next)
    }

    clearNextSlide(slide){
        slide.removeEventListener('click',this.next)
        slide.classList.remove(this.carouselSlideNextClass)
    }
    setPrevSlide(slide){
        slide.classList.add(this.carouselSlidePrevClass)
        slide.addEventListener('click', this.prev)
    }
    clearPrevSlide(slide){
        slide.removeEventListener('click',this.prev)
        slide.classList.remove(this.carouselSlidePrevClass)
    }
    slideNumber(offset = 0){
        let result = (this.currentSlide + offset) % this.slides.length
        if(result < 0)
            result = this.slides.length + result
        return result
    }
}

