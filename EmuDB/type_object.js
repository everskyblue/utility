export default {
  force: Object,
  equalTypeData(val) {
    return typeof val === this.tof;
  },
  get tof() {
    return "object";
  },
};
