import React from 'react';

import headerStyles from '../styles/header.css';
import userMasterDetailStyles from '../styles/userMasterDetail.css';

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

class UserContentDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={userMasterDetailStyles.detailWrapper}>
                <ul className={userMasterDetailStyles.detailList}>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                    <li>Item1</li>
                </ul>
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
            selected: 'myanime',
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
            case 'myanime':
                activeIndx = 0;
                activeIconString = userMasterDetailStyles.myAnimeIconActive;
                break;
            case 'trendanime':
                activeIndx = 1;
                activeIconString = userMasterDetailStyles.trendingIconActive;
                break;
            case 'newanime':
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
                        <li name="myanime" className={this.state.liClassStrings[0]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[0]}></div>My Animes</li>
                        <li name="trendanime" className={this.state.liClassStrings[1]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[1]}></div>Trending Animes</li>
                        <li name="newanime" className={this.state.liClassStrings[2]} onClick={this.onSideNavTabClick}><div className={this.state.iconClassStrings[2]}></div>New Animes</li>
                    </ul>
                    <div className={userMasterDetailStyles.footer}>Some Copyright @ Shit 2018</div>
                </div>
                <UserContentDetail/>
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