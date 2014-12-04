/**
 * Bekannte Bugs:
 *
 * #1 - Jahreswechsel funktioniert, wenn man rückwärts geht, nicht.
 * #2 - Beim Jahreswechsel werden die Tage des alten Monats falsch berechnet.
 */

var calendar = function () {

    var date = new Date();

    createCalendarHead(date);
    createCalendar(date);

    // Zurück Monat
    $('.back').click(function () {
        date = decreaseMonth(date);
        $('.calendar-body').empty();
        createCalendar(date);
    });

    // Zurück Jahr
    $('.back-year').click(function () {
        date.setYear(date.getYear() - 1);
        $('.calendar-body').empty();
        createCalendar(date);
    });

    // Vorwärts Monat
    $('.forward').click(function () {
        date = increaseMonth(date);
        $('.calendar-body').empty();
        createCalendar(date);
    });

    // Vorwärts Jahr
    $('.forward-year').click(function () {
        date.setYear(date.getYear() + 1);
        $('.calendar-body').empty();
        createCalendar(date);
    });

    // Aktuell
    $('.current').click(function () {
        date = new Date();
        $('.calendar-body').empty();
        createCalendar(date);
    });
};

function increaseMonth(d) {
    if (d.getMonth() == 11) {
        d.setMonth(0);
        d.setYear(d.getYear() + 1);
    } else {
        d.setMonth(d.getMonth() + 1);
    }

    return d;
}

function decreaseMonth(d) {
    if (d.getMonth() == 0) {
        d.setMonth(11);
        d.setYear(d.getYear() - 1);
    } else {
        d.setMonth(d.getMonth() - 1);
    }

    return d;
}

function getLastMonth(d) {
    if (d.getMonth() == 0) {
        return 11
    } else {
        return d.getMonth() - 1;
    }
}

function replaceAll(find, replace, str) {
    var tempStr = str.replace(find, replace);
    if (tempStr.contains(find)) {
        return replaceAll(find, replace, tempStr);
    }
    return tempStr;
}

function createCalendarHead(d) {

    var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    var days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    // Fügt dem Kalender einen Head-Bereich und einen Body-Bereich hinzu.
    $('.calendar')
        .append('<div class="calendar-nav">')
        .append('<div class="calendar-head">')
        .append('<div class="calendar-body">');

    $('.calendar-nav')
        .append('<div class="back-forward">')
        .append('<div class="current-date">' + months[d.getMonth()] + ' ' + (d.getYear() <= 200 ? d.getYear() + 1900 : d.getYear()) + '</div>');

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

function createCalendar(date) {

    var months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var d = date;
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getYear();

    // Passt das Jahr entsprechend an.
    year <= 200 ? year += 1900 : year;

    // Prüft ob Schaltjahr
    year % 4 == 0 && year != 1900 ? days_in_month[1] = 29 : days_in_month;

    // Anzahl Tage im aktuellen Monat
    var total = days_in_month[month];

    // Berechnen der letzen Tage des Monats
    var DatumMonat = d;
    DatumMonat.setDate(1);
    var ErsterTag = DatumMonat.getDay();

    // Ergänzt die Tage noch des letzten Monats
    for (var i = 1; i < ErsterTag; i++) {
        $('.calendar-body').append('<div class="day-box last-month">' +
        (days_in_month[getLastMonth(d)] - ((ErsterTag - 1) - i)) +
        '</div>');
    }

    var $tagDatum;
    var $classTagDatum;

    for (i = 1; i <= total; i++) {

        // Aktuelles Datum als String erstellen.
        $tagDatum = (i < 10 ? '0' + i : i) + '' + (month + 1) + '' + year;
        $classTagDatum = "." + $tagDatum;

        $('.calendar-body ').append('<div class="day-box ' + $tagDatum + '">');

        if (day == i) $($classTagDatum).append('<div class="tag today">' + i + '</div>');
        else $($classTagDatum).append('<div class="tag">' + i + '</div>')
    }

    var $datumString;
    var $myMedia;

    // ganze XML-datei einlesen und in Variable 'XMLmediaArray' speichern
    $.get("data/databank.xml", function (XMLmediaArray) {

        // suche nach jedem 'event' abschnitt
        $(XMLmediaArray).find("event").each(function () {

            // gefundenen Abschnitt in Variable zwischenspeichern (cachen)
            $myMedia = $(this);
            $datumString = "." + replaceAll(".", "", $myMedia.find("datum").text());

            // Wenn Datum des Events im Kalender gefunden wird, wird es angehängt.
            $($datumString).append(
                '<div class="event">' +
                $myMedia.find("titel").text() +
                '</div>'
            );
        });
    });

    $('.current-date')
        .empty()
        .text(months[month] + ' ' + (year <= 200 ? year + 1900 : year));
}

$(document).ready(function () {
    calendar();
    filter();
});