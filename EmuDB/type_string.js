kind_string.force = String;
kind_string.equalTypeData = val => typeof val === kind_string.tof;
kind_string.tof ='string';

export default function kind_string(maxValue) {
    kind_string.max = maxValue;
    return kind_string;
}