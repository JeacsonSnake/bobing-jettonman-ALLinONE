<template>
  <div class="homePage">
    <div class="loadingPage" v-if="loadingVisible">
      <el-dialog
        :visible.sync="loadingVisible"
        class="welcomeLayer"
        center
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <img src="../../public/image/title.png" alt="" class="ruleImg" />
      </el-dialog>
    </div>

    <nav>
      <div class="navBtnGroup">
        <el-button type="text" icon="el-icon-s-data" @click="getRan()">
          排行榜
        </el-button>
        <el-button type="text" icon="el-icon-refresh" @click="getRestart()">
          重开一局
        </el-button>
      </div>
      <div class="navBtnGroup">
        <el-button
          type="text"
          icon="el-icon-tickets"
          @click="rulesVisible = true"
        >
          博饼规则
        </el-button>
        <el-button
          type="text"
          icon="el-icon-ice-cream-round"
          @click="aboutVisible = true"
        >
          关于
        </el-button>
      </div>
    </nav>

    <div class="titleImgSection">
      <img src="../../public/image/title.png" alt="" class="titleImg" />
    </div>
    <div class="bodySection">
      <div class="singleRankSection">
        <div class="playerName">
          <span>{{
            singleRankData.playerName == "个人奖项"
              ? singleRankData.playerName
              : `玩家 ${singleRankData.playerName}`
          }}</span>
        </div>
        <el-table
          :data="singleRankData.prize"
          class="prizeSection"
          :height="`calc(var(--heightRate) * 280)`"
          empty-text="还未获奖"
          :show-header="false"
        >
          <el-table-column property="imgUrl" width="40">
            <template v-slot="scope">
              <img
                :src="require(`../assets/img/${scope.row.imgUrl}`)"
                alt=""
                width="40"
                height="40"
              />
            </template>
          </el-table-column>
          <el-table-column property="prizeGetNum" width="100">
          </el-table-column>
        </el-table>
      </div>
      <div class="diceDisplaySection">
        <div class="diceImgSection" v-for="(item, index) in diceNumArr">
          <img :src="require(`../assets/img/dice/DICE-${item}.svg`)" alt="" />
        </div>
      </div>
      <div class="rollButtonSection">
        <div>
          下一位玩家为:
          {{
            playerNow == playerAmount || playerNow == "0"
              ? `玩家 1`
              : `玩家 ${playerNow + 1}`
          }}
        </div>
        <el-button @click="getNextPlayerResults()">
          掷骰开博
          <br />
          下一位！
        </el-button>
      </div>
    </div>
    <footer>
      <span>© Jeacson_She 2023-present All rights Reserved.</span>
    </footer>

    <el-dialog
      title="Rank: "
      :visible.sync="rankVisible"
      class="rankLayer"
      center
    >
      <!-- <div class="rankSection"></div> -->
      <el-table
        :data="rankData"
        class="rankSection"
        :height="`calc(var(--heightRate) * 800)`"
        empty-text="No Data yet"
      >
        <el-table-column
          property="playerName"
          label="玩家名"
          fixed
          width="150"
        ></el-table-column>
        <el-table-column
          property="prize"
          label="获得奖项"
          :formatter="playerRankDataFormatter"
        ></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="定义玩家数量"
      :visible.sync="restartVisible"
      class="restartLayer"
      center
    >
      <div class="restartSection">
        <el-select
          v-model="playerNum"
          placeholder="请选择(最多8人)"
          :popper-append-to-body="false"
          size="small"
        >
          <el-option
            v-for="item in playerNumOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <el-button class="restartFooter" slot="footer" @click="start()"
        >选好了！</el-button
      >
    </el-dialog>

    <el-dialog
      title="博饼怎么玩？"
      :visible.sync="rulesVisible"
      class="rulesLayer"
      center
    >
      <div class="ruleSection">
        <span class="ruleIntro">
          例如，在多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。如果玩家符合下表中的点数，就能赢得奖品。
        </span>
        <img src="../../public/image/rule.png" alt="" class="ruleImg" />
      </div>
    </el-dialog>

    <el-dialog
      title="关于"
      :visible.sync="aboutVisible"
      class="aboutLayer"
      center
    >
      <div class="aboutSection">
        <span class="aboutSection_Title">页面设计&网页开发: </span>
        <span class="aboutSection_Name">Jeacson_She</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="Go to Github"
          placement="top"
        >
          <i class="el-icon-info" @click="jumpFrontEnd()"></i>
        </el-tooltip>
      </div>
      <span slot="footer">©Jeacson_She @2023-present all rights reserved.</span>
    </el-dialog>

    <el-dialog
      :visible.sync="prizeResultVisible"
      class="prizeResultLayer"
      center
      :modal="false"
    >
      <div class="prizeResultSection">
        <img :src="require(`../assets/img/${this.prizeNow.imgUrl}`)" alt="" />
      </div>
      <span slot="footer" :class="{ poorLuck: poorLuck }">
        {{ this.prizeNow.prizeName }} !
      </span>
    </el-dialog>

    <div class="welcomePage">
      <el-dialog
        title="欢迎来到博饼页面!"
        :visible.sync="welcomeVisible"
        class="welcomeLayer"
        center
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="welcomeSection">
          <div class="rootSection">
            <span class="title">啥是博饼？</span>
            <div class="info">
              <span class="intro">
                "博饼
                "是闽南地区在中秋节的一种传统习俗，它最早起源于福建厦门，后盛行于闽南地区和台湾省。游戏规则简单、公平，充满竞技悬念和生活情趣。一直深受分布在世界各地的广大群众喜爱。
              </span>
            </div>
          </div>
          <div class="ruleSection">
            <span class="title">怎么玩?</span>
            <div class="info mb">
              <span class="intro">
                很简单。例如，在多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。
                <br />
                如果玩家符合下表中的点数，就能赢得奖品。
              </span>
              <img src="../../public/image/rule.png" alt="" class="ruleImg" />
            </div>
          </div>
        </div>

        <div slot="footer">
          <div class="title">即刻开始?</div>
          <el-button class="btn" @click="restartVisible = true"
            >点我!</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      prizeResultVisible: false,
      aboutVisible: false,
      rulesVisible: false,
      rankVisible: false,
      restartVisible: false,
      welcomeVisible: false,
      loadingVisible: true,
      playerNum: "",
      playerNumOptions: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "5",
          label: "5",
        },
        {
          value: "6",
          label: "6",
        },
        {
          value: "7",
          label: "7",
        },
        {
          value: "8",
          label: "8",
        },
      ],
    };
  },
  computed: {
    rankData: function () {
      return this.$store.state.playerRank;
    },
    singleRankData: function () {
      return this.$store.state.singleRank;
    },
    diceNumArr: function () {
      return this.$store.state.resultDiceNumArr;
    },
    playerNow: function () {
      return this.$store.state.playerNow;
    },
    prizeNow: function () {
      return this.$store.state.prizeNow;
    },
    poorLuck: function () {
      return this.$store.state.poorLuck;
    },
    playerAmount: function () {
      return this.$store.state.playerAmount;
    },
  },
  methods: {
    jumpFrontEnd() {
      window.open("https://github.com/JeacsonSnake/bobing-jettonman", "_blank");
    },

    jumpBackEnd() {
      window.open("https://github.com/EricZhao666/Bobing", "_blank");
    },

    getRan() {
      this.rankVisible = true;
    },

    getRestart() {
      this.restartVisible = true;
    },

    start() {
      let p = this.playerNum;
      if (p == "") {
        this.$message.error("人数尚未确定！");
      } else {
        this.$confirm("你将开启新一轮游戏，确定吗？", "注意", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
        })
          .then(() => {
            setTimeout(() => {
              this.restartVisible = false;
              this.welcomeVisible = false;
            }, 100);
            const loading = this.startLoading("创建中...");
            setTimeout(() => {
              this.$store
                .dispatch("getNewRun", p)
                .then(() => {
                  setTimeout(() => {
                    this.endLoading(loading);
                    this.$message({
                      type: "success",
                      message: "已创建新一轮游戏!",
                    });
                  }, 400);
                })
                .catch((action) => {});
            }, 300);
          })
          .catch((err) => {
            // console.log(err);
            if (err == "cancel") {
              this.$message({
                type: "info",
                message: "已取消开启新一轮游戏",
              });
            }
          });
      }
    },

    getNextPlayerResults() {
      if (this.playerNow == -1) {
        this.restartVisible = true;
        this.$message({
          type: "error",
          message: "The number of players is not set yet!",
        });
      } else {
        const loading = this.startLoading("掷骰入碗...");
        setTimeout(() => {
          this.$store
            .dispatch("getNextResult")
            .then(() => {
              setTimeout(() => {
                this.endLoading(loading);
              }, 400);
            })
            .then(() => {
              setTimeout(() => {
                this.prizeResultVisible = true;
              }, 700);
            });
        }, 300);
      }
    },

    startLoading(loadingText) {
      const loading = this.$elLoading.service({
        lock: true,
        target: ".homePage",
        text: loadingText,
        background: "rgba(200, 200, 200, 1)",
      });
      return loading;
    },

    endLoading(loading) {
      loading.close();
    },

    playerRankDataFormatter(row, column, cellValue, index) {
      // console.log(row);
      // console.log(column);
      // console.log("cellvalue", cellValue);
      // console.log(index);
      let formattedCellValue = "";
      cellValue.forEach((singlePrizeObj, index) => {
        let prizeRealName = "";
        this.$store.state.prizeName.forEach((SingleRealName, index) => {
          if (SingleRealName === singlePrizeObj.prizeName) {
            prizeRealName = this.$store.state.prizeRealName[index];
          }
        });
        formattedCellValue += prizeRealName;
        formattedCellValue += "*";
        formattedCellValue += singlePrizeObj.prizeGetNum;
        formattedCellValue += ", ";
      });
      return formattedCellValue.slice(0, -2);
    },
  },
  created() {
    // this.restartVisible = true;
    // this.loadingVisible = true;
  },
  mounted() {
    let localPlayersRank = JSON.parse(
      localStorage.getItem("Bobing_playersRank")
    );
    console.log(localPlayersRank);
    if (localPlayersRank) {
      const loading = this.startLoading("正在读取存档...");
      setTimeout(() => {
        this.$store.commit("changePlayerAmount", localPlayersRank.playerAmount);
        this.$store.commit("changePlayerNow", localPlayersRank.playerNow);
        this.$store.commit("setPlayerRank", localPlayersRank.playerRank);
        this.$store.commit(
          "setResultDiceNumArr",
          localPlayersRank.resultDiceNumArr
        );
        this.$store.dispatch("setNowPlayerRank");
        this.loadingVisible = false;
      }, 2000);
      setTimeout(() => {
        this.endLoading(loading);
      }, 2500);
    } else {
      const loading = this.startLoading("加载中...");
      setTimeout(() => {
        this.welcomeVisible = true;
        this.loadingVisible = false;
      }, 2000);
      setTimeout(() => {
        this.endLoading(loading);
      }, 2500);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";
.homePage {
  font-family: "HarmonyOS_Sans_SC_Medium", Avenir, Helvetica, Arial, sans-serif;
  --heightRate: calc(100vh / #{$base-height});
  --widthRate: calc(100vw / #{$base-width});
  width: inherit;
  height: 100vh;
  background-image: url(https://img.js.design/assets/img/61f2081bc03e983a077fd038.png#49767ac507f1808d28b1122464ebb4e1);
  background-color: rgba(242, 242, 242, 0.5);

  nav {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 77);
    background: rgba(204, 204, 204, 0);
    border-bottom: 1px solid rgb(0, 0, 0);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .navBtnGroup {
      height: calc(var(--heightRate) * 30);

      button {
        margin: 0 calc(var(--heightRate) * 25);
        padding: 0;
        color: #4d4747;
        font-family: "HarmonyOS_Sans_SC_Medium";
        font-size: calc(var(--heightRate) * 30);
      }
    }
  }

  .titleImgSection {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 374);
    display: flex;
    justify-content: center;
    align-items: center;

    .titleImg {
      width: calc(var(--widthRate) * 1120);
      height: calc(var(--heightRate) * 330);
    }
  }

  .bodySection {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 456);
    display: flex;

    .singleRankSection {
      width: calc(var(--widthRate) * 322);
      margin-left: calc(var(--widthRate) * 56);
      background-color: rgba(204, 204, 204, 1);
      border: calc(var(--heightRate) * 2) solid rgba(77, 71, 71, 1);
      box-shadow: 9px 15px 44px rgba(0, 0, 0, 0.25);
      border-radius: calc(var(--heightRate) * 20);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;

      .playerName {
        font-family: "HarmonyOS_Sans_SC_Black";
        margin-top: calc(var(--heightRate) * 17);
        padding-bottom: calc(var(--heightRate) * 12);
        font-size: calc(var(--heightRate) * 60);
        width: calc(var(--widthRate) * 242);
        height: calc(var(--heightRate) * 90);
        // border-bottom: calc(var(--heightRate) * 3) solid rgba(166, 166, 166, 1);
      }

      .prizeSection {
        display: flex;
        border-radius: calc(var(--heightRate) * 40) calc(var(--heightRate) * 40)
          0 0;
        background-color: #dfdfdf;

        ::v-deep .el-table__body-wrapper {
          &::-webkit-scrollbar {
            width: calc(var(--heightRate) * 8); /*滚动条宽度*/
          }

          &::-webkit-scrollbar-track {
            border-radius: calc(
              var(--heightRate) * 1
            ); /*滚动条的背景区域的圆角*/
            background-color: #e5e5e5; /*滚动条的背景颜色*/
          }

          &::-webkit-scrollbar-corner {
            background-color: #f0f0f0;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 4px; /*滚动条的圆角*/
            background-color: #c5c5c5; /*滚动条的背景颜色*/
          }

          .el-table__body {
            width: inherit !important;
            display: flex;
            justify-content: center;
            colgroup {
              display: none;
            }

            tbody tr {
              background-color: #dfdfdf;
              .el-table__cell {
                border-bottom: 1px solid rgb(191, 195, 202);
              }
              td {
                &:first-child .cell {
                  width: calc(var(--widthRate) * 185);
                  display: flex;
                  justify-content: center;
                }

                &:last-child .cell {
                  width: calc(var(--widthRate) * 132);
                  display: flex;
                  justify-content: center;
                  font-size: calc(var(--heightRate) * 40);
                }
              }
            }
          }

          .el-table__empty-block {
            width: 100% !important;
          }
        }
      }
    }

    .diceDisplaySection {
      width: calc(var(--widthRate) * 1000);
      margin-left: calc(var(--widthRate) * 82);
      background-color: rgba(204, 204, 204, 1);
      border: calc(var(--heightRate) * 2) solid rgba(71, 72, 76, 1);
      box-shadow: 8px 10px 32px rgba(0, 0, 0, 0.25);
      border-radius: calc(var(--heightRate) * 20);
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      div:nth-child(-n + 3) {
        margin-top: calc(var(--heightRate) * 20);
      }

      div:nth-child(1),
      div:nth-child(4) {
        margin-left: calc(var(--widthRate) * 62);
      }

      div:nth-child(2),
      div:nth-child(3),
      div:nth-child(5),
      div:nth-child(6) {
        margin-left: calc(var(--widthRate) * 169);
      }

      .diceImgSection {
        width: calc(var(--heightRate) * 200);
        height: calc(var(--heightRate) * 200);
        display: flex;
      }
    }

    .rollButtonSection {
      width: calc(var(--widthRate) * 300);
      margin-left: calc(var(--widthRate) * 82);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      ::v-deep .el-button {
        width: inherit;
        padding: 0;
        height: calc(var(--heightRate) * 260);
        border-radius: calc(var(--heightRate) * 20);
        background: rgba(222, 87, 87, 1);
        border: 1px solid rgba(71, 72, 76, 1);
        word-wrap: break-word;
        word-break: normal;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin: 0;
          padding: 0;
          word-break: normal;
          justify-content: center;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          width: calc(var(--widthRate) * 270);
          height: calc(var(--heightRate) * 180);
          font-size: calc(var(--heightRate) * 64);
          color: rgba(242, 242, 242, 1);
          line-height: calc(var(--heightRate) * 100);
        }
      }
    }
  }

  footer {
    margin-top: calc(var(--heightRate) * 141);
    background-color: #ccccccb0;

    span {
      font-size: calc(var(--heightRate) * 14);
      font-family: "HarmonyOS_Sans_SC_Medium";
    }
  }

  .aboutLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 960);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    ::v-deep .el-dialog__header {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);
      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
      }
    }

    ::v-deep .el-dialog__body {
      padding: 0;
      padding-top: calc(var(--heightRate) * 193);
    }

    ::v-deep .el-dialog__footer {
      padding: 0;
      padding-top: calc(var(--heightRate) * 140);
      font-size: calc(var(--heightRate) * 14);
    }

    .aboutSection {
      font-family: "HarmonyOS_Sans_SC_Black";
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: calc(var(--heightRate) * 80);
      font-size: calc(var(--heightRate) * 48);

      .aboutSection_Title {
        padding-right: calc(var(--heightRate) * 80);
      }

      .aboutSection_Name {
        color: #fafafa;
        -webkit-text-stroke: calc(var(--heightRate) * 2) rgba(117, 117, 117, 1);
        text-shadow: calc(var(--heightRate) * 3) calc(var(--heightRate) * 2)
          calc(var(--heightRate) * 9) rgba(0, 0, 0, 0.25);
        padding-right: calc(var(--heightRate) * 40);
      }

      .item {
        cursor: pointer;
      }
    }
  }

  .rulesLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 1430);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    ::v-deep .el-dialog__header {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Bold";
        font-size: calc(var(--heightRate) * 60);
        color: #757575;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 20);
    }

    .ruleSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 1110);
      height: calc(var(--heightRate) * 1210);
      border-radius: calc(var(--heightRate) * 20);
      border: 2px solid rgba(77, 71, 71, 1);
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;

      .ruleIntro {
        padding: calc(var(--heightRate) * 10) 0;
        word-wrap: break-word;
        word-break: normal;
      }

      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: calc(var(--heightRate) * 1040);
      }
    }

    ::v-deep .el-dialog__footer {
      padding: 0;
      padding-top: calc(var(--heightRate) * 140);
      font-size: calc(var(--heightRate) * 14);
    }
  }

  .rankLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 960);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
    }

    ::v-deep .el-dialog__header {
      display: flex;
      padding: 0;
      padding-top: calc(var(--heightRate) * 32);
      padding-left: calc(var(--heightRate) * 32);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
        color: #47484c;
      }
    }

    ::v-deep .el-dialog__body {
      padding: calc(var(--heightRate) * 30);
      padding-top: calc(var(--heightRate) * 40);
      margin: 0;
      display: flex;
      justify-content: center;

      .el-table--fit {
        border-radius: calc(var(--heightRate) * 20);
      }

      .el-table th.el-table__cell {
        background-color: #dedede;
      }
    }
  }

  .restartLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 420);
      height: calc(var(--heightRate) * 550);
      margin: 0;
      margin-top: calc(var(--heightRate) * 265) !important;
      margin-bottom: calc(var(--heightRate) * 265) !important;
      margin-left: calc(var(--widthRate) * 750);
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
    }

    ::v-deep .el-dialog__header {
      display: flex;
      padding: 0;
      padding-top: calc(var(--heightRate) * 60);
      justify-content: center;

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 60);
        line-height: calc(var(--heightRate) * 60);
        color: #47484c;
        width: calc(var(--widthRate) * 245);
        height: calc(var(--heightRate) * 215);
        word-break: normal;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 0;
      margin: 0;
      //   width: calc(var(--widthRate) * 224);
      //   height: calc(var(--heightRate) * 40);
      font-family: "HarmonyOS_Sans_SC_Midium";

      display: flex;
      justify-content: center;

      .el-input__inner {
        // width: calc(var(--widthRate) * 224);
        // height: calc(var(--heightRate) * 40);
        font-size: calc(var(--heightRate) * 14);
        line-height: calc(var(--heightRate) * 14);
        padding: 0;
        padding-right: calc(var(--widthRate) * 14);
        padding-left: calc(var(--widthRate) * 14);
      }

      .el-select .el-input__inner:focus,
      .el-range-editor.is-active,
      .el-range-editor.is-active:hover,
      .el-select .el-input.is-focus .el-input__inner {
        border-color: #de5757;
      }

      .el-select-dropdown__item.selected {
        color: #de5757;
      }

      .el-select-dropdown__list {
        max-height: calc(var(--heightRate) * 247);
      }
    }

    ::v-deep .el-dialog__footer {
      margin: 0;
      padding: 0;
      padding-top: calc(var(--heightRate) * 70);

      .el-button:focus,
      .el-button:hover {
        color: #f2f2f2;
        border-color: #4d4747;
        background-color: #de5757;
      }
    }
  }

  .prizeResultLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 420);
      height: calc(var(--heightRate) * 550);
      margin: 0;
      margin-top: calc(var(--heightRate) * 265) !important;
      margin-bottom: calc(var(--heightRate) * 265) !important;
      margin-left: calc(var(--widthRate) * 750);
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    ::v-deep .el-dialog__header {
      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }
    }

    ::v-deep .el-dialog__body,
    .prizeResultSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 250);
      height: calc(var(--heightRate) * 250);
      display: flex;
      justify-content: center;
    }

    ::v-deep .el-dialog__footer {
      margin: 0;
      padding: 0;
      padding-top: calc(var(--heightRate) * 50);
      font-family: "HarmonyOS_Sans_SC_Black";
      font-size: calc(var(--heightRate) * 70);
      color: #de5757;
      .poorLuck {
        color: #757575;
      }
    }
  }

  .welcomePage {
    ::v-deep .el-dialog__wrapper {
      background-image: url(https://img.js.design/assets/img/61f2081bc03e983a077fd038.png#49767ac507f1808d28b1122464ebb4e1);
      background-color: rgb(228, 228, 228);
    }

    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 2357);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    ::v-deep .el-dialog__header {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
        color: #757575;
      }
    }

    ::v-deep .el-dialog__body {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 66);
    }

    .welcomeSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 1110);
      height: calc(var(--heightRate) * 1550);

      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;

      .rootSection,
      .ruleSection {
        width: 100%;
        border-radius: calc(var(--heightRate) * 20);
        border: 2px solid rgba(77, 71, 71, 1);
        display: flex;
        flex-direction: column;
        align-content: center;

        .title {
          font-family: "HarmonyOS_Sans_SC_Black";
          font-size: calc(var(--heightRate) * 60);
          color: #757575;
          padding-left: calc(var(--widthRate) * 16);
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .intro {
          width: calc(var(--widthRate) * 1070);
          padding: calc(var(--heightRate) * 10) 0;
          word-wrap: break-word;
          word-break: normal;
        }
      }

      .ruleSection {
        margin-top: calc(var(--heightRate) * 52);
        .mb {
          margin-bottom: calc(var(--heightRate) * 20);
        }
      }

      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: calc(var(--heightRate) * 1040);
      }
    }

    ::v-deep .el-dialog__footer {
      padding: 0;
      padding-top: calc(var(--heightRate) * 25);
      font-size: calc(var(--heightRate) * 14);

      .title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 100);
        color: #757575;
        padding-left: calc(var(--widthRate) * 16);
        padding-bottom: calc(var(--heightRate) * 100);
      }

      .btn {
        width: calc(var(--widthRate) * 555);
        height: calc(var(--heightRate) * 120);
        padding: 0;
        color: #f2f2f2;
        border-color: #4d4747;
        background-color: #de5757;
        font-family: "HarmonyOS_Sans_SC_Bold";
        font-size: calc(var(--heightRate) * 80);
        line-height: calc(var(--heightRate) * 80);
        border: calc(var(--heightRate) * 4) solid rgba(71, 72, 76, 1);
      }

      .el-button:focus,
      .el-button:hover {
        color: #fffefe;
        border-color: #232222;
        background-color: #ad3e3e;
      }
    }
  }

  .loadingPage {
    ::v-deep .el-dialog__wrapper {
      background-image: url(https://img.js.design/assets/img/61f2081bc03e983a077fd038.png#49767ac507f1808d28b1122464ebb4e1);
      background-color: rgb(228, 228, 228);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: inherit;
      margin-top: calc(var(--heightRate) * 30) !important;
      margin-bottom: calc(var(--heightRate) * 30) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }
    ::v-deep .el-dialog__header {
      padding: 0;
    }
    .ruleImg {
      width: 100%;
      height: 100%;
    }
  }

  ::v-deep .el-loading-spinner {
    width: calc(var(--widthRate) * 420);
    height: calc(var(--heightRate) * 550);
    top: calc(50% - var(--widthRate) * 210);
    left: calc(50% - var(--heightRate) * 225);
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: calc(var(--heightRate) * 2) solid #757575;
    border-radius: calc(var(--heightRate) * 20);
    box-shadow: calc(var(--heightRate) * 6) calc(var(--heightRate) * 30)
      calc(var(--heightRate) * 52) 0 #383737d2;

    .circular {
      width: calc(var(--heightRate) * 180);
      height: calc(var(--heightRate) * 180);
      margin-bottom: calc(var(--heightRate) * 100);
      .path {
        stroke: #de5757;
      }
    }

    .el-loading-text {
      font-family: "HarmonyOS_Sans_SC_Black";
      font-size: calc(var(--heightRate) * 60);
      color: #de5757;
    }
  }
}
</style>