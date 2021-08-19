export default {
  force: Date,
  equalTypeData(val) {
    return this.ref.format(val) ? true : false;
  },
  get tof() {
    return "date";
  }
};
