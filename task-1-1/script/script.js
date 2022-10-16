// Изменить цвет при выборе кнопки со временем:
let btn = document.getElementsByClassName("btn-time-event");

Array.from(btn).forEach(el => el.addEventListener('click', () => {
    el.classList.toggle('active')
}));


// Добавить кнопку "ещё"
let card = document.getElementsByClassName("card");

Array.from(card).forEach(el => {
    let count = el.getElementsByClassName("btn-time-event").length;
    let btns = el.getElementsByClassName("btn-time-event");
    let loadMore = el.getElementsByClassName("loadMore")[0];
    let width = window.innerWidth;
    let i = 3;

    if (width >= 576 && width < 768) {
        i = 5;
    }

    if (count > 5) {
        for (i; i < count; i++) {
            btns[i].style.display = "none";
            loadMore.style.display = "inline-block";
        }
    }
});

function loadMore(elem) {
    let parent = elem.parentNode;
    let btns = parent.getElementsByClassName("btn-time-event");
    let count = btns.length;

    elem.style.display = "none";
    for (let i = 3; i < count - 1; i++) {
        btns[i].style.display = "inline-block";
    }
}