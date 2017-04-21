import './styles/index.styl'
setTimeout( () =>
    document.querySelectorAll('.paper').forEach(el =>
        el.classList.add('showed')
    )
, 1000)