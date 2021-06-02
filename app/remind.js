

window.addEventListener("load", () => {
    loadMapView();
});

const loadMapView = () => {
    // render HTML...

    // events
    loadFetchView();
    setTimeout(() => {
        unloadFetchView();
        loadSingleView();
    }, 1000)
    
};




const loadFetchView = () => {

}
const unloadFetchView = () => {
    
}




const loadSingleView = () => {

    loadMapView();
}