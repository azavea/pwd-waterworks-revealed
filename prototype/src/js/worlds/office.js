export const tilesUrl = 'https://990.azavea.com/floorplan/{z}/{x}/{y}.png';

export const initialMapCenter = [39.96133, -75.15416];

export const initialZoom = 21;
export const minZoom = 20;
export const maxZoom = 22;

export const defaultZoneRadius = 4; // meters
export const zoneBuffer = 0.002; // kilometers

export const zones = [
    {
        name: 'The Twilight Zone',
        desc:
            "You're traveling through another dimension, a dimension not only of sight and sound but of mind. A journey into a wondrous land whose boundaries are that of imagination.",
        lat: 39.96142,
        lng: -75.15414,
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
        lat: 39.96119,
        lng: -75.15405,
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
        lat: 39.961215,
        lng: -75.15427,
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
        lat: 39.96133,
        lng: -75.15393,
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

export function styleArea(feature, layer) {
    function getAreaColor(areaType) {
        // colors from http://www.colourlovers.com/palette/1473/Ocean_Five
        // actually from http://www.colourlovers.com/palette/932683/Compatible
        let color;
        switch (areaType) {
            case 'Meeting':
                color = '#8EBE94';
                break;
            case 'Phone':
                color = '#4E395D';
                break;
            case 'Lounge':
                color = '#DC5B3E';
                break;
            case 'Relax':
                color = '#827085';
                break;
            case 'Conference':
                color = '#CCFC8E';
                break;
            default:
                color = '#CCC';
                break;
        }
        return color;
    }

    return {
        fillColor: getAreaColor(feature.properties.type),
        weight: 0,
        opacity: 1.0,
        fillOpacity: 0.6
    };
}

export const areas = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                id: 0,
                type: 'Lounge',
                name: '',
                area: 119
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15448543971175, 39.96125652642846],
                        [-75.15453394915988, 39.96125728377812],
                        [-75.15452828642165, 39.961282888198234],
                        [-75.15448358137297, 39.96128088446762],
                        [-75.15448543971175, 39.96125652642846]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 1,
                type: 'Meeting',
                name: 'Salta',
                area: 64
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15448195486407, 39.96128081156567],
                        [-75.15445928195419, 39.961279795340296],
                        [-75.15445935736479, 39.96127880690178],
                        [-75.15445615359245, 39.9612786633051],
                        [-75.15445793652064, 39.96125529370402],
                        [-75.15448381320286, 39.96125645352649],
                        [-75.15448195486407, 39.96128081156567]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 2,
                type: 'Phone',
                name: '',
                area: 24
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15445551709382, 39.96126691002052],
                        [-75.15443333708049, 39.96126591588717],
                        [-75.15443414505401, 39.961255325432234],
                        [-75.15445622649355, 39.96125631514759],
                        [-75.15445551709382, 39.96126691002052]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 3,
                type: 'Phone',
                name: '',
                area: 24
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15445533502945, 39.96126799994896],
                        [-75.15445462832358, 39.961278559510376],
                        [-75.15443244561638, 39.96127760068688],
                        [-75.15443325358991, 39.961267010233755],
                        [-75.15445533502945, 39.96126799994896]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 4,
                type: 'Meeting',
                name: 'Saigon',
                area: 133
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15438434101046, 39.961278668010294],
                        [-75.15434003028453, 39.96127668195355],
                        [-75.15434225759947, 39.961247487583776],
                        [-75.15438666689917, 39.96124947805955],
                        [-75.15438434101046, 39.961278668010294]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 5,
                type: 'Meeting',
                name: 'Mumbai',
                area: 137
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15433850234942, 39.96127661346977],
                        [-75.15429256508695, 39.96127455451039],
                        [-75.15429479240191, 39.961245360139074],
                        [-75.15434072966437, 39.96124741909996],
                        [-75.15433850234942, 39.96127661346977]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 6,
                type: 'Meeting',
                name: 'Nairobi',
                area: 182
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15423623986231, 39.961242700337685],
                        [-75.1542340098551, 39.961271929998],
                        [-75.15417333521782, 39.96126921049202],
                        [-75.15417556522502, 39.96123998083051],
                        [-75.15423623986231, 39.961242700337685]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 7,
                type: 'Storage',
                name: '',
                area: 89
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15417403726228, 39.96123991234546],
                        [-75.1541718072551, 39.961269142007005],
                        [-75.15414223393162, 39.96126781649708],
                        [-75.15414446393882, 39.96123858683498],
                        [-75.15417403726228, 39.96123991234546]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 8,
                type: 'Work',
                name: '',
                area: 100
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15414288667537, 39.961238516140206],
                        [-75.15414065666818, 39.96126774580235],
                        [-75.15410674590478, 39.961266225883435],
                        [-75.15410885740917, 39.96123854948817],
                        [-75.1541336696535, 39.96123810302265],
                        [-75.15414288667537, 39.961238516140206]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 9,
                type: 'Conference',
                name: 'Sydney',
                area: 337
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15422808203805, 39.961209604530936],
                        [-75.15412917378261, 39.961205171346776],
                        [-75.15413202198111, 39.96117210833482],
                        [-75.15423073919519, 39.961176072468284],
                        [-75.15422808203805, 39.961209604530936]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 10,
                type: 'Phone',
                name: '',
                area: 26
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.1541275819616, 39.96120509999944],
                        [-75.1541114151978, 39.961204375386096],
                        [-75.15411263523808, 39.96118838378078],
                        [-75.15412880200188, 39.96118910839431],
                        [-75.1541275819616, 39.96120509999944]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 11,
                type: 'Phone',
                name: '',
                area: 26
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15412888549245, 39.96118801404643],
                        [-75.15411271872867, 39.96118728943287],
                        [-75.15411389836898, 39.96117182736394],
                        [-75.1541300651344, 39.96117255195647],
                        [-75.15412888549245, 39.96118801404643]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 12,
                type: 'Meeting',
                name: 'Jakarta',
                area: 60
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15387616812876, 39.96118788039487],
                        [-75.15387496964004, 39.96121007185445],
                        [-75.1538485785428, 39.96120917235452],
                        [-75.15385029144655, 39.96118672057125],
                        [-75.15387616812876, 39.96118788039487]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 13,
                type: 'Meeting',
                name: 'Shanghai',
                area: 134
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.1538748376711, 39.96121180162891],
                        [-75.1538744983227, 39.961216249617],
                        [-75.15387273155285, 39.961239407436665],
                        [-75.15381821803959, 39.96123696407808],
                        [-75.15381956466265, 39.96121931330446],
                        [-75.15382769731764, 39.96121967781955],
                        [-75.15382799087996, 39.96121582996992],
                        [-75.15384810076254, 39.96121673129711],
                        [-75.15384849505222, 39.96121026670207],
                        [-75.1538748376711, 39.96121180162891]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 14,
                type: 'Meeting',
                name: 'Tokyo',
                area: 193
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15387264537003, 39.96124053707227],
                        [-75.1538699871361, 39.96127537968381],
                        [-75.15382080216547, 39.96127317515783],
                        [-75.15382077363739, 39.96127218206057],
                        [-75.153817224843, 39.96127202299957],
                        [-75.15381757227142, 39.96126746910712],
                        [-75.15381589646184, 39.96126739399544],
                        [-75.15381813185513, 39.961238093734885],
                        [-75.15387264537003, 39.96124053707227]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 15,
                type: 'Meeting',
                name: 'Kiev',
                area: 198
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15381359319761, 39.96129499092327],
                        [-75.15386830385846, 39.96129744311615],
                        [-75.15386574796895, 39.96133094422779],
                        [-75.15386253134263, 39.96133287047641],
                        [-75.15381274867025, 39.96133069407715],
                        [-75.15381330347817, 39.9613234219792],
                        [-75.15381143049338, 39.96132333802996],
                        [-75.15381359319761, 39.96129499092327]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 16,
                type: 'Meeting',
                name: 'Madrid',
                area: 248
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15388364120572, 39.96133496964575],
                        [-75.15388121728515, 39.96136674096854],
                        [-75.15383710373442, 39.96136476375196],
                        [-75.15383679936897, 39.96136875283058],
                        [-75.15381678808943, 39.96136785590361],
                        [-75.15381665342663, 39.961369620983696],
                        [-75.15380837099964, 39.9613699227639],
                        [-75.15381086992882, 39.961337168274106],
                        [-75.15381225311131, 39.961337189573484],
                        [-75.15381266517969, 39.961331788422775],
                        [-75.15388364120572, 39.96133496964575]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 17,
                type: 'Conference',
                name: 'Istanbul',
                area: 1555
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15397337018769, 39.96133998321412],
                        [-75.15398302769331, 39.96121487971253],
                        [-75.1540974824739, 39.96122000970941],
                        [-75.15409394317714, 39.96126678556985],
                        [-75.15410494700099, 39.96126841227167],
                        [-75.15409926096125, 39.96134294158062],
                        [-75.15409665001197, 39.961345354661745],
                        [-75.15397337018769, 39.96133998321412]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 18,
                type: 'Mechanical',
                name: '',
                area: 137
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15412568127714, 39.96128446689659],
                        [-75.15412407071622, 39.96130557719755],
                        [-75.1541165106517, 39.96130548629628],
                        [-75.15411517749475, 39.96132296054166],
                        [-75.15413582954533, 39.96132388618926],
                        [-75.15413424053051, 39.961344714064275],
                        [-75.15410341015958, 39.96134316290116],
                        [-75.15410089842345, 39.96134153996514],
                        [-75.15410541193872, 39.96128561995607],
                        [-75.15410816023827, 39.96128382029036],
                        [-75.15412568127714, 39.96128446689659]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 19,
                type: 'Meeting',
                name: 'London',
                area: 122
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15394927649406, 39.96140167140431],
                        [-75.15391048614875, 39.96139993278039],
                        [-75.15391282657775, 39.96136925583123],
                        [-75.15395161423021, 39.961371029752364],
                        [-75.15394927649406, 39.96140167140431]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 20,
                type: 'Meeting',
                name: 'Springfield',
                area: 142
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15388384469799, 39.96136795681914],
                        [-75.15388163084917, 39.961396974631676],
                        [-75.15382987748475, 39.96139465499148],
                        [-75.1538307500966, 39.96138321731571],
                        [-75.15383720694199, 39.96138350671836],
                        [-75.15383854817895, 39.961365926580704],
                        [-75.15388384469799, 39.96136795681914]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 21,
                type: 'Relax',
                name: 'Stockholm',
                area: 71
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15385768614955, 39.96139707033126],
                        [-75.15385580354315, 39.96142174604219],
                        [-75.15382790602928, 39.961420495646756],
                        [-75.15382978860806, 39.96139581993415],
                        [-75.15385768614955, 39.96139707033126]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 22,
                type: 'IT',
                name: 'IT',
                area: 95
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15412785087149, 39.96137790161883],
                        [-75.15409827754803, 39.96137657611103],
                        [-75.15410065978504, 39.96134673984359],
                        [-75.15410333605843, 39.96134523299905],
                        [-75.15413026940595, 39.961346200899364],
                        [-75.15412785087149, 39.96137790161883]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 23,
                type: 'IT',
                name: 'Lab',
                area: 229
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15412937883423, 39.96137797010374],
                        [-75.15413179736868, 39.96134626938431],
                        [-75.15420232710501, 39.96134946603385],
                        [-75.15419991126443, 39.961381131442145],
                        [-75.15412937883423, 39.96137797010374]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 24,
                type: 'Relax',
                name: 'Oslo',
                area: 60
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15421402026172, 39.96138667983315],
                        [-75.15420143922718, 39.96138119992705],
                        [-75.15420276699639, 39.96136379631588],
                        [-75.15423022091441, 39.9613650268299],
                        [-75.15422849723842, 39.961387619750845],
                        [-75.15421402026172, 39.96138667983315]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 25,
                type: 'Phone',
                name: '',
                area: 25
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15423002517352, 39.9613876882345],
                        [-75.15423085738541, 39.961376780096366],
                        [-75.15425303739873, 39.96137777422816],
                        [-75.15425220518685, 39.961388682366135],
                        [-75.15423002517352, 39.9613876882345]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 26,
                type: 'Phone',
                name: '',
                area: 24
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15425317206153, 39.961376009148275],
                        [-75.15425312088931, 39.9613766798833],
                        [-75.15423094087599, 39.96137568575149],
                        [-75.15423174884951, 39.9613650953136],
                        [-75.15425392886283, 39.961366089445534],
                        [-75.15425317206153, 39.961376009148275]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 27,
                type: 'Meeting',
                name: 'New York',
                area: 141
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.1542819056012, 39.9614142727822],
                        [-75.1542847465973, 39.961377034703304],
                        [-75.15432171325854, 39.96137869158835],
                        [-75.15431886582708, 39.961416014017054],
                        [-75.1542819056012, 39.9614142727822]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 28,
                type: 'Meeting',
                name: 'Toronto',
                area: 142
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15432038368785, 39.9614162149125],
                        [-75.15432324122128, 39.96137876007326],
                        [-75.15436010930874, 39.96138041254009],
                        [-75.15435724638755, 39.96141793799766],
                        [-75.15432038368785, 39.9614162149125]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 29,
                type: 'Meeting',
                name: 'Chicago',
                area: 58
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15435992759645, 39.961399001031545],
                        [-75.15436134155011, 39.96138046777045],
                        [-75.15439155999877, 39.9613818221936],
                        [-75.15439028956544, 39.961400361886824],
                        [-75.15435992759645, 39.961399001031545]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 30,
                type: 'Phone',
                name: '',
                area: 26
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15437484792803, 39.96141865605623],
                        [-75.15437620801724, 39.961400828823685],
                        [-75.15439020607488, 39.96140145623129],
                        [-75.15438884598568, 39.96141928346367],
                        [-75.15437484792803, 39.96141865605623]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 31,
                type: 'Phone',
                name: '',
                area: 27
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15437463078142, 39.96140075813033],
                        [-75.15437327069222, 39.96141858536288],
                        [-75.15435847862894, 39.961417993228],
                        [-75.15435984410587, 39.96140009537604],
                        [-75.15437463078142, 39.96140075813033]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 32,
                type: 'Storage',
                name: '',
                area: 117
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15428483008789, 39.96137594035843],
                        [-75.15428644603494, 39.961354759481054],
                        [-75.1543401709303, 39.961357167488764],
                        [-75.15433855498325, 39.961378348365365],
                        [-75.15433784296447, 39.961378316451984],
                        [-75.15428483008789, 39.96137594035843]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 33,
                type: 'Shower',
                name: 'Shower',
                area: 59
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15425245495277, 39.96134996304025],
                        [-75.15423294734369, 39.96134938615962],
                        [-75.15423499151748, 39.961322592328074],
                        [-75.15425644067632, 39.96132376624291],
                        [-75.15425507187761, 39.96134848465879],
                        [-75.15425245495277, 39.96134996304025]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 34,
                type: 'Bathroom',
                name: "Women's Room",
                area: 261
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15423141940859, 39.96134931767591],
                        [-75.15413619593072, 39.96134501422612],
                        [-75.15413823741065, 39.96131825570252],
                        [-75.15423346358239, 39.96132252384434],
                        [-75.15423141940859, 39.96134931767591]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 35,
                type: 'Shower',
                name: 'Shower',
                area: 59
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15423751239474, 39.96128955013243],
                        [-75.15425688293087, 39.96129041834156],
                        [-75.15425915264863, 39.96129243289117],
                        [-75.15425765092814, 39.961317302799905],
                        [-75.15423551663508, 39.96131570939265],
                        [-75.15423751239474, 39.96128955013243]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 36,
                type: 'Bathroom',
                name: "Men's Room",
                area: 261
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15423394297972, 39.96131624018348],
                        [-75.15413871680799, 39.961311972041315],
                        [-75.15414081297475, 39.96128514511631],
                        [-75.15423598445965, 39.961289481648656],
                        [-75.15423394297972, 39.96131624018348]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 37,
                type: 'Lounge',
                name: '',
                area: 120
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15395077026695, 39.961402836443355],
                        [-75.15395319149364, 39.961371100447],
                        [-75.15399016084713, 39.96137272204372],
                        [-75.15398780719428, 39.96140447690228],
                        [-75.15395077026695, 39.961402836443355]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 38,
                type: 'Bike Storage',
                name: 'Amsterdam',
                area: 434
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15434419191098, 39.96129798013318],
                        [-75.15439791683559, 39.961300388122915],
                        [-75.1543917870097, 39.9613807342813],
                        [-75.15434008294598, 39.96137841685028],
                        [-75.15434419191098, 39.96129798013318]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 39,
                type: 'Activity',
                name: 'Athens',
                area: 887
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15449400695036, 39.961424280265994],
                        [-75.15442120524219, 39.96142101170084],
                        [-75.15441619658358, 39.96141668201513],
                        [-75.15442350861109, 39.961320840291805],
                        [-75.15451890658613, 39.961325116133956],
                        [-75.15449400695036, 39.961424280265994]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 40,
                type: 'Kitchen',
                name: '',
                area: 1329
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15397175873439, 39.96134100907464],
                        [-75.15388525265904, 39.96133394378517],
                        [-75.15386979104984, 39.96133322828743],
                        [-75.1538672759317, 39.96133101271276],
                        [-75.15386991531177, 39.96129641725501],
                        [-75.15387143160825, 39.96127654251529],
                        [-75.15387626308657, 39.96121368134137],
                        [-75.15391129827937, 39.96121166471616],
                        [-75.15398138708609, 39.96121480617852],
                        [-75.15397175873439, 39.96134100907464]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 41,
                type: 'Work Bar',
                name: '',
                area: 341
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15399024433933, 39.961371627677615],
                        [-75.15388274524788, 39.96136680945347],
                        [-75.15388525265904, 39.96133394378517],
                        [-75.15397175873439, 39.96134100907464],
                        [-75.153992348442, 39.961341931935785],
                        [-75.15399024433933, 39.961371627677615]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                stroke: '#555555',
                'stroke-width': 2,
                'stroke-opacity': 1,
                fill: '#555555',
                'fill-opacity': 0.5,
                id: 42,
                type: 'Meeting',
                name: 'Paris',
                area: 57
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15388579693406, 39.961391635496],
                        [-75.15388734419167, 39.96136811367019],
                        [-75.153911298615, 39.96136918734651],
                        [-75.15390950283923, 39.96139272530837],
                        [-75.15388579693406, 39.961391635496]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                id: 43,
                type: 'Lounge',
                name: '',
                area: 112
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [-75.15386991531177, 39.96129641725501],
                        [-75.15381370553285, 39.96129351813459],
                        [-75.15381478089029, 39.96127942296952],
                        [-75.15381665387508, 39.96127950691883],
                        [-75.15381699053125, 39.9612750942233],
                        [-75.15382053932565, 39.961275253284256],
                        [-75.15382061476386, 39.96127426484693],
                        [-75.15387143160825, 39.96127654251529],
                        [-75.15386991531177, 39.96129641725501]
                    ]
                ]
            }
        }
    ]
};
