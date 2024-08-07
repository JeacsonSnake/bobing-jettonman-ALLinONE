type GameRule = {
  [key: string]: RegExp;
};

type ReturnObj = {
    [key: string]: string;
};

const gameRule:GameRule = {
    ZhuangYuanChaJinHua: new RegExp('114444'), // 状元插金花(状元)
    LiuBoHong: new RegExp('444444'), // 状元六博红(状元)
    BianDiJing: new RegExp('111111'), // 状元遍地锦(状元)
    LiuBoHei: new RegExp('^(1{6})|(2{6})|(3{6})|(5{6})|(6{6})$'), // 状元六博黑(状元)
    WuBoHong: new RegExp('^44444[5-6]{1}$|^[1-3]{1}44444$'), // 状元五红王(状元)
    WuBoHei: new RegExp(
        '(?=^d*((1{5})|(2{5})|(3{5})|(5{5})|(6{5}))d*$)(?=[^4]{6})'
    ), // 状元五子登科(状元)
    SiDianHong: new RegExp(
        '^4444[5-6]{2}$|^[1-3]{1}4444[5-6]{1}$|^[1-3]{2}4444$'
    ), // 状元四点红(状元)
    DuiTang: new RegExp('123456'), // 对堂(榜眼)
    SanHong: new RegExp(
        '^444[5-6]{3}$|^[1-3]{1}444[5-6]{2}$|^[1-3]{2}444[5-6]{1}|^[1-3]{3}444$'
    ), // 三红(探花)
    SiJin: new RegExp('^[1]{4}|[2]{4}|[3]{4}|[5]{4}|[6]{4}$'), // 四进(进士)
    ErJu: new RegExp('^([1-3]{0,4}44){1}[5-6]{0,4}$'), // 二举(举人)
    YiXiu: new RegExp('^([1-3]{0,5}4){1}[5-6]{0,5}$'), // 一秀(秀才)
    NULL: new RegExp(''), // 博空
}
const zhuangyuan = [
    'ZhuangYuanChaJinHua',
    'LiuBoHong',
    'BianDiJing',
    'LiuBoHei',
    'WuBoHong',
    'WuBoHei',
    'SiDianHong',
]

function generateRandomString():string {
    let randomString = ''
    for (let i = 0; i < 6; i++) {
        const randomNumber = Math.floor(Math.random() * 6) + 1
        randomString += randomNumber.toString()
    }
    return randomString
}

function getRandomResult():ReturnObj {

    let randomString = generateRandomString()
    let returnObj:ReturnObj= {
        resultName: '',
        resultNum: randomString,
    }
    let orderdRandomString = Array.from(randomString)
        .map(Number)
        .sort((a, b) => {
            return a - b
        })
        .join('')
    for (let key in gameRule) {
        if (gameRule[key].test(orderdRandomString)) {
            //   console.log('key', key)
            returnObj.resultName = key
            break
        }
    }

    return returnObj
}

export const getResult = (isONFirst = false) => {
    let generatedDiceResult = getRandomResult()
    // 如果是第一轮则强制使得结果不出现状元
    while (zhuangyuan.includes(generatedDiceResult.resultName) && isONFirst) {
        generatedDiceResult = getRandomResult()
    }

    return generatedDiceResult
}