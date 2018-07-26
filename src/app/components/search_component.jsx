import React from 'react';
import Slider from 'rc-slider';

import anilistApiConstants from '../constants/anilist_api_constants.js';
import api from '../api/anilist_api.js';

import styles from '../styles/search_master_detail.css';

import switchYearRangeIcon from '../../public/images/switch.svg'; 

import AnimeCard from './anime_card.jsx';
import ConsoleNavHeader from './console_nav_header.jsx';

const toMultiClassString = (...classStrings) => {
    return classStrings.reduce((prev, curr) => {
        return prev + ' ' + curr;
    });
};

class YearPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pickingRange: false,
            low: 1950,
            high: 2019,
            currYearSelected: 2018
        };

        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        this.Range = createSliderWithTooltip(Slider.Range);
        this.SliderWithToolTip = createSliderWithTooltip(Slider);

        this.minYear = 1950;
        this.maxYear = (new Date()).getFullYear() + 1;

        this.onRangeChange = this.onRangeChange.bind(this);
        this.getYearSelectedString = this.getYearSelectedString.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.toggleRangeOrYearPicker = this.toggleRangeOrYearPicker.bind(this);
    }

    toggleRangeOrYearPicker() {
        this.setState({
            pickingRange: !this.state.pickingRange,
            low: this.state.low,
            high: this.state.high,
            currYearSelected: this.state.currYearSelected
        });
    }

    onRangeChange(sliderState) {
        let [ low, high ] = sliderState;
        if (low > high) {
            [low, high] = [high, low];
        }
        this.setState({
            pickingRange: this.state.pickingRange,
            low: low,
            high: high,
            currYearSelected: this.state.currYearSelected
        });
    }

    onYearChange(sliderState) {
        this.setState({
            pickingRange: this.state.pickingRange,
            low: this.state.low,
            high: this.state.high,
            currYearSelected: sliderState
        });
    }

    getYearSelectedString() {
        if (this.state.pickingRange) {
            return (this.state.low + ' - ' + this.state.high);
        }
        else {
            return (this.state.currYearSelected);
        }
    }

    render() {
        let rangeDisplay = {display: 'none'};
        let sliderDisplay = {display: 'none'};
        if (this.state.pickingRange) {
            rangeDisplay.display = 'block';
        }
        else {
            sliderDisplay.display = 'block';
        }

        return(
            <div className={styles.yearPickerWrapper}>
                <div className={styles.yearFilterTitle}>Year</div>
                <img className={styles.selectRangeToggle} src={switchYearRangeIcon} onClick={this.toggleRangeOrYearPicker} />
                <div className={styles.yearText}>{this.getYearSelectedString()}</div>
                <div className={styles.rangeWrapper}>
                    <this.Range style={rangeDisplay} min={this.minYear} max={this.maxYear} defaultValue={[this.minYear, this.maxYear]} onChange={this.onRangeChange} />
                    <this.SliderWithToolTip style={sliderDisplay} min={this.minYear} max={this.maxYear} defaultValue={this.maxYear - 1} onChange={this.onYearChange} />
                </div>
            </div>
        );
    }
}

class SearchContentMaster extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return(
            <div style={{paddingTop: '60px'}}>
                <YearPicker />
            </div>
        );
    }
}

const SearchWrapper = (props) => {
    return(
        <div style={{height: '100%'}}>
            <ConsoleNavHeader/>
            <SearchContentMaster/>
        </div>
    );
};

export default SearchWrapper;