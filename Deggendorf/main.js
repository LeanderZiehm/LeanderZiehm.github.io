console.log("main.js loaded");


function getLinkElement(link) {
    return "<a href='" + link + "' target='_blank'>" + link + "</a>";
}




function getOrganizerProfileImagePath(index){
    //the path is the name but no spaces and no special characters
   
    const onganizerImage = eventsJson[index].organizer.image;
    if(onganizerImage){
        return `images/profiles/${onganizerImage}`;
    }else{
        const organizerName = eventsJson[index].organizer.name;
        const organizerPath = organizerName.replace(/[^a-zA-Z0-9]/g, '');
        const organizerProfileImagePath = `Organizers/${organizerPath}/profile.png`;
        return organizerProfileImagePath;
    }

  
}

function calculateDayNameFromDateString(dateString){
    const date = new Date(dateString);
    const dayName = date.toLocaleString('de-DE', { weekday: 'long' });
    return dayName;
}

function calculateTimeEnd(startTime, duration) {

    const minutesNumberString = duration.match(/\d+/)[0];  //"133 Min." => 133
    const minutesToAdd = parseInt(minutesNumberString);

    const [hours, minutes] = startTime.split(':').map(Number); //"19:30" => [19,30]
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    return formattedTime; // "21:43"
}


function getMyTimeString(index) {
    let event = eventsJson[index];

    let timeEnd = "";
    if (event.timeEnd) {
        timeEnd = " - " + event.timeEnd;
    } else if (event.timeStart && event.duration) {
        timeEnd = " - " + calculateTimeEnd(event.timeStart, event.duration);
    }
    const myTimeString = "⏱️ " + event.timeStart + timeEnd
    return myTimeString;

}

// localStorage.clear();

function loadLanguage(){
    const language = localStorage.getItem('language');
    // console.log(language);
    if (language === null || language === undefined) {
        // console.log('language is null');
        return getNaviagatorLanguage();
    } else {
        return language;
    }
}


let CURRENT_LANGUAGE = loadLanguage();
console.log("getLanguage() loaded:", CURRENT_LANGUAGE);

function setLanguage(language){
    CURRENT_LANGUAGE = language;
    localStorage.setItem('language', language);
}


function getLanguage(){
    return CURRENT_LANGUAGE;
}

function getNaviagatorLanguage(){
    const nav = navigator.language || navigator.userLanguage;
    // console.log(nav);

    if(nav.includes('de')){
        return 'de';
    }else{
        return 'en';
    }
}






function getDayName(dateString, language) {

    const dateParts = dateString.split(".");
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are zero-based in JavaScript
    const year = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    const dayIndex = date.getDay();

    switch (language) {
        case "en":
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        case "de":
            return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][dayIndex];
        case "es":
            return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dayIndex];
        default:
            return "Invalid language";
    }
}


function dateToString(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    // return `${day}.${month}.${year}`;
    return `${day}.${month}.${year}`;
}

function calculateNextDate(dayNumber) {


    var today = new Date();
    var dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    var daysUntilTuesday = dayNumber - dayOfWeek; // Tuesday is 2 days after Monday

    

    // if (daysUntilTuesday <= 0) {
    //     daysUntilTuesday += 7; // If today is Tuesday or later in the week, add 7 days to get to the next Tuesday

    // }

    var nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTuesday + 7);

    // console.log("dayNumber:",dayNumber,"nextDate:",nextDate)
    return nextDate;
}


function calculateDates(calculateString){

    let dateStringList = [];
    let nextDateString = ''
        var numberStr = calculateString.split(":")[1]; // Splitting the string and getting the part after the colon
        const calculateMultipleDates = numberStr.includes(',')
        if (calculateMultipleDates) {
            const nextDateStrings = numberStr.split(',').map(function (numberText) {
                var number = parseInt(numberText);
                return calculateNextDate(number);
            });

            dateStringList = nextDateStrings;
           
        } else {
            var number = parseInt(numberStr);
            nextDateString = calculateNextDate(number);
            dateStringList = [nextDateString];
        }

        return dateStringList;   
}

function stringToDate(str) {
    const dateRegex = /\b(\d{2}\.\d{2}\.\d{4})\b/;
    const foundDateString = dateRegex.exec(str)[1]; //15.05.2024
    var parts = foundDateString.split(".");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are zero-indexed in JavaScript Date objects
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);

    return date    
}

function calculateDateInfo(dateString){
    const toReturn = {};    
    let dates = [];
    if(dateString.startsWith("calculate:")){
        dates = calculateDates(dateString);  
        toReturn["weekly"] = true;
    }else{
        const date = stringToDate(dateString);
        dates = [date];
    }


    let dateText = "";

    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        let dateString = dateToString(date);

       if (i > 0) {
            dateText += " ";
            // dateText += ", ";
        }

        dateText += getDayName(dateString, CURRENT_LANGUAGE);
        dateText += " ";
        dateText += dateString;


    }

    toReturn["date"] = dates[0];
    toReturn["dateString"] = dateToString(dates[0]);
    toReturn["dateText"] = dateText;
    // toReturn['name'] = getDayName(dateString, "en")



    return toReturn;
}
















