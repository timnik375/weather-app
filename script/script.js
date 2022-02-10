const searchInput = document.querySelector('.search-input');

function setCity(result) {
	const cityMainScreen = document.querySelector('.current-weather-city');

	cityMainScreen.innerText = result.split(',')[0];
}

async function getStartCity() {
	let url = `https://ipinfo.io?token=61ece34affeec7`;
	const res = await fetch(url);
	const data = await res.json();

	return {
		city: data.city,
		lat: data.loc.split(',')[0],
		lng: data.loc.split(',')[1]
	}
}

async function getForecast (coords) {
	let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&units=metric&exclude=minutely&appid=5e628221a7a5bced1cf0f16a9d4b768f`;

	const res = await fetch(url);
	const data = await res.json();

	return data;
}

function setCurrentLocationCard(data, elem) {
	const city = elem.querySelector('.location-time p');
	const conditions = elem.querySelector('.location-bottom-info p');
	const currentTemperature = elem.querySelector('.location-current-temperature p');
	const temperaturePeakHigh = elem.querySelector('.location-temperature-high');
	const temperaturePeakLow = elem.querySelector('.location-temperature-low');

	city.innerText = data.timezone.split('/')[1];
	conditions.innerText = data.current.weather[0].main;
	currentTemperature.innerText = Math.round(data.current.temp) + '°';
	temperaturePeakHigh.innerText = 'H:' + Math.round(data.daily[0].temp.max) + '°';;
	temperaturePeakLow.innerText = 'L:' + Math.round(data.daily[0].temp.min) + '°';
}

function setCardBackground(data, container) {
	const video = container.querySelector('.location video');

	switch (data.current.weather[0].main) {
		case 'Thunderstorm':
			video.setAttribute('src', `./video/lightning.mp4`);
			break;
		case 'Drizzle':
			video.setAttribute('src', `./video/drizzle.mp4`);
			break;
		case 'Rain':
			video.setAttribute('src', `./video/rain.mp4`);
			break;
		case 'Snow':
			video.setAttribute('src', `./video/snow.mp4`);
			break;
		case 'Clouds':
			video.setAttribute('src', `./video/clouds.mp4`);
			break;
		case 'Clear':
			video.setAttribute('src', `./video/sunny.mp4`);
			break
		default:
			video.setAttribute('src', `./video/sunny.mp4`);
			break;
	}
}

async function setStartScreen () {
	let startCityCoords = await getStartCity();
	let data = await getForecast(startCityCoords);

	setCity(startCityCoords.city);
	setCurrentLocationCard(data, document);

	setForecast(data);
	setCardBackground(data, document);
}

window.addEventListener('load', () => {
	setStartScreen();
	loadCard();
	setCardListeners();
})

function setCurrentWeather(data) {
	const currentTemp = document.querySelector('.current-weather-temperature p');
	const currentConditions = document.querySelector('.current-weather-conditions p');
	const currentWeatherPeakHigh = document.querySelector('.current-weather-peak-high p');
	const currentWeatherPeakLow = document.querySelector('.current-weather-peak-low p');

	currentTemp.innerText = Math.round(data.current.temp) + '°';
	currentConditions.innerText = data.current.weather[0].main;
	currentWeatherPeakHigh.innerText = 'H:' + Math.round(data.daily[0].temp.max) + '°';
	currentWeatherPeakLow.innerText = 'L:' + Math.round(data.daily[0].temp.min) + '°';

	if (currentConditions.innerText === 'Clouds' || currentConditions.innerText === 'Sunny') {
		document.querySelector('.content').classList.add('sunny-weather');
	}

	setVideoBackground(data.current.weather[0].main);
}

function setVideoBackground(data) {
	const mainBackground = document.querySelector('#myVideo');

	switch (data) {
		case 'Thunderstorm':
			mainBackground.setAttribute('src', `./video/lightning.mp4`);
			break;
		case 'Drizzle':
			mainBackground.setAttribute('src', `./video/drizzle.mp4`);
			break;
		case 'Rain':
			mainBackground.setAttribute('src', `./video/rain.mp4`);
			break;
		case 'Snow':
			mainBackground.setAttribute('src', `./video/snow.mp4`);
			break;
		case 'Clouds':
			mainBackground.setAttribute('src', `./video/clouds.mp4`);
			break;
		case 'Clear':
			mainBackground.setAttribute('src', `./video/sunny.mp4`);
			break
		default:
			mainBackground.setAttribute('src', `./video/sunny.mp4`);
			break;
	}
}

function setDailyForecast(data) {
	const dayForecastArr = document.querySelectorAll('.forecast-day-item');

	dayForecastArr.forEach((elem,index) => {
		elem.querySelector('.forecast-day-week-name').innerText = getDayWeek(new Date(data.daily[index].dt * 1000).getDay());
		elem.querySelector('.forecast-day-week-weather-icon').classList.add(getWeatherIcon(data.daily[index].weather[0].main));
		elem.querySelector('.forecast-day-temperature-low p').innerText = Math.round(data.daily[index].temp.min) + '°';
		elem.querySelector('.forecast-day-temperature-high p').innerText = Math.round(data.daily[index].temp.max) + '°';
	})
}

function getWeatherIcon(data) {
	switch (data) {
		case 'Thunderstorm':
			return 'lightning-icon';
		case 'Drizzle':
			return 'rain-icon';
		case 'Rain':
			return 'rain-icon';
		case 'Snow':
			return 'snow-icon';
		case 'Clouds':
			return 'clouds-icon';
		case 'Clear':
			return 'clear-icon';
		default:
			return 'clear-icon';
	}
}

function getDayWeek(dayNum) {
	switch (dayNum) {
		case 0:
			return 'Sun';
		case 1:
			return 'Mon';
		case 2:
			return 'Tue';
		case 3:
			return 'Wed';
		case 4:
			return 'Thu';
		case 5:
			return 'Fri';
		case 6:
			return 'Sat';
	}
}

function setHourForecast(data) {
	const hourForecastArr = document.querySelectorAll('.forecast-hour-item');

	hourForecastArr.forEach((elem, index) => {
		elem.querySelector('.forecast-hour-item-time p').innerText = new Date(data.hourly[index].dt * 1000).getHours();
		elem.querySelector('.forecast-hour-item-icon').classList.add(getWeatherIcon(data.hourly[index].weather[0].main));
		elem.querySelector('.forecast-hour-item-temperature p').innerText = Math.round(data.hourly[index].temp);
	})
}

function setUvIndexForecast (data) {
	const uvIndexLevelNum = document.querySelector('.uv-index-level-num');
	const uvIndexLevelText = document.querySelector('.forecast-details-item-description');

	uvIndexLevelNum.innerText = Math.round(data.current.uvi);
	uvIndexLevelNum.nextElementSibling.innerText = getUvIndexLevelText(Number(uvIndexLevelNum.innerText));
	uvIndexLevelText.innerText = uvIndexLevelNum.nextElementSibling.innerText + ' for the rest of the day';
}

function getUvIndexLevelText(num) {
	switch (true) {
		case num <= 2:
			return 'low';
		case num <= 5:
			return 'middle';
		case num <= 7:
			return 'high';
		case num <= 10:
			return 'very high';
		case num >= 11:
			return 'extreme';
	}
}

function setSunriseForecast(data) {
	const currentTimeSunrise = document.querySelector('.sunrise-time');
	const sunriseTime = document.querySelector('.sunrise .forecast-details-item-description');

	let dateObjCur = new Date(data.current.dt * 1000);
	let dateObjSunrise = new Date(data.current.sunrise * 1000);

	currentTimeSunrise.innerText = dateObjCur.getHours() + ':' + (dateObjCur.getMinutes() < 10? '0' + dateObjCur.getMinutes() : dateObjCur.getMinutes());
	sunriseTime.innerText = 'Sunrise: ' + dateObjSunrise.getHours() + ':' + dateObjSunrise.getMinutes();
}

function setFeelsLikeForecast(data) {
	const feelsLikeTime = document.querySelector('.feels-like-text');

	feelsLikeTime.innerText = Math.round(data.current.feels_like) + '°';
}

function setHumidityForecast(data) {
	const humidityLevel = document.querySelector('.humidity-text');
	const dewPointText = document.querySelector('.humidity .forecast-details-item-description');

	humidityLevel.innerText = data.current.humidity + '%';
	dewPointText.innerText = `The dew point is ${Math.round(data.current.dew_point)}° right now.`;
}

function setVisibilityForecast(data) {
	const visibilityLevel = document.querySelector('.visibility-text');

	visibilityLevel.innerText = Math.round(data.current.visibility/1000) + ' KM';
}

function setForecast(data) {
	// CURRENT WEATHER
	setCurrentWeather(data);

	// 10 DAY FORECAST
	setDailyForecast(data);

	// HOUR FORECAST
	setHourForecast(data);

	// UV INDEX
	setUvIndexForecast(data);

	// SUNRISE
	setSunriseForecast(data);

	// FEELS LIKE
	setFeelsLikeForecast(data);

	// HUMIDITY
	setHumidityForecast(data);

	// VISIBILITY
	setVisibilityForecast(data);
}

async function getCoordinates (city) {
	let url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=4e93e17ae30c430e9fbbfac23a9fbbab`;

	const res = await fetch(url);
	const data = await res.json();

	// setCity(data.results[0].formatted);
	// await getForecast(data.results[0].geometry);

	return data;
}

