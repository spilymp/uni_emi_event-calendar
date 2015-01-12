/**
 * Filter
 */

var filter = function () {

    init();

    $('.filter').click(function () {
        $('.calendar').hide();
        $('.event-box').remove();
        $('.showCalendar').show();
        filterInput($(this).text());
    });

    $('.showCalendar').click(function () {
        $('.calendar').show();
        $('.event-box').hide();
        $('.showCalendar').hide();
    });

    $('.searchBT').click(function () {
        $('.calendar').hide();
        $('.event-box').remove();
        $('.showCalendar').show();
        filterInput($("#searchInput").val());
    });
};

function init() {
    $('.filterResults').append('<input type="button" class="button showCalendar" value="Zurück zum Kalender"/>');
    $('.showCalendar').hide();
}

function validateDate(date) {
    // Prüfen ob leer
    if (date == '') return false;
    // Prüft ob es ein Datum ist
    var yearReg = '(19[0-9][0-9]|20[0-9][0-9])';    // Jahreszahl - Erlaubt eine Zahl zwischen 1900 and 2099
    var monthReg = '(0[1-9]|1[0-2])';               // Monat - Erlaubt eine Zahl zwischen 00 and 12
    var dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';   // Tag - Erlaubt eine Zahl zwischen 00 and 31

    var $dataReEx = new RegExp('^' + dayReg + '.' + monthReg + '.' + yearReg + '$', 'g');
    return date.match($dataReEx);
}

function filterInput(input) {
    // ganze XML-datei einlesen und in Variable 'XMLmediaArray' speichern
    $.get("resources/data/databank.xml", function (XMLmediaArray) {

        var $myMedia;
        var isDate = validateDate(input);
        // Falls es kein Datum ist
        var pattern = new RegExp(input, 'gi');

        var count = 0;

        // suche nach jedem 'event' abschnitt
        $(XMLmediaArray).find("event").each(function () {
            // gefundenen Abschnitt in Variable zwischenspeichern (cachen)
            $myMedia = $(this);
            if (isDate) {
                if ($myMedia.find("datum").text().contains(input)) {
                    appendResult($myMedia);
                    count++;
                }
            } else {
                if ($myMedia.find("tags").text().match(pattern)) {
                    appendResult($myMedia);
                    count++;
                } else {
                    if ($myMedia.find("titel").text().match(pattern)) {
                        appendResult($myMedia);
                        count++;
                    }
                }
            }
        });

        if (count == 0) {
            appendNothingFound(input);
        }
    });
}

function appendResult(result) {
    $('.filterResults').append(
        '<div class="event-box">' +
        '<h3>' + result.find("titel").text() + '</h3>' +
        '<div class="image-filter" >' + '<img src="' + result.find("image").text() + '" width="100%"/>' + '</div>' +
        '<table class="table-filter">' +
        '<tr>' +
        '<td class="bold">' + 'Zeit' + '</td>' +
        '<td>' + result.find("datum").text() + '<br/>' + result.find("zeit").text() + '</td>' +
        '</tr>' +

        '<tr>' +
        '<td class="bold">' + 'Ort' + '</td>' +
        '<td>' +
        (result.find("map").text() != '' ? '<a href="' + result.find("url").text() + '" target="_blank">' : '') +
        result.find("address").text() +
        (result.find("map").text() != '' ? '</a>' : '') +
        '</td>' +
        '</tr>' +

        '<tr>' +
        '<td class="bold">' + 'Eventlink' + '</td>' +
        '<td>' +
        (result.find("url").text() != '' ? '<a href="' + result.find("url").text() + '" target="_blank">' + 'Zum Event' + '</a>' : '- Kein Eventlink - ') +
        '</td>' +
        '</tr>' +

        '<tr>' +
        '<td class="bold">' + 'Tags' + '</td>' +
        '<td>' + result.find("tags").text() + '</td>' +
        '</tr>' +
        '</table>' +
        '<span class="description text-filter">' + result.find("text").text() + '</span>' +
        '</div>'
    );
}

function appendNothingFound(input) {
    $('.filterResults').append(
        '<div class="event-box">' +
        '<h3>' + 'Leider wurde für ihr Suche nach "' + input + '" nichts gefunden. Bitte beachten Sie, wenn Sie nach einem Datum suchen, dass Sie es im Format "dd.mm.yyyy" eingeben.' + '</h3>' +
        '</div>'
    );
}