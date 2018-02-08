export const tilesUrl =
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

export const initialMapCenter = [39.96657, -75.1838205];

export const initialZoom = 19;
export const minZoom = 18;
export const maxZoom = 22;

export const defaultZoneRadius = 4; // meters
export const zoneBuffer = 0.002; // kilometers

export const zones = [
    {
        name: 'Rustic Pavilion',
        desc:
            'By the 1840s the chaste, neoclassical architecture of the buildings, the landscaped garden, and the promenades up to and around the reservoirs on "Fair Mount," were major attractions.',
        lat: 39.965672730693555,
        lng: -75.18278002738953,
        bearing: 270,
        tour: [
            {
                image: 'AP1.jpg',
                caption:
                    'By the 1840s the chaste, neoclassical architecture of the buildings, the landscaped garden, and the promenades up to and around the reservoirs on "Fair Mount," were major attractions. Ornamental sculptures, fountains, and airy gazebos added to the visual pleasure of the site.'
            }
        ]
    },
    {
        name: 'Old Mill House & Forebay',
        desc:
            'The golden age at Fairmount Water Works covers the period roughly from 1830 to 1850.',
        lat: 39.965905027098046,
        lng: -75.18299728631973,
        bearing: 270,
        tour: [
            {
                image: 'DP1.jpg',
                caption:
                    'The golden age at Fairmount Water Works covers the period roughly from 1830 to 1850. Receipts were well over expenditures, the waterwheels were operating efficiently, and the public was enthusiastically responsive to the well-designed buildings and the picturesque setting. During this time European visitors were greatly impressed with the beauty and the power of the works, especially since it had been conceived and built in this country by locally trained engineers.'
            }
        ]
    },
    {
        name: 'Forebay & New Mill House',
        desc:
            'From 1815 to 1854, Fairmount Water Works was the sole pumping station supplying Philadelphia with water.',
        lat: 39.96665535964932,
        lng: -75.18315017223358,
        bearing: 270,
        tour: [
            {
                image: 'EP1.jpg',
                caption:
                    "From 1815 to 1854, Fairmount Water Works was the sole pumping station supplying Philadelphia with water. After water power replaced steam, which used expensive fuel to power the waterworks' pumps, the financial rewards for the city were considerable."
            }
        ]
    },
    {
        name: 'Forebay Bridge',
        desc:
            'The development of this remarkable facility was not fully envisioned or planned as an entirety from the beginning.',
        lat: 39.96635728332038,
        lng: -75.18312335014343,
        bearing: 270,
        tour: [
            {
                image: 'FP1.jpg',
                caption:
                    'The development of this remarkable facility was not fully envisioned or planned as an entirety from the beginning; rather, it evolved over decades in response to happenstance, exigencies of the moment, and technological advances.'
            }
        ]
    },
    {
        name: 'New Mill House Deck',
        desc:
            'For foreign and native travelers in the nineteenth century making the grand tour of the United States it was unthinkable to be in Philadelphia without visiting the Fairmount Water Works.',
        lat: 39.966745810140395,
        lng: -75.18343716859818,
        bearing: 270,
        tour: [
            {
                image: 'HP1.jpg',
                caption:
                    'For foreign and native travelers in the nineteenth century making the grand tour of the United States it was unthinkable to be in Philadelphia without visiting the Fairmount Water Works on the banks of the Schuylkill River.'
            }
        ]
    },
    {
        name: 'Deck',
        desc:
            'The Joint Committee on Supplying the City with Water, known as the Watering Committee, was a city agency formed in 1798.',
        lat: 39.96686,
        lng: -75.18396,
        bearing: 270,
        tour: [
            {
                image: 'IP1.jpg',
                caption:
                    'The Joint Committee on Supplying the City with Water, known as the Watering Committee, was a city agency formed in 1798. Its concern was to establish a system that would provide an essential service for the citizens of Philadelphia—a plentiful supply of potable water.'
            }
        ]
    },
    {
        name: 'Reservoir',
        desc:
            "In the nineteenth century the small temples of Fairmount Water Works arranged at the water's edge had become a symbol of Philadelphia.",
        lat: 39.96669,
        lng: -75.18356,
        bearing: 270,
        tour: [
            {
                image: 'JP1.jpg',
                caption:
                    "In the nineteenth century the small temples of Fairmount Water Works arranged at the water's edge had become a symbol of Philadelphia. Now what might be considered a twentieth-century symbol stands grouped on the top of Fairmount in the connected large temples that form the Philadelphia Museum of Art."
            }
        ]
    },
    {
        name: 'South Gardens',
        desc:
            'The south garden at the waterworks had been built by 1835, and soon the idea of a large urban recreational park caught the fancy of many citizens.',
        lat: 39.96667180520207,
        lng: -75.18341839313507,
        bearing: 270,
        tour: [
            {
                image: 'KP1.jpg',
                caption:
                    "The south garden at the waterworks had been built by 1835, and soon the idea of a large urban recreational park caught the fancy of many citizens, with additional land being acquired for today's Fairmount Park."
            }
        ]
    },
    {
        name: 'Deck of Old Mill House',
        desc:
            'In 1911 the city passed an ordinance giving the Fairmount buildings along the river to the mayor for use as a public aquarium.',
        lat: 39.965898859947075,
        lng: -75.18313139677048,
        bearing: 270,
        tour: [
            {
                image: 'LP1.jpg',
                caption:
                    "In 1911 the city passed an ordinance giving the Fairmount buildings along the river to the mayor for use as a public aquarium and another ordinance giving the site of Fairmount's reservoirs to the Commissioners of Fairmount Park for construction of a public art museum. Fairmount Water Works, with its history of devotion to the public good, would still play an active role in the lives of Philadelphia's citizens."
            }
        ]
    },
    {
        name: 'Cliff Side Path',
        desc:
            'Many persons were instrumental in the creation and the operation of Fairmount Water Works. Most noted among them were Frederick Graff (1774-1847) and his son, Frederic Graff, Jr. (1817-1890).',
        lat: 39.966293556488324,
        lng: -75.18359810113907,
        bearing: 270,
        tour: [
            {
                image: 'NP1.jpg',
                caption:
                    'Many persons were instrumental in the creation and the operation of Fairmount Water Works. Most noted among them were Frederick Graff (1774-1847) and his son, Frederic Graff, Jr. (1817-1890). Responsible for the design of the Fairmount Water Works facility-the buildings, most of the machinery, the distribution system, the gardens immediately surrounding the waterworks—[Frederick Graff], in effect, ran the waterworks. Graff, Jr., continued the tradition, serving from 1847 to 1856 and again from 1867 to 1872, becoming a leading civil engineer in his own right, and playing a major role in the development of Fairmount Park.'
            }
        ]
    },
    {
        name: 'Decks',
        desc:
            'Fairmount Water Works today maintains its graceful presence in the Philadelphia landscape and serves as a picturesque reminder of the past.',
        lat: 39.96697,
        lng: -75.18454,
        bearing: 270,
        tour: [
            {
                image: 'RP1.jpg',
                caption:
                    'Fairmount Water Works today maintains its graceful presence in the Philadelphia landscape and serves as a picturesque reminder of the past when its buildings, gardens, and dam were depicted in drawings, paintings, woodcuts, lithographs, and engravings.'
            }
        ]
    },
    {
        name: 'More Decks',
        desc:
            'In 1975 the American Society of Civil Engineers declared Fairmount Waterworks a National Historic Civil Engineering Landmark and on May 11, 1976.',
        lat: 39.96688,
        lng: -75.18458,
        bearing: 270,
        tour: [
            {
                image: 'RC13_amphitheater_view.jpg',
                caption:
                    'In 1975 the American Society of Civil Engineers declared Fairmount Waterworks a National Historic Civil Engineering Landmark and on May 11, 1976, it was designated a National Historic Landmark by the U.S. Secretary of the Interior. In 1977 the American Society of Mechanical Engineers made the waterworks a National Historic Mechanical Engineering Landmark. Despite its multiple-award status, the facility continued to deteriorate and in 1984 was included in the report to Congress by the Secretary of the Interior on damaged and threatened national landmarks.'
            }
        ]
    },
    {
        name: 'Fishway',
        desc:
            'The Fairmount Dam fishway helps fish pass through the furthest downstream passage of the Delaware River Basin to reach the ocean, allowing direct passage to their spawning areas.',
        lat: 39.9668,
        lng: -75.18462,
        bearing: 270,
        tour: [
            {
                image: 'Fishway.jpg',
                caption:
                    'The Fairmount Dam fishway helps fish pass through the furthest downstream passage of the Delaware River Basin to reach the ocean, allowing direct passage to their spawning areas. American shad, the main target of the fishway, are a fish that spawn genetically, meaning that a population of shad will spawn at the same area for numerous generations.'
            }
        ]
    }
];
