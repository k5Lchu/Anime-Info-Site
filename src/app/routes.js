import React from "react";
import { Route } from 'react-router-dom';

import ConsoleWrap from './components/user_console.jsx';

export default [
    <Route key="1" exact path={'/'} render={(props) => <ConsoleWrap/>}/>
];