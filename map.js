// Координаты центра карты
var center = [53.209756, 50.124466];

// Создание карты
DG.then(function () {
    var map = DG.map('map', {
        center: center,
        zoom: 13,
    });

    // Переменные для хранения элементов управления
    var zoomControl;
    var trafficControl;

    function updateMapSettings() {
        var zoomControlCheckbox = document.getElementById('zoomControlCheckbox');
        var trafficControlCheckbox = document.getElementById('trafficControlCheckbox');
        var maxZoomInput = document.getElementById('maxZoomInput');
        var minZoomInput = document.getElementById('minZoomInput');
        var scrollWheelZoomCheckbox = document.getElementById('scrollWheelZoomCheckbox');
        var draggingCheckbox = document.getElementById('draggingCheckbox');

        // Обновление элементов управления на карте
        if (zoomControlCheckbox.checked) {
            if (!zoomControl) {
                zoomControl = DG.control.zoom({ position: 'topright' });
                zoomControl.addTo(map);
            }
        } else {
            if (zoomControl) {
                map.removeControl(zoomControl);
                zoomControl = null;
            }
        }

        if (trafficControlCheckbox.checked) {
            if (!trafficControl) {
                trafficControl = DG.control.traffic();
                trafficControl.addTo(map);
            }
        } else {
            if (trafficControl) {
                map.removeControl(trafficControl);
                trafficControl = null;
            }
        }

        // Настройка максимального приближения и удаления
        map.setMinZoom(Number(minZoomInput.value));
        map.setMaxZoom(Number(maxZoomInput.value));

        // Включение/отключение приближения колесиком мыши
        if (scrollWheelZoomCheckbox.checked) {
            map.scrollWheelZoom.enable();
        } else {
            map.scrollWheelZoom.disable();
        }

        // Включение/отключение перетаскивания карты
        if (draggingCheckbox.checked) {
            map.dragging.enable();
        } else {
            map.dragging.disable();
        }
    }

    // Обработчик изменений состояния флажка "Элемент управления масштабом"
    var zoomControlCheckbox = document.getElementById('zoomControlCheckbox');
    zoomControlCheckbox.addEventListener('change', function () {
        updateMapSettings();
    });

    // Обработчик изменений состояния флажка "Элемент управления трафиком"
    var trafficControlCheckbox = document.getElementById('trafficControlCheckbox');
    trafficControlCheckbox.addEventListener('change', function () {
        updateMapSettings();
    });

    // Обработчик изменений настроек
    var controls = document.getElementById('controls');
    controls.addEventListener('change', function () {
        updateMapSettings();
    });

    // Отображение маркеров на карте
    markers.forEach(function(marker) {
        var myIcon = DG.icon({
            iconUrl: marker.image,
            iconSize: [46, 46]
        });

        var mark = DG.marker([marker.coords1, marker.coords2], {icon: myIcon});
        mark.addTo(map);
        mark.bindPopup(marker.name).bindLabel(marker.name);
        mark.on('click', function (e) {
            map.setView([e.latlng.lat, e.latlng.lng]);
        });
    });

    // Отображение маршрутов в списке
    var openInterfaceButton = document.getElementById('openInterfaceButton');
    openInterfaceButton.addEventListener('click', function () {
        openRouteInterface();
    });

    // Обработчик клика на кнопку "Сохранить"
    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function () {
        var routeNameInput = document.getElementById('routeName');
        var startAddressInput = document.getElementById('startAddress');
        var endAddressInput = document.getElementById('endAddress');

        var routeName = routeNameInput.value;
        var startAddress = startAddressInput.value;
        var endAddress = endAddressInput.value;

        // Создание объекта маршрута
        var route = {
            name: routeName,
            start: startAddress,
            end: endAddress,
        };

        // Добавление маршрута в список доступных маршрутов или отправка данных на сервер
        routes.push(route);

        // Очистка полей ввода
        routeNameInput.value = '';
        startAddressInput.value = '';
        endAddressInput.value = '';
        console.log(routes);
        // Закрытие интерфейса
        closeRouteInterface();
    });

    function openRouteInterface() {
        var routeInterface = document.getElementById('routeInterface');
        routeInterface.style.display = 'block';
    }

    function closeRouteInterface() {
        var routeInterface = document.getElementById('routeInterface');
        routeInterface.style.display = 'none';
    }
    var openMarkerInterfaceButton = document.getElementById('openMarkerInterfaceButton');
    openMarkerInterfaceButton.addEventListener('click', function () {
        openMarkerInterface();
    });

// Обработчик клика на кнопку "Закрыть"
    var closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', function () {
        closeMarkerInterface();
    });

    function openMarkerInterface() {
        var markerInterfaceOverlay = document.getElementById('markerInterfaceOverlay');
        markerInterfaceOverlay.style.display = 'flex';
    }

    function closeMarkerInterface() {
        var markerInterfaceOverlay = document.getElementById('markerInterfaceOverlay');
        markerInterfaceOverlay.style.display = 'none';
    }

    function previewMarker() {
        var markerNameInput = document.getElementById('markerName').value;
        var markerAddressInput = document.getElementById('markerAddress').value;
        var markerLinkInput = document.getElementById('markerLink').value;
        var markerSizeInput = document.getElementById('markerSize').value;
        var markerOpacityInput = document.getElementById('markerOpacity').value;
        var markerImageInput = document.getElementById('markerImage').files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
            var previewIcon = DG.icon({
                iconUrl: e.target.result,
                iconSize: [markerSizeInput, markerSizeInput],
                opacity: markerOpacityInput,
            });

            var previewMarker = DG.marker(map.getCenter(), {icon: previewIcon}).addTo(map);
            previewMarker.bindPopup(markerNameInput);
        }
    }
});
