export const state = () => ({
  theme: "light",
  overlay: { opacity: 0.2, color: "black" },
  isLogged: localStorage.getItem("isLogged") !== true ? undefined:  true, // temporary
  dataUser: {
    banner: undefined,
    avatar: undefined,
    accountId: undefined,
    username: undefined,
    chainId: undefined,
  },
  swapReview: {
    tokenFrom: undefined,
    priceFrom: undefined,
    tokenTo: undefined,
    priceTo: undefined,
  }
});

export const mutations = {
  switchTheme(state, theme) {
    // theme
    state.theme = theme
    localStorage.setItem("theme", theme)
    document.documentElement.className = theme;
    // overlay
    if (theme === "light") { state.overlay.opacity = 0.2; state.overlay.color = "white" }
    else { state.overlay.opacity = 0.5; state.overlay.color = "black" }
  },
  setSwapReview(state, data) {
    state.swapReview = data
  },
  setData(state, data) {
    // if (window.$nuxt.$wallet.isSignedIn() && typeof data === 'string') {
    //   state.dataUser.avatar = require('~/assets/sources/avatars/avatar.png');
    //   state.dataUser.accountId = data;
    // };
    state.dataUser.accountId = data;

  },
  signIn(state, data) {
    try {
      // make login <-----------------------------------------
      if (/0+x/.test(data)) state.dataUser.accountId = data.cutString(7, 4);
      state.isLogged = true  // temporary
      // make login <-----------------------------------------
    // catch error
    } catch (err) {
      console.error(err);
      this.$alert("cancel", {desc: err.message})
    }
    // window.$nuxt.$wallet.requestSignIn(   <---- near version
    //   'contract.globaldv.testnet'
    // );
  },
  signOut(state) {
    // window.$nuxt.$wallet.signOut();
    // setTimeout(() => this.$router.go(0), 100);
    this.$router.push(this.basePath('/'));
    state.isLogged = false  // temporary
  },
};

export const actions = {
  modalConnect() {
    const layout = this.$router.app.$children.find(data=> {
      return data.$refs.connect
    });
    layout.$refs.connect.modalConnect = true
  },
  // getData({commit}) {
  // },
};

export const getters = {
  pagination: () => ({items, currentPage, itemsPerPage, search, filterA, filterB}) => {
    let filters = [...items]

    // search
    if (search) filters = filters.filter(data => data.name.includes(search))

    return filters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  },
  filters: () => ({items, search, filterA, filterB}) => {
    let filters = [...items]

    // search
    if (search) filters = filters.filter(data => data.name.includes(search))

    return filters
  }
};

export const modules = {
};
