import './../assets/sass/main.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiamdhbHZlejMwNDEiLCJhIjoiY2twYmFxbDQyMG01ZjJubGtqeHg0YzI4ZyJ9.fTRDFbf6KK5Da4Qp3XNWfg';

window.addEventListener("load", () => {
    loadMapView();
});

let markersPositions;
let hoy = new Date();
let time =  hoy.getHours() + ":" + (hoy.getMinutes() < 10? '0' : '') + hoy.getMinutes();
let mapPosition;
let view;
let map;
let weather;

const loadMapView = () => {
    view = "map";
    loadMarkers();
    loadMapInfo();
    renderMapViewHeader();
    renderMapViewMain();
    renderMapViewFooter();
}


const renderMapViewHeader = () => {
    const header = document.querySelector('.header');
    header.innerHTML = "<h2>Comprueba el tiempo en tu ciudad</h2>";
}


const renderMapViewMain = () => {
    const main = document.querySelector('.main');
    main.innerHTML = '<div id="my_map"></div>';
    renderMap();
    renderMarkers();
    initMapEvents();
}


const renderMapViewFooter = () => {
    const footer = document.querySelector('.footer');
    footer.innerHTML = '<span class="fa fa-crosshairs"></span><button>Ir a mi ubicación</button>';

    footer.addEventListener("click", () => {
        flyToLocation();
    });
}


const renderMap = () => {
    map = new mapboxgl.Map({
        container: "my_map",
        style: "mapbox://styles/jgalvez3041/ckpbee48o4ov918qtlye04wgk",
        center: [-74.5, 40],
        zoom: 9,
    });
    navigator.geolocation.getCurrentPosition(({coords}) => {
        map.flyTo({
            center: [coords.longitude, coords.latitude], 
            zoom: 12,
        });
    });
}


const renderMarkers = () => {
    markersPositions.forEach(m => {
        new mapboxgl.Marker().setLngLat([m.coord.lon, m.coord.lat]).addTo(map);
    })
}


const flyToLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        //
        map.flyTo({
            center: [lng, lat], 
            zoom: 9
        })
    });
}

const initMapEvents = () => {
    map.on("move", (ev) => {
        const center = ev.target.getCenter();
        const zoom = ev.target.getZoom();
        const storingObj = {
            lat: center.lat,
            lng: center.lng, 
            zoom: zoom
        };
        localStorage.setItem("map-info", JSON.stringify(storingObj));
    });

    
    map.on("click", async(ev) => {
        loadSingleView(ev.lngLat);
    });
}


const loadSingleView = async (lngLat) => {
    view = "single";
    loadSpinner();
    await fetchData(lngLat);

    unloadSpinner();
    renderSingleViewHeader();
    renderSingleViewMain();
    renderSingleViewFooter();
}


const loadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("opened");
}

const unloadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.remove("opened");
}

const fetchData = async (lngLat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=37b2f437fbd8bb2607e97906e5a4f780`;
    weather = await fetch(url).then(d => d.json()).then(d => d);
    console.log(weather);
}


const renderSingleViewHeader = () => {
    const header = document.querySelector('.header');
    header.innerHTML = `<div class = "location"><button><span class="fa fa-chevron-left"></span></button><h2>${weather.name}</h2></div>`;

    const buttonBack = header.querySelector("button");
    buttonBack.addEventListener("click", () => {
        loadMapView();
    })
}

const renderSingleViewMain = () => {
    const main = document.querySelector('.main');
    main.innerHTML = `<div class="weather_container"> <h4><i class="fa fa-clock-o"></i>Hour</h4> <h4><i class="fa fa-sun-o"></i>Degrees</h4> <h4><i class="fas fa-wind"></i>Wind</h4> </div><div class="fetch_container"><h5>${time}</h5><h5>${weather.main.temp} ºK</h5><h5>${weather.wind.speed} mph</h5></div>`;
}


const renderSingleViewFooter = () => {
    const footer = document.querySelector('.footer');
    footer.innerHTML = '<span class="fa fa-save"></span><button>Guardar ubicación</button>';

    footer.addEventListener("click", () => {
        saveMarker();
        loadMapView();
    });
}

const saveMarker = () => {
    markersPositions.push(weather);
    localStorage.setItem("markers", JSON.stringify(markersPositions));

    const storingObj = {
        lat: weather.coord.lat,
        lng: weather.coord.lon,
        zoom: 11
    };
    localStorage.setItem("map-info", JSON.stringify(storingObj));
}

const loadMarkers = () => {
    // localstorage
    const localStorageMarkers = localStorage.getItem("markers");
    if (localStorageMarkers == null) {
        markersPositions = [];
    } else {
        markersPositions = JSON.parse(localStorageMarkers);
    }
}


const loadMapInfo = () => {
    // localstorage
    const localStoragePosition = localStorage.getItem("map-info");
    if (localStoragePosition == null) {
        mapPosition = {
            center: [0,0],
            zoom: 12,
        };
    } else {
        mapPosition = JSON.parse(localStoragePosition);
    }
}