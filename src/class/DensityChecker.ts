import stopWords from "@/constants/stopWord";

interface IDensityCheckerOptions {
  minKeywordLength: number;
  maxKeywordLength: number;
}

export default class DensityChecker {
  _str: string;
  _options: IDensityCheckerOptions;

  constructor(
    { str, options } = {
      str: "",
      options: {
        minKeywordLength: 2,
        maxKeywordLength: 50,
      },
    }
  ) {
    this._str = str.toLowerCase();
    this._options = options;
  }

  /**
   * 접두사 접미사를 제거하여 단어만 남기기 위한 메서드
   *
   * @method _removeStopWords
   */
  _removeStopWords() {
    for (let i = stopWords.length - 1; i >= 0; i--) {
      const regex = new RegExp(
        "( |^)" +
          stopWords[i].replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") +
          "( |$)",
        "g"
      );

      this._str = this._str.replace(regex, "$1$2");
    }
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  _mergeOptions(obj1: any, obj2: any) {
    const obj3: Record<string, any> = {};
    for (const attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (const attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  calculateKeywordsDensity(sentences = "", keyword = "") {
    //convert html to text
    // this._htmlToText.call(this);
    this.setSentences(sentences);
    //remove all stop words
    this._removeStopWords.call(this);
    //split the text with space
    let words = this._str.split(" ");
    let density = [];

    //sort the array
    words = words.sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    //used for store the word count
    let currentWordCount = 1;
    for (let i = words.length - 1; i >= 0; i--) {
      if (
        words[i].length <= this._options.minKeywordLength ||
        words[i].length >= this._options.maxKeywordLength
      )
        continue;
      if (words[i] == words[i - 1]) {
        //a new duplicate keyword
        ++currentWordCount;
      } else {
        //add the keyword with density to the array
        density.push({
          word: words[i],
          count: currentWordCount,
        });
        //reset the keyword density counter
        currentWordCount = 1;
      }
    }
    //sort the array with density of keywords
    density = density.sort(function (a, b) {
      if (a.count > b.count) return -1;
      if (a.count < b.count) return 1;
      return 0;
    });

    return density;
  }

  setSentences(sentences: string) {
    this._str = sentences;
  }
}
