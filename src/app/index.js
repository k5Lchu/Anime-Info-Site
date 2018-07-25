import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch } from 'react-router-dom';


import './styles/global.css';

import routes from './routes.js';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            {routes}
        </Switch>
    </BrowserRouter>
    , document.getElementById("index")
);