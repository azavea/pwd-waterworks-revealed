import React from 'react';
import ReactDOM from 'react-dom';
import AppRoot from './AppRoot';
import '../sass/main.scss';

ReactDOM.render(<AppRoot dev={false} />, document.getElementById('app'));
