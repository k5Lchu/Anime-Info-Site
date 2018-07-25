import React from 'react';

import userMasterDetailStyles from '../styles/user_master_detail.css';

import sideNavConstants from '../constants/user_console_constants.js';
import anilistApiConstants from '../constants/anilist_api_constants.js';

import api from '../api/anilist_api.js';

// importing the necessary image files
import navLogo from '../../public/images/nav_logo.png';

import AnimeCard from './anime_card.jsx';
import ConsoleNavHeader from './console_nav_header.jsx';

const toMultiClassString = (...classStrings) => {
    return classStrings.reduce((prev, curr) => {
        return prev + ' ' + curr;
    });
};

class UserContentDetailContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            nextPageMyAnime: 1,
            nextPagePopAnime: 1,
            nextPageNewAnime: 1,
            perPage: 15,
            myAnimesData: [],
            popAnimesData: [],
            newAnimesData: [],
            loading: true
        };

        this.getMyAnimeData  = this.getMyAnimeData.bind(this);
        this.getPopularAnimeData  = this.getPopularAnimeData.bind(this);
        this.getNewAnimeData  = this.getNewAnimeData.bind(this);

        this.handleMyAnimeData = this.handleMyAnimeData.bind(this);
        this.handlePopAnimeData = this.handlePopAnimeData.bind(this);
        this.handleNewAnimeData = this.handleNewAnimeData.bind(this);

        this.prefetchInitialAnimeData = this.prefetchInitialAnimeData.bind(this);

        this.handleInitalData = this.handleInitalData.bind(this);
        this.handleError = this.handleError.bind(this);

        this.chooseDetailData = this.chooseDetailData.bind(this);

        this.onScrollToBottom = this.onScrollToBottom.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.throttledOnScroll = this.debounced(200, this.onScrollToBottom);
    }

    componentDidMount() {
        this.prefetchInitialAnimeData();
    }

    prefetchInitialAnimeData() {
        let myAnimePromise = api.getMyAnimes(this.props.myAnimeIds, this.state.nextPageMyAnime, this.state.perPage);
        let popAnimePromise = api.getPopularAnimes(this.state.nextPagePopAnime, this.state.perPage);
        let newAnimePromise = api.getNewAnimes(anilistApiConstants.SEASON_SUMMER, 2018, this.state.nextPageNewAnime, this.state.perPage);

        Promise.all([myAnimePromise.then(this.handleResponse), 
            popAnimePromise.then(this.handleResponse), 
            newAnimePromise.then(this.handleResponse)])
            .then(this.handleInitalData)
            .catch(this.handleError);
    }

    getMyAnimeData() {
        let resultPromise = api.getMyAnimes(this.props.myAnimeIds, this.state.nextPageMyAnime, this.state.perPage);

        resultPromise.then(this.handleResponse)
            .then(this.handleMyAnimeData)
            .catch(this.handleError);
    }

    getPopularAnimeData() {
        let resultPromise = api.getPopularAnimes(this.state.nextPagePopAnime, this.state.perPage);

        resultPromise.then(this.handleResponse)
            .then(this.handlePopAnimeData)
            .catch(this.handleError);
    }

    getNewAnimeData() {
        let resultPromise = api.getNewAnimes(anilistApiConstants.SEASON_SUMMER, 2018, this.state.nextPageNewAnime, this.state.perPage);

        resultPromise.then(this.handleResponse)
            .then(this.handleNewAnimeData)
            .catch(this.handleError);
    }

    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    handleInitalData(data) {
        let myAnimeReuslts = data[0].data.Page.media;
        let popAnimeResults = data[1].data.Page.media;
        let newAnimeResults = data[2].data.Page.media;
        this.removedUndefinedFields(myAnimeReuslts);
        this.removedUndefinedFields(popAnimeResults);
        this.removedUndefinedFields(newAnimeResults);
        this.setState({
            nextPageMyAnime: this.state.nextPageMyAnime + 1,
            nextPagePopAnime: this.state.nextPagePopAnime + 1,
            nextPageNewAnime: this.state.nextPageNewAnime + 1,
            perPage: this.state.perPage,
            myAnimesData: myAnimeReuslts,
            popAnimesData: popAnimeResults,
            newAnimesData: newAnimeResults,
            loading: false
        });
    }

    handleMyAnimeData(data) {
        let results = data.data.Page.media;
        this.removedUndefinedFields(results);
        this.setState({
            nextPageMyAnime: this.state.nextPageMyAnime + 1,
            nextPagePopAnime: this.state.nextPagePopAnime,
            nextPageNewAnime: this.state.nextPageNewAnime,
            perPage: this.state.perPage,
            myAnimesData: [...(this.state.myAnimesData),...results],
            popAnimesData: this.state.popAnimesData,
            newAnimesData: this.state.newAnimesData,
            loading: false
        });
    }

    handlePopAnimeData(data) {
        let results = data.data.Page.media;
        this.removedUndefinedFields(results);
        this.setState({
            nextPageMyAnime: this.state.nextPageMyAnime,
            nextPagePopAnime: this.state.nextPagePopAnime + 1,
            nextPageNewAnime: this.state.nextPageNewAnime,
            perPage: this.state.perPage,
            myAnimesData: this.state.myAnimesData,
            popAnimesData: [...(this.state.popAnimesData),...results],
            newAnimesData: this.state.newAnimesData,
            loading: false
        });
    }

    handleNewAnimeData(data) {
        let results = data.data.Page.media;
        this.removedUndefinedFields(results);
        this.setState({
            nextPageMyAnime: this.state.nextPageMyAnime,
            nextPagePopAnime: this.state.nextPagePopAnime,
            nextPageNewAnime: this.state.nextPageNewAnime + 1,
            perPage: this.state.perPage,
            myAnimesData: this.state.myAnimesData,
            popAnimesData: this.state.popAnimesData,
            newAnimesData: [...(this.state.newAnimesData),...results],
            loading: false
        });
    }
    
    handleError(error) {
        alert('Error, check console');
        console.error(error);
    }

    debounced(delay, fn) {
        let timerId;
        return (...args) => {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        };
    }

    onScroll(e) {
        e.persist();
        this.throttledOnScroll(e);
    }

    onScrollToBottom(e) {
        let el = e.target;
        if (el.className === userMasterDetailStyles.detailWrapper) {
            if ((el.scrollHeight - el.scrollTop) < 1000 && el.scrollHeight > el.clientHeight) {
                switch(this.props.currTab) {
                    case sideNavConstants.SIDE_NAV_TAB_MY_ANIME:
                        this.getMyAnimeData();
                        break;
                    case sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME:
                        this.getPopularAnimeData();
                        break;
                    case sideNavConstants.SIDE_NAV_TAB_NEW_ANIME:
                        this.getNewAnimeData();
                        break;
                }
            }
        }
    }

    removedUndefinedFields(arr) {
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i].nextAiringEpisode == null) {
                arr[i].nextAiringEpisode = {empty: true};
            }
            if (arr[i].description == null) {
                arr[i].description = '';
            }
        }
    }

    chooseDetailData() {
        switch(this.props.currTab) {
            case sideNavConstants.SIDE_NAV_TAB_MY_ANIME:
                return this.state.myAnimesData;
            case sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME:
                return this.state.popAnimesData;
            case sideNavConstants.SIDE_NAV_TAB_NEW_ANIME:
                return this.state.newAnimesData;
        }
    }

    render() {
        return(
            <div className={userMasterDetailStyles.userContentDetailWrapper}>
                <UserContentDetail data={this.chooseDetailData()} setDetailListRef={this.props.setRef} onScrollBottom={this.onScroll}/>
            </div>
        );
    }
}

