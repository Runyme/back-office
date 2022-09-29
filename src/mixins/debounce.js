export default {
  data() {
    return {
      timer: null
    }
  },
  methods: {
    debounce(func, timeout) {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        func.apply();
      }, timeout)
    }
  }
}
