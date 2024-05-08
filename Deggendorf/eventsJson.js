//

var eventsJson = [
    {
        "name": "Schwitzen im Sitzen",
        "date": "16.05.2024",
        "timeEntry": "17:00",
        "timeStart": "18:00",
        "descriptionShort": "Sendung über E-Sport und Gaming",
        "price": "Free",
        "language": "de",
        "images": ["1.jpg", "2.png", "3.png"],

        "descriptionLong": { "de": "Wir werfen einen Blick hinter die Kulissen des E-Sport. Wir haben auch wieder Gäste im Studio, die beiden Brüder Simon Schlegl (E-Sportler), Florian Schlegl (Vereinsgründer) und Simon Bauer (Kommentator). Sie wollen uns einen spannenden Einblick in ihren Alltag geben. Du bist ein leidenschaftlicher E-Sportler, E-Sports Fan oder willst einfach mehr über das Thema erfahren? Dann schalte gerne ein, oder komm zu uns an die THD und tauch mit uns in die spannende Welt des E-Sport ein." },
        "duration": "~2 Stunden",
        "likes": 5,
        "organizer":
        {
            "name": "Doschauher",
            "email":"info@doschauher.de",
            "website": "https://doschauher.tv/",
            "ratings": 4.9
        },
        "type": "hybrid",
        "onlineLink": "https://www.youtube.com/watch?v=DlDgj5LRujE",
        "location": {
            "name": "THD, Campus Deggendorf, J007",
            "maps": "https://maps.app.goo.gl/UfmUWQsr5Mu8Ar7N8",
            "description": "Base floor on the entrince straigt under the stairs through the glass door third room on the left."
        },
        "sharesGenerated": 5,
        "sharesClicked": 5
    },





        {
        "name": "Burning Cinema: Phantastische Tierwesen und wo sie zu finden sind",
        "date": "Donnerstag 18.04.2024",
        "timeEntry": "19:00",
        "timeStart": "19:30",
        "descriptionShort": "Studentenkino: Die Phantastischen Tierwesen führen uns zurück in die magische Welt von Harry Potter",
        "price": "5€",
        "language": "de",
        "images": ["1.jpg", "2.jpg", "3.webp"],

            "descriptionLong": {
                "de": `

                New York, 1926: Etwas Geheimnisvolles streift durch die Straßen, hinterlässt eine Spur der Verwüstung und droht die Gemeinschaft der Zauberer aufzudecken. Als Newt Scamander dort eintrifft, hat er gerade eine weltweite Exkursion abgeschlossen, mit der er magische Tierwesen erforschen und retten will. Doch als ein ahnungsloser No-Maj aus Versehen einige der Tierwesen freilässt, muss eine Gruppe ungewöhnlicher Helden die verschwundenen Geschöpfe wiederfinden. Durch ihre Mission geht die Gruppe allerdings auf Kollisionskurs mit dunklen Mächten.
                Die "Phantastischen Tierwesen" führen uns zurück in die magische Welt von Harry Potter, wenn auch 70 Jahre zuvor und in den USA angesiedelt.Voller Fantasie und Kreativität entstand eine spannende Inszenierung, die weltweit in den Kinos sagenhafte 800 Millionen US- Dollar einspielen konnte.
                
    R: David Yates
    UK, USA
    FSK 6
    Fantasy
    133 Min.

    Preise: 1 Oscar
    Nominierungen: 2 Oscars
` },
        "duration": "133 Min.",
        "likes": 5,
        "language": "de",
        "organizer":
        {
            "name": "Burning Cinema",
            "website": "https://www.unifilm.de/studentenkinos/Deggendorf",
            "instagram": "https://www.instagram.com/hochschulkino_deggendorf/",
            "email": "deggendorf@unifilm.de",
            "ratings": 4.9
        },
        "type": "in person",
        "location": {
            "name": "THD, Campus Deggendorf, J007",
            "maps": "https://maps.app.goo.gl/UfmUWQsr5Mu8Ar7N8",
            "description": "Base floor on the entrince straigt under the stairs through the glass door third room on the left."
        },
        "sharesGenerated": 5,
        "sharesClicked": 5
    },



    {
        "name": "Badminton",
        "date": "15.05.2024",
        "timeEntry": "5:15PM",
        "timeStart": "5:30PM",
        "descriptionShort": "Playing Badminton as university sports with students and friends",
        "price": "Free",
        "registration": "required",
        "language": "en",
        "images": ["1.jpg", "2.webp", "3.jpg"],

        "descriptionLong": { "en": "Join the official Badminton Whatsapp group: https://chat.whatsapp.com/LyGhAonrgY1CiWjjEsHVX2" },
        "duration": "1:30 hours",
        "likes": 5,
        "organizer":
        {
            "name": "Hendran Manimaran",
            "email": "hendran.manimaran@stud.th-deg.de",
            "website": "https://ilearn.th-deg.de/course/view.php?id=13241",
            "ratings": 4.9
        },
        "type": "in person",
        "location": {
            "name": "Dreifach- Turnhalle Comenius Gymnasium, Jahnstraße 8, 94469 Deggendorf(Zugang Jahnstraße über FOS / BOS) ",
            "maps": "https://maps.app.goo.gl/UfmUWQsr5Mu8Ar7N8",
            "description": "Base floor on the entrince straigt under the stairs through the glass door third room on the left."
        },
        "sharesGenerated": 5,
        "sharesClicked": 5
    },

    
];


function getOrganizerProfileImagePath(index){
    //the path is the name but no spaces and no special characters
    const organizerName = eventsJson[index].organizer.name;
    const organizerPath = organizerName.replace(/[^a-zA-Z0-9]/g, '');
    const organizerProfileImagePath = `Organizers/${organizerPath}/profile.png`;
    return organizerProfileImagePath;
}

function calculateDayNameFromDateString(dateString){
    const date = new Date(dateString);
    const dayName = date.toLocaleString('de-DE', { weekday: 'long' });
    return dayName;
}