const UserContentDetail = (props) => {
    return(
        <div ref={props.setDetailListRef} className={userMasterDetailStyles.detailWrapper} onScroll={props.onScrollBottom}>
            <div className={userMasterDetailStyles.detailList}>
                {props.data.map(anime => <AnimeCard {...anime} key={anime.id} />)}
            </div>
        </div>
    );
};

class UserContentMaster extends React.Component {
    constructor(props) {
        super(props);
        let liClassStartStrings = [toMultiClassString(userMasterDetailStyles.sideNavTabActive,userMasterDetailStyles.sideNavTab), 
            toMultiClassString(userMasterDetailStyles.sideNavTabInactive,userMasterDetailStyles.sideNavTab), 
            toMultiClassString(userMasterDetailStyles.sideNavTabInactive,userMasterDetailStyles.sideNavTab)];
        let iconClassStartStrings = [userMasterDetailStyles.myAnimeIconActive, 
            userMasterDetailStyles.trendingIcon, 
            userMasterDetailStyles.newAnimeIcon];
        this.state = {
            selected: sideNavConstants.SIDE_NAV_TAB_MY_ANIME,
            liClassStrings: liClassStartStrings,
            iconClassStrings: iconClassStartStrings,
            collapsed: false
        };
        
        this.onSideNavTabClick = this.onSideNavTabClick.bind(this);
        this.changeSelectedTabUI = this.changeSelectedTabUI.bind(this);
        this.setRef = this.setRef.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    setRef(node) {
        this.detailListRef = node;
    }

    onSideNavTabClick(e) {
        let targetName = e.target.getAttribute('name');

        if (targetName === this.state.selected) {
            return;
        }

        let newClassStringsArr = this.changeSelectedTabUI(targetName, this.state.collapsed);

        this.setState({
            selected: targetName,
            liClassStrings: newClassStringsArr[0],
            iconClassStrings: newClassStringsArr[1],
            collapsed: this.state.collapsed
        }, () => {this.detailListRef.scrollTo(0,0);});
    }

    changeSelectedTabUI(selectedTabName, collapsed) {
        let defaultLiString = toMultiClassString(userMasterDetailStyles.sideNavTabInactive,userMasterDetailStyles.sideNavTab);
        if (collapsed) {
            defaultLiString = toMultiClassString(userMasterDetailStyles.sideNavTabInactive,userMasterDetailStyles.sideNavTabCollapsed);
        }
        let liClassNewStrings = [defaultLiString, defaultLiString, defaultLiString];
        let iconClassNewStrings = [userMasterDetailStyles.myAnimeIcon, 
            userMasterDetailStyles.trendingIcon, 
            userMasterDetailStyles.newAnimeIcon];

        let activeIndx = -1;
        let activeIconString = '';

        switch(selectedTabName) {
            case sideNavConstants.SIDE_NAV_TAB_MY_ANIME:
                activeIndx = 0;
                activeIconString = userMasterDetailStyles.myAnimeIconActive;
                break;
            case sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME:
                activeIndx = 1;
                activeIconString = userMasterDetailStyles.trendingIconActive;
                break;
            case sideNavConstants.SIDE_NAV_TAB_NEW_ANIME:
                activeIndx = 2;
                activeIconString = userMasterDetailStyles.newAnimeIconActive;
                break;
            default:
                break;
        }

        if (activeIndx === -1 || activeIconString === '') {
            return;
        }

        iconClassNewStrings[activeIndx] = activeIconString;
        if (collapsed) {
            liClassNewStrings[activeIndx] = toMultiClassString(userMasterDetailStyles.sideNavTabActive,userMasterDetailStyles.sideNavTabCollapsed);
        }
        else  {
            liClassNewStrings[activeIndx] = toMultiClassString(userMasterDetailStyles.sideNavTabActive,userMasterDetailStyles.sideNavTab);
        }

        return [liClassNewStrings, iconClassNewStrings];
    }

    toggleCollapse() {
        let newClassStringsArr = this.changeSelectedTabUI(this.state.selected, !this.state.collapsed);
        this.setState({
            selected: this.state.selected,
            liClassStrings: newClassStringsArr[0],
            iconClassStrings: newClassStringsArr[1],
            collapsed: !this.state.collapsed
        });
    }

    createSideNavLi(name, liClassNewStrings, iconClassNewStrings, textVisbilityClassString, onClickHandler, text) {
    return (
        <li key={name} name={name} className={liClassNewStrings} onClick={onClickHandler}>
            <div name={name} className={toMultiClassString(iconClassNewStrings,userMasterDetailStyles.sideNavTabIcon)}></div>
            <div name={name} className={toMultiClassString(userMasterDetailStyles.sideNavTabText,textVisbilityClassString)}>{text}</div>
        </li>);
    }

    render() {
        let expandedElementsClassString = '';
        let collapsedElementsClassString = userMasterDetailStyles.hidden;
        let sideNavClassString = userMasterDetailStyles.masterSideNav;
        let sideNavHeaderClassString = userMasterDetailStyles.sideNavHeader;
        let sideNavTitleClassString = userMasterDetailStyles.sideNavTitle;
        if (this.state.collapsed) {
            expandedElementsClassString = userMasterDetailStyles.hidden;
            collapsedElementsClassString = '';
            sideNavClassString = userMasterDetailStyles.masterSideNavCollapsed;
            sideNavHeaderClassString = userMasterDetailStyles.sideNavHeaderCollapsed;
            sideNavTitleClassString = userMasterDetailStyles.sideNavTitleCollapsed;
        }

        return(
            <div className={userMasterDetailStyles.userMasterDetailWrapper}>
                <div className={sideNavClassString}>
                    <img className={sideNavHeaderClassString} src="https://media.giphy.com/media/b29IZK1dP4aWs/giphy.gif"/>
                    <div className={sideNavTitleClassString}><img src={navLogo}/><div className={expandedElementsClassString}>Navigation</div><div className={toMultiClassString(userMasterDetailStyles.toggleExpandIconExpanded,expandedElementsClassString)} onClick={this.toggleCollapse}></div></div>
                    <div className={toMultiClassString(userMasterDetailStyles.toggleExpandIconCollapsed,collapsedElementsClassString)} onClick={this.toggleCollapse}></div>
                    <ul className={userMasterDetailStyles.sideNavList}> 
                        {
                            [
                            this.createSideNavLi(sideNavConstants.SIDE_NAV_TAB_MY_ANIME,this.state.liClassStrings[0],this.state.iconClassStrings[0],expandedElementsClassString,this.onSideNavTabClick,'My Animes'),
                            this.createSideNavLi(sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME,this.state.liClassStrings[1],this.state.iconClassStrings[1],expandedElementsClassString,this.onSideNavTabClick,'Popular Animes'),
                            this.createSideNavLi(sideNavConstants.SIDE_NAV_TAB_NEW_ANIME,this.state.liClassStrings[2],this.state.iconClassStrings[2],expandedElementsClassString,this.onSideNavTabClick,'New Animes')
                            ]
                        }
                    </ul>
                    <div className={toMultiClassString(userMasterDetailStyles.footer, expandedElementsClassString)}>Some Copyright @ Shit 2018</div>
                </div>
                <UserContentDetailContainer currTab={this.state.selected} myAnimeIds={[101004,100085,100483,21712,101432]} setRef={this.setRef}/>
            </div>
        );
    }
}

const UserConsoleWraper = (props) => {
    return(
        <div style={{height: '100%'}}>
            <ConsoleNavHeader/>
            <UserContentMaster/>
        </div>
    );
};

export default UserConsoleWraper;