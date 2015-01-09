var manageCalendar = function () {

    var todaydate = new Date();

    // Aktueller Monat
    var curmonth = todaydate.getMonth() + 1;

    // Aktuelles Jahr
    var curyear = todaydate.getFullYear();

    buildHead();

    // Zurück Monat
    $('.back').click(function () {
        if (curmonth == 1) {
            curmonth = 12;
            curyear--;
        } else {
            curmonth--;
        }
        buildCal(curmonth, curyear);
    });

    // Zurück Jahr
    $('.back-year').click(function () {
        curyear--;
        buildCal(curmonth, curyear);
    });

    // Vorwärts Monat
    $('.forward').click(function () {
        if (curmonth == 12) {
            curmonth = 1;
            curyear++;
        } else {
            curmonth++;
        }
        buildCal(curmonth, curyear);
    });

    // Vorwärts Jahr
    $('.forward-year').click(function () {
        curyear++;
        buildCal(curmonth, curyear);
    });

    // Aktuell
    $('.current').click(function () {
        curmonth = todaydate.getMonth() + 1;
        curyear = todaydate.getFullYear();
        buildCal(curmonth, curyear);
    });

    buildCal(curmonth, curyear);
};

function buildHead() {
    var days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    $('.calendar')
        .append('<div class="calendar-nav">')
        .append('<div class="calendar-head">')
        .append('<div class="calendar-body">');

    $('.calendar-nav')
        .append('<div class="back-forward">')
        .append('<div class="current-date">' + '&nbsp;' + '</div>');

    $('.back-forward')
        .append('<input type="button" class="button back-year" value="<<"/>')
        .append('<input type="button" class="button back" value="<"/>')
        .append('<input type="button" class="button current" value="today"/>')
        .append('<input type="button" class="button forward" value=">"/>')
        .append('<input type="button" class="button forward-year" value=">>"/>');

    //Füllt den Head-Bereich mit den Wochentagen.
    for (var c = 0; c < days.length; c++) {
        $('.calendar-head')
            .append('<div class="days">' + days[c] + '</div>');
    }
}

function buildCal(m, y) {

    $('.calendar-body')
        .empty();

    var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    var dim = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var oD = new Date(y, m - 1, 1);
    oD.od = oD.getDay() + 1;

    var todaydate = new Date();

    // Gucken ob aktueller Monat und Jahr
    var scanfortoday = (y == todaydate.getFullYear() && m == todaydate.getMonth() + 1) ? todaydate.getDate() : 0;

    // Prüfen ob Schaltjahr
    dim[1] = (((oD.getFullYear() % 100 != 0) && (oD.getFullYear() % 4 == 0)) || (oD.getFullYear() % 400 == 0)) ? 29 : 28;

    var $tag;
    var $classT;

    for (i = 1; i <= 42; i++) {
        var x = ((i - oD.od >= 0) && (i - oD.od < dim[m - 1])) ? i - oD.od + 1 : '&nbsp;';

        $tag = (x == '&nbsp;' ? i + 'last' : ((x < 10 ? ('0' + x) : '' + x) + (oD.getMonth() + 1) + oD.getFullYear()));
        $classT = '.' + $tag;
        $('.calendar-body ').append('<div class="day-box ' + $tag + '">');

        if (x == scanfortoday) $($classT).append('<div class="tag today">' + x + '</div>');
        else $($classT).append('<div class="tag">' + x + '</div>');
    }

    var $datumString = '';
    var $myMedia;

    // ganze XML-datei einlesen und in Variable 'XMLmediaArray' speichern
    $.get("resources/data/databank.xml", function (XMLmediaArray) {

        // suche nach jedem 'event' Abschnitt
        $(XMLmediaArray).find("event").each(function () {

            // gefundenen Abschnitt in Variable zwischenspeichern (cachen)
            $myMedia = $(this);
            $datumString = $myMedia.find("datum").text();
            if ($datumString != '') {
                $datumString = replaceAll(".", "", $datumString);
                $datumString = replaceAll(" ", "", $datumString);
                if ($datumString.contains('-')) {
                    cacheArray = $datumString.split('-');
                    $datumString = cacheArray[cacheArray.length - 1];
                }

                var $classDatumString = '.' + $datumString;

                if ($classDatumString != '.' && $classDatumString != null) {
                    // Wenn Datum des Events im Kalender gefunden wird, wird es angehängt.
                    $($classDatumString).append(
                        '<div class="event">' +
                        '<div class="event-title">' +
                        '<a class="event-link" href="#">' + $myMedia.find("titel").text() + '</a>' +
                        '</div>' +
                        '<div class="tooltip">' +
                        '<table>' +

                        '<tr>' +
                        '<td width="25%">' + 'Wann?' + '</td>' +
                        '<td>' + $myMedia.find("zeit").text() + ' Uhr' + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'Wo?' + '</td>' +
                        '<td>' + $myMedia.find("address").text() + '</td>' +
                        '</tr>' +

                        '<tr>' +
                        '<td>' + 'Tags' + '</td>' +
                        '<td>' + $myMedia.find("tags").text() + '</td>' +
                        '</tr>' +
                        '</table>' +
                        '</div>' +
                        '</div>'
                    );
                }

                $($classDatumString + ' .event .event-link').click(function () {
                    $('.calendar').hide();
                    $('.event-box').remove();
                    $('.showCalendar').show();
                    filterInput($(this).text());
                });
            }
        });

    });
    $('.current-date')
        .empty()
        .text(months[oD.getMonth()] + ' ' + oD.getFullYear());
}

function replaceAll(find, replace, str) {
    var tempStr = str.replace(find, replace);
    if (tempStr.contains(find)) {
        return replaceAll(find, replace, tempStr);
    }
    return tempStr;
}

$(document).ready(function () {
    manageCalendar();
    filter();
});