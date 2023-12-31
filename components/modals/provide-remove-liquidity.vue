<template>
  <v-dialog v-model="modalLiquidity" content-class="modal-connect divcol relative isolate">
    <aside class="space">
      <span class="h8_em">Deposit {{ pair.poolName }}</span>

      <v-btn style="background: hsl(0 0% 0% / .2)!important;" icon @click="modalLiquidity = false">
        <v-icon size="1.5em">mdi-close</v-icon>
      </v-btn>
    </aside>

    <v-form ref="form" class="flex-column center">
      <v-text-field
      v-model="token0Amount"
      required
        :rules="[rules.number, rules.required]"
        class="input"
        :label="`Amount ${ pair.token0.symbol } desired`"
      ></v-text-field>

      <v-text-field
      v-model="token1Amount"
      required
        :rules="[rules.number, rules.required]"
        class="input"
        :label="`Amount ${ pair.token1.symbol } desired`"
      ></v-text-field>

      <v-text-field
      v-model="token0AmountMin"
      required
        :rules="[rules.number, rules.required]"
        class="input"
        :label="`Amount ${ pair.token0.symbol } minimum`"
      ></v-text-field>

      <v-text-field
      v-model="token1AmountMin"
      required
        :rules="[rules.number, rules.required]"
        class="input"
        :label="`Amount ${ pair.token1.symbol } minimum`"
      ></v-text-field>

      <v-btn
        class="btn bold"
        :disabled="formValid"
        @click="submitForm"
      >
        Add liquidity
      </v-btn>
    </v-form>
  </v-dialog>
</template>

<script>
import routerV2ABI from '~/static/abis/routerv2.json'
import ERC20ABI from '~/static/abis/erc20.json'
const Web3 = require('web3')
const web3 = new Web3(window.ethereum);
const routerV2Address = "0x2f2f7197d19A13e8c72c1087dD29d555aBE76C5C"
const routerV2 = new web3.eth.Contract(routerV2ABI, routerV2Address);

export default {
  name: "ModalLiquidity",
  props: {
    pair: {
      type: Object,
      default () {
        return {
          address: "",
          poolName: "",
          token0: {
            name:"",
            symbol:"",
          },
          token1: {
            name:"",
            symbol:"",
          },
        }
      }
    }
  },
  data() {
    return {
      modalLiquidity: false,
      token0Amount: undefined,
      token1Amount: undefined,
      token0AmountMin: undefined,
      token1AmountMin: undefined,
      firstLoad: true,
      rules: {
        required: value => {
          if(!value) {
            this.$alert('info', 'Field is required')
          }
          return !!value || ''
        },
        number: value => {
          const regex = /^\d+(\.\d+)?$/
          if( !regex.test(value)) {
            this.$alert('info', 'Invalid numeric input')
          }
          if(value < 0) {
            this.$alert('info', 'Value must be positive')
          }
          return regex.test(value) || ''
        }
      }
    };
  },
  mounted() {
  },
  methods: {

    submitForm() {
     if (this.$refs.form.validate()){
      this.addLiquidity(
        this.pair.token0,
        this.pair.token1,
        this.token0Amount,
        this.token1Amount,
        this.token0AmountMin,
        this.token1AmountMin,
      )
     }
    },

    async approve(tokenAddres, amount) {
      const tokenInContract = new web3.eth.Contract(ERC20ABI, tokenAddres);
      await tokenInContract.methods.approve(routerV2Address, amount).send({ from: this.$metamask.userAccount })
    },

    async addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin) {
      await Promise.all([
        this.approve(tokenA.address, BigInt((amountADesired * 10 ** tokenA.decimals).toString()).replace(/[.,]/g, '')),
        this.approve(tokenB.address, BigInt((amountBDesired * 10 ** tokenB.decimals).toString()).replace(/[.,]/g, ''))
      ])
      const to = this.$metamask.userAccount
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins time
      const myMethod = routerV2.methods.addLiquidity(
        tokenA.address,
        tokenB.address,
        BigInt((amountADesired * 10 ** tokenA.decimals)).toString().replace(/[.,]/g, ''),
        BigInt((amountBDesired * 10 ** tokenB.decimals)).toString().replace(/[.,]/g, ''),
        BigInt((amountAMin * 10 ** tokenA.decimals)).toString().replace(/[.,]/g, ''),
        BigInt((amountBMin * 10 ** tokenB.decimals)).toString().replace(/[.,]/g, ''),
        to,
        deadline
      )
      const gasLimit = await myMethod.estimateGas({ from: this.$metamask.userAccount }) + 5000
      await myMethod.send({from: this.$metamask.userAccount, gasLimit})
    },
  }
};
</script>

<style lang="scss">
.modal-connect {
  @include card;
  --min-w: 330px;
  --w: max-content;
  --br: 30px;
  --bg: var(--card);
  --p: 30px;
  --tt: capitalize;
  gap: 20px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background-clip: content-box, border-box;
    background-image: linear-gradient(var(--bg),var(--bg)),
      linear-gradient(135deg, rgba($primary,.2), rgba($accent,.2));
    z-index: -1;
  }

  i {color: #000000 !important;}

  .input{
    background-color: var(--card);
    border-radius: 10px;
    border: 1px solid #000;
    max-width: 250px;
    padding-inline: 10px;
    padding-block: 10px;
    height: 55px;
    margin-bottom: 10px;

    ::placeholder{
      font-family: var(--font3);
      font-weight: 500;
      color: #767A89;
    }

    i{
      color: #767A89;
    }
  }

  .v-sheet.grid {
    @include media(min, 500px) {--gtc: 1fr 1fr}
    gap: 20px;
    .v-btn {
      --fs: 20px;
      width: 100%;
      min-height: 70px;
      border-radius: 10px;
      background-color: hsl(0 0% 0% / .2);
      transition: .2s $ease-return;
      &:hover {
        background-color: hsl(0 0% 0% / .4);
        transform: translateY(-5px) !important;
      }
      &__content {
        justify-content: flex-start;
        gap: 10px;
        img {
          --w: 40px;
          --of: cover;
        }
        span + span {
          --c: #0000000;
          font-weight:700!important;
        }
      }
    }
  }
}
</style>

