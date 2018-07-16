module.exports = {
    MY_ANIME_QUERY_STRING: 
        `query ($ids: [Int], $page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (type: ANIME, id_in: $ids) {
                    id
                    title {
                        romaji
                    }
                    status
                    siteUrl
                    coverImage {
                        large
                        medium
                    }
                    genres
                    description
                    season
                    startDate {
                      year
                    }
                    nextAiringEpisode {
                        timeUntilAiring
                        episode
                    }
                }
            }
        }`,
    POPULAR_ANIME_QUERY_STRING: 
        `query ($page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                }
                status
                siteUrl
                coverImage {
                  large
                  medium
                }
                genres
                description
                season
                startDate {
                  year
                }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
        }`,
    NEW_ANIME_WINTER_QUERY_STRING: 
        `query ($page: Int, $perPage: Int, $seasonYear: Int) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, season: WINTER, seasonYear: $seasonYear, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                }
                status
                siteUrl
                coverImage {
                  large
                  medium
                }
                genres
                description
                season
                startDate {
                  year
                }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
        }`,
    NEW_ANIME_SPRING_QUERY_STRING: 
        `query ($page: Int, $perPage: Int, $seasonYear: Int) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, season: SPRING, seasonYear: $seasonYear, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                }
                status
                siteUrl
                coverImage {
                  large
                  medium
                }
                genres
                description
                season
                startDate {
                  year
                }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
        }`,
    NEW_ANIME_SUMMER_QUERY_STRING: 
        `query ($page: Int, $perPage: Int, $seasonYear: Int) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, season: SUMMER, seasonYear: $seasonYear, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                }
                status
                siteUrl
                coverImage {
                  large
                  medium
                }
                genres
                description
                season
                startDate {
                  year
                }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
        }`,
    NEW_ANIME_FALL_QUERY_STRING: 
        `query ($page: Int, $perPage: Int, $seasonYear: Int) {
            Page (page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media (type: ANIME, season: FALL, seasonYear: $seasonYear, sort: TRENDING_DESC) {
                id
                title {
                  romaji
                }
                status
                siteUrl
                coverImage {
                  large
                  medium
                }
                genres
                description
                season
                startDate {
                  year
                }
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
              }
            }
        }`,
    SEASON_WINTER: 'Wi',
    SEASON_SPRING: 'Sp',
    SEASON_SUMMER: 'Su',
    SEASON_FALL: 'Fa',
    STATUS_FINISHED: "FINISHED",
    STATUS_RELEASING: "RELEASING",
    STATUS_NOY_YET_RELEASED: "NOT_YET_RELEASED",
    STATUS_CANCELLED: "CANCELLED",
    API_ENDPOINT_URL: 'https://graphql.anilist.co'
};