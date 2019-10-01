class App {
    constructor() {
        this.jsonData = '';

        this.fetchData();
        this.selectFilter();
        this.clearAllFilters();
    }

    fetchData() {
        let self = this;

        fetch('channels.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.displayData(data);
                self.jsonData = data;
                self.filterOnInput();
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
    }

    displayData(data) {
        let mainContainer = document.getElementById("wrapper__channels");

        mainContainer.innerHTML = '';

        for (var i = 0; i < data.length; i++) {
            let listItem = document.createElement("li");
            listItem.innerHTML =
                '<div class="result">'+
                '<div class="result__head">'+
                '<a class="item-image" href="' + data[i].customUrl + '" target="_blank"><img src="'+data[i].thumbnails.default.url+ '"/></a></b>'+
                '<h2 class="item-title">' + data[i].title + '</h2>'+
                '</div>'+
                '<div class="result__body">'+
                '<div class="column"><b>SUBSCRIBERS:</b></br>' + data[i].statistics.subscriberCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</div>' +
                '<div class="column"><b>VIDEOS:</b></br>' + data[i].statistics.videoCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</div>' +
                '<div class="column"><b>VIEWS:</b></br>' + data[i].statistics.viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</div>' +
                '</div>'+
                '</div>';
            mainContainer.appendChild(listItem);
        }
    }

    selectFilter() {
        let inputs = document.querySelectorAll("input[type=radio]"),
            x = inputs.length
        self = this;

        while(x--)
            inputs[x].addEventListener("change",function(){
                self.filterData(this.id);
            },0);
    }

    filterData(filterType) {
        switch (filterType) {
            case 'sort-title':
                this.displayData(this.jsonData.sort(this.sortTitle));
                break;
            case 'sort-subscribers':
                this.displayData(this.jsonData.sort(this.sortSubscribers));
                break;
            case 'sort-videos':
                this.displayData(this.jsonData.sort(this.sortVideos));
                break;
            case 'sort-views':
                this.displayData(this.jsonData.sort(this.sortViews));
                break;
            default:
                console.log('Sorry, we are out of ' + expr + '.');
        }
    }

    sortSubscribers(a,b) {
        const valA = a.statistics.subscriberCount,
            valB = b.statistics.subscriberCount;

        return valB - valA;
    }

    sortVideos(a,b) {
        const valA = a.statistics.videoCount,
            valB = b.statistics.videoCount;

        return valB - valA;
    }

    sortViews(a,b) {
        const valA = a.statistics.viewCount,
            valB = b.statistics.viewCount;

        return valB - valA;
    }

    sortTitle(a,b) {
        const stringA = a.title.toUpperCase(),
            stringB = b.title.toUpperCase();

        let comparison = 0;
        if (stringA > stringB) {
            comparison = 1;
        } else if (stringA < stringB) {
            comparison = -1;
        }
        return comparison;
    }

    clearAllFilters() {
        let self = this,
            clearButton = document.getElementById('clear-all-filters');

        clearButton.addEventListener('click', function () {
            self.fetchData();
            self.clearRadios();
        });
    }

    clearRadios() {
        let allRadios = document.querySelectorAll("input[type=radio]");

        for (let i = 0; i < allRadios.length; i++) {
            allRadios[i].checked = false;
        }
    }

    filterOnInput() {
        let input = document.getElementById('search-field'),
            items = document.getElementById('wrapper__channels').getElementsByClassName('item-title');

        input.addEventListener('keyup', function(ev) {
            let text = ev.target.value;
            let pat = new RegExp(text, 'i');

            for (var i=0; i < items.length; i++) {
                var item = items[i];
                if (pat.test(item.innerText)) {
                    item.parentNode.style.display = 'block';
                } else {
                    item.parentNode.style.display = 'none';
                }
            }
        });
    }
}

var app = new App();