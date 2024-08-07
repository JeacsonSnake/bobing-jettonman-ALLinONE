import { createStore } from 'vuex';
import { getResult } from '../util/result';
export var store = createStore({
    state: {
        playerRank: [],
        singleRankTemplate: {
            playerName: '',
            prize: [],
        },
        isONFirst: true,
        singleRank: {
            playerName: '个人奖项',
            prize: [],
        },
        singlePrizeTemplate: {
            prizeName: '',
            imgUrl: '',
            prizeGetNum: 0,
        },
        prizeNow: {
            imgUrl: 'blank.svg',
            prizeName: '博空',
        },
        poorLuck: false,
        resultDiceNumArr: [],
        playerNow: -1,
        playerAmount: 0,
        prizeName: [
            'YiXiu',
            'ErJu',
            'SiJin',
            'SanHong',
            'DuiTang',
            'SiDianHong',
            'WuBoHei',
            'WuBoHong',
            'LiuBoHei',
            'BianDiJing',
            'LiuBoHong',
            'ZhuangYuanChaJinHua',
            'NULL',
        ],
        prizeRealName: [
            '一秀',
            '二举',
            '四进',
            '三红',
            '对堂!',
            '四点红!',
            '五子登科!',
            '红五王!',
            '六博黑!',
            '遍地锦!',
            '六博红!',
            '状元插金花!',
            '博空~',
        ],
        prizeImgUrl: [
            'yiXIU.svg',
            'erju.svg',
            'sijin.svg',
            'sanhong.svg',
            'duitang.svg',
            'sidianhong.svg',
            'wubohei.svg',
            'redotFIVE.svg',
            'blackdot-6.svg',
            'blossom-ONE.svg',
            'All-around-6.svg',
            'icing4+2.svg',
            'blank.svg',
        ],
    },
    getters: {},
    mutations: {
        changePlayerAmount: function (state, playerNum) {
            state.playerAmount = playerNum;
        },
        changePlayerNow: function (state, playerNum) {
            state.playerNow = playerNum;
        },
        clearSingleRank: function (state) {
            state.singleRank = {
                playerName: '个人奖项',
                prize: [],
            };
        },
        clearPlayerRank: function (state) {
            state.playerRank = [];
        },
        setPlayerRank: function (state, rankValue) {
            state.playerRank = JSON.parse(JSON.stringify(rankValue));
        },
        setSingleRank: function (state, _a) {
            var playerName = _a.playerName, prize = _a.prize;
            state.singleRank = {
                playerName: playerName,
                prize: prize,
            };
            // console.log('state.singleRank', state.singleRank)
        },
        clearResultDiceNumArr: function (state) {
            state.resultDiceNumArr = [];
        },
        setResultDiceNumArr: function (state, ResultDiceNumArr) {
            state.resultDiceNumArr = JSON.parse(JSON.stringify(ResultDiceNumArr));
        },
        setisONFirst: function (state, value) {
            state.isONFirst = value;
        },
    },
    actions: {
        getNewRun: function (_a, playerNum) {
            var commit = _a.commit, state = _a.state;
            var localPlayersRank = localStorage.getItem('Bobing_playersRank');
            if (localPlayersRank) {
                // console.log('删掉了')
                localStorage.removeItem('Bobing_playersRank');
            }
            commit('changePlayerAmount', playerNum);
            commit('changePlayerNow', 0);
            commit('clearSingleRank');
            commit('clearPlayerRank');
            commit('clearResultDiceNumArr');
            commit('setisONFirst', true);
            // this.dispatch("getSinglePlayerRank", 1)
            // console.log(`getClear`);
        },
        getNextResult: function (_a) {
            var state = _a.state;
            if (state.playerNow == state.playerAmount) {
                state.playerNow = 1;
                this.commit('setisONFirst', false);
            }
            else {
                state.playerNow++;
            }
            var rollingResult = getResult(state.isONFirst);
            // console.log(`rollingResult`, rollingResult);
            state.prizeName.forEach(function (p, i) {
                if (rollingResult.resultName == p) {
                    if (rollingResult.resultName == 'NULL') {
                        state.poorLuck = true;
                    }
                    else {
                        state.poorLuck = false;
                    }
                    state.prizeNow.imgUrl = state.prizeImgUrl[i];
                    state.prizeNow.prizeName = state.prizeRealName[i];
                }
            });
            state.resultDiceNumArr = rollingResult.resultNum.split('');
            // console.log(`state.resultDiceNumArr`, state.resultDiceNumArr);
            this.dispatch('setPlayerRank', rollingResult);
        },
        setPlayerRank: function (_a, rollingResult) {
            var state = _a.state;
            if (state.poorLuck === true) {
                this.dispatch('setNowPlayerRank');
                return;
            }
            var isPlayerSet = false;
            var isPrizeSet = false;
            state.playerRank.forEach(function (singleRankObj, index, playerRank) {
                if (isPlayerSet) {
                    return;
                }
                if (singleRankObj.playerName === state.playerNow) {
                    singleRankObj.prize.forEach(function (singlePrizeObj, index, singlePrize) {
                        if (isPrizeSet) {
                            return;
                        }
                        if (singlePrizeObj.prizeName === rollingResult.resultName) {
                            isPrizeSet = true;
                            singlePrizeObj.prizeGetNum++;
                        }
                    });
                    if (!isPrizeSet) {
                        var singlePrize = JSON.parse(JSON.stringify(state.singlePrizeTemplate));
                        singlePrize.prizeName = rollingResult.resultName;
                        singlePrize.imgUrl = state.prizeNow.imgUrl;
                        singlePrize.prizeGetNum++;
                        // Find the correct index to insert the new prize based on prizeNameAll
                        var newPrizeIndex_1 = state.prizeName.indexOf(rollingResult.resultName);
                        var insertIndex = singleRankObj.prize.findIndex(function (prize) {
                            return state.prizeName.indexOf(prize.prizeName) < newPrizeIndex_1;
                        });
                        if (insertIndex === -1) {
                            singleRankObj.prize.push(singlePrize); // If no such index is found, append to the end
                        }
                        else {
                            singleRankObj.prize.splice(insertIndex, 0, singlePrize); // Insert at the correct position
                        }
                        // singleRankObj.prize.push(singlePrize)
                    }
                    isPlayerSet = true;
                }
            });
            if (!isPlayerSet) {
                // console.log('111');
                var singlePrize = JSON.parse(JSON.stringify(state.singlePrizeTemplate));
                var singleRank = JSON.parse(JSON.stringify(state.singleRankTemplate));
                singlePrize.prizeName = rollingResult.resultName;
                singlePrize.imgUrl = state.prizeNow.imgUrl;
                singlePrize.prizeGetNum++;
                singleRank.prize.push(singlePrize);
                singleRank.playerName = state.playerNow;
                state.playerRank.push(singleRank);
                // console.log("singlePrize", singlePrize);
            }
            // console.log("12345");
            this.dispatch('setNowPlayerRank');
            // console.log("4567");
        },
        setNowPlayerRank: function (_a) {
            var state = _a.state;
            var displayPrize = [];
            // console.log("2323555",state.playerRank);
            state.playerRank.forEach(function (singleRankObj, index) {
                if (displayPrize.length != 0) {
                    // console.log('?', displayPrize);
                    return;
                }
                // console.log(singleRankObj);
                if (singleRankObj.playerName == state.playerNow) {
                    displayPrize = singleRankObj.prize;
                }
            });
            this.commit('setSingleRank', {
                playerName: state.playerNow,
                prize: displayPrize,
            });
            var localPlayersRank = {
                playerRank: JSON.parse(JSON.stringify(state.playerRank)),
                playerNow: state.playerNow,
                playerAmount: state.playerAmount,
                resultDiceNumArr: JSON.parse(JSON.stringify(state.resultDiceNumArr)),
            };
            // console.log("localPlayersRank: ", localPlayersRank);
            localStorage.setItem('Bobing_playersRank', JSON.stringify(localPlayersRank));
            // console.log("Bobing_playersRank: ", localStorage.getItem("Bobing_playersRank"))
        },
    },
    modules: {},
});
