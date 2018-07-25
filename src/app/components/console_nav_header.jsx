import React from 'react';

import headerStyles from '../styles/header.css';

// importing the necessary image files
import logoIcon from '../../public/images/logo.png';
import homeIcon from '../../public/images/baseline_home_white_48dp.png';
import defaultProfileIcon from '../../public/images/baseline_account_circle_white_48dp.png';
import searchIcon from '../../public/images/baseline_search_white_48dp.png';
import mobileHeaderNavIcon from '../../public/images/menu_white.png';

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
            profileNavVisible: false,
            mobileNavVisible: false
        };

        this.toggleProfileNav = this.toggleProfileNav.bind(this);
        this.setRef = this.setRef.bind(this);
        this.showMobileHeaderNav = this.showMobileHeaderNav.bind(this);
        this.closeMobileHeaderNav = this.closeMobileHeaderNav.bind(this);
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
                profileNavVisible: false,
                mobileNavVisible: this.state.mobileNavVisible
                
            });
        }
        else {
            this.setState({
                profileNavVisible: !this.state.profileNavVisible,
                mobileNavVisible: this.state.mobileNavVisible
            });
        }
    }

    setRef(node) {
        this.profileIconRef = node;
    }

    showMobileHeaderNav() {
        this.setState({
            profileNavVisible: this.state.profileNavVisible,
            mobileNavVisible: true
        });
    }

    closeMobileHeaderNav() {
        this.setState({
            profileNavVisible: this.state.profileNavVisible,
            mobileNavVisible: false
        });
    }

    render() {
        let profileNavVisibleStyle = {
            display: 'none'
        };

        if (this.state.profileNavVisible) {
            profileNavVisibleStyle.display = 'block';
        }

        let mobileNavVisibleClassString = headerStyles.hidden;
        let mobileNavToggleClass = '';
        if (this.state.mobileNavVisible) {
            mobileNavVisibleClassString = '';
            mobileNavToggleClass = headerStyles.hidden;
        }

        return(
            <div className={headerStyles.wrapper}>
                <div className={headerStyles.accentBar}></div>
                <img className={toMultiClassString(headerStyles.mobileHeaderNavExpand, mobileNavToggleClass)} src={mobileHeaderNavIcon} onClick={this.showMobileHeaderNav}/>
                <div className={toMultiClassString(headerStyles.innerWrapper, mobileNavVisibleClassString)}>
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

                    <div purpose='settings' className={toMultiClassString(headerStyles.settingsIconMobile,headerStyles.interactIcons)}></div>
                    <div purpose='logout' className={toMultiClassString(headerStyles.logoutIconMobile,headerStyles.interactIcons)}></div>

                    <div className={toMultiClassString(headerStyles.closeMobileHeader,headerStyles.interactIcons)} onClick={this.closeMobileHeaderNav}></div>

                </div>
            </div>
        );
    }
};

export default ConsoleNavHeader;