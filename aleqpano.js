/**
 *	 Aleqpano.js - воспроизведение панорамы заднего фона сайта
 *	Аналогичная версия панораме главного меню игры Minecraft
 *
 *	 Быстрый старт:
 *
 *	|	let background = new Aleqpano
 *	|	({
 *	|		obj: document.querySelector('panorama'),
 *	|		background: '/img/pano.jpg'
 *	|	});
 *	|
 *	|	background.init();
 *
 *	aleqsunder, v.0.5, 2019г.
 */
 
"use strict";
 
// На случай отсутствия log.js
if (!log.enable)
{
	var log = function (title, text) { console.log(title, text) }
	log.error = function (title, text) { console.error(title, text) }
	log.warn = function (title, text) { console.warn(title, text) }
	
	log.warn('log.js', 'не найден');
}

class Aleqpano
{
	constructor({
		obj, value, speed, interval, timeout,
		background, type, smooth, anitype, anitime, opacity,
		direction, position, width, height, index,
		mod
	})
	{
		/**
		 *	Основные переменные, используемые в калибровке панорамы
		 *	Переменная | Значение | Значение по-умолчанию | Комментарий
		 */
		 
		this.obj  		= (obj)? obj 					: undefined;		// Сама панорама
		this.value  	= (value)? value 				: 0;				// Прогресс панорамы
		this.speed  	= (speed)? speed 				: 0.05;				// Пикселей/процентов за интервал
		this.interval  	= (interval)? interval 			: 20;				// Интервал
		this.timeout  	= (timeout)? timeout 			: false;			// Флаг готовности
		
		this.background	= (background)? background 		: undefined;		// Изображение панорамы
		this.type		= (type)? type					: "%";				// Тип значения (% или px)
		this.smooth		= (smooth)? smooth				: true;				// Плавность анимации
		this.anitype	= (anitype)? anitype			: 'opacity';		// Тип анимации
		this.anitime	= (anitime)? anitime			: '.5s';			// Время анимации
		this.opacity	= (opacity)? opacity			: '1';				// Прозрачность панорамы
		
		this.direction	= (direction)? direction 		: 'right';			// Направление
		this.position	= (position)? position 			: 'absolute';		// Позиционирование
		this.width		= (width)? width 				: '100%';			// Ширина
		this.height		= (height)? height 				: '100%';			// Высота
		this.index		= (index)? index 				: '0';				// Индекс
		
		/**
		 *	Переменные, отвечающие за direction mouse
		 *	Переменная | Значение | Значение по-умолчанию | Комментарий
		 */
		 
		this.mod		= (mod)? mod					: this.speed * 10;	// Модификатор чувствительности
		this.ewidth		= window.outerWidth;								// Ширина экрана
		this.mouse		= this.ewidth / 1.5;								// Координаты мыши
		
		/**
		 *	Стартовые стили панорамы
		 */
		 
		var transition	= (this.smooth)? this.anitype +' '+ this.anitime : 'none'; 
		
		this.styleSet('starter', `
			panorama
			{
				position: `+ this.position +`;
				width: `+ this.width +`;
				height: `+ this.height +`;
				opacity: 0;
				
				z-index: `+ this.index +`;
				transition: `+ transition +`;
			}
		`);
	}
	
	/**
	 *	Управление параметрами CSS
	 */
	set(name, value) { this.obj.style.setProperty(name, value) }
	
	styleSet(name, value)
	{
		var element = document.querySelector('style#'+ name);
		
		if (element == undefined)
		{
			var style = document.createElement('style');

			style.type = 'text/css';
			style.id = name;
			style.innerHTML = value;
			
			document.querySelector('head').appendChild(style);
		}
		
		else
			if (value != undefined)
				element.innerHTML = value;
			
			else
				element.outerHTML = '';
	}
	
	turn()
	{
		if (this.direction == 'mouse')
		{
			var move = (this.mouse - this.ewidth/2) * (this.mod / this.ewidth);
			this.value += move;
		}
		else
		{
			this.value += (this.direction == 'left') ? -this.speed : this.speed;
		}
		
		this.set('background-position-x', this.value + this.type);
	}
	
	trim()
	{
		if (!(typeof this.interval == 'number'))
			return log.error('Panorama.trim', 'неверный тип переменной interval (должен быть number).');
			
		// this не передаётся в внутреннюю функцию, переприсваиваем
		var that = this;
		setTimeout
		( function() {
			that.turn();
			
			if (typeof that.timeout == "boolean")
			{
				if (that.timeout)
					that.trim();
			}
			else return log.error('Panorama.trim', 'неверный тип переменной timeout (должен быть boolean).');
		}, this.interval);
	}
	
	init()
	{
		log('Panorama.init', 'инициализация..');
		
		if (this.obj && this.background)
		{
			// Присвоение стиля
			this.styleSet('init', `
				panorama
				{
					background: url(`+ this.background +`) repeat-x;
					background-size: cover;
					opacity: `+ this.opacity +`;
				}
			`);
			
			// Изменение флага готовности цикла
			this.timeout = true;
			
			if (this.direction == 'mouse')
			{
				// Фикс области видимости переменной this
				var that = this;
				
				// Отслеживание координат курсора мыши
				document.onmousemove = function (e)
				{
					var event = e || window.event;
					that.mouse = event.pageX;
				}
				
				// Отслеживание размера окна сайта
				window.onresize = function ()
				{ that.ewidth = window.outerWidth }
			}
			
			// Запуск цикла
			this.trim();
			
			log('Panorama.init', 'запуск цикла.');
		}
		
		else
			log.error('Panorama.init', 'запуск невозможен в связи с отсутствием двух ключевых параметров - obj и background. Пожалуйста, укажите параметры перед продолжением инициализации.');
	}
	
	term()
	{
		log('Panorama.term', 'остановка цикла.')
		// Изменение флага готовности цикла
		this.timeout = false;
		
		// Удаляем основной стиль
		this.styleSet('init');
	}
	
	loadImage({onStart, onLoad})
	{
		log('Panorama.loadImage', 'предварительная загрузка изображения.')
		var one = new Image();
		
		one.src = this.background;
		one.onload = function() {
			log('Panorama.loadImage', 'изображение было загружено, наслаждайтесь :)');
			onLoad();
		}
		
		onStart();
	}
}
