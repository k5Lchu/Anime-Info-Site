import React from 'react';

import headerStyles from '../styles/header.css';
import userMasterDetailStyles from '../styles/user_master_detail.css';

import sideNavConstants from '../constants/user_console_constants.js';
import anilistApiConstants from '../constants/anilist_api_constants.js';

import api from '../api/anilist_api.js';

// importing the necessary image files
import logoIcon from '../../public/images/logo.png';
import homeIcon from '../../public/images/baseline_home_white_48dp.png';
import defaultProfileIcon from '../../public/images/baseline_account_circle_white_48dp.png';
import searchIcon from '../../public/images/baseline_search_white_48dp.png';
import navLogo from '../../public/images/nav_logo.png';

const toMultiClassString = (...classStrings) => {
    return classStrings.reduce((prev, curr) => {
        return prev + ' ' + curr;
    });
};

/*
 * Header componenets that serves as the nav bar for the user console
 */
class ConsoleNavHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileNavVisible: false
        };

        this.toggleProfileNav = this.toggleProfileNav.bind(this);
        this.setRef = this.setRef.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.toggleProfileNav);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.toggleProfileNav);
    }

    toggleProfileNav(e) {
        if (this.profileIconRef && !this.profileIconRef.contains(e.target)) {
            this.setState({
                profileNavVisible: false
            });
        }
        else {
            this.setState({
                profileNavVisible: !this.state.profileNavVisible
            });
        }
    }

    setRef(node) {
        this.profileIconRef = node;
    }

    render() {
        let profileNavVisibleStyle = {
            display: 'none'
        };

        if (this.state.profileNavVisible) {
            profileNavVisibleStyle.display = true;
        }

        return(
            <div className={headerStyles.wrapper}>
                <div className={headerStyles.accentBar}></div>
                <div className={headerStyles.innerWrapper}>
                    <img className={headerStyles.logo} src={logoIcon}/>
                    <div className={headerStyles.verticalSeperator}></div>
                    <img className={toMultiClassString(headerStyles.interactIcons,headerStyles.homeIcon)} src={homeIcon}/>
                    <div className={headerStyles.profileNavAreaWrapper}>
                        <img ref={this.setRef} className={toMultiClassString(headerStyles.interactIcons,headerStyles.profileIcon)} src={defaultProfileIcon}/>
                        <div className={headerStyles.profileNavWrapper} style={profileNavVisibleStyle}>
                            <ul className={headerStyles.profileNav}>
                                <li purpose='settings'><div className={toMultiClassString(headerStyles.settingsIcon,headerStyles.profileNavIcons)}></div>Settings</li>
                                <li purpose='logout'><div className={toMultiClassString(headerStyles.logoutIcon,headerStyles.profileNavIcons)}></div>Logout</li>
                            </ul>
                        </div>
                    </div>
                    <img className={toMultiClassString(headerStyles.interactIcons,headerStyles.searchIcon)} src={searchIcon}/>
                </div>
            </div>
        );
    }
};

const AnimeCard = (props) => {

    let secondsToTimeString = (timeSecondsUntil) => {
        timeSecondsUntil = Number(timeSecondsUntil);
        let d = Math.floor(timeSecondsUntil / (3600*24));
        let h = Math.floor(timeSecondsUntil % (3600*24) / 3600);
        let m = Math.floor(timeSecondsUntil % (3600*24) % 3600 / 60);

        let dDisplay = d > 0 ? d + 'd ' : '';
        let hDisplay = h > 0 ? h + 'hr ' : '';
        let mDisplay = m > 0 ? m + 'm ' : '';
        return dDisplay + hDisplay + mDisplay; 
    };

    let getNextEpisodeTimeUntilString = () => {
        if (props.status === anilistApiConstants.STATUS_RELEASING) {
            return 'Ep ' + props.nextAiringEpisode.episode + ' - ' + secondsToTimeString(props.nextAiringEpisode.timeUntilAiring);
        }
        else {
            return props.season + ' ' + props.startDate.year;
        }
    };

    return(
        <a className={userMasterDetailStyles.animeCardLinkContainer} href={props.siteUrl}>
            <div className={userMasterDetailStyles.animeCardContainer}>
                <h5 className={userMasterDetailStyles.cardTitle}>{props.title.romaji}</h5>
                <h5 className={userMasterDetailStyles.cardTime}>{getNextEpisodeTimeUntilString()}</h5>
                <img className={userMasterDetailStyles.cardImage} src={props.coverImage.large}/>
                <p className={userMasterDetailStyles.cardDescription}>{props.description.replace(/<(?:.|\n)*?>/gm, '')}</p>
                <p className={userMasterDetailStyles.cardGenres}>{props.genres.reduce((prev, curr) => {return prev + ', ' + curr;})}</p>
            </div>
        </a>
    );
};

class UserContentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            page: 1,
            perPage: 15,
            animes: [],
            currTab: props.currTab
        };

        this.startApiRequests = this.startApiRequests.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleData = this.handleData.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    componentDidMount() {
        this.startApiRequests();
    }

    componentDidUpdate() {
        if (this.props.currTab !== this.state.currTab) {
            this.startApiRequests();
        }
    }

    startApiRequests() {
        let currSeason = anilistApiConstants.SEASON_SUMMER;
        let currSeasonYear = 2018;

        let resultPromise = null;
        switch(this.props.currTab) {
            case sideNavConstants.SIDE_NAV_TAB_MY_ANIME:
                resultPromise = api.getMyAnimes(this.props.myAnimeIds, this.state.page, this.state.perPage);
                break;
            case sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME:
                resultPromise = api.getPopularAnimes(this.state.page, this.state.perPage);
                break;
            case sideNavConstants.SIDE_NAV_TAB_NEW_ANIME:
                resultPromise = api.getNewAnimes(currSeason, currSeasonYear, this.state.page, this.state.perPage);
                break;
        }

        resultPromise.then(this.handleResponse)
            .then(this.handleData)
            .catch(this.handleError);
    }

    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    
    handleData(data) {
        let results = data.data.Page.media;
        for (let i = 0; i < results.length; ++i) {
            if (results[i].nextAiringEpisode == null) {
                results[i].nextAiringEpisode = {empty: true};
            }
        }
        this.setState({
            page: 1,
            perPage: 15,
            animes: results,
            currTab: this.props.currTab
        });
    }
    
    handleError(error) {
        alert('Error, check console');
        console.error(error);
    }

    render() {
        return(
            <div className={userMasterDetailStyles.detailWrapper}>
                <div className={userMasterDetailStyles.detailList}>
                    {this.state.animes.map(anime => <AnimeCard {...anime} key={anime.id} />)}
                </div>
            </div>
        );
    }
}

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
            iconClassStrings: iconClassStartStrings
        };
        
        this.onSideNavTabClick = this.onSideNavTabClick.bind(this);
        this.changeSelectedTabUI = this.changeSelectedTabUI.bind(this);
    }

    onSideNavTabClick(e) {
        let targetName = e.target.getAttribute('name');

        if (targetName === this.state.selected) {
            return;
        }

        let newClassStringsArr = this.changeSelectedTabUI(targetName);

        this.setState({
            selected: targetName,
            liClassStrings: newClassStringsArr[0],
            iconClassStrings: newClassStringsArr[1]
        });
    }

    changeSelectedTabUI(selectedTabName) {
        let defaultLiString = toMultiClassString(userMasterDetailStyles.sideNavTabInactive,userMasterDetailStyles.sideNavTab);
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
        liClassNewStrings[activeIndx] = toMultiClassString(userMasterDetailStyles.sideNavTabActive,userMasterDetailStyles.sideNavTab);

        return [liClassNewStrings, iconClassNewStrings];
    }

    render() {
        return(
            <div className={userMasterDetailStyles.userMasterDetailWrapper}>
                <div className={userMasterDetailStyles.masterSideNav}>
                    <img className={userMasterDetailStyles.sideNavHeader} src="https://media.giphy.com/media/b29IZK1dP4aWs/giphy.gif"/>
                    <div className={userMasterDetailStyles.sideNavTitle}><img src={navLogo}/>Navigation</div>
                    <ul className={userMasterDetailStyles.sideNavList}> 
                        <li name={sideNavConstants.SIDE_NAV_TAB_MY_ANIME} className={this.state.liClassStrings[0]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[0]}></div>My Animes</li>
                        <li name={sideNavConstants.SIDE_NAV_TAB_POPULAR_ANIME} className={this.state.liClassStrings[1]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[1]}></div>Popular Animes</li>
                        <li name={sideNavConstants.SIDE_NAV_TAB_NEW_ANIME} className={this.state.liClassStrings[2]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[2]}></div>New Animes</li>
                    </ul>
                    <div className={userMasterDetailStyles.footer}>Some Copyright @ Shit 2018</div>
                </div>
                <UserContentDetail currTab={this.state.selected} myAnimeIds={[]}/>
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