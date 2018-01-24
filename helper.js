const config = {
  logImportance: 0,
  waiting: 0,
  disableWaiting: false
}

const colors = {
  reset: '\033[0m',

  //text color

  black: '\033[30m',
  red: '\033[31m',
  green: '\033[32m',
  yellow: '\033[33m',
  blue: '\033[34m',
  magenta: '\033[35m',
  cyan: '\033[36m',
  white: '\033[37m',

  //background color

  blackBg: '\033[40m',
  redBg: '\033[41m',
  greenBg: '\033[42m',
  yellowBg: '\033[43m',
  blueBg: '\033[44m',
  magentaBg: '\033[45m',
  cyanBg: '\033[46m',
  whiteBg: '\033[47m'
}

module.exports = class Helper {
  static smartCopy(o) {
    if (Array.isArray(o)) {
      return o.slice();
    } else {
      return [o];
    }
  }

  static findArrayByFirstElem(arr, el) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] == el) return arr[i];
    }

    return null;
  }

  static wait(ms) {
    if (config.disableWaiting) {
      return
    }

    if (ms === undefined) {
      ms = config.waiting;
    }

    let start = new Date().getTime(),
        end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  }

  static timeSpentFormatted(timeStart, l, color) {
    let time = (Date.now() - timeStart)/1000 + "s:",
        timeColored = Helper.c(time, color);

    return timeColored + (new Array(l - time.length).join(" "));
  }

  static smartLog() {
    if (arguments[0] <= config.logImportance) {
      console.log.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }

  static c(str, color) {
    return colors[color] + str + colors.reset;
  }

  static intersect(arr1, arr2) {
    let result = [];

    for (let el of arr1) {
      if (arr2.indexOf(el) > -1) {
        result.push(el);
      }
    }

    return result;
  }

  static inArray2(arr1, arr2) {
    for (let el of arr1) {
      if (el[0] == arr2[0] && el[1] == arr2[1]) {
        return true;
      }
    }

    return false;
  }
}
