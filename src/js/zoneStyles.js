"use strict";

module.exports = {
    initial    : { fillOpacity: 0.0, weight: 2, opacity: 0.5 },
    inactive   : { fillOpacity: 0.25, weight: 2, opacity: 0.5 },
    active     : { fillOpacity: 0.5, opacity: 1, weight: 2 },

    unstarted  : { fillColor: '#565656', color: '', dashArray: '5, 5' },
    inProgress : { fillColor: '#00c6ff', color: '#00c6ff', dashArray: '0, 0' },
    done       : { fillColor: '#00ed1c', color: '#00ed1c', dashArray: '0, 0'  }
};

