export default {
  force: Boolean,
  equalTypeData(val) {
    return typeof val === this.tof;
  },
  get tof() {
    return "boolean";
  }
};
