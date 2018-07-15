import constants from '../constants/anilist_api_constants.js';

class AnilistAPI {
    static getMyAnimes(ids, page, perPage) {
        let vars = {
            page,
            perPage,
            ids
        };

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: constants.MY_ANIME_QUERY_STRING,
                variables: vars
            })
        };

        return fetch(constants.API_ENDPOINT_URL, options);
    }

    static getPopularAnimes(page, perPage) {
        let vars = {
            page,
            perPage
        };

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: constants.POPULAR_ANIME_QUERY_STRING,
                variables: vars
            })
        };

        return fetch(constants.API_ENDPOINT_URL, options);
    }

    static getNewAnimes(season, seasonYear, page, perPage) {
        let vars = {
            page,
            perPage,
            seasonYear
        };

        let correctSeasonQuery = '';
        switch(season) {
            case constants.SEASON_WINTER:
                correctSeasonQuery = constants.NEW_ANIME_WINTER_QUERY_STRING;
                break;
            case constants.SEASON_SPRING:
                correctSeasonQuery = constants.NEW_ANIME_SPRING_QUERY_STRING;
                break;
            case constants.SEASON_SUMMER:
                correctSeasonQuery = constants.NEW_ANIME_SUMMER_QUERY_STRING;
                break;
            case constants.SEASON_FALL:
                correctSeasonQuery = constants.NEW_ANIME_FALL_QUERY_STRING;
                break;
        }

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: correctSeasonQuery,
                variables: vars
            })
        };

        return fetch(constants.API_ENDPOINT_URL, options);
    }
}

export default AnilistAPI;