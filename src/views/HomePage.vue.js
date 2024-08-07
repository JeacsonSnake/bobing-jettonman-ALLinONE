/* __placeholder__ */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ref, reactive, computed, onMounted, onBeforeMount, readonly } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from 'element-plus';
import { InfoFilled as ElIconInfo, Histogram as ElIconSData, Refresh as ElIconRefresh, Tickets as ElIconTickets, IceCreamRound as ElIconIceCreamRound, } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
export default (await import('vue')).defineComponent({
    setup: function () {
        var store = useStore();
        var prizeResultVisible = ref(false);
        var aboutVisible = ref(false);
        var rulesVisible = ref(false);
        var rankVisible = ref(false);
        var restartVisible = ref(false);
        var welcomeVisible = ref(false);
        var loadingVisible = ref(true);
        var playerNum = ref("");
        var playerNumOptions = readonly([
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
        ]);
        var ruleData = readonly([
            {
                prize: "秀才",
                name: "一秀",
                diceNumArr: ["4"],
                description: "六个骰子中有且仅有一个骰子点数为四",
            },
            {
                prize: "举人",
                name: "二举",
                diceNumArr: ["4", "4"],
                description: "六个骰子中有且仅有两个骰子点数为四",
            },
            {
                prize: "进士",
                name: "四进",
                diceNumArr: ["2", "2", "2", "2"],
                description: "六个骰子中有四个骰子拥有除了四以外的相同点数",
            },
            {
                prize: "探花",
                name: "三红",
                diceNumArr: ["4", "4", "4"],
                description: "六个骰子中有三个骰子点数为四",
            },
            {
                prize: "榜眼",
                name: "对堂",
                diceNumArr: ["1", "2", "3", "4", "5", "6"],
                description: "六个骰子点数按顺序排出",
            },
            {
                prize: "状元",
                name: "四点红",
                diceNumArr: ["4", "4", "4", "4"],
                description: "六个骰子中有四个骰子点数为四",
            },
            {
                prize: "状元",
                name: "五子登科",
                diceNumArr: ["2", "2", "2", "2", "2"],
                description: "六个骰子中有五个骰子拥有除了四、一以外的相同点数",
            },
            {
                prize: "状元",
                name: "五王",
                diceNumArr: ["4", "4", "4", "4", "4"],
                description: "六个骰子中有五个骰子点数为四",
            },
            {
                prize: "状元",
                name: "六博黑",
                diceNumArr: ["2", "2", "2", "2", "2", "2"],
                description: "六个骰子皆拥有除了四、一以外的相同点数",
            },
            {
                prize: "状元",
                name: "遍地锦",
                diceNumArr: ["1", "1", "1", "1", "1", "1"],
                description: "六个骰子点数皆为一",
            },
            {
                prize: "状元",
                name: "六博红",
                diceNumArr: ["4", "4", "4", "4", "4", "4"],
                description: "六个骰子点数皆为四",
            },
            {
                prize: "状元",
                name: "状元插金花",
                diceNumArr: ["4", "4", "4", "4", "1", "1"],
                description: "六个骰子中有四个骰子点数为四，且剩余两个骰子点数为一",
            },
        ]);
        var rankData = computed(function () { return store.state.playerRank; });
        var singleRankData = computed(function () { return store.state.singleRank; });
        var diceNumArr = computed(function () { return store.state.resultDiceNumArr; });
        var playerNow = computed(function () { return store.state.playerNow; });
        var prizeNow = computed(function () { return store.state.prizeNow; });
        var poorLuck = computed(function () { return store.state.poorLuck; });
        var playerAmount = computed(function () { return store.state.playerAmount; });
        var jumpFrontEnd = function () {
            window.open("https://github.com/JeacsonSnake/bobing-jettonman-ALLinONE", "_blank");
        };
        var getDiseImg = function (imgUrl) {
            return "".concat(import.meta.env.BASE_URL, "image/").concat(imgUrl);
        };
        var getDiceImgByIndex = function (index) {
            var imgUrl = "dice/DICE-" + index + ".svg";
            return getDiseImg(imgUrl);
        };
        var getRan = function () {
            rankVisible.value = true;
        };
        var getRestart = function () {
            restartVisible.value = true;
        };
        var start = function () {
            var p = playerNum.value;
            if (p == "") {
                ElMessage.error("人数尚未确定!");
            }
            else {
                ElMessageBox.confirm("你将开启新一轮游戏，确定吗?", "注意", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    confirmButtonClass: "confirmButton",
                    cancelButtonClass: "cancelButton",
                })
                    .then(function () {
                    setTimeout(function () {
                        restartVisible.value = false;
                        welcomeVisible.value = false;
                    }, 100);
                    var loading = startLoading("创建中...");
                    setTimeout(function () {
                        store
                            .dispatch("getNewRun", p)
                            .then(function () {
                            setTimeout(function () {
                                endLoading(loading);
                                ElMessage({
                                    type: "success",
                                    message: "已创建新一轮游戏!",
                                });
                            }, 400);
                        })
                            .catch(function (action) { });
                    }, 300);
                })
                    .catch(function (err) {
                    if (err == "cancel") {
                        ElMessage({
                            type: "info",
                            message: "已取消开启新一轮游戏",
                        });
                    }
                });
            }
        };
        var getNextPlayerResults = function () {
            if (playerNow.value == -1) {
                restartVisible.value = true;
                ElMessage({
                    type: "error",
                    message: "The number of players is not set yet!",
                });
            }
            else {
                var loading_1 = startLoading("掷骰入碗...");
                setTimeout(function () {
                    store
                        .dispatch("getNextResult")
                        .then(function () {
                        setTimeout(function () {
                            endLoading(loading_1);
                        }, 400);
                    })
                        .then(function () {
                        setTimeout(function () {
                            prizeResultVisible.value = true;
                        }, 700);
                    });
                }, 300);
            }
        };
        var startLoading = function (loadingText) {
            var loading = ElLoading.service({
                lock: true,
                target: ".homePage",
                text: loadingText,
                background: "rgba(200, 200, 200, 1)",
            });
            return loading;
        };
        var endLoading = function (loading) {
            loading.close();
        };
        var playerRankDataFormatter = function (row, column, cellValue, index) {
            var formattedCellValue = "";
            cellValue.forEach(function (singlePrizeObj) {
                var prizeRealName = "";
                store.state.prizeName.forEach(function (SingleRealName, index) {
                    if (SingleRealName === singlePrizeObj.prizeName) {
                        prizeRealName = store.state.prizeRealName[index];
                    }
                });
                formattedCellValue += prizeRealName;
                formattedCellValue += "*";
                formattedCellValue += singlePrizeObj.prizeGetNum;
                formattedCellValue += ", ";
            });
            return formattedCellValue.slice(0, -2);
        };
        onBeforeMount(function () {
            // this.restartVisible = true;
            // this.loadingVisible = true;
        }),
            onMounted(function () {
                var localPlayersRankJSON = localStorage.getItem("Bobing_playersRank");
                if (localPlayersRankJSON) {
                    var localPlayersRank_1 = JSON.parse(localPlayersRankJSON);
                    var loading_2 = startLoading("正在读取存档...");
                    setTimeout(function () {
                        store.commit("changePlayerAmount", localPlayersRank_1.playerAmount);
                        store.commit("changePlayerNow", localPlayersRank_1.playerNow);
                        store.commit("setPlayerRank", localPlayersRank_1.playerRank);
                        store.commit("setResultDiceNumArr", localPlayersRank_1.resultDiceNumArr);
                        store.dispatch("setNowPlayerRank");
                        loadingVisible.value = false;
                    }, 2000);
                    setTimeout(function () {
                        endLoading(loading_2);
                    }, 2500);
                }
                else {
                    var loading_3 = startLoading("加载中...");
                    setTimeout(function () {
                        welcomeVisible.value = true;
                        loadingVisible.value = false;
                    }, 2000);
                    setTimeout(function () {
                        endLoading(loading_3);
                    }, 2500);
                }
            });
        return {
            prizeResultVisible: prizeResultVisible,
            aboutVisible: aboutVisible,
            rulesVisible: rulesVisible,
            rankVisible: rankVisible,
            restartVisible: restartVisible,
            welcomeVisible: welcomeVisible,
            loadingVisible: loadingVisible,
            playerNum: playerNum,
            playerNumOptions: playerNumOptions,
            ruleData: ruleData,
            ElIconInfo: ElIconInfo,
            ElIconSData: ElIconSData,
            ElIconRefresh: ElIconRefresh,
            ElIconTickets: ElIconTickets,
            ElIconIceCreamRound: ElIconIceCreamRound,
            rankData: rankData,
            singleRankData: singleRankData,
            diceNumArr: diceNumArr,
            playerNow: playerNow,
            prizeNow: prizeNow,
            poorLuck: poorLuck,
            playerAmount: playerAmount,
            jumpFrontEnd: jumpFrontEnd,
            getDiseImg: getDiseImg,
            getDiceImgByIndex: getDiceImgByIndex,
            getRan: getRan,
            getRestart: getRestart,
            start: start,
            getNextPlayerResults: getNextPlayerResults,
            startLoading: startLoading,
            endLoading: endLoading,
            playerRankDataFormatter: playerRankDataFormatter,
        };
    },
});
;
function __VLS_template() {
    var __VLS_ctx;
    /* Components */
    var __VLS_otherComponents;
    var __VLS_own;
    var __VLS_localComponents;
    var __VLS_components;
    var __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    var __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("homePage") }));
    if (__VLS_ctx.loadingVisible) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("loadingPage") }));
        // @ts-ignore
        var __VLS_0_1 = {}
            .ElDialog;
        ({}.ElDialog);
        ({}.ElDialog);
        __VLS_components.ElDialog;
        __VLS_components.elDialog;
        __VLS_components.ElDialog;
        __VLS_components.elDialog;
        // @ts-ignore
        [ElDialog, ElDialog,];
        // @ts-ignore
        var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0_1, new __VLS_0_1(__assign(__assign({ modelValue: ((__VLS_ctx.loadingVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })));
        var __VLS_2_1 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ modelValue: ((__VLS_ctx.loadingVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
        ({}(__assign(__assign({ modelValue: ((__VLS_ctx.loadingVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })));
        var __VLS_5 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_0_1, __VLS_2_1));
        __VLS_elementAsFunction(__VLS_intrinsicElements.img)(__assign({ src: ("../../public/image/title.png"), alt: ("") }, { class: ("ruleImg") }));
        // @ts-ignore
        [loadingVisible, loadingVisible,];
        __VLS_nonNullable(__VLS_5.slots).default;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("navBtnGroup") }));
    // @ts-ignore
    var __VLS_6 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconSData)) })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconSData)) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    ({}(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconSData)) })));
    var __VLS_12;
    var __VLS_13 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.getRan();
            // @ts-ignore
            [ElIconSData, getRan,];
        }
    };
    var __VLS_11 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_6, __VLS_8));
    var __VLS_9;
    var __VLS_10;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("navBtnText") }));
    __VLS_nonNullable(__VLS_11.slots).default;
    // @ts-ignore
    var __VLS_14 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconRefresh)) })));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconRefresh)) })], __VLS_functionalComponentArgsRest(__VLS_15), false));
    ({}(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconRefresh)) })));
    var __VLS_20;
    var __VLS_21 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.getRestart();
            // @ts-ignore
            [ElIconRefresh, getRestart,];
        }
    };
    var __VLS_19 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_14, __VLS_16));
    var __VLS_17;
    var __VLS_18;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("navBtnText") }));
    __VLS_nonNullable(__VLS_19.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("navBtnGroup") }));
    // @ts-ignore
    var __VLS_22 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    var __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconTickets)) })));
    var __VLS_24 = __VLS_23.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconTickets)) })], __VLS_functionalComponentArgsRest(__VLS_23), false));
    ({}(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconTickets)) })));
    var __VLS_28;
    var __VLS_29 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.rulesVisible = true;
            // @ts-ignore
            [ElIconTickets, rulesVisible,];
        }
    };
    var __VLS_27 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_22, __VLS_24));
    var __VLS_25;
    var __VLS_26;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("navBtnText") }));
    __VLS_nonNullable(__VLS_27.slots).default;
    // @ts-ignore
    var __VLS_30 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    var __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconIceCreamRound)) })));
    var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconIceCreamRound)) })], __VLS_functionalComponentArgsRest(__VLS_31), false));
    ({}(__assign({ 'onClick': {} }, { link: (true), icon: ((__VLS_ctx.ElIconIceCreamRound)) })));
    var __VLS_36;
    var __VLS_37 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.aboutVisible = true;
            // @ts-ignore
            [ElIconIceCreamRound, aboutVisible,];
        }
    };
    var __VLS_35 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32));
    var __VLS_33;
    var __VLS_34;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("navBtnText") }));
    __VLS_nonNullable(__VLS_35.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("mobileSpecificSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("titleImgSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)(__assign({ src: ("../../public/image/title.png"), alt: ("") }, { class: ("titleImg") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("bodySection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("singleRankSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("playerName") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.singleRankData.playerName == "个人奖项"
        ? __VLS_ctx.singleRankData.playerName
        : "\u73A9\u5BB6 ".concat(__VLS_ctx.singleRankData.playerName));
    // @ts-ignore
    [singleRankData, singleRankData, singleRankData,];
    // @ts-ignore
    var __VLS_38 = {}
        .ElTable;
    ({}.ElTable);
    ({}.ElTable);
    __VLS_components.ElTable;
    __VLS_components.elTable;
    __VLS_components.ElTable;
    __VLS_components.elTable;
    // @ts-ignore
    [ElTable, ElTable,];
    // @ts-ignore
    var __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38(__assign(__assign({ data: ((__VLS_ctx.singleRankData.prize)) }, { class: ("prizeSection") }), { height: (("calc(var(--heightRate) * 337)")), emptyText: ("还未获奖"), showHeader: ((false)) })));
    var __VLS_40 = __VLS_39.apply(void 0, __spreadArray([__assign(__assign({ data: ((__VLS_ctx.singleRankData.prize)) }, { class: ("prizeSection") }), { height: (("calc(var(--heightRate) * 337)")), emptyText: ("还未获奖"), showHeader: ((false)) })], __VLS_functionalComponentArgsRest(__VLS_39), false));
    ({}(__assign(__assign({ data: ((__VLS_ctx.singleRankData.prize)) }, { class: ("prizeSection") }), { height: (("calc(var(--heightRate) * 337)")), emptyText: ("还未获奖"), showHeader: ((false)) })));
    var __VLS_43 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_38, __VLS_40));
    // @ts-ignore
    var __VLS_44 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({ property: ("imgUrl"), width: ("40"), }));
    var __VLS_46 = __VLS_45.apply(void 0, __spreadArray([{ property: ("imgUrl"), width: ("40"), }], __VLS_functionalComponentArgsRest(__VLS_45), false));
    ({}({ property: ("imgUrl"), width: ("40"), }));
    var __VLS_49 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_44, __VLS_46));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_49.slots).default;
        var scope = __VLS_getSlotParams(__VLS_thisSlot)[0];
        __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.getDiseImg(scope.row.imgUrl))), alt: (""), width: ("40"), height: ("40"), });
        // @ts-ignore
        [singleRankData, getDiseImg,];
        __VLS_nonNullable(__VLS_49.slots)['' /* empty slot name completion */];
    }
    // @ts-ignore
    var __VLS_50 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({ property: ("prizeGetNum"), width: ("100"), }));
    var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([{ property: ("prizeGetNum"), width: ("100"), }], __VLS_functionalComponentArgsRest(__VLS_51), false));
    ({}({ property: ("prizeGetNum"), width: ("100"), }));
    var __VLS_55 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_50, __VLS_52));
    __VLS_nonNullable(__VLS_43.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("diceDisplaySection") }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.diceNumArr)); _i < _a.length; _i++) {
        var _b = _a[_i], item = _b[0], index = _b[1];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("diceImgSection") }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.getDiceImgByIndex(item))), alt: (""), });
        // @ts-ignore
        [diceNumArr, getDiceImgByIndex,];
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("rollButtonSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.playerNow == __VLS_ctx.playerAmount || __VLS_ctx.playerNow == "0"
        ? "\u73A9\u5BB6 1"
        : "\u73A9\u5BB6 ".concat(__VLS_ctx.playerNow + 1));
    // @ts-ignore
    [playerNow, playerNow, playerNow, playerAmount,];
    // @ts-ignore
    var __VLS_56 = {}
        .ElButton;
    ({}.ElButton);
    ({}.ElButton);
    __VLS_components.ElButton;
    __VLS_components.elButton;
    __VLS_components.ElButton;
    __VLS_components.elButton;
    // @ts-ignore
    [ElButton, ElButton,];
    // @ts-ignore
    var __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56(__assign({ 'onClick': {} })));
    var __VLS_58 = __VLS_57.apply(void 0, __spreadArray([__assign({ 'onClick': {} })], __VLS_functionalComponentArgsRest(__VLS_57), false));
    ({}(__assign({ 'onClick': {} })));
    var __VLS_62;
    var __VLS_63 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.getNextPlayerResults();
            // @ts-ignore
            [getNextPlayerResults,];
        }
    };
    var __VLS_61 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_56, __VLS_58));
    var __VLS_59;
    var __VLS_60;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_nonNullable(__VLS_61.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("rankLayer") }));
    // @ts-ignore
    var __VLS_64 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({ title: ("排行榜"), modelValue: ((__VLS_ctx.rankVisible)), center: (true), }));
    var __VLS_66 = __VLS_65.apply(void 0, __spreadArray([{ title: ("排行榜"), modelValue: ((__VLS_ctx.rankVisible)), center: (true), }], __VLS_functionalComponentArgsRest(__VLS_65), false));
    ({}({ title: ("排行榜"), modelValue: ((__VLS_ctx.rankVisible)), center: (true), }));
    var __VLS_69 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_64, __VLS_66));
    // @ts-ignore
    var __VLS_70 = {}
        .ElTable;
    ({}.ElTable);
    ({}.ElTable);
    __VLS_components.ElTable;
    __VLS_components.elTable;
    __VLS_components.ElTable;
    __VLS_components.elTable;
    // @ts-ignore
    [ElTable, ElTable,];
    // @ts-ignore
    var __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70(__assign(__assign({ data: ((__VLS_ctx.rankData)) }, { class: ("rankSection") }), { emptyText: ("目前无人获奖") })));
    var __VLS_72 = __VLS_71.apply(void 0, __spreadArray([__assign(__assign({ data: ((__VLS_ctx.rankData)) }, { class: ("rankSection") }), { emptyText: ("目前无人获奖") })], __VLS_functionalComponentArgsRest(__VLS_71), false));
    ({}(__assign(__assign({ data: ((__VLS_ctx.rankData)) }, { class: ("rankSection") }), { emptyText: ("目前无人获奖") })));
    var __VLS_75 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_70, __VLS_72));
    // @ts-ignore
    var __VLS_76 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({ property: ("playerName"), label: ("玩家名"), fixed: (true), minWidth: ("50%"), }));
    var __VLS_78 = __VLS_77.apply(void 0, __spreadArray([{ property: ("playerName"), label: ("玩家名"), fixed: (true), minWidth: ("50%"), }], __VLS_functionalComponentArgsRest(__VLS_77), false));
    ({}({ property: ("playerName"), label: ("玩家名"), fixed: (true), minWidth: ("50%"), }));
    var __VLS_81 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_76, __VLS_78));
    // @ts-ignore
    [rankVisible, rankData,];
    // @ts-ignore
    var __VLS_82 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({ property: ("prize"), label: ("获得奖项"), formatter: ((__VLS_ctx.playerRankDataFormatter)), showOverflowTooltip: (true), }));
    var __VLS_84 = __VLS_83.apply(void 0, __spreadArray([{ property: ("prize"), label: ("获得奖项"), formatter: ((__VLS_ctx.playerRankDataFormatter)), showOverflowTooltip: (true), }], __VLS_functionalComponentArgsRest(__VLS_83), false));
    ({}({ property: ("prize"), label: ("获得奖项"), formatter: ((__VLS_ctx.playerRankDataFormatter)), showOverflowTooltip: (true), }));
    var __VLS_87 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84));
    // @ts-ignore
    [playerRankDataFormatter,];
    __VLS_nonNullable(__VLS_75.slots).default;
    __VLS_nonNullable(__VLS_69.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("restartLayer") }));
    // @ts-ignore
    var __VLS_88 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({ title: ("定义玩家数量"), modelValue: ((__VLS_ctx.restartVisible)), center: (true), }));
    var __VLS_90 = __VLS_89.apply(void 0, __spreadArray([{ title: ("定义玩家数量"), modelValue: ((__VLS_ctx.restartVisible)), center: (true), }], __VLS_functionalComponentArgsRest(__VLS_89), false));
    ({}({ title: ("定义玩家数量"), modelValue: ((__VLS_ctx.restartVisible)), center: (true), }));
    var __VLS_93 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_88, __VLS_90));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("restartSection") }));
    // @ts-ignore
    var __VLS_94 = {}
        .ElSelect;
    ({}.ElSelect);
    ({}.ElSelect);
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    __VLS_components.ElSelect;
    __VLS_components.elSelect;
    // @ts-ignore
    [ElSelect, ElSelect,];
    // @ts-ignore
    var __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({ placeholder: ("请选择(最多8人)"), modelValue: ((__VLS_ctx.playerNum)), popperAppendToBody: ((false)), }));
    var __VLS_96 = __VLS_95.apply(void 0, __spreadArray([{ placeholder: ("请选择(最多8人)"), modelValue: ((__VLS_ctx.playerNum)), popperAppendToBody: ((false)), }], __VLS_functionalComponentArgsRest(__VLS_95), false));
    ({}({ placeholder: ("请选择(最多8人)"), modelValue: ((__VLS_ctx.playerNum)), popperAppendToBody: ((false)), }));
    var __VLS_99 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_94, __VLS_96));
    var _loop_1 = function (item) {
        // @ts-ignore
        var __VLS_100 = {}
            .ElOption;
        ({}.ElOption);
        ({}.ElOption);
        __VLS_components.ElOption;
        __VLS_components.elOption;
        __VLS_components.ElOption;
        __VLS_components.elOption;
        // @ts-ignore
        [ElOption, ElOption,];
        // @ts-ignore
        var __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({ key: ((item.value)), label: ((item.label)), value: ((item.value)), }));
        var __VLS_102 = __VLS_101.apply(void 0, __spreadArray([{ key: ((item.value)), label: ((item.label)), value: ((item.value)), }], __VLS_functionalComponentArgsRest(__VLS_101), false));
        ({}({ key: ((item.value)), label: ((item.label)), value: ((item.value)), }));
        var __VLS_105 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_100, __VLS_102));
        // @ts-ignore
        [restartVisible, playerNum, playerNumOptions,];
    };
    for (var _c = 0, _d = __VLS_getVForSourceType((__VLS_ctx.playerNumOptions)); _c < _d.length; _c++) {
        var item = _d[_c][0];
        _loop_1(item);
    }
    __VLS_nonNullable(__VLS_99.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_93.slots).footer;
        // @ts-ignore
        var __VLS_106_1 = {}
            .ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        // @ts-ignore
        var __VLS_107 = __VLS_asFunctionalComponent(__VLS_106_1, new __VLS_106_1(__assign({ 'onClick': {} }, { class: ("restartFooter") })));
        var __VLS_108_1 = __VLS_107.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { class: ("restartFooter") })], __VLS_functionalComponentArgsRest(__VLS_107), false));
        ({}(__assign({ 'onClick': {} }, { class: ("restartFooter") })));
        var __VLS_112 = void 0;
        var __VLS_113 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.start();
                // @ts-ignore
                [start,];
            }
        };
        var __VLS_111 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_106_1, __VLS_108_1));
        var __VLS_109 = void 0;
        var __VLS_110 = void 0;
        __VLS_nonNullable(__VLS_111.slots).default;
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("rulesLayer") }));
    // @ts-ignore
    var __VLS_114 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({ title: ("博饼怎么玩?"), modelValue: ((__VLS_ctx.rulesVisible)), center: (true), }));
    var __VLS_116 = __VLS_115.apply(void 0, __spreadArray([{ title: ("博饼怎么玩?"), modelValue: ((__VLS_ctx.rulesVisible)), center: (true), }], __VLS_functionalComponentArgsRest(__VLS_115), false));
    ({}({ title: ("博饼怎么玩?"), modelValue: ((__VLS_ctx.rulesVisible)), center: (true), }));
    var __VLS_119 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_114, __VLS_116));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("ruleSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("ruleIntro") }));
    // @ts-ignore
    [rulesVisible,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("ruleImg") }));
    // @ts-ignore
    var __VLS_120 = {}
        .ElTable;
    ({}.ElTable);
    ({}.ElTable);
    __VLS_components.ElTable;
    __VLS_components.elTable;
    __VLS_components.ElTable;
    __VLS_components.elTable;
    // @ts-ignore
    [ElTable, ElTable,];
    // @ts-ignore
    var __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120(__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })));
    var __VLS_122 = __VLS_121.apply(void 0, __spreadArray([__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })], __VLS_functionalComponentArgsRest(__VLS_121), false));
    ({}(__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })));
    var __VLS_125 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_120, __VLS_122));
    // @ts-ignore
    var __VLS_126 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }));
    var __VLS_128 = __VLS_127.apply(void 0, __spreadArray([{ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }], __VLS_functionalComponentArgsRest(__VLS_127), false));
    ({}({ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }));
    var __VLS_131 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_126, __VLS_128));
    // @ts-ignore
    [ruleData,];
    // @ts-ignore
    var __VLS_132 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }));
    var __VLS_134 = __VLS_133.apply(void 0, __spreadArray([{ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }], __VLS_functionalComponentArgsRest(__VLS_133), false));
    ({}({ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }));
    var __VLS_137 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_132, __VLS_134));
    // @ts-ignore
    var __VLS_138 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }));
    var __VLS_140 = __VLS_139.apply(void 0, __spreadArray([{ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }], __VLS_functionalComponentArgsRest(__VLS_139), false));
    ({}({ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }));
    var __VLS_143 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_138, __VLS_140));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_143.slots).default;
        var scope = __VLS_getSlotParams(__VLS_thisSlot)[0];
        for (var _e = 0, _f = __VLS_getVForSourceType((scope.row.diceNumArr)); _e < _f.length; _e++) {
            var _g = _f[_e], item = _g[0], index = _g[1];
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)(__assign({ src: ((__VLS_ctx.getDiceImgByIndex(item))), key: ((index)), alt: (("index + ' '")) }, { class: ("diceImg") }));
            // @ts-ignore
            [getDiceImgByIndex,];
        }
    }
    // @ts-ignore
    var __VLS_144 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }));
    var __VLS_146 = __VLS_145.apply(void 0, __spreadArray([{ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }], __VLS_functionalComponentArgsRest(__VLS_145), false));
    ({}({ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }));
    var __VLS_149 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_144, __VLS_146));
    __VLS_nonNullable(__VLS_125.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("ruleIntro") }));
    __VLS_nonNullable(__VLS_119.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("aboutLayer") }));
    // @ts-ignore
    var __VLS_150 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({ title: ("关于"), modelValue: ((__VLS_ctx.aboutVisible)), center: (true), }));
    var __VLS_152 = __VLS_151.apply(void 0, __spreadArray([{ title: ("关于"), modelValue: ((__VLS_ctx.aboutVisible)), center: (true), }], __VLS_functionalComponentArgsRest(__VLS_151), false));
    ({}({ title: ("关于"), modelValue: ((__VLS_ctx.aboutVisible)), center: (true), }));
    var __VLS_155 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_150, __VLS_152));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("aboutSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("aboutSection_Title") }));
    // @ts-ignore
    [aboutVisible,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("aboutSection_Name") }));
    // @ts-ignore
    var __VLS_156 = {}
        .ElTooltip;
    ({}.ElTooltip);
    ({}.ElTooltip);
    __VLS_components.ElTooltip;
    __VLS_components.elTooltip;
    __VLS_components.ElTooltip;
    __VLS_components.elTooltip;
    // @ts-ignore
    [ElTooltip, ElTooltip,];
    // @ts-ignore
    var __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156(__assign({ class: ("item") }, { effect: ("dark"), content: ("Go to Github"), placement: ("top") })));
    var __VLS_158 = __VLS_157.apply(void 0, __spreadArray([__assign({ class: ("item") }, { effect: ("dark"), content: ("Go to Github"), placement: ("top") })], __VLS_functionalComponentArgsRest(__VLS_157), false));
    ({}(__assign({ class: ("item") }, { effect: ("dark"), content: ("Go to Github"), placement: ("top") })));
    var __VLS_161 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_156, __VLS_158));
    // @ts-ignore
    var __VLS_162 = {}
        .ElLink;
    ({}.ElLink);
    ({}.ElLink);
    __VLS_components.ElLink;
    __VLS_components.elLink;
    __VLS_components.ElLink;
    __VLS_components.elLink;
    // @ts-ignore
    [ElLink, ElLink,];
    // @ts-ignore
    var __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162(__assign(__assign({ 'onClick': {} }, { underline: ((false)), icon: ((__VLS_ctx.ElIconInfo)) }), { class: ("item") })));
    var __VLS_164 = __VLS_163.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { underline: ((false)), icon: ((__VLS_ctx.ElIconInfo)) }), { class: ("item") })], __VLS_functionalComponentArgsRest(__VLS_163), false));
    ({}(__assign(__assign({ 'onClick': {} }, { underline: ((false)), icon: ((__VLS_ctx.ElIconInfo)) }), { class: ("item") })));
    var __VLS_168;
    var __VLS_169 = {
        onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.jumpFrontEnd();
            // @ts-ignore
            [ElIconInfo, jumpFrontEnd,];
        }
    };
    var __VLS_167 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_162, __VLS_164));
    var __VLS_165;
    var __VLS_166;
    __VLS_nonNullable(__VLS_161.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_155.slots).footer;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prizeResultLayer") }));
    // @ts-ignore
    var __VLS_170 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({ modelValue: ((__VLS_ctx.prizeResultVisible)), center: (true), modal: ((false)), }));
    var __VLS_172 = __VLS_171.apply(void 0, __spreadArray([{ modelValue: ((__VLS_ctx.prizeResultVisible)), center: (true), modal: ((false)), }], __VLS_functionalComponentArgsRest(__VLS_171), false));
    ({}({ modelValue: ((__VLS_ctx.prizeResultVisible)), center: (true), modal: ((false)), }));
    var __VLS_175 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_170, __VLS_172));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prizeResultSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.img)({ src: ((__VLS_ctx.getDiseImg(__VLS_ctx.prizeNow.imgUrl))), alt: (""), });
    // @ts-ignore
    [getDiseImg, prizeResultVisible, prizeNow,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_175.slots).footer;
        __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: (({ poorLuck: __VLS_ctx.poorLuck })) }));
        __VLS_styleScopedClasses = ({ poorLuck: poorLuck });
        (__VLS_ctx.prizeNow.prizeName);
        // @ts-ignore
        [prizeNow, poorLuck,];
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("welcomePage") }));
    // @ts-ignore
    var __VLS_176 = {}
        .ElDialog;
    ({}.ElDialog);
    ({}.ElDialog);
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    __VLS_components.ElDialog;
    __VLS_components.elDialog;
    // @ts-ignore
    [ElDialog, ElDialog,];
    // @ts-ignore
    var __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176(__assign(__assign({ title: ("欢迎来到博饼·状元筹!"), modelValue: ((__VLS_ctx.welcomeVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })));
    var __VLS_178 = __VLS_177.apply(void 0, __spreadArray([__assign(__assign({ title: ("欢迎来到博饼·状元筹!"), modelValue: ((__VLS_ctx.welcomeVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })], __VLS_functionalComponentArgsRest(__VLS_177), false));
    ({}(__assign(__assign({ title: ("欢迎来到博饼·状元筹!"), modelValue: ((__VLS_ctx.welcomeVisible)) }, { class: ("welcomeLayer") }), { center: (true), showClose: ((false)), closeOnClickModal: ((false)), closeOnPressEscape: ((false)) })));
    var __VLS_181 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_176, __VLS_178));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("welcomeSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("rootSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("title") }));
    // @ts-ignore
    [welcomeVisible,];
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("info") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("intro") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("ruleSection") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("title") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("info mb") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("intro") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("ruleImg") }));
    // @ts-ignore
    var __VLS_182 = {}
        .ElTable;
    ({}.ElTable);
    ({}.ElTable);
    __VLS_components.ElTable;
    __VLS_components.elTable;
    __VLS_components.ElTable;
    __VLS_components.elTable;
    // @ts-ignore
    [ElTable, ElTable,];
    // @ts-ignore
    var __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182(__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })));
    var __VLS_184 = __VLS_183.apply(void 0, __spreadArray([__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })], __VLS_functionalComponentArgsRest(__VLS_183), false));
    ({}(__assign({ data: ((__VLS_ctx.ruleData)) }, { style: ({}) })));
    var __VLS_187 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_182, __VLS_184));
    // @ts-ignore
    var __VLS_188 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }));
    var __VLS_190 = __VLS_189.apply(void 0, __spreadArray([{ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }], __VLS_functionalComponentArgsRest(__VLS_189), false));
    ({}({ prop: ("prize"), label: ("奖项"), minWidth: ("15%"), }));
    var __VLS_193 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_188, __VLS_190));
    // @ts-ignore
    [ruleData,];
    // @ts-ignore
    var __VLS_194 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }));
    var __VLS_196 = __VLS_195.apply(void 0, __spreadArray([{ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }], __VLS_functionalComponentArgsRest(__VLS_195), false));
    ({}({ prop: ("name"), label: ("具体名称"), minWidth: ("20%"), }));
    var __VLS_199 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_194, __VLS_196));
    // @ts-ignore
    var __VLS_200 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn, ElTableColumn,];
    // @ts-ignore
    var __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }));
    var __VLS_202 = __VLS_201.apply(void 0, __spreadArray([{ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }], __VLS_functionalComponentArgsRest(__VLS_201), false));
    ({}({ prop: ("diceNumArr"), label: ("骰子拟合图"), minWidth: ("30%"), }));
    var __VLS_205 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_200, __VLS_202));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_205.slots).default;
        var scope = __VLS_getSlotParams(__VLS_thisSlot)[0];
        for (var _h = 0, _j = __VLS_getVForSourceType((scope.row.diceNumArr)); _h < _j.length; _h++) {
            var _k = _j[_h], item = _k[0], index = _k[1];
            __VLS_elementAsFunction(__VLS_intrinsicElements.img)(__assign({ src: ((__VLS_ctx.getDiceImgByIndex(item))), key: ((index)), alt: (("index + ' '")) }, { class: ("diceImg") }));
            // @ts-ignore
            [getDiceImgByIndex,];
        }
    }
    // @ts-ignore
    var __VLS_206 = {}
        .ElTableColumn;
    ({}.ElTableColumn);
    __VLS_components.ElTableColumn;
    __VLS_components.elTableColumn;
    // @ts-ignore
    [ElTableColumn,];
    // @ts-ignore
    var __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }));
    var __VLS_208 = __VLS_207.apply(void 0, __spreadArray([{ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }], __VLS_functionalComponentArgsRest(__VLS_207), false));
    ({}({ prop: ("description"), label: ("描述"), showOverflowTooltip: (true), minWidth: ("35%"), }));
    var __VLS_211 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_206, __VLS_208));
    __VLS_nonNullable(__VLS_187.slots).default;
    __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: ("intro") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.template, __VLS_intrinsicElements.template)({});
    {
        var __VLS_thisSlot = __VLS_nonNullable(__VLS_181.slots).footer;
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("title") }));
        // @ts-ignore
        var __VLS_212_1 = {}
            .ElButton;
        ({}.ElButton);
        ({}.ElButton);
        __VLS_components.ElButton;
        __VLS_components.elButton;
        __VLS_components.ElButton;
        __VLS_components.elButton;
        // @ts-ignore
        [ElButton, ElButton,];
        // @ts-ignore
        var __VLS_213 = __VLS_asFunctionalComponent(__VLS_212_1, new __VLS_212_1(__assign({ 'onClick': {} }, { class: ("btn") })));
        var __VLS_214_1 = __VLS_213.apply(void 0, __spreadArray([__assign({ 'onClick': {} }, { class: ("btn") })], __VLS_functionalComponentArgsRest(__VLS_213), false));
        ({}(__assign({ 'onClick': {} }, { class: ("btn") })));
        var __VLS_218 = void 0;
        var __VLS_219 = {
            onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.restartVisible = true;
                // @ts-ignore
                [restartVisible,];
            }
        };
        var __VLS_217 = __VLS_nonNullable(__VLS_pickFunctionalComponentCtx(__VLS_212_1, __VLS_214_1));
        var __VLS_215 = void 0;
        var __VLS_216 = void 0;
        __VLS_nonNullable(__VLS_217.slots).default;
    }
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
        __VLS_styleScopedClasses['homePage'];
        __VLS_styleScopedClasses['loadingPage'];
        __VLS_styleScopedClasses['welcomeLayer'];
        __VLS_styleScopedClasses['ruleImg'];
        __VLS_styleScopedClasses['navBtnGroup'];
        __VLS_styleScopedClasses['navBtnText'];
        __VLS_styleScopedClasses['navBtnText'];
        __VLS_styleScopedClasses['navBtnGroup'];
        __VLS_styleScopedClasses['navBtnText'];
        __VLS_styleScopedClasses['navBtnText'];
        __VLS_styleScopedClasses['mobileSpecificSection'];
        __VLS_styleScopedClasses['titleImgSection'];
        __VLS_styleScopedClasses['titleImg'];
        __VLS_styleScopedClasses['bodySection'];
        __VLS_styleScopedClasses['singleRankSection'];
        __VLS_styleScopedClasses['playerName'];
        __VLS_styleScopedClasses['prizeSection'];
        __VLS_styleScopedClasses['diceDisplaySection'];
        __VLS_styleScopedClasses['diceImgSection'];
        __VLS_styleScopedClasses['rollButtonSection'];
        __VLS_styleScopedClasses['rankLayer'];
        __VLS_styleScopedClasses['rankSection'];
        __VLS_styleScopedClasses['restartLayer'];
        __VLS_styleScopedClasses['restartSection'];
        __VLS_styleScopedClasses['restartFooter'];
        __VLS_styleScopedClasses['rulesLayer'];
        __VLS_styleScopedClasses['ruleSection'];
        __VLS_styleScopedClasses['ruleIntro'];
        __VLS_styleScopedClasses['ruleImg'];
        __VLS_styleScopedClasses['diceImg'];
        __VLS_styleScopedClasses['ruleIntro'];
        __VLS_styleScopedClasses['aboutLayer'];
        __VLS_styleScopedClasses['aboutSection'];
        __VLS_styleScopedClasses['aboutSection_Title'];
        __VLS_styleScopedClasses['aboutSection_Name'];
        __VLS_styleScopedClasses['item'];
        __VLS_styleScopedClasses['item'];
        __VLS_styleScopedClasses['prizeResultLayer'];
        __VLS_styleScopedClasses['prizeResultSection'];
        __VLS_styleScopedClasses['welcomePage'];
        __VLS_styleScopedClasses['welcomeLayer'];
        __VLS_styleScopedClasses['welcomeSection'];
        __VLS_styleScopedClasses['rootSection'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['info'];
        __VLS_styleScopedClasses['intro'];
        __VLS_styleScopedClasses['ruleSection'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['info'];
        __VLS_styleScopedClasses['mb'];
        __VLS_styleScopedClasses['intro'];
        __VLS_styleScopedClasses['ruleImg'];
        __VLS_styleScopedClasses['diceImg'];
        __VLS_styleScopedClasses['intro'];
        __VLS_styleScopedClasses['title'];
        __VLS_styleScopedClasses['btn'];
    }
    var __VLS_slots;
    return __VLS_slots;
    var __VLS_componentsOption = {};
    var __VLS_name = undefined;
    var __VLS_internalComponent;
}
