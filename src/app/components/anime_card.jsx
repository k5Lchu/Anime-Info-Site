import React from 'react';
import userMasterDetailStyles from '../styles/user_master_detail.css';
import anilistApiConstants from '../constants/anilist_api_constants.js';

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
        if (props.status === anilistApiConstants.STATUS_RELEASING && props.nextAiringEpisode.timeUntilAiring != undefined) {
            return 'Ep ' + props.nextAiringEpisode.episode + ' - ' + secondsToTimeString(props.nextAiringEpisode.timeUntilAiring);
        }
        else {
            return props.season + ' ' + props.startDate.year;
        }
    };

    let preventDescriptionLink = (e) => {
        e.preventDefault();
    };

    let displayGenres = () => {
        if (props.genres.length > 0) {
            return props.genres.reduce((prev, curr) => {return prev + ', ' + curr;});
        }
        return 'none';
    };

    return(
        <a className={userMasterDetailStyles.animeCardLinkContainer} href={props.siteUrl} onClick={preventDescriptionLink}>
            <div className={userMasterDetailStyles.animeCardContainer}>
                <h4 className={userMasterDetailStyles.cardTitle}>{props.title.romaji}</h4>
                <h5 className={userMasterDetailStyles.cardTime}>{getNextEpisodeTimeUntilString()}</h5>
                <img className={userMasterDetailStyles.cardImage} src={props.coverImage.large}/>
                <div className={userMasterDetailStyles.desciprtionGenreWrapper}>
                    <p className={userMasterDetailStyles.cardDescription}>{props.description.replace(/<(?:.|\n)*?>/gm, '')}</p>
                    <p className={userMasterDetailStyles.cardGenres}>{displayGenres()}</p>
                </div>
            </div>
        </a>
    );
};

export default AnimeCard;