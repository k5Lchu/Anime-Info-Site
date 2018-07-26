import React from "react";
import { Route } from 'react-router-dom';

import ConsoleWrap from './components/user_console.jsx';
import SearchWrapper from './components/search_component.jsx';

export default [
    <Route key="2" exact path={'/'} render={(props) => <ConsoleWrap/>}/>,
    <Route key="1" exact path={'/search'} render={(props) => <SearchWrapper/>}/>
];