function render(data) {
    window.data = data;
    // var menu = fzDOM.get('.tools');
    var side = fzDOM.get("side");
    var body = fzDOM.get('main');
    // var menudf = document.createDocumentFragment();
    var bodydf = document.createDocumentFragment();

    fzObject.walk(data, function(categoryName, items, index) {
        var h2Title = fzDOM.createDom('h2', categoryName);
        // menudf.appendChild(menuItem);

        var bodyItem = fzDOM.createDom('div');
        bodyItem.appendChild(h2Title);
        var ul = fzDOM.createDom('ol');

        fzArray.walk(items, function(obj) {
            var a = createA(obj);
            ul.appendChild(a);
        });
        bodyItem.appendChild(ul);
        bodydf.appendChild(bodyItem);
    });


    // fzObject.walk(searchEngines, function(country, items, index) {
    //     var h3Title = fzDOM.createDom('h3', country);
    //     var bodyItem = fzDOM.createDom('div');
    //     bodyItem.appendChild(h3Title);
    //     var ul = fzDOM.createDom('ol');
    //     fzArray.walk(items, function(obj) {
    //         var a = createA(obj);
    //         ul.appendChild(a);
    //     });
    //     bodyItem.appendChild(ul);
    //     bodydf.appendChild(bodyItem);
    // });


    body.appendChild(bodydf);

    function createA(obj) {
        var a = fzDOM.createDom('a', obj.title || obj.url, null, null, {
            href: obj.url,
            target: "_blank"
        });
        return fzDOM.addTo(fzDOM.createDom('li'), a);
    }
}

function render2(data) {
    var side = fzDOM.get("side");
    var body = fzDOM.get('main');
    // var menudf = document.createDocumentFragment();
    var bodydf = document.createDocumentFragment();
    var sidedf = document.createDocumentFragment();

    var categories = Object.keys(data);

    fzArray.walk(categories, function(c) {
        var a = fzDOM.createDom('a', c);
        a.onclick = showSublist;
        sidedf.appendChild(a);
    });
    side.appendChild(sidedf);
}

function showSublist(e) {
    var a = e.target;
    var t = a.innerText;
    var items = data[t];

    var bodyItem = fzDOM.createDom('div');
    // bodyItem.appendChild(h2Title);
    var ul = fzDOM.createDom('ol');

    fzArray.walk(items, function(obj) {
        var a = createA(obj);
        ul.appendChild(a);
    });
    bodyItem.appendChild(ul);
    fzDOM.resetChild('main', bodyItem);

    function createA(obj) {
        var a = fzDOM.createDom('a', obj.title || obj.url, null, null, {
            href: obj.url,
            target: "_blank"
        });
        return fzDOM.addTo(fzDOM.createDom('li'), a);
    }
}

$.get('./js/data.json', function(data) {
    window.data = data;
    render2(data);
});

// renderSearchEngine();