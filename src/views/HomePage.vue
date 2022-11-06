<template>
  <div class="homePage">
    <nav>
      <div class="navBtnGroup">
        <el-button type="text" icon="el-icon-s-data">Rank</el-button>
        <el-button type="text" icon="el-icon-refresh">REstart</el-button>
      </div>
      <div class="navBtnGroup">
        <el-button
          type="text"
          icon="el-icon-tickets"
          @click="rulesVisible = true"
        >
          Rule
        </el-button>
        <el-button
          type="text"
          icon="el-icon-ice-cream-round"
          @click="aboutVisible = true"
        >
          About
        </el-button>
      </div>
    </nav>
    <router-link to="/about">About</router-link>

    <el-dialog
      title="How to Play?"
      :visible.sync="rulesVisible"
      class="rulesLayer"
      center
    >
      <div class="ruleSection">
        <span class="ruleIntro">
          For example, in a multiplayer game, after selecting the number of
          players and deciding the order of player, click the button to roll the
          dice. If player match the points in the table below, the player will
          win a prize.
        </span>
        <img src="../../public/image/rule.png" alt="" class="ruleImg" />
      </div>
    </el-dialog>

    <el-dialog
      title="About"
      :visible.sync="aboutVisible"
      class="aboutLayer"
      center
    >
      <div class="aboutSection">
        <span class="aboutSection_Title">Front-end Design: </span>
        <span class="aboutSection_Name">Jeacson_She</span>
        <i class="el-icon-info"></i>
      </div>
      <div class="aboutSection">
        <span class="aboutSection_Title">Back-end Design: </span>
        <span class="aboutSection_Name">Eric_Zhao</span>
        <i class="el-icon-info"></i>
      </div>
      <span slot="footer"
        >©Jeacson_She & Eric_Zhao @2022 all rights reserved.</span
      >
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aboutVisible: false,
      rulesVisible: false,
    };
  },
  methods: {},
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
    height: calc(var(--heightRate) * 56);
    background: rgba(204, 204, 204, 0);
    border-bottom: 1px solid rgb(0, 0, 0);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;

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

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }

  .aboutLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 960);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      background-color: #f2f2f2;
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
    }
  }

  .rulesLayer {
    ::v-deep .el-dialog {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 1300);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      background-color: #f2f2f2;
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
      height: calc(var(--heightRate) * 1090);
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
        height: calc(var(--heightRate) * 923);
      }
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
    }
  }
}
</style>