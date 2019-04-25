# Aleqpano.js
Воспроизведение панорамы заднего фона сайта.

Поддержка кастомных стилей, возможность ожидания загрузки изображения перед началом работы панорамы с указанием на выполнение любых действий как до загрузки, так и после, возможность множества независимых панорам с разными размерами, позиционированием и уникальными стилями, динамическим редактированием, созданием и удалением, выбором направления (`left`, `right` и слежением за курсором мыши `mouse`), скоростью перемещения изображения, самой анимации, её типом, возможность изменения динамически как направления, так и текущего местоположения в любой момент времени и прочее прочее прочее :)

# Возможности
> ## Быстрый старт

Для быстрого старта необходимо указать **объект** (с которым будем работать) и сам **background**.
```js
let panorama = new Aleqpano
({
  obj: document.querySelector('panorama'),
  background: '/img/pano.jpg'
});
```

Так же параметры можно указать и **после** создания.
```js
let panorama = new Aleqpano();

panorama.obj = document.querySelector('panorama');
panorama.background = '/img/pano.jpg';
```

Запуск осуществляется функцией `init()`.
```js
panorama.init();
```

Остановка осуществляется функцией `term()`.
```js
panorama.term();
```

> ## Всевозможные передаваемые параметры

| Обозначение | Описание | По умолчанию |
|----:|:----------|:----|
| `obj` | Сама панорама | `undefined` |
| `background` | Само изображение панорамы (url) | `undefined` |
| `value` | Прогресс панорамы (можно указывать начальный прогресс) |  `0` |
| `speed` | Количество пикселей/процентов за интервал | `0.05` |
| `interval` | Сам интервал цикла | `20` миллисекунд |
| `timeout` | Флаг готовности работоспособности цикла | `false` |
| `type` | Тип скорости (% / px) | `%` |
| `smooth` | Возможность плавность анимации | `true` |
| `anitype` | Тип анимации (all, opacity и т.п.) | `opacity` |
| `anitime` | Время анимации | `.5s` (0.5sec / 500 ms) |
| `opacity` | Прозрачность панорамы (от 0 до 1) | `1` |
| `direction` | Направление (left, right, mouse) | `right` |
| `position` | Позиционирование элемента (absolute, relative и т.п.) | `absolute` |
| `width` | Ширина панорамы | `100%` |
| `height` | Высота панорамы | `100%` |
| `index` | Индекс в отношении к элементам сайта | `0` |
| `mod` | Модификатор чувствительности | `speed * 10` |
| `ewidth` | Ширина экрана | `window.outerWidth` |
| `mouse` | Координаты мыши | `ewidth / 1.5` |

> ## Методы/функции

### set (name, value) - установка безымяного стиля панораме
`name` - имя CSS параметра
`value` - значение

```js
element.set('width', '500px')
```

### styleSet (name, value) - установка идентифицированных списков стилей
`name` - ID списка стилей
`value` - сами стили

```js
element.styleSet('menu', `
  footer
  {
    position: static;
    height: 100%;
  }
  
  loading
  {
    opacity: 1;
  }
  
  and other:after
  {
    content: '';
  }
`)
```

### init() - инициализация работы панорамы

```js
element.init()
```

### term() - прекращение работы панорамы или её приостановление

```js
element.term()
```

### loadImage({ onStart, onLoad }) - функция предварительной загрузки изображения

`onStart` - выполнение действий после инициализации загрузки
`onLoad` - выполнение действий после загрузки изображения

```js
element.loadImage
({
  onStart: function ()
  {
    log('Panorama.loadImage', 'Загрузка началась!');
    
    element.styleSet('load', `
      loader.loading
      {
        lorem: ipsum;
        dolor: sit;
      }
    `);

    document.querySelector('loader').classList.add('loading');
  },
  
  onLoad: function ()
  {
    log('Panorama.loadImage', 'Загрузка завершена!');
    
    // Есть 2 варианта удаления идентифицированных стилей
    element.styleSet('load'); // Первый
    document.querySelector('style#load').outerHTML = ''; // Второй
  }
})
```

> ## Пример настройки

```js
// Массив из параметров
let array = [ 
  { image: '/img/pano_1.jpg', speed: 0.05 }, 
  { image: '/img/pano_2.jpg', speed: 0.04 }, 
  { image: '/img/pano_3.jpg', speed: 0.02 },
  { image: '/img/pano_4.jpg', speed: 0.008 }
],

// Выбираем случайный
random = Math.floor(Math.random() * array.length),

// Объявляем новую панораму
background = new Aleqpano
({
  obj: document.querySelector('panorama'),
  background: array[random].image,
  speed: array[random].speed,
  direction: 'mouse'
});

// Начинаем загрузку изображения
background.loadImage
({
  onStart: function ()
  {
    // Присваиваем новые стили для loader'а
    background.styleSet('loading', `
      page.loading:before
      {
        position: absolute;
        content: '';
        width: 5%;
        height: 2px;
        top: -2px;

        background: #aaa;
        animation: loading-top 2s infinite ease-in-out;
      }

      page.loading:after
      {
        position: absolute;
        content: '';
        width: 5%;
        height: 2px;
        bottom: -2px;

        background: #aaa;
        animation: loading-bottom 2s infinite ease-in-out;
      }

      @keyframes loading-top
      {
        0%, 100% { left: 0px; }

        50% { left: 95%; }
      }

      @keyframes loading-bottom
      {
        0%, 100% { right: 0px; }

        50% { right: 95%; }
      }
    `);

    // Добавляем класс loading для элемента page
    document.querySelector('page').classList.add('loading');
  },

  onLoad: function ()
  {
    // Подчищаем за собой, убирая ненужные стили
    document.querySelector('style#loading').outerHTML = '';
    // Убираем loader
    document.querySelector('page').classList.remove('loading');
    // Запускаем панораму
    background.init();
  }
});
```
