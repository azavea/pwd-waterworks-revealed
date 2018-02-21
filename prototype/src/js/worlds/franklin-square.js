export const tilesUrl =
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

export const initialMapCenter = [39.955646, -75.150437];

export const initialZoom = 19;
export const minZoom = 17;
export const maxZoom = 22;

export const defaultZoneRadius = 8; // meters
export const zoneBuffer = 0.002; // kilometers

export const zones = [
    {
        name: 'The Twilight Zone',
        desc:
            "You're traveling through another dimension, a dimension not only of sight and sound but of mind. A journey into a wondrous land whose boundaries are that of imagination.",
        lat: 39.956341,
        lng: -75.149916,
        bearing: 5,
        tour: [
            {
                image: 'twilight.jpg',
                caption:
                    'The Twilight Zone is an American media franchise based on the anthology television series created by Rod Serling. The episodes are in various genres, including fantasy, science fiction, suspense, and psychological thriller, often concluding with a macabre or unexpected twist, and usually with a moral. A popular and critical success, it introduced Americans to common science fiction and fantasy tropes. The original series, shot entirely in black and white, ran on CBS for five seasons from 1959 to 1964.'
            }
        ]
    },
    {
        name: 'Habitable Zone',
        desc:
            'In astronomy and astrobiology, the circumstellar habitable zone (CHZ), or simply the habitable zone, is the range of orbits around a star within which a planetary surface can support liquid water given sufficient atmospheric pressure.',
        lat: 39.955942,
        lng: -75.150737,
        bearing: 185,
        tour: [
            {
                image: 'habitable.gif',
                caption:
                    "In astronomy and astrobiology, the circumstellar habitable zone (CHZ), or simply the habitable zone, is the range of orbits around a star within which a planetary surface can support liquid water given sufficient atmospheric pressure.[1][2][3][4][5] The bounds of the CHZ are based on Earth's position in the Solar System and the amount of radiant energy it receives from the Sun. Due to the importance of liquid water to Earth's biosphere, the nature of the CHZ and the objects within it may be instrumental in determining the scope and distribution of Earth-like extraterrestrial life and intelligence."
            }
        ]
    },
    {
        name: 'Demilitarized Zone',
        desc:
            'A demilitarized zone, DMZ or DZ[1] is an area in which treaties or agreements between nations, military powers or contending groups forbid military installations, activities or personnel.',
        lat: 39.95505,
        lng: -75.150844,
        bearing: 275,
        tour: [
            {
                image: 'demilitarized.jpg',
                caption:
                    'Many demilitarized zones are considered neutral territory because neither side is allowed to control it, even for non-combat administration. Some zones remain demilitarized after an agreement has awarded control to a state which (under the DMZ terms) had originally ceded its right to maintain military forces in the disputed territory. It is also possible for powers to agree on the demilitarization of a zone without formally settling their respective territorial claims, enabling the dispute to be resolved by peaceful means such as diplomatic dialogue or an international court.'
            }
        ]
    },
    {
        name: 'Eastern Time Zone',
        desc:
            'The Eastern Time Zone (ET) encompasses 17 U.S. states in the eastern part of the contiguous United States, parts of eastern Canada, the state of Quintana Roo in Mexico, Panama in Central America, and the Caribbean Islands.',
        lat: 39.955013,
        lng: -75.149938,
        bearing: 95,
        tour: [
            {
                image: 'easterntime.jpg',
                caption:
                    'In the northern parts of the time zone, on the second Sunday in March, at 2:00 a.m. EST, clocks are advanced to 3:00 a.m. EDT leaving a one-hour "gap". On the first Sunday in November, at 2:00 a.m. EDT, clocks are moved back to 1:00 a.m. EST, thus "duplicating" one hour. Southern parts of the zone (Panama and the Caribbean) do not observe daylight saving time.'
            }
        ]
    }
];
