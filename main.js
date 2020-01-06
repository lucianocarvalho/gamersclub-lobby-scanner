'use strict';

const elements = {
    tooltip: document.getElementById('tooltip-span')
};

const storage = {
    lastHovered: null
};

const parser = new DOMParser();

const getStorageData = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            chrome.runtime.lastError
            ? reject(Error(chrome.runtime.lastError.message))
            : resolve(result)
        });
    });
};

const fetchResource = (input, init) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                resolve(response.body);
            }
        });
    });
};

const buildEndpoints = (api_key, steamId) => {
    return [
        'https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' + api_key + '&relationship=friend&steamid=' + steamId,
        'https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=' + api_key + '&steamid=' + steamId,
        'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + api_key + '&steamids=' + steamId,
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + api_key + '&steamid=' + steamId
    ];
};

const getAllPlayerInfo = (card) => {
    card.setAttribute("data-info-loaded", "loading");

    const playerURL = card.href;

    elements.tooltip.innerHTML = card.getAttribute('data-tip-text');

    fetchResource(playerURL).then( (response) => {
        return getSteamIDByResponse(response);
    }).then( (steamId) => {
        getStorageData('api_key').then( (response) => {
            return response.api_key;
        }).then( (api_key) => {
            return buildEndpoints(api_key, steamId);
        }).then( (endpoints) => {
            Promise.all( 
                endpoints.map( (endpoint) => fetchResource( endpoint ) )
            )
            .then( (responses) => responses.map( (response) => parseToJSON( response ) ) )
            .then( ([ GetFriendList, GetUserStatsForGame, GetPlayerSummaries, GetOwnedGames ]) => {
                card.setAttribute("data-info-loaded", "loaded");

                if( card !== storage.lastHovered ) {
                    return;
                }

                elements.tooltip.innerHTML = buildTooltip([
                    handleDefaultData(card),
                    handleGetFriendList( GetFriendList ),
                    handleGetUserStatsForGame( GetUserStatsForGame ),
                    handleGetPlayerSummaries( GetPlayerSummaries ),
                    handleGetOwnedGames( GetOwnedGames ),
                ]);
            }).catch( (e) => {
                card.removeAttribute('data-info-loaded');
            });
        });
    });
};

const getSteamIDByResponse = (response) => {
    const dom = parser.parseFromString(response, "text/html");
    const steamURL = dom.getElementsByClassName('Button--steam')[0].href;
    return steamURL.split('/')[4];
};

const buildTooltip = (results) => {
    let html = '';

    results.forEach( (data) => {
        data.forEach( (row) => {
            html += "<p style='margin-bottom:0; line-height:1.2;'>";
            html += "<b>" + row.name + ":</b> " + row.value;
            html += "</p>";
        })
    });

    return html;
};  

const handleDefaultData = (card) => {
    let array = [];

    const title = card.getAttribute("data-tip-text");
    const fields = title.split(" | KDR: ");

    array.push( data("Nome", fields[0] ) );

    const suspectKDR = ( parseFloat( fields[1] ) >= 1.5 ) ? true : false;
    const kdr = ( suspectKDR ) ? blockedSpan( fields[1] ) : fields[1];

    array.push( data("KDR", kdr ) );

    return array;
};

const handleGetFriendList = (json) => {
    let array = [];

    if( json.friendslist === undefined ) {
        array.push( data("Amigos", blockedSpan() ) );
        return array;
    }

    array.push( data("Amigos", json.friendslist.friends.length ) );

    return array;
};

const handleGetUserStatsForGame = (json) => {
    let array = [];

    if( json == null ) {
        array.push( data("Mapas jogados", blockedSpan() ) );
        return array;
    }

    const mapsPlayed = json.playerstats.stats.filter( (row) => {
        return ( row.name == "total_matches_played" );
    })[0].value;

    array.push( data("Mapas jogados", mapsPlayed ) );

    return array;
};

const handleGetPlayerSummaries = (json) => {
    let array = [];
    let visibility = ( [1,2].includes( json.response.players[0].communityvisibilitystate ) ) ? blockedSpan("Sim") : "Não";
    array.push( data("Perfil privado", visibility ) );
    return array;
};

const handleGetOwnedGames = (json) => {
    let array = [];

    if( json == null || json.response.length == 0 || json.response.games == undefined ) {
        array.push( data("Horas jogadas", blockedSpan() ) );
        return array;
    }

    let playedTime = json.response.games.filter( (row) => {
        return ( row.appid == "730" );
    })[0];

    if( playedTime.playtime_forever == 0 ) {
        array.push( data("Horas jogadas", blockedSpan() ) );
    } else {
        array.push( data("Horas jogadas", ( playedTime.playtime_forever / 60 ).toFixed(2) ) );
    }

    return array;
};

const blockedSpan = (field) => {
    let string = ( field == null ) ? "BLOQUEADO" : field;
    return "<span style='color:red;font-weight:bold'>"+ string + "</span>";
};

const parseToJSON = (string) => {
    if( isValidJSON(string) ) {
        return JSON.parse(string);
    }

    return null;
};

const isValidJSON = (json) => {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }

    return true;
};

const data = (name, value) => {
    return {
        name: name,
        value: value
    };
};

const observer = new MutationObserver( (mutations) => {
    mutations.forEach( (mutation) => {

        if( mutation.type !== 'childList' && mutation.addedNodes.length === 0 ) {
            return false;
        }

        mutation.addedNodes.forEach( (node) => {
            if( node.nodeType === Node.TEXT_NODE || ! node.classList.contains("sala-card-wrapper") ) {
                return false;
            }

            const players = node.querySelectorAll('a[href^="/jogador/"]');

            players.forEach( (card) => {
                card.addEventListener("mouseover", (e) => {
                    storage.lastHovered = card;

                    if( ["loaded", "loading"].includes( card.getAttribute("data-info-loaded") ) ) {
                        return;
                    }

                    getAllPlayerInfo(card);
                });

                card.addEventListener("mouseout", (e) => {
                    card.removeAttribute("data-info-loaded");
                });
            });
        });
    });
});

var target = document.getElementsByClassName("tabs-content")[0];
var config = { childList: true, attributes: true, characterData: true, subtree: true };

if( target ) {
    observer.observe(target, config);
}