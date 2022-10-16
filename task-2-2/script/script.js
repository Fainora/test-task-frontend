let elDirection = document.getElementById("route");
let elTimeAB = document.getElementById("timeAB");
let elTimeBA = document.getElementById("timeBA");
let elNum = document.getElementById("num");
let elBlockAB = document.getElementById("AB");
let elBlockBA = document.getElementById("BA");
let elResult = document.getElementById("result");

const priceAB = 700;
const priceBA = priceAB;
const priceABA = 1200;
const travelTimeMinutes = 50;

const route = {
    'AB': 'из A в B',
    'BA': 'из B в A',
    'ABA': 'из A в B и обратно в А'
};

const dateTime = {
    'AB': [
        '2021-08-21 18:00:00',
        '2021-08-21 18:30:00',
        '2021-08-21 18:45:00',
        '2021-08-21 19:00:00',
        '2021-08-21 19:15:00',
        '2021-08-21 21:00:00'
    ],
    'BA': [
        '2021-08-21 18:30:00',
        '2021-08-21 18:45:00',
        '2021-08-21 19:00:00',
        '2021-08-21 19:15:00',
        '2021-08-21 19:35:00',
        '2021-08-21 21:50:00',
        '2021-08-21 21:55:00'
    ]
}

let arrAB = [];
let arrBA = [];

/* Выводим направление путешествия */
Object.keys(route).forEach(key => {
    elDirection.innerHTML += `
        <option value="${key}">${route[key]}</option>
    `;
});

/* Отображаем видимость блоков со временем */
const directionChange = () => {
    if (elDirection.value == "AB") {
        elBlockAB.hidden = false;
        elBlockBA.hidden = true;
    } else if (elDirection.value == "BA") {
        elBlockAB.hidden = true;
        elBlockBA.hidden = false;
    } else {
        elBlockAB.hidden = false;
        elBlockBA.hidden = false;
    }
}

/* Создаем массив, где указываем только часы и минуты */
const parseTimes = (date) => {
    let time = [date.getHours(), date.getMinutes()].map((val) => {
        return val < 10 ? "0" + val : val;
    }).join(":");

    return time;
};

/* Отображаем время маршрута */
Object.keys(dateTime).forEach(key => {
    for (let i = 0; i < dateTime[key].length; i++) {
        let time = parseTimes(new Date(dateTime[key][i]));
        let value = new Date(dateTime[key][i]).getTime();

        switch (key) {
            case 'AB':
                arrAB.push(time);
                elTimeAB.innerHTML += `<option value="${value}">${time}</option>`;
                break;
            case 'BA':
                arrBA.push(time);
                elTimeBA.innerHTML += `<option value="${value}">${time}</option>`;
                break;
        }
    }
});

/* Найдем разницу времени */
const diffTimes = () => (elTimeBA.value - elTimeAB.value) / 6e4;

/* Отключаем возможность выбрать время если путь в BA < AB */
const filterOptions = (time) => {
    let latest = 0;

    if (elDirection.value !== 'BA') {
        latest = parseInt(elTimeAB.value) + travelTimeMinutes * 6e4;
    }

    const isSelectionValid = (elTimeBA.value >= latest);
    let isFixApplied = false;

    elTimeBA.querySelectorAll('option').forEach(opt => {
        if (opt.value < latest) {
            opt.setAttribute('disabled', '');
        } else {
            opt.removeAttribute('disabled');
            if (!isSelectionValid && !isFixApplied) {
                elTimeBA.value = opt.value;
                isFixApplied = true;
            }
        }
    });
};

/* Общее время путешествия */
const travelTime = () => totalTime = (elDirection.value == "ABA") ? diffTimes() : travelTimeMinutes;

/* Считаем итоговую сумму */
const priceChange = () => {
    return elNum.value * ((elDirection.value == "AB") ? priceAB :
        (elDirection.value == "BA") ? priceBA :
        priceABA);
}

/* Задаем значению указанную длину */
const length = value => value.toString().padStart(2, '0');

/* Конвертируем время */
const convertTime = (time) => {
    time = new Date(parseInt(time));
    let h = length(time.getHours());
    let m = length(time.getMinutes());

    return h + '-' + m;
}

/* Выводим время отплытия */
const printSailing = () => (elDirection.value == "BA") ? convertTime(elTimeBA.value) : convertTime(elTimeAB.value);

/* Выводим время прибытия */
const printArrival = () => {
    let time = (elDirection.value == "AB") ? elTimeAB.value : elTimeBA.value;
    let date = new Date(parseInt(time));
    let arrival = date.setMinutes(date.getMinutes() + 50);
    let result = (elDirection.value == "ABA") ? convertTime(elTimeBA.value) : convertTime(arrival);

    return result;
}

/* Отображаем результат */
const printResult = () => {
    let direction = route[elDirection.value];

    elResult.innerHTML = `
        <p>Вы выбрали ${elNum.value} билета по маршруту ${direction} стоимостью ${priceChange()}р.</p>
        <p>Это путешествие займет у вас ${totalTime} минут.</p>
        <p>Теплоход отправляется в ${printSailing()}, а прибудет в ${printArrival()}.</p>
    `;
}

/* Обновляем данные */
const update = () => (directionChange(), filterOptions(), travelTime(), printArrival());

elDirection.addEventListener('change', update);
elBlockAB.addEventListener('change', update);
elBlockBA.addEventListener('change', update);
elNum.addEventListener('change', update);

update();