async function setSearchForecast () {
	let coords = await getCoordinates(searchInput.value);
	let data = await getForecast(coords.results[0].geometry);

	setCity(coords.results[0].formatted);
	await setForecast(data);
	await createLocationCard(data, coords.results[0].formatted);
	saveCardInfo(data, coords);
}

function saveCardInfo(data, coords) {
	localStorage.setItem(coords.results[0].formatted.split(',')[0], JSON.stringify({lat: data.lat, lng: data.lon}));
}

async function createLocationCard(data, coords) {
	const cardContainer = document.querySelector('.location-list');
	const currentCard = document.querySelector('.location');
	let newCard = currentCard.cloneNode(true);
	cardContainer.appendChild(newCard);

	setCurrentLocationCard(data, newCard);
	newCard.querySelector('.location-name p').innerText = coords.split(',')[0];
	newCard.querySelector('.location-time p').innerText = `${new Date(data.current.dt * 1000).getHours()}:${new Date(data.current.dt * 1000).getMinutes() < 10 ? '0' + new Date(data.current.dt * 1000).getMinutes() : new Date(data.current.dt * 1000).getMinutes()}`;

	newCard.addEventListener('click', (e) => {
		if (e.target.classList.contains('delete-location')) {
			e.target.parentNode.remove();
			localStorage.removeItem(coords.split(',')[0]);
		}

		if (e.currentTarget.querySelector('.location-name p').innerText === 'My location') {
			switchCard(e.currentTarget.querySelector('.location-time p').innerText);
		} else {
			switchCard(e.currentTarget.querySelector('.location-name p').innerText);
		}
	});

	setCardBackground(data, newCard);
}

