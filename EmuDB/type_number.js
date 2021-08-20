export default {
    force: Number,
    equalTypeData(val) {
      return /[\d+]/.test(val);
    },
    get tof() {
      return "number";
    },
  };
  