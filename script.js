if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

addEventListener("load",app);
function app() {
	class Fortune {
		constructor(fortuneList) {
			this.text = !fortuneList ? "Нет предсказания" : fortuneList[~~(Math.random() * fortuneList.length)];
			this.promo = this.generatePromo();
		}
		// Генерируем промокод: только буквы (слова, относящиеся к еде/скидке) и цифры, без спецсимволов
		generatePromo() {
			const bases = ["EDA","PIZZA","SUSHI","COFFEE","SNACK","LUNCH","DINNER","BONUS","SALE","EATS"];
			const discounts = [5,10,15,20,25,30,40,50];
			const pick = arr => arr[~~(Math.random()*arr.length)];
			const base = pick(bases);
			const d = pick(discounts);
			// Полезная уникальность: иногда добавляем двухзначный числовой суффикс
			let suffix = "";
			if (Math.random() < 0.5) {
				suffix = String(~~(Math.random()*90) + 10); // двухзначное число от 10 до 99
			}
			return (base + d + suffix).toUpperCase(); // пример: PIZZA20 или COFFEE1557
		}
	}

	// заменил выбор элементов и объявления переменных
	var cookieBtn = document.querySelector("button.fc"),
		openCtrl = document.querySelector(".open-btn"),
		fortuneText = document.querySelector(".fc-fortune-text"),
		fortunePromoEl = document.querySelector(".promo-code"),
		fortuneList = [
			"Сегодня идеальный вечер для пиццы — закажите с бонусом.",
			"Ко времени доставки добавится приятный сюрприз — проверьте приложение.",
			"Ваш следующий заказ будет со скидкой на напитки.",
			"Вкусные перемены рядом — попробуйте блюдо дня.",
			"Кофе придёт горячим и вовремя — отличное начало утра.",
			"Пицца вдвойне вкуснее с друзьями — пригласите одного.",
			"Утренний завтрак доставят быстрее обычного.",
			"Закажите десерт — вы заслужили маленькое удовольствие.",
			"Сегодня выгоднее покупать комбо — акция ждёт вас.",
			"Соберёте заказ на доставку — получите бонусные баллы.",
			"Не бойтесь экспериментировать — новое меню приятно удивит.",
			"Вечер кино и суши — отличное сочетание для отдыха.",
			"Завтрак принесёт заряд бодрости и хорошее настроение.",
			"Доставка пройдёт гладко — курьер найдёт вас быстро.",
			"У вас есть шанс выиграть промокод при следующем заказе.",
			"Насыщенный аромат блюда вернёт приятные воспоминания.",
			"Добавьте к заказу салат — баланс вкуса и пользы.",
			"Тёплый суп согреет в дождливый день — закажите сейчас.",
			"Экономия рядом: ищите значок акции в приложении.",
			"Сегодня — день новых вкусов. Позвольте себе что‑то необычное."
		],
		fortune = new Fortune(),
		animLock = false, // блокировка на время анимации/обработки

		getFortune = function(){
			fortune = new Fortune(fortuneList);
			fortuneText.innerHTML = fortune.text;
			// обновляем лишь содержимое бейджа с промокодом
			if (fortunePromoEl) {
				fortunePromoEl.textContent = fortune.promo;
				fortunePromoEl.setAttribute('title','Кликните, чтобы скопировать промокод');
			}
		},
		// Обновлённый nextState — защищён от повторного вызова
		nextState = function(){
			// если уже в процессе анимации — игнорируем нажатие
			if (animLock) return;
			animLock = true;
			// Всегда работаем с классами на элементе печенья
			let elClass = cookieBtn.classList,
				spawned = "spawned",
				opened = "opened";

			// если печенье в состоянии spawned — открыть (ломка)
			if (elClass.contains(spawned)) {
				elClass.remove(spawned);
				elClass.add(opened);
				// показываем конфетти при открытии
				showConfetti();

			// иначе — закрыть и подготовить новое печенье
			} else {
				elClass.remove(opened);
				elClass.add(spawned);
				getFortune();
			}

			// снять блокировку после окончания анимации (время чуть больше анимации)
			setTimeout(() => { animLock = false; }, 820);
		};
	
	// Показать конфетти (добавляет .show и удаляет через таймаут)
	function showConfetti(duration = 1500) {
		const c = document.querySelector('.confetti');
		if (!c) return;
		// если конфетти уже показываются — не перезапускать
		if (c._isShowing) return;
		c._isShowing = true;
		// показать (класс используется для видимости)
		c.classList.add('show');
		// скрыть через duration и сбросить флаг
		clearTimeout(c._hideTimeout);
		c._hideTimeout = setTimeout(() => {
			c.classList.remove('show');
			c._isShowing = false;
		}, duration);
	}

	// добавил: копирование промокода по клику (clipboard API + fallback) и краткую индикацию
	function copyPromo(e) {
		// предотвратить всплытие в кнопку-печенье
		if (e && e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault && e.preventDefault();
		}

		const el = fortunePromoEl;
		if (!el) return;
		const code = (el.textContent || "").trim();
		if (!code || code === '—') return;

		// если уже были действия — не дергать
		if (el._isCopying) return;
		el._isCopying = true;

		// визуальная обратная связь
		function flashCopied() {
			const prev = code;
			el.textContent = 'Скопировано!';
			el.classList.add('copied');
			setTimeout(() => {
				el.textContent = prev;
				el.classList.remove('copied');
				el._isCopying = false;
			}, 1100);
		}

		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(code).then(() => {
				flashCopied();
			}).catch(() => {
				fallbackCopy(code, flashCopied);
			});
		} else {
			fallbackCopy(code, flashCopied);
		}
	}

	function fallbackCopy(text, onDone) {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		try {
			document.execCommand('copy');
			onDone && onDone();
		} catch (e) {
			// ничего
			onDone && onDone();
		} finally {
			document.body.removeChild(ta);
		}
	}

	// Привязки: клик и клавиши для бейджа промокода
	if (fortunePromoEl) {
		fortunePromoEl.addEventListener('click', copyPromo);
		fortunePromoEl.addEventListener('keydown', function(e){
			// остановим всплытие, чтобы нажатие не активировало кнопку-печенье
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				e.stopPropagation();
				copyPromo(e);
			}
		});
	}

	// Инициализация: подготовить первое предсказание
	getFortune();

	// Подключаем оба обработчика: к управляющей кнопке и к самому печенью
	if (openCtrl) openCtrl.addEventListener("click", nextState);
	if (cookieBtn) cookieBtn.addEventListener("click", nextState);

}