async function loadCard() {
	for (let i = 0; i < localStorage.length; i++) {
		let key = localStorage.key(i);
		let data = await getForecast(JSON.parse(localStorage.getItem(key)));

		createLocationCard(data, key);
	}
}

searchInput.addEventListener('keyup', () => {
	if (event.keyCode === 13) {
		setSearchForecast();
		searchInput.value = '';
		matchList.innerHTML = '';
		searchContainer.classList.remove('search-container-active');
	}
});

async function switchCard(city) {
	let coords = await getCoordinates(city);
	let data = await getForecast(coords.results[0].geometry);

	setCity(coords.results[0].formatted);
	await setForecast(data);
}

function setCardListeners() {
	document.querySelectorAll('.location').forEach((elem) => {
		elem.addEventListener('click', (e) => {
			if (!e.target.classList.contains('delete-location')) {
				if (e.currentTarget.querySelector('.location-name p').innerText === 'My location') {
					switchCard(e.currentTarget.querySelector('.location-time p').innerText);
				} else {
					switchCard(e.currentTarget.querySelector('.location-name p').innerText);
				}
			}
		})
	})
}

// City autocomplete
const search = document.querySelector('.search-input');
const matchList = document.querySelector('.match-list');
const searchContainer = document.querySelector('.search-container');

// Search and filter it
async function searchCity(searchText) {
	if (searchText.length !== 0) {
		let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=pk.eyJ1IjoicWF6Ym9sYXQiLCJhIjoiY2t6Zm9sd3ViMnYwMjJ2bngyMzE5Y20zMSJ9.qBUkgW2YQOCwMn-KZgjv7w&cachebuster=1625641871908&autocomplete=true&types=place`;

		const res = await fetch(url);
		const data = await res.json();

		outputHtml(data.features.map(elem => elem['place_name']));
	} else {
		outputHtml([]);
	}

	chooseCity();
}

// Show search results in HTML
function outputHtml(matches) {
	if (matches.length > 0) {
		const html = matches.map(match => `
			<li class="match-item slideInDown">${match}</li>
		`).join('');

		matchList.innerHTML = html;
	} else {
		matchList.innerHTML = '';
		searchContainer.classList.remove('search-container-active');
	}
}

function chooseCity() {
	const matchItems = document.querySelectorAll('.match-item');

	matchItems.forEach((elem) => {
		elem.addEventListener('click', (e) => {
			searchInput.value = e.target.innerText;
			setSearchForecast();
			searchInput.value = '';
			matchList.innerHTML = '';
			searchContainer.classList.remove('search-container-active');
		})
	});
}

search.addEventListener('input', () => {
	searchContainer.classList.add('search-container-active');
	searchCity(search.value);
});
