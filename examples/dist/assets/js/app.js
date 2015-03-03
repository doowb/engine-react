(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var merge = require('merge-deep');
var Comments = require('./Comments.jsx');
var UserStatusBox = require('./UserStatusBox.jsx');
var data = {
  comments: require('../../data/comments.json')
};

var remote = merge({}, data);
remote.comments.forEach(function (comment) {
  comment.author += " remote";
});

var orig = merge({}, data);

React.render(
  React.createElement(Comments, {data: remote.comments, pollInterval: 2000})
  , document.getElementById('app1')
);

React.render(
  React.createElement(UserStatusBox, {data: orig.comments, pollInterval: 2500})
  , document.getElementById('app2')
);


},{"../../data/comments.json":2,"./Comments.jsx":3,"./UserStatusBox.jsx":4,"merge-deep":5}],2:[function(require,module,exports){
module.exports=[
  { "key": "Pete", "author": "Pete Hunt", "text": "This is one comment" },
  { "key": "Jordan", "author": "Jordan Walke", "text": "This is *another* comment" }
]

},{}],3:[function(require,module,exports){

var Remarkable = require('remarkable');
var md = new Remarkable();

// Render a comment using markdown.
var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = md.render(this.props.children.toString());
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

// Create a form that allows adding a new comment
var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), React.createElement("br", null), 
        React.createElement("textarea", {placeholder: "Say something...", ref: "text"}), React.createElement("br", null), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

// Render a list of comments
var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        React.createElement(Comment, {key: comment.key, author: comment.author}, 
          comment.text
        )
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

// The CommentBox handles listing comments and showing a form for new comments.
var CommentBox = React.createClass({displayName: "CommentBox",
  loadCommentsFromServer: function () {
    // TODO: get from server
    var data = this.state.data;
    this.setState({data: data});
  },
  handleCommentSubmit: function (comment) {
    var data = this.state.data;
    var newData = data.concat([comment]);
    this.setState({data: newData});
  },
  getInitialState: function () {
    return {data: this.props.data || []};
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});

// Wrapper around a comment box
var Comments = React.createClass({displayName: "Comments",
  render: function() {
    return (
      React.createElement("div", {className: "comments"}, 
        React.createElement(CommentBox, {data: this.props.data, pollInterval: this.props.pollInterval})
      )
    );
  }
});

module.exports = Comments;


},{"remarkable":14}],4:[function(require,module,exports){

// Render a user
var User = React.createClass({displayName: "User",
  render: function() {
    return (
      React.createElement("div", {className: "user"}, 
        React.createElement("h3", {className: "userName"}, 
          this.props.username
        )
      )
    );
  }
});

// Render a list of users
var UserList = React.createClass({displayName: "UserList",
  render: function() {
    var userNodes = this.props.data.map(function (user) {
      return (
        React.createElement(User, {key: user.key, username: user.author})
      );
    });
    return (
      React.createElement("div", {className: "userList"}, 
        userNodes
      )
    );
  }
});

// The UserStatusBox handles getting users and rendering them
var UserStatusBox = React.createClass({displayName: "UserStatusBox",
  loadUsersFromServer: function () {
    var data = this.state.data;
    this.setState({data: data});
  },
  getInitialState: function () {
    return {data: this.props.data || []};
  },
  componentDidMount: function () {
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "UserStatusBox"}, 
        React.createElement("h1", null, "Online Users"), 
        React.createElement(UserList, {data: this.state.data})
      )
    );
  }
});

module.exports = UserStatusBox;


},{}],5:[function(require,module,exports){
/*!
 * merge-deep <https://github.com/jonschlinkert/merge-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var cloneDeep = require('clone-deep');
var isObject = require('is-plain-object');

module.exports = function merge(orig, objects) {
  if (!orig || !objects) { return orig || {}; }

  var len = arguments.length - 1;
  var o = cloneDeep(orig);

  for (var i = 0; i < len; i++) {
    var obj = arguments[i + 1];

    for (var key in obj) {
      if (!hasOwn(obj, key)) {
        continue;
      }

      var val = obj[key];
      if (isObject(val) && isObject(o[key])) {
        o[key] = merge(o[key], val);
      } else {
        o[key] = cloneDeep(val);
      }
    }
  }
  return o;
};

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
},{"clone-deep":6,"is-plain-object":12}],6:[function(require,module,exports){
'use strict';

/**
 * Module dependenices
 */

var typeOf = require('kind-of');
var forOwn = require('for-own');
var isPlainObject = require('is-plain-object');
var mixin = require('mixin-object');


/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
  case 'object':
    return cloneObjectDeep(val, instanceClone);
  case 'array':
    return cloneArrayDeep(val, instanceClone);
  default:
    return clone(val);
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (isPlainObject(obj)) {
    var res = {};
    forOwn(obj, function (obj, key) {
      this[key] = cloneDeep(obj, instanceClone);
    }, res);
    return res;
  } else if (instanceClone) {
    return instanceClone(obj);
  } else {
    return obj;
  }
}

function cloneArrayDeep(arr, instanceClone) {
  var len = arr.length;
  var res = [];
  var i = -1;

  while (++i < len) {
    res[i] = cloneDeep(arr[i], instanceClone);
  }
  return res;
}

function clone(val) {
  switch (typeOf(val)) {
  case 'object':
    return cloneObject(val);
  case 'array':
    return cloneArray(val);
  case 'regexp':
    return cloneRegExp(val);
  case 'date':
    return cloneDate(val);
  default:
    return val;
  }
}

function cloneObject(obj) {
  if (isPlainObject(obj)) {
    return mixin({}, obj);
  } else {
    return obj;
  }
}

function cloneRegExp(re) {
  var flags = '';
  flags += re.multiline ? 'm' : '';
  flags += re.global ? 'g' : '';
  flags += re.ignorecase ? 'i' : '';
  return new RegExp(re.source, flags);
}

function cloneDate(date) {
  return new Date(+date);
}

function cloneArray(arr) {
  return arr.slice();
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
},{"for-own":7,"is-plain-object":9,"kind-of":10,"mixin-object":11}],7:[function(require,module,exports){
/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var forIn = require('for-in');

module.exports = function forOwn(o, fn, thisArg) {
  forIn(o, function (val, key) {
    if (hasOwn(o, key)) {
      return fn.call(thisArg, o[key], key, o);
    }
  });
};

function hasOwn(o, prop) {
  return {}.hasOwnProperty.call(o, prop);
}

},{"for-in":8}],8:[function(require,module,exports){
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function forIn(o, fn, thisArg) {
  for (var key in o) {
    if (fn.call(thisArg, o[key], key, o) === false) {
      break;
    }
  }
};
},{}],9:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function isPlainObject(o) {
  return !!o && typeof o === 'object' && o.constructor === Object;
};
},{}],10:[function(require,module,exports){
'use strict';

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function typeOf(val) {
  if (val === null) {
    return 'null';
  }

  if (val === undefined) {
    return 'undefined';
  }

  if (typeof val !== 'object') {
    return typeof val;
  }

  if (Array.isArray(val)) {
    return 'array';
  }

  return {}.toString.call(val)
    .slice(8, -1).toLowerCase();
};

},{}],11:[function(require,module,exports){
/*!
 * mixin-object <https://github.com/jonschlinkert/mixin-object>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var forOwn = require('for-own');

module.exports = function mixIn(o) {
  var args = [].slice.call(arguments);
  var len = args.length;

  if (o == null) {
    return {};
  }

  if (len === 0) {
    return o;
  }

  function copy(value, key) {
    this[key] = value;
  }

  for (var i = 0; i < len; i++) {
    var obj = args[i];
    if (obj != null) {
      forOwn(obj, copy, o);
    }
  }
  return o;
};
},{"for-own":7}],12:[function(require,module,exports){
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');

module.exports = function isPlainObject(o) {
  return isObject(o) && o.constructor === Object;
};

},{"isobject":13}],13:[function(require,module,exports){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

/**
 * is the value an object, and not an array?
 *
 * @param  {*} `value`
 * @return {Boolean}
 */

module.exports = function isObject(o) {
  return o != null && typeof o === 'object'
    && !Array.isArray(o);
};
},{}],14:[function(require,module,exports){
'use strict';


module.exports = require('./lib/');

},{"./lib/":28}],15:[function(require,module,exports){
// List of valid entities
//
// Generate with ./support/entities.js script
//
'use strict';

/*eslint quotes:0*/
module.exports = {
  "Aacute":"\u00C1",
  "aacute":"\u00E1",
  "Abreve":"\u0102",
  "abreve":"\u0103",
  "ac":"\u223E",
  "acd":"\u223F",
  "acE":"\u223E\u0333",
  "Acirc":"\u00C2",
  "acirc":"\u00E2",
  "acute":"\u00B4",
  "Acy":"\u0410",
  "acy":"\u0430",
  "AElig":"\u00C6",
  "aelig":"\u00E6",
  "af":"\u2061",
  "Afr":"\uD835\uDD04",
  "afr":"\uD835\uDD1E",
  "Agrave":"\u00C0",
  "agrave":"\u00E0",
  "alefsym":"\u2135",
  "aleph":"\u2135",
  "Alpha":"\u0391",
  "alpha":"\u03B1",
  "Amacr":"\u0100",
  "amacr":"\u0101",
  "amalg":"\u2A3F",
  "AMP":"\u0026",
  "amp":"\u0026",
  "And":"\u2A53",
  "and":"\u2227",
  "andand":"\u2A55",
  "andd":"\u2A5C",
  "andslope":"\u2A58",
  "andv":"\u2A5A",
  "ang":"\u2220",
  "ange":"\u29A4",
  "angle":"\u2220",
  "angmsd":"\u2221",
  "angmsdaa":"\u29A8",
  "angmsdab":"\u29A9",
  "angmsdac":"\u29AA",
  "angmsdad":"\u29AB",
  "angmsdae":"\u29AC",
  "angmsdaf":"\u29AD",
  "angmsdag":"\u29AE",
  "angmsdah":"\u29AF",
  "angrt":"\u221F",
  "angrtvb":"\u22BE",
  "angrtvbd":"\u299D",
  "angsph":"\u2222",
  "angst":"\u00C5",
  "angzarr":"\u237C",
  "Aogon":"\u0104",
  "aogon":"\u0105",
  "Aopf":"\uD835\uDD38",
  "aopf":"\uD835\uDD52",
  "ap":"\u2248",
  "apacir":"\u2A6F",
  "apE":"\u2A70",
  "ape":"\u224A",
  "apid":"\u224B",
  "apos":"\u0027",
  "ApplyFunction":"\u2061",
  "approx":"\u2248",
  "approxeq":"\u224A",
  "Aring":"\u00C5",
  "aring":"\u00E5",
  "Ascr":"\uD835\uDC9C",
  "ascr":"\uD835\uDCB6",
  "Assign":"\u2254",
  "ast":"\u002A",
  "asymp":"\u2248",
  "asympeq":"\u224D",
  "Atilde":"\u00C3",
  "atilde":"\u00E3",
  "Auml":"\u00C4",
  "auml":"\u00E4",
  "awconint":"\u2233",
  "awint":"\u2A11",
  "backcong":"\u224C",
  "backepsilon":"\u03F6",
  "backprime":"\u2035",
  "backsim":"\u223D",
  "backsimeq":"\u22CD",
  "Backslash":"\u2216",
  "Barv":"\u2AE7",
  "barvee":"\u22BD",
  "Barwed":"\u2306",
  "barwed":"\u2305",
  "barwedge":"\u2305",
  "bbrk":"\u23B5",
  "bbrktbrk":"\u23B6",
  "bcong":"\u224C",
  "Bcy":"\u0411",
  "bcy":"\u0431",
  "bdquo":"\u201E",
  "becaus":"\u2235",
  "Because":"\u2235",
  "because":"\u2235",
  "bemptyv":"\u29B0",
  "bepsi":"\u03F6",
  "bernou":"\u212C",
  "Bernoullis":"\u212C",
  "Beta":"\u0392",
  "beta":"\u03B2",
  "beth":"\u2136",
  "between":"\u226C",
  "Bfr":"\uD835\uDD05",
  "bfr":"\uD835\uDD1F",
  "bigcap":"\u22C2",
  "bigcirc":"\u25EF",
  "bigcup":"\u22C3",
  "bigodot":"\u2A00",
  "bigoplus":"\u2A01",
  "bigotimes":"\u2A02",
  "bigsqcup":"\u2A06",
  "bigstar":"\u2605",
  "bigtriangledown":"\u25BD",
  "bigtriangleup":"\u25B3",
  "biguplus":"\u2A04",
  "bigvee":"\u22C1",
  "bigwedge":"\u22C0",
  "bkarow":"\u290D",
  "blacklozenge":"\u29EB",
  "blacksquare":"\u25AA",
  "blacktriangle":"\u25B4",
  "blacktriangledown":"\u25BE",
  "blacktriangleleft":"\u25C2",
  "blacktriangleright":"\u25B8",
  "blank":"\u2423",
  "blk12":"\u2592",
  "blk14":"\u2591",
  "blk34":"\u2593",
  "block":"\u2588",
  "bne":"\u003D\u20E5",
  "bnequiv":"\u2261\u20E5",
  "bNot":"\u2AED",
  "bnot":"\u2310",
  "Bopf":"\uD835\uDD39",
  "bopf":"\uD835\uDD53",
  "bot":"\u22A5",
  "bottom":"\u22A5",
  "bowtie":"\u22C8",
  "boxbox":"\u29C9",
  "boxDL":"\u2557",
  "boxDl":"\u2556",
  "boxdL":"\u2555",
  "boxdl":"\u2510",
  "boxDR":"\u2554",
  "boxDr":"\u2553",
  "boxdR":"\u2552",
  "boxdr":"\u250C",
  "boxH":"\u2550",
  "boxh":"\u2500",
  "boxHD":"\u2566",
  "boxHd":"\u2564",
  "boxhD":"\u2565",
  "boxhd":"\u252C",
  "boxHU":"\u2569",
  "boxHu":"\u2567",
  "boxhU":"\u2568",
  "boxhu":"\u2534",
  "boxminus":"\u229F",
  "boxplus":"\u229E",
  "boxtimes":"\u22A0",
  "boxUL":"\u255D",
  "boxUl":"\u255C",
  "boxuL":"\u255B",
  "boxul":"\u2518",
  "boxUR":"\u255A",
  "boxUr":"\u2559",
  "boxuR":"\u2558",
  "boxur":"\u2514",
  "boxV":"\u2551",
  "boxv":"\u2502",
  "boxVH":"\u256C",
  "boxVh":"\u256B",
  "boxvH":"\u256A",
  "boxvh":"\u253C",
  "boxVL":"\u2563",
  "boxVl":"\u2562",
  "boxvL":"\u2561",
  "boxvl":"\u2524",
  "boxVR":"\u2560",
  "boxVr":"\u255F",
  "boxvR":"\u255E",
  "boxvr":"\u251C",
  "bprime":"\u2035",
  "Breve":"\u02D8",
  "breve":"\u02D8",
  "brvbar":"\u00A6",
  "Bscr":"\u212C",
  "bscr":"\uD835\uDCB7",
  "bsemi":"\u204F",
  "bsim":"\u223D",
  "bsime":"\u22CD",
  "bsol":"\u005C",
  "bsolb":"\u29C5",
  "bsolhsub":"\u27C8",
  "bull":"\u2022",
  "bullet":"\u2022",
  "bump":"\u224E",
  "bumpE":"\u2AAE",
  "bumpe":"\u224F",
  "Bumpeq":"\u224E",
  "bumpeq":"\u224F",
  "Cacute":"\u0106",
  "cacute":"\u0107",
  "Cap":"\u22D2",
  "cap":"\u2229",
  "capand":"\u2A44",
  "capbrcup":"\u2A49",
  "capcap":"\u2A4B",
  "capcup":"\u2A47",
  "capdot":"\u2A40",
  "CapitalDifferentialD":"\u2145",
  "caps":"\u2229\uFE00",
  "caret":"\u2041",
  "caron":"\u02C7",
  "Cayleys":"\u212D",
  "ccaps":"\u2A4D",
  "Ccaron":"\u010C",
  "ccaron":"\u010D",
  "Ccedil":"\u00C7",
  "ccedil":"\u00E7",
  "Ccirc":"\u0108",
  "ccirc":"\u0109",
  "Cconint":"\u2230",
  "ccups":"\u2A4C",
  "ccupssm":"\u2A50",
  "Cdot":"\u010A",
  "cdot":"\u010B",
  "cedil":"\u00B8",
  "Cedilla":"\u00B8",
  "cemptyv":"\u29B2",
  "cent":"\u00A2",
  "CenterDot":"\u00B7",
  "centerdot":"\u00B7",
  "Cfr":"\u212D",
  "cfr":"\uD835\uDD20",
  "CHcy":"\u0427",
  "chcy":"\u0447",
  "check":"\u2713",
  "checkmark":"\u2713",
  "Chi":"\u03A7",
  "chi":"\u03C7",
  "cir":"\u25CB",
  "circ":"\u02C6",
  "circeq":"\u2257",
  "circlearrowleft":"\u21BA",
  "circlearrowright":"\u21BB",
  "circledast":"\u229B",
  "circledcirc":"\u229A",
  "circleddash":"\u229D",
  "CircleDot":"\u2299",
  "circledR":"\u00AE",
  "circledS":"\u24C8",
  "CircleMinus":"\u2296",
  "CirclePlus":"\u2295",
  "CircleTimes":"\u2297",
  "cirE":"\u29C3",
  "cire":"\u2257",
  "cirfnint":"\u2A10",
  "cirmid":"\u2AEF",
  "cirscir":"\u29C2",
  "ClockwiseContourIntegral":"\u2232",
  "CloseCurlyDoubleQuote":"\u201D",
  "CloseCurlyQuote":"\u2019",
  "clubs":"\u2663",
  "clubsuit":"\u2663",
  "Colon":"\u2237",
  "colon":"\u003A",
  "Colone":"\u2A74",
  "colone":"\u2254",
  "coloneq":"\u2254",
  "comma":"\u002C",
  "commat":"\u0040",
  "comp":"\u2201",
  "compfn":"\u2218",
  "complement":"\u2201",
  "complexes":"\u2102",
  "cong":"\u2245",
  "congdot":"\u2A6D",
  "Congruent":"\u2261",
  "Conint":"\u222F",
  "conint":"\u222E",
  "ContourIntegral":"\u222E",
  "Copf":"\u2102",
  "copf":"\uD835\uDD54",
  "coprod":"\u2210",
  "Coproduct":"\u2210",
  "COPY":"\u00A9",
  "copy":"\u00A9",
  "copysr":"\u2117",
  "CounterClockwiseContourIntegral":"\u2233",
  "crarr":"\u21B5",
  "Cross":"\u2A2F",
  "cross":"\u2717",
  "Cscr":"\uD835\uDC9E",
  "cscr":"\uD835\uDCB8",
  "csub":"\u2ACF",
  "csube":"\u2AD1",
  "csup":"\u2AD0",
  "csupe":"\u2AD2",
  "ctdot":"\u22EF",
  "cudarrl":"\u2938",
  "cudarrr":"\u2935",
  "cuepr":"\u22DE",
  "cuesc":"\u22DF",
  "cularr":"\u21B6",
  "cularrp":"\u293D",
  "Cup":"\u22D3",
  "cup":"\u222A",
  "cupbrcap":"\u2A48",
  "CupCap":"\u224D",
  "cupcap":"\u2A46",
  "cupcup":"\u2A4A",
  "cupdot":"\u228D",
  "cupor":"\u2A45",
  "cups":"\u222A\uFE00",
  "curarr":"\u21B7",
  "curarrm":"\u293C",
  "curlyeqprec":"\u22DE",
  "curlyeqsucc":"\u22DF",
  "curlyvee":"\u22CE",
  "curlywedge":"\u22CF",
  "curren":"\u00A4",
  "curvearrowleft":"\u21B6",
  "curvearrowright":"\u21B7",
  "cuvee":"\u22CE",
  "cuwed":"\u22CF",
  "cwconint":"\u2232",
  "cwint":"\u2231",
  "cylcty":"\u232D",
  "Dagger":"\u2021",
  "dagger":"\u2020",
  "daleth":"\u2138",
  "Darr":"\u21A1",
  "dArr":"\u21D3",
  "darr":"\u2193",
  "dash":"\u2010",
  "Dashv":"\u2AE4",
  "dashv":"\u22A3",
  "dbkarow":"\u290F",
  "dblac":"\u02DD",
  "Dcaron":"\u010E",
  "dcaron":"\u010F",
  "Dcy":"\u0414",
  "dcy":"\u0434",
  "DD":"\u2145",
  "dd":"\u2146",
  "ddagger":"\u2021",
  "ddarr":"\u21CA",
  "DDotrahd":"\u2911",
  "ddotseq":"\u2A77",
  "deg":"\u00B0",
  "Del":"\u2207",
  "Delta":"\u0394",
  "delta":"\u03B4",
  "demptyv":"\u29B1",
  "dfisht":"\u297F",
  "Dfr":"\uD835\uDD07",
  "dfr":"\uD835\uDD21",
  "dHar":"\u2965",
  "dharl":"\u21C3",
  "dharr":"\u21C2",
  "DiacriticalAcute":"\u00B4",
  "DiacriticalDot":"\u02D9",
  "DiacriticalDoubleAcute":"\u02DD",
  "DiacriticalGrave":"\u0060",
  "DiacriticalTilde":"\u02DC",
  "diam":"\u22C4",
  "Diamond":"\u22C4",
  "diamond":"\u22C4",
  "diamondsuit":"\u2666",
  "diams":"\u2666",
  "die":"\u00A8",
  "DifferentialD":"\u2146",
  "digamma":"\u03DD",
  "disin":"\u22F2",
  "div":"\u00F7",
  "divide":"\u00F7",
  "divideontimes":"\u22C7",
  "divonx":"\u22C7",
  "DJcy":"\u0402",
  "djcy":"\u0452",
  "dlcorn":"\u231E",
  "dlcrop":"\u230D",
  "dollar":"\u0024",
  "Dopf":"\uD835\uDD3B",
  "dopf":"\uD835\uDD55",
  "Dot":"\u00A8",
  "dot":"\u02D9",
  "DotDot":"\u20DC",
  "doteq":"\u2250",
  "doteqdot":"\u2251",
  "DotEqual":"\u2250",
  "dotminus":"\u2238",
  "dotplus":"\u2214",
  "dotsquare":"\u22A1",
  "doublebarwedge":"\u2306",
  "DoubleContourIntegral":"\u222F",
  "DoubleDot":"\u00A8",
  "DoubleDownArrow":"\u21D3",
  "DoubleLeftArrow":"\u21D0",
  "DoubleLeftRightArrow":"\u21D4",
  "DoubleLeftTee":"\u2AE4",
  "DoubleLongLeftArrow":"\u27F8",
  "DoubleLongLeftRightArrow":"\u27FA",
  "DoubleLongRightArrow":"\u27F9",
  "DoubleRightArrow":"\u21D2",
  "DoubleRightTee":"\u22A8",
  "DoubleUpArrow":"\u21D1",
  "DoubleUpDownArrow":"\u21D5",
  "DoubleVerticalBar":"\u2225",
  "DownArrow":"\u2193",
  "Downarrow":"\u21D3",
  "downarrow":"\u2193",
  "DownArrowBar":"\u2913",
  "DownArrowUpArrow":"\u21F5",
  "DownBreve":"\u0311",
  "downdownarrows":"\u21CA",
  "downharpoonleft":"\u21C3",
  "downharpoonright":"\u21C2",
  "DownLeftRightVector":"\u2950",
  "DownLeftTeeVector":"\u295E",
  "DownLeftVector":"\u21BD",
  "DownLeftVectorBar":"\u2956",
  "DownRightTeeVector":"\u295F",
  "DownRightVector":"\u21C1",
  "DownRightVectorBar":"\u2957",
  "DownTee":"\u22A4",
  "DownTeeArrow":"\u21A7",
  "drbkarow":"\u2910",
  "drcorn":"\u231F",
  "drcrop":"\u230C",
  "Dscr":"\uD835\uDC9F",
  "dscr":"\uD835\uDCB9",
  "DScy":"\u0405",
  "dscy":"\u0455",
  "dsol":"\u29F6",
  "Dstrok":"\u0110",
  "dstrok":"\u0111",
  "dtdot":"\u22F1",
  "dtri":"\u25BF",
  "dtrif":"\u25BE",
  "duarr":"\u21F5",
  "duhar":"\u296F",
  "dwangle":"\u29A6",
  "DZcy":"\u040F",
  "dzcy":"\u045F",
  "dzigrarr":"\u27FF",
  "Eacute":"\u00C9",
  "eacute":"\u00E9",
  "easter":"\u2A6E",
  "Ecaron":"\u011A",
  "ecaron":"\u011B",
  "ecir":"\u2256",
  "Ecirc":"\u00CA",
  "ecirc":"\u00EA",
  "ecolon":"\u2255",
  "Ecy":"\u042D",
  "ecy":"\u044D",
  "eDDot":"\u2A77",
  "Edot":"\u0116",
  "eDot":"\u2251",
  "edot":"\u0117",
  "ee":"\u2147",
  "efDot":"\u2252",
  "Efr":"\uD835\uDD08",
  "efr":"\uD835\uDD22",
  "eg":"\u2A9A",
  "Egrave":"\u00C8",
  "egrave":"\u00E8",
  "egs":"\u2A96",
  "egsdot":"\u2A98",
  "el":"\u2A99",
  "Element":"\u2208",
  "elinters":"\u23E7",
  "ell":"\u2113",
  "els":"\u2A95",
  "elsdot":"\u2A97",
  "Emacr":"\u0112",
  "emacr":"\u0113",
  "empty":"\u2205",
  "emptyset":"\u2205",
  "EmptySmallSquare":"\u25FB",
  "emptyv":"\u2205",
  "EmptyVerySmallSquare":"\u25AB",
  "emsp":"\u2003",
  "emsp13":"\u2004",
  "emsp14":"\u2005",
  "ENG":"\u014A",
  "eng":"\u014B",
  "ensp":"\u2002",
  "Eogon":"\u0118",
  "eogon":"\u0119",
  "Eopf":"\uD835\uDD3C",
  "eopf":"\uD835\uDD56",
  "epar":"\u22D5",
  "eparsl":"\u29E3",
  "eplus":"\u2A71",
  "epsi":"\u03B5",
  "Epsilon":"\u0395",
  "epsilon":"\u03B5",
  "epsiv":"\u03F5",
  "eqcirc":"\u2256",
  "eqcolon":"\u2255",
  "eqsim":"\u2242",
  "eqslantgtr":"\u2A96",
  "eqslantless":"\u2A95",
  "Equal":"\u2A75",
  "equals":"\u003D",
  "EqualTilde":"\u2242",
  "equest":"\u225F",
  "Equilibrium":"\u21CC",
  "equiv":"\u2261",
  "equivDD":"\u2A78",
  "eqvparsl":"\u29E5",
  "erarr":"\u2971",
  "erDot":"\u2253",
  "Escr":"\u2130",
  "escr":"\u212F",
  "esdot":"\u2250",
  "Esim":"\u2A73",
  "esim":"\u2242",
  "Eta":"\u0397",
  "eta":"\u03B7",
  "ETH":"\u00D0",
  "eth":"\u00F0",
  "Euml":"\u00CB",
  "euml":"\u00EB",
  "euro":"\u20AC",
  "excl":"\u0021",
  "exist":"\u2203",
  "Exists":"\u2203",
  "expectation":"\u2130",
  "ExponentialE":"\u2147",
  "exponentiale":"\u2147",
  "fallingdotseq":"\u2252",
  "Fcy":"\u0424",
  "fcy":"\u0444",
  "female":"\u2640",
  "ffilig":"\uFB03",
  "fflig":"\uFB00",
  "ffllig":"\uFB04",
  "Ffr":"\uD835\uDD09",
  "ffr":"\uD835\uDD23",
  "filig":"\uFB01",
  "FilledSmallSquare":"\u25FC",
  "FilledVerySmallSquare":"\u25AA",
  "fjlig":"\u0066\u006A",
  "flat":"\u266D",
  "fllig":"\uFB02",
  "fltns":"\u25B1",
  "fnof":"\u0192",
  "Fopf":"\uD835\uDD3D",
  "fopf":"\uD835\uDD57",
  "ForAll":"\u2200",
  "forall":"\u2200",
  "fork":"\u22D4",
  "forkv":"\u2AD9",
  "Fouriertrf":"\u2131",
  "fpartint":"\u2A0D",
  "frac12":"\u00BD",
  "frac13":"\u2153",
  "frac14":"\u00BC",
  "frac15":"\u2155",
  "frac16":"\u2159",
  "frac18":"\u215B",
  "frac23":"\u2154",
  "frac25":"\u2156",
  "frac34":"\u00BE",
  "frac35":"\u2157",
  "frac38":"\u215C",
  "frac45":"\u2158",
  "frac56":"\u215A",
  "frac58":"\u215D",
  "frac78":"\u215E",
  "frasl":"\u2044",
  "frown":"\u2322",
  "Fscr":"\u2131",
  "fscr":"\uD835\uDCBB",
  "gacute":"\u01F5",
  "Gamma":"\u0393",
  "gamma":"\u03B3",
  "Gammad":"\u03DC",
  "gammad":"\u03DD",
  "gap":"\u2A86",
  "Gbreve":"\u011E",
  "gbreve":"\u011F",
  "Gcedil":"\u0122",
  "Gcirc":"\u011C",
  "gcirc":"\u011D",
  "Gcy":"\u0413",
  "gcy":"\u0433",
  "Gdot":"\u0120",
  "gdot":"\u0121",
  "gE":"\u2267",
  "ge":"\u2265",
  "gEl":"\u2A8C",
  "gel":"\u22DB",
  "geq":"\u2265",
  "geqq":"\u2267",
  "geqslant":"\u2A7E",
  "ges":"\u2A7E",
  "gescc":"\u2AA9",
  "gesdot":"\u2A80",
  "gesdoto":"\u2A82",
  "gesdotol":"\u2A84",
  "gesl":"\u22DB\uFE00",
  "gesles":"\u2A94",
  "Gfr":"\uD835\uDD0A",
  "gfr":"\uD835\uDD24",
  "Gg":"\u22D9",
  "gg":"\u226B",
  "ggg":"\u22D9",
  "gimel":"\u2137",
  "GJcy":"\u0403",
  "gjcy":"\u0453",
  "gl":"\u2277",
  "gla":"\u2AA5",
  "glE":"\u2A92",
  "glj":"\u2AA4",
  "gnap":"\u2A8A",
  "gnapprox":"\u2A8A",
  "gnE":"\u2269",
  "gne":"\u2A88",
  "gneq":"\u2A88",
  "gneqq":"\u2269",
  "gnsim":"\u22E7",
  "Gopf":"\uD835\uDD3E",
  "gopf":"\uD835\uDD58",
  "grave":"\u0060",
  "GreaterEqual":"\u2265",
  "GreaterEqualLess":"\u22DB",
  "GreaterFullEqual":"\u2267",
  "GreaterGreater":"\u2AA2",
  "GreaterLess":"\u2277",
  "GreaterSlantEqual":"\u2A7E",
  "GreaterTilde":"\u2273",
  "Gscr":"\uD835\uDCA2",
  "gscr":"\u210A",
  "gsim":"\u2273",
  "gsime":"\u2A8E",
  "gsiml":"\u2A90",
  "GT":"\u003E",
  "Gt":"\u226B",
  "gt":"\u003E",
  "gtcc":"\u2AA7",
  "gtcir":"\u2A7A",
  "gtdot":"\u22D7",
  "gtlPar":"\u2995",
  "gtquest":"\u2A7C",
  "gtrapprox":"\u2A86",
  "gtrarr":"\u2978",
  "gtrdot":"\u22D7",
  "gtreqless":"\u22DB",
  "gtreqqless":"\u2A8C",
  "gtrless":"\u2277",
  "gtrsim":"\u2273",
  "gvertneqq":"\u2269\uFE00",
  "gvnE":"\u2269\uFE00",
  "Hacek":"\u02C7",
  "hairsp":"\u200A",
  "half":"\u00BD",
  "hamilt":"\u210B",
  "HARDcy":"\u042A",
  "hardcy":"\u044A",
  "hArr":"\u21D4",
  "harr":"\u2194",
  "harrcir":"\u2948",
  "harrw":"\u21AD",
  "Hat":"\u005E",
  "hbar":"\u210F",
  "Hcirc":"\u0124",
  "hcirc":"\u0125",
  "hearts":"\u2665",
  "heartsuit":"\u2665",
  "hellip":"\u2026",
  "hercon":"\u22B9",
  "Hfr":"\u210C",
  "hfr":"\uD835\uDD25",
  "HilbertSpace":"\u210B",
  "hksearow":"\u2925",
  "hkswarow":"\u2926",
  "hoarr":"\u21FF",
  "homtht":"\u223B",
  "hookleftarrow":"\u21A9",
  "hookrightarrow":"\u21AA",
  "Hopf":"\u210D",
  "hopf":"\uD835\uDD59",
  "horbar":"\u2015",
  "HorizontalLine":"\u2500",
  "Hscr":"\u210B",
  "hscr":"\uD835\uDCBD",
  "hslash":"\u210F",
  "Hstrok":"\u0126",
  "hstrok":"\u0127",
  "HumpDownHump":"\u224E",
  "HumpEqual":"\u224F",
  "hybull":"\u2043",
  "hyphen":"\u2010",
  "Iacute":"\u00CD",
  "iacute":"\u00ED",
  "ic":"\u2063",
  "Icirc":"\u00CE",
  "icirc":"\u00EE",
  "Icy":"\u0418",
  "icy":"\u0438",
  "Idot":"\u0130",
  "IEcy":"\u0415",
  "iecy":"\u0435",
  "iexcl":"\u00A1",
  "iff":"\u21D4",
  "Ifr":"\u2111",
  "ifr":"\uD835\uDD26",
  "Igrave":"\u00CC",
  "igrave":"\u00EC",
  "ii":"\u2148",
  "iiiint":"\u2A0C",
  "iiint":"\u222D",
  "iinfin":"\u29DC",
  "iiota":"\u2129",
  "IJlig":"\u0132",
  "ijlig":"\u0133",
  "Im":"\u2111",
  "Imacr":"\u012A",
  "imacr":"\u012B",
  "image":"\u2111",
  "ImaginaryI":"\u2148",
  "imagline":"\u2110",
  "imagpart":"\u2111",
  "imath":"\u0131",
  "imof":"\u22B7",
  "imped":"\u01B5",
  "Implies":"\u21D2",
  "in":"\u2208",
  "incare":"\u2105",
  "infin":"\u221E",
  "infintie":"\u29DD",
  "inodot":"\u0131",
  "Int":"\u222C",
  "int":"\u222B",
  "intcal":"\u22BA",
  "integers":"\u2124",
  "Integral":"\u222B",
  "intercal":"\u22BA",
  "Intersection":"\u22C2",
  "intlarhk":"\u2A17",
  "intprod":"\u2A3C",
  "InvisibleComma":"\u2063",
  "InvisibleTimes":"\u2062",
  "IOcy":"\u0401",
  "iocy":"\u0451",
  "Iogon":"\u012E",
  "iogon":"\u012F",
  "Iopf":"\uD835\uDD40",
  "iopf":"\uD835\uDD5A",
  "Iota":"\u0399",
  "iota":"\u03B9",
  "iprod":"\u2A3C",
  "iquest":"\u00BF",
  "Iscr":"\u2110",
  "iscr":"\uD835\uDCBE",
  "isin":"\u2208",
  "isindot":"\u22F5",
  "isinE":"\u22F9",
  "isins":"\u22F4",
  "isinsv":"\u22F3",
  "isinv":"\u2208",
  "it":"\u2062",
  "Itilde":"\u0128",
  "itilde":"\u0129",
  "Iukcy":"\u0406",
  "iukcy":"\u0456",
  "Iuml":"\u00CF",
  "iuml":"\u00EF",
  "Jcirc":"\u0134",
  "jcirc":"\u0135",
  "Jcy":"\u0419",
  "jcy":"\u0439",
  "Jfr":"\uD835\uDD0D",
  "jfr":"\uD835\uDD27",
  "jmath":"\u0237",
  "Jopf":"\uD835\uDD41",
  "jopf":"\uD835\uDD5B",
  "Jscr":"\uD835\uDCA5",
  "jscr":"\uD835\uDCBF",
  "Jsercy":"\u0408",
  "jsercy":"\u0458",
  "Jukcy":"\u0404",
  "jukcy":"\u0454",
  "Kappa":"\u039A",
  "kappa":"\u03BA",
  "kappav":"\u03F0",
  "Kcedil":"\u0136",
  "kcedil":"\u0137",
  "Kcy":"\u041A",
  "kcy":"\u043A",
  "Kfr":"\uD835\uDD0E",
  "kfr":"\uD835\uDD28",
  "kgreen":"\u0138",
  "KHcy":"\u0425",
  "khcy":"\u0445",
  "KJcy":"\u040C",
  "kjcy":"\u045C",
  "Kopf":"\uD835\uDD42",
  "kopf":"\uD835\uDD5C",
  "Kscr":"\uD835\uDCA6",
  "kscr":"\uD835\uDCC0",
  "lAarr":"\u21DA",
  "Lacute":"\u0139",
  "lacute":"\u013A",
  "laemptyv":"\u29B4",
  "lagran":"\u2112",
  "Lambda":"\u039B",
  "lambda":"\u03BB",
  "Lang":"\u27EA",
  "lang":"\u27E8",
  "langd":"\u2991",
  "langle":"\u27E8",
  "lap":"\u2A85",
  "Laplacetrf":"\u2112",
  "laquo":"\u00AB",
  "Larr":"\u219E",
  "lArr":"\u21D0",
  "larr":"\u2190",
  "larrb":"\u21E4",
  "larrbfs":"\u291F",
  "larrfs":"\u291D",
  "larrhk":"\u21A9",
  "larrlp":"\u21AB",
  "larrpl":"\u2939",
  "larrsim":"\u2973",
  "larrtl":"\u21A2",
  "lat":"\u2AAB",
  "lAtail":"\u291B",
  "latail":"\u2919",
  "late":"\u2AAD",
  "lates":"\u2AAD\uFE00",
  "lBarr":"\u290E",
  "lbarr":"\u290C",
  "lbbrk":"\u2772",
  "lbrace":"\u007B",
  "lbrack":"\u005B",
  "lbrke":"\u298B",
  "lbrksld":"\u298F",
  "lbrkslu":"\u298D",
  "Lcaron":"\u013D",
  "lcaron":"\u013E",
  "Lcedil":"\u013B",
  "lcedil":"\u013C",
  "lceil":"\u2308",
  "lcub":"\u007B",
  "Lcy":"\u041B",
  "lcy":"\u043B",
  "ldca":"\u2936",
  "ldquo":"\u201C",
  "ldquor":"\u201E",
  "ldrdhar":"\u2967",
  "ldrushar":"\u294B",
  "ldsh":"\u21B2",
  "lE":"\u2266",
  "le":"\u2264",
  "LeftAngleBracket":"\u27E8",
  "LeftArrow":"\u2190",
  "Leftarrow":"\u21D0",
  "leftarrow":"\u2190",
  "LeftArrowBar":"\u21E4",
  "LeftArrowRightArrow":"\u21C6",
  "leftarrowtail":"\u21A2",
  "LeftCeiling":"\u2308",
  "LeftDoubleBracket":"\u27E6",
  "LeftDownTeeVector":"\u2961",
  "LeftDownVector":"\u21C3",
  "LeftDownVectorBar":"\u2959",
  "LeftFloor":"\u230A",
  "leftharpoondown":"\u21BD",
  "leftharpoonup":"\u21BC",
  "leftleftarrows":"\u21C7",
  "LeftRightArrow":"\u2194",
  "Leftrightarrow":"\u21D4",
  "leftrightarrow":"\u2194",
  "leftrightarrows":"\u21C6",
  "leftrightharpoons":"\u21CB",
  "leftrightsquigarrow":"\u21AD",
  "LeftRightVector":"\u294E",
  "LeftTee":"\u22A3",
  "LeftTeeArrow":"\u21A4",
  "LeftTeeVector":"\u295A",
  "leftthreetimes":"\u22CB",
  "LeftTriangle":"\u22B2",
  "LeftTriangleBar":"\u29CF",
  "LeftTriangleEqual":"\u22B4",
  "LeftUpDownVector":"\u2951",
  "LeftUpTeeVector":"\u2960",
  "LeftUpVector":"\u21BF",
  "LeftUpVectorBar":"\u2958",
  "LeftVector":"\u21BC",
  "LeftVectorBar":"\u2952",
  "lEg":"\u2A8B",
  "leg":"\u22DA",
  "leq":"\u2264",
  "leqq":"\u2266",
  "leqslant":"\u2A7D",
  "les":"\u2A7D",
  "lescc":"\u2AA8",
  "lesdot":"\u2A7F",
  "lesdoto":"\u2A81",
  "lesdotor":"\u2A83",
  "lesg":"\u22DA\uFE00",
  "lesges":"\u2A93",
  "lessapprox":"\u2A85",
  "lessdot":"\u22D6",
  "lesseqgtr":"\u22DA",
  "lesseqqgtr":"\u2A8B",
  "LessEqualGreater":"\u22DA",
  "LessFullEqual":"\u2266",
  "LessGreater":"\u2276",
  "lessgtr":"\u2276",
  "LessLess":"\u2AA1",
  "lesssim":"\u2272",
  "LessSlantEqual":"\u2A7D",
  "LessTilde":"\u2272",
  "lfisht":"\u297C",
  "lfloor":"\u230A",
  "Lfr":"\uD835\uDD0F",
  "lfr":"\uD835\uDD29",
  "lg":"\u2276",
  "lgE":"\u2A91",
  "lHar":"\u2962",
  "lhard":"\u21BD",
  "lharu":"\u21BC",
  "lharul":"\u296A",
  "lhblk":"\u2584",
  "LJcy":"\u0409",
  "ljcy":"\u0459",
  "Ll":"\u22D8",
  "ll":"\u226A",
  "llarr":"\u21C7",
  "llcorner":"\u231E",
  "Lleftarrow":"\u21DA",
  "llhard":"\u296B",
  "lltri":"\u25FA",
  "Lmidot":"\u013F",
  "lmidot":"\u0140",
  "lmoust":"\u23B0",
  "lmoustache":"\u23B0",
  "lnap":"\u2A89",
  "lnapprox":"\u2A89",
  "lnE":"\u2268",
  "lne":"\u2A87",
  "lneq":"\u2A87",
  "lneqq":"\u2268",
  "lnsim":"\u22E6",
  "loang":"\u27EC",
  "loarr":"\u21FD",
  "lobrk":"\u27E6",
  "LongLeftArrow":"\u27F5",
  "Longleftarrow":"\u27F8",
  "longleftarrow":"\u27F5",
  "LongLeftRightArrow":"\u27F7",
  "Longleftrightarrow":"\u27FA",
  "longleftrightarrow":"\u27F7",
  "longmapsto":"\u27FC",
  "LongRightArrow":"\u27F6",
  "Longrightarrow":"\u27F9",
  "longrightarrow":"\u27F6",
  "looparrowleft":"\u21AB",
  "looparrowright":"\u21AC",
  "lopar":"\u2985",
  "Lopf":"\uD835\uDD43",
  "lopf":"\uD835\uDD5D",
  "loplus":"\u2A2D",
  "lotimes":"\u2A34",
  "lowast":"\u2217",
  "lowbar":"\u005F",
  "LowerLeftArrow":"\u2199",
  "LowerRightArrow":"\u2198",
  "loz":"\u25CA",
  "lozenge":"\u25CA",
  "lozf":"\u29EB",
  "lpar":"\u0028",
  "lparlt":"\u2993",
  "lrarr":"\u21C6",
  "lrcorner":"\u231F",
  "lrhar":"\u21CB",
  "lrhard":"\u296D",
  "lrm":"\u200E",
  "lrtri":"\u22BF",
  "lsaquo":"\u2039",
  "Lscr":"\u2112",
  "lscr":"\uD835\uDCC1",
  "Lsh":"\u21B0",
  "lsh":"\u21B0",
  "lsim":"\u2272",
  "lsime":"\u2A8D",
  "lsimg":"\u2A8F",
  "lsqb":"\u005B",
  "lsquo":"\u2018",
  "lsquor":"\u201A",
  "Lstrok":"\u0141",
  "lstrok":"\u0142",
  "LT":"\u003C",
  "Lt":"\u226A",
  "lt":"\u003C",
  "ltcc":"\u2AA6",
  "ltcir":"\u2A79",
  "ltdot":"\u22D6",
  "lthree":"\u22CB",
  "ltimes":"\u22C9",
  "ltlarr":"\u2976",
  "ltquest":"\u2A7B",
  "ltri":"\u25C3",
  "ltrie":"\u22B4",
  "ltrif":"\u25C2",
  "ltrPar":"\u2996",
  "lurdshar":"\u294A",
  "luruhar":"\u2966",
  "lvertneqq":"\u2268\uFE00",
  "lvnE":"\u2268\uFE00",
  "macr":"\u00AF",
  "male":"\u2642",
  "malt":"\u2720",
  "maltese":"\u2720",
  "Map":"\u2905",
  "map":"\u21A6",
  "mapsto":"\u21A6",
  "mapstodown":"\u21A7",
  "mapstoleft":"\u21A4",
  "mapstoup":"\u21A5",
  "marker":"\u25AE",
  "mcomma":"\u2A29",
  "Mcy":"\u041C",
  "mcy":"\u043C",
  "mdash":"\u2014",
  "mDDot":"\u223A",
  "measuredangle":"\u2221",
  "MediumSpace":"\u205F",
  "Mellintrf":"\u2133",
  "Mfr":"\uD835\uDD10",
  "mfr":"\uD835\uDD2A",
  "mho":"\u2127",
  "micro":"\u00B5",
  "mid":"\u2223",
  "midast":"\u002A",
  "midcir":"\u2AF0",
  "middot":"\u00B7",
  "minus":"\u2212",
  "minusb":"\u229F",
  "minusd":"\u2238",
  "minusdu":"\u2A2A",
  "MinusPlus":"\u2213",
  "mlcp":"\u2ADB",
  "mldr":"\u2026",
  "mnplus":"\u2213",
  "models":"\u22A7",
  "Mopf":"\uD835\uDD44",
  "mopf":"\uD835\uDD5E",
  "mp":"\u2213",
  "Mscr":"\u2133",
  "mscr":"\uD835\uDCC2",
  "mstpos":"\u223E",
  "Mu":"\u039C",
  "mu":"\u03BC",
  "multimap":"\u22B8",
  "mumap":"\u22B8",
  "nabla":"\u2207",
  "Nacute":"\u0143",
  "nacute":"\u0144",
  "nang":"\u2220\u20D2",
  "nap":"\u2249",
  "napE":"\u2A70\u0338",
  "napid":"\u224B\u0338",
  "napos":"\u0149",
  "napprox":"\u2249",
  "natur":"\u266E",
  "natural":"\u266E",
  "naturals":"\u2115",
  "nbsp":"\u00A0",
  "nbump":"\u224E\u0338",
  "nbumpe":"\u224F\u0338",
  "ncap":"\u2A43",
  "Ncaron":"\u0147",
  "ncaron":"\u0148",
  "Ncedil":"\u0145",
  "ncedil":"\u0146",
  "ncong":"\u2247",
  "ncongdot":"\u2A6D\u0338",
  "ncup":"\u2A42",
  "Ncy":"\u041D",
  "ncy":"\u043D",
  "ndash":"\u2013",
  "ne":"\u2260",
  "nearhk":"\u2924",
  "neArr":"\u21D7",
  "nearr":"\u2197",
  "nearrow":"\u2197",
  "nedot":"\u2250\u0338",
  "NegativeMediumSpace":"\u200B",
  "NegativeThickSpace":"\u200B",
  "NegativeThinSpace":"\u200B",
  "NegativeVeryThinSpace":"\u200B",
  "nequiv":"\u2262",
  "nesear":"\u2928",
  "nesim":"\u2242\u0338",
  "NestedGreaterGreater":"\u226B",
  "NestedLessLess":"\u226A",
  "NewLine":"\u000A",
  "nexist":"\u2204",
  "nexists":"\u2204",
  "Nfr":"\uD835\uDD11",
  "nfr":"\uD835\uDD2B",
  "ngE":"\u2267\u0338",
  "nge":"\u2271",
  "ngeq":"\u2271",
  "ngeqq":"\u2267\u0338",
  "ngeqslant":"\u2A7E\u0338",
  "nges":"\u2A7E\u0338",
  "nGg":"\u22D9\u0338",
  "ngsim":"\u2275",
  "nGt":"\u226B\u20D2",
  "ngt":"\u226F",
  "ngtr":"\u226F",
  "nGtv":"\u226B\u0338",
  "nhArr":"\u21CE",
  "nharr":"\u21AE",
  "nhpar":"\u2AF2",
  "ni":"\u220B",
  "nis":"\u22FC",
  "nisd":"\u22FA",
  "niv":"\u220B",
  "NJcy":"\u040A",
  "njcy":"\u045A",
  "nlArr":"\u21CD",
  "nlarr":"\u219A",
  "nldr":"\u2025",
  "nlE":"\u2266\u0338",
  "nle":"\u2270",
  "nLeftarrow":"\u21CD",
  "nleftarrow":"\u219A",
  "nLeftrightarrow":"\u21CE",
  "nleftrightarrow":"\u21AE",
  "nleq":"\u2270",
  "nleqq":"\u2266\u0338",
  "nleqslant":"\u2A7D\u0338",
  "nles":"\u2A7D\u0338",
  "nless":"\u226E",
  "nLl":"\u22D8\u0338",
  "nlsim":"\u2274",
  "nLt":"\u226A\u20D2",
  "nlt":"\u226E",
  "nltri":"\u22EA",
  "nltrie":"\u22EC",
  "nLtv":"\u226A\u0338",
  "nmid":"\u2224",
  "NoBreak":"\u2060",
  "NonBreakingSpace":"\u00A0",
  "Nopf":"\u2115",
  "nopf":"\uD835\uDD5F",
  "Not":"\u2AEC",
  "not":"\u00AC",
  "NotCongruent":"\u2262",
  "NotCupCap":"\u226D",
  "NotDoubleVerticalBar":"\u2226",
  "NotElement":"\u2209",
  "NotEqual":"\u2260",
  "NotEqualTilde":"\u2242\u0338",
  "NotExists":"\u2204",
  "NotGreater":"\u226F",
  "NotGreaterEqual":"\u2271",
  "NotGreaterFullEqual":"\u2267\u0338",
  "NotGreaterGreater":"\u226B\u0338",
  "NotGreaterLess":"\u2279",
  "NotGreaterSlantEqual":"\u2A7E\u0338",
  "NotGreaterTilde":"\u2275",
  "NotHumpDownHump":"\u224E\u0338",
  "NotHumpEqual":"\u224F\u0338",
  "notin":"\u2209",
  "notindot":"\u22F5\u0338",
  "notinE":"\u22F9\u0338",
  "notinva":"\u2209",
  "notinvb":"\u22F7",
  "notinvc":"\u22F6",
  "NotLeftTriangle":"\u22EA",
  "NotLeftTriangleBar":"\u29CF\u0338",
  "NotLeftTriangleEqual":"\u22EC",
  "NotLess":"\u226E",
  "NotLessEqual":"\u2270",
  "NotLessGreater":"\u2278",
  "NotLessLess":"\u226A\u0338",
  "NotLessSlantEqual":"\u2A7D\u0338",
  "NotLessTilde":"\u2274",
  "NotNestedGreaterGreater":"\u2AA2\u0338",
  "NotNestedLessLess":"\u2AA1\u0338",
  "notni":"\u220C",
  "notniva":"\u220C",
  "notnivb":"\u22FE",
  "notnivc":"\u22FD",
  "NotPrecedes":"\u2280",
  "NotPrecedesEqual":"\u2AAF\u0338",
  "NotPrecedesSlantEqual":"\u22E0",
  "NotReverseElement":"\u220C",
  "NotRightTriangle":"\u22EB",
  "NotRightTriangleBar":"\u29D0\u0338",
  "NotRightTriangleEqual":"\u22ED",
  "NotSquareSubset":"\u228F\u0338",
  "NotSquareSubsetEqual":"\u22E2",
  "NotSquareSuperset":"\u2290\u0338",
  "NotSquareSupersetEqual":"\u22E3",
  "NotSubset":"\u2282\u20D2",
  "NotSubsetEqual":"\u2288",
  "NotSucceeds":"\u2281",
  "NotSucceedsEqual":"\u2AB0\u0338",
  "NotSucceedsSlantEqual":"\u22E1",
  "NotSucceedsTilde":"\u227F\u0338",
  "NotSuperset":"\u2283\u20D2",
  "NotSupersetEqual":"\u2289",
  "NotTilde":"\u2241",
  "NotTildeEqual":"\u2244",
  "NotTildeFullEqual":"\u2247",
  "NotTildeTilde":"\u2249",
  "NotVerticalBar":"\u2224",
  "npar":"\u2226",
  "nparallel":"\u2226",
  "nparsl":"\u2AFD\u20E5",
  "npart":"\u2202\u0338",
  "npolint":"\u2A14",
  "npr":"\u2280",
  "nprcue":"\u22E0",
  "npre":"\u2AAF\u0338",
  "nprec":"\u2280",
  "npreceq":"\u2AAF\u0338",
  "nrArr":"\u21CF",
  "nrarr":"\u219B",
  "nrarrc":"\u2933\u0338",
  "nrarrw":"\u219D\u0338",
  "nRightarrow":"\u21CF",
  "nrightarrow":"\u219B",
  "nrtri":"\u22EB",
  "nrtrie":"\u22ED",
  "nsc":"\u2281",
  "nsccue":"\u22E1",
  "nsce":"\u2AB0\u0338",
  "Nscr":"\uD835\uDCA9",
  "nscr":"\uD835\uDCC3",
  "nshortmid":"\u2224",
  "nshortparallel":"\u2226",
  "nsim":"\u2241",
  "nsime":"\u2244",
  "nsimeq":"\u2244",
  "nsmid":"\u2224",
  "nspar":"\u2226",
  "nsqsube":"\u22E2",
  "nsqsupe":"\u22E3",
  "nsub":"\u2284",
  "nsubE":"\u2AC5\u0338",
  "nsube":"\u2288",
  "nsubset":"\u2282\u20D2",
  "nsubseteq":"\u2288",
  "nsubseteqq":"\u2AC5\u0338",
  "nsucc":"\u2281",
  "nsucceq":"\u2AB0\u0338",
  "nsup":"\u2285",
  "nsupE":"\u2AC6\u0338",
  "nsupe":"\u2289",
  "nsupset":"\u2283\u20D2",
  "nsupseteq":"\u2289",
  "nsupseteqq":"\u2AC6\u0338",
  "ntgl":"\u2279",
  "Ntilde":"\u00D1",
  "ntilde":"\u00F1",
  "ntlg":"\u2278",
  "ntriangleleft":"\u22EA",
  "ntrianglelefteq":"\u22EC",
  "ntriangleright":"\u22EB",
  "ntrianglerighteq":"\u22ED",
  "Nu":"\u039D",
  "nu":"\u03BD",
  "num":"\u0023",
  "numero":"\u2116",
  "numsp":"\u2007",
  "nvap":"\u224D\u20D2",
  "nVDash":"\u22AF",
  "nVdash":"\u22AE",
  "nvDash":"\u22AD",
  "nvdash":"\u22AC",
  "nvge":"\u2265\u20D2",
  "nvgt":"\u003E\u20D2",
  "nvHarr":"\u2904",
  "nvinfin":"\u29DE",
  "nvlArr":"\u2902",
  "nvle":"\u2264\u20D2",
  "nvlt":"\u003C\u20D2",
  "nvltrie":"\u22B4\u20D2",
  "nvrArr":"\u2903",
  "nvrtrie":"\u22B5\u20D2",
  "nvsim":"\u223C\u20D2",
  "nwarhk":"\u2923",
  "nwArr":"\u21D6",
  "nwarr":"\u2196",
  "nwarrow":"\u2196",
  "nwnear":"\u2927",
  "Oacute":"\u00D3",
  "oacute":"\u00F3",
  "oast":"\u229B",
  "ocir":"\u229A",
  "Ocirc":"\u00D4",
  "ocirc":"\u00F4",
  "Ocy":"\u041E",
  "ocy":"\u043E",
  "odash":"\u229D",
  "Odblac":"\u0150",
  "odblac":"\u0151",
  "odiv":"\u2A38",
  "odot":"\u2299",
  "odsold":"\u29BC",
  "OElig":"\u0152",
  "oelig":"\u0153",
  "ofcir":"\u29BF",
  "Ofr":"\uD835\uDD12",
  "ofr":"\uD835\uDD2C",
  "ogon":"\u02DB",
  "Ograve":"\u00D2",
  "ograve":"\u00F2",
  "ogt":"\u29C1",
  "ohbar":"\u29B5",
  "ohm":"\u03A9",
  "oint":"\u222E",
  "olarr":"\u21BA",
  "olcir":"\u29BE",
  "olcross":"\u29BB",
  "oline":"\u203E",
  "olt":"\u29C0",
  "Omacr":"\u014C",
  "omacr":"\u014D",
  "Omega":"\u03A9",
  "omega":"\u03C9",
  "Omicron":"\u039F",
  "omicron":"\u03BF",
  "omid":"\u29B6",
  "ominus":"\u2296",
  "Oopf":"\uD835\uDD46",
  "oopf":"\uD835\uDD60",
  "opar":"\u29B7",
  "OpenCurlyDoubleQuote":"\u201C",
  "OpenCurlyQuote":"\u2018",
  "operp":"\u29B9",
  "oplus":"\u2295",
  "Or":"\u2A54",
  "or":"\u2228",
  "orarr":"\u21BB",
  "ord":"\u2A5D",
  "order":"\u2134",
  "orderof":"\u2134",
  "ordf":"\u00AA",
  "ordm":"\u00BA",
  "origof":"\u22B6",
  "oror":"\u2A56",
  "orslope":"\u2A57",
  "orv":"\u2A5B",
  "oS":"\u24C8",
  "Oscr":"\uD835\uDCAA",
  "oscr":"\u2134",
  "Oslash":"\u00D8",
  "oslash":"\u00F8",
  "osol":"\u2298",
  "Otilde":"\u00D5",
  "otilde":"\u00F5",
  "Otimes":"\u2A37",
  "otimes":"\u2297",
  "otimesas":"\u2A36",
  "Ouml":"\u00D6",
  "ouml":"\u00F6",
  "ovbar":"\u233D",
  "OverBar":"\u203E",
  "OverBrace":"\u23DE",
  "OverBracket":"\u23B4",
  "OverParenthesis":"\u23DC",
  "par":"\u2225",
  "para":"\u00B6",
  "parallel":"\u2225",
  "parsim":"\u2AF3",
  "parsl":"\u2AFD",
  "part":"\u2202",
  "PartialD":"\u2202",
  "Pcy":"\u041F",
  "pcy":"\u043F",
  "percnt":"\u0025",
  "period":"\u002E",
  "permil":"\u2030",
  "perp":"\u22A5",
  "pertenk":"\u2031",
  "Pfr":"\uD835\uDD13",
  "pfr":"\uD835\uDD2D",
  "Phi":"\u03A6",
  "phi":"\u03C6",
  "phiv":"\u03D5",
  "phmmat":"\u2133",
  "phone":"\u260E",
  "Pi":"\u03A0",
  "pi":"\u03C0",
  "pitchfork":"\u22D4",
  "piv":"\u03D6",
  "planck":"\u210F",
  "planckh":"\u210E",
  "plankv":"\u210F",
  "plus":"\u002B",
  "plusacir":"\u2A23",
  "plusb":"\u229E",
  "pluscir":"\u2A22",
  "plusdo":"\u2214",
  "plusdu":"\u2A25",
  "pluse":"\u2A72",
  "PlusMinus":"\u00B1",
  "plusmn":"\u00B1",
  "plussim":"\u2A26",
  "plustwo":"\u2A27",
  "pm":"\u00B1",
  "Poincareplane":"\u210C",
  "pointint":"\u2A15",
  "Popf":"\u2119",
  "popf":"\uD835\uDD61",
  "pound":"\u00A3",
  "Pr":"\u2ABB",
  "pr":"\u227A",
  "prap":"\u2AB7",
  "prcue":"\u227C",
  "prE":"\u2AB3",
  "pre":"\u2AAF",
  "prec":"\u227A",
  "precapprox":"\u2AB7",
  "preccurlyeq":"\u227C",
  "Precedes":"\u227A",
  "PrecedesEqual":"\u2AAF",
  "PrecedesSlantEqual":"\u227C",
  "PrecedesTilde":"\u227E",
  "preceq":"\u2AAF",
  "precnapprox":"\u2AB9",
  "precneqq":"\u2AB5",
  "precnsim":"\u22E8",
  "precsim":"\u227E",
  "Prime":"\u2033",
  "prime":"\u2032",
  "primes":"\u2119",
  "prnap":"\u2AB9",
  "prnE":"\u2AB5",
  "prnsim":"\u22E8",
  "prod":"\u220F",
  "Product":"\u220F",
  "profalar":"\u232E",
  "profline":"\u2312",
  "profsurf":"\u2313",
  "prop":"\u221D",
  "Proportion":"\u2237",
  "Proportional":"\u221D",
  "propto":"\u221D",
  "prsim":"\u227E",
  "prurel":"\u22B0",
  "Pscr":"\uD835\uDCAB",
  "pscr":"\uD835\uDCC5",
  "Psi":"\u03A8",
  "psi":"\u03C8",
  "puncsp":"\u2008",
  "Qfr":"\uD835\uDD14",
  "qfr":"\uD835\uDD2E",
  "qint":"\u2A0C",
  "Qopf":"\u211A",
  "qopf":"\uD835\uDD62",
  "qprime":"\u2057",
  "Qscr":"\uD835\uDCAC",
  "qscr":"\uD835\uDCC6",
  "quaternions":"\u210D",
  "quatint":"\u2A16",
  "quest":"\u003F",
  "questeq":"\u225F",
  "QUOT":"\u0022",
  "quot":"\u0022",
  "rAarr":"\u21DB",
  "race":"\u223D\u0331",
  "Racute":"\u0154",
  "racute":"\u0155",
  "radic":"\u221A",
  "raemptyv":"\u29B3",
  "Rang":"\u27EB",
  "rang":"\u27E9",
  "rangd":"\u2992",
  "range":"\u29A5",
  "rangle":"\u27E9",
  "raquo":"\u00BB",
  "Rarr":"\u21A0",
  "rArr":"\u21D2",
  "rarr":"\u2192",
  "rarrap":"\u2975",
  "rarrb":"\u21E5",
  "rarrbfs":"\u2920",
  "rarrc":"\u2933",
  "rarrfs":"\u291E",
  "rarrhk":"\u21AA",
  "rarrlp":"\u21AC",
  "rarrpl":"\u2945",
  "rarrsim":"\u2974",
  "Rarrtl":"\u2916",
  "rarrtl":"\u21A3",
  "rarrw":"\u219D",
  "rAtail":"\u291C",
  "ratail":"\u291A",
  "ratio":"\u2236",
  "rationals":"\u211A",
  "RBarr":"\u2910",
  "rBarr":"\u290F",
  "rbarr":"\u290D",
  "rbbrk":"\u2773",
  "rbrace":"\u007D",
  "rbrack":"\u005D",
  "rbrke":"\u298C",
  "rbrksld":"\u298E",
  "rbrkslu":"\u2990",
  "Rcaron":"\u0158",
  "rcaron":"\u0159",
  "Rcedil":"\u0156",
  "rcedil":"\u0157",
  "rceil":"\u2309",
  "rcub":"\u007D",
  "Rcy":"\u0420",
  "rcy":"\u0440",
  "rdca":"\u2937",
  "rdldhar":"\u2969",
  "rdquo":"\u201D",
  "rdquor":"\u201D",
  "rdsh":"\u21B3",
  "Re":"\u211C",
  "real":"\u211C",
  "realine":"\u211B",
  "realpart":"\u211C",
  "reals":"\u211D",
  "rect":"\u25AD",
  "REG":"\u00AE",
  "reg":"\u00AE",
  "ReverseElement":"\u220B",
  "ReverseEquilibrium":"\u21CB",
  "ReverseUpEquilibrium":"\u296F",
  "rfisht":"\u297D",
  "rfloor":"\u230B",
  "Rfr":"\u211C",
  "rfr":"\uD835\uDD2F",
  "rHar":"\u2964",
  "rhard":"\u21C1",
  "rharu":"\u21C0",
  "rharul":"\u296C",
  "Rho":"\u03A1",
  "rho":"\u03C1",
  "rhov":"\u03F1",
  "RightAngleBracket":"\u27E9",
  "RightArrow":"\u2192",
  "Rightarrow":"\u21D2",
  "rightarrow":"\u2192",
  "RightArrowBar":"\u21E5",
  "RightArrowLeftArrow":"\u21C4",
  "rightarrowtail":"\u21A3",
  "RightCeiling":"\u2309",
  "RightDoubleBracket":"\u27E7",
  "RightDownTeeVector":"\u295D",
  "RightDownVector":"\u21C2",
  "RightDownVectorBar":"\u2955",
  "RightFloor":"\u230B",
  "rightharpoondown":"\u21C1",
  "rightharpoonup":"\u21C0",
  "rightleftarrows":"\u21C4",
  "rightleftharpoons":"\u21CC",
  "rightrightarrows":"\u21C9",
  "rightsquigarrow":"\u219D",
  "RightTee":"\u22A2",
  "RightTeeArrow":"\u21A6",
  "RightTeeVector":"\u295B",
  "rightthreetimes":"\u22CC",
  "RightTriangle":"\u22B3",
  "RightTriangleBar":"\u29D0",
  "RightTriangleEqual":"\u22B5",
  "RightUpDownVector":"\u294F",
  "RightUpTeeVector":"\u295C",
  "RightUpVector":"\u21BE",
  "RightUpVectorBar":"\u2954",
  "RightVector":"\u21C0",
  "RightVectorBar":"\u2953",
  "ring":"\u02DA",
  "risingdotseq":"\u2253",
  "rlarr":"\u21C4",
  "rlhar":"\u21CC",
  "rlm":"\u200F",
  "rmoust":"\u23B1",
  "rmoustache":"\u23B1",
  "rnmid":"\u2AEE",
  "roang":"\u27ED",
  "roarr":"\u21FE",
  "robrk":"\u27E7",
  "ropar":"\u2986",
  "Ropf":"\u211D",
  "ropf":"\uD835\uDD63",
  "roplus":"\u2A2E",
  "rotimes":"\u2A35",
  "RoundImplies":"\u2970",
  "rpar":"\u0029",
  "rpargt":"\u2994",
  "rppolint":"\u2A12",
  "rrarr":"\u21C9",
  "Rrightarrow":"\u21DB",
  "rsaquo":"\u203A",
  "Rscr":"\u211B",
  "rscr":"\uD835\uDCC7",
  "Rsh":"\u21B1",
  "rsh":"\u21B1",
  "rsqb":"\u005D",
  "rsquo":"\u2019",
  "rsquor":"\u2019",
  "rthree":"\u22CC",
  "rtimes":"\u22CA",
  "rtri":"\u25B9",
  "rtrie":"\u22B5",
  "rtrif":"\u25B8",
  "rtriltri":"\u29CE",
  "RuleDelayed":"\u29F4",
  "ruluhar":"\u2968",
  "rx":"\u211E",
  "Sacute":"\u015A",
  "sacute":"\u015B",
  "sbquo":"\u201A",
  "Sc":"\u2ABC",
  "sc":"\u227B",
  "scap":"\u2AB8",
  "Scaron":"\u0160",
  "scaron":"\u0161",
  "sccue":"\u227D",
  "scE":"\u2AB4",
  "sce":"\u2AB0",
  "Scedil":"\u015E",
  "scedil":"\u015F",
  "Scirc":"\u015C",
  "scirc":"\u015D",
  "scnap":"\u2ABA",
  "scnE":"\u2AB6",
  "scnsim":"\u22E9",
  "scpolint":"\u2A13",
  "scsim":"\u227F",
  "Scy":"\u0421",
  "scy":"\u0441",
  "sdot":"\u22C5",
  "sdotb":"\u22A1",
  "sdote":"\u2A66",
  "searhk":"\u2925",
  "seArr":"\u21D8",
  "searr":"\u2198",
  "searrow":"\u2198",
  "sect":"\u00A7",
  "semi":"\u003B",
  "seswar":"\u2929",
  "setminus":"\u2216",
  "setmn":"\u2216",
  "sext":"\u2736",
  "Sfr":"\uD835\uDD16",
  "sfr":"\uD835\uDD30",
  "sfrown":"\u2322",
  "sharp":"\u266F",
  "SHCHcy":"\u0429",
  "shchcy":"\u0449",
  "SHcy":"\u0428",
  "shcy":"\u0448",
  "ShortDownArrow":"\u2193",
  "ShortLeftArrow":"\u2190",
  "shortmid":"\u2223",
  "shortparallel":"\u2225",
  "ShortRightArrow":"\u2192",
  "ShortUpArrow":"\u2191",
  "shy":"\u00AD",
  "Sigma":"\u03A3",
  "sigma":"\u03C3",
  "sigmaf":"\u03C2",
  "sigmav":"\u03C2",
  "sim":"\u223C",
  "simdot":"\u2A6A",
  "sime":"\u2243",
  "simeq":"\u2243",
  "simg":"\u2A9E",
  "simgE":"\u2AA0",
  "siml":"\u2A9D",
  "simlE":"\u2A9F",
  "simne":"\u2246",
  "simplus":"\u2A24",
  "simrarr":"\u2972",
  "slarr":"\u2190",
  "SmallCircle":"\u2218",
  "smallsetminus":"\u2216",
  "smashp":"\u2A33",
  "smeparsl":"\u29E4",
  "smid":"\u2223",
  "smile":"\u2323",
  "smt":"\u2AAA",
  "smte":"\u2AAC",
  "smtes":"\u2AAC\uFE00",
  "SOFTcy":"\u042C",
  "softcy":"\u044C",
  "sol":"\u002F",
  "solb":"\u29C4",
  "solbar":"\u233F",
  "Sopf":"\uD835\uDD4A",
  "sopf":"\uD835\uDD64",
  "spades":"\u2660",
  "spadesuit":"\u2660",
  "spar":"\u2225",
  "sqcap":"\u2293",
  "sqcaps":"\u2293\uFE00",
  "sqcup":"\u2294",
  "sqcups":"\u2294\uFE00",
  "Sqrt":"\u221A",
  "sqsub":"\u228F",
  "sqsube":"\u2291",
  "sqsubset":"\u228F",
  "sqsubseteq":"\u2291",
  "sqsup":"\u2290",
  "sqsupe":"\u2292",
  "sqsupset":"\u2290",
  "sqsupseteq":"\u2292",
  "squ":"\u25A1",
  "Square":"\u25A1",
  "square":"\u25A1",
  "SquareIntersection":"\u2293",
  "SquareSubset":"\u228F",
  "SquareSubsetEqual":"\u2291",
  "SquareSuperset":"\u2290",
  "SquareSupersetEqual":"\u2292",
  "SquareUnion":"\u2294",
  "squarf":"\u25AA",
  "squf":"\u25AA",
  "srarr":"\u2192",
  "Sscr":"\uD835\uDCAE",
  "sscr":"\uD835\uDCC8",
  "ssetmn":"\u2216",
  "ssmile":"\u2323",
  "sstarf":"\u22C6",
  "Star":"\u22C6",
  "star":"\u2606",
  "starf":"\u2605",
  "straightepsilon":"\u03F5",
  "straightphi":"\u03D5",
  "strns":"\u00AF",
  "Sub":"\u22D0",
  "sub":"\u2282",
  "subdot":"\u2ABD",
  "subE":"\u2AC5",
  "sube":"\u2286",
  "subedot":"\u2AC3",
  "submult":"\u2AC1",
  "subnE":"\u2ACB",
  "subne":"\u228A",
  "subplus":"\u2ABF",
  "subrarr":"\u2979",
  "Subset":"\u22D0",
  "subset":"\u2282",
  "subseteq":"\u2286",
  "subseteqq":"\u2AC5",
  "SubsetEqual":"\u2286",
  "subsetneq":"\u228A",
  "subsetneqq":"\u2ACB",
  "subsim":"\u2AC7",
  "subsub":"\u2AD5",
  "subsup":"\u2AD3",
  "succ":"\u227B",
  "succapprox":"\u2AB8",
  "succcurlyeq":"\u227D",
  "Succeeds":"\u227B",
  "SucceedsEqual":"\u2AB0",
  "SucceedsSlantEqual":"\u227D",
  "SucceedsTilde":"\u227F",
  "succeq":"\u2AB0",
  "succnapprox":"\u2ABA",
  "succneqq":"\u2AB6",
  "succnsim":"\u22E9",
  "succsim":"\u227F",
  "SuchThat":"\u220B",
  "Sum":"\u2211",
  "sum":"\u2211",
  "sung":"\u266A",
  "Sup":"\u22D1",
  "sup":"\u2283",
  "sup1":"\u00B9",
  "sup2":"\u00B2",
  "sup3":"\u00B3",
  "supdot":"\u2ABE",
  "supdsub":"\u2AD8",
  "supE":"\u2AC6",
  "supe":"\u2287",
  "supedot":"\u2AC4",
  "Superset":"\u2283",
  "SupersetEqual":"\u2287",
  "suphsol":"\u27C9",
  "suphsub":"\u2AD7",
  "suplarr":"\u297B",
  "supmult":"\u2AC2",
  "supnE":"\u2ACC",
  "supne":"\u228B",
  "supplus":"\u2AC0",
  "Supset":"\u22D1",
  "supset":"\u2283",
  "supseteq":"\u2287",
  "supseteqq":"\u2AC6",
  "supsetneq":"\u228B",
  "supsetneqq":"\u2ACC",
  "supsim":"\u2AC8",
  "supsub":"\u2AD4",
  "supsup":"\u2AD6",
  "swarhk":"\u2926",
  "swArr":"\u21D9",
  "swarr":"\u2199",
  "swarrow":"\u2199",
  "swnwar":"\u292A",
  "szlig":"\u00DF",
  "Tab":"\u0009",
  "target":"\u2316",
  "Tau":"\u03A4",
  "tau":"\u03C4",
  "tbrk":"\u23B4",
  "Tcaron":"\u0164",
  "tcaron":"\u0165",
  "Tcedil":"\u0162",
  "tcedil":"\u0163",
  "Tcy":"\u0422",
  "tcy":"\u0442",
  "tdot":"\u20DB",
  "telrec":"\u2315",
  "Tfr":"\uD835\uDD17",
  "tfr":"\uD835\uDD31",
  "there4":"\u2234",
  "Therefore":"\u2234",
  "therefore":"\u2234",
  "Theta":"\u0398",
  "theta":"\u03B8",
  "thetasym":"\u03D1",
  "thetav":"\u03D1",
  "thickapprox":"\u2248",
  "thicksim":"\u223C",
  "ThickSpace":"\u205F\u200A",
  "thinsp":"\u2009",
  "ThinSpace":"\u2009",
  "thkap":"\u2248",
  "thksim":"\u223C",
  "THORN":"\u00DE",
  "thorn":"\u00FE",
  "Tilde":"\u223C",
  "tilde":"\u02DC",
  "TildeEqual":"\u2243",
  "TildeFullEqual":"\u2245",
  "TildeTilde":"\u2248",
  "times":"\u00D7",
  "timesb":"\u22A0",
  "timesbar":"\u2A31",
  "timesd":"\u2A30",
  "tint":"\u222D",
  "toea":"\u2928",
  "top":"\u22A4",
  "topbot":"\u2336",
  "topcir":"\u2AF1",
  "Topf":"\uD835\uDD4B",
  "topf":"\uD835\uDD65",
  "topfork":"\u2ADA",
  "tosa":"\u2929",
  "tprime":"\u2034",
  "TRADE":"\u2122",
  "trade":"\u2122",
  "triangle":"\u25B5",
  "triangledown":"\u25BF",
  "triangleleft":"\u25C3",
  "trianglelefteq":"\u22B4",
  "triangleq":"\u225C",
  "triangleright":"\u25B9",
  "trianglerighteq":"\u22B5",
  "tridot":"\u25EC",
  "trie":"\u225C",
  "triminus":"\u2A3A",
  "TripleDot":"\u20DB",
  "triplus":"\u2A39",
  "trisb":"\u29CD",
  "tritime":"\u2A3B",
  "trpezium":"\u23E2",
  "Tscr":"\uD835\uDCAF",
  "tscr":"\uD835\uDCC9",
  "TScy":"\u0426",
  "tscy":"\u0446",
  "TSHcy":"\u040B",
  "tshcy":"\u045B",
  "Tstrok":"\u0166",
  "tstrok":"\u0167",
  "twixt":"\u226C",
  "twoheadleftarrow":"\u219E",
  "twoheadrightarrow":"\u21A0",
  "Uacute":"\u00DA",
  "uacute":"\u00FA",
  "Uarr":"\u219F",
  "uArr":"\u21D1",
  "uarr":"\u2191",
  "Uarrocir":"\u2949",
  "Ubrcy":"\u040E",
  "ubrcy":"\u045E",
  "Ubreve":"\u016C",
  "ubreve":"\u016D",
  "Ucirc":"\u00DB",
  "ucirc":"\u00FB",
  "Ucy":"\u0423",
  "ucy":"\u0443",
  "udarr":"\u21C5",
  "Udblac":"\u0170",
  "udblac":"\u0171",
  "udhar":"\u296E",
  "ufisht":"\u297E",
  "Ufr":"\uD835\uDD18",
  "ufr":"\uD835\uDD32",
  "Ugrave":"\u00D9",
  "ugrave":"\u00F9",
  "uHar":"\u2963",
  "uharl":"\u21BF",
  "uharr":"\u21BE",
  "uhblk":"\u2580",
  "ulcorn":"\u231C",
  "ulcorner":"\u231C",
  "ulcrop":"\u230F",
  "ultri":"\u25F8",
  "Umacr":"\u016A",
  "umacr":"\u016B",
  "uml":"\u00A8",
  "UnderBar":"\u005F",
  "UnderBrace":"\u23DF",
  "UnderBracket":"\u23B5",
  "UnderParenthesis":"\u23DD",
  "Union":"\u22C3",
  "UnionPlus":"\u228E",
  "Uogon":"\u0172",
  "uogon":"\u0173",
  "Uopf":"\uD835\uDD4C",
  "uopf":"\uD835\uDD66",
  "UpArrow":"\u2191",
  "Uparrow":"\u21D1",
  "uparrow":"\u2191",
  "UpArrowBar":"\u2912",
  "UpArrowDownArrow":"\u21C5",
  "UpDownArrow":"\u2195",
  "Updownarrow":"\u21D5",
  "updownarrow":"\u2195",
  "UpEquilibrium":"\u296E",
  "upharpoonleft":"\u21BF",
  "upharpoonright":"\u21BE",
  "uplus":"\u228E",
  "UpperLeftArrow":"\u2196",
  "UpperRightArrow":"\u2197",
  "Upsi":"\u03D2",
  "upsi":"\u03C5",
  "upsih":"\u03D2",
  "Upsilon":"\u03A5",
  "upsilon":"\u03C5",
  "UpTee":"\u22A5",
  "UpTeeArrow":"\u21A5",
  "upuparrows":"\u21C8",
  "urcorn":"\u231D",
  "urcorner":"\u231D",
  "urcrop":"\u230E",
  "Uring":"\u016E",
  "uring":"\u016F",
  "urtri":"\u25F9",
  "Uscr":"\uD835\uDCB0",
  "uscr":"\uD835\uDCCA",
  "utdot":"\u22F0",
  "Utilde":"\u0168",
  "utilde":"\u0169",
  "utri":"\u25B5",
  "utrif":"\u25B4",
  "uuarr":"\u21C8",
  "Uuml":"\u00DC",
  "uuml":"\u00FC",
  "uwangle":"\u29A7",
  "vangrt":"\u299C",
  "varepsilon":"\u03F5",
  "varkappa":"\u03F0",
  "varnothing":"\u2205",
  "varphi":"\u03D5",
  "varpi":"\u03D6",
  "varpropto":"\u221D",
  "vArr":"\u21D5",
  "varr":"\u2195",
  "varrho":"\u03F1",
  "varsigma":"\u03C2",
  "varsubsetneq":"\u228A\uFE00",
  "varsubsetneqq":"\u2ACB\uFE00",
  "varsupsetneq":"\u228B\uFE00",
  "varsupsetneqq":"\u2ACC\uFE00",
  "vartheta":"\u03D1",
  "vartriangleleft":"\u22B2",
  "vartriangleright":"\u22B3",
  "Vbar":"\u2AEB",
  "vBar":"\u2AE8",
  "vBarv":"\u2AE9",
  "Vcy":"\u0412",
  "vcy":"\u0432",
  "VDash":"\u22AB",
  "Vdash":"\u22A9",
  "vDash":"\u22A8",
  "vdash":"\u22A2",
  "Vdashl":"\u2AE6",
  "Vee":"\u22C1",
  "vee":"\u2228",
  "veebar":"\u22BB",
  "veeeq":"\u225A",
  "vellip":"\u22EE",
  "Verbar":"\u2016",
  "verbar":"\u007C",
  "Vert":"\u2016",
  "vert":"\u007C",
  "VerticalBar":"\u2223",
  "VerticalLine":"\u007C",
  "VerticalSeparator":"\u2758",
  "VerticalTilde":"\u2240",
  "VeryThinSpace":"\u200A",
  "Vfr":"\uD835\uDD19",
  "vfr":"\uD835\uDD33",
  "vltri":"\u22B2",
  "vnsub":"\u2282\u20D2",
  "vnsup":"\u2283\u20D2",
  "Vopf":"\uD835\uDD4D",
  "vopf":"\uD835\uDD67",
  "vprop":"\u221D",
  "vrtri":"\u22B3",
  "Vscr":"\uD835\uDCB1",
  "vscr":"\uD835\uDCCB",
  "vsubnE":"\u2ACB\uFE00",
  "vsubne":"\u228A\uFE00",
  "vsupnE":"\u2ACC\uFE00",
  "vsupne":"\u228B\uFE00",
  "Vvdash":"\u22AA",
  "vzigzag":"\u299A",
  "Wcirc":"\u0174",
  "wcirc":"\u0175",
  "wedbar":"\u2A5F",
  "Wedge":"\u22C0",
  "wedge":"\u2227",
  "wedgeq":"\u2259",
  "weierp":"\u2118",
  "Wfr":"\uD835\uDD1A",
  "wfr":"\uD835\uDD34",
  "Wopf":"\uD835\uDD4E",
  "wopf":"\uD835\uDD68",
  "wp":"\u2118",
  "wr":"\u2240",
  "wreath":"\u2240",
  "Wscr":"\uD835\uDCB2",
  "wscr":"\uD835\uDCCC",
  "xcap":"\u22C2",
  "xcirc":"\u25EF",
  "xcup":"\u22C3",
  "xdtri":"\u25BD",
  "Xfr":"\uD835\uDD1B",
  "xfr":"\uD835\uDD35",
  "xhArr":"\u27FA",
  "xharr":"\u27F7",
  "Xi":"\u039E",
  "xi":"\u03BE",
  "xlArr":"\u27F8",
  "xlarr":"\u27F5",
  "xmap":"\u27FC",
  "xnis":"\u22FB",
  "xodot":"\u2A00",
  "Xopf":"\uD835\uDD4F",
  "xopf":"\uD835\uDD69",
  "xoplus":"\u2A01",
  "xotime":"\u2A02",
  "xrArr":"\u27F9",
  "xrarr":"\u27F6",
  "Xscr":"\uD835\uDCB3",
  "xscr":"\uD835\uDCCD",
  "xsqcup":"\u2A06",
  "xuplus":"\u2A04",
  "xutri":"\u25B3",
  "xvee":"\u22C1",
  "xwedge":"\u22C0",
  "Yacute":"\u00DD",
  "yacute":"\u00FD",
  "YAcy":"\u042F",
  "yacy":"\u044F",
  "Ycirc":"\u0176",
  "ycirc":"\u0177",
  "Ycy":"\u042B",
  "ycy":"\u044B",
  "yen":"\u00A5",
  "Yfr":"\uD835\uDD1C",
  "yfr":"\uD835\uDD36",
  "YIcy":"\u0407",
  "yicy":"\u0457",
  "Yopf":"\uD835\uDD50",
  "yopf":"\uD835\uDD6A",
  "Yscr":"\uD835\uDCB4",
  "yscr":"\uD835\uDCCE",
  "YUcy":"\u042E",
  "yucy":"\u044E",
  "Yuml":"\u0178",
  "yuml":"\u00FF",
  "Zacute":"\u0179",
  "zacute":"\u017A",
  "Zcaron":"\u017D",
  "zcaron":"\u017E",
  "Zcy":"\u0417",
  "zcy":"\u0437",
  "Zdot":"\u017B",
  "zdot":"\u017C",
  "zeetrf":"\u2128",
  "ZeroWidthSpace":"\u200B",
  "Zeta":"\u0396",
  "zeta":"\u03B6",
  "Zfr":"\u2128",
  "zfr":"\uD835\uDD37",
  "ZHcy":"\u0416",
  "zhcy":"\u0436",
  "zigrarr":"\u21DD",
  "Zopf":"\u2124",
  "zopf":"\uD835\uDD6B",
  "Zscr":"\uD835\uDCB5",
  "zscr":"\uD835\uDCCF",
  "zwj":"\u200D",
  "zwnj":"\u200C"
};

},{}],16:[function(require,module,exports){
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks

'use strict';

var html_blocks = {};

[
  'article',
  'aside',
  'button',
  'blockquote',
  'body',
  'canvas',
  'caption',
  'col',
  'colgroup',
  'dd',
  'div',
  'dl',
  'dt',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'iframe',
  'li',
  'map',
  'object',
  'ol',
  'output',
  'p',
  'pre',
  'progress',
  'script',
  'section',
  'style',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'tr',
  'thead',
  'ul',
  'video'
].forEach(function (name) { html_blocks[name] = true; });


module.exports = html_blocks;

},{}],17:[function(require,module,exports){
// Regexps to match html elements

'use strict';


function replace(regex, options) {
  regex = regex.source;
  options = options || '';

  return function self(name, val) {
    if (!name) {
      return new RegExp(regex, options);
    }
    val = val.source || val;
    regex = regex.replace(name, val);
    return self;
  };
}


var attr_name     = /[a-zA-Z_:][a-zA-Z0-9:._-]*/;

var unquoted      = /[^"'=<>`\x00-\x20]+/;
var single_quoted = /'[^']*'/;
var double_quoted = /"[^"]*"/;

/*eslint no-spaced-func:0*/
var attr_value  = replace(/(?:unquoted|single_quoted|double_quoted)/)
                    ('unquoted', unquoted)
                    ('single_quoted', single_quoted)
                    ('double_quoted', double_quoted)
                    ();

var attribute   = replace(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)
                    ('attr_name', attr_name)
                    ('attr_value', attr_value)
                    ();

var open_tag    = replace(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)
                    ('attribute', attribute)
                    ();

var close_tag   = /<\/[A-Za-z][A-Za-z0-9]*\s*>/;
var comment     = /<!--([^-]+|[-][^-]+)*-->/;
var processing  = /<[?].*?[?]>/;
var declaration = /<![A-Z]+\s+[^>]*>/;
var cdata       = /<!\[CDATA\[([^\]]+|\][^\]]|\]\][^>])*\]\]>/;

var HTML_TAG_RE = replace(/^(?:open_tag|close_tag|comment|processing|declaration|cdata)/)
  ('open_tag', open_tag)
  ('close_tag', close_tag)
  ('comment', comment)
  ('processing', processing)
  ('declaration', declaration)
  ('cdata', cdata)
  ();


module.exports.HTML_TAG_RE = HTML_TAG_RE;

},{}],18:[function(require,module,exports){
// List of valid url schemas, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#autolinks

'use strict';


module.exports = [
  'coap',
  'doi',
  'javascript',
  'aaa',
  'aaas',
  'about',
  'acap',
  'cap',
  'cid',
  'crid',
  'data',
  'dav',
  'dict',
  'dns',
  'file',
  'ftp',
  'geo',
  'go',
  'gopher',
  'h323',
  'http',
  'https',
  'iax',
  'icap',
  'im',
  'imap',
  'info',
  'ipp',
  'iris',
  'iris.beep',
  'iris.xpc',
  'iris.xpcs',
  'iris.lwz',
  'ldap',
  'mailto',
  'mid',
  'msrp',
  'msrps',
  'mtqp',
  'mupdate',
  'news',
  'nfs',
  'ni',
  'nih',
  'nntp',
  'opaquelocktoken',
  'pop',
  'pres',
  'rtsp',
  'service',
  'session',
  'shttp',
  'sieve',
  'sip',
  'sips',
  'sms',
  'snmp',
  'soap.beep',
  'soap.beeps',
  'tag',
  'tel',
  'telnet',
  'tftp',
  'thismessage',
  'tn3270',
  'tip',
  'tv',
  'urn',
  'vemmi',
  'ws',
  'wss',
  'xcon',
  'xcon-userid',
  'xmlrpc.beep',
  'xmlrpc.beeps',
  'xmpp',
  'z39.50r',
  'z39.50s',
  'adiumxtra',
  'afp',
  'afs',
  'aim',
  'apt',
  'attachment',
  'aw',
  'beshare',
  'bitcoin',
  'bolo',
  'callto',
  'chrome',
  'chrome-extension',
  'com-eventbrite-attendee',
  'content',
  'cvs',
  'dlna-playsingle',
  'dlna-playcontainer',
  'dtn',
  'dvb',
  'ed2k',
  'facetime',
  'feed',
  'finger',
  'fish',
  'gg',
  'git',
  'gizmoproject',
  'gtalk',
  'hcp',
  'icon',
  'ipn',
  'irc',
  'irc6',
  'ircs',
  'itms',
  'jar',
  'jms',
  'keyparc',
  'lastfm',
  'ldaps',
  'magnet',
  'maps',
  'market',
  'message',
  'mms',
  'ms-help',
  'msnim',
  'mumble',
  'mvn',
  'notes',
  'oid',
  'palm',
  'paparazzi',
  'platform',
  'proxy',
  'psyc',
  'query',
  'res',
  'resource',
  'rmi',
  'rsync',
  'rtmp',
  'secondlife',
  'sftp',
  'sgn',
  'skype',
  'smb',
  'soldat',
  'spotify',
  'ssh',
  'steam',
  'svn',
  'teamspeak',
  'things',
  'udp',
  'unreal',
  'ut2004',
  'ventrilo',
  'view-source',
  'webcal',
  'wtai',
  'wyciwyg',
  'xfire',
  'xri',
  'ymsgr'
];

},{}],19:[function(require,module,exports){
'use strict';

/**
 * Utility functions
 */

function typeOf(obj) {
  return Object.prototype.toString.call(obj);
}

function isString(obj) {
  return typeOf(obj) === '[object String]';
}

var hasOwn = Object.prototype.hasOwnProperty;

function has(object, key) {
  return object
    ? hasOwn.call(object, key)
    : false;
}

// Extend objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = [].slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be object');
    }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

////////////////////////////////////////////////////////////////////////////////

var UNESCAPE_MD_RE = /\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}

////////////////////////////////////////////////////////////////////////////////

function isValidEntityCode(c) {
  /*eslint no-bitwise:0*/
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
  // never used
  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
  // control codes
  if (c >= 0x00 && c <= 0x08) { return false; }
  if (c === 0x0B) { return false; }
  if (c >= 0x0E && c <= 0x1F) { return false; }
  if (c >= 0x7F && c <= 0x9F) { return false; }
  // out of range
  if (c > 0x10FFFF) { return false; }
  return true;
}

function fromCodePoint(c) {
  /*eslint no-bitwise:0*/
  if (c > 0xffff) {
    c -= 0x10000;
    var surrogate1 = 0xd800 + (c >> 10),
        surrogate2 = 0xdc00 + (c & 0x3ff);

    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}

var NAMED_ENTITY_RE   = /&([a-z#][a-z0-9]{1,31});/gi;
var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;
var entities = require('./entities');

function replaceEntityPattern(match, name) {
  var code = 0;

  if (has(entities, name)) {
    return entities[name];
  } else if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
    code = name[1].toLowerCase() === 'x' ?
      parseInt(name.slice(2), 16)
    :
      parseInt(name.slice(1), 10);
    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }
  }
  return match;
}

function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(NAMED_ENTITY_RE, replaceEntityPattern);
}

////////////////////////////////////////////////////////////////////////////////

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

////////////////////////////////////////////////////////////////////////////////

exports.assign            = assign;
exports.isString          = isString;
exports.has               = has;
exports.unescapeMd        = unescapeMd;
exports.isValidEntityCode = isValidEntityCode;
exports.fromCodePoint     = fromCodePoint;
exports.replaceEntities   = replaceEntities;
exports.escapeHtml        = escapeHtml;

},{"./entities":15}],20:[function(require,module,exports){
// Commonmark default options

'use strict';


module.exports = {
  options: {
    html:         true,         // Enable HTML tags in source
    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'block',
        'inline',
        'references',
        'abbr2'
      ]
    },

    block: {
      rules: [
        'blockquote',
        'code',
        'fences',
        'heading',
        'hr',
        'htmlblock',
        'lheading',
        'list',
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'emphasis',
        'entity',
        'escape',
        'htmltag',
        'links',
        'newline',
        'text'
      ]
    }
  }
};

},{}],21:[function(require,module,exports){
// Remarkable default options

'use strict';


module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'block',
        'inline',
        'references',
        'replacements',
        'linkify',
        'smartquotes',
        'references',
        'abbr2',
        'footnote_tail'
      ]
    },

    block: {
      rules: [
        'blockquote',
        'code',
        'fences',
        'heading',
        'hr',
        'htmlblock',
        'lheading',
        'list',
        'paragraph',
        'table'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'del',
        'emphasis',
        'entity',
        'escape',
        'footnote_ref',
        'htmltag',
        'links',
        'newline',
        'text'
      ]
    }
  }
};

},{}],22:[function(require,module,exports){
// Remarkable default options

'use strict';


module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes:       '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight:     null,

    maxNesting:    20            // Internal protection, recursion limit
  },

  components: {
    // Don't restrict core/block/inline rules
    core: {},
    block: {},
    inline: {}
  }
};

},{}],23:[function(require,module,exports){
'use strict';

var replaceEntities = require('../common/utils').replaceEntities;

module.exports = function normalizeLink(url) {
  var normalized = replaceEntities(url);
  // We shouldn't care about the result of malformed URIs,
  // and should not throw an exception.
  try {
    normalized = decodeURI(normalized);
  } catch (err) {}
  return encodeURI(normalized);
};

},{"../common/utils":19}],24:[function(require,module,exports){
'use strict';

module.exports = function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
};

},{}],25:[function(require,module,exports){
'use strict';


var normalizeLink = require('./normalize_link');
var unescapeMd    = require('../common/utils').unescapeMd;

/**
 * Parse link destination
 *
 *   - on success it returns a string and updates state.pos;
 *   - on failure it returns null
 *
 * @param  {Object} state
 * @param  {Number} pos
 * @api private
 */

module.exports = function parseLinkDestination(state, pos) {
  var code, level, link,
      start = pos,
      max = state.posMax;

  if (state.src.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = state.src.charCodeAt(pos);
      if (code === 0x0A /* \n */) { return false; }
      if (code === 0x3E /* > */) {
        link = normalizeLink(unescapeMd(state.src.slice(start + 1, pos)));
        if (!state.parser.validateLink(link)) { return false; }
        state.pos = pos + 1;
        state.linkContent = link;
        return true;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos += 2;
        continue;
      }

      pos++;
    }

    // no closing '>'
    return false;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = state.src.charCodeAt(pos);

    if (code === 0x20) { break; }

    // ascii control characters
    if (code < 0x20 || code === 0x7F) { break; }

    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
      if (level > 1) { break; }
    }

    if (code === 0x29 /* ) */) {
      level--;
      if (level < 0) { break; }
    }

    pos++;
  }

  if (start === pos) { return false; }

  link = normalizeLink(unescapeMd(state.src.slice(start, pos)));
  if (!state.parser.validateLink(link)) { return false; }

  state.linkContent = link;
  state.pos = pos;
  return true;
};

},{"../common/utils":19,"./normalize_link":23}],26:[function(require,module,exports){
'use strict';

/**
 * Parse link labels
 *
 * This function assumes that first character (`[`) already matches;
 * returns the end of the label.
 *
 * @param  {Object} state
 * @param  {Number} start
 * @api private
 */

module.exports = function parseLinkLabel(state, start) {
  var level, found, marker,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos,
      oldFlag = state.isInLabel;

  if (state.isInLabel) { return -1; }

  if (state.labelUnmatchedScopes) {
    state.labelUnmatchedScopes--;
    return -1;
  }

  state.pos = start + 1;
  state.isInLabel = true;
  level = 1;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 0x5B /* [ */) {
      level++;
    } else if (marker === 0x5D /* ] */) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }

    state.parser.skipToken(state);
  }

  if (found) {
    labelEnd = state.pos;
    state.labelUnmatchedScopes = 0;
  } else {
    state.labelUnmatchedScopes = level - 1;
  }

  // restore old state
  state.pos = oldPos;
  state.isInLabel = oldFlag;

  return labelEnd;
};

},{}],27:[function(require,module,exports){
'use strict';


var unescapeMd = require('../common/utils').unescapeMd;

/**
 * Parse link title
 *
 *   - on success it returns a string and updates state.pos;
 *   - on failure it returns null
 *
 * @param  {Object} state
 * @param  {Number} pos
 * @api private
 */

module.exports = function parseLinkTitle(state, pos) {
  var code,
      start = pos,
      max = state.posMax,
      marker = state.src.charCodeAt(pos);

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return false; }

  pos++;

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = state.src.charCodeAt(pos);
    if (code === marker) {
      state.pos = pos + 1;
      state.linkContent = unescapeMd(state.src.slice(start + 1, pos));
      return true;
    }
    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    pos++;
  }

  return false;
};

},{"../common/utils":19}],28:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var assign       = require('./common/utils').assign;
var Renderer     = require('./renderer');
var ParserCore   = require('./parser_core');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var Ruler        = require('./ruler');

/**
 * Preset configs
 */

var config = {
  'default':    require('./configs/default'),
  'full':       require('./configs/full'),
  'commonmark': require('./configs/commonmark')
};

/**
 * The `StateCore` class manages state.
 *
 * @param {Object} `self` Remarkable instance
 * @param {String} `str` Markdown string
 * @param {Object} `env`
 */

function StateCore(self, str, env) {
  this.src = str;
  this.env = env;
  this.options = self.options;
  this.tokens = [];
  this.inlineMode = false;

  this.inline = self.inline;
  this.block = self.block;
  this.renderer = self.renderer;
  this.typographer = self.typographer;
}

/**
 * The main `Remarkable` class. Create an instance of
 * `Remarkable` with a `preset` and/or `options`.
 *
 * @param {String} `preset` If no preset is given, `default` is used.
 * @param {Object} `options`
 */

function Remarkable(preset, options) {
  if (typeof preset !== 'string') {
    options = preset;
    preset = 'default';
  }

  this.inline   = new ParserInline();
  this.block    = new ParserBlock();
  this.core     = new ParserCore();
  this.renderer = new Renderer();
  this.ruler    = new Ruler();

  this.options  = {};
  this.configure(config[preset]);
  this.set(options || {});
}

/**
 * Set options as an alternative to passing them
 * to the constructor.
 *
 * ```js
 * md.set({typographer: true});
 * ```
 * @param {Object} `options`
 * @api public
 */

Remarkable.prototype.set = function (options) {
  assign(this.options, options);
};

/**
 * Batch loader for components rules states, and options
 *
 * @param  {Object} `presets`
 */

Remarkable.prototype.configure = function (presets) {
  var self = this;

  if (!presets) { throw new Error('Wrong `remarkable` preset, check name/content'); }
  if (presets.options) { self.set(presets.options); }
  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enable(presets.components[name].rules, true);
      }
    });
  }
};

/**
 * Use a plugin.
 *
 * ```js
 * var md = new Remarkable();
 *
 * md.use(plugin1)
 *   .use(plugin2, opts)
 *   .use(plugin3);
 * ```
 *
 * @param  {Function} `plugin`
 * @param  {Object} `options`
 * @return {Object} `Remarkable` for chaining
 */

Remarkable.prototype.use = function (plugin, options) {
  plugin(this, options);
  return this;
};


/**
 * Parse the input `string` and return a tokens array.
 * Modifies `env` with definitions data.
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {Array} Array of tokens
 */

Remarkable.prototype.parse = function (str, env) {
  var state = new StateCore(this, str, env);
  this.core.process(state);
  return state.tokens;
};

/**
 * The main `.render()` method that does all the magic :)
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {String} Rendered HTML.
 */

Remarkable.prototype.render = function (str, env) {
  env = env || {};
  return this.renderer.render(this.parse(str, env), this.options, env);
};

/**
 * Parse the given content `string` as a single string.
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {Array} Array of tokens
 */

Remarkable.prototype.parseInline = function (str, env) {
  var state = new StateCore(this, str, env);
  state.inlineMode = true;
  this.core.process(state);
  return state.tokens;
};

/**
 * Render a single content `string`, without wrapping it
 * to paragraphs
 *
 * @param  {String} `str`
 * @param  {Object} `env`
 * @return {String}
 */

Remarkable.prototype.renderInline = function (str, env) {
  env = env || {};
  return this.renderer.render(this.parseInline(str, env), this.options, env);
};

/**
 * Expose `Remarkable`
 */

module.exports = Remarkable;

/**
 * Expose `utils`, Useful helper functions for custom
 * rendering.
 */

module.exports.utils = require('./common/utils');

},{"./common/utils":19,"./configs/commonmark":20,"./configs/default":21,"./configs/full":22,"./parser_block":29,"./parser_core":30,"./parser_inline":31,"./renderer":32,"./ruler":33}],29:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var Ruler      = require('./ruler');
var StateBlock = require('./rules_block/state_block');

/**
 * Parser rules
 */

var _rules = [
  [ 'code',       require('./rules_block/code') ],
  [ 'fences',     require('./rules_block/fences'),     [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'blockquote', require('./rules_block/blockquote'), [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'hr',         require('./rules_block/hr'),         [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'list',       require('./rules_block/list'),       [ 'paragraph', 'blockquote' ] ],
  [ 'footnote',   require('./rules_block/footnote'),   [ 'paragraph' ] ],
  [ 'heading',    require('./rules_block/heading'),    [ 'paragraph', 'blockquote' ] ],
  [ 'lheading',   require('./rules_block/lheading') ],
  [ 'htmlblock',  require('./rules_block/htmlblock'),  [ 'paragraph', 'blockquote' ] ],
  [ 'table',      require('./rules_block/table'),      [ 'paragraph' ] ],
  [ 'deflist',    require('./rules_block/deflist'),    [ 'paragraph' ] ],
  [ 'paragraph',  require('./rules_block/paragraph') ]
];

/**
 * Block Parser class
 *
 * @api private
 */

function ParserBlock() {
  this.ruler = new Ruler();
  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1], {
      alt: (_rules[i][2] || []).slice()
    });
  }
}

/**
 * Generate tokens for the given input range.
 *
 * @param  {Object} `state` Has properties like `src`, `parser`, `options` etc
 * @param  {Number} `startLine`
 * @param  {Number} `endLine`
 * @api private
 */

ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var line = startLine;
  var hasEmptyLines = false;
  var ok, i;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) {
      break;
    }

    // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists
    if (state.tShift[line] < state.blkIndent) {
      break;
    }

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) {
        break;
      }
    }

    // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;

      // two empty lines should stop the parser in list mode
      if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) { break; }
      state.line = line;
    }
  }
};

var TABS_SCAN_RE = /[\n\t]/g;
var NEWLINES_RE  = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
var SPACES_RE    = /\u00a0/g;

/**
 * Tokenize the given `str`.
 *
 * @param  {String} `str` Source string
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @param  {Array} `outTokens`
 * @api private
 */

ParserBlock.prototype.parse = function (str, options, env, outTokens) {
  var state, lineStart = 0, lastTabPos = 0;
  if (!str) { return []; }

  // Normalize spaces
  str = str.replace(SPACES_RE, ' ');

  // Normalize newlines
  str = str.replace(NEWLINES_RE, '\n');

  // Replace tabs with proper number of spaces (1..4)
  if (str.indexOf('\t') >= 0) {
    str = str.replace(TABS_SCAN_RE, function (match, offset) {
      var result;
      if (str.charCodeAt(offset) === 0x0A) {
        lineStart = offset + 1;
        lastTabPos = 0;
        return match;
      }
      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
      lastTabPos = offset - lineStart + 1;
      return result;
    });
  }

  state = new StateBlock(str, this, options, env, outTokens);
  this.tokenize(state, state.line, state.lineMax);
};

/**
 * Expose `ParserBlock`
 */

module.exports = ParserBlock;

},{"./ruler":33,"./rules_block/blockquote":35,"./rules_block/code":36,"./rules_block/deflist":37,"./rules_block/fences":38,"./rules_block/footnote":39,"./rules_block/heading":40,"./rules_block/hr":41,"./rules_block/htmlblock":42,"./rules_block/lheading":43,"./rules_block/list":44,"./rules_block/paragraph":45,"./rules_block/state_block":46,"./rules_block/table":47}],30:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var Ruler = require('./ruler');

/**
 * Core parser `rules`
 */

var _rules = [
  [ 'block',          require('./rules_core/block')          ],
  [ 'abbr',           require('./rules_core/abbr')           ],
  [ 'references',     require('./rules_core/references')     ],
  [ 'inline',         require('./rules_core/inline')         ],
  [ 'footnote_tail',  require('./rules_core/footnote_tail')  ],
  [ 'abbr2',          require('./rules_core/abbr2')          ],
  [ 'replacements',   require('./rules_core/replacements')   ],
  [ 'smartquotes',    require('./rules_core/smartquotes')    ],
  [ 'linkify',        require('./rules_core/linkify')        ]
];

/**
 * Class for top level (`core`) parser rules
 *
 * @api private
 */

function Core() {
  this.options = {};
  this.ruler = new Ruler();
  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}

/**
 * Process rules with the given `state`
 *
 * @param  {Object} `state`
 * @api private
 */

Core.prototype.process = function (state) {
  var i, l, rules;
  rules = this.ruler.getRules('');
  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};

/**
 * Expose `Core`
 */

module.exports = Core;

},{"./ruler":33,"./rules_core/abbr":48,"./rules_core/abbr2":49,"./rules_core/block":50,"./rules_core/footnote_tail":51,"./rules_core/inline":52,"./rules_core/linkify":53,"./rules_core/references":54,"./rules_core/replacements":55,"./rules_core/smartquotes":56}],31:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var Ruler       = require('./ruler');
var StateInline = require('./rules_inline/state_inline');
var utils       = require('./common/utils');

/**
 * Inline Parser `rules`
 */

var _rules = [
  [ 'text',            require('./rules_inline/text') ],
  [ 'newline',         require('./rules_inline/newline') ],
  [ 'escape',          require('./rules_inline/escape') ],
  [ 'backticks',       require('./rules_inline/backticks') ],
  [ 'del',             require('./rules_inline/del') ],
  [ 'ins',             require('./rules_inline/ins') ],
  [ 'mark',            require('./rules_inline/mark') ],
  [ 'emphasis',        require('./rules_inline/emphasis') ],
  [ 'sub',             require('./rules_inline/sub') ],
  [ 'sup',             require('./rules_inline/sup') ],
  [ 'links',           require('./rules_inline/links') ],
  [ 'footnote_inline', require('./rules_inline/footnote_inline') ],
  [ 'footnote_ref',    require('./rules_inline/footnote_ref') ],
  [ 'autolink',        require('./rules_inline/autolink') ],
  [ 'htmltag',         require('./rules_inline/htmltag') ],
  [ 'entity',          require('./rules_inline/entity') ]
];

/**
 * Inline Parser class. Note that link validation is stricter
 * in Remarkable than what is specified by CommonMark. If you
 * want to change this you can use a custom validator.
 *
 * @api private
 */

function ParserInline() {
  this.ruler = new Ruler();
  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }

  // Can be overridden with a custom validator
  this.validateLink = validateLink;
}

/**
 * Skip a single token by running all rules in validation mode.
 * Returns `true` if any rule reports success.
 *
 * @param  {Object} `state`
 * @api privage
 */

ParserInline.prototype.skipToken = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var pos = state.pos;
  var i, cached_pos;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  for (i = 0; i < len; i++) {
    if (rules[i](state, true)) {
      state.cacheSet(pos, state.pos);
      return;
    }
  }

  state.pos++;
  state.cacheSet(pos, state.pos);
};

/**
 * Generate tokens for the given input range.
 *
 * @param  {Object} `state`
 * @api private
 */

ParserInline.prototype.tokenize = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var end = state.posMax;
  var ok, i;

  while (state.pos < end) {

    // Try all possible rules.
    // On success, the rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true
    for (i = 0; i < len; i++) {
      ok = rules[i](state, false);

      if (ok) {
        break;
      }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};

/**
 * Parse the given input string.
 *
 * @param  {String} `str`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @param  {Array} `outTokens`
 * @api private
 */

ParserInline.prototype.parse = function (str, options, env, outTokens) {
  var state = new StateInline(str, this, options, env, outTokens);
  this.tokenize(state);
};

/**
 * Validate the given `url` by checking for bad protocols.
 *
 * @param  {String} `url`
 * @return {Boolean}
 */

function validateLink(url) {
  var BAD_PROTOCOLS = [ 'vbscript', 'javascript', 'file' ];
  var str = url.trim().toLowerCase();
  // Care about digital entities "javascript&#x3A;alert(1)"
  str = utils.replaceEntities(str);
  if (str.indexOf(':') !== -1 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) !== -1) {
    return false;
  }
  return true;
}

/**
 * Expose `ParserInline`
 */

module.exports = ParserInline;

},{"./common/utils":19,"./ruler":33,"./rules_inline/autolink":57,"./rules_inline/backticks":58,"./rules_inline/del":59,"./rules_inline/emphasis":60,"./rules_inline/entity":61,"./rules_inline/escape":62,"./rules_inline/footnote_inline":63,"./rules_inline/footnote_ref":64,"./rules_inline/htmltag":65,"./rules_inline/ins":66,"./rules_inline/links":67,"./rules_inline/mark":68,"./rules_inline/newline":69,"./rules_inline/state_inline":70,"./rules_inline/sub":71,"./rules_inline/sup":72,"./rules_inline/text":73}],32:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var utils = require('./common/utils');
var rules = require('./rules');

/**
 * Expose `Renderer`
 */

module.exports = Renderer;

/**
 * Renderer class. Renders HTML and exposes `rules` to allow
 * local modifications.
 */

function Renderer() {
  this.rules = utils.assign({}, rules);

  // exported helper, for custom rules only
  this.getBreak = rules.getBreak;
}

/**
 * Render a string of inline HTML with the given `tokens` and
 * `options`.
 *
 * @param  {Array} `tokens`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @return {String}
 * @api public
 */

Renderer.prototype.renderInline = function (tokens, options, env) {
  var _rules = this.rules;
  var len = tokens.length, i = 0;
  var result = '';

  while (len--) {
    result += _rules[tokens[i].type](tokens, i++, options, env, this);
  }

  return result;
};

/**
 * Render a string of HTML with the given `tokens` and
 * `options`.
 *
 * @param  {Array} `tokens`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @return {String}
 * @api public
 */

Renderer.prototype.render = function (tokens, options, env) {
  var _rules = this.rules;
  var len = tokens.length, i = -1;
  var result = '';

  while (++i < len) {
    if (tokens[i].type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else {
      result += _rules[tokens[i].type](tokens, i, options, env, this);
    }
  }
  return result;
};

},{"./common/utils":19,"./rules":34}],33:[function(require,module,exports){
'use strict';

/**
 * Ruler is a helper class for building responsibility chains from
 * parse rules. It allows:
 *
 *   - easy stack rules chains
 *   - getting main chain and named chains content (as arrays of functions)
 *
 * Helper methods, should not be used directly.
 * @api private
 */

function Ruler() {
  // List of added rules. Each element is:
  //
  // { name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ] }
  //
  this.__rules__ = [];

  // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - digital anchor for fast filtering by charcodes.
  //
  this.__cache__ = null;
}

/**
 * Find the index of a rule by `name`.
 *
 * @param  {String} `name`
 * @return {Number} Index of the given `name`
 * @api private
 */

Ruler.prototype.__find__ = function (name) {
  var len = this.__rules__.length;
  var i = -1;

  while (len--) {
    if (this.__rules__[++i].name === name) {
      return i;
    }
  }
  return -1;
};

/**
 * Build the rules lookup cache
 *
 * @api private
 */

Ruler.prototype.__compile__ = function () {
  var self = this;
  var chains = [ '' ];

  // collect unique names
  self.__rules__.forEach(function (rule) {
    if (!rule.enabled) {
      return;
    }

    rule.alt.forEach(function (altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });

  self.__cache__ = {};

  chains.forEach(function (chain) {
    self.__cache__[chain] = [];
    self.__rules__.forEach(function (rule) {
      if (!rule.enabled) {
        return;
      }

      if (chain && rule.alt.indexOf(chain) < 0) {
        return;
      }
      self.__cache__[chain].push(rule.fn);
    });
  });
};

/**
 * Ruler public methods
 * ------------------------------------------------
 */

/**
 * Replace rule function
 *
 * @param  {String} `name` Rule name
 * @param  {Function `fn`
 * @param  {Object} `options`
 * @api private
 */

Ruler.prototype.at = function (name, fn, options) {
  var idx = this.__find__(name);
  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + name);
  }

  this.__rules__[idx].fn = fn;
  this.__rules__[idx].alt = opt.alt || [];
  this.__cache__ = null;
};

/**
 * Add a rule to the chain before given the `ruleName`.
 *
 * @param  {String}   `beforeName`
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @api private
 */

Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var idx = this.__find__(beforeName);
  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + beforeName);
  }

  this.__rules__.splice(idx, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Add a rule to the chain after the given `ruleName`.
 *
 * @param  {String}   `afterName`
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @api private
 */

Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var idx = this.__find__(afterName);
  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + afterName);
  }

  this.__rules__.splice(idx + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Add a rule to the end of chain.
 *
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @return {String}
 */

Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Enable a rule or list of rules.
 *
 * @param  {String|Array} `list` Name or array of rule names to enable
 * @param  {Boolean} `strict` If `true`, all non listed rules will be disabled.
 * @api private
 */

Ruler.prototype.enable = function (list, strict) {
  list = !Array.isArray(list)
    ? [ list ]
    : list;

  // In strict mode disable all existing rules first
  if (strict) {
    this.__rules__.forEach(function (rule) {
      rule.enabled = false;
    });
  }

  // Search by name and enable
  list.forEach(function (name) {
    var idx = this.__find__(name);
    if (idx < 0) {
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = true;
  }, this);

  this.__cache__ = null;
};


/**
 * Disable a rule or list of rules.
 *
 * @param  {String|Array} `list` Name or array of rule names to disable
 * @api private
 */

Ruler.prototype.disable = function (list) {
  list = !Array.isArray(list)
    ? [ list ]
    : list;

  // Search by name and disable
  list.forEach(function (name) {
    var idx = this.__find__(name);
    if (idx < 0) {
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = false;
  }, this);

  this.__cache__ = null;
};

/**
 * Get a rules list as an array of functions.
 *
 * @param  {String} `chainName`
 * @return {Object}
 * @api private
 */

Ruler.prototype.getRules = function (chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }
  return this.__cache__[chainName];
};

/**
 * Expose `Ruler`
 */

module.exports = Ruler;

},{}],34:[function(require,module,exports){
'use strict';

/**
 * Local dependencies
 */

var has             = require('./common/utils').has;
var unescapeMd      = require('./common/utils').unescapeMd;
var replaceEntities = require('./common/utils').replaceEntities;
var escapeHtml      = require('./common/utils').escapeHtml;

/**
 * Renderer rules cache
 */

var rules = {};

/**
 * Blockquotes
 */

rules.blockquote_open = function (/* tokens, idx, options, env */) {
  return '<blockquote>\n';
};

rules.blockquote_close = function (tokens, idx /*, options, env */) {
  return '</blockquote>' + getBreak(tokens, idx);
};

/**
 * Code
 */

rules.code = function (tokens, idx /*, options, env */) {
  if (tokens[idx].block) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>' + getBreak(tokens, idx);
  }
  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};

/**
 * Fenced code blocks
 */

rules.fence = function (tokens, idx, options, env, self) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix;
  var langName = '', fenceName;
  var highlighted;

  if (token.params) {

    //
    // ```foo bar
    //
    // Try custom renderer "foo" first. That will simplify overwrite
    // for diagrams, latex, and any other fenced block with custom look
    //

    fenceName = token.params.split(/\s+/g)[0];

    if (has(self.rules.fence_custom, fenceName)) {
      return self.rules.fence_custom[fenceName](tokens, idx, options, env, self);
    }

    langName = escapeHtml(replaceEntities(unescapeMd(fenceName)));
    langClass = ' class="' + langPrefix + langName + '"';
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  return '<pre><code' + langClass + '>'
        + highlighted
        + '</code></pre>'
        + getBreak(tokens, idx);
};

rules.fence_custom = {};

/**
 * Headings
 */

rules.heading_open = function (tokens, idx /*, options, env */) {
  return '<h' + tokens[idx].hLevel + '>';
};
rules.heading_close = function (tokens, idx /*, options, env */) {
  return '</h' + tokens[idx].hLevel + '>\n';
};

/**
 * Horizontal rules
 */

rules.hr = function (tokens, idx, options /*, env */) {
  return (options.xhtmlOut ? '<hr />' : '<hr>') + getBreak(tokens, idx);
};

/**
 * Bullets
 */

rules.bullet_list_open = function (/* tokens, idx, options, env */) {
  return '<ul>\n';
};
rules.bullet_list_close = function (tokens, idx /*, options, env */) {
  return '</ul>' + getBreak(tokens, idx);
};

/**
 * List items
 */

rules.list_item_open = function (/* tokens, idx, options, env */) {
  return '<li>';
};
rules.list_item_close = function (/* tokens, idx, options, env */) {
  return '</li>\n';
};

/**
 * Ordered list items
 */

rules.ordered_list_open = function (tokens, idx /*, options, env */) {
  var token = tokens[idx];
  var order = token.order > 1 ? ' start="' + token.order + '"' : '';
  return '<ol' + order + '>\n';
};
rules.ordered_list_close = function (tokens, idx /*, options, env */) {
  return '</ol>' + getBreak(tokens, idx);
};

/**
 * Paragraphs
 */

rules.paragraph_open = function (tokens, idx /*, options, env */) {
  return tokens[idx].tight ? '' : '<p>';
};
rules.paragraph_close = function (tokens, idx /*, options, env */) {
  var addBreak = !(tokens[idx].tight && idx && tokens[idx - 1].type === 'inline' && !tokens[idx - 1].content);
  return (tokens[idx].tight ? '' : '</p>') + (addBreak ? getBreak(tokens, idx) : '');
};

/**
 * Links
 */

rules.link_open = function (tokens, idx /*, options, env */) {
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  return '<a href="' + escapeHtml(tokens[idx].href) + '"' + title + '>';
};
rules.link_close = function (/* tokens, idx, options, env */) {
  return '</a>';
};

/**
 * Images
 */

rules.image = function (tokens, idx, options /*, env */) {
  var src = ' src="' + escapeHtml(tokens[idx].src) + '"';
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  var alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(tokens[idx].alt)) : '') + '"';
  var suffix = options.xhtmlOut ? ' /' : '';
  return '<img' + src + alt + title + suffix + '>';
};

/**
 * Tables
 */

rules.table_open = function (/* tokens, idx, options, env */) {
  return '<table>\n';
};
rules.table_close = function (/* tokens, idx, options, env */) {
  return '</table>\n';
};
rules.thead_open = function (/* tokens, idx, options, env */) {
  return '<thead>\n';
};
rules.thead_close = function (/* tokens, idx, options, env */) {
  return '</thead>\n';
};
rules.tbody_open = function (/* tokens, idx, options, env */) {
  return '<tbody>\n';
};
rules.tbody_close = function (/* tokens, idx, options, env */) {
  return '</tbody>\n';
};
rules.tr_open = function (/* tokens, idx, options, env */) {
  return '<tr>';
};
rules.tr_close = function (/* tokens, idx, options, env */) {
  return '</tr>\n';
};
rules.th_open = function (tokens, idx /*, options, env */) {
  var token = tokens[idx];
  return '<th'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.th_close = function (/* tokens, idx, options, env */) {
  return '</th>';
};
rules.td_open = function (tokens, idx /*, options, env */) {
  var token = tokens[idx];
  return '<td'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.td_close = function (/* tokens, idx, options, env */) {
  return '</td>';
};

/**
 * Bold
 */

rules.strong_open = function (/* tokens, idx, options, env */) {
  return '<strong>';
};
rules.strong_close = function (/* tokens, idx, options, env */) {
  return '</strong>';
};

/**
 * Italicize
 */

rules.em_open = function (/* tokens, idx, options, env */) {
  return '<em>';
};
rules.em_close = function (/* tokens, idx, options, env */) {
  return '</em>';
};

/**
 * Strikethrough
 */

rules.del_open = function (/* tokens, idx, options, env */) {
  return '<del>';
};
rules.del_close = function (/* tokens, idx, options, env */) {
  return '</del>';
};

/**
 * Insert
 */

rules.ins_open = function (/* tokens, idx, options, env */) {
  return '<ins>';
};
rules.ins_close = function (/* tokens, idx, options, env */) {
  return '</ins>';
};

/**
 * Highlight
 */

rules.mark_open = function (/* tokens, idx, options, env */) {
  return '<mark>';
};
rules.mark_close = function (/* tokens, idx, options, env */) {
  return '</mark>';
};

/**
 * Super- and sub-script
 */

rules.sub = function (tokens, idx /*, options, env */) {
  return '<sub>' + escapeHtml(tokens[idx].content) + '</sub>';
};
rules.sup = function (tokens, idx /*, options, env */) {
  return '<sup>' + escapeHtml(tokens[idx].content) + '</sup>';
};

/**
 * Breaks
 */

rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};

/**
 * Text
 */

rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};

/**
 * Content
 */

rules.htmlblock = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
rules.htmltag = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};

/**
 * Abbreviations, initialism
 */

rules.abbr_open = function (tokens, idx /*, options, env */) {
  return '<abbr title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '">';
};
rules.abbr_close = function (/* tokens, idx, options, env */) {
  return '</abbr>';
};

/**
 * Footnotes
 */

rules.footnote_ref = function (tokens, idx) {
  var n = Number(tokens[idx].id + 1).toString();
  var id = 'fnref' + n;
  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }
  return '<sup class="footnote-ref"><a href="#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
};
rules.footnote_block_open = function (tokens, idx, options) {
  var hr = options.xhtmlOut
    ? '<hr class="footnotes-sep" />\n'
    : '<hr class="footnotes-sep">\n';
  return  hr + '<section class="footnotes">\n<ol class="footnotes-list">\n';
};
rules.footnote_block_close = function () {
  return '</ol>\n</section>\n';
};
rules.footnote_open = function (tokens, idx) {
  var id = Number(tokens[idx].id + 1).toString();
  return '<li id="fn' + id + '"  class="footnote-item">';
};
rules.footnote_close = function () {
  return '</li>\n';
};
rules.footnote_anchor = function (tokens, idx) {
  var n = Number(tokens[idx].id + 1).toString();
  var id = 'fnref' + n;
  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }
  return ' <a href="#' + id + '" class="footnote-backref">↩</a>';
};

/**
 * Definition lists
 */

rules.dl_open = function() {
  return '<dl>\n';
};
rules.dt_open = function() {
  return '<dt>';
};
rules.dd_open = function() {
  return '<dd>';
};
rules.dl_close = function() {
  return '</dl>\n';
};
rules.dt_close = function() {
  return '</dt>\n';
};
rules.dd_close = function() {
  return '</dd>\n';
};

/**
 * Helper functions
 */

function nextToken(tokens, idx) {
  if (++idx >= tokens.length - 2) {
    return idx;
  }
  if ((tokens[idx].type === 'paragraph_open' && tokens[idx].tight) &&
      (tokens[idx + 1].type === 'inline' && tokens[idx + 1].content.length === 0) &&
      (tokens[idx + 2].type === 'paragraph_close' && tokens[idx + 2].tight)) {
    return nextToken(tokens, idx + 2);
  }
  return idx;
}

/**
 * Check to see if `\n` is needed before the next token.
 *
 * @param  {Array} `tokens`
 * @param  {Number} `idx`
 * @return {String} Empty string or newline
 * @api private
 */

var getBreak = rules.getBreak = function getBreak(tokens, idx) {
  idx = nextToken(tokens, idx);
  if (idx < tokens.length && tokens[idx].type === 'list_item_close') {
    return '';
  }
  return '\n';
};

/**
 * Expose `rules`
 */

module.exports = rules;

},{"./common/utils":19}],35:[function(require,module,exports){
// Block quotes

'use strict';


module.exports = function blockquote(state, startLine, endLine, silent) {
  var nextLine, lastLineEmpty, oldTShift, oldBMarks, oldIndent, oldParentType, lines,
      terminatorRules,
      i, l, terminate,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos > max) { return false; }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

  if (state.level >= state.options.maxNesting) { return false; }

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) { return true; }

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20) { pos++; }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  oldBMarks = [ state.bMarks[startLine] ];
  state.bMarks[startLine] = pos;

  // check if we have an empty blockquote
  pos = pos < max ? state.skipSpaces(pos) : pos;
  lastLineEmpty = pos >= max;

  oldTShift = [ state.tShift[startLine] ];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.parser.ruler.getRules('blockquote');

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E/* > */) {
      // This line is inside the blockquote.

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20) { pos++; }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      pos = pos < max ? state.skipSpaces(pos) : pos;
      lastLineEmpty = pos >= max;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) { break; }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    oldBMarks.push(state.bMarks[nextLine]);
    oldTShift.push(state.tShift[nextLine]);

    // A negative number means that this is a paragraph continuation;
    //
    // Any negative number will do the job here, but it's better for it
    // to be large enough to make any bugs obvious.
    state.tShift[nextLine] = -1337;
  }

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  state.tokens.push({
    type: 'blockquote_open',
    lines: lines = [ startLine, 0 ],
    level: state.level++
  });
  state.parser.tokenize(state, startLine, nextLine);
  state.tokens.push({
    type: 'blockquote_close',
    level: --state.level
  });
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
  }
  state.blkIndent = oldIndent;

  return true;
};

},{}],36:[function(require,module,exports){
// Code block (4 spaces padded)

'use strict';


module.exports = function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last;

  if (state.tShift[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }
    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'code',
    content: state.getLines(startLine, last, 4 + state.blkIndent, true),
    block: true,
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],37:[function(require,module,exports){
// Definition lists

'use strict';


// Search `[:~][\n ]`, returns next pos after marker on success
// or -1 on fail.
function skipMarker(state, line) {
  var pos, marker,
      start = state.bMarks[line] + state.tShift[line],
      max = state.eMarks[line];

  if (start >= max) { return -1; }

  // Check bullet
  marker = state.src.charCodeAt(start++);
  if (marker !== 0x7E/* ~ */ && marker !== 0x3A/* : */) { return -1; }

  pos = state.skipSpaces(start);

  // require space after ":"
  if (start === pos) { return -1; }

  // no empty definitions, e.g. "  : "
  if (pos >= max) { return -1; }

  return pos;
}

function markTightParagraphs(state, idx) {
  var i, l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].tight = true;
      state.tokens[i].tight = true;
      i += 2;
    }
  }
}

module.exports = function deflist(state, startLine, endLine, silent) {
  var contentStart,
      ddLine,
      dtLine,
      itemLines,
      listLines,
      listTokIdx,
      nextLine,
      oldIndent,
      oldDDIndent,
      oldParentType,
      oldTShift,
      oldTight,
      prevEmptyEnd,
      tight;

  if (silent) {
    // quirk: validation mode validates a dd block only, not a whole deflist
    if (state.ddIndent < 0) { return false; }
    return skipMarker(state, startLine) >= 0;
  }

  nextLine = startLine + 1;
  if (state.isEmpty(nextLine)) {
    if (++nextLine > endLine) { return false; }
  }

  if (state.tShift[nextLine] < state.blkIndent) { return false; }
  contentStart = skipMarker(state, nextLine);
  if (contentStart < 0) { return false; }

  if (state.level >= state.options.maxNesting) { return false; }

  // Start list
  listTokIdx = state.tokens.length;

  state.tokens.push({
    type: 'dl_open',
    lines: listLines = [ startLine, 0 ],
    level: state.level++
  });

  //
  // Iterate list items
  //

  dtLine = startLine;
  ddLine = nextLine;

  // One definition list can contain multiple DTs,
  // and one DT can be followed by multiple DDs.
  //
  // Thus, there is two loops here, and label is
  // needed to break out of the second one
  //
  /*eslint no-labels:0,block-scoped-var:0*/
  OUTER:
  for (;;) {
    tight = true;
    prevEmptyEnd = false;

    state.tokens.push({
      type: 'dt_open',
      lines: [ dtLine, dtLine ],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim(),
      level: state.level + 1,
      lines: [ dtLine, dtLine ],
      children: []
    });
    state.tokens.push({
      type: 'dt_close',
      level: --state.level
    });

    for (;;) {
      state.tokens.push({
        type: 'dd_open',
        lines: itemLines = [ nextLine, 0 ],
        level: state.level++
      });

      oldTight = state.tight;
      oldDDIndent = state.ddIndent;
      oldIndent = state.blkIndent;
      oldTShift = state.tShift[ddLine];
      oldParentType = state.parentType;
      state.blkIndent = state.ddIndent = state.tShift[ddLine] + 2;
      state.tShift[ddLine] = contentStart - state.bMarks[ddLine];
      state.tight = true;
      state.parentType = 'deflist';

      state.parser.tokenize(state, ddLine, endLine, true);

      // If any of list item is tight, mark list as tight
      if (!state.tight || prevEmptyEnd) {
        tight = false;
      }
      // Item become loose if finish with empty line,
      // but we should filter last element, because it means list finish
      prevEmptyEnd = (state.line - ddLine) > 1 && state.isEmpty(state.line - 1);

      state.tShift[ddLine] = oldTShift;
      state.tight = oldTight;
      state.parentType = oldParentType;
      state.blkIndent = oldIndent;
      state.ddIndent = oldDDIndent;

      state.tokens.push({
        type: 'dd_close',
        level: --state.level
      });

      itemLines[1] = nextLine = state.line;

      if (nextLine >= endLine) { break OUTER; }

      if (state.tShift[nextLine] < state.blkIndent) { break OUTER; }
      contentStart = skipMarker(state, nextLine);
      if (contentStart < 0) { break; }

      ddLine = nextLine;

      // go to the next loop iteration:
      // insert DD tag and repeat checking
    }

    if (nextLine >= endLine) { break; }
    dtLine = nextLine;

    if (state.isEmpty(dtLine)) { break; }
    if (state.tShift[dtLine] < state.blkIndent) { break; }

    ddLine = dtLine + 1;
    if (ddLine >= endLine) { break; }
    if (state.isEmpty(ddLine)) { ddLine++; }
    if (ddLine >= endLine) { break; }

    if (state.tShift[ddLine] < state.blkIndent) { break; }
    contentStart = skipMarker(state, ddLine);
    if (contentStart < 0) { break; }

    // go to the next loop iteration:
    // insert DT and DD tags and repeat checking
  }

  // Finilize list
  state.tokens.push({
    type: 'dl_close',
    level: --state.level
  });
  listLines[1] = nextLine;

  state.line = nextLine;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};

},{}],38:[function(require,module,exports){
// fences (``` lang, ~~~ lang)

'use strict';


module.exports = function fences(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  params = state.src.slice(pos, max).trim();

  if (params.indexOf('`') >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.tShift[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);
  state.tokens.push({
    type: 'fence',
    params: params,
    content: state.getLines(startLine + 1, nextLine, len, true),
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],39:[function(require,module,exports){
// Process footnote reference list

'use strict';


module.exports = function footnote(state, startLine, endLine, silent) {
  var oldBMark, oldTShift, oldParentType, pos, label,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // line should be at least 5 chars - "[^x]:"
  if (start + 4 > max) { return false; }

  if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) { return false; }
    if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
      break;
    }
  }

  if (pos === start + 2) { return false; } // no empty footnote labels
  if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A /* : */) { return false; }
  if (silent) { return true; }
  pos++;

  if (!state.env.footnotes) { state.env.footnotes = {}; }
  if (!state.env.footnotes.refs) { state.env.footnotes.refs = {}; }
  label = state.src.slice(start + 2, pos - 2);
  state.env.footnotes.refs[':' + label] = -1;

  state.tokens.push({
    type: 'footnote_reference_open',
    label: label,
    level: state.level++
  });

  oldBMark = state.bMarks[startLine];
  oldTShift = state.tShift[startLine];
  oldParentType = state.parentType;
  state.tShift[startLine] = state.skipSpaces(pos) - pos;
  state.bMarks[startLine] = pos;
  state.blkIndent += 4;
  state.parentType = 'footnote';

  if (state.tShift[startLine] < state.blkIndent) {
    state.tShift[startLine] += state.blkIndent;
    state.bMarks[startLine] -= state.blkIndent;
  }

  state.parser.tokenize(state, startLine, endLine, true);

  state.parentType = oldParentType;
  state.blkIndent -= 4;
  state.tShift[startLine] = oldTShift;
  state.bMarks[startLine] = oldBMark;

  state.tokens.push({
    type: 'footnote_reference_close',
    level: --state.level
  });

  return true;
};

},{}],40:[function(require,module,exports){
// heading (#, ##, ...)

'use strict';


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level, tmp,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos >= max) { return false; }

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && ch !== 0x20/* space */)) { return false; }

  if (silent) { return true; }

  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipCharsBack(max, 0x20, pos); // space
  tmp = state.skipCharsBack(max, 0x23, pos); // #
  if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20/* space */) {
    max = tmp;
  }

  state.line = startLine + 1;

  state.tokens.push({ type: 'heading_open',
    hLevel: level,
    lines: [ startLine, state.line ],
    level: state.level
  });

  // only if header is not empty
  if (pos < max) {
    state.tokens.push({
      type: 'inline',
      content: state.src.slice(pos, max).trim(),
      level: state.level + 1,
      lines: [ startLine, state.line ],
      children: []
    });
  }
  state.tokens.push({ type: 'heading_close', hLevel: level, level: state.level });

  return true;
};

},{}],41:[function(require,module,exports){
// Horizontal rule

'use strict';


module.exports = function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine];

  pos += state.tShift[startLine];

  if (pos > max) { return false; }

  marker = state.src.charCodeAt(pos++);

  // Check hr marker
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x5F/* _ */) {
    return false;
  }

  // markers can be mixed with spaces, but there should be at least 3 one

  cnt = 1;
  while (pos < max) {
    ch = state.src.charCodeAt(pos++);
    if (ch !== marker && ch !== 0x20/* space */) { return false; }
    if (ch === marker) { cnt++; }
  }

  if (cnt < 3) { return false; }

  if (silent) { return true; }

  state.line = startLine + 1;
  state.tokens.push({
    type: 'hr',
    lines: [ startLine, state.line ],
    level: state.level
  });

  return true;
};

},{}],42:[function(require,module,exports){
// HTML block

'use strict';


var block_names = require('../common/html_blocks');


var HTML_TAG_OPEN_RE = /^<([a-zA-Z]{1,15})[\s\/>]/;
var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z]{1,15})[\s>]/;

function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}

module.exports = function htmlblock(state, startLine, endLine, silent) {
  var ch, match, nextLine,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      shift = state.tShift[startLine];

  pos += shift;

  if (!state.options.html) { return false; }

  if (shift > 3 || pos + 2 >= max) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  ch = state.src.charCodeAt(pos + 1);

  if (ch === 0x21/* ! */ || ch === 0x3F/* ? */) {
    // Directive start / comment start / processing instruction start
    if (silent) { return true; }

  } else if (ch === 0x2F/* / */ || isLetter(ch)) {

    // Probably start or end of tag
    if (ch === 0x2F/* \ */) {
      // closing tag
      match = state.src.slice(pos, max).match(HTML_TAG_CLOSE_RE);
      if (!match) { return false; }
    } else {
      // opening tag
      match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);
      if (!match) { return false; }
    }
    // Make sure tag name is valid
    if (block_names[match[1].toLowerCase()] !== true) { return false; }
    if (silent) { return true; }

  } else {
    return false;
  }

  // If we are here - we detected HTML block.
  // Let's roll down till empty line (block end).
  nextLine = startLine + 1;
  while (nextLine < state.lineMax && !state.isEmpty(nextLine)) {
    nextLine++;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'htmlblock',
    level: state.level,
    lines: [ startLine, state.line ],
    content: state.getLines(startLine, nextLine, 0, true)
  });

  return true;
};

},{"../common/html_blocks":16}],43:[function(require,module,exports){
// lheading (---, ===)

'use strict';


module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var marker, pos, max,
      next = startLine + 1;

  if (next >= endLine) { return false; }
  if (state.tShift[next] < state.blkIndent) { return false; }

  // Scan next line

  if (state.tShift[next] - state.blkIndent > 3) { return false; }

  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  if (pos >= max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

  pos = state.skipChars(pos, marker);

  pos = state.skipSpaces(pos);

  if (pos < max) { return false; }

  pos = state.bMarks[startLine] + state.tShift[startLine];

  state.line = next + 1;
  state.tokens.push({
    type: 'heading_open',
    hLevel: marker === 0x3D/* = */ ? 1 : 2,
    lines: [ startLine, state.line ],
    level: state.level
  });
  state.tokens.push({
    type: 'inline',
    content: state.src.slice(pos, state.eMarks[startLine]).trim(),
    level: state.level + 1,
    lines: [ startLine, state.line - 1 ],
    children: []
  });
  state.tokens.push({
    type: 'heading_close',
    hLevel: marker === 0x3D/* = */ ? 1 : 2,
    level: state.level
  });

  return true;
};

},{}],44:[function(require,module,exports){
// Lists

'use strict';


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  if (pos >= max) { return -1; }

  marker = state.src.charCodeAt(pos++);
  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return -1;
  }

  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
    // " 1.test " - is not a list item
    return -1;
  }

  return pos;
}

// Search `\d+[.)][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

  for (;;) {
    // EOL -> fail
    if (pos >= max) { return -1; }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {
      continue;
    }

    // found valid marker
    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
      break;
    }

    return -1;
  }


  if (pos < max && state.src.charCodeAt(pos) !== 0x20/* space */) {
    // " 1.test " - is not a list item
    return -1;
  }
  return pos;
}

function markTightParagraphs(state, idx) {
  var i, l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].tight = true;
      state.tokens[i].tight = true;
      i += 2;
    }
  }
}


module.exports = function list(state, startLine, endLine, silent) {
  var nextLine,
      indent,
      oldTShift,
      oldIndent,
      oldTight,
      oldParentType,
      start,
      posAfterMarker,
      max,
      indentAfterMarker,
      markerValue,
      markerCharCode,
      isOrdered,
      contentStart,
      listTokIdx,
      prevEmptyEnd,
      listLines,
      itemLines,
      tight = true,
      terminatorRules,
      i, l, terminate;

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }

  if (state.level >= state.options.maxNesting) { return false; }

  // We should terminate list on style change. Remember first one to compare.
  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  listTokIdx = state.tokens.length;

  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    state.tokens.push({
      type: 'ordered_list_open',
      order: markerValue,
      lines: listLines = [ startLine, 0 ],
      level: state.level++
    });

  } else {
    state.tokens.push({
      type: 'bullet_list_open',
      lines: listLines = [ startLine, 0 ],
      level: state.level++
    });
  }

  //
  // Iterate list items
  //

  nextLine = startLine;
  prevEmptyEnd = false;
  terminatorRules = state.parser.ruler.getRules('list');

  while (nextLine < endLine) {
    contentStart = state.skipSpaces(posAfterMarker);
    max = state.eMarks[nextLine];

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = contentStart - posAfterMarker;
    }

    // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)
    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

    // If indent is less than 1, assume that it's one, example:
    //  "-\n  test"
    if (indentAfterMarker < 1) { indentAfterMarker = 1; }

    // "  -  test"
    //  ^^^^^ - calculating total length of this thing
    indent = (posAfterMarker - state.bMarks[nextLine]) + indentAfterMarker;

    // Run subparser & write tokens
    state.tokens.push({
      type: 'list_item_open',
      lines: itemLines = [ startLine, 0 ],
      level: state.level++
    });

    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldParentType = state.parentType;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.parentType = 'list';

    state.parser.tokenize(state, startLine, endLine, true);

    // If any of list item is tight, mark list as tight
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish
    prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.tight = oldTight;
    state.parentType = oldParentType;

    state.tokens.push({
      type: 'list_item_close',
      level: --state.level
    });

    nextLine = startLine = state.line;
    itemLines[1] = nextLine;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) { break; }

    if (state.isEmpty(nextLine)) {
      break;
    }

    //
    // Try to check if list is terminated or continued.
    //
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    // fail if terminating block found
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    // fail if list has another type
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
  }

  // Finilize list
  state.tokens.push({
    type: isOrdered ? 'ordered_list_close' : 'bullet_list_close',
    level: --state.level
  });
  listLines[1] = nextLine;

  state.line = nextLine;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};

},{}],45:[function(require,module,exports){
// Paragraph

'use strict';


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine, content, terminate, i, l,
      nextLine = startLine + 1,
      terminatorRules;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  if (nextLine < endLine && !state.isEmpty(nextLine)) {
    terminatorRules = state.parser.ruler.getRules('paragraph');

    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

      // Some tags can terminate paragraph without empty line.
      terminate = false;
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }
    }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;
  if (content.length) {
    state.tokens.push({
      type: 'paragraph_open',
      tight: false,
      lines: [ startLine, state.line ],
      level: state.level
    });
    state.tokens.push({
      type: 'inline',
      content: content,
      level: state.level + 1,
      lines: [ startLine, state.line ],
      children: []
    });
    state.tokens.push({
      type: 'paragraph_close',
      tight: false,
      level: state.level
    });
  }

  return true;
};

},{}],46:[function(require,module,exports){
// Parser state class

'use strict';


function StateBlock(src, parser, options, env, tokens) {
  var ch, s, start, pos, len, indent, indent_found;

  this.src = src;

  // Shortcuts to simplify nested calls
  this.parser = parser;

  this.options = options;

  this.env = env;

  //
  // Internal state vartiables
  //

  this.tokens = tokens;

  this.bMarks = [];  // line begin offsets for fast jumps
  this.eMarks = [];  // line end offsets for fast jumps
  this.tShift = [];  // indent for each line

  // block parser variables
  this.blkIndent  = 0; // required block content indent
                       // (for example, if we are in list)
  this.line       = 0; // line index in src
  this.lineMax    = 0; // lines count
  this.tight      = false;  // loose/tight mode for lists
  this.parentType = 'root'; // if `list`, block parser stops on two newlines
  this.ddIndent   = -1; // indent of the current dd block (-1 if there isn't any)

  this.level = 0;

  // renderer
  this.result = '';

  // Create caches
  // Generate markers.
  s = this.src;
  indent = 0;
  indent_found = false;

  for (start = pos = indent = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (ch === 0x20/* space */) {
        indent++;
        continue;
      } else {
        indent_found = true;
      }
    }

    if (ch === 0x0A || pos === len - 1) {
      if (ch !== 0x0A) { pos++; }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);

      indent_found = false;
      indent = 0;
      start = pos + 1;
    }
  }

  // Push fake entry to simplify cache bounds checks
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);

  this.lineMax = this.bMarks.length - 1; // don't count last fake line
}

StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};

// Skip spaces from given position.
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== 0x20/* space */) { break; }
  }
  return pos;
};

// Skip char codes from given position
StateBlock.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
};

// Skip char codes reverse from given position - 1
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
};

// cut lines range from source.
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i, first, last, queue, shift,
      line = begin;

  if (begin >= end) {
    return '';
  }

  // Opt: don't use push queue for single line;
  if (line + 1 === end) {
    first = this.bMarks[line] + Math.min(this.tShift[line], indent);
    last = keepLastLF ? this.bMarks[end] : this.eMarks[end - 1];
    return this.src.slice(first, last);
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    shift = this.tShift[line];
    if (shift > indent) { shift = indent; }
    if (shift < 0) { shift = 0; }

    first = this.bMarks[line] + shift;

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    queue[i] = this.src.slice(first, last);
  }

  return queue.join('');
};


module.exports = StateBlock;

},{}],47:[function(require,module,exports){
// GFM table, non-standard

'use strict';


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, rows,
      aligns, t, tableLines, tbodyLines;

  // should have at least three lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.tShift[nextLine] < state.blkIndent) { return false; }

  // first character of the second line should be '|' or '-'

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  lineText = getLine(state, startLine + 1);
  if (!/^[-:| ]+$/.test(lineText)) { return false; }

  rows = lineText.split('|');
  if (rows <= 2) { return false; }
  aligns = [];
  for (i = 0; i < rows.length; i++) {
    t = rows[i].trim();
    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === rows.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) { return false; }
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) { return false; }
  rows = lineText.replace(/^\||\|$/g, '').split('|');
  if (aligns.length !== rows.length) { return false; }
  if (silent) { return true; }

  state.tokens.push({
    type: 'table_open',
    lines: tableLines = [ startLine, 0 ],
    level: state.level++
  });
  state.tokens.push({
    type: 'thead_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });

  state.tokens.push({
    type: 'tr_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });
  for (i = 0; i < rows.length; i++) {
    state.tokens.push({
      type: 'th_open',
      align: aligns[i],
      lines: [ startLine, startLine + 1 ],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: rows[i].trim(),
      lines: [ startLine, startLine + 1 ],
      level: state.level,
      children: []
    });
    state.tokens.push({ type: 'th_close', level: --state.level });
  }
  state.tokens.push({ type: 'tr_close', level: --state.level });
  state.tokens.push({ type: 'thead_close', level: --state.level });

  state.tokens.push({
    type: 'tbody_open',
    lines: tbodyLines = [ startLine + 2, 0 ],
    level: state.level++
  });

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    rows = lineText.replace(/^\||\|$/g, '').split('|');

    state.tokens.push({ type: 'tr_open', level: state.level++ });
    for (i = 0; i < rows.length; i++) {
      state.tokens.push({ type: 'td_open', align: aligns[i], level: state.level++ });
      state.tokens.push({
        type: 'inline',
        content: rows[i].replace(/^\|? *| *\|?$/g, ''),
        level: state.level,
        children: []
      });
      state.tokens.push({ type: 'td_close', level: --state.level });
    }
    state.tokens.push({ type: 'tr_close', level: --state.level });
  }
  state.tokens.push({ type: 'tbody_close', level: --state.level });
  state.tokens.push({ type: 'table_close', level: --state.level });

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};

},{}],48:[function(require,module,exports){
// Parse abbreviation definitions, i.e. `*[abbr]: description`
//

'use strict';


var StateInline    = require('../rules_inline/state_inline');
var parseLinkLabel = require('../helpers/parse_link_label');


function parseAbbr(str, parserInline, options, env) {
  var state, labelEnd, pos, max, label, title;

  if (str.charCodeAt(0) !== 0x2A/* * */) { return -1; }
  if (str.charCodeAt(1) !== 0x5B/* [ */) { return -1; }

  if (str.indexOf(']:') === -1) { return -1; }

  state = new StateInline(str, parserInline, options, env, []);
  labelEnd = parseLinkLabel(state, 1);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return -1; }

  max = state.posMax;

  // abbr title is always one line, so looking for ending "\n" here
  for (pos = labelEnd + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x0A) { break; }
  }

  label = str.slice(2, labelEnd);
  title = str.slice(labelEnd + 2, pos).trim();
  if (title.length === 0) { return -1; }
  if (!env.abbreviations) { env.abbreviations = {}; }
  // prepend ':' to avoid conflict with Object.prototype members
  if (typeof env.abbreviations[':' + label] === 'undefined') {
    env.abbreviations[':' + label] = title;
  }

  return pos;
}

module.exports = function abbr(state) {
  var tokens = state.tokens, i, l, content, pos;

  if (state.inlineMode) {
    return;
  }

  // Parse inlines
  for (i = 1, l = tokens.length - 1; i < l; i++) {
    if (tokens[i - 1].type === 'paragraph_open' &&
        tokens[i].type === 'inline' &&
        tokens[i + 1].type === 'paragraph_close') {

      content = tokens[i].content;
      while (content.length) {
        pos = parseAbbr(content, state.inline, state.options, state.env);
        if (pos < 0) { break; }
        content = content.slice(pos).trim();
      }

      tokens[i].content = content;
      if (!content.length) {
        tokens[i - 1].tight = true;
        tokens[i + 1].tight = true;
      }
    }
  }
};

},{"../helpers/parse_link_label":26,"../rules_inline/state_inline":70}],49:[function(require,module,exports){
// Enclose abbreviations in <abbr> tags
//
'use strict';


var PUNCT_CHARS = ' \n()[]\'".,!?-';


// from Google closure library
// http://closure-library.googlecode.com/git-history/docs/local_closure_goog_string_string.js.source.html#line1021
function regEscape(s) {
  return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');
}


module.exports = function abbr2(state) {
  var i, j, l, tokens, token, text, nodes, pos, level, reg, m, regText,
      blockTokens = state.tokens;

  if (!state.env.abbreviations) { return; }
  if (!state.env.abbrRegExp) {
    regText = '(^|[' + PUNCT_CHARS.split('').map(regEscape).join('') + '])'
            + '(' + Object.keys(state.env.abbreviations).map(function (x) {
                      return x.substr(1);
                    }).sort(function (a, b) {
                      return b.length - a.length;
                    }).map(regEscape).join('|') + ')'
            + '($|[' + PUNCT_CHARS.split('').map(regEscape).join('') + '])';
    state.env.abbrRegExp = new RegExp(regText, 'g');
  }
  reg = state.env.abbrRegExp;

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') { continue; }
    tokens = blockTokens[j].children;

    // We scan from the end, to keep position when new tags added.
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];
      if (token.type !== 'text') { continue; }

      pos = 0;
      text = token.content;
      reg.lastIndex = 0;
      level = token.level;
      nodes = [];

      while ((m = reg.exec(text))) {
        if (reg.lastIndex > pos) {
          nodes.push({
            type: 'text',
            content: text.slice(pos, m.index + m[1].length),
            level: level
          });
        }

        nodes.push({
          type: 'abbr_open',
          title: state.env.abbreviations[':' + m[2]],
          level: level++
        });
        nodes.push({
          type: 'text',
          content: m[2],
          level: level
        });
        nodes.push({
          type: 'abbr_close',
          level: --level
        });
        pos = reg.lastIndex - m[3].length;
      }

      if (!nodes.length) { continue; }

      if (pos < text.length) {
        nodes.push({
          type: 'text',
          content: text.slice(pos),
          level: level
        });
      }

      // replace current node
      blockTokens[j].children = tokens = [].concat(tokens.slice(0, i), nodes, tokens.slice(i + 1));
    }
  }
};

},{}],50:[function(require,module,exports){
'use strict';

module.exports = function block(state) {

  if (state.inlineMode) {
    state.tokens.push({
      type: 'inline',
      content: state.src.replace(/\n/g, ' ').trim(),
      level: 0,
      lines: [ 0, 1 ],
      children: []
    });

  } else {
    state.block.parse(state.src, state.options, state.env, state.tokens);
  }
};

},{}],51:[function(require,module,exports){
'use strict';


module.exports = function footnote_block(state) {
  var i, l, j, t, lastParagraph, list, tokens, current, currentLabel,
      level = 0,
      insideRef = false,
      refTokens = {};

  if (!state.env.footnotes) { return; }

  state.tokens = state.tokens.filter(function(tok) {
    if (tok.type === 'footnote_reference_open') {
      insideRef = true;
      current = [];
      currentLabel = tok.label;
      return false;
    }
    if (tok.type === 'footnote_reference_close') {
      insideRef = false;
      // prepend ':' to avoid conflict with Object.prototype members
      refTokens[':' + currentLabel] = current;
      return false;
    }
    if (insideRef) { current.push(tok); }
    return !insideRef;
  });

  if (!state.env.footnotes.list) { return; }
  list = state.env.footnotes.list;

  state.tokens.push({
    type: 'footnote_block_open',
    level: level++
  });
  for (i = 0, l = list.length; i < l; i++) {
    state.tokens.push({
      type: 'footnote_open',
      id: i,
      level: level++
    });

    if (list[i].tokens) {
      tokens = [];
      tokens.push({
        type: 'paragraph_open',
        tight: false,
        level: level++
      });
      tokens.push({
        type: 'inline',
        content: '',
        level: level,
        children: list[i].tokens
      });
      tokens.push({
        type: 'paragraph_close',
        tight: false,
        level: --level
      });
    } else if (list[i].label) {
      tokens = refTokens[':' + list[i].label];
    }

    state.tokens = state.tokens.concat(tokens);
    if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
      lastParagraph = state.tokens.pop();
    } else {
      lastParagraph = null;
    }

    t = list[i].count > 0 ? list[i].count : 1;
    for (j = 0; j < t; j++) {
      state.tokens.push({
        type: 'footnote_anchor',
        id: i,
        subId: j,
        level: level
      });
    }

    if (lastParagraph) {
      state.tokens.push(lastParagraph);
    }

    state.tokens.push({
      type: 'footnote_close',
      level: --level
    });
  }
  state.tokens.push({
    type: 'footnote_block_close',
    level: --level
  });
};

},{}],52:[function(require,module,exports){
'use strict';

module.exports = function inline(state) {
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.inline.parse(tok.content, state.options, state.env, tok.children);
    }
  }
};

},{}],53:[function(require,module,exports){
// Replace link-like texts with link nodes.
//
// Currently restricted by `inline.validateLink()` to http/https/ftp
//
'use strict';


var Autolinker = require('autolinker');


var LINK_SCAN_RE = /www|@|\:\/\//;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}

// Stupid fabric to avoid singletons, for thread safety.
// Required for engines like Nashorn.
//
function createLinkifier() {
  var links = [];
  var autolinker = new Autolinker({
    stripPrefix: false,
    url: true,
    email: true,
    twitter: false,
    replaceFn: function (autolinker, match) {
      // Only collect matched strings but don't change anything.
      switch (match.getType()) {
        /*eslint default-case:0*/
        case 'url':
          links.push({
            text: match.matchedText,
            url: match.getUrl()
          });
          break;
        case 'email':
          links.push({
            text: match.matchedText,
            // normalize email protocol
            url: 'mailto:' + match.getEmail().replace(/^mailto:/i, '')
          });
          break;
      }
      return false;
    }
  });

  return {
    links: links,
    autolinker: autolinker
  };
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, text, nodes, ln, pos, level, htmlLinkLevel,
      blockTokens = state.tokens,
      linkifier = null, links, autolinker;

  if (!state.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') { continue; }
    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      // Skip content of markdown links
      if (token.type === 'link_close') {
        i--;
        while (tokens[i].level !== token.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (token.type === 'htmltag') {
        if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(token.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (token.type === 'text' && LINK_SCAN_RE.test(token.content)) {

        // Init linkifier in lazy manner, only if required.
        if (!linkifier) {
          linkifier = createLinkifier();
          links = linkifier.links;
          autolinker = linkifier.autolinker;
        }

        text = token.content;
        links.length = 0;
        autolinker.link(text);

        if (!links.length) { continue; }

        // Now split string to nodes
        nodes = [];
        level = token.level;

        for (ln = 0; ln < links.length; ln++) {

          if (!state.inline.validateLink(links[ln].url)) { continue; }

          pos = text.indexOf(links[ln].text);

          if (pos) {
            level = level;
            nodes.push({
              type: 'text',
              content: text.slice(0, pos),
              level: level
            });
          }
          nodes.push({
            type: 'link_open',
            href: links[ln].url,
            title: '',
            level: level++
          });
          nodes.push({
            type: 'text',
            content: links[ln].text,
            level: level
          });
          nodes.push({
            type: 'link_close',
            level: --level
          });
          text = text.slice(pos + links[ln].text.length);
        }
        if (text.length) {
          nodes.push({
            type: 'text',
            content: text,
            level: level
          });
        }

        // replace current node
        blockTokens[j].children = tokens = [].concat(tokens.slice(0, i), nodes, tokens.slice(i + 1));
      }
    }
  }
};

},{"autolinker":74}],54:[function(require,module,exports){
'use strict';


var StateInline          = require('../rules_inline/state_inline');
var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../helpers/normalize_reference');


function parseReference(str, parser, options, env) {
  var state, labelEnd, pos, max, code, start, href, title, label;

  if (str.charCodeAt(0) !== 0x5B/* [ */) { return -1; }

  if (str.indexOf(']:') === -1) { return -1; }

  state = new StateInline(str, parser, options, env, []);
  labelEnd = parseLinkLabel(state, 0);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return -1; }

  max = state.posMax;

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  if (!parseLinkDestination(state, pos)) { return -1; }
  href = state.linkContent;
  pos = state.pos;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (pos = pos + 1; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  if (pos < max && start !== pos && parseLinkTitle(state, pos)) {
    title = state.linkContent;
    pos = state.pos;
  } else {
    title = '';
    pos = start;
  }

  // ensure that the end of the line is empty
  while (pos < max && state.src.charCodeAt(pos) === 0x20/* space */) { pos++; }
  if (pos < max && state.src.charCodeAt(pos) !== 0x0A) { return -1; }

  label = normalizeReference(str.slice(1, labelEnd));
  if (typeof env.references[label] === 'undefined') {
    env.references[label] = { title: title, href: href };
  }

  return pos;
}


module.exports = function references(state) {
  var tokens = state.tokens, i, l, content, pos;

  state.env.references = state.env.references || {};

  if (state.inlineMode) {
    return;
  }

  // Scan definitions in paragraph inlines
  for (i = 1, l = tokens.length - 1; i < l; i++) {
    if (tokens[i].type === 'inline' &&
        tokens[i - 1].type === 'paragraph_open' &&
        tokens[i + 1].type === 'paragraph_close') {

      content = tokens[i].content;
      while (content.length) {
        pos = parseReference(content, state.inline, state.options, state.env);
        if (pos < 0) { break; }
        content = content.slice(pos).trim();
      }

      tokens[i].content = content;
      if (!content.length) {
        tokens[i - 1].tight = true;
        tokens[i + 1].tight = true;
      }
    }
  }
};

},{"../helpers/normalize_reference":24,"../helpers/parse_link_destination":25,"../helpers/parse_link_label":26,"../helpers/parse_link_title":27,"../rules_inline/state_inline":70}],55:[function(require,module,exports){
// Simple typographical replacements
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  'c': '©',
  'r': '®',
  'p': '§',
  'tm': '™'
};

function replaceScopedAbbr(str) {
  if (str.indexOf('(') < 0) { return str; }

  return str.replace(SCOPED_ABBR_RE, function(match, name) {
    return SCOPED_ABBR[name.toLowerCase()];
  });
}


module.exports = function replace(state) {
  var i, token, text, inlineTokens, blkIdx;

  if (!state.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    inlineTokens = state.tokens[blkIdx].children;

    for (i = inlineTokens.length - 1; i >= 0; i--) {
      token = inlineTokens[i];
      if (token.type === 'text') {
        text = token.content;

        text = replaceScopedAbbr(text);

        if (RARE_RE.test(text)) {
          text = text
            .replace(/\+-/g, '±')
            // .., ..., ....... -> …
            // but ?..... & !..... -> ?.. & !..
            .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
            .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
            // em-dash
            .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
            // en-dash
            .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
            .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
        }

        token.content = text;
      }
    }
  }
};

},{}],56:[function(require,module,exports){
// Convert straight quotation marks to typographic ones
//
'use strict';


var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var PUNCT_RE = /[-\s()\[\]]/;
var APOSTROPHE = '’';

// This function returns true if the character at `pos`
// could be inside a word.
function isLetter(str, pos) {
  if (pos < 0 || pos >= str.length) { return false; }
  return !PUNCT_RE.test(str[pos]);
}


function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}


module.exports = function smartquotes(state) {
  /*eslint max-depth:0*/
  var i, token, text, t, pos, max, thisLevel, lastSpace, nextSpace, item,
      canOpen, canClose, j, isSingle, blkIdx, tokens,
      stack;

  if (!state.options.typographer) { return; }

  stack = [];

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    tokens = state.tokens[blkIdx].children;
    stack.length = 0;

    for (i = 0; i < tokens.length; i++) {
      token = tokens[i];

      if (token.type !== 'text' || QUOTE_TEST_RE.test(token.text)) { continue; }

      thisLevel = tokens[i].level;

      for (j = stack.length - 1; j >= 0; j--) {
        if (stack[j].level <= thisLevel) { break; }
      }
      stack.length = j + 1;

      text = token.content;
      pos = 0;
      max = text.length;

      /*eslint no-labels:0,block-scoped-var:0*/
      OUTER:
      while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        t = QUOTE_RE.exec(text);
        if (!t) { break; }

        lastSpace = !isLetter(text, t.index - 1);
        pos = t.index + 1;
        isSingle = (t[0] === "'");
        nextSpace = !isLetter(text, pos);

        if (!nextSpace && !lastSpace) {
          // middle of word
          if (isSingle) {
            token.content = replaceAt(token.content, t.index, APOSTROPHE);
          }
          continue;
        }

        canOpen = !nextSpace;
        canClose = !lastSpace;

        if (canClose) {
          // this could be a closing quote, rewind the stack to get a match
          for (j = stack.length - 1; j >= 0; j--) {
            item = stack[j];
            if (stack[j].level < thisLevel) { break; }
            if (item.single === isSingle && stack[j].level === thisLevel) {
              item = stack[j];
              if (isSingle) {
                tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, state.options.quotes[2]);
                token.content = replaceAt(token.content, t.index, state.options.quotes[3]);
              } else {
                tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, state.options.quotes[0]);
                token.content = replaceAt(token.content, t.index, state.options.quotes[1]);
              }
              stack.length = j;
              continue OUTER;
            }
          }
        }

        if (canOpen) {
          stack.push({
            token: i,
            pos: t.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
      }
    }
  }
};

},{}],57:[function(require,module,exports){
// Process autolinks '<protocol:...>'

'use strict';

var url_schemas   = require('../common/url_schemas');
var normalizeLink = require('../helpers/normalize_link');


/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  linkMatch = tail.match(AUTOLINK_RE);

  if (linkMatch) {
    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) { return false; }

    url = linkMatch[0].slice(1, -1);
    fullUrl = normalizeLink(url);
    if (!state.parser.validateLink(url)) { return false; }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({ type: 'link_close', level: state.level });
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  emailMatch = tail.match(EMAIL_RE);

  if (emailMatch) {

    url = emailMatch[0].slice(1, -1);

    fullUrl = normalizeLink('mailto:' + url);
    if (!state.parser.validateLink(fullUrl)) { return false; }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({ type: 'link_close', level: state.level });
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};

},{"../common/url_schemas":18,"../helpers/normalize_link":23}],58:[function(require,module,exports){
// Parse backticks

'use strict';

module.exports = function backticks(state, silent) {
  var start, max, marker, matchStart, matchEnd,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        state.push({
          type: 'code',
          content: state.src.slice(pos, matchStart)
                              .replace(/[ \n]+/g, ' ')
                              .trim(),
          block: false,
          level: state.level
        });
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};

},{}],59:[function(require,module,exports){
// Process ~~deleted text~~

'use strict';

module.exports = function del(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 4 >= max) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x7E/* ~ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x7E/* ~ */) { return false; }
  if (nextChar === 0x7E/* ~ */) { return false; }
  if (nextChar === 0x20 || nextChar === 0x0A) { return false; }

  pos = start + 2;
  while (pos < max && state.src.charCodeAt(pos) === 0x7E/* ~ */) { pos++; }
  if (pos > start + 3) {
    // sequence of 4+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;
    if (!silent) { state.pending += state.src.slice(start, pos); }
    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x7E/* ~ */) {
      if (state.src.charCodeAt(state.pos + 1) === 0x7E/* ~ */) {
        lastChar = state.src.charCodeAt(state.pos - 1);
        nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;
        if (nextChar !== 0x7E/* ~ */ && lastChar !== 0x7E/* ~ */) {
          if (lastChar !== 0x20 && lastChar !== 0x0A) {
            // closing '~~'
            stack--;
          } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
            // opening '~~'
            stack++;
          } // else {
            //  // standalone ' ~~ ' indented with spaces
            // }
          if (stack <= 0) {
            found = true;
            break;
          }
        }
      }
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({ type: 'del_open', level: state.level++ });
    state.parser.tokenize(state);
    state.push({ type: 'del_close', level: --state.level });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};

},{}],60:[function(require,module,exports){
// Process *this* and _that_

'use strict';


function isAlphaNum(code) {
  return (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) ||
         (code >= 0x41 /* A */ && code <= 0x5A /* Z */) ||
         (code >= 0x61 /* a */ && code <= 0x7A /* z */);
}

// parse sequence of emphasis markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  var pos = start, lastChar, nextChar, count,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { can_open = false; }
  count = pos - start;

  if (count >= 4) {
    // sequence of four or more unescaped markers can't start/end an emphasis
    can_open = can_close = false;
  } else {
    nextChar = pos < max ? state.src.charCodeAt(pos) : -1;

    // check whitespace conditions
    if (nextChar === 0x20 || nextChar === 0x0A) { can_open = false; }
    if (lastChar === 0x20 || lastChar === 0x0A) { can_close = false; }

    if (marker === 0x5F /* _ */) {
      // check if we aren't inside the word
      if (isAlphaNum(lastChar)) { can_open = false; }
      if (isAlphaNum(nextChar)) { can_close = false; }
    }
  }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}

module.exports = function emphasis(state, silent) {
  var startCount,
      count,
      found,
      oldCount,
      newCount,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x5F/* _ */ && marker !== 0x2A /* * */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode

  res = scanDelims(state, start);
  startCount = res.delims;
  if (!res.can_open) {
    state.pos += startCount;
    if (!silent) { state.pending += state.src.slice(start, state.pos); }
    return true;
  }

  if (state.level >= state.options.maxNesting) { return false; }

  state.pos = start + startCount;
  stack = [ startCount ];

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;
      if (res.can_close) {
        oldCount = stack.pop();
        newCount = count;

        while (oldCount !== newCount) {
          if (newCount < oldCount) {
            stack.push(oldCount - newCount);
            break;
          }

          // assert(newCount > oldCount)
          newCount -= oldCount;

          if (stack.length === 0) { break; }
          state.pos += oldCount;
          oldCount = stack.pop();
        }

        if (stack.length === 0) {
          startCount = oldCount;
          found = true;
          break;
        }
        state.pos += count;
        continue;
      }

      if (res.can_open) { stack.push(count); }
      state.pos += count;
      continue;
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + startCount;

  if (!silent) {
    if (startCount === 2 || startCount === 3) {
      state.push({ type: 'strong_open', level: state.level++ });
    }
    if (startCount === 1 || startCount === 3) {
      state.push({ type: 'em_open', level: state.level++ });
    }

    state.parser.tokenize(state);

    if (startCount === 1 || startCount === 3) {
      state.push({ type: 'em_close', level: --state.level });
    }
    if (startCount === 2 || startCount === 3) {
      state.push({ type: 'strong_close', level: --state.level });
    }
  }

  state.pos = state.posMax + startCount;
  state.posMax = max;
  return true;
};

},{}],61:[function(require,module,exports){
// Process html entity - &#123;, &#xAF;, &quot;, ...

'use strict';

var entities          = require('../common/entities');
var has               = require('../common/utils').has;
var isValidEntityCode = require('../common/utils').isValidEntityCode;
var fromCodePoint     = require('../common/utils').fromCodePoint;


var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
var NAMED_RE   = /^&([a-z][a-z0-9]{1,31});/i;


module.exports = function entity(state, silent) {
  var ch, code, match, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

  if (pos + 1 < max) {
    ch = state.src.charCodeAt(pos + 1);

    if (ch === 0x23 /* # */) {
      match = state.src.slice(pos).match(DIGITAL_RE);
      if (match) {
        if (!silent) {
          code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
          state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
        }
        state.pos += match[0].length;
        return true;
      }
    } else {
      match = state.src.slice(pos).match(NAMED_RE);
      if (match) {
        if (has(entities, match[1])) {
          if (!silent) { state.pending += entities[match[1]]; }
          state.pos += match[0].length;
          return true;
        }
      }
    }
  }

  if (!silent) { state.pending += '&'; }
  state.pos++;
  return true;
};

},{"../common/entities":15,"../common/utils":19}],62:[function(require,module,exports){
// Proceess escaped chars and hardbreaks

'use strict';

var ESCAPED = [];

for (var i = 0; i < 256; i++) { ESCAPED.push(0); }

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
  .split('').forEach(function(ch) { ESCAPED[ch.charCodeAt(0)] = 1; });


module.exports = function escape(state, silent) {
  var ch, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ch < 256 && ESCAPED[ch] !== 0) {
      if (!silent) { state.pending += state.src[pos]; }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      }

      pos++;
      // skip leading whitespaces from next line
      while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) { state.pending += '\\'; }
  state.pos++;
  return true;
};

},{}],63:[function(require,module,exports){
// Process inline footnotes (^[...])

'use strict';

var parseLinkLabel = require('../helpers/parse_link_label');


module.exports = function footnote_inline(state, silent) {
  var labelStart,
      labelEnd,
      footnoteId,
      oldLength,
      max = state.posMax,
      start = state.pos;

  if (start + 2 >= max) { return false; }
  if (state.src.charCodeAt(start) !== 0x5E/* ^ */) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x5B/* [ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  labelStart = start + 2;
  labelEnd = parseLinkLabel(state, start + 1);

  // parser failed to find ']', so it's not a valid note
  if (labelEnd < 0) { return false; }

  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    if (!state.env.footnotes) { state.env.footnotes = {}; }
    if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
    footnoteId = state.env.footnotes.list.length;

    state.pos = labelStart;
    state.posMax = labelEnd;

    state.push({
      type: 'footnote_ref',
      id: footnoteId,
      level: state.level
    });
    state.linkLevel++;
    oldLength = state.tokens.length;
    state.parser.tokenize(state);
    state.env.footnotes.list[footnoteId] = { tokens: state.tokens.splice(oldLength) };
    state.linkLevel--;
  }

  state.pos = labelEnd + 1;
  state.posMax = max;
  return true;
};

},{"../helpers/parse_link_label":26}],64:[function(require,module,exports){
// Process footnote references ([^...])

'use strict';


module.exports = function footnote_ref(state, silent) {
  var label,
      pos,
      footnoteId,
      footnoteSubId,
      max = state.posMax,
      start = state.pos;

  // should be at least 4 chars - "[^x]"
  if (start + 3 > max) { return false; }

  if (!state.env.footnotes || !state.env.footnotes.refs) { return false; }
  if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) { return false; }
    if (state.src.charCodeAt(pos) === 0x0A) { return false; }
    if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
      break;
    }
  }

  if (pos === start + 2) { return false; } // no empty footnote labels
  if (pos >= max) { return false; }
  pos++;

  label = state.src.slice(start + 2, pos - 1);
  if (typeof state.env.footnotes.refs[':' + label] === 'undefined') { return false; }

  if (!silent) {
    if (!state.env.footnotes.list) { state.env.footnotes.list = []; }

    if (state.env.footnotes.refs[':' + label] < 0) {
      footnoteId = state.env.footnotes.list.length;
      state.env.footnotes.list[footnoteId] = { label: label, count: 0 };
      state.env.footnotes.refs[':' + label] = footnoteId;
    } else {
      footnoteId = state.env.footnotes.refs[':' + label];
    }

    footnoteSubId = state.env.footnotes.list[footnoteId].count;
    state.env.footnotes.list[footnoteId].count++;

    state.push({
      type: 'footnote_ref',
      id: footnoteId,
      subId: footnoteSubId,
      level: state.level
    });
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{}],65:[function(require,module,exports){
// Process html tags

'use strict';


var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function htmltag(state, silent) {
  var ch, match, max, pos = state.pos;

  if (!state.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (ch !== 0x21/* ! */ &&
      ch !== 0x3F/* ? */ &&
      ch !== 0x2F/* / */ &&
      !isLetter(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match) { return false; }

  if (!silent) {
    state.push({
      type: 'htmltag',
      content: state.src.slice(pos, pos + match[0].length),
      level: state.level
    });
  }
  state.pos += match[0].length;
  return true;
};

},{"../common/html_re":17}],66:[function(require,module,exports){
// Process ++inserted text++

'use strict';

module.exports = function ins(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x2B/* + */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 4 >= max) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x2B/* + */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x2B/* + */) { return false; }
  if (nextChar === 0x2B/* + */) { return false; }
  if (nextChar === 0x20 || nextChar === 0x0A) { return false; }

  pos = start + 2;
  while (pos < max && state.src.charCodeAt(pos) === 0x2B/* + */) { pos++; }
  if (pos !== start + 2) {
    // sequence of 3+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;
    if (!silent) { state.pending += state.src.slice(start, pos); }
    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x2B/* + */) {
      if (state.src.charCodeAt(state.pos + 1) === 0x2B/* + */) {
        lastChar = state.src.charCodeAt(state.pos - 1);
        nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;
        if (nextChar !== 0x2B/* + */ && lastChar !== 0x2B/* + */) {
          if (lastChar !== 0x20 && lastChar !== 0x0A) {
            // closing '++'
            stack--;
          } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
            // opening '++'
            stack++;
          } // else {
            //  // standalone ' ++ ' indented with spaces
            // }
          if (stack <= 0) {
            found = true;
            break;
          }
        }
      }
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({ type: 'ins_open', level: state.level++ });
    state.parser.tokenize(state);
    state.push({ type: 'ins_close', level: --state.level });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};

},{}],67:[function(require,module,exports){
// Process [links](<to> "stuff")

'use strict';

var parseLinkLabel       = require('../helpers/parse_link_label');
var parseLinkDestination = require('../helpers/parse_link_destination');
var parseLinkTitle       = require('../helpers/parse_link_title');
var normalizeReference   = require('../helpers/normalize_reference');


module.exports = function links(state, silent) {
  var labelStart,
      labelEnd,
      label,
      href,
      title,
      pos,
      ref,
      code,
      isImage = false,
      oldPos = state.pos,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker === 0x21/* ! */) {
    isImage = true;
    marker = state.src.charCodeAt(++start);
  }

  if (marker !== 0x5B/* [ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  labelStart = start + 1;
  labelEnd = parseLinkLabel(state, start);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    if (parseLinkDestination(state, pos)) {
      href = state.linkContent;
      pos = state.pos;
    } else {
      href = '';
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    if (pos < max && start !== pos && parseLinkTitle(state, pos)) {
      title = state.linkContent;
      pos = state.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (code !== 0x20 && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //

    // do not allow nested reference links
    if (state.linkLevel > 0) { return false; }

    // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (code !== 0x20 && code !== 0x0A) { break; }
    }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = start - 1;
      }
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    if (isImage) {
      state.push({
        type: 'image',
        src: href,
        title: title,
        alt: state.src.substr(labelStart, labelEnd - labelStart),
        level: state.level
      });
    } else {
      state.push({
        type: 'link_open',
        href: href,
        title: title,
        level: state.level++
      });
      state.linkLevel++;
      state.parser.tokenize(state);
      state.linkLevel--;
      state.push({ type: 'link_close', level: --state.level });
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

},{"../helpers/normalize_reference":24,"../helpers/parse_link_destination":25,"../helpers/parse_link_label":26,"../helpers/parse_link_title":27}],68:[function(require,module,exports){
// Process ==highlighted text==

'use strict';

module.exports = function del(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x3D/* = */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 4 >= max) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x3D/* = */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x3D/* = */) { return false; }
  if (nextChar === 0x3D/* = */) { return false; }
  if (nextChar === 0x20 || nextChar === 0x0A) { return false; }

  pos = start + 2;
  while (pos < max && state.src.charCodeAt(pos) === 0x3D/* = */) { pos++; }
  if (pos !== start + 2) {
    // sequence of 3+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;
    if (!silent) { state.pending += state.src.slice(start, pos); }
    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x3D/* = */) {
      if (state.src.charCodeAt(state.pos + 1) === 0x3D/* = */) {
        lastChar = state.src.charCodeAt(state.pos - 1);
        nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;
        if (nextChar !== 0x3D/* = */ && lastChar !== 0x3D/* = */) {
          if (lastChar !== 0x20 && lastChar !== 0x0A) {
            // closing '=='
            stack--;
          } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
            // opening '=='
            stack++;
          } // else {
            //  // standalone ' == ' indented with spaces
            // }
          if (stack <= 0) {
            found = true;
            break;
          }
        }
      }
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({ type: 'mark_open', level: state.level++ });
    state.parser.tokenize(state);
    state.push({ type: 'mark_close', level: --state.level });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};

},{}],69:[function(require,module,exports){
// Proceess '\n'

'use strict';

module.exports = function newline(state, silent) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
        state.pending = state.pending.replace(/ +$/, '');
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push({
          type: 'softbreak',
          level: state.level
        });
      }

    } else {
      state.push({
        type: 'softbreak',
        level: state.level
      });
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

  state.pos = pos;
  return true;
};

},{}],70:[function(require,module,exports){
// Inline parser state

'use strict';


function StateInline(src, parserInline, options, env, outTokens) {
  this.src = src;
  this.env = env;
  this.options = options;
  this.parser = parserInline;
  this.tokens = outTokens;
  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = '';
  this.pendingLevel = 0;

  this.cache = [];        // Stores { start: end } pairs. Useful for backtrack
                          // optimization of pairs parse (emphasis, strikes).

  // Link parser state vars

  this.isInLabel = false; // Set true when seek link label - we should disable
                          // "paired" rules (emphasis, strikes) to not skip
                          // tailing `]`

  this.linkLevel = 0;     // Increment for each nesting link. Used to prevent
                          // nesting in definitions

  this.linkContent = '';  // Temporary storage for link url

  this.labelUnmatchedScopes = 0; // Track unpaired `[` for link labels
                                 // (backtrack optimization)
}


// Flush pending text
//
StateInline.prototype.pushPending = function () {
  this.tokens.push({
    type: 'text',
    content: this.pending,
    level: this.pendingLevel
  });
  this.pending = '';
};


// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (token) {
  if (this.pending) {
    this.pushPending();
  }

  this.tokens.push(token);
  this.pendingLevel = this.level;
};


// Store value to cache.
// !!! Implementation has parser-specific optimizations
// !!! keys MUST be integer, >= 0; values MUST be integer, > 0
//
StateInline.prototype.cacheSet = function (key, val) {
  for (var i = this.cache.length; i <= key; i++) {
    this.cache.push(0);
  }

  this.cache[key] = val;
};


// Get cache value
//
StateInline.prototype.cacheGet = function (key) {
  return key < this.cache.length ? this.cache[key] : 0;
};


module.exports = StateInline;

},{}],71:[function(require,module,exports){
// Process ~subscript~

'use strict';

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

module.exports = function sub(state, silent) {
  var found,
      content,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x7E/* ~ */) {
      found = true;
      break;
    }

    state.parser.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos);

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  if (!silent) {
    state.push({
      type: 'sub',
      level: state.level,
      content: content.replace(UNESCAPE_RE, '$1')
    });
  }

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
};

},{}],72:[function(require,module,exports){
// Process ^superscript^

'use strict';

// same as UNESCAPE_MD_RE plus a space
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

module.exports = function sup(state, silent) {
  var found,
      content,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== 0x5E/* ^ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode
  if (start + 2 >= max) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x5E/* ^ */) {
      found = true;
      break;
    }

    state.parser.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos);

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  if (!silent) {
    state.push({
      type: 'sup',
      level: state.level,
      content: content.replace(UNESCAPE_RE, '$1')
    });
  }

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
};

},{}],73:[function(require,module,exports){
// Skip text characters for text token, place those to pending buffer
// and increment current pos

'use strict';


// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

function isTerminatorChar(ch) {
  switch (ch) {
    case 0x0A/* \n */:
    case 0x5C/* \ */:
    case 0x60/* ` */:
    case 0x2A/* * */:
    case 0x5F/* _ */:
    case 0x5E/* ^ */:
    case 0x5B/* [ */:
    case 0x5D/* ] */:
    case 0x21/* ! */:
    case 0x26/* & */:
    case 0x3C/* < */:
    case 0x3E/* > */:
    case 0x7B/* { */:
    case 0x7D/* } */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x40/* @ */:
    case 0x7E/* ~ */:
    case 0x2B/* + */:
    case 0x3D/* = */:
    case 0x3A/* : */:
      return true;
    default:
      return false;
  }
}

module.exports = function text(state, silent) {
  var pos = state.pos;

  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }

  if (pos === state.pos) { return false; }

  if (!silent) { state.pending += state.src.slice(state.pos, pos); }

  state.pos = pos;

  return true;
};

},{}],74:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Autolinker'] = factory();
  }
}(this, function () {

	/*!
	 * Autolinker.js
	 * 0.15.2
	 *
	 * Copyright(c) 2015 Gregory Jacobs <greg@greg-jacobs.com>
	 * MIT Licensed. http://www.opensource.org/licenses/mit-license.php
	 *
	 * https://github.com/gregjacobs/Autolinker.js
	 */
	/**
	 * @class Autolinker
	 * @extends Object
	 * 
	 * Utility class used to process a given string of text, and wrap the URLs, email addresses, and Twitter handles in 
	 * the appropriate anchor (&lt;a&gt;) tags to turn them into links.
	 * 
	 * Any of the configuration options may be provided in an Object (map) provided to the Autolinker constructor, which
	 * will configure how the {@link #link link()} method will process the links.
	 * 
	 * For example:
	 * 
	 *     var autolinker = new Autolinker( {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *     
	 *     var html = autolinker.link( "Joe went to www.yahoo.com" );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 * 
	 * 
	 * The {@link #static-link static link()} method may also be used to inline options into a single call, which may
	 * be more convenient for one-off uses. For example:
	 * 
	 *     var html = Autolinker.link( "Joe went to www.yahoo.com", {
	 *         newWindow : false,
	 *         truncate  : 30
	 *     } );
	 *     // produces: 'Joe went to <a href="http://www.yahoo.com">yahoo.com</a>'
	 * 
	 * 
	 * ## Custom Replacements of Links
	 * 
	 * If the configuration options do not provide enough flexibility, a {@link #replaceFn} may be provided to fully customize
	 * the output of Autolinker. This function is called once for each URL/Email/Twitter handle match that is encountered.
	 * 
	 * For example:
	 * 
	 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
	 *     
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *         
	 *             switch( match.getType() ) {
	 *                 case 'url' : 
	 *                     console.log( "url: ", match.getUrl() );
	 *                     
	 *                     if( match.getUrl().indexOf( 'mysite.com' ) === -1 ) {
	 *                         var tag = autolinker.getTagBuilder().build( match );  // returns an `Autolinker.HtmlTag` instance, which provides mutator methods for easy changes
	 *                         tag.setAttr( 'rel', 'nofollow' );
	 *                         tag.addClass( 'external-link' );
	 *                         
	 *                         return tag;
	 *                         
	 *                     } else {
	 *                         return true;  // let Autolinker perform its normal anchor tag replacement
	 *                     }
	 *                     
	 *                 case 'email' :
	 *                     var email = match.getEmail();
	 *                     console.log( "email: ", email );
	 *                     
	 *                     if( email === "my@own.address" ) {
	 *                         return false;  // don't auto-link this particular email address; leave as-is
	 *                     } else {
	 *                         return;  // no return value will have Autolinker perform its normal anchor tag replacement (same as returning `true`)
	 *                     }
	 *                 
	 *                 case 'twitter' :
	 *                     var twitterHandle = match.getTwitterHandle();
	 *                     console.log( twitterHandle );
	 *                     
	 *                     return '<a href="http://newplace.to.link.twitter.handles.to/">' + twitterHandle + '</a>';
	 *             }
	 *         }
	 *     } );
	 * 
	 * 
	 * The function may return the following values:
	 * 
	 * - `true` (Boolean): Allow Autolinker to replace the match as it normally would.
	 * - `false` (Boolean): Do not replace the current match at all - leave as-is.
	 * - Any String: If a string is returned from the function, the string will be used directly as the replacement HTML for
	 *   the match.
	 * - An {@link Autolinker.HtmlTag} instance, which can be used to build/modify an HTML tag before writing out its HTML text.
	 * 
	 * @constructor
	 * @param {Object} [config] The configuration options for the Autolinker instance, specified in an Object (map).
	 */
	var Autolinker = function( cfg ) {
		Autolinker.Util.assign( this, cfg );  // assign the properties of `cfg` onto the Autolinker instance. Prototype properties will be used for missing configs.

		this.matchValidator = new Autolinker.MatchValidator();
	};


	Autolinker.prototype = {
		constructor : Autolinker,  // fix constructor property

		/**
		 * @cfg {Boolean} urls
		 * 
		 * `true` if miscellaneous URLs should be automatically linked, `false` if they should not be.
		 */
		urls : true,

		/**
		 * @cfg {Boolean} email
		 * 
		 * `true` if email addresses should be automatically linked, `false` if they should not be.
		 */
		email : true,

		/**
		 * @cfg {Boolean} twitter
		 * 
		 * `true` if Twitter handles ("@example") should be automatically linked, `false` if they should not be.
		 */
		twitter : true,

		/**
		 * @cfg {Boolean} newWindow
		 * 
		 * `true` if the links should open in a new window, `false` otherwise.
		 */
		newWindow : true,

		/**
		 * @cfg {Boolean} stripPrefix
		 * 
		 * `true` if 'http://' or 'https://' and/or the 'www.' should be stripped from the beginning of URL links' text, 
		 * `false` otherwise.
		 */
		stripPrefix : true,

		/**
		 * @cfg {Number} truncate
		 * 
		 * A number for how many characters long URLs/emails/twitter handles should be truncated to inside the text of 
		 * a link. If the URL/email/twitter is over this number of characters, it will be truncated to this length by 
		 * adding a two period ellipsis ('..') to the end of the string.
		 * 
		 * For example: A url like 'http://www.yahoo.com/some/long/path/to/a/file' truncated to 25 characters might look
		 * something like this: 'yahoo.com/some/long/pat..'
		 */

		/**
		 * @cfg {String} className
		 * 
		 * A CSS class name to add to the generated links. This class will be added to all links, as well as this class
		 * plus url/email/twitter suffixes for styling url/email/twitter links differently.
		 * 
		 * For example, if this config is provided as "myLink", then:
		 * 
		 * - URL links will have the CSS classes: "myLink myLink-url"
		 * - Email links will have the CSS classes: "myLink myLink-email", and
		 * - Twitter links will have the CSS classes: "myLink myLink-twitter"
		 */
		className : "",

		/**
		 * @cfg {Function} replaceFn
		 * 
		 * A function to individually process each URL/Email/Twitter match found in the input string.
		 * 
		 * See the class's description for usage.
		 * 
		 * This function is called with the following parameters:
		 * 
		 * @cfg {Autolinker} replaceFn.autolinker The Autolinker instance, which may be used to retrieve child objects from (such
		 *   as the instance's {@link #getTagBuilder tag builder}).
		 * @cfg {Autolinker.match.Match} replaceFn.match The Match instance which can be used to retrieve information about the
		 *   {@link Autolinker.match.Url URL}/{@link Autolinker.match.Email email}/{@link Autolinker.match.Twitter Twitter}
		 *   match that the `replaceFn` is currently processing.
		 */


		/**
		 * @private
		 * @property {RegExp} htmlCharacterEntitiesRegex
		 *
		 * The regular expression that matches common HTML character entities.
		 * 
		 * Ignoring &amp; as it could be part of a query string -- handling it separately.
		 */
		htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,

		/**
		 * @private
		 * @property {RegExp} matcherRegex
		 * 
		 * The regular expression that matches URLs, email addresses, and Twitter handles.
		 * 
		 * This regular expression has the following capturing groups:
		 * 
		 * 1. Group that is used to determine if there is a Twitter handle match (i.e. \@someTwitterUser). Simply check for its 
		 *    existence to determine if there is a Twitter handle match. The next couple of capturing groups give information 
		 *    about the Twitter handle match.
		 * 2. The whitespace character before the \@sign in a Twitter handle. This is needed because there are no lookbehinds in
		 *    JS regular expressions, and can be used to reconstruct the original string in a replace().
		 * 3. The Twitter handle itself in a Twitter match. If the match is '@someTwitterUser', the handle is 'someTwitterUser'.
		 * 4. Group that matches an email address. Used to determine if the match is an email address, as well as holding the full 
		 *    address. Ex: 'me@my.com'
		 * 5. Group that matches a URL in the input text. Ex: 'http://google.com', 'www.google.com', or just 'google.com'.
		 *    This also includes a path, url parameters, or hash anchors. Ex: google.com/path/to/file?q1=1&q2=2#myAnchor
		 * 6. Group that matches a protocol URL (i.e. 'http://google.com'). This is used to match protocol URLs with just a single
		 *    word, like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * 7. A protocol-relative ('//') match for the case of a 'www.' prefixed URL. Will be an empty string if it is not a 
		 *    protocol-relative match. We need to know the character before the '//' in order to determine if it is a valid match
		 *    or the // was in a string we don't want to auto-link.
		 * 8. A protocol-relative ('//') match for the case of a known TLD prefixed URL. Will be an empty string if it is not a 
		 *    protocol-relative match. See #6 for more info. 
		 */
		matcherRegex : (function() {
			var twitterRegex = /(^|[^\w])@(\w{1,15})/,              // For matching a twitter handle. Ex: @gregory_jacobs

			    emailRegex = /(?:[\-;:&=\+\$,\w\.]+@)/,             // something@ for email addresses (a.k.a. local-part)

			    protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,  // match protocol, allow in format "http://" or "mailto:". However, do not match the first part of something like 'link:http://www.google.com' (i.e. don't match "link:"). Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a protocol here (i.e. ignore a trailing port number in this regex)
			    wwwRegex = /(?:www\.)/,                             // starting with 'www.'
			    domainNameRegex = /[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,  // anything looking at all like a domain, non-unicode domains, not ending in a period
			    tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,   // match our known top level domains (TLDs)

			    // Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
			    // http://blog.codinghorror.com/the-problem-with-urls/
			    urlSuffixRegex = /[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/;

			return new RegExp( [
				'(',  // *** Capturing group $1, which can be used to check for a twitter handle match. Use group $3 for the actual twitter handle though. $2 may be used to reconstruct the original string in a replace() 
					// *** Capturing group $2, which matches the whitespace character before the '@' sign (needed because of no lookbehinds), and 
					// *** Capturing group $3, which matches the actual twitter handle
					twitterRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $4, which is used to determine an email match
					emailRegex.source,
					domainNameRegex.source,
					tldRegex.source,
				')',

				'|',

				'(',  // *** Capturing group $5, which is used to match a URL
					'(?:', // parens to cover match for protocol (optional), and domain
						'(',  // *** Capturing group $6, for a protocol-prefixed url (ex: http://google.com)
							protocolRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
							'(.?//)?',  // *** Capturing group $7 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							wwwRegex.source,
							domainNameRegex.source,
						')',

						'|',

						'(?:',  // non-capturing paren for known a TLD url (ex: google.com)
							'(.?//)?',  // *** Capturing group $8 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
							domainNameRegex.source,
							tldRegex.source,
						')',
					')',

					'(?:' + urlSuffixRegex.source + ')?',  // match for path, query string, and/or hash anchor - optional
				')'
			].join( "" ), 'gi' );
		} )(),

		/**
		 * @private
		 * @property {RegExp} charBeforeProtocolRelMatchRegex
		 * 
		 * The regular expression used to retrieve the character before a protocol-relative URL match.
		 * 
		 * This is used in conjunction with the {@link #matcherRegex}, which needs to grab the character before a protocol-relative
		 * '//' due to the lack of a negative look-behind in JavaScript regular expressions. The character before the match is stripped
		 * from the URL.
		 */
		charBeforeProtocolRelMatchRegex : /^(.)?\/\//,

		/**
		 * @private
		 * @property {Autolinker.MatchValidator} matchValidator
		 * 
		 * The MatchValidator object, used to filter out any false positives from the {@link #matcherRegex}. See
		 * {@link Autolinker.MatchValidator} for details.
		 */

		/**
		 * @private
		 * @property {Autolinker.HtmlParser} htmlParser
		 * 
		 * The HtmlParser instance used to skip over HTML tags, while finding text nodes to process. This is lazily instantiated
		 * in the {@link #getHtmlParser} method.
		 */

		/**
		 * @private
		 * @property {Autolinker.AnchorTagBuilder} tagBuilder
		 * 
		 * The AnchorTagBuilder instance used to build the URL/email/Twitter replacement anchor tags. This is lazily instantiated
		 * in the {@link #getTagBuilder} method.
		 */


		/**
		 * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
		 * Does not link URLs found within HTML tags.
		 * 
		 * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
		 * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
		 * 
		 * This method finds the text around any HTML elements in the input `textOrHtml`, which will be the text that is processed.
		 * Any original HTML elements will be left as-is, as well as the text that is already wrapped in anchor (&lt;a&gt;) tags.
		 * 
		 * @param {String} textOrHtml The HTML or text to link URLs, email addresses, and Twitter handles within (depending on if
		 *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
		 * @return {String} The HTML, with URLs/emails/Twitter handles automatically linked.
		 */
		link : function( textOrHtml ) {
			var me = this,  // for closure
			    htmlParser = this.getHtmlParser(),
			    htmlCharacterEntitiesRegex = this.htmlCharacterEntitiesRegex,
			    anchorTagStackCount = 0,  // used to only process text around anchor tags, and any inner text/html they may have
			    resultHtml = [];

			htmlParser.parse( textOrHtml, {
				// Process HTML nodes in the input `textOrHtml`
				processHtmlNode : function( tagText, tagName, isClosingTag ) {
					if( tagName === 'a' ) {
						if( !isClosingTag ) {  // it's the start <a> tag
							anchorTagStackCount++;
						} else {   // it's the end </a> tag
							anchorTagStackCount = Math.max( anchorTagStackCount - 1, 0 );  // attempt to handle extraneous </a> tags by making sure the stack count never goes below 0
						}
					}
					resultHtml.push( tagText );  // now add the text of the tag itself verbatim
				},

				// Process text nodes in the input `textOrHtml`
				processTextNode : function( text ) {
					if( anchorTagStackCount === 0 ) {
						// If we're not within an <a> tag, process the text node
						var unescapedText = Autolinker.Util.splitAndCapture( text, htmlCharacterEntitiesRegex );  // split at HTML entities, but include the HTML entities in the results array

						for ( var i = 0, len = unescapedText.length; i < len; i++ ) {
							var textToProcess = unescapedText[ i ],
							    processedTextNode = me.processTextNode( textToProcess );

							resultHtml.push( processedTextNode );
						}

					} else {
						// `text` is within an <a> tag, simply append the text - we do not want to autolink anything 
						// already within an <a>...</a> tag
						resultHtml.push( text );
					}
				}
			} );

			return resultHtml.join( "" );
		},


		/**
		 * Lazily instantiates and returns the {@link #htmlParser} instance for this Autolinker instance.
		 * 
		 * @protected
		 * @return {Autolinker.HtmlParser}
		 */
		getHtmlParser : function() {
			var htmlParser = this.htmlParser;

			if( !htmlParser ) {
				htmlParser = this.htmlParser = new Autolinker.HtmlParser();
			}

			return htmlParser;
		},


		/**
		 * Returns the {@link #tagBuilder} instance for this Autolinker instance, lazily instantiating it
		 * if it does not yet exist.
		 * 
		 * This method may be used in a {@link #replaceFn} to generate the {@link Autolinker.HtmlTag HtmlTag} instance that 
		 * Autolinker would normally generate, and then allow for modifications before returning it. For example:
		 * 
		 *     var html = Autolinker.link( "Test google.com", {
		 *         replaceFn : function( autolinker, match ) {
		 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
		 *             tag.setAttr( 'rel', 'nofollow' );
		 *             
		 *             return tag;
		 *         }
		 *     } );
		 *     
		 *     // generated html:
		 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
		 * 
		 * @return {Autolinker.AnchorTagBuilder}
		 */
		getTagBuilder : function() {
			var tagBuilder = this.tagBuilder;

			if( !tagBuilder ) {
				tagBuilder = this.tagBuilder = new Autolinker.AnchorTagBuilder( {
					newWindow   : this.newWindow,
					truncate    : this.truncate,
					className   : this.className
				} );
			}

			return tagBuilder;
		},


		/**
		 * Process the text that lies inbetween HTML tags. This method does the actual wrapping of URLs with
		 * anchor tags.
		 * 
		 * @private
		 * @param {String} text The text to auto-link.
		 * @return {String} The text with anchor tags auto-filled.
		 */
		processTextNode : function( text ) {
			var me = this;  // for closure

			return text.replace( this.matcherRegex, function( matchStr, $1, $2, $3, $4, $5, $6, $7, $8 ) {
				var matchDescObj = me.processCandidateMatch( matchStr, $1, $2, $3, $4, $5, $6, $7, $8 );  // match description object

				// Return out with no changes for match types that are disabled (url, email, twitter), or for matches that are 
				// invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
				if( !matchDescObj ) {
					return matchStr;

				} else {
					// Generate the replacement text for the match
					var matchReturnVal = me.createMatchReturnVal( matchDescObj.match, matchDescObj.matchStr );
					return matchDescObj.prefixStr + matchReturnVal + matchDescObj.suffixStr;
				}
			} );
		},


		/**
		 * Processes a candidate match from the {@link #matcherRegex}. 
		 * 
		 * Not all matches found by the regex are actual URL/email/Twitter matches, as determined by the {@link #matchValidator}. In
		 * this case, the method returns `null`. Otherwise, a valid Object with `prefixStr`, `match`, and `suffixStr` is returned.
		 * 
		 * @private
		 * @param {String} matchStr The full match that was found by the {@link #matcherRegex}.
		 * @param {String} twitterMatch The matched text of a Twitter handle, if the match is a Twitter match.
		 * @param {String} twitterHandlePrefixWhitespaceChar The whitespace char before the @ sign in a Twitter handle match. This 
		 *   is needed because of no lookbehinds in JS regexes, and is need to re-include the character for the anchor tag replacement.
		 * @param {String} twitterHandle The actual Twitter user (i.e the word after the @ sign in a Twitter match).
		 * @param {String} emailAddressMatch The matched email address for an email address match.
		 * @param {String} urlMatch The matched URL string for a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @param {String} wwwProtocolRelativeMatch The '//' for a protocol-relative match from a 'www' url, with the character that 
		 *   comes before the '//'.
		 * @param {String} tldProtocolRelativeMatch The '//' for a protocol-relative match from a TLD (top level domain) match, with 
		 *   the character that comes before the '//'.
		 *   
		 * @return {Object} A "match description object". This will be `null` if the match was invalid, or if a match type is disabled.
		 *   Otherwise, this will be an Object (map) with the following properties:
		 * @return {String} return.prefixStr The char(s) that should be prepended to the replacement string. These are char(s) that
		 *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
		 *   the replacement stream.
		 * @return {String} return.suffixStr The char(s) that should be appended to the replacement string. These are char(s) that
		 *   were needed to be included from the regex match that were ignored by processing code, and should be re-inserted into 
		 *   the replacement stream.
		 * @return {String} return.matchStr The `matchStr`, fixed up to remove characters that are no longer needed (which have been
		 *   added to `prefixStr` and `suffixStr`).
		 * @return {Autolinker.match.Match} return.match The Match object that represents the match that was found.
		 */
		processCandidateMatch : function( 
			matchStr, twitterMatch, twitterHandlePrefixWhitespaceChar, twitterHandle, 
			emailAddressMatch, urlMatch, protocolUrlMatch, wwwProtocolRelativeMatch, tldProtocolRelativeMatch
		) {
			var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch,
			    match,  // Will be an Autolinker.match.Match object

			    prefixStr = "",       // A string to use to prefix the anchor tag that is created. This is needed for the Twitter handle match
			    suffixStr = "";       // A string to suffix the anchor tag that is created. This is used if there is a trailing parenthesis that should not be auto-linked.


			// Return out with `null` for match types that are disabled (url, email, twitter), or for matches that are 
			// invalid (false positives from the matcherRegex, which can't use look-behinds since they are unavailable in JS).
			if(
				( twitterMatch && !this.twitter ) || ( emailAddressMatch && !this.email ) || ( urlMatch && !this.urls ) ||
				!this.matchValidator.isValidMatch( urlMatch, protocolUrlMatch, protocolRelativeMatch ) 
			) {
				return null;
			}

			// Handle a closing parenthesis at the end of the match, and exclude it if there is not a matching open parenthesis
			// in the match itself. 
			if( this.matchHasUnbalancedClosingParen( matchStr ) ) {
				matchStr = matchStr.substr( 0, matchStr.length - 1 );  // remove the trailing ")"
				suffixStr = ")";  // this will be added after the generated <a> tag
			}


			if( emailAddressMatch ) {
				match = new Autolinker.match.Email( { matchedText: matchStr, email: emailAddressMatch } );

			} else if( twitterMatch ) {
				// fix up the `matchStr` if there was a preceding whitespace char, which was needed to determine the match 
				// itself (since there are no look-behinds in JS regexes)
				if( twitterHandlePrefixWhitespaceChar ) {
					prefixStr = twitterHandlePrefixWhitespaceChar;
					matchStr = matchStr.slice( 1 );  // remove the prefixed whitespace char from the match
				}
				match = new Autolinker.match.Twitter( { matchedText: matchStr, twitterHandle: twitterHandle } );

			} else {  // url match
				// If it's a protocol-relative '//' match, remove the character before the '//' (which the matcherRegex needed
				// to match due to the lack of a negative look-behind in JavaScript regular expressions)
				if( protocolRelativeMatch ) {
					var charBeforeMatch = protocolRelativeMatch.match( this.charBeforeProtocolRelMatchRegex )[ 1 ] || "";

					if( charBeforeMatch ) {  // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
						prefixStr = charBeforeMatch;
						matchStr = matchStr.slice( 1 );  // remove the prefixed char from the match
					}
				}

				match = new Autolinker.match.Url( {
					matchedText : matchStr,
					url : matchStr,
					protocolUrlMatch : !!protocolUrlMatch,
					protocolRelativeMatch : !!protocolRelativeMatch,
					stripPrefix : this.stripPrefix
				} );
			}

			return {
				prefixStr : prefixStr,
				suffixStr : suffixStr,
				matchStr  : matchStr,
				match     : match
			};
		},


		/**
		 * Determines if a match found has an unmatched closing parenthesis. If so, this parenthesis will be removed
		 * from the match itself, and appended after the generated anchor tag in {@link #processTextNode}.
		 * 
		 * A match may have an extra closing parenthesis at the end of the match because the regular expression must include parenthesis
		 * for URLs such as "wikipedia.com/something_(disambiguation)", which should be auto-linked. 
		 * 
		 * However, an extra parenthesis *will* be included when the URL itself is wrapped in parenthesis, such as in the case of
		 * "(wikipedia.com/something_(disambiguation))". In this case, the last closing parenthesis should *not* be part of the URL 
		 * itself, and this method will return `true`.
		 * 
		 * @private
		 * @param {String} matchStr The full match string from the {@link #matcherRegex}.
		 * @return {Boolean} `true` if there is an unbalanced closing parenthesis at the end of the `matchStr`, `false` otherwise.
		 */
		matchHasUnbalancedClosingParen : function( matchStr ) {
			var lastChar = matchStr.charAt( matchStr.length - 1 );

			if( lastChar === ')' ) {
				var openParensMatch = matchStr.match( /\(/g ),
				    closeParensMatch = matchStr.match( /\)/g ),
				    numOpenParens = ( openParensMatch && openParensMatch.length ) || 0,
				    numCloseParens = ( closeParensMatch && closeParensMatch.length ) || 0;

				if( numOpenParens < numCloseParens ) {
					return true;
				}
			}

			return false;
		},


		/**
		 * Creates the return string value for a given match in the input string, for the {@link #processTextNode} method.
		 * 
		 * This method handles the {@link #replaceFn}, if one was provided.
		 * 
		 * @private
		 * @param {Autolinker.match.Match} match The Match object that represents the match.
		 * @param {String} matchStr The original match string, after having been preprocessed to fix match edge cases (see
		 *   the `prefixStr` and `suffixStr` vars in {@link #processTextNode}.
		 * @return {String} The string that the `match` should be replaced with. This is usually the anchor tag string, but
		 *   may be the `matchStr` itself if the match is not to be replaced.
		 */
		createMatchReturnVal : function( match, matchStr ) {
			// Handle a custom `replaceFn` being provided
			var replaceFnResult;
			if( this.replaceFn ) {
				replaceFnResult = this.replaceFn.call( this, this, match );  // Autolinker instance is the context, and the first arg
			}

			if( typeof replaceFnResult === 'string' ) {
				return replaceFnResult;  // `replaceFn` returned a string, use that

			} else if( replaceFnResult === false ) {
				return matchStr;  // no replacement for the match

			} else if( replaceFnResult instanceof Autolinker.HtmlTag ) {
				return replaceFnResult.toString();

			} else {  // replaceFnResult === true, or no/unknown return value from function
				// Perform Autolinker's default anchor tag generation
				var tagBuilder = this.getTagBuilder(),
				    anchorTag = tagBuilder.build( match );  // returns an Autolinker.HtmlTag instance

				return anchorTag.toString();
			}
		}

	};


	/**
	 * Automatically links URLs, email addresses, and Twitter handles found in the given chunk of HTML. 
	 * Does not link URLs found within HTML tags.
	 * 
	 * For instance, if given the text: `You should go to http://www.yahoo.com`, then the result
	 * will be `You should go to &lt;a href="http://www.yahoo.com"&gt;http://www.yahoo.com&lt;/a&gt;`
	 * 
	 * Example:
	 * 
	 *     var linkedText = Autolinker.link( "Go to google.com", { newWindow: false } );
	 *     // Produces: "Go to <a href="http://google.com">google.com</a>"
	 * 
	 * @static
	 * @param {String} textOrHtml The HTML or text to find URLs, email addresses, and Twitter handles within (depending on if
	 *   the {@link #urls}, {@link #email}, and {@link #twitter} options are enabled).
	 * @param {Object} [options] Any of the configuration options for the Autolinker class, specified in an Object (map).
	 *   See the class description for an example call.
	 * @return {String} The HTML text, with URLs automatically linked
	 */
	Autolinker.link = function( textOrHtml, options ) {
		var autolinker = new Autolinker( options );
		return autolinker.link( textOrHtml );
	};


	// Namespace for `match` classes
	Autolinker.match = {};
	/*global Autolinker */
	/*jshint eqnull:true, boss:true */
	/**
	 * @class Autolinker.Util
	 * @singleton
	 * 
	 * A few utility methods for Autolinker.
	 */
	Autolinker.Util = {

		/**
		 * @property {Function} abstractMethod
		 * 
		 * A function object which represents an abstract method.
		 */
		abstractMethod : function() { throw "abstract"; },


		/**
		 * Assigns (shallow copies) the properties of `src` onto `dest`.
		 * 
		 * @param {Object} dest The destination object.
		 * @param {Object} src The source object.
		 * @return {Object} The destination object (`dest`)
		 */
		assign : function( dest, src ) {
			for( var prop in src ) {
				if( src.hasOwnProperty( prop ) ) {
					dest[ prop ] = src[ prop ];
				}
			}

			return dest;
		},


		/**
		 * Extends `superclass` to create a new subclass, adding the `protoProps` to the new subclass's prototype.
		 * 
		 * @param {Function} superclass The constructor function for the superclass.
		 * @param {Object} protoProps The methods/properties to add to the subclass's prototype. This may contain the
		 *   special property `constructor`, which will be used as the new subclass's constructor function.
		 * @return {Function} The new subclass function.
		 */
		extend : function( superclass, protoProps ) {
			var superclassProto = superclass.prototype;

			var F = function() {};
			F.prototype = superclassProto;

			var subclass;
			if( protoProps.hasOwnProperty( 'constructor' ) ) {
				subclass = protoProps.constructor;
			} else {
				subclass = function() { superclassProto.constructor.apply( this, arguments ); };
			}

			var subclassProto = subclass.prototype = new F();  // set up prototype chain
			subclassProto.constructor = subclass;  // fix constructor property
			subclassProto.superclass = superclassProto;

			delete protoProps.constructor;  // don't re-assign constructor property to the prototype, since a new function may have been created (`subclass`), which is now already there
			Autolinker.Util.assign( subclassProto, protoProps );

			return subclass;
		},


		/**
		 * Truncates the `str` at `len - ellipsisChars.length`, and adds the `ellipsisChars` to the
		 * end of the string (by default, two periods: '..'). If the `str` length does not exceed 
		 * `len`, the string will be returned unchanged.
		 * 
		 * @param {String} str The string to truncate and add an ellipsis to.
		 * @param {Number} truncateLen The length to truncate the string at.
		 * @param {String} [ellipsisChars=..] The ellipsis character(s) to add to the end of `str`
		 *   when truncated. Defaults to '..'
		 */
		ellipsis : function( str, truncateLen, ellipsisChars ) {
			if( str.length > truncateLen ) {
				ellipsisChars = ( ellipsisChars == null ) ? '..' : ellipsisChars;
				str = str.substring( 0, truncateLen - ellipsisChars.length ) + ellipsisChars;
			}
			return str;
		},


		/**
		 * Supports `Array.prototype.indexOf()` functionality for old IE (IE8 and below).
		 * 
		 * @param {Array} arr The array to find an element of.
		 * @param {*} element The element to find in the array, and return the index of.
		 * @return {Number} The index of the `element`, or -1 if it was not found.
		 */
		indexOf : function( arr, element ) {
			if( Array.prototype.indexOf ) {
				return arr.indexOf( element );

			} else {
				for( var i = 0, len = arr.length; i < len; i++ ) {
					if( arr[ i ] === element ) return i;
				}
				return -1;
			}
		},



		/**
		 * Performs the functionality of what modern browsers do when `String.prototype.split()` is called
		 * with a regular expression that contains capturing parenthesis.
		 * 
		 * For example:
		 * 
		 *     // Modern browsers: 
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', ',', 'b', ',', 'c' ]
		 *     
		 *     // Old IE (including IE8):
		 *     "a,b,c".split( /(,)/ );  // --> [ 'a', 'b', 'c' ]
		 *     
		 * This method emulates the functionality of modern browsers for the old IE case.
		 * 
		 * @param {String} str The string to split.
		 * @param {RegExp} splitRegex The regular expression to split the input `str` on. The splitting
		 *   character(s) will be spliced into the array, as in the "modern browsers" example in the 
		 *   description of this method. 
		 *   Note #1: the supplied regular expression **must** have the 'g' flag specified.
		 *   Note #2: for simplicity's sake, the regular expression does not need 
		 *   to contain capturing parenthesis - it will be assumed that any match has them.
		 * @return {String[]} The split array of strings, with the splitting character(s) included.
		 */
		splitAndCapture : function( str, splitRegex ) {
			if( !splitRegex.global ) throw new Error( "`splitRegex` must have the 'g' flag set" );

			var result = [],
			    lastIdx = 0,
			    match;

			while( match = splitRegex.exec( str ) ) {
				result.push( str.substring( lastIdx, match.index ) );
				result.push( match[ 0 ] );  // push the splitting char(s)

				lastIdx = match.index + match[ 0 ].length;
			}
			result.push( str.substring( lastIdx ) );

			return result;
		}

	};
	/*global Autolinker */
	/**
	 * @private
	 * @class Autolinker.HtmlParser
	 * @extends Object
	 * 
	 * An HTML parser implementation which simply walks an HTML string and calls the provided visitor functions to process 
	 * HTML and text nodes.
	 * 
	 * Autolinker uses this to only link URLs/emails/Twitter handles within text nodes, basically ignoring HTML tags.
	 */
	Autolinker.HtmlParser = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} htmlRegex
		 * 
		 * The regular expression used to pull out HTML tags from a string. Handles namespaced HTML tags and
		 * attribute names, as specified by http://www.w3.org/TR/html-markup/syntax.html.
		 * 
		 * Capturing groups:
		 * 
		 * 1. The "!DOCTYPE" tag name, if a tag is a &lt;!DOCTYPE&gt; tag.
		 * 2. If it is an end tag, this group will have the '/'.
		 * 3. The tag name for all tags (other than the &lt;!DOCTYPE&gt; tag)
		 */
		htmlRegex : (function() {
			var tagNameRegex = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
			    attrNameRegex = /[^\s\0"'>\/=\x01-\x1F\x7F]+/,   // the unicode range accounts for excluding control chars, and the delete char
			    attrValueRegex = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/, // double quoted, single quoted, or unquoted attribute values
			    nameEqualsValueRegex = attrNameRegex.source + '(?:\\s*=\\s*' + attrValueRegex.source + ')?';  // optional '=[value]'

			return new RegExp( [
				// for <!DOCTYPE> tag. Ex: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">) 
				'(?:',
					'<(!DOCTYPE)',  // *** Capturing Group 1 - If it's a doctype tag

						// Zero or more attributes following the tag name
						'(?:',
							'\\s+',  // one or more whitespace chars before an attribute

							// Either:
							// A. attr="value", or 
							// B. "value" alone (To cover example doctype tag: <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">) 
							'(?:', nameEqualsValueRegex, '|', attrValueRegex.source + ')',
						')*',
					'>',
				')',

				'|',

				// All other HTML tags (i.e. tags that are not <!DOCTYPE>)
				'(?:',
					'<(/)?',  // Beginning of a tag. Either '<' for a start tag, or '</' for an end tag. 
					          // *** Capturing Group 2: The slash or an empty string. Slash ('/') for end tag, empty string for start or self-closing tag.

						// *** Capturing Group 3 - The tag name
						'(' + tagNameRegex.source + ')',

						// Zero or more attributes following the tag name
						'(?:',
							'\\s+',                // one or more whitespace chars before an attribute
							nameEqualsValueRegex,  // attr="value" (with optional ="value" part)
						')*',

						'\\s*/?',  // any trailing spaces and optional '/' before the closing '>'
					'>',
				')'
			].join( "" ), 'gi' );
		} )(),


		/**
		 * Walks an HTML string, calling the `options.processHtmlNode` function for each HTML tag that is encountered, and calling
		 * the `options.processTextNode` function when each text around HTML tags is encountered.
		 * 
		 * @param {String} html The HTML to parse.
		 * @param {Object} [options] An Object (map) which may contain the following properties:
		 * 
		 * @param {Function} [options.processHtmlNode] A visitor function which allows processing of an encountered HTML node.
		 *   This function is called with the following arguments:
		 * @param {String} [options.processHtmlNode.tagText] The HTML tag text that was found.
		 * @param {String} [options.processHtmlNode.tagName] The tag name for the HTML tag that was found. Ex: 'a' for an anchor tag.
		 * @param {String} [options.processHtmlNode.isClosingTag] `true` if the tag is a closing tag (ex: &lt;/a&gt;), `false` otherwise.
		 *  
		 * @param {Function} [options.processTextNode] A visitor function which allows processing of an encountered text node.
		 *   This function is called with the following arguments:
		 * @param {String} [options.processTextNode.text] The text node that was matched.
		 */
		parse : function( html, options ) {
			options = options || {};

			var processHtmlNodeVisitor = options.processHtmlNode || function() {},
			    processTextNodeVisitor = options.processTextNode || function() {},
			    htmlRegex = this.htmlRegex,
			    currentResult,
			    lastIndex = 0;

			// Loop over the HTML string, ignoring HTML tags, and processing the text that lies between them,
			// wrapping the URLs in anchor tags
			while( ( currentResult = htmlRegex.exec( html ) ) !== null ) {
				var tagText = currentResult[ 0 ],
				    tagName = currentResult[ 1 ] || currentResult[ 3 ],  // The <!DOCTYPE> tag (ex: "!DOCTYPE"), or another tag (ex: "a") 
				    isClosingTag = !!currentResult[ 2 ],
				    inBetweenTagsText = html.substring( lastIndex, currentResult.index );

				if( inBetweenTagsText ) {
					processTextNodeVisitor( inBetweenTagsText );
				}

				processHtmlNodeVisitor( tagText, tagName.toLowerCase(), isClosingTag );

				lastIndex = currentResult.index + tagText.length;
			}

			// Process any remaining text after the last HTML element. Will process all of the text if there were no HTML elements.
			if( lastIndex < html.length ) {
				var text = html.substring( lastIndex );

				if( text ) {
					processTextNodeVisitor( text );
				}
			}
		}

	} );
	/*global Autolinker */
	/*jshint boss:true */
	/**
	 * @class Autolinker.HtmlTag
	 * @extends Object
	 * 
	 * Represents an HTML tag, which can be used to easily build/modify HTML tags programmatically.
	 * 
	 * Autolinker uses this abstraction to create HTML tags, and then write them out as strings. You may also use
	 * this class in your code, especially within a {@link Autolinker#replaceFn replaceFn}.
	 * 
	 * ## Examples
	 * 
	 * Example instantiation:
	 * 
	 *     var tag = new Autolinker.HtmlTag( {
	 *         tagName : 'a',
	 *         attrs   : { 'href': 'http://google.com', 'class': 'external-link' },
	 *         innerHtml : 'Google'
	 *     } );
	 *     
	 *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
	 *     
	 *     // Individual accessor methods
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 * 
	 * 
	 * Using mutator methods (which may be used in combination with instantiation config properties):
	 * 
	 *     var tag = new Autolinker.HtmlTag();
	 *     tag.setTagName( 'a' );
	 *     tag.setAttr( 'href', 'http://google.com' );
	 *     tag.addClass( 'external-link' );
	 *     tag.setInnerHtml( 'Google' );
	 *     
	 *     tag.getTagName();                 // 'a'
	 *     tag.getAttr( 'href' );            // 'http://google.com'
	 *     tag.hasClass( 'external-link' );  // true
	 *     
	 *     tag.toString();  // <a href="http://google.com" class="external-link">Google</a>
	 *     
	 * 
	 * ## Example use within a {@link Autolinker#replaceFn replaceFn}
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance, configured with the Match's href and anchor text
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 *     
	 *     
	 * ## Example use with a new tag for the replacement
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = new Autolinker.HtmlTag( {
	 *                 tagName : 'button',
	 *                 attrs   : { 'title': 'Load URL: ' + match.getAnchorHref() },
	 *                 innerHtml : 'Load URL: ' + match.getAnchorText()
	 *             } );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <button title="Load URL: http://google.com">Load URL: google.com</button>
	 */
	Autolinker.HtmlTag = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} tagName
		 * 
		 * The tag name. Ex: 'a', 'button', etc.
		 * 
		 * Not required at instantiation time, but should be set using {@link #setTagName} before {@link #toString}
		 * is executed.
		 */

		/**
		 * @cfg {Object.<String, String>} attrs
		 * 
		 * An key/value Object (map) of attributes to create the tag with. The keys are the attribute names, and the
		 * values are the attribute values.
		 */

		/**
		 * @cfg {String} innerHtml
		 * 
		 * The inner HTML for the tag. 
		 * 
		 * Note the camel case name on `innerHtml`. Acronyms are camelCased in this utility (such as not to run into the acronym 
		 * naming inconsistency that the DOM developers created with `XMLHttpRequest`). You may alternatively use {@link #innerHTML}
		 * if you prefer, but this one is recommended.
		 */

		/**
		 * @cfg {String} innerHTML
		 * 
		 * Alias of {@link #innerHtml}, accepted for consistency with the browser DOM api, but prefer the camelCased version
		 * for acronym names.
		 */


		/**
		 * @protected
		 * @property {RegExp} whitespaceRegex
		 * 
		 * Regular expression used to match whitespace in a string of CSS classes.
		 */
		whitespaceRegex : /\s+/,


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration properties for this class, in an Object (map)
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );

			this.innerHtml = this.innerHtml || this.innerHTML;  // accept either the camelCased form or the fully capitalized acronym
		},


		/**
		 * Sets the tag name that will be used to generate the tag with.
		 * 
		 * @param {String} tagName
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setTagName : function( tagName ) {
			this.tagName = tagName;
			return this;
		},


		/**
		 * Retrieves the tag name.
		 * 
		 * @return {String}
		 */
		getTagName : function() {
			return this.tagName || "";
		},


		/**
		 * Sets an attribute on the HtmlTag.
		 * 
		 * @param {String} attrName The attribute name to set.
		 * @param {String} attrValue The attribute value to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttr : function( attrName, attrValue ) {
			var tagAttrs = this.getAttrs();
			tagAttrs[ attrName ] = attrValue;

			return this;
		},


		/**
		 * Retrieves an attribute from the HtmlTag. If the attribute does not exist, returns `undefined`.
		 * 
		 * @param {String} name The attribute name to retrieve.
		 * @return {String} The attribute's value, or `undefined` if it does not exist on the HtmlTag.
		 */
		getAttr : function( attrName ) {
			return this.getAttrs()[ attrName ];
		},


		/**
		 * Sets one or more attributes on the HtmlTag.
		 * 
		 * @param {Object.<String, String>} attrs A key/value Object (map) of the attributes to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setAttrs : function( attrs ) {
			var tagAttrs = this.getAttrs();
			Autolinker.Util.assign( tagAttrs, attrs );

			return this;
		},


		/**
		 * Retrieves the attributes Object (map) for the HtmlTag.
		 * 
		 * @return {Object.<String, String>} A key/value object of the attributes for the HtmlTag.
		 */
		getAttrs : function() {
			return this.attrs || ( this.attrs = {} );
		},


		/**
		 * Sets the provided `cssClass`, overwriting any current CSS classes on the HtmlTag.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to set (overwrite).
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setClass : function( cssClass ) {
			return this.setAttr( 'class', cssClass );
		},


		/**
		 * Convenience method to add one or more CSS classes to the HtmlTag. Will not add duplicate CSS classes.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to add.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		addClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    newClasses = cssClass.split( whitespaceRegex ),
			    newClass;

			while( newClass = newClasses.shift() ) {
				if( indexOf( classes, newClass ) === -1 ) {
					classes.push( newClass );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to remove one or more CSS classes from the HtmlTag.
		 * 
		 * @param {String} cssClass One or more space-separated CSS classes to remove.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		removeClass : function( cssClass ) {
			var classAttr = this.getClass(),
			    whitespaceRegex = this.whitespaceRegex,
			    indexOf = Autolinker.Util.indexOf,  // to support IE8 and below
			    classes = ( !classAttr ) ? [] : classAttr.split( whitespaceRegex ),
			    removeClasses = cssClass.split( whitespaceRegex ),
			    removeClass;

			while( classes.length && ( removeClass = removeClasses.shift() ) ) {
				var idx = indexOf( classes, removeClass );
				if( idx !== -1 ) {
					classes.splice( idx, 1 );
				}
			}

			this.getAttrs()[ 'class' ] = classes.join( " " );
			return this;
		},


		/**
		 * Convenience method to retrieve the CSS class(es) for the HtmlTag, which will each be separated by spaces when
		 * there are multiple.
		 * 
		 * @return {String}
		 */
		getClass : function() {
			return this.getAttrs()[ 'class' ] || "";
		},


		/**
		 * Convenience method to check if the tag has a CSS class or not.
		 * 
		 * @param {String} cssClass The CSS class to check for.
		 * @return {Boolean} `true` if the HtmlTag has the CSS class, `false` otherwise.
		 */
		hasClass : function( cssClass ) {
			return ( ' ' + this.getClass() + ' ' ).indexOf( ' ' + cssClass + ' ' ) !== -1;
		},


		/**
		 * Sets the inner HTML for the tag.
		 * 
		 * @param {String} html The inner HTML to set.
		 * @return {Autolinker.HtmlTag} This HtmlTag instance, so that method calls may be chained.
		 */
		setInnerHtml : function( html ) {
			this.innerHtml = html;

			return this;
		},


		/**
		 * Retrieves the inner HTML for the tag.
		 * 
		 * @return {String}
		 */
		getInnerHtml : function() {
			return this.innerHtml || "";
		},


		/**
		 * Override of superclass method used to generate the HTML string for the tag.
		 * 
		 * @return {String}
		 */
		toString : function() {
			var tagName = this.getTagName(),
			    attrsStr = this.buildAttrsStr();

			attrsStr = ( attrsStr ) ? ' ' + attrsStr : '';  // prepend a space if there are actually attributes

			return [ '<', tagName, attrsStr, '>', this.getInnerHtml(), '</', tagName, '>' ].join( "" );
		},


		/**
		 * Support method for {@link #toString}, returns the string space-separated key="value" pairs, used to populate 
		 * the stringified HtmlTag.
		 * 
		 * @protected
		 * @return {String} Example return: `attr1="value1" attr2="value2"`
		 */
		buildAttrsStr : function() {
			if( !this.attrs ) return "";  // no `attrs` Object (map) has been set, return empty string

			var attrs = this.getAttrs(),
			    attrsArr = [];

			for( var prop in attrs ) {
				if( attrs.hasOwnProperty( prop ) ) {
					attrsArr.push( prop + '="' + attrs[ prop ] + '"' );
				}
			}
			return attrsArr.join( " " );
		}

	} );
	/*global Autolinker */
	/*jshint scripturl:true */
	/**
	 * @private
	 * @class Autolinker.MatchValidator
	 * @extends Object
	 * 
	 * Used by Autolinker to filter out false positives from the {@link Autolinker#matcherRegex}.
	 * 
	 * Due to the limitations of regular expressions (including the missing feature of look-behinds in JS regular expressions),
	 * we cannot always determine the validity of a given match. This class applies a bit of additional logic to filter out any
	 * false positives that have been matched by the {@link Autolinker#matcherRegex}.
	 */
	Autolinker.MatchValidator = Autolinker.Util.extend( Object, {

		/**
		 * @private
		 * @property {RegExp} invalidProtocolRelMatchRegex
		 * 
		 * The regular expression used to check a potential protocol-relative URL match, coming from the 
		 * {@link Autolinker#matcherRegex}. A protocol-relative URL is, for example, "//yahoo.com"
		 * 
		 * This regular expression checks to see if there is a word character before the '//' match in order to determine if 
		 * we should actually autolink a protocol-relative URL. This is needed because there is no negative look-behind in 
		 * JavaScript regular expressions. 
		 * 
		 * For instance, we want to autolink something like "Go to: //google.com", but we don't want to autolink something 
		 * like "abc//google.com"
		 */
		invalidProtocolRelMatchRegex : /^[\w]\/\//,

		/**
		 * Regex to test for a full protocol, with the two trailing slashes. Ex: 'http://'
		 * 
		 * @private
		 * @property {RegExp} hasFullProtocolRegex
		 */
		hasFullProtocolRegex : /^[A-Za-z][-.+A-Za-z0-9]+:\/\//,

		/**
		 * Regex to find the URI scheme, such as 'mailto:'.
		 * 
		 * This is used to filter out 'javascript:' and 'vbscript:' schemes.
		 * 
		 * @private
		 * @property {RegExp} uriSchemeRegex
		 */
		uriSchemeRegex : /^[A-Za-z][-.+A-Za-z0-9]+:/,

		/**
		 * Regex to determine if at least one word char exists after the protocol (i.e. after the ':')
		 * 
		 * @private
		 * @property {RegExp} hasWordCharAfterProtocolRegex
		 */
		hasWordCharAfterProtocolRegex : /:[^\s]*?[A-Za-z]/,


		/**
		 * Determines if a given match found by {@link Autolinker#processTextNode} is valid. Will return `false` for:
		 * 
		 * 1) URL matches which do not have at least have one period ('.') in the domain name (effectively skipping over 
		 *    matches like "abc:def"). However, URL matches with a protocol will be allowed (ex: 'http://localhost')
		 * 2) URL matches which do not have at least one word character in the domain name (effectively skipping over
		 *    matches like "git:1.0").
		 * 3) A protocol-relative url match (a URL beginning with '//') whose previous character is a word character 
		 *    (effectively skipping over strings like "abc//google.com")
		 * 
		 * Otherwise, returns `true`.
		 * 
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
		 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
		 *   preceding the '//'.
		 * @return {Boolean} `true` if the match given is valid and should be processed, or `false` if the match is invalid and/or 
		 *   should just not be processed.
		 */
		isValidMatch : function( urlMatch, protocolUrlMatch, protocolRelativeMatch ) {
			if(
				( protocolUrlMatch && !this.isValidUriScheme( protocolUrlMatch ) ) ||
				this.urlMatchDoesNotHaveProtocolOrDot( urlMatch, protocolUrlMatch ) ||       // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
				this.urlMatchDoesNotHaveAtLeastOneWordChar( urlMatch, protocolUrlMatch ) ||  // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
				this.isInvalidProtocolRelativeMatch( protocolRelativeMatch )                 // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
			) {
				return false;
			}

			return true;
		},


		/**
		 * Determines if the URI scheme is a valid scheme to be autolinked. Returns `false` if the scheme is 
		 * 'javascript:' or 'vbscript:'
		 * 
		 * @private
		 * @param {String} uriSchemeMatch The match URL string for a full URI scheme match. Ex: 'http://yahoo.com' 
		 *   or 'mailto:a@a.com'.
		 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
		 */
		isValidUriScheme : function( uriSchemeMatch ) {
			var uriScheme = uriSchemeMatch.match( this.uriSchemeRegex )[ 0 ];

			return ( uriScheme !== 'javascript:' && uriScheme !== 'vbscript:' );
		},


		/**
		 * Determines if a URL match does not have either:
		 * 
		 * a) a full protocol (i.e. 'http://'), or
		 * b) at least one dot ('.') in the domain name (for a non-full-protocol match).
		 * 
		 * Either situation is considered an invalid URL (ex: 'git:d' does not have either the '://' part, or at least one dot
		 * in the domain name. If the match was 'git:abc.com', we would consider this valid.)
		 * 
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to match
		 *   something like 'http://localhost', where we won't double check that the domain name has at least one '.' in it.
		 * @return {Boolean} `true` if the URL match does not have a full protocol, or at least one dot ('.') in a non-full-protocol
		 *   match.
		 */
		urlMatchDoesNotHaveProtocolOrDot : function( urlMatch, protocolUrlMatch ) {
			return ( !!urlMatch && ( !protocolUrlMatch || !this.hasFullProtocolRegex.test( protocolUrlMatch ) ) && urlMatch.indexOf( '.' ) === -1 );
		},


		/**
		 * Determines if a URL match does not have at least one word character after the protocol (i.e. in the domain name).
		 * 
		 * At least one letter character must exist in the domain name after a protocol match. Ex: skip over something 
		 * like "git:1.0"
		 * 
		 * @private
		 * @param {String} urlMatch The matched URL, if there was one. Will be an empty string if the match is not a URL match.
		 * @param {String} protocolUrlMatch The match URL string for a protocol match. Ex: 'http://yahoo.com'. This is used to
		 *   know whether or not we have a protocol in the URL string, in order to check for a word character after the protocol
		 *   separator (':').
		 * @return {Boolean} `true` if the URL match does not have at least one word character in it after the protocol, `false`
		 *   otherwise.
		 */
		urlMatchDoesNotHaveAtLeastOneWordChar : function( urlMatch, protocolUrlMatch ) {
			if( urlMatch && protocolUrlMatch ) {
				return !this.hasWordCharAfterProtocolRegex.test( urlMatch );
			} else {
				return false;
			}
		},


		/**
		 * Determines if a protocol-relative match is an invalid one. This method returns `true` if there is a `protocolRelativeMatch`,
		 * and that match contains a word character before the '//' (i.e. it must contain whitespace or nothing before the '//' in
		 * order to be considered valid).
		 * 
		 * @private
		 * @param {String} protocolRelativeMatch The protocol-relative string for a URL match (i.e. '//'), possibly with a preceding
		 *   character (ex, a space, such as: ' //', or a letter, such as: 'a//'). The match is invalid if there is a word character
		 *   preceding the '//'.
		 * @return {Boolean} `true` if it is an invalid protocol-relative match, `false` otherwise.
		 */
		isInvalidProtocolRelativeMatch : function( protocolRelativeMatch ) {
			return ( !!protocolRelativeMatch && this.invalidProtocolRelMatchRegex.test( protocolRelativeMatch ) );
		}

	} );
	/*global Autolinker */
	/*jshint sub:true */
	/**
	 * @protected
	 * @class Autolinker.AnchorTagBuilder
	 * @extends Object
	 * 
	 * Builds anchor (&lt;a&gt;) tags for the Autolinker utility when a match is found.
	 * 
	 * Normally this class is instantiated, configured, and used internally by an {@link Autolinker} instance, but may 
	 * actually be retrieved in a {@link Autolinker#replaceFn replaceFn} to create {@link Autolinker.HtmlTag HtmlTag} instances
	 * which may be modified before returning from the {@link Autolinker#replaceFn replaceFn}. For example:
	 * 
	 *     var html = Autolinker.link( "Test google.com", {
	 *         replaceFn : function( autolinker, match ) {
	 *             var tag = autolinker.getTagBuilder().build( match );  // returns an {@link Autolinker.HtmlTag} instance
	 *             tag.setAttr( 'rel', 'nofollow' );
	 *             
	 *             return tag;
	 *         }
	 *     } );
	 *     
	 *     // generated html:
	 *     //   Test <a href="http://google.com" target="_blank" rel="nofollow">google.com</a>
	 */
	Autolinker.AnchorTagBuilder = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {Boolean} newWindow
		 * @inheritdoc Autolinker#newWindow
		 */

		/**
		 * @cfg {Number} truncate
		 * @inheritdoc Autolinker#truncate
		 */

		/**
		 * @cfg {String} className
		 * @inheritdoc Autolinker#className
		 */


		/**
		 * @constructor
		 * @param {Object} [cfg] The configuration options for the AnchorTagBuilder instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Generates the actual anchor (&lt;a&gt;) tag to use in place of the matched URL/email/Twitter text,
		 * via its `match` object.
		 * 
		 * @param {Autolinker.match.Match} match The Match instance to generate an anchor tag from.
		 * @return {Autolinker.HtmlTag} The HtmlTag instance for the anchor tag.
		 */
		build : function( match ) {
			var tag = new Autolinker.HtmlTag( {
				tagName   : 'a',
				attrs     : this.createAttrs( match.getType(), match.getAnchorHref() ),
				innerHtml : this.processAnchorText( match.getAnchorText() )
			} );

			return tag;
		},


		/**
		 * Creates the Object (map) of the HTML attributes for the anchor (&lt;a&gt;) tag being generated.
		 * 
		 * @protected
		 * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
		 * @param {String} href The href for the anchor tag.
		 * @return {Object} A key/value Object (map) of the anchor tag's attributes. 
		 */
		createAttrs : function( matchType, anchorHref ) {
			var attrs = {
				'href' : anchorHref  // we'll always have the `href` attribute
			};

			var cssClass = this.createCssClass( matchType );
			if( cssClass ) {
				attrs[ 'class' ] = cssClass;
			}
			if( this.newWindow ) {
				attrs[ 'target' ] = "_blank";
			}

			return attrs;
		},


		/**
		 * Creates the CSS class that will be used for a given anchor tag, based on the `matchType` and the {@link #className}
		 * config.
		 * 
		 * @private
		 * @param {"url"/"email"/"twitter"} matchType The type of match that an anchor tag is being generated for.
		 * @return {String} The CSS class string for the link. Example return: "myLink myLink-url". If no {@link #className}
		 *   was configured, returns an empty string.
		 */
		createCssClass : function( matchType ) {
			var className = this.className;

			if( !className ) 
				return "";
			else
				return className + " " + className + "-" + matchType;  // ex: "myLink myLink-url", "myLink myLink-email", or "myLink myLink-twitter"
		},


		/**
		 * Processes the `anchorText` by truncating the text according to the {@link #truncate} config.
		 * 
		 * @private
		 * @param {String} anchorText The anchor tag's text (i.e. what will be displayed).
		 * @return {String} The processed `anchorText`.
		 */
		processAnchorText : function( anchorText ) {
			anchorText = this.doTruncate( anchorText );

			return anchorText;
		},


		/**
		 * Performs the truncation of the `anchorText`, if the `anchorText` is longer than the {@link #truncate} option.
		 * Truncates the text to 2 characters fewer than the {@link #truncate} option, and adds ".." to the end.
		 * 
		 * @private
		 * @param {String} text The anchor tag's text (i.e. what will be displayed).
		 * @return {String} The truncated anchor text.
		 */
		doTruncate : function( anchorText ) {
			return Autolinker.Util.ellipsis( anchorText, this.truncate || Number.POSITIVE_INFINITY );
		}

	} );
	/*global Autolinker */
	/**
	 * @abstract
	 * @class Autolinker.match.Match
	 * 
	 * Represents a match found in an input string which should be Autolinked. A Match object is what is provided in a 
	 * {@link Autolinker#replaceFn replaceFn}, and may be used to query for details about the match.
	 * 
	 * For example:
	 * 
	 *     var input = "...";  // string with URLs, Email Addresses, and Twitter Handles
	 *     
	 *     var linkedText = Autolinker.link( input, {
	 *         replaceFn : function( autolinker, match ) {
	 *             console.log( "href = ", match.getAnchorHref() );
	 *             console.log( "text = ", match.getAnchorText() );
	 *         
	 *             switch( match.getType() ) {
	 *                 case 'url' : 
	 *                     console.log( "url: ", match.getUrl() );
	 *                     
	 *                 case 'email' :
	 *                     console.log( "email: ", match.getEmail() );
	 *                     
	 *                 case 'twitter' :
	 *                     console.log( "twitter: ", match.getTwitterHandle() );
	 *             }
	 *         }
	 *     } );
	 *     
	 * See the {@link Autolinker} class for more details on using the {@link Autolinker#replaceFn replaceFn}.
	 */
	Autolinker.match.Match = Autolinker.Util.extend( Object, {

		/**
		 * @cfg {String} matchedText (required)
		 * 
		 * The original text that was matched.
		 */


		/**
		 * @constructor
		 * @param {Object} cfg The configuration properties for the Match instance, specified in an Object (map).
		 */
		constructor : function( cfg ) {
			Autolinker.Util.assign( this, cfg );
		},


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getType : Autolinker.Util.abstractMethod,


		/**
		 * Returns the original text that was matched.
		 * 
		 * @return {String}
		 */
		getMatchedText : function() {
			return this.matchedText;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorHref : Autolinker.Util.abstractMethod,


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @abstract
		 * @return {String}
		 */
		getAnchorText : Autolinker.Util.abstractMethod

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Email
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Email match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Email = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} email (required)
		 * 
		 * The email address that was matched.
		 */


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'email';
		},


		/**
		 * Returns the email address that was matched.
		 * 
		 * @return {String}
		 */
		getEmail : function() {
			return this.email;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'mailto:' + this.email;
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return this.email;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Twitter
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Twitter match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Twitter = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} twitterHandle (required)
		 * 
		 * The Twitter handle that was matched.
		 */


		/**
		 * Returns the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'twitter';
		},


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getTwitterHandle : function() {
			return this.twitterHandle;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			return 'https://twitter.com/' + this.twitterHandle;
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			return '@' + this.twitterHandle;
		}

	} );
	/*global Autolinker */
	/**
	 * @class Autolinker.match.Url
	 * @extends Autolinker.match.Match
	 * 
	 * Represents a Url match found in an input string which should be Autolinked.
	 * 
	 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
	 */
	Autolinker.match.Url = Autolinker.Util.extend( Autolinker.match.Match, {

		/**
		 * @cfg {String} url (required)
		 * 
		 * The url that was matched.
		 */

		/**
		 * @cfg {Boolean} protocolUrlMatch (required)
		 * 
		 * `true` if the URL is a match which already has a protocol (i.e. 'http://'), `false` if the match was from a 'www' or
		 * known TLD match.
		 */

		/**
		 * @cfg {Boolean} protocolRelativeMatch (required)
		 * 
		 * `true` if the URL is a protocol-relative match. A protocol-relative match is a URL that starts with '//',
		 * and will be either http:// or https:// based on the protocol that the site is loaded under.
		 */

		/**
		 * @cfg {Boolean} stripPrefix (required)
		 * @inheritdoc Autolinker#stripPrefix
		 */


		/**
		 * @private
		 * @property {RegExp} urlPrefixRegex
		 * 
		 * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
		 */
		urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,

		/**
		 * @private
		 * @property {RegExp} protocolRelativeRegex
		 * 
		 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
		 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
		 */
		protocolRelativeRegex : /^\/\//,

		/**
		 * @private
		 * @property {Boolean} protocolPrepended
		 * 
		 * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
		 * {@link #url} did not have a protocol)
		 */
		protocolPrepended : false,


		/**
		 * Returns a string name for the type of match that this class represents.
		 * 
		 * @return {String}
		 */
		getType : function() {
			return 'url';
		},


		/**
		 * Returns the url that was matched, assuming the protocol to be 'http://' if the original
		 * match was missing a protocol.
		 * 
		 * @return {String}
		 */
		getUrl : function() {
			var url = this.url;

			// if the url string doesn't begin with a protocol, assume 'http://'
			if( !this.protocolRelativeMatch && !this.protocolUrlMatch && !this.protocolPrepended ) {
				url = this.url = 'http://' + url;

				this.protocolPrepended = true;
			}

			return url;
		},


		/**
		 * Returns the anchor href that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorHref : function() {
			var url = this.getUrl();

			return url.replace( /&amp;/g, '&' );  // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html 
		},


		/**
		 * Returns the anchor text that should be generated for the match.
		 * 
		 * @return {String}
		 */
		getAnchorText : function() {
			var anchorText = this.getUrl();

			if( this.protocolRelativeMatch ) {
				// Strip off any protocol-relative '//' from the anchor text
				anchorText = this.stripProtocolRelativePrefix( anchorText );
			}
			if( this.stripPrefix ) {
				anchorText = this.stripUrlPrefix( anchorText );
			}
			anchorText = this.removeTrailingSlash( anchorText );  // remove trailing slash, if there is one

			return anchorText;
		},


		// ---------------------------------------

		// Utility Functionality

		/**
		 * Strips the URL prefix (such as "http://" or "https://") from the given text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   url prefix (such as stripping off "http://")
		 * @return {String} The `anchorText`, with the prefix stripped.
		 */
		stripUrlPrefix : function( text ) {
			return text.replace( this.urlPrefixRegex, '' );
		},


		/**
		 * Strips any protocol-relative '//' from the anchor text.
		 * 
		 * @private
		 * @param {String} text The text of the anchor that is being generated, for which to strip off the
		 *   protocol-relative prefix (such as stripping off "//")
		 * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
		 */
		stripProtocolRelativePrefix : function( text ) {
			return text.replace( this.protocolRelativeRegex, '' );
		},


		/**
		 * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
		 * 
		 * @private
		 * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
		 *   slash ('/') that may exist.
		 * @return {String} The `anchorText`, with the trailing slash removed.
		 */
		removeTrailingSlash : function( anchorText ) {
			if( anchorText.charAt( anchorText.length - 1 ) === '/' ) {
				anchorText = anchorText.slice( 0, -1 );
			}
			return anchorText;
		}

	} );

	return Autolinker;


}));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZG9vd2Ivd29yay9hc3NlbWJsZS9lbmdpbmUtcmVhY3QvZXhhbXBsZXMvc3JjL2FwcHMvbWFpbi5qcyIsIi4uLy4uL2RhdGEvY29tbWVudHMuanNvbiIsIi9Vc2Vycy9kb293Yi93b3JrL2Fzc2VtYmxlL2VuZ2luZS1yZWFjdC9leGFtcGxlcy9zcmMvYXBwcy9Db21tZW50cy5qc3giLCIvVXNlcnMvZG9vd2Ivd29yay9hc3NlbWJsZS9lbmdpbmUtcmVhY3QvZXhhbXBsZXMvc3JjL2FwcHMvVXNlclN0YXR1c0JveC5qc3giLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWVyZ2UtZGVlcC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tZXJnZS1kZWVwL25vZGVfbW9kdWxlcy9jbG9uZS1kZWVwL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21lcmdlLWRlZXAvbm9kZV9tb2R1bGVzL2Nsb25lLWRlZXAvbm9kZV9tb2R1bGVzL2Zvci1vd24vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWVyZ2UtZGVlcC9ub2RlX21vZHVsZXMvY2xvbmUtZGVlcC9ub2RlX21vZHVsZXMvZm9yLW93bi9ub2RlX21vZHVsZXMvZm9yLWluL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21lcmdlLWRlZXAvbm9kZV9tb2R1bGVzL2Nsb25lLWRlZXAvbm9kZV9tb2R1bGVzL2lzLXBsYWluLW9iamVjdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tZXJnZS1kZWVwL25vZGVfbW9kdWxlcy9jbG9uZS1kZWVwL25vZGVfbW9kdWxlcy9raW5kLW9mL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21lcmdlLWRlZXAvbm9kZV9tb2R1bGVzL2Nsb25lLWRlZXAvbm9kZV9tb2R1bGVzL21peGluLW9iamVjdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tZXJnZS1kZWVwL25vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmplY3QvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWVyZ2UtZGVlcC9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L25vZGVfbW9kdWxlcy9pc29iamVjdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL2NvbW1vbi9lbnRpdGllcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9jb21tb24vaHRtbF9ibG9ja3MuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvY29tbW9uL2h0bWxfcmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvY29tbW9uL3VybF9zY2hlbWFzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL2NvbW1vbi91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9jb25maWdzL2NvbW1vbm1hcmsuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvY29uZmlncy9kZWZhdWx0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL2NvbmZpZ3MvZnVsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9oZWxwZXJzL25vcm1hbGl6ZV9saW5rLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL2hlbHBlcnMvbm9ybWFsaXplX3JlZmVyZW5jZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9oZWxwZXJzL3BhcnNlX2xpbmtfZGVzdGluYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvaGVscGVycy9wYXJzZV9saW5rX2xhYmVsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL2hlbHBlcnMvcGFyc2VfbGlua190aXRsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9wYXJzZXJfYmxvY2suanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcGFyc2VyX2NvcmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcGFyc2VyX2lubGluZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9yZW5kZXJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19ibG9jay9ibG9ja3F1b3RlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2Jsb2NrL2NvZGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svZGVmbGlzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19ibG9jay9mZW5jZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svZm9vdG5vdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svaGVhZGluZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19ibG9jay9oci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19ibG9jay9odG1sYmxvY2suanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svbGhlYWRpbmcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svbGlzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19ibG9jay9wYXJhZ3JhcGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svc3RhdGVfYmxvY2suanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfYmxvY2svdGFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfY29yZS9hYmJyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2NvcmUvYWJicjIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfY29yZS9ibG9jay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19jb3JlL2Zvb3Rub3RlX3RhaWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfY29yZS9pbmxpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfY29yZS9saW5raWZ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2NvcmUvcmVmZXJlbmNlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19jb3JlL3JlcGxhY2VtZW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19jb3JlL3NtYXJ0cXVvdGVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2lubGluZS9hdXRvbGluay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19pbmxpbmUvYmFja3RpY2tzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2lubGluZS9kZWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL2VtcGhhc2lzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2lubGluZS9lbnRpdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL2VzY2FwZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19pbmxpbmUvZm9vdG5vdGVfaW5saW5lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2lubGluZS9mb290bm90ZV9yZWYuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL2h0bWx0YWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL2lucy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19pbmxpbmUvbGlua3MuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL21hcmsuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL25ld2xpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL3N0YXRlX2lubGluZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZW1hcmthYmxlL2xpYi9ydWxlc19pbmxpbmUvc3ViLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWFya2FibGUvbGliL3J1bGVzX2lubGluZS9zdXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9saWIvcnVsZXNfaW5saW5lL3RleHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtYXJrYWJsZS9ub2RlX21vZHVsZXMvYXV0b2xpbmtlci9kaXN0L0F1dG9saW5rZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN6QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNuRCxJQUFJLElBQUksR0FBRztFQUNULFFBQVEsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUM7QUFDL0MsQ0FBQyxDQUFDOztBQUVGLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUU7RUFDekMsT0FBTyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUM7O0FBRUgsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsS0FBSyxDQUFDLE1BQU07RUFDVixvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsQ0FBQyxZQUFBLEVBQVksQ0FBRSxJQUFLLENBQUEsQ0FBRyxDQUFBO0lBQ3JELFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQ25DLENBQUMsQ0FBQzs7QUFFRixLQUFLLENBQUMsTUFBTTtFQUNWLG9CQUFDLGFBQWEsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLFlBQUEsRUFBWSxDQUFFLElBQUssQ0FBQSxDQUFHLENBQUE7SUFDeEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7Q0FDbEMsQ0FBQzs7OztBQ3ZCRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0EsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLElBQUksRUFBRSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7O0FBRTFCLG1DQUFtQztBQUNuQyxJQUFJLDZCQUE2Qix1QkFBQTtFQUMvQixNQUFNLEVBQUUsV0FBVztJQUNqQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDMUQ7TUFDRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFNBQVUsQ0FBQSxFQUFBO1FBQ3ZCLG9CQUFBLElBQUcsRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsZUFBZ0IsQ0FBQSxFQUFBO1VBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTztRQUNoQixDQUFBLEVBQUE7UUFDTCxvQkFBQSxNQUFLLEVBQUEsQ0FBQSxDQUFDLHVCQUFBLEVBQXVCLENBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFFLENBQUEsQ0FBRyxDQUFBO01BQ2xELENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsaURBQWlEO0FBQ2pELElBQUksaUNBQWlDLDJCQUFBO0VBQ25DLFlBQVksRUFBRSxVQUFVLENBQUMsRUFBRTtJQUN6QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwRCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ3BCLE9BQU87S0FDUjtJQUNELElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDeEM7RUFDRCxNQUFNLEVBQUUsV0FBVztJQUNqQjtNQUNFLG9CQUFBLE1BQUssRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsYUFBQSxFQUFhLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLFlBQWMsQ0FBQSxFQUFBO1FBQ3pELG9CQUFBLE9BQU0sRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUMsTUFBQSxFQUFNLENBQUMsV0FBQSxFQUFXLENBQUMsV0FBQSxFQUFXLENBQUMsR0FBQSxFQUFHLENBQUMsUUFBUSxDQUFBLENBQUcsQ0FBQSxFQUFBLG9CQUFBLElBQUcsRUFBQSxJQUFFLENBQUEsRUFBQTtRQUMvRCxvQkFBQSxVQUFTLEVBQUEsQ0FBQSxDQUFDLFdBQUEsRUFBVyxDQUFDLGtCQUFBLEVBQWtCLENBQUMsR0FBQSxFQUFHLENBQUMsTUFBTSxDQUFBLENBQUcsQ0FBQSxFQUFBLG9CQUFBLElBQUcsRUFBQSxJQUFFLENBQUEsRUFBQTtRQUMzRCxvQkFBQSxPQUFNLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFFBQUEsRUFBUSxDQUFDLEtBQUEsRUFBSyxDQUFDLE1BQU0sQ0FBQSxDQUFHLENBQUE7TUFDL0IsQ0FBQTtNQUNQO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCw0QkFBNEI7QUFDNUIsSUFBSSxpQ0FBaUMsMkJBQUE7RUFDbkMsTUFBTSxFQUFFLFdBQVc7SUFDakIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTyxFQUFFO01BQ3hEO1FBQ0Usb0JBQUMsT0FBTyxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxPQUFPLENBQUMsR0FBRyxFQUFDLENBQUMsTUFBQSxFQUFNLENBQUUsT0FBTyxDQUFDLE1BQVEsQ0FBQSxFQUFBO1VBQ2hELE9BQU8sQ0FBQyxJQUFLO1FBQ04sQ0FBQTtRQUNWO0tBQ0gsQ0FBQyxDQUFDO0lBQ0g7TUFDRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGFBQWMsQ0FBQSxFQUFBO1FBQzFCLFlBQWE7TUFDVixDQUFBO01BQ047R0FDSDtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILCtFQUErRTtBQUMvRSxJQUFJLGdDQUFnQywwQkFBQTtBQUNwQyxFQUFFLHNCQUFzQixFQUFFLFlBQVk7O0lBRWxDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM3QjtFQUNELG1CQUFtQixFQUFFLFVBQVUsT0FBTyxFQUFFO0lBQ3RDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzNCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUNoQztFQUNELGVBQWUsRUFBRSxZQUFZO0lBQzNCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7R0FDdEM7RUFDRCxpQkFBaUIsRUFBRSxZQUFZO0lBQzdCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQzlCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNuRTtFQUNELE1BQU0sRUFBRSxXQUFXO0lBQ2pCO01BQ0Usb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxZQUFhLENBQUEsRUFBQTtRQUMxQixvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBLFVBQWEsQ0FBQSxFQUFBO1FBQ2pCLG9CQUFDLFdBQVcsRUFBQSxDQUFBLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUEsQ0FBRyxDQUFBLEVBQUE7UUFDdEMsb0JBQUMsV0FBVyxFQUFBLENBQUEsQ0FBQyxlQUFBLEVBQWUsQ0FBRSxJQUFJLENBQUMsbUJBQW9CLENBQUEsQ0FBRyxDQUFBO01BQ3RELENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsK0JBQStCO0FBQy9CLElBQUksOEJBQThCLHdCQUFBO0VBQ2hDLE1BQU0sRUFBRSxXQUFXO0lBQ2pCO01BQ0Usb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxVQUFXLENBQUEsRUFBQTtRQUN4QixvQkFBQyxVQUFVLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLENBQUMsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFhLENBQUEsQ0FBRyxDQUFBO01BQ3hFLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7QUN0RzFCO0FBQ0EsZ0JBQWdCO0FBQ2hCLElBQUksMEJBQTBCLG9CQUFBO0VBQzVCLE1BQU0sRUFBRSxXQUFXO0lBQ2pCO01BQ0Usb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxNQUFPLENBQUEsRUFBQTtRQUNwQixvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQVcsQ0FBQSxFQUFBO1VBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUztRQUNsQixDQUFBO01BQ0QsQ0FBQTtNQUNOO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCx5QkFBeUI7QUFDekIsSUFBSSw4QkFBOEIsd0JBQUE7RUFDaEMsTUFBTSxFQUFFLFdBQVc7SUFDakIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFO01BQ2xEO1FBQ0Usb0JBQUMsSUFBSSxFQUFBLENBQUEsQ0FBQyxHQUFBLEVBQUcsQ0FBRSxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUMsUUFBQSxFQUFRLENBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQSxDQUFHLENBQUE7UUFDOUM7S0FDSCxDQUFDLENBQUM7SUFDSDtNQUNFLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsU0FBQSxFQUFTLENBQUMsVUFBVyxDQUFBLEVBQUE7UUFDdkIsU0FBVTtNQUNQLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsNkRBQTZEO0FBQzdELElBQUksbUNBQW1DLDZCQUFBO0VBQ3JDLG1CQUFtQixFQUFFLFlBQVk7SUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzdCO0VBQ0QsZUFBZSxFQUFFLFlBQVk7SUFDM0IsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztHQUN0QztFQUNELGlCQUFpQixFQUFFLFlBQVk7SUFDN0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDM0IsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ2hFO0VBQ0QsTUFBTSxFQUFFLFdBQVc7SUFDakI7TUFDRSxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLGVBQWdCLENBQUEsRUFBQTtRQUM3QixvQkFBQSxJQUFHLEVBQUEsSUFBQyxFQUFBLGNBQWlCLENBQUEsRUFBQTtRQUNyQixvQkFBQyxRQUFRLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFBLENBQUcsQ0FBQTtNQUMvQixDQUFBO01BQ047R0FDSDtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDOzs7O0FDckQvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgbWVyZ2UgPSByZXF1aXJlKCdtZXJnZS1kZWVwJyk7XG52YXIgQ29tbWVudHMgPSByZXF1aXJlKCcuL0NvbW1lbnRzLmpzeCcpO1xudmFyIFVzZXJTdGF0dXNCb3ggPSByZXF1aXJlKCcuL1VzZXJTdGF0dXNCb3guanN4Jyk7XG52YXIgZGF0YSA9IHtcbiAgY29tbWVudHM6IHJlcXVpcmUoJy4uLy4uL2RhdGEvY29tbWVudHMuanNvbicpXG59O1xuXG52YXIgcmVtb3RlID0gbWVyZ2Uoe30sIGRhdGEpO1xucmVtb3RlLmNvbW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgY29tbWVudC5hdXRob3IgKz0gXCIgcmVtb3RlXCI7XG59KTtcblxudmFyIG9yaWcgPSBtZXJnZSh7fSwgZGF0YSk7XG5cblJlYWN0LnJlbmRlcihcbiAgPENvbW1lbnRzIGRhdGE9e3JlbW90ZS5jb21tZW50c30gcG9sbEludGVydmFsPXsyMDAwfSAvPlxuICAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAxJylcbik7XG5cblJlYWN0LnJlbmRlcihcbiAgPFVzZXJTdGF0dXNCb3ggZGF0YT17b3JpZy5jb21tZW50c30gcG9sbEludGVydmFsPXsyNTAwfSAvPlxuICAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAyJylcbik7XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG4gIHsgXCJrZXlcIjogXCJQZXRlXCIsIFwiYXV0aG9yXCI6IFwiUGV0ZSBIdW50XCIsIFwidGV4dFwiOiBcIlRoaXMgaXMgb25lIGNvbW1lbnRcIiB9LFxuICB7IFwia2V5XCI6IFwiSm9yZGFuXCIsIFwiYXV0aG9yXCI6IFwiSm9yZGFuIFdhbGtlXCIsIFwidGV4dFwiOiBcIlRoaXMgaXMgKmFub3RoZXIqIGNvbW1lbnRcIiB9XG5dXG4iLCJcbnZhciBSZW1hcmthYmxlID0gcmVxdWlyZSgncmVtYXJrYWJsZScpO1xudmFyIG1kID0gbmV3IFJlbWFya2FibGUoKTtcblxuLy8gUmVuZGVyIGEgY29tbWVudCB1c2luZyBtYXJrZG93bi5cbnZhciBDb21tZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYXdNYXJrdXAgPSBtZC5yZW5kZXIodGhpcy5wcm9wcy5jaGlsZHJlbi50b1N0cmluZygpKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb21tZW50XCI+XG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJjb21tZW50QXV0aG9yXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuYXV0aG9yfVxuICAgICAgICA8L2gyPlxuICAgICAgICA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogcmF3TWFya3VwfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyBDcmVhdGUgYSBmb3JtIHRoYXQgYWxsb3dzIGFkZGluZyBhIG5ldyBjb21tZW50XG52YXIgQ29tbWVudEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGF1dGhvciA9IHRoaXMucmVmcy5hdXRob3IuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICB2YXIgdGV4dCA9IHRoaXMucmVmcy50ZXh0LmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgaWYgKCF0ZXh0IHx8ICFhdXRob3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5vbkNvbW1lbnRTdWJtaXQoe2F1dGhvcjogYXV0aG9yLCB0ZXh0OiB0ZXh0fSk7XG4gICAgdGhpcy5yZWZzLmF1dGhvci5nZXRET01Ob2RlKCkudmFsdWUgPSAnJztcbiAgICB0aGlzLnJlZnMudGV4dC5nZXRET01Ob2RlKCkudmFsdWUgPSAnJztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiY29tbWVudEZvcm1cIiBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIllvdXIgbmFtZVwiIHJlZj1cImF1dGhvclwiIC8+PGJyLz5cbiAgICAgICAgPHRleHRhcmVhIHBsYWNlaG9sZGVyPVwiU2F5IHNvbWV0aGluZy4uLlwiIHJlZj1cInRleHRcIiAvPjxici8+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJQb3N0XCIgLz5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG59KTtcblxuLy8gUmVuZGVyIGEgbGlzdCBvZiBjb21tZW50c1xudmFyIENvbW1lbnRMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21tZW50Tm9kZXMgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29tbWVudCBrZXk9e2NvbW1lbnQua2V5fSBhdXRob3I9e2NvbW1lbnQuYXV0aG9yfT5cbiAgICAgICAgICB7Y29tbWVudC50ZXh0fVxuICAgICAgICA8L0NvbW1lbnQ+XG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRMaXN0XCI+XG4gICAgICAgIHtjb21tZW50Tm9kZXN9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuLy8gVGhlIENvbW1lbnRCb3ggaGFuZGxlcyBsaXN0aW5nIGNvbW1lbnRzIGFuZCBzaG93aW5nIGEgZm9ybSBmb3IgbmV3IGNvbW1lbnRzLlxudmFyIENvbW1lbnRCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGxvYWRDb21tZW50c0Zyb21TZXJ2ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBnZXQgZnJvbSBzZXJ2ZXJcbiAgICB2YXIgZGF0YSA9IHRoaXMuc3RhdGUuZGF0YTtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBkYXRhfSk7XG4gIH0sXG4gIGhhbmRsZUNvbW1lbnRTdWJtaXQ6IGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLnN0YXRlLmRhdGE7XG4gICAgdmFyIG5ld0RhdGEgPSBkYXRhLmNvbmNhdChbY29tbWVudF0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IG5ld0RhdGF9KTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtkYXRhOiB0aGlzLnByb3BzLmRhdGEgfHwgW119O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlcigpO1xuICAgIHNldEludGVydmFsKHRoaXMubG9hZENvbW1lbnRzRnJvbVNlcnZlciwgdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWwpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbW1lbnRCb3hcIj5cbiAgICAgICAgPGgxPkNvbW1lbnRzPC9oMT5cbiAgICAgICAgPENvbW1lbnRMaXN0IGRhdGE9e3RoaXMuc3RhdGUuZGF0YX0gLz5cbiAgICAgICAgPENvbW1lbnRGb3JtIG9uQ29tbWVudFN1Ym1pdD17dGhpcy5oYW5kbGVDb21tZW50U3VibWl0fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbi8vIFdyYXBwZXIgYXJvdW5kIGEgY29tbWVudCBib3hcbnZhciBDb21tZW50cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb21tZW50c1wiPlxuICAgICAgICA8Q29tbWVudEJveCBkYXRhPXt0aGlzLnByb3BzLmRhdGF9IHBvbGxJbnRlcnZhbD17dGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWx9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21tZW50cztcbiIsIlxuLy8gUmVuZGVyIGEgdXNlclxudmFyIFVzZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXNlclwiPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidXNlck5hbWVcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy51c2VybmFtZX1cbiAgICAgICAgPC9oMz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyBSZW5kZXIgYSBsaXN0IG9mIHVzZXJzXG52YXIgVXNlckxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJOb2RlcyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxVc2VyIGtleT17dXNlci5rZXl9IHVzZXJuYW1lPXt1c2VyLmF1dGhvcn0gLz5cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXNlckxpc3RcIj5cbiAgICAgICAge3VzZXJOb2Rlc31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG4vLyBUaGUgVXNlclN0YXR1c0JveCBoYW5kbGVzIGdldHRpbmcgdXNlcnMgYW5kIHJlbmRlcmluZyB0aGVtXG52YXIgVXNlclN0YXR1c0JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbG9hZFVzZXJzRnJvbVNlcnZlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0gdGhpcy5zdGF0ZS5kYXRhO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IGRhdGF9KTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtkYXRhOiB0aGlzLnByb3BzLmRhdGEgfHwgW119O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZFVzZXJzRnJvbVNlcnZlcigpO1xuICAgIHNldEludGVydmFsKHRoaXMubG9hZFVzZXJzRnJvbVNlcnZlciwgdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWwpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlVzZXJTdGF0dXNCb3hcIj5cbiAgICAgICAgPGgxPk9ubGluZSBVc2VyczwvaDE+XG4gICAgICAgIDxVc2VyTGlzdCBkYXRhPXt0aGlzLnN0YXRlLmRhdGF9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyU3RhdHVzQm94O1xuIiwiLyohXG4gKiBtZXJnZS1kZWVwIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9tZXJnZS1kZWVwPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBKb24gU2NobGlua2VydC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjbG9uZURlZXAgPSByZXF1aXJlKCdjbG9uZS1kZWVwJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpcy1wbGFpbi1vYmplY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZShvcmlnLCBvYmplY3RzKSB7XG4gIGlmICghb3JpZyB8fCAhb2JqZWN0cykgeyByZXR1cm4gb3JpZyB8fCB7fTsgfVxuXG4gIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgdmFyIG8gPSBjbG9uZURlZXAob3JpZyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBvYmogPSBhcmd1bWVudHNbaSArIDFdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFoYXNPd24ob2JqLCBrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsID0gb2JqW2tleV07XG4gICAgICBpZiAoaXNPYmplY3QodmFsKSAmJiBpc09iamVjdChvW2tleV0pKSB7XG4gICAgICAgIG9ba2V5XSA9IG1lcmdlKG9ba2V5XSwgdmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ba2V5XSA9IGNsb25lRGVlcCh2YWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbztcbn07XG5cbmZ1bmN0aW9uIGhhc093bihvYmosIGtleSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuaWNlc1xuICovXG5cbnZhciB0eXBlT2YgPSByZXF1aXJlKCdraW5kLW9mJyk7XG52YXIgZm9yT3duID0gcmVxdWlyZSgnZm9yLW93bicpO1xudmFyIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCdpcy1wbGFpbi1vYmplY3QnKTtcbnZhciBtaXhpbiA9IHJlcXVpcmUoJ21peGluLW9iamVjdCcpO1xuXG5cbi8qKlxuICogUmVjdXJzaXZlbHkgY2xvbmUgbmF0aXZlIHR5cGVzLlxuICovXG5cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWwsIGluc3RhbmNlQ2xvbmUpIHtcbiAgc3dpdGNoICh0eXBlT2YodmFsKSkge1xuICBjYXNlICdvYmplY3QnOlxuICAgIHJldHVybiBjbG9uZU9iamVjdERlZXAodmFsLCBpbnN0YW5jZUNsb25lKTtcbiAgY2FzZSAnYXJyYXknOlxuICAgIHJldHVybiBjbG9uZUFycmF5RGVlcCh2YWwsIGluc3RhbmNlQ2xvbmUpO1xuICBkZWZhdWx0OlxuICAgIHJldHVybiBjbG9uZSh2YWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsb25lT2JqZWN0RGVlcChvYmosIGluc3RhbmNlQ2xvbmUpIHtcbiAgaWYgKGlzUGxhaW5PYmplY3Qob2JqKSkge1xuICAgIHZhciByZXMgPSB7fTtcbiAgICBmb3JPd24ob2JqLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgIHRoaXNba2V5XSA9IGNsb25lRGVlcChvYmosIGluc3RhbmNlQ2xvbmUpO1xuICAgIH0sIHJlcyk7XG4gICAgcmV0dXJuIHJlcztcbiAgfSBlbHNlIGlmIChpbnN0YW5jZUNsb25lKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlQ2xvbmUob2JqKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsb25lQXJyYXlEZWVwKGFyciwgaW5zdGFuY2VDbG9uZSkge1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIHJlcyA9IFtdO1xuICB2YXIgaSA9IC0xO1xuXG4gIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICByZXNbaV0gPSBjbG9uZURlZXAoYXJyW2ldLCBpbnN0YW5jZUNsb25lKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBjbG9uZSh2YWwpIHtcbiAgc3dpdGNoICh0eXBlT2YodmFsKSkge1xuICBjYXNlICdvYmplY3QnOlxuICAgIHJldHVybiBjbG9uZU9iamVjdCh2YWwpO1xuICBjYXNlICdhcnJheSc6XG4gICAgcmV0dXJuIGNsb25lQXJyYXkodmFsKTtcbiAgY2FzZSAncmVnZXhwJzpcbiAgICByZXR1cm4gY2xvbmVSZWdFeHAodmFsKTtcbiAgY2FzZSAnZGF0ZSc6XG4gICAgcmV0dXJuIGNsb25lRGF0ZSh2YWwpO1xuICBkZWZhdWx0OlxuICAgIHJldHVybiB2YWw7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xvbmVPYmplY3Qob2JqKSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gbWl4aW4oe30sIG9iaik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbG9uZVJlZ0V4cChyZSkge1xuICB2YXIgZmxhZ3MgPSAnJztcbiAgZmxhZ3MgKz0gcmUubXVsdGlsaW5lID8gJ20nIDogJyc7XG4gIGZsYWdzICs9IHJlLmdsb2JhbCA/ICdnJyA6ICcnO1xuICBmbGFncyArPSByZS5pZ25vcmVjYXNlID8gJ2knIDogJyc7XG4gIHJldHVybiBuZXcgUmVnRXhwKHJlLnNvdXJjZSwgZmxhZ3MpO1xufVxuXG5mdW5jdGlvbiBjbG9uZURhdGUoZGF0ZSkge1xuICByZXR1cm4gbmV3IERhdGUoK2RhdGUpO1xufVxuXG5mdW5jdGlvbiBjbG9uZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyLnNsaWNlKCk7XG59XG5cbi8qKlxuICogRXhwb3NlIGBjbG9uZURlZXBgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZURlZXA7IiwiLyohXG4gKiBmb3Itb3duIDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9mb3Itb3duPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9ySW4gPSByZXF1aXJlKCdmb3ItaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JPd24obywgZm4sIHRoaXNBcmcpIHtcbiAgZm9ySW4obywgZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgaWYgKGhhc093bihvLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzQXJnLCBvW2tleV0sIGtleSwgbyk7XG4gICAgfVxuICB9KTtcbn07XG5cbmZ1bmN0aW9uIGhhc093bihvLCBwcm9wKSB7XG4gIHJldHVybiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHByb3ApO1xufVxuIiwiLyohXG4gKiBmb3ItaW4gPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2Zvci1pbj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgSm9uIFNjaGxpbmtlcnQsIGNvbnRyaWJ1dG9ycy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JJbihvLCBmbiwgdGhpc0FyZykge1xuICBmb3IgKHZhciBrZXkgaW4gbykge1xuICAgIGlmIChmbi5jYWxsKHRoaXNBcmcsIG9ba2V5XSwga2V5LCBvKSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufTsiLCIvKiFcbiAqIGlzLXBsYWluLW9iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtcGxhaW4tb2JqZWN0PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qobykge1xuICByZXR1cm4gISFvICYmIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBvLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBHZXQgdGhlIG5hdGl2ZSBgdHlwZW9mYCBhIHZhbHVlLlxuICpcbiAqIEBwYXJhbSAgeyp9IGB2YWxgXG4gKiBAcmV0dXJuIHsqfSBOYXRpdmUgamF2YXNjcmlwdCB0eXBlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0eXBlT2YodmFsKSB7XG4gIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICd1bmRlZmluZWQnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWw7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWwpXG4gICAgLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xufTtcbiIsIi8qIVxuICogbWl4aW4tb2JqZWN0IDxodHRwczovL2dpdGh1Yi5jb20vam9uc2NobGlua2VydC9taXhpbi1vYmplY3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEpvbiBTY2hsaW5rZXJ0LCBjb250cmlidXRvcnMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBmb3JPd24gPSByZXF1aXJlKCdmb3Itb3duJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWl4SW4obykge1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuXG4gIGlmIChvID09IG51bGwpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBpZiAobGVuID09PSAwKSB7XG4gICAgcmV0dXJuIG87XG4gIH1cblxuICBmdW5jdGlvbiBjb3B5KHZhbHVlLCBrZXkpIHtcbiAgICB0aGlzW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgb2JqID0gYXJnc1tpXTtcbiAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgIGZvck93bihvYmosIGNvcHksIG8pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbztcbn07IiwiLyohXG4gKiBpcy1wbGFpbi1vYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzLXBsYWluLW9iamVjdD5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgSm9uIFNjaGxpbmtlcnQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpc29iamVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qobykge1xuICByZXR1cm4gaXNPYmplY3QobykgJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufTtcbiIsIi8qIVxuICogaXNvYmplY3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2lzb2JqZWN0PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIGlzIHRoZSB2YWx1ZSBhbiBvYmplY3QsIGFuZCBub3QgYW4gYXJyYXk/XG4gKlxuICogQHBhcmFtICB7Kn0gYHZhbHVlYFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzT2JqZWN0KG8pIHtcbiAgcmV0dXJuIG8gIT0gbnVsbCAmJiB0eXBlb2YgbyA9PT0gJ29iamVjdCdcbiAgICAmJiAhQXJyYXkuaXNBcnJheShvKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvJyk7XG4iLCIvLyBMaXN0IG9mIHZhbGlkIGVudGl0aWVzXG4vL1xuLy8gR2VuZXJhdGUgd2l0aCAuL3N1cHBvcnQvZW50aXRpZXMuanMgc2NyaXB0XG4vL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKmVzbGludCBxdW90ZXM6MCovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgXCJBYWN1dGVcIjpcIlxcdTAwQzFcIixcbiAgXCJhYWN1dGVcIjpcIlxcdTAwRTFcIixcbiAgXCJBYnJldmVcIjpcIlxcdTAxMDJcIixcbiAgXCJhYnJldmVcIjpcIlxcdTAxMDNcIixcbiAgXCJhY1wiOlwiXFx1MjIzRVwiLFxuICBcImFjZFwiOlwiXFx1MjIzRlwiLFxuICBcImFjRVwiOlwiXFx1MjIzRVxcdTAzMzNcIixcbiAgXCJBY2lyY1wiOlwiXFx1MDBDMlwiLFxuICBcImFjaXJjXCI6XCJcXHUwMEUyXCIsXG4gIFwiYWN1dGVcIjpcIlxcdTAwQjRcIixcbiAgXCJBY3lcIjpcIlxcdTA0MTBcIixcbiAgXCJhY3lcIjpcIlxcdTA0MzBcIixcbiAgXCJBRWxpZ1wiOlwiXFx1MDBDNlwiLFxuICBcImFlbGlnXCI6XCJcXHUwMEU2XCIsXG4gIFwiYWZcIjpcIlxcdTIwNjFcIixcbiAgXCJBZnJcIjpcIlxcdUQ4MzVcXHVERDA0XCIsXG4gIFwiYWZyXCI6XCJcXHVEODM1XFx1REQxRVwiLFxuICBcIkFncmF2ZVwiOlwiXFx1MDBDMFwiLFxuICBcImFncmF2ZVwiOlwiXFx1MDBFMFwiLFxuICBcImFsZWZzeW1cIjpcIlxcdTIxMzVcIixcbiAgXCJhbGVwaFwiOlwiXFx1MjEzNVwiLFxuICBcIkFscGhhXCI6XCJcXHUwMzkxXCIsXG4gIFwiYWxwaGFcIjpcIlxcdTAzQjFcIixcbiAgXCJBbWFjclwiOlwiXFx1MDEwMFwiLFxuICBcImFtYWNyXCI6XCJcXHUwMTAxXCIsXG4gIFwiYW1hbGdcIjpcIlxcdTJBM0ZcIixcbiAgXCJBTVBcIjpcIlxcdTAwMjZcIixcbiAgXCJhbXBcIjpcIlxcdTAwMjZcIixcbiAgXCJBbmRcIjpcIlxcdTJBNTNcIixcbiAgXCJhbmRcIjpcIlxcdTIyMjdcIixcbiAgXCJhbmRhbmRcIjpcIlxcdTJBNTVcIixcbiAgXCJhbmRkXCI6XCJcXHUyQTVDXCIsXG4gIFwiYW5kc2xvcGVcIjpcIlxcdTJBNThcIixcbiAgXCJhbmR2XCI6XCJcXHUyQTVBXCIsXG4gIFwiYW5nXCI6XCJcXHUyMjIwXCIsXG4gIFwiYW5nZVwiOlwiXFx1MjlBNFwiLFxuICBcImFuZ2xlXCI6XCJcXHUyMjIwXCIsXG4gIFwiYW5nbXNkXCI6XCJcXHUyMjIxXCIsXG4gIFwiYW5nbXNkYWFcIjpcIlxcdTI5QThcIixcbiAgXCJhbmdtc2RhYlwiOlwiXFx1MjlBOVwiLFxuICBcImFuZ21zZGFjXCI6XCJcXHUyOUFBXCIsXG4gIFwiYW5nbXNkYWRcIjpcIlxcdTI5QUJcIixcbiAgXCJhbmdtc2RhZVwiOlwiXFx1MjlBQ1wiLFxuICBcImFuZ21zZGFmXCI6XCJcXHUyOUFEXCIsXG4gIFwiYW5nbXNkYWdcIjpcIlxcdTI5QUVcIixcbiAgXCJhbmdtc2RhaFwiOlwiXFx1MjlBRlwiLFxuICBcImFuZ3J0XCI6XCJcXHUyMjFGXCIsXG4gIFwiYW5ncnR2YlwiOlwiXFx1MjJCRVwiLFxuICBcImFuZ3J0dmJkXCI6XCJcXHUyOTlEXCIsXG4gIFwiYW5nc3BoXCI6XCJcXHUyMjIyXCIsXG4gIFwiYW5nc3RcIjpcIlxcdTAwQzVcIixcbiAgXCJhbmd6YXJyXCI6XCJcXHUyMzdDXCIsXG4gIFwiQW9nb25cIjpcIlxcdTAxMDRcIixcbiAgXCJhb2dvblwiOlwiXFx1MDEwNVwiLFxuICBcIkFvcGZcIjpcIlxcdUQ4MzVcXHVERDM4XCIsXG4gIFwiYW9wZlwiOlwiXFx1RDgzNVxcdURENTJcIixcbiAgXCJhcFwiOlwiXFx1MjI0OFwiLFxuICBcImFwYWNpclwiOlwiXFx1MkE2RlwiLFxuICBcImFwRVwiOlwiXFx1MkE3MFwiLFxuICBcImFwZVwiOlwiXFx1MjI0QVwiLFxuICBcImFwaWRcIjpcIlxcdTIyNEJcIixcbiAgXCJhcG9zXCI6XCJcXHUwMDI3XCIsXG4gIFwiQXBwbHlGdW5jdGlvblwiOlwiXFx1MjA2MVwiLFxuICBcImFwcHJveFwiOlwiXFx1MjI0OFwiLFxuICBcImFwcHJveGVxXCI6XCJcXHUyMjRBXCIsXG4gIFwiQXJpbmdcIjpcIlxcdTAwQzVcIixcbiAgXCJhcmluZ1wiOlwiXFx1MDBFNVwiLFxuICBcIkFzY3JcIjpcIlxcdUQ4MzVcXHVEQzlDXCIsXG4gIFwiYXNjclwiOlwiXFx1RDgzNVxcdURDQjZcIixcbiAgXCJBc3NpZ25cIjpcIlxcdTIyNTRcIixcbiAgXCJhc3RcIjpcIlxcdTAwMkFcIixcbiAgXCJhc3ltcFwiOlwiXFx1MjI0OFwiLFxuICBcImFzeW1wZXFcIjpcIlxcdTIyNERcIixcbiAgXCJBdGlsZGVcIjpcIlxcdTAwQzNcIixcbiAgXCJhdGlsZGVcIjpcIlxcdTAwRTNcIixcbiAgXCJBdW1sXCI6XCJcXHUwMEM0XCIsXG4gIFwiYXVtbFwiOlwiXFx1MDBFNFwiLFxuICBcImF3Y29uaW50XCI6XCJcXHUyMjMzXCIsXG4gIFwiYXdpbnRcIjpcIlxcdTJBMTFcIixcbiAgXCJiYWNrY29uZ1wiOlwiXFx1MjI0Q1wiLFxuICBcImJhY2tlcHNpbG9uXCI6XCJcXHUwM0Y2XCIsXG4gIFwiYmFja3ByaW1lXCI6XCJcXHUyMDM1XCIsXG4gIFwiYmFja3NpbVwiOlwiXFx1MjIzRFwiLFxuICBcImJhY2tzaW1lcVwiOlwiXFx1MjJDRFwiLFxuICBcIkJhY2tzbGFzaFwiOlwiXFx1MjIxNlwiLFxuICBcIkJhcnZcIjpcIlxcdTJBRTdcIixcbiAgXCJiYXJ2ZWVcIjpcIlxcdTIyQkRcIixcbiAgXCJCYXJ3ZWRcIjpcIlxcdTIzMDZcIixcbiAgXCJiYXJ3ZWRcIjpcIlxcdTIzMDVcIixcbiAgXCJiYXJ3ZWRnZVwiOlwiXFx1MjMwNVwiLFxuICBcImJicmtcIjpcIlxcdTIzQjVcIixcbiAgXCJiYnJrdGJya1wiOlwiXFx1MjNCNlwiLFxuICBcImJjb25nXCI6XCJcXHUyMjRDXCIsXG4gIFwiQmN5XCI6XCJcXHUwNDExXCIsXG4gIFwiYmN5XCI6XCJcXHUwNDMxXCIsXG4gIFwiYmRxdW9cIjpcIlxcdTIwMUVcIixcbiAgXCJiZWNhdXNcIjpcIlxcdTIyMzVcIixcbiAgXCJCZWNhdXNlXCI6XCJcXHUyMjM1XCIsXG4gIFwiYmVjYXVzZVwiOlwiXFx1MjIzNVwiLFxuICBcImJlbXB0eXZcIjpcIlxcdTI5QjBcIixcbiAgXCJiZXBzaVwiOlwiXFx1MDNGNlwiLFxuICBcImJlcm5vdVwiOlwiXFx1MjEyQ1wiLFxuICBcIkJlcm5vdWxsaXNcIjpcIlxcdTIxMkNcIixcbiAgXCJCZXRhXCI6XCJcXHUwMzkyXCIsXG4gIFwiYmV0YVwiOlwiXFx1MDNCMlwiLFxuICBcImJldGhcIjpcIlxcdTIxMzZcIixcbiAgXCJiZXR3ZWVuXCI6XCJcXHUyMjZDXCIsXG4gIFwiQmZyXCI6XCJcXHVEODM1XFx1REQwNVwiLFxuICBcImJmclwiOlwiXFx1RDgzNVxcdUREMUZcIixcbiAgXCJiaWdjYXBcIjpcIlxcdTIyQzJcIixcbiAgXCJiaWdjaXJjXCI6XCJcXHUyNUVGXCIsXG4gIFwiYmlnY3VwXCI6XCJcXHUyMkMzXCIsXG4gIFwiYmlnb2RvdFwiOlwiXFx1MkEwMFwiLFxuICBcImJpZ29wbHVzXCI6XCJcXHUyQTAxXCIsXG4gIFwiYmlnb3RpbWVzXCI6XCJcXHUyQTAyXCIsXG4gIFwiYmlnc3FjdXBcIjpcIlxcdTJBMDZcIixcbiAgXCJiaWdzdGFyXCI6XCJcXHUyNjA1XCIsXG4gIFwiYmlndHJpYW5nbGVkb3duXCI6XCJcXHUyNUJEXCIsXG4gIFwiYmlndHJpYW5nbGV1cFwiOlwiXFx1MjVCM1wiLFxuICBcImJpZ3VwbHVzXCI6XCJcXHUyQTA0XCIsXG4gIFwiYmlndmVlXCI6XCJcXHUyMkMxXCIsXG4gIFwiYmlnd2VkZ2VcIjpcIlxcdTIyQzBcIixcbiAgXCJia2Fyb3dcIjpcIlxcdTI5MERcIixcbiAgXCJibGFja2xvemVuZ2VcIjpcIlxcdTI5RUJcIixcbiAgXCJibGFja3NxdWFyZVwiOlwiXFx1MjVBQVwiLFxuICBcImJsYWNrdHJpYW5nbGVcIjpcIlxcdTI1QjRcIixcbiAgXCJibGFja3RyaWFuZ2xlZG93blwiOlwiXFx1MjVCRVwiLFxuICBcImJsYWNrdHJpYW5nbGVsZWZ0XCI6XCJcXHUyNUMyXCIsXG4gIFwiYmxhY2t0cmlhbmdsZXJpZ2h0XCI6XCJcXHUyNUI4XCIsXG4gIFwiYmxhbmtcIjpcIlxcdTI0MjNcIixcbiAgXCJibGsxMlwiOlwiXFx1MjU5MlwiLFxuICBcImJsazE0XCI6XCJcXHUyNTkxXCIsXG4gIFwiYmxrMzRcIjpcIlxcdTI1OTNcIixcbiAgXCJibG9ja1wiOlwiXFx1MjU4OFwiLFxuICBcImJuZVwiOlwiXFx1MDAzRFxcdTIwRTVcIixcbiAgXCJibmVxdWl2XCI6XCJcXHUyMjYxXFx1MjBFNVwiLFxuICBcImJOb3RcIjpcIlxcdTJBRURcIixcbiAgXCJibm90XCI6XCJcXHUyMzEwXCIsXG4gIFwiQm9wZlwiOlwiXFx1RDgzNVxcdUREMzlcIixcbiAgXCJib3BmXCI6XCJcXHVEODM1XFx1REQ1M1wiLFxuICBcImJvdFwiOlwiXFx1MjJBNVwiLFxuICBcImJvdHRvbVwiOlwiXFx1MjJBNVwiLFxuICBcImJvd3RpZVwiOlwiXFx1MjJDOFwiLFxuICBcImJveGJveFwiOlwiXFx1MjlDOVwiLFxuICBcImJveERMXCI6XCJcXHUyNTU3XCIsXG4gIFwiYm94RGxcIjpcIlxcdTI1NTZcIixcbiAgXCJib3hkTFwiOlwiXFx1MjU1NVwiLFxuICBcImJveGRsXCI6XCJcXHUyNTEwXCIsXG4gIFwiYm94RFJcIjpcIlxcdTI1NTRcIixcbiAgXCJib3hEclwiOlwiXFx1MjU1M1wiLFxuICBcImJveGRSXCI6XCJcXHUyNTUyXCIsXG4gIFwiYm94ZHJcIjpcIlxcdTI1MENcIixcbiAgXCJib3hIXCI6XCJcXHUyNTUwXCIsXG4gIFwiYm94aFwiOlwiXFx1MjUwMFwiLFxuICBcImJveEhEXCI6XCJcXHUyNTY2XCIsXG4gIFwiYm94SGRcIjpcIlxcdTI1NjRcIixcbiAgXCJib3hoRFwiOlwiXFx1MjU2NVwiLFxuICBcImJveGhkXCI6XCJcXHUyNTJDXCIsXG4gIFwiYm94SFVcIjpcIlxcdTI1NjlcIixcbiAgXCJib3hIdVwiOlwiXFx1MjU2N1wiLFxuICBcImJveGhVXCI6XCJcXHUyNTY4XCIsXG4gIFwiYm94aHVcIjpcIlxcdTI1MzRcIixcbiAgXCJib3htaW51c1wiOlwiXFx1MjI5RlwiLFxuICBcImJveHBsdXNcIjpcIlxcdTIyOUVcIixcbiAgXCJib3h0aW1lc1wiOlwiXFx1MjJBMFwiLFxuICBcImJveFVMXCI6XCJcXHUyNTVEXCIsXG4gIFwiYm94VWxcIjpcIlxcdTI1NUNcIixcbiAgXCJib3h1TFwiOlwiXFx1MjU1QlwiLFxuICBcImJveHVsXCI6XCJcXHUyNTE4XCIsXG4gIFwiYm94VVJcIjpcIlxcdTI1NUFcIixcbiAgXCJib3hVclwiOlwiXFx1MjU1OVwiLFxuICBcImJveHVSXCI6XCJcXHUyNTU4XCIsXG4gIFwiYm94dXJcIjpcIlxcdTI1MTRcIixcbiAgXCJib3hWXCI6XCJcXHUyNTUxXCIsXG4gIFwiYm94dlwiOlwiXFx1MjUwMlwiLFxuICBcImJveFZIXCI6XCJcXHUyNTZDXCIsXG4gIFwiYm94VmhcIjpcIlxcdTI1NkJcIixcbiAgXCJib3h2SFwiOlwiXFx1MjU2QVwiLFxuICBcImJveHZoXCI6XCJcXHUyNTNDXCIsXG4gIFwiYm94VkxcIjpcIlxcdTI1NjNcIixcbiAgXCJib3hWbFwiOlwiXFx1MjU2MlwiLFxuICBcImJveHZMXCI6XCJcXHUyNTYxXCIsXG4gIFwiYm94dmxcIjpcIlxcdTI1MjRcIixcbiAgXCJib3hWUlwiOlwiXFx1MjU2MFwiLFxuICBcImJveFZyXCI6XCJcXHUyNTVGXCIsXG4gIFwiYm94dlJcIjpcIlxcdTI1NUVcIixcbiAgXCJib3h2clwiOlwiXFx1MjUxQ1wiLFxuICBcImJwcmltZVwiOlwiXFx1MjAzNVwiLFxuICBcIkJyZXZlXCI6XCJcXHUwMkQ4XCIsXG4gIFwiYnJldmVcIjpcIlxcdTAyRDhcIixcbiAgXCJicnZiYXJcIjpcIlxcdTAwQTZcIixcbiAgXCJCc2NyXCI6XCJcXHUyMTJDXCIsXG4gIFwiYnNjclwiOlwiXFx1RDgzNVxcdURDQjdcIixcbiAgXCJic2VtaVwiOlwiXFx1MjA0RlwiLFxuICBcImJzaW1cIjpcIlxcdTIyM0RcIixcbiAgXCJic2ltZVwiOlwiXFx1MjJDRFwiLFxuICBcImJzb2xcIjpcIlxcdTAwNUNcIixcbiAgXCJic29sYlwiOlwiXFx1MjlDNVwiLFxuICBcImJzb2xoc3ViXCI6XCJcXHUyN0M4XCIsXG4gIFwiYnVsbFwiOlwiXFx1MjAyMlwiLFxuICBcImJ1bGxldFwiOlwiXFx1MjAyMlwiLFxuICBcImJ1bXBcIjpcIlxcdTIyNEVcIixcbiAgXCJidW1wRVwiOlwiXFx1MkFBRVwiLFxuICBcImJ1bXBlXCI6XCJcXHUyMjRGXCIsXG4gIFwiQnVtcGVxXCI6XCJcXHUyMjRFXCIsXG4gIFwiYnVtcGVxXCI6XCJcXHUyMjRGXCIsXG4gIFwiQ2FjdXRlXCI6XCJcXHUwMTA2XCIsXG4gIFwiY2FjdXRlXCI6XCJcXHUwMTA3XCIsXG4gIFwiQ2FwXCI6XCJcXHUyMkQyXCIsXG4gIFwiY2FwXCI6XCJcXHUyMjI5XCIsXG4gIFwiY2FwYW5kXCI6XCJcXHUyQTQ0XCIsXG4gIFwiY2FwYnJjdXBcIjpcIlxcdTJBNDlcIixcbiAgXCJjYXBjYXBcIjpcIlxcdTJBNEJcIixcbiAgXCJjYXBjdXBcIjpcIlxcdTJBNDdcIixcbiAgXCJjYXBkb3RcIjpcIlxcdTJBNDBcIixcbiAgXCJDYXBpdGFsRGlmZmVyZW50aWFsRFwiOlwiXFx1MjE0NVwiLFxuICBcImNhcHNcIjpcIlxcdTIyMjlcXHVGRTAwXCIsXG4gIFwiY2FyZXRcIjpcIlxcdTIwNDFcIixcbiAgXCJjYXJvblwiOlwiXFx1MDJDN1wiLFxuICBcIkNheWxleXNcIjpcIlxcdTIxMkRcIixcbiAgXCJjY2Fwc1wiOlwiXFx1MkE0RFwiLFxuICBcIkNjYXJvblwiOlwiXFx1MDEwQ1wiLFxuICBcImNjYXJvblwiOlwiXFx1MDEwRFwiLFxuICBcIkNjZWRpbFwiOlwiXFx1MDBDN1wiLFxuICBcImNjZWRpbFwiOlwiXFx1MDBFN1wiLFxuICBcIkNjaXJjXCI6XCJcXHUwMTA4XCIsXG4gIFwiY2NpcmNcIjpcIlxcdTAxMDlcIixcbiAgXCJDY29uaW50XCI6XCJcXHUyMjMwXCIsXG4gIFwiY2N1cHNcIjpcIlxcdTJBNENcIixcbiAgXCJjY3Vwc3NtXCI6XCJcXHUyQTUwXCIsXG4gIFwiQ2RvdFwiOlwiXFx1MDEwQVwiLFxuICBcImNkb3RcIjpcIlxcdTAxMEJcIixcbiAgXCJjZWRpbFwiOlwiXFx1MDBCOFwiLFxuICBcIkNlZGlsbGFcIjpcIlxcdTAwQjhcIixcbiAgXCJjZW1wdHl2XCI6XCJcXHUyOUIyXCIsXG4gIFwiY2VudFwiOlwiXFx1MDBBMlwiLFxuICBcIkNlbnRlckRvdFwiOlwiXFx1MDBCN1wiLFxuICBcImNlbnRlcmRvdFwiOlwiXFx1MDBCN1wiLFxuICBcIkNmclwiOlwiXFx1MjEyRFwiLFxuICBcImNmclwiOlwiXFx1RDgzNVxcdUREMjBcIixcbiAgXCJDSGN5XCI6XCJcXHUwNDI3XCIsXG4gIFwiY2hjeVwiOlwiXFx1MDQ0N1wiLFxuICBcImNoZWNrXCI6XCJcXHUyNzEzXCIsXG4gIFwiY2hlY2ttYXJrXCI6XCJcXHUyNzEzXCIsXG4gIFwiQ2hpXCI6XCJcXHUwM0E3XCIsXG4gIFwiY2hpXCI6XCJcXHUwM0M3XCIsXG4gIFwiY2lyXCI6XCJcXHUyNUNCXCIsXG4gIFwiY2lyY1wiOlwiXFx1MDJDNlwiLFxuICBcImNpcmNlcVwiOlwiXFx1MjI1N1wiLFxuICBcImNpcmNsZWFycm93bGVmdFwiOlwiXFx1MjFCQVwiLFxuICBcImNpcmNsZWFycm93cmlnaHRcIjpcIlxcdTIxQkJcIixcbiAgXCJjaXJjbGVkYXN0XCI6XCJcXHUyMjlCXCIsXG4gIFwiY2lyY2xlZGNpcmNcIjpcIlxcdTIyOUFcIixcbiAgXCJjaXJjbGVkZGFzaFwiOlwiXFx1MjI5RFwiLFxuICBcIkNpcmNsZURvdFwiOlwiXFx1MjI5OVwiLFxuICBcImNpcmNsZWRSXCI6XCJcXHUwMEFFXCIsXG4gIFwiY2lyY2xlZFNcIjpcIlxcdTI0QzhcIixcbiAgXCJDaXJjbGVNaW51c1wiOlwiXFx1MjI5NlwiLFxuICBcIkNpcmNsZVBsdXNcIjpcIlxcdTIyOTVcIixcbiAgXCJDaXJjbGVUaW1lc1wiOlwiXFx1MjI5N1wiLFxuICBcImNpckVcIjpcIlxcdTI5QzNcIixcbiAgXCJjaXJlXCI6XCJcXHUyMjU3XCIsXG4gIFwiY2lyZm5pbnRcIjpcIlxcdTJBMTBcIixcbiAgXCJjaXJtaWRcIjpcIlxcdTJBRUZcIixcbiAgXCJjaXJzY2lyXCI6XCJcXHUyOUMyXCIsXG4gIFwiQ2xvY2t3aXNlQ29udG91ckludGVncmFsXCI6XCJcXHUyMjMyXCIsXG4gIFwiQ2xvc2VDdXJseURvdWJsZVF1b3RlXCI6XCJcXHUyMDFEXCIsXG4gIFwiQ2xvc2VDdXJseVF1b3RlXCI6XCJcXHUyMDE5XCIsXG4gIFwiY2x1YnNcIjpcIlxcdTI2NjNcIixcbiAgXCJjbHVic3VpdFwiOlwiXFx1MjY2M1wiLFxuICBcIkNvbG9uXCI6XCJcXHUyMjM3XCIsXG4gIFwiY29sb25cIjpcIlxcdTAwM0FcIixcbiAgXCJDb2xvbmVcIjpcIlxcdTJBNzRcIixcbiAgXCJjb2xvbmVcIjpcIlxcdTIyNTRcIixcbiAgXCJjb2xvbmVxXCI6XCJcXHUyMjU0XCIsXG4gIFwiY29tbWFcIjpcIlxcdTAwMkNcIixcbiAgXCJjb21tYXRcIjpcIlxcdTAwNDBcIixcbiAgXCJjb21wXCI6XCJcXHUyMjAxXCIsXG4gIFwiY29tcGZuXCI6XCJcXHUyMjE4XCIsXG4gIFwiY29tcGxlbWVudFwiOlwiXFx1MjIwMVwiLFxuICBcImNvbXBsZXhlc1wiOlwiXFx1MjEwMlwiLFxuICBcImNvbmdcIjpcIlxcdTIyNDVcIixcbiAgXCJjb25nZG90XCI6XCJcXHUyQTZEXCIsXG4gIFwiQ29uZ3J1ZW50XCI6XCJcXHUyMjYxXCIsXG4gIFwiQ29uaW50XCI6XCJcXHUyMjJGXCIsXG4gIFwiY29uaW50XCI6XCJcXHUyMjJFXCIsXG4gIFwiQ29udG91ckludGVncmFsXCI6XCJcXHUyMjJFXCIsXG4gIFwiQ29wZlwiOlwiXFx1MjEwMlwiLFxuICBcImNvcGZcIjpcIlxcdUQ4MzVcXHVERDU0XCIsXG4gIFwiY29wcm9kXCI6XCJcXHUyMjEwXCIsXG4gIFwiQ29wcm9kdWN0XCI6XCJcXHUyMjEwXCIsXG4gIFwiQ09QWVwiOlwiXFx1MDBBOVwiLFxuICBcImNvcHlcIjpcIlxcdTAwQTlcIixcbiAgXCJjb3B5c3JcIjpcIlxcdTIxMTdcIixcbiAgXCJDb3VudGVyQ2xvY2t3aXNlQ29udG91ckludGVncmFsXCI6XCJcXHUyMjMzXCIsXG4gIFwiY3JhcnJcIjpcIlxcdTIxQjVcIixcbiAgXCJDcm9zc1wiOlwiXFx1MkEyRlwiLFxuICBcImNyb3NzXCI6XCJcXHUyNzE3XCIsXG4gIFwiQ3NjclwiOlwiXFx1RDgzNVxcdURDOUVcIixcbiAgXCJjc2NyXCI6XCJcXHVEODM1XFx1RENCOFwiLFxuICBcImNzdWJcIjpcIlxcdTJBQ0ZcIixcbiAgXCJjc3ViZVwiOlwiXFx1MkFEMVwiLFxuICBcImNzdXBcIjpcIlxcdTJBRDBcIixcbiAgXCJjc3VwZVwiOlwiXFx1MkFEMlwiLFxuICBcImN0ZG90XCI6XCJcXHUyMkVGXCIsXG4gIFwiY3VkYXJybFwiOlwiXFx1MjkzOFwiLFxuICBcImN1ZGFycnJcIjpcIlxcdTI5MzVcIixcbiAgXCJjdWVwclwiOlwiXFx1MjJERVwiLFxuICBcImN1ZXNjXCI6XCJcXHUyMkRGXCIsXG4gIFwiY3VsYXJyXCI6XCJcXHUyMUI2XCIsXG4gIFwiY3VsYXJycFwiOlwiXFx1MjkzRFwiLFxuICBcIkN1cFwiOlwiXFx1MjJEM1wiLFxuICBcImN1cFwiOlwiXFx1MjIyQVwiLFxuICBcImN1cGJyY2FwXCI6XCJcXHUyQTQ4XCIsXG4gIFwiQ3VwQ2FwXCI6XCJcXHUyMjREXCIsXG4gIFwiY3VwY2FwXCI6XCJcXHUyQTQ2XCIsXG4gIFwiY3VwY3VwXCI6XCJcXHUyQTRBXCIsXG4gIFwiY3VwZG90XCI6XCJcXHUyMjhEXCIsXG4gIFwiY3Vwb3JcIjpcIlxcdTJBNDVcIixcbiAgXCJjdXBzXCI6XCJcXHUyMjJBXFx1RkUwMFwiLFxuICBcImN1cmFyclwiOlwiXFx1MjFCN1wiLFxuICBcImN1cmFycm1cIjpcIlxcdTI5M0NcIixcbiAgXCJjdXJseWVxcHJlY1wiOlwiXFx1MjJERVwiLFxuICBcImN1cmx5ZXFzdWNjXCI6XCJcXHUyMkRGXCIsXG4gIFwiY3VybHl2ZWVcIjpcIlxcdTIyQ0VcIixcbiAgXCJjdXJseXdlZGdlXCI6XCJcXHUyMkNGXCIsXG4gIFwiY3VycmVuXCI6XCJcXHUwMEE0XCIsXG4gIFwiY3VydmVhcnJvd2xlZnRcIjpcIlxcdTIxQjZcIixcbiAgXCJjdXJ2ZWFycm93cmlnaHRcIjpcIlxcdTIxQjdcIixcbiAgXCJjdXZlZVwiOlwiXFx1MjJDRVwiLFxuICBcImN1d2VkXCI6XCJcXHUyMkNGXCIsXG4gIFwiY3djb25pbnRcIjpcIlxcdTIyMzJcIixcbiAgXCJjd2ludFwiOlwiXFx1MjIzMVwiLFxuICBcImN5bGN0eVwiOlwiXFx1MjMyRFwiLFxuICBcIkRhZ2dlclwiOlwiXFx1MjAyMVwiLFxuICBcImRhZ2dlclwiOlwiXFx1MjAyMFwiLFxuICBcImRhbGV0aFwiOlwiXFx1MjEzOFwiLFxuICBcIkRhcnJcIjpcIlxcdTIxQTFcIixcbiAgXCJkQXJyXCI6XCJcXHUyMUQzXCIsXG4gIFwiZGFyclwiOlwiXFx1MjE5M1wiLFxuICBcImRhc2hcIjpcIlxcdTIwMTBcIixcbiAgXCJEYXNodlwiOlwiXFx1MkFFNFwiLFxuICBcImRhc2h2XCI6XCJcXHUyMkEzXCIsXG4gIFwiZGJrYXJvd1wiOlwiXFx1MjkwRlwiLFxuICBcImRibGFjXCI6XCJcXHUwMkREXCIsXG4gIFwiRGNhcm9uXCI6XCJcXHUwMTBFXCIsXG4gIFwiZGNhcm9uXCI6XCJcXHUwMTBGXCIsXG4gIFwiRGN5XCI6XCJcXHUwNDE0XCIsXG4gIFwiZGN5XCI6XCJcXHUwNDM0XCIsXG4gIFwiRERcIjpcIlxcdTIxNDVcIixcbiAgXCJkZFwiOlwiXFx1MjE0NlwiLFxuICBcImRkYWdnZXJcIjpcIlxcdTIwMjFcIixcbiAgXCJkZGFyclwiOlwiXFx1MjFDQVwiLFxuICBcIkREb3RyYWhkXCI6XCJcXHUyOTExXCIsXG4gIFwiZGRvdHNlcVwiOlwiXFx1MkE3N1wiLFxuICBcImRlZ1wiOlwiXFx1MDBCMFwiLFxuICBcIkRlbFwiOlwiXFx1MjIwN1wiLFxuICBcIkRlbHRhXCI6XCJcXHUwMzk0XCIsXG4gIFwiZGVsdGFcIjpcIlxcdTAzQjRcIixcbiAgXCJkZW1wdHl2XCI6XCJcXHUyOUIxXCIsXG4gIFwiZGZpc2h0XCI6XCJcXHUyOTdGXCIsXG4gIFwiRGZyXCI6XCJcXHVEODM1XFx1REQwN1wiLFxuICBcImRmclwiOlwiXFx1RDgzNVxcdUREMjFcIixcbiAgXCJkSGFyXCI6XCJcXHUyOTY1XCIsXG4gIFwiZGhhcmxcIjpcIlxcdTIxQzNcIixcbiAgXCJkaGFyclwiOlwiXFx1MjFDMlwiLFxuICBcIkRpYWNyaXRpY2FsQWN1dGVcIjpcIlxcdTAwQjRcIixcbiAgXCJEaWFjcml0aWNhbERvdFwiOlwiXFx1MDJEOVwiLFxuICBcIkRpYWNyaXRpY2FsRG91YmxlQWN1dGVcIjpcIlxcdTAyRERcIixcbiAgXCJEaWFjcml0aWNhbEdyYXZlXCI6XCJcXHUwMDYwXCIsXG4gIFwiRGlhY3JpdGljYWxUaWxkZVwiOlwiXFx1MDJEQ1wiLFxuICBcImRpYW1cIjpcIlxcdTIyQzRcIixcbiAgXCJEaWFtb25kXCI6XCJcXHUyMkM0XCIsXG4gIFwiZGlhbW9uZFwiOlwiXFx1MjJDNFwiLFxuICBcImRpYW1vbmRzdWl0XCI6XCJcXHUyNjY2XCIsXG4gIFwiZGlhbXNcIjpcIlxcdTI2NjZcIixcbiAgXCJkaWVcIjpcIlxcdTAwQThcIixcbiAgXCJEaWZmZXJlbnRpYWxEXCI6XCJcXHUyMTQ2XCIsXG4gIFwiZGlnYW1tYVwiOlwiXFx1MDNERFwiLFxuICBcImRpc2luXCI6XCJcXHUyMkYyXCIsXG4gIFwiZGl2XCI6XCJcXHUwMEY3XCIsXG4gIFwiZGl2aWRlXCI6XCJcXHUwMEY3XCIsXG4gIFwiZGl2aWRlb250aW1lc1wiOlwiXFx1MjJDN1wiLFxuICBcImRpdm9ueFwiOlwiXFx1MjJDN1wiLFxuICBcIkRKY3lcIjpcIlxcdTA0MDJcIixcbiAgXCJkamN5XCI6XCJcXHUwNDUyXCIsXG4gIFwiZGxjb3JuXCI6XCJcXHUyMzFFXCIsXG4gIFwiZGxjcm9wXCI6XCJcXHUyMzBEXCIsXG4gIFwiZG9sbGFyXCI6XCJcXHUwMDI0XCIsXG4gIFwiRG9wZlwiOlwiXFx1RDgzNVxcdUREM0JcIixcbiAgXCJkb3BmXCI6XCJcXHVEODM1XFx1REQ1NVwiLFxuICBcIkRvdFwiOlwiXFx1MDBBOFwiLFxuICBcImRvdFwiOlwiXFx1MDJEOVwiLFxuICBcIkRvdERvdFwiOlwiXFx1MjBEQ1wiLFxuICBcImRvdGVxXCI6XCJcXHUyMjUwXCIsXG4gIFwiZG90ZXFkb3RcIjpcIlxcdTIyNTFcIixcbiAgXCJEb3RFcXVhbFwiOlwiXFx1MjI1MFwiLFxuICBcImRvdG1pbnVzXCI6XCJcXHUyMjM4XCIsXG4gIFwiZG90cGx1c1wiOlwiXFx1MjIxNFwiLFxuICBcImRvdHNxdWFyZVwiOlwiXFx1MjJBMVwiLFxuICBcImRvdWJsZWJhcndlZGdlXCI6XCJcXHUyMzA2XCIsXG4gIFwiRG91YmxlQ29udG91ckludGVncmFsXCI6XCJcXHUyMjJGXCIsXG4gIFwiRG91YmxlRG90XCI6XCJcXHUwMEE4XCIsXG4gIFwiRG91YmxlRG93bkFycm93XCI6XCJcXHUyMUQzXCIsXG4gIFwiRG91YmxlTGVmdEFycm93XCI6XCJcXHUyMUQwXCIsXG4gIFwiRG91YmxlTGVmdFJpZ2h0QXJyb3dcIjpcIlxcdTIxRDRcIixcbiAgXCJEb3VibGVMZWZ0VGVlXCI6XCJcXHUyQUU0XCIsXG4gIFwiRG91YmxlTG9uZ0xlZnRBcnJvd1wiOlwiXFx1MjdGOFwiLFxuICBcIkRvdWJsZUxvbmdMZWZ0UmlnaHRBcnJvd1wiOlwiXFx1MjdGQVwiLFxuICBcIkRvdWJsZUxvbmdSaWdodEFycm93XCI6XCJcXHUyN0Y5XCIsXG4gIFwiRG91YmxlUmlnaHRBcnJvd1wiOlwiXFx1MjFEMlwiLFxuICBcIkRvdWJsZVJpZ2h0VGVlXCI6XCJcXHUyMkE4XCIsXG4gIFwiRG91YmxlVXBBcnJvd1wiOlwiXFx1MjFEMVwiLFxuICBcIkRvdWJsZVVwRG93bkFycm93XCI6XCJcXHUyMUQ1XCIsXG4gIFwiRG91YmxlVmVydGljYWxCYXJcIjpcIlxcdTIyMjVcIixcbiAgXCJEb3duQXJyb3dcIjpcIlxcdTIxOTNcIixcbiAgXCJEb3duYXJyb3dcIjpcIlxcdTIxRDNcIixcbiAgXCJkb3duYXJyb3dcIjpcIlxcdTIxOTNcIixcbiAgXCJEb3duQXJyb3dCYXJcIjpcIlxcdTI5MTNcIixcbiAgXCJEb3duQXJyb3dVcEFycm93XCI6XCJcXHUyMUY1XCIsXG4gIFwiRG93bkJyZXZlXCI6XCJcXHUwMzExXCIsXG4gIFwiZG93bmRvd25hcnJvd3NcIjpcIlxcdTIxQ0FcIixcbiAgXCJkb3duaGFycG9vbmxlZnRcIjpcIlxcdTIxQzNcIixcbiAgXCJkb3duaGFycG9vbnJpZ2h0XCI6XCJcXHUyMUMyXCIsXG4gIFwiRG93bkxlZnRSaWdodFZlY3RvclwiOlwiXFx1Mjk1MFwiLFxuICBcIkRvd25MZWZ0VGVlVmVjdG9yXCI6XCJcXHUyOTVFXCIsXG4gIFwiRG93bkxlZnRWZWN0b3JcIjpcIlxcdTIxQkRcIixcbiAgXCJEb3duTGVmdFZlY3RvckJhclwiOlwiXFx1Mjk1NlwiLFxuICBcIkRvd25SaWdodFRlZVZlY3RvclwiOlwiXFx1Mjk1RlwiLFxuICBcIkRvd25SaWdodFZlY3RvclwiOlwiXFx1MjFDMVwiLFxuICBcIkRvd25SaWdodFZlY3RvckJhclwiOlwiXFx1Mjk1N1wiLFxuICBcIkRvd25UZWVcIjpcIlxcdTIyQTRcIixcbiAgXCJEb3duVGVlQXJyb3dcIjpcIlxcdTIxQTdcIixcbiAgXCJkcmJrYXJvd1wiOlwiXFx1MjkxMFwiLFxuICBcImRyY29yblwiOlwiXFx1MjMxRlwiLFxuICBcImRyY3JvcFwiOlwiXFx1MjMwQ1wiLFxuICBcIkRzY3JcIjpcIlxcdUQ4MzVcXHVEQzlGXCIsXG4gIFwiZHNjclwiOlwiXFx1RDgzNVxcdURDQjlcIixcbiAgXCJEU2N5XCI6XCJcXHUwNDA1XCIsXG4gIFwiZHNjeVwiOlwiXFx1MDQ1NVwiLFxuICBcImRzb2xcIjpcIlxcdTI5RjZcIixcbiAgXCJEc3Ryb2tcIjpcIlxcdTAxMTBcIixcbiAgXCJkc3Ryb2tcIjpcIlxcdTAxMTFcIixcbiAgXCJkdGRvdFwiOlwiXFx1MjJGMVwiLFxuICBcImR0cmlcIjpcIlxcdTI1QkZcIixcbiAgXCJkdHJpZlwiOlwiXFx1MjVCRVwiLFxuICBcImR1YXJyXCI6XCJcXHUyMUY1XCIsXG4gIFwiZHVoYXJcIjpcIlxcdTI5NkZcIixcbiAgXCJkd2FuZ2xlXCI6XCJcXHUyOUE2XCIsXG4gIFwiRFpjeVwiOlwiXFx1MDQwRlwiLFxuICBcImR6Y3lcIjpcIlxcdTA0NUZcIixcbiAgXCJkemlncmFyclwiOlwiXFx1MjdGRlwiLFxuICBcIkVhY3V0ZVwiOlwiXFx1MDBDOVwiLFxuICBcImVhY3V0ZVwiOlwiXFx1MDBFOVwiLFxuICBcImVhc3RlclwiOlwiXFx1MkE2RVwiLFxuICBcIkVjYXJvblwiOlwiXFx1MDExQVwiLFxuICBcImVjYXJvblwiOlwiXFx1MDExQlwiLFxuICBcImVjaXJcIjpcIlxcdTIyNTZcIixcbiAgXCJFY2lyY1wiOlwiXFx1MDBDQVwiLFxuICBcImVjaXJjXCI6XCJcXHUwMEVBXCIsXG4gIFwiZWNvbG9uXCI6XCJcXHUyMjU1XCIsXG4gIFwiRWN5XCI6XCJcXHUwNDJEXCIsXG4gIFwiZWN5XCI6XCJcXHUwNDREXCIsXG4gIFwiZUREb3RcIjpcIlxcdTJBNzdcIixcbiAgXCJFZG90XCI6XCJcXHUwMTE2XCIsXG4gIFwiZURvdFwiOlwiXFx1MjI1MVwiLFxuICBcImVkb3RcIjpcIlxcdTAxMTdcIixcbiAgXCJlZVwiOlwiXFx1MjE0N1wiLFxuICBcImVmRG90XCI6XCJcXHUyMjUyXCIsXG4gIFwiRWZyXCI6XCJcXHVEODM1XFx1REQwOFwiLFxuICBcImVmclwiOlwiXFx1RDgzNVxcdUREMjJcIixcbiAgXCJlZ1wiOlwiXFx1MkE5QVwiLFxuICBcIkVncmF2ZVwiOlwiXFx1MDBDOFwiLFxuICBcImVncmF2ZVwiOlwiXFx1MDBFOFwiLFxuICBcImVnc1wiOlwiXFx1MkE5NlwiLFxuICBcImVnc2RvdFwiOlwiXFx1MkE5OFwiLFxuICBcImVsXCI6XCJcXHUyQTk5XCIsXG4gIFwiRWxlbWVudFwiOlwiXFx1MjIwOFwiLFxuICBcImVsaW50ZXJzXCI6XCJcXHUyM0U3XCIsXG4gIFwiZWxsXCI6XCJcXHUyMTEzXCIsXG4gIFwiZWxzXCI6XCJcXHUyQTk1XCIsXG4gIFwiZWxzZG90XCI6XCJcXHUyQTk3XCIsXG4gIFwiRW1hY3JcIjpcIlxcdTAxMTJcIixcbiAgXCJlbWFjclwiOlwiXFx1MDExM1wiLFxuICBcImVtcHR5XCI6XCJcXHUyMjA1XCIsXG4gIFwiZW1wdHlzZXRcIjpcIlxcdTIyMDVcIixcbiAgXCJFbXB0eVNtYWxsU3F1YXJlXCI6XCJcXHUyNUZCXCIsXG4gIFwiZW1wdHl2XCI6XCJcXHUyMjA1XCIsXG4gIFwiRW1wdHlWZXJ5U21hbGxTcXVhcmVcIjpcIlxcdTI1QUJcIixcbiAgXCJlbXNwXCI6XCJcXHUyMDAzXCIsXG4gIFwiZW1zcDEzXCI6XCJcXHUyMDA0XCIsXG4gIFwiZW1zcDE0XCI6XCJcXHUyMDA1XCIsXG4gIFwiRU5HXCI6XCJcXHUwMTRBXCIsXG4gIFwiZW5nXCI6XCJcXHUwMTRCXCIsXG4gIFwiZW5zcFwiOlwiXFx1MjAwMlwiLFxuICBcIkVvZ29uXCI6XCJcXHUwMTE4XCIsXG4gIFwiZW9nb25cIjpcIlxcdTAxMTlcIixcbiAgXCJFb3BmXCI6XCJcXHVEODM1XFx1REQzQ1wiLFxuICBcImVvcGZcIjpcIlxcdUQ4MzVcXHVERDU2XCIsXG4gIFwiZXBhclwiOlwiXFx1MjJENVwiLFxuICBcImVwYXJzbFwiOlwiXFx1MjlFM1wiLFxuICBcImVwbHVzXCI6XCJcXHUyQTcxXCIsXG4gIFwiZXBzaVwiOlwiXFx1MDNCNVwiLFxuICBcIkVwc2lsb25cIjpcIlxcdTAzOTVcIixcbiAgXCJlcHNpbG9uXCI6XCJcXHUwM0I1XCIsXG4gIFwiZXBzaXZcIjpcIlxcdTAzRjVcIixcbiAgXCJlcWNpcmNcIjpcIlxcdTIyNTZcIixcbiAgXCJlcWNvbG9uXCI6XCJcXHUyMjU1XCIsXG4gIFwiZXFzaW1cIjpcIlxcdTIyNDJcIixcbiAgXCJlcXNsYW50Z3RyXCI6XCJcXHUyQTk2XCIsXG4gIFwiZXFzbGFudGxlc3NcIjpcIlxcdTJBOTVcIixcbiAgXCJFcXVhbFwiOlwiXFx1MkE3NVwiLFxuICBcImVxdWFsc1wiOlwiXFx1MDAzRFwiLFxuICBcIkVxdWFsVGlsZGVcIjpcIlxcdTIyNDJcIixcbiAgXCJlcXVlc3RcIjpcIlxcdTIyNUZcIixcbiAgXCJFcXVpbGlicml1bVwiOlwiXFx1MjFDQ1wiLFxuICBcImVxdWl2XCI6XCJcXHUyMjYxXCIsXG4gIFwiZXF1aXZERFwiOlwiXFx1MkE3OFwiLFxuICBcImVxdnBhcnNsXCI6XCJcXHUyOUU1XCIsXG4gIFwiZXJhcnJcIjpcIlxcdTI5NzFcIixcbiAgXCJlckRvdFwiOlwiXFx1MjI1M1wiLFxuICBcIkVzY3JcIjpcIlxcdTIxMzBcIixcbiAgXCJlc2NyXCI6XCJcXHUyMTJGXCIsXG4gIFwiZXNkb3RcIjpcIlxcdTIyNTBcIixcbiAgXCJFc2ltXCI6XCJcXHUyQTczXCIsXG4gIFwiZXNpbVwiOlwiXFx1MjI0MlwiLFxuICBcIkV0YVwiOlwiXFx1MDM5N1wiLFxuICBcImV0YVwiOlwiXFx1MDNCN1wiLFxuICBcIkVUSFwiOlwiXFx1MDBEMFwiLFxuICBcImV0aFwiOlwiXFx1MDBGMFwiLFxuICBcIkV1bWxcIjpcIlxcdTAwQ0JcIixcbiAgXCJldW1sXCI6XCJcXHUwMEVCXCIsXG4gIFwiZXVyb1wiOlwiXFx1MjBBQ1wiLFxuICBcImV4Y2xcIjpcIlxcdTAwMjFcIixcbiAgXCJleGlzdFwiOlwiXFx1MjIwM1wiLFxuICBcIkV4aXN0c1wiOlwiXFx1MjIwM1wiLFxuICBcImV4cGVjdGF0aW9uXCI6XCJcXHUyMTMwXCIsXG4gIFwiRXhwb25lbnRpYWxFXCI6XCJcXHUyMTQ3XCIsXG4gIFwiZXhwb25lbnRpYWxlXCI6XCJcXHUyMTQ3XCIsXG4gIFwiZmFsbGluZ2RvdHNlcVwiOlwiXFx1MjI1MlwiLFxuICBcIkZjeVwiOlwiXFx1MDQyNFwiLFxuICBcImZjeVwiOlwiXFx1MDQ0NFwiLFxuICBcImZlbWFsZVwiOlwiXFx1MjY0MFwiLFxuICBcImZmaWxpZ1wiOlwiXFx1RkIwM1wiLFxuICBcImZmbGlnXCI6XCJcXHVGQjAwXCIsXG4gIFwiZmZsbGlnXCI6XCJcXHVGQjA0XCIsXG4gIFwiRmZyXCI6XCJcXHVEODM1XFx1REQwOVwiLFxuICBcImZmclwiOlwiXFx1RDgzNVxcdUREMjNcIixcbiAgXCJmaWxpZ1wiOlwiXFx1RkIwMVwiLFxuICBcIkZpbGxlZFNtYWxsU3F1YXJlXCI6XCJcXHUyNUZDXCIsXG4gIFwiRmlsbGVkVmVyeVNtYWxsU3F1YXJlXCI6XCJcXHUyNUFBXCIsXG4gIFwiZmpsaWdcIjpcIlxcdTAwNjZcXHUwMDZBXCIsXG4gIFwiZmxhdFwiOlwiXFx1MjY2RFwiLFxuICBcImZsbGlnXCI6XCJcXHVGQjAyXCIsXG4gIFwiZmx0bnNcIjpcIlxcdTI1QjFcIixcbiAgXCJmbm9mXCI6XCJcXHUwMTkyXCIsXG4gIFwiRm9wZlwiOlwiXFx1RDgzNVxcdUREM0RcIixcbiAgXCJmb3BmXCI6XCJcXHVEODM1XFx1REQ1N1wiLFxuICBcIkZvckFsbFwiOlwiXFx1MjIwMFwiLFxuICBcImZvcmFsbFwiOlwiXFx1MjIwMFwiLFxuICBcImZvcmtcIjpcIlxcdTIyRDRcIixcbiAgXCJmb3JrdlwiOlwiXFx1MkFEOVwiLFxuICBcIkZvdXJpZXJ0cmZcIjpcIlxcdTIxMzFcIixcbiAgXCJmcGFydGludFwiOlwiXFx1MkEwRFwiLFxuICBcImZyYWMxMlwiOlwiXFx1MDBCRFwiLFxuICBcImZyYWMxM1wiOlwiXFx1MjE1M1wiLFxuICBcImZyYWMxNFwiOlwiXFx1MDBCQ1wiLFxuICBcImZyYWMxNVwiOlwiXFx1MjE1NVwiLFxuICBcImZyYWMxNlwiOlwiXFx1MjE1OVwiLFxuICBcImZyYWMxOFwiOlwiXFx1MjE1QlwiLFxuICBcImZyYWMyM1wiOlwiXFx1MjE1NFwiLFxuICBcImZyYWMyNVwiOlwiXFx1MjE1NlwiLFxuICBcImZyYWMzNFwiOlwiXFx1MDBCRVwiLFxuICBcImZyYWMzNVwiOlwiXFx1MjE1N1wiLFxuICBcImZyYWMzOFwiOlwiXFx1MjE1Q1wiLFxuICBcImZyYWM0NVwiOlwiXFx1MjE1OFwiLFxuICBcImZyYWM1NlwiOlwiXFx1MjE1QVwiLFxuICBcImZyYWM1OFwiOlwiXFx1MjE1RFwiLFxuICBcImZyYWM3OFwiOlwiXFx1MjE1RVwiLFxuICBcImZyYXNsXCI6XCJcXHUyMDQ0XCIsXG4gIFwiZnJvd25cIjpcIlxcdTIzMjJcIixcbiAgXCJGc2NyXCI6XCJcXHUyMTMxXCIsXG4gIFwiZnNjclwiOlwiXFx1RDgzNVxcdURDQkJcIixcbiAgXCJnYWN1dGVcIjpcIlxcdTAxRjVcIixcbiAgXCJHYW1tYVwiOlwiXFx1MDM5M1wiLFxuICBcImdhbW1hXCI6XCJcXHUwM0IzXCIsXG4gIFwiR2FtbWFkXCI6XCJcXHUwM0RDXCIsXG4gIFwiZ2FtbWFkXCI6XCJcXHUwM0REXCIsXG4gIFwiZ2FwXCI6XCJcXHUyQTg2XCIsXG4gIFwiR2JyZXZlXCI6XCJcXHUwMTFFXCIsXG4gIFwiZ2JyZXZlXCI6XCJcXHUwMTFGXCIsXG4gIFwiR2NlZGlsXCI6XCJcXHUwMTIyXCIsXG4gIFwiR2NpcmNcIjpcIlxcdTAxMUNcIixcbiAgXCJnY2lyY1wiOlwiXFx1MDExRFwiLFxuICBcIkdjeVwiOlwiXFx1MDQxM1wiLFxuICBcImdjeVwiOlwiXFx1MDQzM1wiLFxuICBcIkdkb3RcIjpcIlxcdTAxMjBcIixcbiAgXCJnZG90XCI6XCJcXHUwMTIxXCIsXG4gIFwiZ0VcIjpcIlxcdTIyNjdcIixcbiAgXCJnZVwiOlwiXFx1MjI2NVwiLFxuICBcImdFbFwiOlwiXFx1MkE4Q1wiLFxuICBcImdlbFwiOlwiXFx1MjJEQlwiLFxuICBcImdlcVwiOlwiXFx1MjI2NVwiLFxuICBcImdlcXFcIjpcIlxcdTIyNjdcIixcbiAgXCJnZXFzbGFudFwiOlwiXFx1MkE3RVwiLFxuICBcImdlc1wiOlwiXFx1MkE3RVwiLFxuICBcImdlc2NjXCI6XCJcXHUyQUE5XCIsXG4gIFwiZ2VzZG90XCI6XCJcXHUyQTgwXCIsXG4gIFwiZ2VzZG90b1wiOlwiXFx1MkE4MlwiLFxuICBcImdlc2RvdG9sXCI6XCJcXHUyQTg0XCIsXG4gIFwiZ2VzbFwiOlwiXFx1MjJEQlxcdUZFMDBcIixcbiAgXCJnZXNsZXNcIjpcIlxcdTJBOTRcIixcbiAgXCJHZnJcIjpcIlxcdUQ4MzVcXHVERDBBXCIsXG4gIFwiZ2ZyXCI6XCJcXHVEODM1XFx1REQyNFwiLFxuICBcIkdnXCI6XCJcXHUyMkQ5XCIsXG4gIFwiZ2dcIjpcIlxcdTIyNkJcIixcbiAgXCJnZ2dcIjpcIlxcdTIyRDlcIixcbiAgXCJnaW1lbFwiOlwiXFx1MjEzN1wiLFxuICBcIkdKY3lcIjpcIlxcdTA0MDNcIixcbiAgXCJnamN5XCI6XCJcXHUwNDUzXCIsXG4gIFwiZ2xcIjpcIlxcdTIyNzdcIixcbiAgXCJnbGFcIjpcIlxcdTJBQTVcIixcbiAgXCJnbEVcIjpcIlxcdTJBOTJcIixcbiAgXCJnbGpcIjpcIlxcdTJBQTRcIixcbiAgXCJnbmFwXCI6XCJcXHUyQThBXCIsXG4gIFwiZ25hcHByb3hcIjpcIlxcdTJBOEFcIixcbiAgXCJnbkVcIjpcIlxcdTIyNjlcIixcbiAgXCJnbmVcIjpcIlxcdTJBODhcIixcbiAgXCJnbmVxXCI6XCJcXHUyQTg4XCIsXG4gIFwiZ25lcXFcIjpcIlxcdTIyNjlcIixcbiAgXCJnbnNpbVwiOlwiXFx1MjJFN1wiLFxuICBcIkdvcGZcIjpcIlxcdUQ4MzVcXHVERDNFXCIsXG4gIFwiZ29wZlwiOlwiXFx1RDgzNVxcdURENThcIixcbiAgXCJncmF2ZVwiOlwiXFx1MDA2MFwiLFxuICBcIkdyZWF0ZXJFcXVhbFwiOlwiXFx1MjI2NVwiLFxuICBcIkdyZWF0ZXJFcXVhbExlc3NcIjpcIlxcdTIyREJcIixcbiAgXCJHcmVhdGVyRnVsbEVxdWFsXCI6XCJcXHUyMjY3XCIsXG4gIFwiR3JlYXRlckdyZWF0ZXJcIjpcIlxcdTJBQTJcIixcbiAgXCJHcmVhdGVyTGVzc1wiOlwiXFx1MjI3N1wiLFxuICBcIkdyZWF0ZXJTbGFudEVxdWFsXCI6XCJcXHUyQTdFXCIsXG4gIFwiR3JlYXRlclRpbGRlXCI6XCJcXHUyMjczXCIsXG4gIFwiR3NjclwiOlwiXFx1RDgzNVxcdURDQTJcIixcbiAgXCJnc2NyXCI6XCJcXHUyMTBBXCIsXG4gIFwiZ3NpbVwiOlwiXFx1MjI3M1wiLFxuICBcImdzaW1lXCI6XCJcXHUyQThFXCIsXG4gIFwiZ3NpbWxcIjpcIlxcdTJBOTBcIixcbiAgXCJHVFwiOlwiXFx1MDAzRVwiLFxuICBcIkd0XCI6XCJcXHUyMjZCXCIsXG4gIFwiZ3RcIjpcIlxcdTAwM0VcIixcbiAgXCJndGNjXCI6XCJcXHUyQUE3XCIsXG4gIFwiZ3RjaXJcIjpcIlxcdTJBN0FcIixcbiAgXCJndGRvdFwiOlwiXFx1MjJEN1wiLFxuICBcImd0bFBhclwiOlwiXFx1Mjk5NVwiLFxuICBcImd0cXVlc3RcIjpcIlxcdTJBN0NcIixcbiAgXCJndHJhcHByb3hcIjpcIlxcdTJBODZcIixcbiAgXCJndHJhcnJcIjpcIlxcdTI5NzhcIixcbiAgXCJndHJkb3RcIjpcIlxcdTIyRDdcIixcbiAgXCJndHJlcWxlc3NcIjpcIlxcdTIyREJcIixcbiAgXCJndHJlcXFsZXNzXCI6XCJcXHUyQThDXCIsXG4gIFwiZ3RybGVzc1wiOlwiXFx1MjI3N1wiLFxuICBcImd0cnNpbVwiOlwiXFx1MjI3M1wiLFxuICBcImd2ZXJ0bmVxcVwiOlwiXFx1MjI2OVxcdUZFMDBcIixcbiAgXCJndm5FXCI6XCJcXHUyMjY5XFx1RkUwMFwiLFxuICBcIkhhY2VrXCI6XCJcXHUwMkM3XCIsXG4gIFwiaGFpcnNwXCI6XCJcXHUyMDBBXCIsXG4gIFwiaGFsZlwiOlwiXFx1MDBCRFwiLFxuICBcImhhbWlsdFwiOlwiXFx1MjEwQlwiLFxuICBcIkhBUkRjeVwiOlwiXFx1MDQyQVwiLFxuICBcImhhcmRjeVwiOlwiXFx1MDQ0QVwiLFxuICBcImhBcnJcIjpcIlxcdTIxRDRcIixcbiAgXCJoYXJyXCI6XCJcXHUyMTk0XCIsXG4gIFwiaGFycmNpclwiOlwiXFx1Mjk0OFwiLFxuICBcImhhcnJ3XCI6XCJcXHUyMUFEXCIsXG4gIFwiSGF0XCI6XCJcXHUwMDVFXCIsXG4gIFwiaGJhclwiOlwiXFx1MjEwRlwiLFxuICBcIkhjaXJjXCI6XCJcXHUwMTI0XCIsXG4gIFwiaGNpcmNcIjpcIlxcdTAxMjVcIixcbiAgXCJoZWFydHNcIjpcIlxcdTI2NjVcIixcbiAgXCJoZWFydHN1aXRcIjpcIlxcdTI2NjVcIixcbiAgXCJoZWxsaXBcIjpcIlxcdTIwMjZcIixcbiAgXCJoZXJjb25cIjpcIlxcdTIyQjlcIixcbiAgXCJIZnJcIjpcIlxcdTIxMENcIixcbiAgXCJoZnJcIjpcIlxcdUQ4MzVcXHVERDI1XCIsXG4gIFwiSGlsYmVydFNwYWNlXCI6XCJcXHUyMTBCXCIsXG4gIFwiaGtzZWFyb3dcIjpcIlxcdTI5MjVcIixcbiAgXCJoa3N3YXJvd1wiOlwiXFx1MjkyNlwiLFxuICBcImhvYXJyXCI6XCJcXHUyMUZGXCIsXG4gIFwiaG9tdGh0XCI6XCJcXHUyMjNCXCIsXG4gIFwiaG9va2xlZnRhcnJvd1wiOlwiXFx1MjFBOVwiLFxuICBcImhvb2tyaWdodGFycm93XCI6XCJcXHUyMUFBXCIsXG4gIFwiSG9wZlwiOlwiXFx1MjEwRFwiLFxuICBcImhvcGZcIjpcIlxcdUQ4MzVcXHVERDU5XCIsXG4gIFwiaG9yYmFyXCI6XCJcXHUyMDE1XCIsXG4gIFwiSG9yaXpvbnRhbExpbmVcIjpcIlxcdTI1MDBcIixcbiAgXCJIc2NyXCI6XCJcXHUyMTBCXCIsXG4gIFwiaHNjclwiOlwiXFx1RDgzNVxcdURDQkRcIixcbiAgXCJoc2xhc2hcIjpcIlxcdTIxMEZcIixcbiAgXCJIc3Ryb2tcIjpcIlxcdTAxMjZcIixcbiAgXCJoc3Ryb2tcIjpcIlxcdTAxMjdcIixcbiAgXCJIdW1wRG93bkh1bXBcIjpcIlxcdTIyNEVcIixcbiAgXCJIdW1wRXF1YWxcIjpcIlxcdTIyNEZcIixcbiAgXCJoeWJ1bGxcIjpcIlxcdTIwNDNcIixcbiAgXCJoeXBoZW5cIjpcIlxcdTIwMTBcIixcbiAgXCJJYWN1dGVcIjpcIlxcdTAwQ0RcIixcbiAgXCJpYWN1dGVcIjpcIlxcdTAwRURcIixcbiAgXCJpY1wiOlwiXFx1MjA2M1wiLFxuICBcIkljaXJjXCI6XCJcXHUwMENFXCIsXG4gIFwiaWNpcmNcIjpcIlxcdTAwRUVcIixcbiAgXCJJY3lcIjpcIlxcdTA0MThcIixcbiAgXCJpY3lcIjpcIlxcdTA0MzhcIixcbiAgXCJJZG90XCI6XCJcXHUwMTMwXCIsXG4gIFwiSUVjeVwiOlwiXFx1MDQxNVwiLFxuICBcImllY3lcIjpcIlxcdTA0MzVcIixcbiAgXCJpZXhjbFwiOlwiXFx1MDBBMVwiLFxuICBcImlmZlwiOlwiXFx1MjFENFwiLFxuICBcIklmclwiOlwiXFx1MjExMVwiLFxuICBcImlmclwiOlwiXFx1RDgzNVxcdUREMjZcIixcbiAgXCJJZ3JhdmVcIjpcIlxcdTAwQ0NcIixcbiAgXCJpZ3JhdmVcIjpcIlxcdTAwRUNcIixcbiAgXCJpaVwiOlwiXFx1MjE0OFwiLFxuICBcImlpaWludFwiOlwiXFx1MkEwQ1wiLFxuICBcImlpaW50XCI6XCJcXHUyMjJEXCIsXG4gIFwiaWluZmluXCI6XCJcXHUyOURDXCIsXG4gIFwiaWlvdGFcIjpcIlxcdTIxMjlcIixcbiAgXCJJSmxpZ1wiOlwiXFx1MDEzMlwiLFxuICBcImlqbGlnXCI6XCJcXHUwMTMzXCIsXG4gIFwiSW1cIjpcIlxcdTIxMTFcIixcbiAgXCJJbWFjclwiOlwiXFx1MDEyQVwiLFxuICBcImltYWNyXCI6XCJcXHUwMTJCXCIsXG4gIFwiaW1hZ2VcIjpcIlxcdTIxMTFcIixcbiAgXCJJbWFnaW5hcnlJXCI6XCJcXHUyMTQ4XCIsXG4gIFwiaW1hZ2xpbmVcIjpcIlxcdTIxMTBcIixcbiAgXCJpbWFncGFydFwiOlwiXFx1MjExMVwiLFxuICBcImltYXRoXCI6XCJcXHUwMTMxXCIsXG4gIFwiaW1vZlwiOlwiXFx1MjJCN1wiLFxuICBcImltcGVkXCI6XCJcXHUwMUI1XCIsXG4gIFwiSW1wbGllc1wiOlwiXFx1MjFEMlwiLFxuICBcImluXCI6XCJcXHUyMjA4XCIsXG4gIFwiaW5jYXJlXCI6XCJcXHUyMTA1XCIsXG4gIFwiaW5maW5cIjpcIlxcdTIyMUVcIixcbiAgXCJpbmZpbnRpZVwiOlwiXFx1MjlERFwiLFxuICBcImlub2RvdFwiOlwiXFx1MDEzMVwiLFxuICBcIkludFwiOlwiXFx1MjIyQ1wiLFxuICBcImludFwiOlwiXFx1MjIyQlwiLFxuICBcImludGNhbFwiOlwiXFx1MjJCQVwiLFxuICBcImludGVnZXJzXCI6XCJcXHUyMTI0XCIsXG4gIFwiSW50ZWdyYWxcIjpcIlxcdTIyMkJcIixcbiAgXCJpbnRlcmNhbFwiOlwiXFx1MjJCQVwiLFxuICBcIkludGVyc2VjdGlvblwiOlwiXFx1MjJDMlwiLFxuICBcImludGxhcmhrXCI6XCJcXHUyQTE3XCIsXG4gIFwiaW50cHJvZFwiOlwiXFx1MkEzQ1wiLFxuICBcIkludmlzaWJsZUNvbW1hXCI6XCJcXHUyMDYzXCIsXG4gIFwiSW52aXNpYmxlVGltZXNcIjpcIlxcdTIwNjJcIixcbiAgXCJJT2N5XCI6XCJcXHUwNDAxXCIsXG4gIFwiaW9jeVwiOlwiXFx1MDQ1MVwiLFxuICBcIklvZ29uXCI6XCJcXHUwMTJFXCIsXG4gIFwiaW9nb25cIjpcIlxcdTAxMkZcIixcbiAgXCJJb3BmXCI6XCJcXHVEODM1XFx1REQ0MFwiLFxuICBcImlvcGZcIjpcIlxcdUQ4MzVcXHVERDVBXCIsXG4gIFwiSW90YVwiOlwiXFx1MDM5OVwiLFxuICBcImlvdGFcIjpcIlxcdTAzQjlcIixcbiAgXCJpcHJvZFwiOlwiXFx1MkEzQ1wiLFxuICBcImlxdWVzdFwiOlwiXFx1MDBCRlwiLFxuICBcIklzY3JcIjpcIlxcdTIxMTBcIixcbiAgXCJpc2NyXCI6XCJcXHVEODM1XFx1RENCRVwiLFxuICBcImlzaW5cIjpcIlxcdTIyMDhcIixcbiAgXCJpc2luZG90XCI6XCJcXHUyMkY1XCIsXG4gIFwiaXNpbkVcIjpcIlxcdTIyRjlcIixcbiAgXCJpc2luc1wiOlwiXFx1MjJGNFwiLFxuICBcImlzaW5zdlwiOlwiXFx1MjJGM1wiLFxuICBcImlzaW52XCI6XCJcXHUyMjA4XCIsXG4gIFwiaXRcIjpcIlxcdTIwNjJcIixcbiAgXCJJdGlsZGVcIjpcIlxcdTAxMjhcIixcbiAgXCJpdGlsZGVcIjpcIlxcdTAxMjlcIixcbiAgXCJJdWtjeVwiOlwiXFx1MDQwNlwiLFxuICBcIml1a2N5XCI6XCJcXHUwNDU2XCIsXG4gIFwiSXVtbFwiOlwiXFx1MDBDRlwiLFxuICBcIml1bWxcIjpcIlxcdTAwRUZcIixcbiAgXCJKY2lyY1wiOlwiXFx1MDEzNFwiLFxuICBcImpjaXJjXCI6XCJcXHUwMTM1XCIsXG4gIFwiSmN5XCI6XCJcXHUwNDE5XCIsXG4gIFwiamN5XCI6XCJcXHUwNDM5XCIsXG4gIFwiSmZyXCI6XCJcXHVEODM1XFx1REQwRFwiLFxuICBcImpmclwiOlwiXFx1RDgzNVxcdUREMjdcIixcbiAgXCJqbWF0aFwiOlwiXFx1MDIzN1wiLFxuICBcIkpvcGZcIjpcIlxcdUQ4MzVcXHVERDQxXCIsXG4gIFwiam9wZlwiOlwiXFx1RDgzNVxcdURENUJcIixcbiAgXCJKc2NyXCI6XCJcXHVEODM1XFx1RENBNVwiLFxuICBcImpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0JGXCIsXG4gIFwiSnNlcmN5XCI6XCJcXHUwNDA4XCIsXG4gIFwianNlcmN5XCI6XCJcXHUwNDU4XCIsXG4gIFwiSnVrY3lcIjpcIlxcdTA0MDRcIixcbiAgXCJqdWtjeVwiOlwiXFx1MDQ1NFwiLFxuICBcIkthcHBhXCI6XCJcXHUwMzlBXCIsXG4gIFwia2FwcGFcIjpcIlxcdTAzQkFcIixcbiAgXCJrYXBwYXZcIjpcIlxcdTAzRjBcIixcbiAgXCJLY2VkaWxcIjpcIlxcdTAxMzZcIixcbiAgXCJrY2VkaWxcIjpcIlxcdTAxMzdcIixcbiAgXCJLY3lcIjpcIlxcdTA0MUFcIixcbiAgXCJrY3lcIjpcIlxcdTA0M0FcIixcbiAgXCJLZnJcIjpcIlxcdUQ4MzVcXHVERDBFXCIsXG4gIFwia2ZyXCI6XCJcXHVEODM1XFx1REQyOFwiLFxuICBcImtncmVlblwiOlwiXFx1MDEzOFwiLFxuICBcIktIY3lcIjpcIlxcdTA0MjVcIixcbiAgXCJraGN5XCI6XCJcXHUwNDQ1XCIsXG4gIFwiS0pjeVwiOlwiXFx1MDQwQ1wiLFxuICBcImtqY3lcIjpcIlxcdTA0NUNcIixcbiAgXCJLb3BmXCI6XCJcXHVEODM1XFx1REQ0MlwiLFxuICBcImtvcGZcIjpcIlxcdUQ4MzVcXHVERDVDXCIsXG4gIFwiS3NjclwiOlwiXFx1RDgzNVxcdURDQTZcIixcbiAgXCJrc2NyXCI6XCJcXHVEODM1XFx1RENDMFwiLFxuICBcImxBYXJyXCI6XCJcXHUyMURBXCIsXG4gIFwiTGFjdXRlXCI6XCJcXHUwMTM5XCIsXG4gIFwibGFjdXRlXCI6XCJcXHUwMTNBXCIsXG4gIFwibGFlbXB0eXZcIjpcIlxcdTI5QjRcIixcbiAgXCJsYWdyYW5cIjpcIlxcdTIxMTJcIixcbiAgXCJMYW1iZGFcIjpcIlxcdTAzOUJcIixcbiAgXCJsYW1iZGFcIjpcIlxcdTAzQkJcIixcbiAgXCJMYW5nXCI6XCJcXHUyN0VBXCIsXG4gIFwibGFuZ1wiOlwiXFx1MjdFOFwiLFxuICBcImxhbmdkXCI6XCJcXHUyOTkxXCIsXG4gIFwibGFuZ2xlXCI6XCJcXHUyN0U4XCIsXG4gIFwibGFwXCI6XCJcXHUyQTg1XCIsXG4gIFwiTGFwbGFjZXRyZlwiOlwiXFx1MjExMlwiLFxuICBcImxhcXVvXCI6XCJcXHUwMEFCXCIsXG4gIFwiTGFyclwiOlwiXFx1MjE5RVwiLFxuICBcImxBcnJcIjpcIlxcdTIxRDBcIixcbiAgXCJsYXJyXCI6XCJcXHUyMTkwXCIsXG4gIFwibGFycmJcIjpcIlxcdTIxRTRcIixcbiAgXCJsYXJyYmZzXCI6XCJcXHUyOTFGXCIsXG4gIFwibGFycmZzXCI6XCJcXHUyOTFEXCIsXG4gIFwibGFycmhrXCI6XCJcXHUyMUE5XCIsXG4gIFwibGFycmxwXCI6XCJcXHUyMUFCXCIsXG4gIFwibGFycnBsXCI6XCJcXHUyOTM5XCIsXG4gIFwibGFycnNpbVwiOlwiXFx1Mjk3M1wiLFxuICBcImxhcnJ0bFwiOlwiXFx1MjFBMlwiLFxuICBcImxhdFwiOlwiXFx1MkFBQlwiLFxuICBcImxBdGFpbFwiOlwiXFx1MjkxQlwiLFxuICBcImxhdGFpbFwiOlwiXFx1MjkxOVwiLFxuICBcImxhdGVcIjpcIlxcdTJBQURcIixcbiAgXCJsYXRlc1wiOlwiXFx1MkFBRFxcdUZFMDBcIixcbiAgXCJsQmFyclwiOlwiXFx1MjkwRVwiLFxuICBcImxiYXJyXCI6XCJcXHUyOTBDXCIsXG4gIFwibGJicmtcIjpcIlxcdTI3NzJcIixcbiAgXCJsYnJhY2VcIjpcIlxcdTAwN0JcIixcbiAgXCJsYnJhY2tcIjpcIlxcdTAwNUJcIixcbiAgXCJsYnJrZVwiOlwiXFx1Mjk4QlwiLFxuICBcImxicmtzbGRcIjpcIlxcdTI5OEZcIixcbiAgXCJsYnJrc2x1XCI6XCJcXHUyOThEXCIsXG4gIFwiTGNhcm9uXCI6XCJcXHUwMTNEXCIsXG4gIFwibGNhcm9uXCI6XCJcXHUwMTNFXCIsXG4gIFwiTGNlZGlsXCI6XCJcXHUwMTNCXCIsXG4gIFwibGNlZGlsXCI6XCJcXHUwMTNDXCIsXG4gIFwibGNlaWxcIjpcIlxcdTIzMDhcIixcbiAgXCJsY3ViXCI6XCJcXHUwMDdCXCIsXG4gIFwiTGN5XCI6XCJcXHUwNDFCXCIsXG4gIFwibGN5XCI6XCJcXHUwNDNCXCIsXG4gIFwibGRjYVwiOlwiXFx1MjkzNlwiLFxuICBcImxkcXVvXCI6XCJcXHUyMDFDXCIsXG4gIFwibGRxdW9yXCI6XCJcXHUyMDFFXCIsXG4gIFwibGRyZGhhclwiOlwiXFx1Mjk2N1wiLFxuICBcImxkcnVzaGFyXCI6XCJcXHUyOTRCXCIsXG4gIFwibGRzaFwiOlwiXFx1MjFCMlwiLFxuICBcImxFXCI6XCJcXHUyMjY2XCIsXG4gIFwibGVcIjpcIlxcdTIyNjRcIixcbiAgXCJMZWZ0QW5nbGVCcmFja2V0XCI6XCJcXHUyN0U4XCIsXG4gIFwiTGVmdEFycm93XCI6XCJcXHUyMTkwXCIsXG4gIFwiTGVmdGFycm93XCI6XCJcXHUyMUQwXCIsXG4gIFwibGVmdGFycm93XCI6XCJcXHUyMTkwXCIsXG4gIFwiTGVmdEFycm93QmFyXCI6XCJcXHUyMUU0XCIsXG4gIFwiTGVmdEFycm93UmlnaHRBcnJvd1wiOlwiXFx1MjFDNlwiLFxuICBcImxlZnRhcnJvd3RhaWxcIjpcIlxcdTIxQTJcIixcbiAgXCJMZWZ0Q2VpbGluZ1wiOlwiXFx1MjMwOFwiLFxuICBcIkxlZnREb3VibGVCcmFja2V0XCI6XCJcXHUyN0U2XCIsXG4gIFwiTGVmdERvd25UZWVWZWN0b3JcIjpcIlxcdTI5NjFcIixcbiAgXCJMZWZ0RG93blZlY3RvclwiOlwiXFx1MjFDM1wiLFxuICBcIkxlZnREb3duVmVjdG9yQmFyXCI6XCJcXHUyOTU5XCIsXG4gIFwiTGVmdEZsb29yXCI6XCJcXHUyMzBBXCIsXG4gIFwibGVmdGhhcnBvb25kb3duXCI6XCJcXHUyMUJEXCIsXG4gIFwibGVmdGhhcnBvb251cFwiOlwiXFx1MjFCQ1wiLFxuICBcImxlZnRsZWZ0YXJyb3dzXCI6XCJcXHUyMUM3XCIsXG4gIFwiTGVmdFJpZ2h0QXJyb3dcIjpcIlxcdTIxOTRcIixcbiAgXCJMZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjFENFwiLFxuICBcImxlZnRyaWdodGFycm93XCI6XCJcXHUyMTk0XCIsXG4gIFwibGVmdHJpZ2h0YXJyb3dzXCI6XCJcXHUyMUM2XCIsXG4gIFwibGVmdHJpZ2h0aGFycG9vbnNcIjpcIlxcdTIxQ0JcIixcbiAgXCJsZWZ0cmlnaHRzcXVpZ2Fycm93XCI6XCJcXHUyMUFEXCIsXG4gIFwiTGVmdFJpZ2h0VmVjdG9yXCI6XCJcXHUyOTRFXCIsXG4gIFwiTGVmdFRlZVwiOlwiXFx1MjJBM1wiLFxuICBcIkxlZnRUZWVBcnJvd1wiOlwiXFx1MjFBNFwiLFxuICBcIkxlZnRUZWVWZWN0b3JcIjpcIlxcdTI5NUFcIixcbiAgXCJsZWZ0dGhyZWV0aW1lc1wiOlwiXFx1MjJDQlwiLFxuICBcIkxlZnRUcmlhbmdsZVwiOlwiXFx1MjJCMlwiLFxuICBcIkxlZnRUcmlhbmdsZUJhclwiOlwiXFx1MjlDRlwiLFxuICBcIkxlZnRUcmlhbmdsZUVxdWFsXCI6XCJcXHUyMkI0XCIsXG4gIFwiTGVmdFVwRG93blZlY3RvclwiOlwiXFx1Mjk1MVwiLFxuICBcIkxlZnRVcFRlZVZlY3RvclwiOlwiXFx1Mjk2MFwiLFxuICBcIkxlZnRVcFZlY3RvclwiOlwiXFx1MjFCRlwiLFxuICBcIkxlZnRVcFZlY3RvckJhclwiOlwiXFx1Mjk1OFwiLFxuICBcIkxlZnRWZWN0b3JcIjpcIlxcdTIxQkNcIixcbiAgXCJMZWZ0VmVjdG9yQmFyXCI6XCJcXHUyOTUyXCIsXG4gIFwibEVnXCI6XCJcXHUyQThCXCIsXG4gIFwibGVnXCI6XCJcXHUyMkRBXCIsXG4gIFwibGVxXCI6XCJcXHUyMjY0XCIsXG4gIFwibGVxcVwiOlwiXFx1MjI2NlwiLFxuICBcImxlcXNsYW50XCI6XCJcXHUyQTdEXCIsXG4gIFwibGVzXCI6XCJcXHUyQTdEXCIsXG4gIFwibGVzY2NcIjpcIlxcdTJBQThcIixcbiAgXCJsZXNkb3RcIjpcIlxcdTJBN0ZcIixcbiAgXCJsZXNkb3RvXCI6XCJcXHUyQTgxXCIsXG4gIFwibGVzZG90b3JcIjpcIlxcdTJBODNcIixcbiAgXCJsZXNnXCI6XCJcXHUyMkRBXFx1RkUwMFwiLFxuICBcImxlc2dlc1wiOlwiXFx1MkE5M1wiLFxuICBcImxlc3NhcHByb3hcIjpcIlxcdTJBODVcIixcbiAgXCJsZXNzZG90XCI6XCJcXHUyMkQ2XCIsXG4gIFwibGVzc2VxZ3RyXCI6XCJcXHUyMkRBXCIsXG4gIFwibGVzc2VxcWd0clwiOlwiXFx1MkE4QlwiLFxuICBcIkxlc3NFcXVhbEdyZWF0ZXJcIjpcIlxcdTIyREFcIixcbiAgXCJMZXNzRnVsbEVxdWFsXCI6XCJcXHUyMjY2XCIsXG4gIFwiTGVzc0dyZWF0ZXJcIjpcIlxcdTIyNzZcIixcbiAgXCJsZXNzZ3RyXCI6XCJcXHUyMjc2XCIsXG4gIFwiTGVzc0xlc3NcIjpcIlxcdTJBQTFcIixcbiAgXCJsZXNzc2ltXCI6XCJcXHUyMjcyXCIsXG4gIFwiTGVzc1NsYW50RXF1YWxcIjpcIlxcdTJBN0RcIixcbiAgXCJMZXNzVGlsZGVcIjpcIlxcdTIyNzJcIixcbiAgXCJsZmlzaHRcIjpcIlxcdTI5N0NcIixcbiAgXCJsZmxvb3JcIjpcIlxcdTIzMEFcIixcbiAgXCJMZnJcIjpcIlxcdUQ4MzVcXHVERDBGXCIsXG4gIFwibGZyXCI6XCJcXHVEODM1XFx1REQyOVwiLFxuICBcImxnXCI6XCJcXHUyMjc2XCIsXG4gIFwibGdFXCI6XCJcXHUyQTkxXCIsXG4gIFwibEhhclwiOlwiXFx1Mjk2MlwiLFxuICBcImxoYXJkXCI6XCJcXHUyMUJEXCIsXG4gIFwibGhhcnVcIjpcIlxcdTIxQkNcIixcbiAgXCJsaGFydWxcIjpcIlxcdTI5NkFcIixcbiAgXCJsaGJsa1wiOlwiXFx1MjU4NFwiLFxuICBcIkxKY3lcIjpcIlxcdTA0MDlcIixcbiAgXCJsamN5XCI6XCJcXHUwNDU5XCIsXG4gIFwiTGxcIjpcIlxcdTIyRDhcIixcbiAgXCJsbFwiOlwiXFx1MjI2QVwiLFxuICBcImxsYXJyXCI6XCJcXHUyMUM3XCIsXG4gIFwibGxjb3JuZXJcIjpcIlxcdTIzMUVcIixcbiAgXCJMbGVmdGFycm93XCI6XCJcXHUyMURBXCIsXG4gIFwibGxoYXJkXCI6XCJcXHUyOTZCXCIsXG4gIFwibGx0cmlcIjpcIlxcdTI1RkFcIixcbiAgXCJMbWlkb3RcIjpcIlxcdTAxM0ZcIixcbiAgXCJsbWlkb3RcIjpcIlxcdTAxNDBcIixcbiAgXCJsbW91c3RcIjpcIlxcdTIzQjBcIixcbiAgXCJsbW91c3RhY2hlXCI6XCJcXHUyM0IwXCIsXG4gIFwibG5hcFwiOlwiXFx1MkE4OVwiLFxuICBcImxuYXBwcm94XCI6XCJcXHUyQTg5XCIsXG4gIFwibG5FXCI6XCJcXHUyMjY4XCIsXG4gIFwibG5lXCI6XCJcXHUyQTg3XCIsXG4gIFwibG5lcVwiOlwiXFx1MkE4N1wiLFxuICBcImxuZXFxXCI6XCJcXHUyMjY4XCIsXG4gIFwibG5zaW1cIjpcIlxcdTIyRTZcIixcbiAgXCJsb2FuZ1wiOlwiXFx1MjdFQ1wiLFxuICBcImxvYXJyXCI6XCJcXHUyMUZEXCIsXG4gIFwibG9icmtcIjpcIlxcdTI3RTZcIixcbiAgXCJMb25nTGVmdEFycm93XCI6XCJcXHUyN0Y1XCIsXG4gIFwiTG9uZ2xlZnRhcnJvd1wiOlwiXFx1MjdGOFwiLFxuICBcImxvbmdsZWZ0YXJyb3dcIjpcIlxcdTI3RjVcIixcbiAgXCJMb25nTGVmdFJpZ2h0QXJyb3dcIjpcIlxcdTI3RjdcIixcbiAgXCJMb25nbGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTI3RkFcIixcbiAgXCJsb25nbGVmdHJpZ2h0YXJyb3dcIjpcIlxcdTI3RjdcIixcbiAgXCJsb25nbWFwc3RvXCI6XCJcXHUyN0ZDXCIsXG4gIFwiTG9uZ1JpZ2h0QXJyb3dcIjpcIlxcdTI3RjZcIixcbiAgXCJMb25ncmlnaHRhcnJvd1wiOlwiXFx1MjdGOVwiLFxuICBcImxvbmdyaWdodGFycm93XCI6XCJcXHUyN0Y2XCIsXG4gIFwibG9vcGFycm93bGVmdFwiOlwiXFx1MjFBQlwiLFxuICBcImxvb3BhcnJvd3JpZ2h0XCI6XCJcXHUyMUFDXCIsXG4gIFwibG9wYXJcIjpcIlxcdTI5ODVcIixcbiAgXCJMb3BmXCI6XCJcXHVEODM1XFx1REQ0M1wiLFxuICBcImxvcGZcIjpcIlxcdUQ4MzVcXHVERDVEXCIsXG4gIFwibG9wbHVzXCI6XCJcXHUyQTJEXCIsXG4gIFwibG90aW1lc1wiOlwiXFx1MkEzNFwiLFxuICBcImxvd2FzdFwiOlwiXFx1MjIxN1wiLFxuICBcImxvd2JhclwiOlwiXFx1MDA1RlwiLFxuICBcIkxvd2VyTGVmdEFycm93XCI6XCJcXHUyMTk5XCIsXG4gIFwiTG93ZXJSaWdodEFycm93XCI6XCJcXHUyMTk4XCIsXG4gIFwibG96XCI6XCJcXHUyNUNBXCIsXG4gIFwibG96ZW5nZVwiOlwiXFx1MjVDQVwiLFxuICBcImxvemZcIjpcIlxcdTI5RUJcIixcbiAgXCJscGFyXCI6XCJcXHUwMDI4XCIsXG4gIFwibHBhcmx0XCI6XCJcXHUyOTkzXCIsXG4gIFwibHJhcnJcIjpcIlxcdTIxQzZcIixcbiAgXCJscmNvcm5lclwiOlwiXFx1MjMxRlwiLFxuICBcImxyaGFyXCI6XCJcXHUyMUNCXCIsXG4gIFwibHJoYXJkXCI6XCJcXHUyOTZEXCIsXG4gIFwibHJtXCI6XCJcXHUyMDBFXCIsXG4gIFwibHJ0cmlcIjpcIlxcdTIyQkZcIixcbiAgXCJsc2FxdW9cIjpcIlxcdTIwMzlcIixcbiAgXCJMc2NyXCI6XCJcXHUyMTEyXCIsXG4gIFwibHNjclwiOlwiXFx1RDgzNVxcdURDQzFcIixcbiAgXCJMc2hcIjpcIlxcdTIxQjBcIixcbiAgXCJsc2hcIjpcIlxcdTIxQjBcIixcbiAgXCJsc2ltXCI6XCJcXHUyMjcyXCIsXG4gIFwibHNpbWVcIjpcIlxcdTJBOERcIixcbiAgXCJsc2ltZ1wiOlwiXFx1MkE4RlwiLFxuICBcImxzcWJcIjpcIlxcdTAwNUJcIixcbiAgXCJsc3F1b1wiOlwiXFx1MjAxOFwiLFxuICBcImxzcXVvclwiOlwiXFx1MjAxQVwiLFxuICBcIkxzdHJva1wiOlwiXFx1MDE0MVwiLFxuICBcImxzdHJva1wiOlwiXFx1MDE0MlwiLFxuICBcIkxUXCI6XCJcXHUwMDNDXCIsXG4gIFwiTHRcIjpcIlxcdTIyNkFcIixcbiAgXCJsdFwiOlwiXFx1MDAzQ1wiLFxuICBcImx0Y2NcIjpcIlxcdTJBQTZcIixcbiAgXCJsdGNpclwiOlwiXFx1MkE3OVwiLFxuICBcImx0ZG90XCI6XCJcXHUyMkQ2XCIsXG4gIFwibHRocmVlXCI6XCJcXHUyMkNCXCIsXG4gIFwibHRpbWVzXCI6XCJcXHUyMkM5XCIsXG4gIFwibHRsYXJyXCI6XCJcXHUyOTc2XCIsXG4gIFwibHRxdWVzdFwiOlwiXFx1MkE3QlwiLFxuICBcImx0cmlcIjpcIlxcdTI1QzNcIixcbiAgXCJsdHJpZVwiOlwiXFx1MjJCNFwiLFxuICBcImx0cmlmXCI6XCJcXHUyNUMyXCIsXG4gIFwibHRyUGFyXCI6XCJcXHUyOTk2XCIsXG4gIFwibHVyZHNoYXJcIjpcIlxcdTI5NEFcIixcbiAgXCJsdXJ1aGFyXCI6XCJcXHUyOTY2XCIsXG4gIFwibHZlcnRuZXFxXCI6XCJcXHUyMjY4XFx1RkUwMFwiLFxuICBcImx2bkVcIjpcIlxcdTIyNjhcXHVGRTAwXCIsXG4gIFwibWFjclwiOlwiXFx1MDBBRlwiLFxuICBcIm1hbGVcIjpcIlxcdTI2NDJcIixcbiAgXCJtYWx0XCI6XCJcXHUyNzIwXCIsXG4gIFwibWFsdGVzZVwiOlwiXFx1MjcyMFwiLFxuICBcIk1hcFwiOlwiXFx1MjkwNVwiLFxuICBcIm1hcFwiOlwiXFx1MjFBNlwiLFxuICBcIm1hcHN0b1wiOlwiXFx1MjFBNlwiLFxuICBcIm1hcHN0b2Rvd25cIjpcIlxcdTIxQTdcIixcbiAgXCJtYXBzdG9sZWZ0XCI6XCJcXHUyMUE0XCIsXG4gIFwibWFwc3RvdXBcIjpcIlxcdTIxQTVcIixcbiAgXCJtYXJrZXJcIjpcIlxcdTI1QUVcIixcbiAgXCJtY29tbWFcIjpcIlxcdTJBMjlcIixcbiAgXCJNY3lcIjpcIlxcdTA0MUNcIixcbiAgXCJtY3lcIjpcIlxcdTA0M0NcIixcbiAgXCJtZGFzaFwiOlwiXFx1MjAxNFwiLFxuICBcIm1ERG90XCI6XCJcXHUyMjNBXCIsXG4gIFwibWVhc3VyZWRhbmdsZVwiOlwiXFx1MjIyMVwiLFxuICBcIk1lZGl1bVNwYWNlXCI6XCJcXHUyMDVGXCIsXG4gIFwiTWVsbGludHJmXCI6XCJcXHUyMTMzXCIsXG4gIFwiTWZyXCI6XCJcXHVEODM1XFx1REQxMFwiLFxuICBcIm1mclwiOlwiXFx1RDgzNVxcdUREMkFcIixcbiAgXCJtaG9cIjpcIlxcdTIxMjdcIixcbiAgXCJtaWNyb1wiOlwiXFx1MDBCNVwiLFxuICBcIm1pZFwiOlwiXFx1MjIyM1wiLFxuICBcIm1pZGFzdFwiOlwiXFx1MDAyQVwiLFxuICBcIm1pZGNpclwiOlwiXFx1MkFGMFwiLFxuICBcIm1pZGRvdFwiOlwiXFx1MDBCN1wiLFxuICBcIm1pbnVzXCI6XCJcXHUyMjEyXCIsXG4gIFwibWludXNiXCI6XCJcXHUyMjlGXCIsXG4gIFwibWludXNkXCI6XCJcXHUyMjM4XCIsXG4gIFwibWludXNkdVwiOlwiXFx1MkEyQVwiLFxuICBcIk1pbnVzUGx1c1wiOlwiXFx1MjIxM1wiLFxuICBcIm1sY3BcIjpcIlxcdTJBREJcIixcbiAgXCJtbGRyXCI6XCJcXHUyMDI2XCIsXG4gIFwibW5wbHVzXCI6XCJcXHUyMjEzXCIsXG4gIFwibW9kZWxzXCI6XCJcXHUyMkE3XCIsXG4gIFwiTW9wZlwiOlwiXFx1RDgzNVxcdURENDRcIixcbiAgXCJtb3BmXCI6XCJcXHVEODM1XFx1REQ1RVwiLFxuICBcIm1wXCI6XCJcXHUyMjEzXCIsXG4gIFwiTXNjclwiOlwiXFx1MjEzM1wiLFxuICBcIm1zY3JcIjpcIlxcdUQ4MzVcXHVEQ0MyXCIsXG4gIFwibXN0cG9zXCI6XCJcXHUyMjNFXCIsXG4gIFwiTXVcIjpcIlxcdTAzOUNcIixcbiAgXCJtdVwiOlwiXFx1MDNCQ1wiLFxuICBcIm11bHRpbWFwXCI6XCJcXHUyMkI4XCIsXG4gIFwibXVtYXBcIjpcIlxcdTIyQjhcIixcbiAgXCJuYWJsYVwiOlwiXFx1MjIwN1wiLFxuICBcIk5hY3V0ZVwiOlwiXFx1MDE0M1wiLFxuICBcIm5hY3V0ZVwiOlwiXFx1MDE0NFwiLFxuICBcIm5hbmdcIjpcIlxcdTIyMjBcXHUyMEQyXCIsXG4gIFwibmFwXCI6XCJcXHUyMjQ5XCIsXG4gIFwibmFwRVwiOlwiXFx1MkE3MFxcdTAzMzhcIixcbiAgXCJuYXBpZFwiOlwiXFx1MjI0QlxcdTAzMzhcIixcbiAgXCJuYXBvc1wiOlwiXFx1MDE0OVwiLFxuICBcIm5hcHByb3hcIjpcIlxcdTIyNDlcIixcbiAgXCJuYXR1clwiOlwiXFx1MjY2RVwiLFxuICBcIm5hdHVyYWxcIjpcIlxcdTI2NkVcIixcbiAgXCJuYXR1cmFsc1wiOlwiXFx1MjExNVwiLFxuICBcIm5ic3BcIjpcIlxcdTAwQTBcIixcbiAgXCJuYnVtcFwiOlwiXFx1MjI0RVxcdTAzMzhcIixcbiAgXCJuYnVtcGVcIjpcIlxcdTIyNEZcXHUwMzM4XCIsXG4gIFwibmNhcFwiOlwiXFx1MkE0M1wiLFxuICBcIk5jYXJvblwiOlwiXFx1MDE0N1wiLFxuICBcIm5jYXJvblwiOlwiXFx1MDE0OFwiLFxuICBcIk5jZWRpbFwiOlwiXFx1MDE0NVwiLFxuICBcIm5jZWRpbFwiOlwiXFx1MDE0NlwiLFxuICBcIm5jb25nXCI6XCJcXHUyMjQ3XCIsXG4gIFwibmNvbmdkb3RcIjpcIlxcdTJBNkRcXHUwMzM4XCIsXG4gIFwibmN1cFwiOlwiXFx1MkE0MlwiLFxuICBcIk5jeVwiOlwiXFx1MDQxRFwiLFxuICBcIm5jeVwiOlwiXFx1MDQzRFwiLFxuICBcIm5kYXNoXCI6XCJcXHUyMDEzXCIsXG4gIFwibmVcIjpcIlxcdTIyNjBcIixcbiAgXCJuZWFyaGtcIjpcIlxcdTI5MjRcIixcbiAgXCJuZUFyclwiOlwiXFx1MjFEN1wiLFxuICBcIm5lYXJyXCI6XCJcXHUyMTk3XCIsXG4gIFwibmVhcnJvd1wiOlwiXFx1MjE5N1wiLFxuICBcIm5lZG90XCI6XCJcXHUyMjUwXFx1MDMzOFwiLFxuICBcIk5lZ2F0aXZlTWVkaXVtU3BhY2VcIjpcIlxcdTIwMEJcIixcbiAgXCJOZWdhdGl2ZVRoaWNrU3BhY2VcIjpcIlxcdTIwMEJcIixcbiAgXCJOZWdhdGl2ZVRoaW5TcGFjZVwiOlwiXFx1MjAwQlwiLFxuICBcIk5lZ2F0aXZlVmVyeVRoaW5TcGFjZVwiOlwiXFx1MjAwQlwiLFxuICBcIm5lcXVpdlwiOlwiXFx1MjI2MlwiLFxuICBcIm5lc2VhclwiOlwiXFx1MjkyOFwiLFxuICBcIm5lc2ltXCI6XCJcXHUyMjQyXFx1MDMzOFwiLFxuICBcIk5lc3RlZEdyZWF0ZXJHcmVhdGVyXCI6XCJcXHUyMjZCXCIsXG4gIFwiTmVzdGVkTGVzc0xlc3NcIjpcIlxcdTIyNkFcIixcbiAgXCJOZXdMaW5lXCI6XCJcXHUwMDBBXCIsXG4gIFwibmV4aXN0XCI6XCJcXHUyMjA0XCIsXG4gIFwibmV4aXN0c1wiOlwiXFx1MjIwNFwiLFxuICBcIk5mclwiOlwiXFx1RDgzNVxcdUREMTFcIixcbiAgXCJuZnJcIjpcIlxcdUQ4MzVcXHVERDJCXCIsXG4gIFwibmdFXCI6XCJcXHUyMjY3XFx1MDMzOFwiLFxuICBcIm5nZVwiOlwiXFx1MjI3MVwiLFxuICBcIm5nZXFcIjpcIlxcdTIyNzFcIixcbiAgXCJuZ2VxcVwiOlwiXFx1MjI2N1xcdTAzMzhcIixcbiAgXCJuZ2Vxc2xhbnRcIjpcIlxcdTJBN0VcXHUwMzM4XCIsXG4gIFwibmdlc1wiOlwiXFx1MkE3RVxcdTAzMzhcIixcbiAgXCJuR2dcIjpcIlxcdTIyRDlcXHUwMzM4XCIsXG4gIFwibmdzaW1cIjpcIlxcdTIyNzVcIixcbiAgXCJuR3RcIjpcIlxcdTIyNkJcXHUyMEQyXCIsXG4gIFwibmd0XCI6XCJcXHUyMjZGXCIsXG4gIFwibmd0clwiOlwiXFx1MjI2RlwiLFxuICBcIm5HdHZcIjpcIlxcdTIyNkJcXHUwMzM4XCIsXG4gIFwibmhBcnJcIjpcIlxcdTIxQ0VcIixcbiAgXCJuaGFyclwiOlwiXFx1MjFBRVwiLFxuICBcIm5ocGFyXCI6XCJcXHUyQUYyXCIsXG4gIFwibmlcIjpcIlxcdTIyMEJcIixcbiAgXCJuaXNcIjpcIlxcdTIyRkNcIixcbiAgXCJuaXNkXCI6XCJcXHUyMkZBXCIsXG4gIFwibml2XCI6XCJcXHUyMjBCXCIsXG4gIFwiTkpjeVwiOlwiXFx1MDQwQVwiLFxuICBcIm5qY3lcIjpcIlxcdTA0NUFcIixcbiAgXCJubEFyclwiOlwiXFx1MjFDRFwiLFxuICBcIm5sYXJyXCI6XCJcXHUyMTlBXCIsXG4gIFwibmxkclwiOlwiXFx1MjAyNVwiLFxuICBcIm5sRVwiOlwiXFx1MjI2NlxcdTAzMzhcIixcbiAgXCJubGVcIjpcIlxcdTIyNzBcIixcbiAgXCJuTGVmdGFycm93XCI6XCJcXHUyMUNEXCIsXG4gIFwibmxlZnRhcnJvd1wiOlwiXFx1MjE5QVwiLFxuICBcIm5MZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjFDRVwiLFxuICBcIm5sZWZ0cmlnaHRhcnJvd1wiOlwiXFx1MjFBRVwiLFxuICBcIm5sZXFcIjpcIlxcdTIyNzBcIixcbiAgXCJubGVxcVwiOlwiXFx1MjI2NlxcdTAzMzhcIixcbiAgXCJubGVxc2xhbnRcIjpcIlxcdTJBN0RcXHUwMzM4XCIsXG4gIFwibmxlc1wiOlwiXFx1MkE3RFxcdTAzMzhcIixcbiAgXCJubGVzc1wiOlwiXFx1MjI2RVwiLFxuICBcIm5MbFwiOlwiXFx1MjJEOFxcdTAzMzhcIixcbiAgXCJubHNpbVwiOlwiXFx1MjI3NFwiLFxuICBcIm5MdFwiOlwiXFx1MjI2QVxcdTIwRDJcIixcbiAgXCJubHRcIjpcIlxcdTIyNkVcIixcbiAgXCJubHRyaVwiOlwiXFx1MjJFQVwiLFxuICBcIm5sdHJpZVwiOlwiXFx1MjJFQ1wiLFxuICBcIm5MdHZcIjpcIlxcdTIyNkFcXHUwMzM4XCIsXG4gIFwibm1pZFwiOlwiXFx1MjIyNFwiLFxuICBcIk5vQnJlYWtcIjpcIlxcdTIwNjBcIixcbiAgXCJOb25CcmVha2luZ1NwYWNlXCI6XCJcXHUwMEEwXCIsXG4gIFwiTm9wZlwiOlwiXFx1MjExNVwiLFxuICBcIm5vcGZcIjpcIlxcdUQ4MzVcXHVERDVGXCIsXG4gIFwiTm90XCI6XCJcXHUyQUVDXCIsXG4gIFwibm90XCI6XCJcXHUwMEFDXCIsXG4gIFwiTm90Q29uZ3J1ZW50XCI6XCJcXHUyMjYyXCIsXG4gIFwiTm90Q3VwQ2FwXCI6XCJcXHUyMjZEXCIsXG4gIFwiTm90RG91YmxlVmVydGljYWxCYXJcIjpcIlxcdTIyMjZcIixcbiAgXCJOb3RFbGVtZW50XCI6XCJcXHUyMjA5XCIsXG4gIFwiTm90RXF1YWxcIjpcIlxcdTIyNjBcIixcbiAgXCJOb3RFcXVhbFRpbGRlXCI6XCJcXHUyMjQyXFx1MDMzOFwiLFxuICBcIk5vdEV4aXN0c1wiOlwiXFx1MjIwNFwiLFxuICBcIk5vdEdyZWF0ZXJcIjpcIlxcdTIyNkZcIixcbiAgXCJOb3RHcmVhdGVyRXF1YWxcIjpcIlxcdTIyNzFcIixcbiAgXCJOb3RHcmVhdGVyRnVsbEVxdWFsXCI6XCJcXHUyMjY3XFx1MDMzOFwiLFxuICBcIk5vdEdyZWF0ZXJHcmVhdGVyXCI6XCJcXHUyMjZCXFx1MDMzOFwiLFxuICBcIk5vdEdyZWF0ZXJMZXNzXCI6XCJcXHUyMjc5XCIsXG4gIFwiTm90R3JlYXRlclNsYW50RXF1YWxcIjpcIlxcdTJBN0VcXHUwMzM4XCIsXG4gIFwiTm90R3JlYXRlclRpbGRlXCI6XCJcXHUyMjc1XCIsXG4gIFwiTm90SHVtcERvd25IdW1wXCI6XCJcXHUyMjRFXFx1MDMzOFwiLFxuICBcIk5vdEh1bXBFcXVhbFwiOlwiXFx1MjI0RlxcdTAzMzhcIixcbiAgXCJub3RpblwiOlwiXFx1MjIwOVwiLFxuICBcIm5vdGluZG90XCI6XCJcXHUyMkY1XFx1MDMzOFwiLFxuICBcIm5vdGluRVwiOlwiXFx1MjJGOVxcdTAzMzhcIixcbiAgXCJub3RpbnZhXCI6XCJcXHUyMjA5XCIsXG4gIFwibm90aW52YlwiOlwiXFx1MjJGN1wiLFxuICBcIm5vdGludmNcIjpcIlxcdTIyRjZcIixcbiAgXCJOb3RMZWZ0VHJpYW5nbGVcIjpcIlxcdTIyRUFcIixcbiAgXCJOb3RMZWZ0VHJpYW5nbGVCYXJcIjpcIlxcdTI5Q0ZcXHUwMzM4XCIsXG4gIFwiTm90TGVmdFRyaWFuZ2xlRXF1YWxcIjpcIlxcdTIyRUNcIixcbiAgXCJOb3RMZXNzXCI6XCJcXHUyMjZFXCIsXG4gIFwiTm90TGVzc0VxdWFsXCI6XCJcXHUyMjcwXCIsXG4gIFwiTm90TGVzc0dyZWF0ZXJcIjpcIlxcdTIyNzhcIixcbiAgXCJOb3RMZXNzTGVzc1wiOlwiXFx1MjI2QVxcdTAzMzhcIixcbiAgXCJOb3RMZXNzU2xhbnRFcXVhbFwiOlwiXFx1MkE3RFxcdTAzMzhcIixcbiAgXCJOb3RMZXNzVGlsZGVcIjpcIlxcdTIyNzRcIixcbiAgXCJOb3ROZXN0ZWRHcmVhdGVyR3JlYXRlclwiOlwiXFx1MkFBMlxcdTAzMzhcIixcbiAgXCJOb3ROZXN0ZWRMZXNzTGVzc1wiOlwiXFx1MkFBMVxcdTAzMzhcIixcbiAgXCJub3RuaVwiOlwiXFx1MjIwQ1wiLFxuICBcIm5vdG5pdmFcIjpcIlxcdTIyMENcIixcbiAgXCJub3RuaXZiXCI6XCJcXHUyMkZFXCIsXG4gIFwibm90bml2Y1wiOlwiXFx1MjJGRFwiLFxuICBcIk5vdFByZWNlZGVzXCI6XCJcXHUyMjgwXCIsXG4gIFwiTm90UHJlY2VkZXNFcXVhbFwiOlwiXFx1MkFBRlxcdTAzMzhcIixcbiAgXCJOb3RQcmVjZWRlc1NsYW50RXF1YWxcIjpcIlxcdTIyRTBcIixcbiAgXCJOb3RSZXZlcnNlRWxlbWVudFwiOlwiXFx1MjIwQ1wiLFxuICBcIk5vdFJpZ2h0VHJpYW5nbGVcIjpcIlxcdTIyRUJcIixcbiAgXCJOb3RSaWdodFRyaWFuZ2xlQmFyXCI6XCJcXHUyOUQwXFx1MDMzOFwiLFxuICBcIk5vdFJpZ2h0VHJpYW5nbGVFcXVhbFwiOlwiXFx1MjJFRFwiLFxuICBcIk5vdFNxdWFyZVN1YnNldFwiOlwiXFx1MjI4RlxcdTAzMzhcIixcbiAgXCJOb3RTcXVhcmVTdWJzZXRFcXVhbFwiOlwiXFx1MjJFMlwiLFxuICBcIk5vdFNxdWFyZVN1cGVyc2V0XCI6XCJcXHUyMjkwXFx1MDMzOFwiLFxuICBcIk5vdFNxdWFyZVN1cGVyc2V0RXF1YWxcIjpcIlxcdTIyRTNcIixcbiAgXCJOb3RTdWJzZXRcIjpcIlxcdTIyODJcXHUyMEQyXCIsXG4gIFwiTm90U3Vic2V0RXF1YWxcIjpcIlxcdTIyODhcIixcbiAgXCJOb3RTdWNjZWVkc1wiOlwiXFx1MjI4MVwiLFxuICBcIk5vdFN1Y2NlZWRzRXF1YWxcIjpcIlxcdTJBQjBcXHUwMzM4XCIsXG4gIFwiTm90U3VjY2VlZHNTbGFudEVxdWFsXCI6XCJcXHUyMkUxXCIsXG4gIFwiTm90U3VjY2VlZHNUaWxkZVwiOlwiXFx1MjI3RlxcdTAzMzhcIixcbiAgXCJOb3RTdXBlcnNldFwiOlwiXFx1MjI4M1xcdTIwRDJcIixcbiAgXCJOb3RTdXBlcnNldEVxdWFsXCI6XCJcXHUyMjg5XCIsXG4gIFwiTm90VGlsZGVcIjpcIlxcdTIyNDFcIixcbiAgXCJOb3RUaWxkZUVxdWFsXCI6XCJcXHUyMjQ0XCIsXG4gIFwiTm90VGlsZGVGdWxsRXF1YWxcIjpcIlxcdTIyNDdcIixcbiAgXCJOb3RUaWxkZVRpbGRlXCI6XCJcXHUyMjQ5XCIsXG4gIFwiTm90VmVydGljYWxCYXJcIjpcIlxcdTIyMjRcIixcbiAgXCJucGFyXCI6XCJcXHUyMjI2XCIsXG4gIFwibnBhcmFsbGVsXCI6XCJcXHUyMjI2XCIsXG4gIFwibnBhcnNsXCI6XCJcXHUyQUZEXFx1MjBFNVwiLFxuICBcIm5wYXJ0XCI6XCJcXHUyMjAyXFx1MDMzOFwiLFxuICBcIm5wb2xpbnRcIjpcIlxcdTJBMTRcIixcbiAgXCJucHJcIjpcIlxcdTIyODBcIixcbiAgXCJucHJjdWVcIjpcIlxcdTIyRTBcIixcbiAgXCJucHJlXCI6XCJcXHUyQUFGXFx1MDMzOFwiLFxuICBcIm5wcmVjXCI6XCJcXHUyMjgwXCIsXG4gIFwibnByZWNlcVwiOlwiXFx1MkFBRlxcdTAzMzhcIixcbiAgXCJuckFyclwiOlwiXFx1MjFDRlwiLFxuICBcIm5yYXJyXCI6XCJcXHUyMTlCXCIsXG4gIFwibnJhcnJjXCI6XCJcXHUyOTMzXFx1MDMzOFwiLFxuICBcIm5yYXJyd1wiOlwiXFx1MjE5RFxcdTAzMzhcIixcbiAgXCJuUmlnaHRhcnJvd1wiOlwiXFx1MjFDRlwiLFxuICBcIm5yaWdodGFycm93XCI6XCJcXHUyMTlCXCIsXG4gIFwibnJ0cmlcIjpcIlxcdTIyRUJcIixcbiAgXCJucnRyaWVcIjpcIlxcdTIyRURcIixcbiAgXCJuc2NcIjpcIlxcdTIyODFcIixcbiAgXCJuc2NjdWVcIjpcIlxcdTIyRTFcIixcbiAgXCJuc2NlXCI6XCJcXHUyQUIwXFx1MDMzOFwiLFxuICBcIk5zY3JcIjpcIlxcdUQ4MzVcXHVEQ0E5XCIsXG4gIFwibnNjclwiOlwiXFx1RDgzNVxcdURDQzNcIixcbiAgXCJuc2hvcnRtaWRcIjpcIlxcdTIyMjRcIixcbiAgXCJuc2hvcnRwYXJhbGxlbFwiOlwiXFx1MjIyNlwiLFxuICBcIm5zaW1cIjpcIlxcdTIyNDFcIixcbiAgXCJuc2ltZVwiOlwiXFx1MjI0NFwiLFxuICBcIm5zaW1lcVwiOlwiXFx1MjI0NFwiLFxuICBcIm5zbWlkXCI6XCJcXHUyMjI0XCIsXG4gIFwibnNwYXJcIjpcIlxcdTIyMjZcIixcbiAgXCJuc3FzdWJlXCI6XCJcXHUyMkUyXCIsXG4gIFwibnNxc3VwZVwiOlwiXFx1MjJFM1wiLFxuICBcIm5zdWJcIjpcIlxcdTIyODRcIixcbiAgXCJuc3ViRVwiOlwiXFx1MkFDNVxcdTAzMzhcIixcbiAgXCJuc3ViZVwiOlwiXFx1MjI4OFwiLFxuICBcIm5zdWJzZXRcIjpcIlxcdTIyODJcXHUyMEQyXCIsXG4gIFwibnN1YnNldGVxXCI6XCJcXHUyMjg4XCIsXG4gIFwibnN1YnNldGVxcVwiOlwiXFx1MkFDNVxcdTAzMzhcIixcbiAgXCJuc3VjY1wiOlwiXFx1MjI4MVwiLFxuICBcIm5zdWNjZXFcIjpcIlxcdTJBQjBcXHUwMzM4XCIsXG4gIFwibnN1cFwiOlwiXFx1MjI4NVwiLFxuICBcIm5zdXBFXCI6XCJcXHUyQUM2XFx1MDMzOFwiLFxuICBcIm5zdXBlXCI6XCJcXHUyMjg5XCIsXG4gIFwibnN1cHNldFwiOlwiXFx1MjI4M1xcdTIwRDJcIixcbiAgXCJuc3Vwc2V0ZXFcIjpcIlxcdTIyODlcIixcbiAgXCJuc3Vwc2V0ZXFxXCI6XCJcXHUyQUM2XFx1MDMzOFwiLFxuICBcIm50Z2xcIjpcIlxcdTIyNzlcIixcbiAgXCJOdGlsZGVcIjpcIlxcdTAwRDFcIixcbiAgXCJudGlsZGVcIjpcIlxcdTAwRjFcIixcbiAgXCJudGxnXCI6XCJcXHUyMjc4XCIsXG4gIFwibnRyaWFuZ2xlbGVmdFwiOlwiXFx1MjJFQVwiLFxuICBcIm50cmlhbmdsZWxlZnRlcVwiOlwiXFx1MjJFQ1wiLFxuICBcIm50cmlhbmdsZXJpZ2h0XCI6XCJcXHUyMkVCXCIsXG4gIFwibnRyaWFuZ2xlcmlnaHRlcVwiOlwiXFx1MjJFRFwiLFxuICBcIk51XCI6XCJcXHUwMzlEXCIsXG4gIFwibnVcIjpcIlxcdTAzQkRcIixcbiAgXCJudW1cIjpcIlxcdTAwMjNcIixcbiAgXCJudW1lcm9cIjpcIlxcdTIxMTZcIixcbiAgXCJudW1zcFwiOlwiXFx1MjAwN1wiLFxuICBcIm52YXBcIjpcIlxcdTIyNERcXHUyMEQyXCIsXG4gIFwiblZEYXNoXCI6XCJcXHUyMkFGXCIsXG4gIFwiblZkYXNoXCI6XCJcXHUyMkFFXCIsXG4gIFwibnZEYXNoXCI6XCJcXHUyMkFEXCIsXG4gIFwibnZkYXNoXCI6XCJcXHUyMkFDXCIsXG4gIFwibnZnZVwiOlwiXFx1MjI2NVxcdTIwRDJcIixcbiAgXCJudmd0XCI6XCJcXHUwMDNFXFx1MjBEMlwiLFxuICBcIm52SGFyclwiOlwiXFx1MjkwNFwiLFxuICBcIm52aW5maW5cIjpcIlxcdTI5REVcIixcbiAgXCJudmxBcnJcIjpcIlxcdTI5MDJcIixcbiAgXCJudmxlXCI6XCJcXHUyMjY0XFx1MjBEMlwiLFxuICBcIm52bHRcIjpcIlxcdTAwM0NcXHUyMEQyXCIsXG4gIFwibnZsdHJpZVwiOlwiXFx1MjJCNFxcdTIwRDJcIixcbiAgXCJudnJBcnJcIjpcIlxcdTI5MDNcIixcbiAgXCJudnJ0cmllXCI6XCJcXHUyMkI1XFx1MjBEMlwiLFxuICBcIm52c2ltXCI6XCJcXHUyMjNDXFx1MjBEMlwiLFxuICBcIm53YXJoa1wiOlwiXFx1MjkyM1wiLFxuICBcIm53QXJyXCI6XCJcXHUyMUQ2XCIsXG4gIFwibndhcnJcIjpcIlxcdTIxOTZcIixcbiAgXCJud2Fycm93XCI6XCJcXHUyMTk2XCIsXG4gIFwibnduZWFyXCI6XCJcXHUyOTI3XCIsXG4gIFwiT2FjdXRlXCI6XCJcXHUwMEQzXCIsXG4gIFwib2FjdXRlXCI6XCJcXHUwMEYzXCIsXG4gIFwib2FzdFwiOlwiXFx1MjI5QlwiLFxuICBcIm9jaXJcIjpcIlxcdTIyOUFcIixcbiAgXCJPY2lyY1wiOlwiXFx1MDBENFwiLFxuICBcIm9jaXJjXCI6XCJcXHUwMEY0XCIsXG4gIFwiT2N5XCI6XCJcXHUwNDFFXCIsXG4gIFwib2N5XCI6XCJcXHUwNDNFXCIsXG4gIFwib2Rhc2hcIjpcIlxcdTIyOURcIixcbiAgXCJPZGJsYWNcIjpcIlxcdTAxNTBcIixcbiAgXCJvZGJsYWNcIjpcIlxcdTAxNTFcIixcbiAgXCJvZGl2XCI6XCJcXHUyQTM4XCIsXG4gIFwib2RvdFwiOlwiXFx1MjI5OVwiLFxuICBcIm9kc29sZFwiOlwiXFx1MjlCQ1wiLFxuICBcIk9FbGlnXCI6XCJcXHUwMTUyXCIsXG4gIFwib2VsaWdcIjpcIlxcdTAxNTNcIixcbiAgXCJvZmNpclwiOlwiXFx1MjlCRlwiLFxuICBcIk9mclwiOlwiXFx1RDgzNVxcdUREMTJcIixcbiAgXCJvZnJcIjpcIlxcdUQ4MzVcXHVERDJDXCIsXG4gIFwib2dvblwiOlwiXFx1MDJEQlwiLFxuICBcIk9ncmF2ZVwiOlwiXFx1MDBEMlwiLFxuICBcIm9ncmF2ZVwiOlwiXFx1MDBGMlwiLFxuICBcIm9ndFwiOlwiXFx1MjlDMVwiLFxuICBcIm9oYmFyXCI6XCJcXHUyOUI1XCIsXG4gIFwib2htXCI6XCJcXHUwM0E5XCIsXG4gIFwib2ludFwiOlwiXFx1MjIyRVwiLFxuICBcIm9sYXJyXCI6XCJcXHUyMUJBXCIsXG4gIFwib2xjaXJcIjpcIlxcdTI5QkVcIixcbiAgXCJvbGNyb3NzXCI6XCJcXHUyOUJCXCIsXG4gIFwib2xpbmVcIjpcIlxcdTIwM0VcIixcbiAgXCJvbHRcIjpcIlxcdTI5QzBcIixcbiAgXCJPbWFjclwiOlwiXFx1MDE0Q1wiLFxuICBcIm9tYWNyXCI6XCJcXHUwMTREXCIsXG4gIFwiT21lZ2FcIjpcIlxcdTAzQTlcIixcbiAgXCJvbWVnYVwiOlwiXFx1MDNDOVwiLFxuICBcIk9taWNyb25cIjpcIlxcdTAzOUZcIixcbiAgXCJvbWljcm9uXCI6XCJcXHUwM0JGXCIsXG4gIFwib21pZFwiOlwiXFx1MjlCNlwiLFxuICBcIm9taW51c1wiOlwiXFx1MjI5NlwiLFxuICBcIk9vcGZcIjpcIlxcdUQ4MzVcXHVERDQ2XCIsXG4gIFwib29wZlwiOlwiXFx1RDgzNVxcdURENjBcIixcbiAgXCJvcGFyXCI6XCJcXHUyOUI3XCIsXG4gIFwiT3BlbkN1cmx5RG91YmxlUXVvdGVcIjpcIlxcdTIwMUNcIixcbiAgXCJPcGVuQ3VybHlRdW90ZVwiOlwiXFx1MjAxOFwiLFxuICBcIm9wZXJwXCI6XCJcXHUyOUI5XCIsXG4gIFwib3BsdXNcIjpcIlxcdTIyOTVcIixcbiAgXCJPclwiOlwiXFx1MkE1NFwiLFxuICBcIm9yXCI6XCJcXHUyMjI4XCIsXG4gIFwib3JhcnJcIjpcIlxcdTIxQkJcIixcbiAgXCJvcmRcIjpcIlxcdTJBNURcIixcbiAgXCJvcmRlclwiOlwiXFx1MjEzNFwiLFxuICBcIm9yZGVyb2ZcIjpcIlxcdTIxMzRcIixcbiAgXCJvcmRmXCI6XCJcXHUwMEFBXCIsXG4gIFwib3JkbVwiOlwiXFx1MDBCQVwiLFxuICBcIm9yaWdvZlwiOlwiXFx1MjJCNlwiLFxuICBcIm9yb3JcIjpcIlxcdTJBNTZcIixcbiAgXCJvcnNsb3BlXCI6XCJcXHUyQTU3XCIsXG4gIFwib3J2XCI6XCJcXHUyQTVCXCIsXG4gIFwib1NcIjpcIlxcdTI0QzhcIixcbiAgXCJPc2NyXCI6XCJcXHVEODM1XFx1RENBQVwiLFxuICBcIm9zY3JcIjpcIlxcdTIxMzRcIixcbiAgXCJPc2xhc2hcIjpcIlxcdTAwRDhcIixcbiAgXCJvc2xhc2hcIjpcIlxcdTAwRjhcIixcbiAgXCJvc29sXCI6XCJcXHUyMjk4XCIsXG4gIFwiT3RpbGRlXCI6XCJcXHUwMEQ1XCIsXG4gIFwib3RpbGRlXCI6XCJcXHUwMEY1XCIsXG4gIFwiT3RpbWVzXCI6XCJcXHUyQTM3XCIsXG4gIFwib3RpbWVzXCI6XCJcXHUyMjk3XCIsXG4gIFwib3RpbWVzYXNcIjpcIlxcdTJBMzZcIixcbiAgXCJPdW1sXCI6XCJcXHUwMEQ2XCIsXG4gIFwib3VtbFwiOlwiXFx1MDBGNlwiLFxuICBcIm92YmFyXCI6XCJcXHUyMzNEXCIsXG4gIFwiT3ZlckJhclwiOlwiXFx1MjAzRVwiLFxuICBcIk92ZXJCcmFjZVwiOlwiXFx1MjNERVwiLFxuICBcIk92ZXJCcmFja2V0XCI6XCJcXHUyM0I0XCIsXG4gIFwiT3ZlclBhcmVudGhlc2lzXCI6XCJcXHUyM0RDXCIsXG4gIFwicGFyXCI6XCJcXHUyMjI1XCIsXG4gIFwicGFyYVwiOlwiXFx1MDBCNlwiLFxuICBcInBhcmFsbGVsXCI6XCJcXHUyMjI1XCIsXG4gIFwicGFyc2ltXCI6XCJcXHUyQUYzXCIsXG4gIFwicGFyc2xcIjpcIlxcdTJBRkRcIixcbiAgXCJwYXJ0XCI6XCJcXHUyMjAyXCIsXG4gIFwiUGFydGlhbERcIjpcIlxcdTIyMDJcIixcbiAgXCJQY3lcIjpcIlxcdTA0MUZcIixcbiAgXCJwY3lcIjpcIlxcdTA0M0ZcIixcbiAgXCJwZXJjbnRcIjpcIlxcdTAwMjVcIixcbiAgXCJwZXJpb2RcIjpcIlxcdTAwMkVcIixcbiAgXCJwZXJtaWxcIjpcIlxcdTIwMzBcIixcbiAgXCJwZXJwXCI6XCJcXHUyMkE1XCIsXG4gIFwicGVydGVua1wiOlwiXFx1MjAzMVwiLFxuICBcIlBmclwiOlwiXFx1RDgzNVxcdUREMTNcIixcbiAgXCJwZnJcIjpcIlxcdUQ4MzVcXHVERDJEXCIsXG4gIFwiUGhpXCI6XCJcXHUwM0E2XCIsXG4gIFwicGhpXCI6XCJcXHUwM0M2XCIsXG4gIFwicGhpdlwiOlwiXFx1MDNENVwiLFxuICBcInBobW1hdFwiOlwiXFx1MjEzM1wiLFxuICBcInBob25lXCI6XCJcXHUyNjBFXCIsXG4gIFwiUGlcIjpcIlxcdTAzQTBcIixcbiAgXCJwaVwiOlwiXFx1MDNDMFwiLFxuICBcInBpdGNoZm9ya1wiOlwiXFx1MjJENFwiLFxuICBcInBpdlwiOlwiXFx1MDNENlwiLFxuICBcInBsYW5ja1wiOlwiXFx1MjEwRlwiLFxuICBcInBsYW5ja2hcIjpcIlxcdTIxMEVcIixcbiAgXCJwbGFua3ZcIjpcIlxcdTIxMEZcIixcbiAgXCJwbHVzXCI6XCJcXHUwMDJCXCIsXG4gIFwicGx1c2FjaXJcIjpcIlxcdTJBMjNcIixcbiAgXCJwbHVzYlwiOlwiXFx1MjI5RVwiLFxuICBcInBsdXNjaXJcIjpcIlxcdTJBMjJcIixcbiAgXCJwbHVzZG9cIjpcIlxcdTIyMTRcIixcbiAgXCJwbHVzZHVcIjpcIlxcdTJBMjVcIixcbiAgXCJwbHVzZVwiOlwiXFx1MkE3MlwiLFxuICBcIlBsdXNNaW51c1wiOlwiXFx1MDBCMVwiLFxuICBcInBsdXNtblwiOlwiXFx1MDBCMVwiLFxuICBcInBsdXNzaW1cIjpcIlxcdTJBMjZcIixcbiAgXCJwbHVzdHdvXCI6XCJcXHUyQTI3XCIsXG4gIFwicG1cIjpcIlxcdTAwQjFcIixcbiAgXCJQb2luY2FyZXBsYW5lXCI6XCJcXHUyMTBDXCIsXG4gIFwicG9pbnRpbnRcIjpcIlxcdTJBMTVcIixcbiAgXCJQb3BmXCI6XCJcXHUyMTE5XCIsXG4gIFwicG9wZlwiOlwiXFx1RDgzNVxcdURENjFcIixcbiAgXCJwb3VuZFwiOlwiXFx1MDBBM1wiLFxuICBcIlByXCI6XCJcXHUyQUJCXCIsXG4gIFwicHJcIjpcIlxcdTIyN0FcIixcbiAgXCJwcmFwXCI6XCJcXHUyQUI3XCIsXG4gIFwicHJjdWVcIjpcIlxcdTIyN0NcIixcbiAgXCJwckVcIjpcIlxcdTJBQjNcIixcbiAgXCJwcmVcIjpcIlxcdTJBQUZcIixcbiAgXCJwcmVjXCI6XCJcXHUyMjdBXCIsXG4gIFwicHJlY2FwcHJveFwiOlwiXFx1MkFCN1wiLFxuICBcInByZWNjdXJseWVxXCI6XCJcXHUyMjdDXCIsXG4gIFwiUHJlY2VkZXNcIjpcIlxcdTIyN0FcIixcbiAgXCJQcmVjZWRlc0VxdWFsXCI6XCJcXHUyQUFGXCIsXG4gIFwiUHJlY2VkZXNTbGFudEVxdWFsXCI6XCJcXHUyMjdDXCIsXG4gIFwiUHJlY2VkZXNUaWxkZVwiOlwiXFx1MjI3RVwiLFxuICBcInByZWNlcVwiOlwiXFx1MkFBRlwiLFxuICBcInByZWNuYXBwcm94XCI6XCJcXHUyQUI5XCIsXG4gIFwicHJlY25lcXFcIjpcIlxcdTJBQjVcIixcbiAgXCJwcmVjbnNpbVwiOlwiXFx1MjJFOFwiLFxuICBcInByZWNzaW1cIjpcIlxcdTIyN0VcIixcbiAgXCJQcmltZVwiOlwiXFx1MjAzM1wiLFxuICBcInByaW1lXCI6XCJcXHUyMDMyXCIsXG4gIFwicHJpbWVzXCI6XCJcXHUyMTE5XCIsXG4gIFwicHJuYXBcIjpcIlxcdTJBQjlcIixcbiAgXCJwcm5FXCI6XCJcXHUyQUI1XCIsXG4gIFwicHJuc2ltXCI6XCJcXHUyMkU4XCIsXG4gIFwicHJvZFwiOlwiXFx1MjIwRlwiLFxuICBcIlByb2R1Y3RcIjpcIlxcdTIyMEZcIixcbiAgXCJwcm9mYWxhclwiOlwiXFx1MjMyRVwiLFxuICBcInByb2ZsaW5lXCI6XCJcXHUyMzEyXCIsXG4gIFwicHJvZnN1cmZcIjpcIlxcdTIzMTNcIixcbiAgXCJwcm9wXCI6XCJcXHUyMjFEXCIsXG4gIFwiUHJvcG9ydGlvblwiOlwiXFx1MjIzN1wiLFxuICBcIlByb3BvcnRpb25hbFwiOlwiXFx1MjIxRFwiLFxuICBcInByb3B0b1wiOlwiXFx1MjIxRFwiLFxuICBcInByc2ltXCI6XCJcXHUyMjdFXCIsXG4gIFwicHJ1cmVsXCI6XCJcXHUyMkIwXCIsXG4gIFwiUHNjclwiOlwiXFx1RDgzNVxcdURDQUJcIixcbiAgXCJwc2NyXCI6XCJcXHVEODM1XFx1RENDNVwiLFxuICBcIlBzaVwiOlwiXFx1MDNBOFwiLFxuICBcInBzaVwiOlwiXFx1MDNDOFwiLFxuICBcInB1bmNzcFwiOlwiXFx1MjAwOFwiLFxuICBcIlFmclwiOlwiXFx1RDgzNVxcdUREMTRcIixcbiAgXCJxZnJcIjpcIlxcdUQ4MzVcXHVERDJFXCIsXG4gIFwicWludFwiOlwiXFx1MkEwQ1wiLFxuICBcIlFvcGZcIjpcIlxcdTIxMUFcIixcbiAgXCJxb3BmXCI6XCJcXHVEODM1XFx1REQ2MlwiLFxuICBcInFwcmltZVwiOlwiXFx1MjA1N1wiLFxuICBcIlFzY3JcIjpcIlxcdUQ4MzVcXHVEQ0FDXCIsXG4gIFwicXNjclwiOlwiXFx1RDgzNVxcdURDQzZcIixcbiAgXCJxdWF0ZXJuaW9uc1wiOlwiXFx1MjEwRFwiLFxuICBcInF1YXRpbnRcIjpcIlxcdTJBMTZcIixcbiAgXCJxdWVzdFwiOlwiXFx1MDAzRlwiLFxuICBcInF1ZXN0ZXFcIjpcIlxcdTIyNUZcIixcbiAgXCJRVU9UXCI6XCJcXHUwMDIyXCIsXG4gIFwicXVvdFwiOlwiXFx1MDAyMlwiLFxuICBcInJBYXJyXCI6XCJcXHUyMURCXCIsXG4gIFwicmFjZVwiOlwiXFx1MjIzRFxcdTAzMzFcIixcbiAgXCJSYWN1dGVcIjpcIlxcdTAxNTRcIixcbiAgXCJyYWN1dGVcIjpcIlxcdTAxNTVcIixcbiAgXCJyYWRpY1wiOlwiXFx1MjIxQVwiLFxuICBcInJhZW1wdHl2XCI6XCJcXHUyOUIzXCIsXG4gIFwiUmFuZ1wiOlwiXFx1MjdFQlwiLFxuICBcInJhbmdcIjpcIlxcdTI3RTlcIixcbiAgXCJyYW5nZFwiOlwiXFx1Mjk5MlwiLFxuICBcInJhbmdlXCI6XCJcXHUyOUE1XCIsXG4gIFwicmFuZ2xlXCI6XCJcXHUyN0U5XCIsXG4gIFwicmFxdW9cIjpcIlxcdTAwQkJcIixcbiAgXCJSYXJyXCI6XCJcXHUyMUEwXCIsXG4gIFwickFyclwiOlwiXFx1MjFEMlwiLFxuICBcInJhcnJcIjpcIlxcdTIxOTJcIixcbiAgXCJyYXJyYXBcIjpcIlxcdTI5NzVcIixcbiAgXCJyYXJyYlwiOlwiXFx1MjFFNVwiLFxuICBcInJhcnJiZnNcIjpcIlxcdTI5MjBcIixcbiAgXCJyYXJyY1wiOlwiXFx1MjkzM1wiLFxuICBcInJhcnJmc1wiOlwiXFx1MjkxRVwiLFxuICBcInJhcnJoa1wiOlwiXFx1MjFBQVwiLFxuICBcInJhcnJscFwiOlwiXFx1MjFBQ1wiLFxuICBcInJhcnJwbFwiOlwiXFx1Mjk0NVwiLFxuICBcInJhcnJzaW1cIjpcIlxcdTI5NzRcIixcbiAgXCJSYXJydGxcIjpcIlxcdTI5MTZcIixcbiAgXCJyYXJydGxcIjpcIlxcdTIxQTNcIixcbiAgXCJyYXJyd1wiOlwiXFx1MjE5RFwiLFxuICBcInJBdGFpbFwiOlwiXFx1MjkxQ1wiLFxuICBcInJhdGFpbFwiOlwiXFx1MjkxQVwiLFxuICBcInJhdGlvXCI6XCJcXHUyMjM2XCIsXG4gIFwicmF0aW9uYWxzXCI6XCJcXHUyMTFBXCIsXG4gIFwiUkJhcnJcIjpcIlxcdTI5MTBcIixcbiAgXCJyQmFyclwiOlwiXFx1MjkwRlwiLFxuICBcInJiYXJyXCI6XCJcXHUyOTBEXCIsXG4gIFwicmJicmtcIjpcIlxcdTI3NzNcIixcbiAgXCJyYnJhY2VcIjpcIlxcdTAwN0RcIixcbiAgXCJyYnJhY2tcIjpcIlxcdTAwNURcIixcbiAgXCJyYnJrZVwiOlwiXFx1Mjk4Q1wiLFxuICBcInJicmtzbGRcIjpcIlxcdTI5OEVcIixcbiAgXCJyYnJrc2x1XCI6XCJcXHUyOTkwXCIsXG4gIFwiUmNhcm9uXCI6XCJcXHUwMTU4XCIsXG4gIFwicmNhcm9uXCI6XCJcXHUwMTU5XCIsXG4gIFwiUmNlZGlsXCI6XCJcXHUwMTU2XCIsXG4gIFwicmNlZGlsXCI6XCJcXHUwMTU3XCIsXG4gIFwicmNlaWxcIjpcIlxcdTIzMDlcIixcbiAgXCJyY3ViXCI6XCJcXHUwMDdEXCIsXG4gIFwiUmN5XCI6XCJcXHUwNDIwXCIsXG4gIFwicmN5XCI6XCJcXHUwNDQwXCIsXG4gIFwicmRjYVwiOlwiXFx1MjkzN1wiLFxuICBcInJkbGRoYXJcIjpcIlxcdTI5NjlcIixcbiAgXCJyZHF1b1wiOlwiXFx1MjAxRFwiLFxuICBcInJkcXVvclwiOlwiXFx1MjAxRFwiLFxuICBcInJkc2hcIjpcIlxcdTIxQjNcIixcbiAgXCJSZVwiOlwiXFx1MjExQ1wiLFxuICBcInJlYWxcIjpcIlxcdTIxMUNcIixcbiAgXCJyZWFsaW5lXCI6XCJcXHUyMTFCXCIsXG4gIFwicmVhbHBhcnRcIjpcIlxcdTIxMUNcIixcbiAgXCJyZWFsc1wiOlwiXFx1MjExRFwiLFxuICBcInJlY3RcIjpcIlxcdTI1QURcIixcbiAgXCJSRUdcIjpcIlxcdTAwQUVcIixcbiAgXCJyZWdcIjpcIlxcdTAwQUVcIixcbiAgXCJSZXZlcnNlRWxlbWVudFwiOlwiXFx1MjIwQlwiLFxuICBcIlJldmVyc2VFcXVpbGlicml1bVwiOlwiXFx1MjFDQlwiLFxuICBcIlJldmVyc2VVcEVxdWlsaWJyaXVtXCI6XCJcXHUyOTZGXCIsXG4gIFwicmZpc2h0XCI6XCJcXHUyOTdEXCIsXG4gIFwicmZsb29yXCI6XCJcXHUyMzBCXCIsXG4gIFwiUmZyXCI6XCJcXHUyMTFDXCIsXG4gIFwicmZyXCI6XCJcXHVEODM1XFx1REQyRlwiLFxuICBcInJIYXJcIjpcIlxcdTI5NjRcIixcbiAgXCJyaGFyZFwiOlwiXFx1MjFDMVwiLFxuICBcInJoYXJ1XCI6XCJcXHUyMUMwXCIsXG4gIFwicmhhcnVsXCI6XCJcXHUyOTZDXCIsXG4gIFwiUmhvXCI6XCJcXHUwM0ExXCIsXG4gIFwicmhvXCI6XCJcXHUwM0MxXCIsXG4gIFwicmhvdlwiOlwiXFx1MDNGMVwiLFxuICBcIlJpZ2h0QW5nbGVCcmFja2V0XCI6XCJcXHUyN0U5XCIsXG4gIFwiUmlnaHRBcnJvd1wiOlwiXFx1MjE5MlwiLFxuICBcIlJpZ2h0YXJyb3dcIjpcIlxcdTIxRDJcIixcbiAgXCJyaWdodGFycm93XCI6XCJcXHUyMTkyXCIsXG4gIFwiUmlnaHRBcnJvd0JhclwiOlwiXFx1MjFFNVwiLFxuICBcIlJpZ2h0QXJyb3dMZWZ0QXJyb3dcIjpcIlxcdTIxQzRcIixcbiAgXCJyaWdodGFycm93dGFpbFwiOlwiXFx1MjFBM1wiLFxuICBcIlJpZ2h0Q2VpbGluZ1wiOlwiXFx1MjMwOVwiLFxuICBcIlJpZ2h0RG91YmxlQnJhY2tldFwiOlwiXFx1MjdFN1wiLFxuICBcIlJpZ2h0RG93blRlZVZlY3RvclwiOlwiXFx1Mjk1RFwiLFxuICBcIlJpZ2h0RG93blZlY3RvclwiOlwiXFx1MjFDMlwiLFxuICBcIlJpZ2h0RG93blZlY3RvckJhclwiOlwiXFx1Mjk1NVwiLFxuICBcIlJpZ2h0Rmxvb3JcIjpcIlxcdTIzMEJcIixcbiAgXCJyaWdodGhhcnBvb25kb3duXCI6XCJcXHUyMUMxXCIsXG4gIFwicmlnaHRoYXJwb29udXBcIjpcIlxcdTIxQzBcIixcbiAgXCJyaWdodGxlZnRhcnJvd3NcIjpcIlxcdTIxQzRcIixcbiAgXCJyaWdodGxlZnRoYXJwb29uc1wiOlwiXFx1MjFDQ1wiLFxuICBcInJpZ2h0cmlnaHRhcnJvd3NcIjpcIlxcdTIxQzlcIixcbiAgXCJyaWdodHNxdWlnYXJyb3dcIjpcIlxcdTIxOURcIixcbiAgXCJSaWdodFRlZVwiOlwiXFx1MjJBMlwiLFxuICBcIlJpZ2h0VGVlQXJyb3dcIjpcIlxcdTIxQTZcIixcbiAgXCJSaWdodFRlZVZlY3RvclwiOlwiXFx1Mjk1QlwiLFxuICBcInJpZ2h0dGhyZWV0aW1lc1wiOlwiXFx1MjJDQ1wiLFxuICBcIlJpZ2h0VHJpYW5nbGVcIjpcIlxcdTIyQjNcIixcbiAgXCJSaWdodFRyaWFuZ2xlQmFyXCI6XCJcXHUyOUQwXCIsXG4gIFwiUmlnaHRUcmlhbmdsZUVxdWFsXCI6XCJcXHUyMkI1XCIsXG4gIFwiUmlnaHRVcERvd25WZWN0b3JcIjpcIlxcdTI5NEZcIixcbiAgXCJSaWdodFVwVGVlVmVjdG9yXCI6XCJcXHUyOTVDXCIsXG4gIFwiUmlnaHRVcFZlY3RvclwiOlwiXFx1MjFCRVwiLFxuICBcIlJpZ2h0VXBWZWN0b3JCYXJcIjpcIlxcdTI5NTRcIixcbiAgXCJSaWdodFZlY3RvclwiOlwiXFx1MjFDMFwiLFxuICBcIlJpZ2h0VmVjdG9yQmFyXCI6XCJcXHUyOTUzXCIsXG4gIFwicmluZ1wiOlwiXFx1MDJEQVwiLFxuICBcInJpc2luZ2RvdHNlcVwiOlwiXFx1MjI1M1wiLFxuICBcInJsYXJyXCI6XCJcXHUyMUM0XCIsXG4gIFwicmxoYXJcIjpcIlxcdTIxQ0NcIixcbiAgXCJybG1cIjpcIlxcdTIwMEZcIixcbiAgXCJybW91c3RcIjpcIlxcdTIzQjFcIixcbiAgXCJybW91c3RhY2hlXCI6XCJcXHUyM0IxXCIsXG4gIFwicm5taWRcIjpcIlxcdTJBRUVcIixcbiAgXCJyb2FuZ1wiOlwiXFx1MjdFRFwiLFxuICBcInJvYXJyXCI6XCJcXHUyMUZFXCIsXG4gIFwicm9icmtcIjpcIlxcdTI3RTdcIixcbiAgXCJyb3BhclwiOlwiXFx1Mjk4NlwiLFxuICBcIlJvcGZcIjpcIlxcdTIxMURcIixcbiAgXCJyb3BmXCI6XCJcXHVEODM1XFx1REQ2M1wiLFxuICBcInJvcGx1c1wiOlwiXFx1MkEyRVwiLFxuICBcInJvdGltZXNcIjpcIlxcdTJBMzVcIixcbiAgXCJSb3VuZEltcGxpZXNcIjpcIlxcdTI5NzBcIixcbiAgXCJycGFyXCI6XCJcXHUwMDI5XCIsXG4gIFwicnBhcmd0XCI6XCJcXHUyOTk0XCIsXG4gIFwicnBwb2xpbnRcIjpcIlxcdTJBMTJcIixcbiAgXCJycmFyclwiOlwiXFx1MjFDOVwiLFxuICBcIlJyaWdodGFycm93XCI6XCJcXHUyMURCXCIsXG4gIFwicnNhcXVvXCI6XCJcXHUyMDNBXCIsXG4gIFwiUnNjclwiOlwiXFx1MjExQlwiLFxuICBcInJzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M3XCIsXG4gIFwiUnNoXCI6XCJcXHUyMUIxXCIsXG4gIFwicnNoXCI6XCJcXHUyMUIxXCIsXG4gIFwicnNxYlwiOlwiXFx1MDA1RFwiLFxuICBcInJzcXVvXCI6XCJcXHUyMDE5XCIsXG4gIFwicnNxdW9yXCI6XCJcXHUyMDE5XCIsXG4gIFwicnRocmVlXCI6XCJcXHUyMkNDXCIsXG4gIFwicnRpbWVzXCI6XCJcXHUyMkNBXCIsXG4gIFwicnRyaVwiOlwiXFx1MjVCOVwiLFxuICBcInJ0cmllXCI6XCJcXHUyMkI1XCIsXG4gIFwicnRyaWZcIjpcIlxcdTI1QjhcIixcbiAgXCJydHJpbHRyaVwiOlwiXFx1MjlDRVwiLFxuICBcIlJ1bGVEZWxheWVkXCI6XCJcXHUyOUY0XCIsXG4gIFwicnVsdWhhclwiOlwiXFx1Mjk2OFwiLFxuICBcInJ4XCI6XCJcXHUyMTFFXCIsXG4gIFwiU2FjdXRlXCI6XCJcXHUwMTVBXCIsXG4gIFwic2FjdXRlXCI6XCJcXHUwMTVCXCIsXG4gIFwic2JxdW9cIjpcIlxcdTIwMUFcIixcbiAgXCJTY1wiOlwiXFx1MkFCQ1wiLFxuICBcInNjXCI6XCJcXHUyMjdCXCIsXG4gIFwic2NhcFwiOlwiXFx1MkFCOFwiLFxuICBcIlNjYXJvblwiOlwiXFx1MDE2MFwiLFxuICBcInNjYXJvblwiOlwiXFx1MDE2MVwiLFxuICBcInNjY3VlXCI6XCJcXHUyMjdEXCIsXG4gIFwic2NFXCI6XCJcXHUyQUI0XCIsXG4gIFwic2NlXCI6XCJcXHUyQUIwXCIsXG4gIFwiU2NlZGlsXCI6XCJcXHUwMTVFXCIsXG4gIFwic2NlZGlsXCI6XCJcXHUwMTVGXCIsXG4gIFwiU2NpcmNcIjpcIlxcdTAxNUNcIixcbiAgXCJzY2lyY1wiOlwiXFx1MDE1RFwiLFxuICBcInNjbmFwXCI6XCJcXHUyQUJBXCIsXG4gIFwic2NuRVwiOlwiXFx1MkFCNlwiLFxuICBcInNjbnNpbVwiOlwiXFx1MjJFOVwiLFxuICBcInNjcG9saW50XCI6XCJcXHUyQTEzXCIsXG4gIFwic2NzaW1cIjpcIlxcdTIyN0ZcIixcbiAgXCJTY3lcIjpcIlxcdTA0MjFcIixcbiAgXCJzY3lcIjpcIlxcdTA0NDFcIixcbiAgXCJzZG90XCI6XCJcXHUyMkM1XCIsXG4gIFwic2RvdGJcIjpcIlxcdTIyQTFcIixcbiAgXCJzZG90ZVwiOlwiXFx1MkE2NlwiLFxuICBcInNlYXJoa1wiOlwiXFx1MjkyNVwiLFxuICBcInNlQXJyXCI6XCJcXHUyMUQ4XCIsXG4gIFwic2VhcnJcIjpcIlxcdTIxOThcIixcbiAgXCJzZWFycm93XCI6XCJcXHUyMTk4XCIsXG4gIFwic2VjdFwiOlwiXFx1MDBBN1wiLFxuICBcInNlbWlcIjpcIlxcdTAwM0JcIixcbiAgXCJzZXN3YXJcIjpcIlxcdTI5MjlcIixcbiAgXCJzZXRtaW51c1wiOlwiXFx1MjIxNlwiLFxuICBcInNldG1uXCI6XCJcXHUyMjE2XCIsXG4gIFwic2V4dFwiOlwiXFx1MjczNlwiLFxuICBcIlNmclwiOlwiXFx1RDgzNVxcdUREMTZcIixcbiAgXCJzZnJcIjpcIlxcdUQ4MzVcXHVERDMwXCIsXG4gIFwic2Zyb3duXCI6XCJcXHUyMzIyXCIsXG4gIFwic2hhcnBcIjpcIlxcdTI2NkZcIixcbiAgXCJTSENIY3lcIjpcIlxcdTA0MjlcIixcbiAgXCJzaGNoY3lcIjpcIlxcdTA0NDlcIixcbiAgXCJTSGN5XCI6XCJcXHUwNDI4XCIsXG4gIFwic2hjeVwiOlwiXFx1MDQ0OFwiLFxuICBcIlNob3J0RG93bkFycm93XCI6XCJcXHUyMTkzXCIsXG4gIFwiU2hvcnRMZWZ0QXJyb3dcIjpcIlxcdTIxOTBcIixcbiAgXCJzaG9ydG1pZFwiOlwiXFx1MjIyM1wiLFxuICBcInNob3J0cGFyYWxsZWxcIjpcIlxcdTIyMjVcIixcbiAgXCJTaG9ydFJpZ2h0QXJyb3dcIjpcIlxcdTIxOTJcIixcbiAgXCJTaG9ydFVwQXJyb3dcIjpcIlxcdTIxOTFcIixcbiAgXCJzaHlcIjpcIlxcdTAwQURcIixcbiAgXCJTaWdtYVwiOlwiXFx1MDNBM1wiLFxuICBcInNpZ21hXCI6XCJcXHUwM0MzXCIsXG4gIFwic2lnbWFmXCI6XCJcXHUwM0MyXCIsXG4gIFwic2lnbWF2XCI6XCJcXHUwM0MyXCIsXG4gIFwic2ltXCI6XCJcXHUyMjNDXCIsXG4gIFwic2ltZG90XCI6XCJcXHUyQTZBXCIsXG4gIFwic2ltZVwiOlwiXFx1MjI0M1wiLFxuICBcInNpbWVxXCI6XCJcXHUyMjQzXCIsXG4gIFwic2ltZ1wiOlwiXFx1MkE5RVwiLFxuICBcInNpbWdFXCI6XCJcXHUyQUEwXCIsXG4gIFwic2ltbFwiOlwiXFx1MkE5RFwiLFxuICBcInNpbWxFXCI6XCJcXHUyQTlGXCIsXG4gIFwic2ltbmVcIjpcIlxcdTIyNDZcIixcbiAgXCJzaW1wbHVzXCI6XCJcXHUyQTI0XCIsXG4gIFwic2ltcmFyclwiOlwiXFx1Mjk3MlwiLFxuICBcInNsYXJyXCI6XCJcXHUyMTkwXCIsXG4gIFwiU21hbGxDaXJjbGVcIjpcIlxcdTIyMThcIixcbiAgXCJzbWFsbHNldG1pbnVzXCI6XCJcXHUyMjE2XCIsXG4gIFwic21hc2hwXCI6XCJcXHUyQTMzXCIsXG4gIFwic21lcGFyc2xcIjpcIlxcdTI5RTRcIixcbiAgXCJzbWlkXCI6XCJcXHUyMjIzXCIsXG4gIFwic21pbGVcIjpcIlxcdTIzMjNcIixcbiAgXCJzbXRcIjpcIlxcdTJBQUFcIixcbiAgXCJzbXRlXCI6XCJcXHUyQUFDXCIsXG4gIFwic210ZXNcIjpcIlxcdTJBQUNcXHVGRTAwXCIsXG4gIFwiU09GVGN5XCI6XCJcXHUwNDJDXCIsXG4gIFwic29mdGN5XCI6XCJcXHUwNDRDXCIsXG4gIFwic29sXCI6XCJcXHUwMDJGXCIsXG4gIFwic29sYlwiOlwiXFx1MjlDNFwiLFxuICBcInNvbGJhclwiOlwiXFx1MjMzRlwiLFxuICBcIlNvcGZcIjpcIlxcdUQ4MzVcXHVERDRBXCIsXG4gIFwic29wZlwiOlwiXFx1RDgzNVxcdURENjRcIixcbiAgXCJzcGFkZXNcIjpcIlxcdTI2NjBcIixcbiAgXCJzcGFkZXN1aXRcIjpcIlxcdTI2NjBcIixcbiAgXCJzcGFyXCI6XCJcXHUyMjI1XCIsXG4gIFwic3FjYXBcIjpcIlxcdTIyOTNcIixcbiAgXCJzcWNhcHNcIjpcIlxcdTIyOTNcXHVGRTAwXCIsXG4gIFwic3FjdXBcIjpcIlxcdTIyOTRcIixcbiAgXCJzcWN1cHNcIjpcIlxcdTIyOTRcXHVGRTAwXCIsXG4gIFwiU3FydFwiOlwiXFx1MjIxQVwiLFxuICBcInNxc3ViXCI6XCJcXHUyMjhGXCIsXG4gIFwic3FzdWJlXCI6XCJcXHUyMjkxXCIsXG4gIFwic3FzdWJzZXRcIjpcIlxcdTIyOEZcIixcbiAgXCJzcXN1YnNldGVxXCI6XCJcXHUyMjkxXCIsXG4gIFwic3FzdXBcIjpcIlxcdTIyOTBcIixcbiAgXCJzcXN1cGVcIjpcIlxcdTIyOTJcIixcbiAgXCJzcXN1cHNldFwiOlwiXFx1MjI5MFwiLFxuICBcInNxc3Vwc2V0ZXFcIjpcIlxcdTIyOTJcIixcbiAgXCJzcXVcIjpcIlxcdTI1QTFcIixcbiAgXCJTcXVhcmVcIjpcIlxcdTI1QTFcIixcbiAgXCJzcXVhcmVcIjpcIlxcdTI1QTFcIixcbiAgXCJTcXVhcmVJbnRlcnNlY3Rpb25cIjpcIlxcdTIyOTNcIixcbiAgXCJTcXVhcmVTdWJzZXRcIjpcIlxcdTIyOEZcIixcbiAgXCJTcXVhcmVTdWJzZXRFcXVhbFwiOlwiXFx1MjI5MVwiLFxuICBcIlNxdWFyZVN1cGVyc2V0XCI6XCJcXHUyMjkwXCIsXG4gIFwiU3F1YXJlU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjI5MlwiLFxuICBcIlNxdWFyZVVuaW9uXCI6XCJcXHUyMjk0XCIsXG4gIFwic3F1YXJmXCI6XCJcXHUyNUFBXCIsXG4gIFwic3F1ZlwiOlwiXFx1MjVBQVwiLFxuICBcInNyYXJyXCI6XCJcXHUyMTkyXCIsXG4gIFwiU3NjclwiOlwiXFx1RDgzNVxcdURDQUVcIixcbiAgXCJzc2NyXCI6XCJcXHVEODM1XFx1RENDOFwiLFxuICBcInNzZXRtblwiOlwiXFx1MjIxNlwiLFxuICBcInNzbWlsZVwiOlwiXFx1MjMyM1wiLFxuICBcInNzdGFyZlwiOlwiXFx1MjJDNlwiLFxuICBcIlN0YXJcIjpcIlxcdTIyQzZcIixcbiAgXCJzdGFyXCI6XCJcXHUyNjA2XCIsXG4gIFwic3RhcmZcIjpcIlxcdTI2MDVcIixcbiAgXCJzdHJhaWdodGVwc2lsb25cIjpcIlxcdTAzRjVcIixcbiAgXCJzdHJhaWdodHBoaVwiOlwiXFx1MDNENVwiLFxuICBcInN0cm5zXCI6XCJcXHUwMEFGXCIsXG4gIFwiU3ViXCI6XCJcXHUyMkQwXCIsXG4gIFwic3ViXCI6XCJcXHUyMjgyXCIsXG4gIFwic3ViZG90XCI6XCJcXHUyQUJEXCIsXG4gIFwic3ViRVwiOlwiXFx1MkFDNVwiLFxuICBcInN1YmVcIjpcIlxcdTIyODZcIixcbiAgXCJzdWJlZG90XCI6XCJcXHUyQUMzXCIsXG4gIFwic3VibXVsdFwiOlwiXFx1MkFDMVwiLFxuICBcInN1Ym5FXCI6XCJcXHUyQUNCXCIsXG4gIFwic3VibmVcIjpcIlxcdTIyOEFcIixcbiAgXCJzdWJwbHVzXCI6XCJcXHUyQUJGXCIsXG4gIFwic3VicmFyclwiOlwiXFx1Mjk3OVwiLFxuICBcIlN1YnNldFwiOlwiXFx1MjJEMFwiLFxuICBcInN1YnNldFwiOlwiXFx1MjI4MlwiLFxuICBcInN1YnNldGVxXCI6XCJcXHUyMjg2XCIsXG4gIFwic3Vic2V0ZXFxXCI6XCJcXHUyQUM1XCIsXG4gIFwiU3Vic2V0RXF1YWxcIjpcIlxcdTIyODZcIixcbiAgXCJzdWJzZXRuZXFcIjpcIlxcdTIyOEFcIixcbiAgXCJzdWJzZXRuZXFxXCI6XCJcXHUyQUNCXCIsXG4gIFwic3Vic2ltXCI6XCJcXHUyQUM3XCIsXG4gIFwic3Vic3ViXCI6XCJcXHUyQUQ1XCIsXG4gIFwic3Vic3VwXCI6XCJcXHUyQUQzXCIsXG4gIFwic3VjY1wiOlwiXFx1MjI3QlwiLFxuICBcInN1Y2NhcHByb3hcIjpcIlxcdTJBQjhcIixcbiAgXCJzdWNjY3VybHllcVwiOlwiXFx1MjI3RFwiLFxuICBcIlN1Y2NlZWRzXCI6XCJcXHUyMjdCXCIsXG4gIFwiU3VjY2VlZHNFcXVhbFwiOlwiXFx1MkFCMFwiLFxuICBcIlN1Y2NlZWRzU2xhbnRFcXVhbFwiOlwiXFx1MjI3RFwiLFxuICBcIlN1Y2NlZWRzVGlsZGVcIjpcIlxcdTIyN0ZcIixcbiAgXCJzdWNjZXFcIjpcIlxcdTJBQjBcIixcbiAgXCJzdWNjbmFwcHJveFwiOlwiXFx1MkFCQVwiLFxuICBcInN1Y2NuZXFxXCI6XCJcXHUyQUI2XCIsXG4gIFwic3VjY25zaW1cIjpcIlxcdTIyRTlcIixcbiAgXCJzdWNjc2ltXCI6XCJcXHUyMjdGXCIsXG4gIFwiU3VjaFRoYXRcIjpcIlxcdTIyMEJcIixcbiAgXCJTdW1cIjpcIlxcdTIyMTFcIixcbiAgXCJzdW1cIjpcIlxcdTIyMTFcIixcbiAgXCJzdW5nXCI6XCJcXHUyNjZBXCIsXG4gIFwiU3VwXCI6XCJcXHUyMkQxXCIsXG4gIFwic3VwXCI6XCJcXHUyMjgzXCIsXG4gIFwic3VwMVwiOlwiXFx1MDBCOVwiLFxuICBcInN1cDJcIjpcIlxcdTAwQjJcIixcbiAgXCJzdXAzXCI6XCJcXHUwMEIzXCIsXG4gIFwic3VwZG90XCI6XCJcXHUyQUJFXCIsXG4gIFwic3VwZHN1YlwiOlwiXFx1MkFEOFwiLFxuICBcInN1cEVcIjpcIlxcdTJBQzZcIixcbiAgXCJzdXBlXCI6XCJcXHUyMjg3XCIsXG4gIFwic3VwZWRvdFwiOlwiXFx1MkFDNFwiLFxuICBcIlN1cGVyc2V0XCI6XCJcXHUyMjgzXCIsXG4gIFwiU3VwZXJzZXRFcXVhbFwiOlwiXFx1MjI4N1wiLFxuICBcInN1cGhzb2xcIjpcIlxcdTI3QzlcIixcbiAgXCJzdXBoc3ViXCI6XCJcXHUyQUQ3XCIsXG4gIFwic3VwbGFyclwiOlwiXFx1Mjk3QlwiLFxuICBcInN1cG11bHRcIjpcIlxcdTJBQzJcIixcbiAgXCJzdXBuRVwiOlwiXFx1MkFDQ1wiLFxuICBcInN1cG5lXCI6XCJcXHUyMjhCXCIsXG4gIFwic3VwcGx1c1wiOlwiXFx1MkFDMFwiLFxuICBcIlN1cHNldFwiOlwiXFx1MjJEMVwiLFxuICBcInN1cHNldFwiOlwiXFx1MjI4M1wiLFxuICBcInN1cHNldGVxXCI6XCJcXHUyMjg3XCIsXG4gIFwic3Vwc2V0ZXFxXCI6XCJcXHUyQUM2XCIsXG4gIFwic3Vwc2V0bmVxXCI6XCJcXHUyMjhCXCIsXG4gIFwic3Vwc2V0bmVxcVwiOlwiXFx1MkFDQ1wiLFxuICBcInN1cHNpbVwiOlwiXFx1MkFDOFwiLFxuICBcInN1cHN1YlwiOlwiXFx1MkFENFwiLFxuICBcInN1cHN1cFwiOlwiXFx1MkFENlwiLFxuICBcInN3YXJoa1wiOlwiXFx1MjkyNlwiLFxuICBcInN3QXJyXCI6XCJcXHUyMUQ5XCIsXG4gIFwic3dhcnJcIjpcIlxcdTIxOTlcIixcbiAgXCJzd2Fycm93XCI6XCJcXHUyMTk5XCIsXG4gIFwic3dud2FyXCI6XCJcXHUyOTJBXCIsXG4gIFwic3psaWdcIjpcIlxcdTAwREZcIixcbiAgXCJUYWJcIjpcIlxcdTAwMDlcIixcbiAgXCJ0YXJnZXRcIjpcIlxcdTIzMTZcIixcbiAgXCJUYXVcIjpcIlxcdTAzQTRcIixcbiAgXCJ0YXVcIjpcIlxcdTAzQzRcIixcbiAgXCJ0YnJrXCI6XCJcXHUyM0I0XCIsXG4gIFwiVGNhcm9uXCI6XCJcXHUwMTY0XCIsXG4gIFwidGNhcm9uXCI6XCJcXHUwMTY1XCIsXG4gIFwiVGNlZGlsXCI6XCJcXHUwMTYyXCIsXG4gIFwidGNlZGlsXCI6XCJcXHUwMTYzXCIsXG4gIFwiVGN5XCI6XCJcXHUwNDIyXCIsXG4gIFwidGN5XCI6XCJcXHUwNDQyXCIsXG4gIFwidGRvdFwiOlwiXFx1MjBEQlwiLFxuICBcInRlbHJlY1wiOlwiXFx1MjMxNVwiLFxuICBcIlRmclwiOlwiXFx1RDgzNVxcdUREMTdcIixcbiAgXCJ0ZnJcIjpcIlxcdUQ4MzVcXHVERDMxXCIsXG4gIFwidGhlcmU0XCI6XCJcXHUyMjM0XCIsXG4gIFwiVGhlcmVmb3JlXCI6XCJcXHUyMjM0XCIsXG4gIFwidGhlcmVmb3JlXCI6XCJcXHUyMjM0XCIsXG4gIFwiVGhldGFcIjpcIlxcdTAzOThcIixcbiAgXCJ0aGV0YVwiOlwiXFx1MDNCOFwiLFxuICBcInRoZXRhc3ltXCI6XCJcXHUwM0QxXCIsXG4gIFwidGhldGF2XCI6XCJcXHUwM0QxXCIsXG4gIFwidGhpY2thcHByb3hcIjpcIlxcdTIyNDhcIixcbiAgXCJ0aGlja3NpbVwiOlwiXFx1MjIzQ1wiLFxuICBcIlRoaWNrU3BhY2VcIjpcIlxcdTIwNUZcXHUyMDBBXCIsXG4gIFwidGhpbnNwXCI6XCJcXHUyMDA5XCIsXG4gIFwiVGhpblNwYWNlXCI6XCJcXHUyMDA5XCIsXG4gIFwidGhrYXBcIjpcIlxcdTIyNDhcIixcbiAgXCJ0aGtzaW1cIjpcIlxcdTIyM0NcIixcbiAgXCJUSE9STlwiOlwiXFx1MDBERVwiLFxuICBcInRob3JuXCI6XCJcXHUwMEZFXCIsXG4gIFwiVGlsZGVcIjpcIlxcdTIyM0NcIixcbiAgXCJ0aWxkZVwiOlwiXFx1MDJEQ1wiLFxuICBcIlRpbGRlRXF1YWxcIjpcIlxcdTIyNDNcIixcbiAgXCJUaWxkZUZ1bGxFcXVhbFwiOlwiXFx1MjI0NVwiLFxuICBcIlRpbGRlVGlsZGVcIjpcIlxcdTIyNDhcIixcbiAgXCJ0aW1lc1wiOlwiXFx1MDBEN1wiLFxuICBcInRpbWVzYlwiOlwiXFx1MjJBMFwiLFxuICBcInRpbWVzYmFyXCI6XCJcXHUyQTMxXCIsXG4gIFwidGltZXNkXCI6XCJcXHUyQTMwXCIsXG4gIFwidGludFwiOlwiXFx1MjIyRFwiLFxuICBcInRvZWFcIjpcIlxcdTI5MjhcIixcbiAgXCJ0b3BcIjpcIlxcdTIyQTRcIixcbiAgXCJ0b3Bib3RcIjpcIlxcdTIzMzZcIixcbiAgXCJ0b3BjaXJcIjpcIlxcdTJBRjFcIixcbiAgXCJUb3BmXCI6XCJcXHVEODM1XFx1REQ0QlwiLFxuICBcInRvcGZcIjpcIlxcdUQ4MzVcXHVERDY1XCIsXG4gIFwidG9wZm9ya1wiOlwiXFx1MkFEQVwiLFxuICBcInRvc2FcIjpcIlxcdTI5MjlcIixcbiAgXCJ0cHJpbWVcIjpcIlxcdTIwMzRcIixcbiAgXCJUUkFERVwiOlwiXFx1MjEyMlwiLFxuICBcInRyYWRlXCI6XCJcXHUyMTIyXCIsXG4gIFwidHJpYW5nbGVcIjpcIlxcdTI1QjVcIixcbiAgXCJ0cmlhbmdsZWRvd25cIjpcIlxcdTI1QkZcIixcbiAgXCJ0cmlhbmdsZWxlZnRcIjpcIlxcdTI1QzNcIixcbiAgXCJ0cmlhbmdsZWxlZnRlcVwiOlwiXFx1MjJCNFwiLFxuICBcInRyaWFuZ2xlcVwiOlwiXFx1MjI1Q1wiLFxuICBcInRyaWFuZ2xlcmlnaHRcIjpcIlxcdTI1QjlcIixcbiAgXCJ0cmlhbmdsZXJpZ2h0ZXFcIjpcIlxcdTIyQjVcIixcbiAgXCJ0cmlkb3RcIjpcIlxcdTI1RUNcIixcbiAgXCJ0cmllXCI6XCJcXHUyMjVDXCIsXG4gIFwidHJpbWludXNcIjpcIlxcdTJBM0FcIixcbiAgXCJUcmlwbGVEb3RcIjpcIlxcdTIwREJcIixcbiAgXCJ0cmlwbHVzXCI6XCJcXHUyQTM5XCIsXG4gIFwidHJpc2JcIjpcIlxcdTI5Q0RcIixcbiAgXCJ0cml0aW1lXCI6XCJcXHUyQTNCXCIsXG4gIFwidHJwZXppdW1cIjpcIlxcdTIzRTJcIixcbiAgXCJUc2NyXCI6XCJcXHVEODM1XFx1RENBRlwiLFxuICBcInRzY3JcIjpcIlxcdUQ4MzVcXHVEQ0M5XCIsXG4gIFwiVFNjeVwiOlwiXFx1MDQyNlwiLFxuICBcInRzY3lcIjpcIlxcdTA0NDZcIixcbiAgXCJUU0hjeVwiOlwiXFx1MDQwQlwiLFxuICBcInRzaGN5XCI6XCJcXHUwNDVCXCIsXG4gIFwiVHN0cm9rXCI6XCJcXHUwMTY2XCIsXG4gIFwidHN0cm9rXCI6XCJcXHUwMTY3XCIsXG4gIFwidHdpeHRcIjpcIlxcdTIyNkNcIixcbiAgXCJ0d29oZWFkbGVmdGFycm93XCI6XCJcXHUyMTlFXCIsXG4gIFwidHdvaGVhZHJpZ2h0YXJyb3dcIjpcIlxcdTIxQTBcIixcbiAgXCJVYWN1dGVcIjpcIlxcdTAwREFcIixcbiAgXCJ1YWN1dGVcIjpcIlxcdTAwRkFcIixcbiAgXCJVYXJyXCI6XCJcXHUyMTlGXCIsXG4gIFwidUFyclwiOlwiXFx1MjFEMVwiLFxuICBcInVhcnJcIjpcIlxcdTIxOTFcIixcbiAgXCJVYXJyb2NpclwiOlwiXFx1Mjk0OVwiLFxuICBcIlVicmN5XCI6XCJcXHUwNDBFXCIsXG4gIFwidWJyY3lcIjpcIlxcdTA0NUVcIixcbiAgXCJVYnJldmVcIjpcIlxcdTAxNkNcIixcbiAgXCJ1YnJldmVcIjpcIlxcdTAxNkRcIixcbiAgXCJVY2lyY1wiOlwiXFx1MDBEQlwiLFxuICBcInVjaXJjXCI6XCJcXHUwMEZCXCIsXG4gIFwiVWN5XCI6XCJcXHUwNDIzXCIsXG4gIFwidWN5XCI6XCJcXHUwNDQzXCIsXG4gIFwidWRhcnJcIjpcIlxcdTIxQzVcIixcbiAgXCJVZGJsYWNcIjpcIlxcdTAxNzBcIixcbiAgXCJ1ZGJsYWNcIjpcIlxcdTAxNzFcIixcbiAgXCJ1ZGhhclwiOlwiXFx1Mjk2RVwiLFxuICBcInVmaXNodFwiOlwiXFx1Mjk3RVwiLFxuICBcIlVmclwiOlwiXFx1RDgzNVxcdUREMThcIixcbiAgXCJ1ZnJcIjpcIlxcdUQ4MzVcXHVERDMyXCIsXG4gIFwiVWdyYXZlXCI6XCJcXHUwMEQ5XCIsXG4gIFwidWdyYXZlXCI6XCJcXHUwMEY5XCIsXG4gIFwidUhhclwiOlwiXFx1Mjk2M1wiLFxuICBcInVoYXJsXCI6XCJcXHUyMUJGXCIsXG4gIFwidWhhcnJcIjpcIlxcdTIxQkVcIixcbiAgXCJ1aGJsa1wiOlwiXFx1MjU4MFwiLFxuICBcInVsY29yblwiOlwiXFx1MjMxQ1wiLFxuICBcInVsY29ybmVyXCI6XCJcXHUyMzFDXCIsXG4gIFwidWxjcm9wXCI6XCJcXHUyMzBGXCIsXG4gIFwidWx0cmlcIjpcIlxcdTI1RjhcIixcbiAgXCJVbWFjclwiOlwiXFx1MDE2QVwiLFxuICBcInVtYWNyXCI6XCJcXHUwMTZCXCIsXG4gIFwidW1sXCI6XCJcXHUwMEE4XCIsXG4gIFwiVW5kZXJCYXJcIjpcIlxcdTAwNUZcIixcbiAgXCJVbmRlckJyYWNlXCI6XCJcXHUyM0RGXCIsXG4gIFwiVW5kZXJCcmFja2V0XCI6XCJcXHUyM0I1XCIsXG4gIFwiVW5kZXJQYXJlbnRoZXNpc1wiOlwiXFx1MjNERFwiLFxuICBcIlVuaW9uXCI6XCJcXHUyMkMzXCIsXG4gIFwiVW5pb25QbHVzXCI6XCJcXHUyMjhFXCIsXG4gIFwiVW9nb25cIjpcIlxcdTAxNzJcIixcbiAgXCJ1b2dvblwiOlwiXFx1MDE3M1wiLFxuICBcIlVvcGZcIjpcIlxcdUQ4MzVcXHVERDRDXCIsXG4gIFwidW9wZlwiOlwiXFx1RDgzNVxcdURENjZcIixcbiAgXCJVcEFycm93XCI6XCJcXHUyMTkxXCIsXG4gIFwiVXBhcnJvd1wiOlwiXFx1MjFEMVwiLFxuICBcInVwYXJyb3dcIjpcIlxcdTIxOTFcIixcbiAgXCJVcEFycm93QmFyXCI6XCJcXHUyOTEyXCIsXG4gIFwiVXBBcnJvd0Rvd25BcnJvd1wiOlwiXFx1MjFDNVwiLFxuICBcIlVwRG93bkFycm93XCI6XCJcXHUyMTk1XCIsXG4gIFwiVXBkb3duYXJyb3dcIjpcIlxcdTIxRDVcIixcbiAgXCJ1cGRvd25hcnJvd1wiOlwiXFx1MjE5NVwiLFxuICBcIlVwRXF1aWxpYnJpdW1cIjpcIlxcdTI5NkVcIixcbiAgXCJ1cGhhcnBvb25sZWZ0XCI6XCJcXHUyMUJGXCIsXG4gIFwidXBoYXJwb29ucmlnaHRcIjpcIlxcdTIxQkVcIixcbiAgXCJ1cGx1c1wiOlwiXFx1MjI4RVwiLFxuICBcIlVwcGVyTGVmdEFycm93XCI6XCJcXHUyMTk2XCIsXG4gIFwiVXBwZXJSaWdodEFycm93XCI6XCJcXHUyMTk3XCIsXG4gIFwiVXBzaVwiOlwiXFx1MDNEMlwiLFxuICBcInVwc2lcIjpcIlxcdTAzQzVcIixcbiAgXCJ1cHNpaFwiOlwiXFx1MDNEMlwiLFxuICBcIlVwc2lsb25cIjpcIlxcdTAzQTVcIixcbiAgXCJ1cHNpbG9uXCI6XCJcXHUwM0M1XCIsXG4gIFwiVXBUZWVcIjpcIlxcdTIyQTVcIixcbiAgXCJVcFRlZUFycm93XCI6XCJcXHUyMUE1XCIsXG4gIFwidXB1cGFycm93c1wiOlwiXFx1MjFDOFwiLFxuICBcInVyY29yblwiOlwiXFx1MjMxRFwiLFxuICBcInVyY29ybmVyXCI6XCJcXHUyMzFEXCIsXG4gIFwidXJjcm9wXCI6XCJcXHUyMzBFXCIsXG4gIFwiVXJpbmdcIjpcIlxcdTAxNkVcIixcbiAgXCJ1cmluZ1wiOlwiXFx1MDE2RlwiLFxuICBcInVydHJpXCI6XCJcXHUyNUY5XCIsXG4gIFwiVXNjclwiOlwiXFx1RDgzNVxcdURDQjBcIixcbiAgXCJ1c2NyXCI6XCJcXHVEODM1XFx1RENDQVwiLFxuICBcInV0ZG90XCI6XCJcXHUyMkYwXCIsXG4gIFwiVXRpbGRlXCI6XCJcXHUwMTY4XCIsXG4gIFwidXRpbGRlXCI6XCJcXHUwMTY5XCIsXG4gIFwidXRyaVwiOlwiXFx1MjVCNVwiLFxuICBcInV0cmlmXCI6XCJcXHUyNUI0XCIsXG4gIFwidXVhcnJcIjpcIlxcdTIxQzhcIixcbiAgXCJVdW1sXCI6XCJcXHUwMERDXCIsXG4gIFwidXVtbFwiOlwiXFx1MDBGQ1wiLFxuICBcInV3YW5nbGVcIjpcIlxcdTI5QTdcIixcbiAgXCJ2YW5ncnRcIjpcIlxcdTI5OUNcIixcbiAgXCJ2YXJlcHNpbG9uXCI6XCJcXHUwM0Y1XCIsXG4gIFwidmFya2FwcGFcIjpcIlxcdTAzRjBcIixcbiAgXCJ2YXJub3RoaW5nXCI6XCJcXHUyMjA1XCIsXG4gIFwidmFycGhpXCI6XCJcXHUwM0Q1XCIsXG4gIFwidmFycGlcIjpcIlxcdTAzRDZcIixcbiAgXCJ2YXJwcm9wdG9cIjpcIlxcdTIyMURcIixcbiAgXCJ2QXJyXCI6XCJcXHUyMUQ1XCIsXG4gIFwidmFyclwiOlwiXFx1MjE5NVwiLFxuICBcInZhcnJob1wiOlwiXFx1MDNGMVwiLFxuICBcInZhcnNpZ21hXCI6XCJcXHUwM0MyXCIsXG4gIFwidmFyc3Vic2V0bmVxXCI6XCJcXHUyMjhBXFx1RkUwMFwiLFxuICBcInZhcnN1YnNldG5lcXFcIjpcIlxcdTJBQ0JcXHVGRTAwXCIsXG4gIFwidmFyc3Vwc2V0bmVxXCI6XCJcXHUyMjhCXFx1RkUwMFwiLFxuICBcInZhcnN1cHNldG5lcXFcIjpcIlxcdTJBQ0NcXHVGRTAwXCIsXG4gIFwidmFydGhldGFcIjpcIlxcdTAzRDFcIixcbiAgXCJ2YXJ0cmlhbmdsZWxlZnRcIjpcIlxcdTIyQjJcIixcbiAgXCJ2YXJ0cmlhbmdsZXJpZ2h0XCI6XCJcXHUyMkIzXCIsXG4gIFwiVmJhclwiOlwiXFx1MkFFQlwiLFxuICBcInZCYXJcIjpcIlxcdTJBRThcIixcbiAgXCJ2QmFydlwiOlwiXFx1MkFFOVwiLFxuICBcIlZjeVwiOlwiXFx1MDQxMlwiLFxuICBcInZjeVwiOlwiXFx1MDQzMlwiLFxuICBcIlZEYXNoXCI6XCJcXHUyMkFCXCIsXG4gIFwiVmRhc2hcIjpcIlxcdTIyQTlcIixcbiAgXCJ2RGFzaFwiOlwiXFx1MjJBOFwiLFxuICBcInZkYXNoXCI6XCJcXHUyMkEyXCIsXG4gIFwiVmRhc2hsXCI6XCJcXHUyQUU2XCIsXG4gIFwiVmVlXCI6XCJcXHUyMkMxXCIsXG4gIFwidmVlXCI6XCJcXHUyMjI4XCIsXG4gIFwidmVlYmFyXCI6XCJcXHUyMkJCXCIsXG4gIFwidmVlZXFcIjpcIlxcdTIyNUFcIixcbiAgXCJ2ZWxsaXBcIjpcIlxcdTIyRUVcIixcbiAgXCJWZXJiYXJcIjpcIlxcdTIwMTZcIixcbiAgXCJ2ZXJiYXJcIjpcIlxcdTAwN0NcIixcbiAgXCJWZXJ0XCI6XCJcXHUyMDE2XCIsXG4gIFwidmVydFwiOlwiXFx1MDA3Q1wiLFxuICBcIlZlcnRpY2FsQmFyXCI6XCJcXHUyMjIzXCIsXG4gIFwiVmVydGljYWxMaW5lXCI6XCJcXHUwMDdDXCIsXG4gIFwiVmVydGljYWxTZXBhcmF0b3JcIjpcIlxcdTI3NThcIixcbiAgXCJWZXJ0aWNhbFRpbGRlXCI6XCJcXHUyMjQwXCIsXG4gIFwiVmVyeVRoaW5TcGFjZVwiOlwiXFx1MjAwQVwiLFxuICBcIlZmclwiOlwiXFx1RDgzNVxcdUREMTlcIixcbiAgXCJ2ZnJcIjpcIlxcdUQ4MzVcXHVERDMzXCIsXG4gIFwidmx0cmlcIjpcIlxcdTIyQjJcIixcbiAgXCJ2bnN1YlwiOlwiXFx1MjI4MlxcdTIwRDJcIixcbiAgXCJ2bnN1cFwiOlwiXFx1MjI4M1xcdTIwRDJcIixcbiAgXCJWb3BmXCI6XCJcXHVEODM1XFx1REQ0RFwiLFxuICBcInZvcGZcIjpcIlxcdUQ4MzVcXHVERDY3XCIsXG4gIFwidnByb3BcIjpcIlxcdTIyMURcIixcbiAgXCJ2cnRyaVwiOlwiXFx1MjJCM1wiLFxuICBcIlZzY3JcIjpcIlxcdUQ4MzVcXHVEQ0IxXCIsXG4gIFwidnNjclwiOlwiXFx1RDgzNVxcdURDQ0JcIixcbiAgXCJ2c3VibkVcIjpcIlxcdTJBQ0JcXHVGRTAwXCIsXG4gIFwidnN1Ym5lXCI6XCJcXHUyMjhBXFx1RkUwMFwiLFxuICBcInZzdXBuRVwiOlwiXFx1MkFDQ1xcdUZFMDBcIixcbiAgXCJ2c3VwbmVcIjpcIlxcdTIyOEJcXHVGRTAwXCIsXG4gIFwiVnZkYXNoXCI6XCJcXHUyMkFBXCIsXG4gIFwidnppZ3phZ1wiOlwiXFx1Mjk5QVwiLFxuICBcIldjaXJjXCI6XCJcXHUwMTc0XCIsXG4gIFwid2NpcmNcIjpcIlxcdTAxNzVcIixcbiAgXCJ3ZWRiYXJcIjpcIlxcdTJBNUZcIixcbiAgXCJXZWRnZVwiOlwiXFx1MjJDMFwiLFxuICBcIndlZGdlXCI6XCJcXHUyMjI3XCIsXG4gIFwid2VkZ2VxXCI6XCJcXHUyMjU5XCIsXG4gIFwid2VpZXJwXCI6XCJcXHUyMTE4XCIsXG4gIFwiV2ZyXCI6XCJcXHVEODM1XFx1REQxQVwiLFxuICBcIndmclwiOlwiXFx1RDgzNVxcdUREMzRcIixcbiAgXCJXb3BmXCI6XCJcXHVEODM1XFx1REQ0RVwiLFxuICBcIndvcGZcIjpcIlxcdUQ4MzVcXHVERDY4XCIsXG4gIFwid3BcIjpcIlxcdTIxMThcIixcbiAgXCJ3clwiOlwiXFx1MjI0MFwiLFxuICBcIndyZWF0aFwiOlwiXFx1MjI0MFwiLFxuICBcIldzY3JcIjpcIlxcdUQ4MzVcXHVEQ0IyXCIsXG4gIFwid3NjclwiOlwiXFx1RDgzNVxcdURDQ0NcIixcbiAgXCJ4Y2FwXCI6XCJcXHUyMkMyXCIsXG4gIFwieGNpcmNcIjpcIlxcdTI1RUZcIixcbiAgXCJ4Y3VwXCI6XCJcXHUyMkMzXCIsXG4gIFwieGR0cmlcIjpcIlxcdTI1QkRcIixcbiAgXCJYZnJcIjpcIlxcdUQ4MzVcXHVERDFCXCIsXG4gIFwieGZyXCI6XCJcXHVEODM1XFx1REQzNVwiLFxuICBcInhoQXJyXCI6XCJcXHUyN0ZBXCIsXG4gIFwieGhhcnJcIjpcIlxcdTI3RjdcIixcbiAgXCJYaVwiOlwiXFx1MDM5RVwiLFxuICBcInhpXCI6XCJcXHUwM0JFXCIsXG4gIFwieGxBcnJcIjpcIlxcdTI3RjhcIixcbiAgXCJ4bGFyclwiOlwiXFx1MjdGNVwiLFxuICBcInhtYXBcIjpcIlxcdTI3RkNcIixcbiAgXCJ4bmlzXCI6XCJcXHUyMkZCXCIsXG4gIFwieG9kb3RcIjpcIlxcdTJBMDBcIixcbiAgXCJYb3BmXCI6XCJcXHVEODM1XFx1REQ0RlwiLFxuICBcInhvcGZcIjpcIlxcdUQ4MzVcXHVERDY5XCIsXG4gIFwieG9wbHVzXCI6XCJcXHUyQTAxXCIsXG4gIFwieG90aW1lXCI6XCJcXHUyQTAyXCIsXG4gIFwieHJBcnJcIjpcIlxcdTI3RjlcIixcbiAgXCJ4cmFyclwiOlwiXFx1MjdGNlwiLFxuICBcIlhzY3JcIjpcIlxcdUQ4MzVcXHVEQ0IzXCIsXG4gIFwieHNjclwiOlwiXFx1RDgzNVxcdURDQ0RcIixcbiAgXCJ4c3FjdXBcIjpcIlxcdTJBMDZcIixcbiAgXCJ4dXBsdXNcIjpcIlxcdTJBMDRcIixcbiAgXCJ4dXRyaVwiOlwiXFx1MjVCM1wiLFxuICBcInh2ZWVcIjpcIlxcdTIyQzFcIixcbiAgXCJ4d2VkZ2VcIjpcIlxcdTIyQzBcIixcbiAgXCJZYWN1dGVcIjpcIlxcdTAwRERcIixcbiAgXCJ5YWN1dGVcIjpcIlxcdTAwRkRcIixcbiAgXCJZQWN5XCI6XCJcXHUwNDJGXCIsXG4gIFwieWFjeVwiOlwiXFx1MDQ0RlwiLFxuICBcIlljaXJjXCI6XCJcXHUwMTc2XCIsXG4gIFwieWNpcmNcIjpcIlxcdTAxNzdcIixcbiAgXCJZY3lcIjpcIlxcdTA0MkJcIixcbiAgXCJ5Y3lcIjpcIlxcdTA0NEJcIixcbiAgXCJ5ZW5cIjpcIlxcdTAwQTVcIixcbiAgXCJZZnJcIjpcIlxcdUQ4MzVcXHVERDFDXCIsXG4gIFwieWZyXCI6XCJcXHVEODM1XFx1REQzNlwiLFxuICBcIllJY3lcIjpcIlxcdTA0MDdcIixcbiAgXCJ5aWN5XCI6XCJcXHUwNDU3XCIsXG4gIFwiWW9wZlwiOlwiXFx1RDgzNVxcdURENTBcIixcbiAgXCJ5b3BmXCI6XCJcXHVEODM1XFx1REQ2QVwiLFxuICBcIllzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I0XCIsXG4gIFwieXNjclwiOlwiXFx1RDgzNVxcdURDQ0VcIixcbiAgXCJZVWN5XCI6XCJcXHUwNDJFXCIsXG4gIFwieXVjeVwiOlwiXFx1MDQ0RVwiLFxuICBcIll1bWxcIjpcIlxcdTAxNzhcIixcbiAgXCJ5dW1sXCI6XCJcXHUwMEZGXCIsXG4gIFwiWmFjdXRlXCI6XCJcXHUwMTc5XCIsXG4gIFwiemFjdXRlXCI6XCJcXHUwMTdBXCIsXG4gIFwiWmNhcm9uXCI6XCJcXHUwMTdEXCIsXG4gIFwiemNhcm9uXCI6XCJcXHUwMTdFXCIsXG4gIFwiWmN5XCI6XCJcXHUwNDE3XCIsXG4gIFwiemN5XCI6XCJcXHUwNDM3XCIsXG4gIFwiWmRvdFwiOlwiXFx1MDE3QlwiLFxuICBcInpkb3RcIjpcIlxcdTAxN0NcIixcbiAgXCJ6ZWV0cmZcIjpcIlxcdTIxMjhcIixcbiAgXCJaZXJvV2lkdGhTcGFjZVwiOlwiXFx1MjAwQlwiLFxuICBcIlpldGFcIjpcIlxcdTAzOTZcIixcbiAgXCJ6ZXRhXCI6XCJcXHUwM0I2XCIsXG4gIFwiWmZyXCI6XCJcXHUyMTI4XCIsXG4gIFwiemZyXCI6XCJcXHVEODM1XFx1REQzN1wiLFxuICBcIlpIY3lcIjpcIlxcdTA0MTZcIixcbiAgXCJ6aGN5XCI6XCJcXHUwNDM2XCIsXG4gIFwiemlncmFyclwiOlwiXFx1MjFERFwiLFxuICBcIlpvcGZcIjpcIlxcdTIxMjRcIixcbiAgXCJ6b3BmXCI6XCJcXHVEODM1XFx1REQ2QlwiLFxuICBcIlpzY3JcIjpcIlxcdUQ4MzVcXHVEQ0I1XCIsXG4gIFwienNjclwiOlwiXFx1RDgzNVxcdURDQ0ZcIixcbiAgXCJ6d2pcIjpcIlxcdTIwMERcIixcbiAgXCJ6d25qXCI6XCJcXHUyMDBDXCJcbn07XG4iLCIvLyBMaXN0IG9mIHZhbGlkIGh0bWwgYmxvY2tzIG5hbWVzLCBhY2NvcnRpbmcgdG8gY29tbW9ubWFyayBzcGVjXG4vLyBodHRwOi8vamdtLmdpdGh1Yi5pby9Db21tb25NYXJrL3NwZWMuaHRtbCNodG1sLWJsb2Nrc1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBodG1sX2Jsb2NrcyA9IHt9O1xuXG5bXG4gICdhcnRpY2xlJyxcbiAgJ2FzaWRlJyxcbiAgJ2J1dHRvbicsXG4gICdibG9ja3F1b3RlJyxcbiAgJ2JvZHknLFxuICAnY2FudmFzJyxcbiAgJ2NhcHRpb24nLFxuICAnY29sJyxcbiAgJ2NvbGdyb3VwJyxcbiAgJ2RkJyxcbiAgJ2RpdicsXG4gICdkbCcsXG4gICdkdCcsXG4gICdlbWJlZCcsXG4gICdmaWVsZHNldCcsXG4gICdmaWdjYXB0aW9uJyxcbiAgJ2ZpZ3VyZScsXG4gICdmb290ZXInLFxuICAnZm9ybScsXG4gICdoMScsXG4gICdoMicsXG4gICdoMycsXG4gICdoNCcsXG4gICdoNScsXG4gICdoNicsXG4gICdoZWFkZXInLFxuICAnaGdyb3VwJyxcbiAgJ2hyJyxcbiAgJ2lmcmFtZScsXG4gICdsaScsXG4gICdtYXAnLFxuICAnb2JqZWN0JyxcbiAgJ29sJyxcbiAgJ291dHB1dCcsXG4gICdwJyxcbiAgJ3ByZScsXG4gICdwcm9ncmVzcycsXG4gICdzY3JpcHQnLFxuICAnc2VjdGlvbicsXG4gICdzdHlsZScsXG4gICd0YWJsZScsXG4gICd0Ym9keScsXG4gICd0ZCcsXG4gICd0ZXh0YXJlYScsXG4gICd0Zm9vdCcsXG4gICd0aCcsXG4gICd0cicsXG4gICd0aGVhZCcsXG4gICd1bCcsXG4gICd2aWRlbydcbl0uZm9yRWFjaChmdW5jdGlvbiAobmFtZSkgeyBodG1sX2Jsb2Nrc1tuYW1lXSA9IHRydWU7IH0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gaHRtbF9ibG9ja3M7XG4iLCIvLyBSZWdleHBzIHRvIG1hdGNoIGh0bWwgZWxlbWVudHNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIG9wdGlvbnMpIHtcbiAgcmVnZXggPSByZWdleC5zb3VyY2U7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8ICcnO1xuXG4gIHJldHVybiBmdW5jdGlvbiBzZWxmKG5hbWUsIHZhbCkge1xuICAgIGlmICghbmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXgsIG9wdGlvbnMpO1xuICAgIH1cbiAgICB2YWwgPSB2YWwuc291cmNlIHx8IHZhbDtcbiAgICByZWdleCA9IHJlZ2V4LnJlcGxhY2UobmFtZSwgdmFsKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbn1cblxuXG52YXIgYXR0cl9uYW1lICAgICA9IC9bYS16QS1aXzpdW2EtekEtWjAtOTouXy1dKi87XG5cbnZhciB1bnF1b3RlZCAgICAgID0gL1teXCInPTw+YFxceDAwLVxceDIwXSsvO1xudmFyIHNpbmdsZV9xdW90ZWQgPSAvJ1teJ10qJy87XG52YXIgZG91YmxlX3F1b3RlZCA9IC9cIlteXCJdKlwiLztcblxuLyplc2xpbnQgbm8tc3BhY2VkLWZ1bmM6MCovXG52YXIgYXR0cl92YWx1ZSAgPSByZXBsYWNlKC8oPzp1bnF1b3RlZHxzaW5nbGVfcXVvdGVkfGRvdWJsZV9xdW90ZWQpLylcbiAgICAgICAgICAgICAgICAgICAgKCd1bnF1b3RlZCcsIHVucXVvdGVkKVxuICAgICAgICAgICAgICAgICAgICAoJ3NpbmdsZV9xdW90ZWQnLCBzaW5nbGVfcXVvdGVkKVxuICAgICAgICAgICAgICAgICAgICAoJ2RvdWJsZV9xdW90ZWQnLCBkb3VibGVfcXVvdGVkKVxuICAgICAgICAgICAgICAgICAgICAoKTtcblxudmFyIGF0dHJpYnV0ZSAgID0gcmVwbGFjZSgvKD86XFxzK2F0dHJfbmFtZSg/Olxccyo9XFxzKmF0dHJfdmFsdWUpPykvKVxuICAgICAgICAgICAgICAgICAgICAoJ2F0dHJfbmFtZScsIGF0dHJfbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgKCdhdHRyX3ZhbHVlJywgYXR0cl92YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgKCk7XG5cbnZhciBvcGVuX3RhZyAgICA9IHJlcGxhY2UoLzxbQS1aYS16XVtBLVphLXowLTldKmF0dHJpYnV0ZSpcXHMqXFwvPz4vKVxuICAgICAgICAgICAgICAgICAgICAoJ2F0dHJpYnV0ZScsIGF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICAgICAgKCk7XG5cbnZhciBjbG9zZV90YWcgICA9IC88XFwvW0EtWmEtel1bQS1aYS16MC05XSpcXHMqPi87XG52YXIgY29tbWVudCAgICAgPSAvPCEtLShbXi1dK3xbLV1bXi1dKykqLS0+LztcbnZhciBwcm9jZXNzaW5nICA9IC88Wz9dLio/Wz9dPi87XG52YXIgZGVjbGFyYXRpb24gPSAvPCFbQS1aXStcXHMrW14+XSo+LztcbnZhciBjZGF0YSAgICAgICA9IC88IVxcW0NEQVRBXFxbKFteXFxdXSt8XFxdW15cXF1dfFxcXVxcXVtePl0pKlxcXVxcXT4vO1xuXG52YXIgSFRNTF9UQUdfUkUgPSByZXBsYWNlKC9eKD86b3Blbl90YWd8Y2xvc2VfdGFnfGNvbW1lbnR8cHJvY2Vzc2luZ3xkZWNsYXJhdGlvbnxjZGF0YSkvKVxuICAoJ29wZW5fdGFnJywgb3Blbl90YWcpXG4gICgnY2xvc2VfdGFnJywgY2xvc2VfdGFnKVxuICAoJ2NvbW1lbnQnLCBjb21tZW50KVxuICAoJ3Byb2Nlc3NpbmcnLCBwcm9jZXNzaW5nKVxuICAoJ2RlY2xhcmF0aW9uJywgZGVjbGFyYXRpb24pXG4gICgnY2RhdGEnLCBjZGF0YSlcbiAgKCk7XG5cblxubW9kdWxlLmV4cG9ydHMuSFRNTF9UQUdfUkUgPSBIVE1MX1RBR19SRTtcbiIsIi8vIExpc3Qgb2YgdmFsaWQgdXJsIHNjaGVtYXMsIGFjY29ydGluZyB0byBjb21tb25tYXJrIHNwZWNcbi8vIGh0dHA6Ly9qZ20uZ2l0aHViLmlvL0NvbW1vbk1hcmsvc3BlYy5odG1sI2F1dG9saW5rc1xuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb2FwJyxcbiAgJ2RvaScsXG4gICdqYXZhc2NyaXB0JyxcbiAgJ2FhYScsXG4gICdhYWFzJyxcbiAgJ2Fib3V0JyxcbiAgJ2FjYXAnLFxuICAnY2FwJyxcbiAgJ2NpZCcsXG4gICdjcmlkJyxcbiAgJ2RhdGEnLFxuICAnZGF2JyxcbiAgJ2RpY3QnLFxuICAnZG5zJyxcbiAgJ2ZpbGUnLFxuICAnZnRwJyxcbiAgJ2dlbycsXG4gICdnbycsXG4gICdnb3BoZXInLFxuICAnaDMyMycsXG4gICdodHRwJyxcbiAgJ2h0dHBzJyxcbiAgJ2lheCcsXG4gICdpY2FwJyxcbiAgJ2ltJyxcbiAgJ2ltYXAnLFxuICAnaW5mbycsXG4gICdpcHAnLFxuICAnaXJpcycsXG4gICdpcmlzLmJlZXAnLFxuICAnaXJpcy54cGMnLFxuICAnaXJpcy54cGNzJyxcbiAgJ2lyaXMubHd6JyxcbiAgJ2xkYXAnLFxuICAnbWFpbHRvJyxcbiAgJ21pZCcsXG4gICdtc3JwJyxcbiAgJ21zcnBzJyxcbiAgJ210cXAnLFxuICAnbXVwZGF0ZScsXG4gICduZXdzJyxcbiAgJ25mcycsXG4gICduaScsXG4gICduaWgnLFxuICAnbm50cCcsXG4gICdvcGFxdWVsb2NrdG9rZW4nLFxuICAncG9wJyxcbiAgJ3ByZXMnLFxuICAncnRzcCcsXG4gICdzZXJ2aWNlJyxcbiAgJ3Nlc3Npb24nLFxuICAnc2h0dHAnLFxuICAnc2lldmUnLFxuICAnc2lwJyxcbiAgJ3NpcHMnLFxuICAnc21zJyxcbiAgJ3NubXAnLFxuICAnc29hcC5iZWVwJyxcbiAgJ3NvYXAuYmVlcHMnLFxuICAndGFnJyxcbiAgJ3RlbCcsXG4gICd0ZWxuZXQnLFxuICAndGZ0cCcsXG4gICd0aGlzbWVzc2FnZScsXG4gICd0bjMyNzAnLFxuICAndGlwJyxcbiAgJ3R2JyxcbiAgJ3VybicsXG4gICd2ZW1taScsXG4gICd3cycsXG4gICd3c3MnLFxuICAneGNvbicsXG4gICd4Y29uLXVzZXJpZCcsXG4gICd4bWxycGMuYmVlcCcsXG4gICd4bWxycGMuYmVlcHMnLFxuICAneG1wcCcsXG4gICd6MzkuNTByJyxcbiAgJ3ozOS41MHMnLFxuICAnYWRpdW14dHJhJyxcbiAgJ2FmcCcsXG4gICdhZnMnLFxuICAnYWltJyxcbiAgJ2FwdCcsXG4gICdhdHRhY2htZW50JyxcbiAgJ2F3JyxcbiAgJ2Jlc2hhcmUnLFxuICAnYml0Y29pbicsXG4gICdib2xvJyxcbiAgJ2NhbGx0bycsXG4gICdjaHJvbWUnLFxuICAnY2hyb21lLWV4dGVuc2lvbicsXG4gICdjb20tZXZlbnRicml0ZS1hdHRlbmRlZScsXG4gICdjb250ZW50JyxcbiAgJ2N2cycsXG4gICdkbG5hLXBsYXlzaW5nbGUnLFxuICAnZGxuYS1wbGF5Y29udGFpbmVyJyxcbiAgJ2R0bicsXG4gICdkdmInLFxuICAnZWQyaycsXG4gICdmYWNldGltZScsXG4gICdmZWVkJyxcbiAgJ2ZpbmdlcicsXG4gICdmaXNoJyxcbiAgJ2dnJyxcbiAgJ2dpdCcsXG4gICdnaXptb3Byb2plY3QnLFxuICAnZ3RhbGsnLFxuICAnaGNwJyxcbiAgJ2ljb24nLFxuICAnaXBuJyxcbiAgJ2lyYycsXG4gICdpcmM2JyxcbiAgJ2lyY3MnLFxuICAnaXRtcycsXG4gICdqYXInLFxuICAnam1zJyxcbiAgJ2tleXBhcmMnLFxuICAnbGFzdGZtJyxcbiAgJ2xkYXBzJyxcbiAgJ21hZ25ldCcsXG4gICdtYXBzJyxcbiAgJ21hcmtldCcsXG4gICdtZXNzYWdlJyxcbiAgJ21tcycsXG4gICdtcy1oZWxwJyxcbiAgJ21zbmltJyxcbiAgJ211bWJsZScsXG4gICdtdm4nLFxuICAnbm90ZXMnLFxuICAnb2lkJyxcbiAgJ3BhbG0nLFxuICAncGFwYXJhenppJyxcbiAgJ3BsYXRmb3JtJyxcbiAgJ3Byb3h5JyxcbiAgJ3BzeWMnLFxuICAncXVlcnknLFxuICAncmVzJyxcbiAgJ3Jlc291cmNlJyxcbiAgJ3JtaScsXG4gICdyc3luYycsXG4gICdydG1wJyxcbiAgJ3NlY29uZGxpZmUnLFxuICAnc2Z0cCcsXG4gICdzZ24nLFxuICAnc2t5cGUnLFxuICAnc21iJyxcbiAgJ3NvbGRhdCcsXG4gICdzcG90aWZ5JyxcbiAgJ3NzaCcsXG4gICdzdGVhbScsXG4gICdzdm4nLFxuICAndGVhbXNwZWFrJyxcbiAgJ3RoaW5ncycsXG4gICd1ZHAnLFxuICAndW5yZWFsJyxcbiAgJ3V0MjAwNCcsXG4gICd2ZW50cmlsbycsXG4gICd2aWV3LXNvdXJjZScsXG4gICd3ZWJjYWwnLFxuICAnd3RhaScsXG4gICd3eWNpd3lnJyxcbiAgJ3hmaXJlJyxcbiAgJ3hyaScsXG4gICd5bXNncidcbl07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnNcbiAqL1xuXG5mdW5jdGlvbiB0eXBlT2Yob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gIHJldHVybiB0eXBlT2Yob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdFxuICAgID8gaGFzT3duLmNhbGwob2JqZWN0LCBrZXkpXG4gICAgOiBmYWxzZTtcbn1cblxuLy8gRXh0ZW5kIG9iamVjdHNcbi8vXG5mdW5jdGlvbiBhc3NpZ24ob2JqIC8qZnJvbTEsIGZyb20yLCBmcm9tMywgLi4uKi8pIHtcbiAgdmFyIHNvdXJjZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoIXNvdXJjZSkgeyByZXR1cm47IH1cblxuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzb3VyY2UgKyAnbXVzdCBiZSBvYmplY3QnKTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIFVORVNDQVBFX01EX1JFID0gL1xcXFwoW1xcXFwhXCIjJCUmJygpKissLlxcLzo7PD0+P0BbXFxdXl9ge3x9fi1dKS9nO1xuXG5mdW5jdGlvbiB1bmVzY2FwZU1kKHN0cikge1xuICBpZiAoc3RyLmluZGV4T2YoJ1xcXFwnKSA8IDApIHsgcmV0dXJuIHN0cjsgfVxuICByZXR1cm4gc3RyLnJlcGxhY2UoVU5FU0NBUEVfTURfUkUsICckMScpO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBpc1ZhbGlkRW50aXR5Q29kZShjKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIC8vIGJyb2tlbiBzZXF1ZW5jZVxuICBpZiAoYyA+PSAweEQ4MDAgJiYgYyA8PSAweERGRkYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIC8vIG5ldmVyIHVzZWRcbiAgaWYgKGMgPj0gMHhGREQwICYmIGMgPD0gMHhGREVGKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoKGMgJiAweEZGRkYpID09PSAweEZGRkYgfHwgKGMgJiAweEZGRkYpID09PSAweEZGRkUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIC8vIGNvbnRyb2wgY29kZXNcbiAgaWYgKGMgPj0gMHgwMCAmJiBjIDw9IDB4MDgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChjID09PSAweDBCKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoYyA+PSAweDBFICYmIGMgPD0gMHgxRikgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGMgPj0gMHg3RiAmJiBjIDw9IDB4OUYpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIC8vIG91dCBvZiByYW5nZVxuICBpZiAoYyA+IDB4MTBGRkZGKSB7IHJldHVybiBmYWxzZTsgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZnJvbUNvZGVQb2ludChjKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIGlmIChjID4gMHhmZmZmKSB7XG4gICAgYyAtPSAweDEwMDAwO1xuICAgIHZhciBzdXJyb2dhdGUxID0gMHhkODAwICsgKGMgPj4gMTApLFxuICAgICAgICBzdXJyb2dhdGUyID0gMHhkYzAwICsgKGMgJiAweDNmZik7XG5cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdXJyb2dhdGUxLCBzdXJyb2dhdGUyKTtcbiAgfVxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbn1cblxudmFyIE5BTUVEX0VOVElUWV9SRSAgID0gLyYoW2EteiNdW2EtejAtOV17MSwzMX0pOy9naTtcbnZhciBESUdJVEFMX0VOVElUWV9URVNUX1JFID0gL14jKCg/OnhbYS1mMC05XXsxLDh9fFswLTldezEsOH0pKS9pO1xudmFyIGVudGl0aWVzID0gcmVxdWlyZSgnLi9lbnRpdGllcycpO1xuXG5mdW5jdGlvbiByZXBsYWNlRW50aXR5UGF0dGVybihtYXRjaCwgbmFtZSkge1xuICB2YXIgY29kZSA9IDA7XG5cbiAgaWYgKGhhcyhlbnRpdGllcywgbmFtZSkpIHtcbiAgICByZXR1cm4gZW50aXRpZXNbbmFtZV07XG4gIH0gZWxzZSBpZiAobmFtZS5jaGFyQ29kZUF0KDApID09PSAweDIzLyogIyAqLyAmJiBESUdJVEFMX0VOVElUWV9URVNUX1JFLnRlc3QobmFtZSkpIHtcbiAgICBjb2RlID0gbmFtZVsxXS50b0xvd2VyQ2FzZSgpID09PSAneCcgP1xuICAgICAgcGFyc2VJbnQobmFtZS5zbGljZSgyKSwgMTYpXG4gICAgOlxuICAgICAgcGFyc2VJbnQobmFtZS5zbGljZSgxKSwgMTApO1xuICAgIGlmIChpc1ZhbGlkRW50aXR5Q29kZShjb2RlKSkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQoY29kZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXRjaDtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUVudGl0aWVzKHN0cikge1xuICBpZiAoc3RyLmluZGV4T2YoJyYnKSA8IDApIHsgcmV0dXJuIHN0cjsgfVxuXG4gIHJldHVybiBzdHIucmVwbGFjZShOQU1FRF9FTlRJVFlfUkUsIHJlcGxhY2VFbnRpdHlQYXR0ZXJuKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxudmFyIEhUTUxfRVNDQVBFX1RFU1RfUkUgPSAvWyY8PlwiXS87XG52YXIgSFRNTF9FU0NBUEVfUkVQTEFDRV9SRSA9IC9bJjw+XCJdL2c7XG52YXIgSFRNTF9SRVBMQUNFTUVOVFMgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7J1xufTtcblxuZnVuY3Rpb24gcmVwbGFjZVVuc2FmZUNoYXIoY2gpIHtcbiAgcmV0dXJuIEhUTUxfUkVQTEFDRU1FTlRTW2NoXTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgaWYgKEhUTUxfRVNDQVBFX1RFU1RfUkUudGVzdChzdHIpKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKEhUTUxfRVNDQVBFX1JFUExBQ0VfUkUsIHJlcGxhY2VVbnNhZmVDaGFyKTtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLmFzc2lnbiAgICAgICAgICAgID0gYXNzaWduO1xuZXhwb3J0cy5pc1N0cmluZyAgICAgICAgICA9IGlzU3RyaW5nO1xuZXhwb3J0cy5oYXMgICAgICAgICAgICAgICA9IGhhcztcbmV4cG9ydHMudW5lc2NhcGVNZCAgICAgICAgPSB1bmVzY2FwZU1kO1xuZXhwb3J0cy5pc1ZhbGlkRW50aXR5Q29kZSA9IGlzVmFsaWRFbnRpdHlDb2RlO1xuZXhwb3J0cy5mcm9tQ29kZVBvaW50ICAgICA9IGZyb21Db2RlUG9pbnQ7XG5leHBvcnRzLnJlcGxhY2VFbnRpdGllcyAgID0gcmVwbGFjZUVudGl0aWVzO1xuZXhwb3J0cy5lc2NhcGVIdG1sICAgICAgICA9IGVzY2FwZUh0bWw7XG4iLCIvLyBDb21tb25tYXJrIGRlZmF1bHQgb3B0aW9uc1xuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG9wdGlvbnM6IHtcbiAgICBodG1sOiAgICAgICAgIHRydWUsICAgICAgICAgLy8gRW5hYmxlIEhUTUwgdGFncyBpbiBzb3VyY2VcbiAgICB4aHRtbE91dDogICAgIHRydWUsICAgICAgICAgLy8gVXNlICcvJyB0byBjbG9zZSBzaW5nbGUgdGFncyAoPGJyIC8+KVxuICAgIGJyZWFrczogICAgICAgZmFsc2UsICAgICAgICAvLyBDb252ZXJ0ICdcXG4nIGluIHBhcmFncmFwaHMgaW50byA8YnI+XG4gICAgbGFuZ1ByZWZpeDogICAnbGFuZ3VhZ2UtJywgIC8vIENTUyBsYW5ndWFnZSBwcmVmaXggZm9yIGZlbmNlZCBibG9ja3NcbiAgICBsaW5raWZ5OiAgICAgIGZhbHNlLCAgICAgICAgLy8gYXV0b2NvbnZlcnQgVVJMLWxpa2UgdGV4dHMgdG8gbGlua3NcblxuICAgIC8vIEVuYWJsZSBzb21lIGxhbmd1YWdlLW5ldXRyYWwgcmVwbGFjZW1lbnRzICsgcXVvdGVzIGJlYXV0aWZpY2F0aW9uXG4gICAgdHlwb2dyYXBoZXI6ICBmYWxzZSxcblxuICAgIC8vIERvdWJsZSArIHNpbmdsZSBxdW90ZXMgcmVwbGFjZW1lbnQgcGFpcnMsIHdoZW4gdHlwb2dyYXBoZXIgZW5hYmxlZCxcbiAgICAvLyBhbmQgc21hcnRxdW90ZXMgb24uIFNldCBkb3VibGVzIHRvICfCq8K7JyBmb3IgUnVzc2lhbiwgJ+KAnuKAnCcgZm9yIEdlcm1hbi5cbiAgICBxdW90ZXM6ICfigJzigJ3igJjigJknLFxuXG4gICAgLy8gSGlnaGxpZ2h0ZXIgZnVuY3Rpb24uIFNob3VsZCByZXR1cm4gZXNjYXBlZCBIVE1MLFxuICAgIC8vIG9yICcnIGlmIGlucHV0IG5vdCBjaGFuZ2VkXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiAoLypzdHIsIGxhbmcqLykgeyByZXR1cm4gJyc7IH1cbiAgICAvL1xuICAgIGhpZ2hsaWdodDogbnVsbCxcblxuICAgIG1heE5lc3Rpbmc6ICAgMjAgICAgICAgICAgICAvLyBJbnRlcm5hbCBwcm90ZWN0aW9uLCByZWN1cnNpb24gbGltaXRcbiAgfSxcblxuICBjb21wb25lbnRzOiB7XG5cbiAgICBjb3JlOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAnYmxvY2snLFxuICAgICAgICAnaW5saW5lJyxcbiAgICAgICAgJ3JlZmVyZW5jZXMnLFxuICAgICAgICAnYWJicjInXG4gICAgICBdXG4gICAgfSxcblxuICAgIGJsb2NrOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAnYmxvY2txdW90ZScsXG4gICAgICAgICdjb2RlJyxcbiAgICAgICAgJ2ZlbmNlcycsXG4gICAgICAgICdoZWFkaW5nJyxcbiAgICAgICAgJ2hyJyxcbiAgICAgICAgJ2h0bWxibG9jaycsXG4gICAgICAgICdsaGVhZGluZycsXG4gICAgICAgICdsaXN0JyxcbiAgICAgICAgJ3BhcmFncmFwaCdcbiAgICAgIF1cbiAgICB9LFxuXG4gICAgaW5saW5lOiB7XG4gICAgICBydWxlczogW1xuICAgICAgICAnYXV0b2xpbmsnLFxuICAgICAgICAnYmFja3RpY2tzJyxcbiAgICAgICAgJ2VtcGhhc2lzJyxcbiAgICAgICAgJ2VudGl0eScsXG4gICAgICAgICdlc2NhcGUnLFxuICAgICAgICAnaHRtbHRhZycsXG4gICAgICAgICdsaW5rcycsXG4gICAgICAgICduZXdsaW5lJyxcbiAgICAgICAgJ3RleHQnXG4gICAgICBdXG4gICAgfVxuICB9XG59O1xuIiwiLy8gUmVtYXJrYWJsZSBkZWZhdWx0IG9wdGlvbnNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBvcHRpb25zOiB7XG4gICAgaHRtbDogICAgICAgICBmYWxzZSwgICAgICAgIC8vIEVuYWJsZSBIVE1MIHRhZ3MgaW4gc291cmNlXG4gICAgeGh0bWxPdXQ6ICAgICBmYWxzZSwgICAgICAgIC8vIFVzZSAnLycgdG8gY2xvc2Ugc2luZ2xlIHRhZ3MgKDxiciAvPilcbiAgICBicmVha3M6ICAgICAgIGZhbHNlLCAgICAgICAgLy8gQ29udmVydCAnXFxuJyBpbiBwYXJhZ3JhcGhzIGludG8gPGJyPlxuICAgIGxhbmdQcmVmaXg6ICAgJ2xhbmd1YWdlLScsICAvLyBDU1MgbGFuZ3VhZ2UgcHJlZml4IGZvciBmZW5jZWQgYmxvY2tzXG4gICAgbGlua2lmeTogICAgICBmYWxzZSwgICAgICAgIC8vIGF1dG9jb252ZXJ0IFVSTC1saWtlIHRleHRzIHRvIGxpbmtzXG5cbiAgICAvLyBFbmFibGUgc29tZSBsYW5ndWFnZS1uZXV0cmFsIHJlcGxhY2VtZW50cyArIHF1b3RlcyBiZWF1dGlmaWNhdGlvblxuICAgIHR5cG9ncmFwaGVyOiAgZmFsc2UsXG5cbiAgICAvLyBEb3VibGUgKyBzaW5nbGUgcXVvdGVzIHJlcGxhY2VtZW50IHBhaXJzLCB3aGVuIHR5cG9ncmFwaGVyIGVuYWJsZWQsXG4gICAgLy8gYW5kIHNtYXJ0cXVvdGVzIG9uLiBTZXQgZG91YmxlcyB0byAnwqvCuycgZm9yIFJ1c3NpYW4sICfigJ7igJwnIGZvciBHZXJtYW4uXG4gICAgcXVvdGVzOiAn4oCc4oCd4oCY4oCZJyxcblxuICAgIC8vIEhpZ2hsaWdodGVyIGZ1bmN0aW9uLiBTaG91bGQgcmV0dXJuIGVzY2FwZWQgSFRNTCxcbiAgICAvLyBvciAnJyBpZiBpbnB1dCBub3QgY2hhbmdlZFxuICAgIC8vXG4gICAgLy8gZnVuY3Rpb24gKC8qc3RyLCBsYW5nKi8pIHsgcmV0dXJuICcnOyB9XG4gICAgLy9cbiAgICBoaWdobGlnaHQ6IG51bGwsXG5cbiAgICBtYXhOZXN0aW5nOiAgIDIwICAgICAgICAgICAgLy8gSW50ZXJuYWwgcHJvdGVjdGlvbiwgcmVjdXJzaW9uIGxpbWl0XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuXG4gICAgY29yZToge1xuICAgICAgcnVsZXM6IFtcbiAgICAgICAgJ2Jsb2NrJyxcbiAgICAgICAgJ2lubGluZScsXG4gICAgICAgICdyZWZlcmVuY2VzJyxcbiAgICAgICAgJ3JlcGxhY2VtZW50cycsXG4gICAgICAgICdsaW5raWZ5JyxcbiAgICAgICAgJ3NtYXJ0cXVvdGVzJyxcbiAgICAgICAgJ3JlZmVyZW5jZXMnLFxuICAgICAgICAnYWJicjInLFxuICAgICAgICAnZm9vdG5vdGVfdGFpbCdcbiAgICAgIF1cbiAgICB9LFxuXG4gICAgYmxvY2s6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdibG9ja3F1b3RlJyxcbiAgICAgICAgJ2NvZGUnLFxuICAgICAgICAnZmVuY2VzJyxcbiAgICAgICAgJ2hlYWRpbmcnLFxuICAgICAgICAnaHInLFxuICAgICAgICAnaHRtbGJsb2NrJyxcbiAgICAgICAgJ2xoZWFkaW5nJyxcbiAgICAgICAgJ2xpc3QnLFxuICAgICAgICAncGFyYWdyYXBoJyxcbiAgICAgICAgJ3RhYmxlJ1xuICAgICAgXVxuICAgIH0sXG5cbiAgICBpbmxpbmU6IHtcbiAgICAgIHJ1bGVzOiBbXG4gICAgICAgICdhdXRvbGluaycsXG4gICAgICAgICdiYWNrdGlja3MnLFxuICAgICAgICAnZGVsJyxcbiAgICAgICAgJ2VtcGhhc2lzJyxcbiAgICAgICAgJ2VudGl0eScsXG4gICAgICAgICdlc2NhcGUnLFxuICAgICAgICAnZm9vdG5vdGVfcmVmJyxcbiAgICAgICAgJ2h0bWx0YWcnLFxuICAgICAgICAnbGlua3MnLFxuICAgICAgICAnbmV3bGluZScsXG4gICAgICAgICd0ZXh0J1xuICAgICAgXVxuICAgIH1cbiAgfVxufTtcbiIsIi8vIFJlbWFya2FibGUgZGVmYXVsdCBvcHRpb25zXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3B0aW9uczoge1xuICAgIGh0bWw6ICAgICAgICAgZmFsc2UsICAgICAgICAvLyBFbmFibGUgSFRNTCB0YWdzIGluIHNvdXJjZVxuICAgIHhodG1sT3V0OiAgICAgZmFsc2UsICAgICAgICAvLyBVc2UgJy8nIHRvIGNsb3NlIHNpbmdsZSB0YWdzICg8YnIgLz4pXG4gICAgYnJlYWtzOiAgICAgICBmYWxzZSwgICAgICAgIC8vIENvbnZlcnQgJ1xcbicgaW4gcGFyYWdyYXBocyBpbnRvIDxicj5cbiAgICBsYW5nUHJlZml4OiAgICdsYW5ndWFnZS0nLCAgLy8gQ1NTIGxhbmd1YWdlIHByZWZpeCBmb3IgZmVuY2VkIGJsb2Nrc1xuICAgIGxpbmtpZnk6ICAgICAgZmFsc2UsICAgICAgICAvLyBhdXRvY29udmVydCBVUkwtbGlrZSB0ZXh0cyB0byBsaW5rc1xuXG4gICAgLy8gRW5hYmxlIHNvbWUgbGFuZ3VhZ2UtbmV1dHJhbCByZXBsYWNlbWVudHMgKyBxdW90ZXMgYmVhdXRpZmljYXRpb25cbiAgICB0eXBvZ3JhcGhlcjogIGZhbHNlLFxuXG4gICAgLy8gRG91YmxlICsgc2luZ2xlIHF1b3RlcyByZXBsYWNlbWVudCBwYWlycywgd2hlbiB0eXBvZ3JhcGhlciBlbmFibGVkLFxuICAgIC8vIGFuZCBzbWFydHF1b3RlcyBvbi4gU2V0IGRvdWJsZXMgdG8gJ8KrwrsnIGZvciBSdXNzaWFuLCAn4oCe4oCcJyBmb3IgR2VybWFuLlxuICAgIHF1b3RlczogICAgICAgJ+KAnOKAneKAmOKAmScsXG5cbiAgICAvLyBIaWdobGlnaHRlciBmdW5jdGlvbi4gU2hvdWxkIHJldHVybiBlc2NhcGVkIEhUTUwsXG4gICAgLy8gb3IgJycgaWYgaW5wdXQgbm90IGNoYW5nZWRcbiAgICAvL1xuICAgIC8vIGZ1bmN0aW9uICgvKnN0ciwgbGFuZyovKSB7IHJldHVybiAnJzsgfVxuICAgIC8vXG4gICAgaGlnaGxpZ2h0OiAgICAgbnVsbCxcblxuICAgIG1heE5lc3Rpbmc6ICAgIDIwICAgICAgICAgICAgLy8gSW50ZXJuYWwgcHJvdGVjdGlvbiwgcmVjdXJzaW9uIGxpbWl0XG4gIH0sXG5cbiAgY29tcG9uZW50czoge1xuICAgIC8vIERvbid0IHJlc3RyaWN0IGNvcmUvYmxvY2svaW5saW5lIHJ1bGVzXG4gICAgY29yZToge30sXG4gICAgYmxvY2s6IHt9LFxuICAgIGlubGluZToge31cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGxhY2VFbnRpdGllcyA9IHJlcXVpcmUoJy4uL2NvbW1vbi91dGlscycpLnJlcGxhY2VFbnRpdGllcztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVMaW5rKHVybCkge1xuICB2YXIgbm9ybWFsaXplZCA9IHJlcGxhY2VFbnRpdGllcyh1cmwpO1xuICAvLyBXZSBzaG91bGRuJ3QgY2FyZSBhYm91dCB0aGUgcmVzdWx0IG9mIG1hbGZvcm1lZCBVUklzLFxuICAvLyBhbmQgc2hvdWxkIG5vdCB0aHJvdyBhbiBleGNlcHRpb24uXG4gIHRyeSB7XG4gICAgbm9ybWFsaXplZCA9IGRlY29kZVVSSShub3JtYWxpemVkKTtcbiAgfSBjYXRjaCAoZXJyKSB7fVxuICByZXR1cm4gZW5jb2RlVVJJKG5vcm1hbGl6ZWQpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVSZWZlcmVuY2Uoc3RyKSB7XG4gIC8vIHVzZSAudG9VcHBlckNhc2UoKSBpbnN0ZWFkIG9mIC50b0xvd2VyQ2FzZSgpXG4gIC8vIGhlcmUgdG8gYXZvaWQgYSBjb25mbGljdCB3aXRoIE9iamVjdC5wcm90b3R5cGVcbiAgLy8gbWVtYmVycyAobW9zdCBub3RhYmx5LCBgX19wcm90b19fYClcbiAgcmV0dXJuIHN0ci50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRvVXBwZXJDYXNlKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBub3JtYWxpemVMaW5rID0gcmVxdWlyZSgnLi9ub3JtYWxpemVfbGluaycpO1xudmFyIHVuZXNjYXBlTWQgICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS51bmVzY2FwZU1kO1xuXG4vKipcbiAqIFBhcnNlIGxpbmsgZGVzdGluYXRpb25cbiAqXG4gKiAgIC0gb24gc3VjY2VzcyBpdCByZXR1cm5zIGEgc3RyaW5nIGFuZCB1cGRhdGVzIHN0YXRlLnBvcztcbiAqICAgLSBvbiBmYWlsdXJlIGl0IHJldHVybnMgbnVsbFxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua0Rlc3RpbmF0aW9uKHN0YXRlLCBwb3MpIHtcbiAgdmFyIGNvZGUsIGxldmVsLCBsaW5rLFxuICAgICAgc3RhcnQgPSBwb3MsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4M0MgLyogPCAqLykge1xuICAgIHBvcysrO1xuICAgIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgPT09IDB4MEEgLyogXFxuICovKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGNvZGUgPT09IDB4M0UgLyogPiAqLykge1xuICAgICAgICBsaW5rID0gbm9ybWFsaXplTGluayh1bmVzY2FwZU1kKHN0YXRlLnNyYy5zbGljZShzdGFydCArIDEsIHBvcykpKTtcbiAgICAgICAgaWYgKCFzdGF0ZS5wYXJzZXIudmFsaWRhdGVMaW5rKGxpbmspKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICBzdGF0ZS5wb3MgPSBwb3MgKyAxO1xuICAgICAgICBzdGF0ZS5saW5rQ29udGVudCA9IGxpbms7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09IDB4NUMgLyogXFwgKi8gJiYgcG9zICsgMSA8IG1heCkge1xuICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHBvcysrO1xuICAgIH1cblxuICAgIC8vIG5vIGNsb3NpbmcgJz4nXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gdGhpcyBzaG91bGQgYmUgLi4uIH0gZWxzZSB7IC4uLiBicmFuY2hcblxuICBsZXZlbCA9IDA7XG4gIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICAgIGlmIChjb2RlID09PSAweDIwKSB7IGJyZWFrOyB9XG5cbiAgICAvLyBhc2NpaSBjb250cm9sIGNoYXJhY3RlcnNcbiAgICBpZiAoY29kZSA8IDB4MjAgfHwgY29kZSA9PT0gMHg3RikgeyBicmVhazsgfVxuXG4gICAgaWYgKGNvZGUgPT09IDB4NUMgLyogXFwgKi8gJiYgcG9zICsgMSA8IG1heCkge1xuICAgICAgcG9zICs9IDI7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY29kZSA9PT0gMHgyOCAvKiAoICovKSB7XG4gICAgICBsZXZlbCsrO1xuICAgICAgaWYgKGxldmVsID4gMSkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIGlmIChjb2RlID09PSAweDI5IC8qICkgKi8pIHtcbiAgICAgIGxldmVsLS07XG4gICAgICBpZiAobGV2ZWwgPCAwKSB7IGJyZWFrOyB9XG4gICAgfVxuXG4gICAgcG9zKys7XG4gIH1cblxuICBpZiAoc3RhcnQgPT09IHBvcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsaW5rID0gbm9ybWFsaXplTGluayh1bmVzY2FwZU1kKHN0YXRlLnNyYy5zbGljZShzdGFydCwgcG9zKSkpO1xuICBpZiAoIXN0YXRlLnBhcnNlci52YWxpZGF0ZUxpbmsobGluaykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3RhdGUubGlua0NvbnRlbnQgPSBsaW5rO1xuICBzdGF0ZS5wb3MgPSBwb3M7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQYXJzZSBsaW5rIGxhYmVsc1xuICpcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IGZpcnN0IGNoYXJhY3RlciAoYFtgKSBhbHJlYWR5IG1hdGNoZXM7XG4gKiByZXR1cm5zIHRoZSBlbmQgb2YgdGhlIGxhYmVsLlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSAge051bWJlcn0gc3RhcnRcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VMaW5rTGFiZWwoc3RhdGUsIHN0YXJ0KSB7XG4gIHZhciBsZXZlbCwgZm91bmQsIG1hcmtlcixcbiAgICAgIGxhYmVsRW5kID0gLTEsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBvbGRQb3MgPSBzdGF0ZS5wb3MsXG4gICAgICBvbGRGbGFnID0gc3RhdGUuaXNJbkxhYmVsO1xuXG4gIGlmIChzdGF0ZS5pc0luTGFiZWwpIHsgcmV0dXJuIC0xOyB9XG5cbiAgaWYgKHN0YXRlLmxhYmVsVW5tYXRjaGVkU2NvcGVzKSB7XG4gICAgc3RhdGUubGFiZWxVbm1hdGNoZWRTY29wZXMtLTtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIDE7XG4gIHN0YXRlLmlzSW5MYWJlbCA9IHRydWU7XG4gIGxldmVsID0gMTtcblxuICB3aGlsZSAoc3RhdGUucG9zIDwgbWF4KSB7XG4gICAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKTtcbiAgICBpZiAobWFya2VyID09PSAweDVCIC8qIFsgKi8pIHtcbiAgICAgIGxldmVsKys7XG4gICAgfSBlbHNlIGlmIChtYXJrZXIgPT09IDB4NUQgLyogXSAqLykge1xuICAgICAgbGV2ZWwtLTtcbiAgICAgIGlmIChsZXZlbCA9PT0gMCkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRlLnBhcnNlci5za2lwVG9rZW4oc3RhdGUpO1xuICB9XG5cbiAgaWYgKGZvdW5kKSB7XG4gICAgbGFiZWxFbmQgPSBzdGF0ZS5wb3M7XG4gICAgc3RhdGUubGFiZWxVbm1hdGNoZWRTY29wZXMgPSAwO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLmxhYmVsVW5tYXRjaGVkU2NvcGVzID0gbGV2ZWwgLSAxO1xuICB9XG5cbiAgLy8gcmVzdG9yZSBvbGQgc3RhdGVcbiAgc3RhdGUucG9zID0gb2xkUG9zO1xuICBzdGF0ZS5pc0luTGFiZWwgPSBvbGRGbGFnO1xuXG4gIHJldHVybiBsYWJlbEVuZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIHVuZXNjYXBlTWQgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS51bmVzY2FwZU1kO1xuXG4vKipcbiAqIFBhcnNlIGxpbmsgdGl0bGVcbiAqXG4gKiAgIC0gb24gc3VjY2VzcyBpdCByZXR1cm5zIGEgc3RyaW5nIGFuZCB1cGRhdGVzIHN0YXRlLnBvcztcbiAqICAgLSBvbiBmYWlsdXJlIGl0IHJldHVybnMgbnVsbFxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlTGlua1RpdGxlKHN0YXRlLCBwb3MpIHtcbiAgdmFyIGNvZGUsXG4gICAgICBzdGFydCA9IHBvcyxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHgyMiAvKiBcIiAqLyAmJiBtYXJrZXIgIT09IDB4MjcgLyogJyAqLyAmJiBtYXJrZXIgIT09IDB4MjggLyogKCAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MrKztcblxuICAvLyBpZiBvcGVuaW5nIG1hcmtlciBpcyBcIihcIiwgc3dpdGNoIGl0IHRvIGNsb3NpbmcgbWFya2VyIFwiKVwiXG4gIGlmIChtYXJrZXIgPT09IDB4MjgpIHsgbWFya2VyID0gMHgyOTsgfVxuXG4gIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoY29kZSA9PT0gbWFya2VyKSB7XG4gICAgICBzdGF0ZS5wb3MgPSBwb3MgKyAxO1xuICAgICAgc3RhdGUubGlua0NvbnRlbnQgPSB1bmVzY2FwZU1kKHN0YXRlLnNyYy5zbGljZShzdGFydCArIDEsIHBvcykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSAweDVDIC8qIFxcICovICYmIHBvcyArIDEgPCBtYXgpIHtcbiAgICAgIHBvcyArPSAyO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcG9zKys7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIExvY2FsIGRlcGVuZGVuY2llc1xuICovXG5cbnZhciBhc3NpZ24gICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLmFzc2lnbjtcbnZhciBSZW5kZXJlciAgICAgPSByZXF1aXJlKCcuL3JlbmRlcmVyJyk7XG52YXIgUGFyc2VyQ29yZSAgID0gcmVxdWlyZSgnLi9wYXJzZXJfY29yZScpO1xudmFyIFBhcnNlckJsb2NrICA9IHJlcXVpcmUoJy4vcGFyc2VyX2Jsb2NrJyk7XG52YXIgUGFyc2VySW5saW5lID0gcmVxdWlyZSgnLi9wYXJzZXJfaW5saW5lJyk7XG52YXIgUnVsZXIgICAgICAgID0gcmVxdWlyZSgnLi9ydWxlcicpO1xuXG4vKipcbiAqIFByZXNldCBjb25maWdzXG4gKi9cblxudmFyIGNvbmZpZyA9IHtcbiAgJ2RlZmF1bHQnOiAgICByZXF1aXJlKCcuL2NvbmZpZ3MvZGVmYXVsdCcpLFxuICAnZnVsbCc6ICAgICAgIHJlcXVpcmUoJy4vY29uZmlncy9mdWxsJyksXG4gICdjb21tb25tYXJrJzogcmVxdWlyZSgnLi9jb25maWdzL2NvbW1vbm1hcmsnKVxufTtcblxuLyoqXG4gKiBUaGUgYFN0YXRlQ29yZWAgY2xhc3MgbWFuYWdlcyBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYHNlbGZgIFJlbWFya2FibGUgaW5zdGFuY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBgc3RyYCBNYXJrZG93biBzdHJpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBgZW52YFxuICovXG5cbmZ1bmN0aW9uIFN0YXRlQ29yZShzZWxmLCBzdHIsIGVudikge1xuICB0aGlzLnNyYyA9IHN0cjtcbiAgdGhpcy5lbnYgPSBlbnY7XG4gIHRoaXMub3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgdGhpcy50b2tlbnMgPSBbXTtcbiAgdGhpcy5pbmxpbmVNb2RlID0gZmFsc2U7XG5cbiAgdGhpcy5pbmxpbmUgPSBzZWxmLmlubGluZTtcbiAgdGhpcy5ibG9jayA9IHNlbGYuYmxvY2s7XG4gIHRoaXMucmVuZGVyZXIgPSBzZWxmLnJlbmRlcmVyO1xuICB0aGlzLnR5cG9ncmFwaGVyID0gc2VsZi50eXBvZ3JhcGhlcjtcbn1cblxuLyoqXG4gKiBUaGUgbWFpbiBgUmVtYXJrYWJsZWAgY2xhc3MuIENyZWF0ZSBhbiBpbnN0YW5jZSBvZlxuICogYFJlbWFya2FibGVgIHdpdGggYSBgcHJlc2V0YCBhbmQvb3IgYG9wdGlvbnNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBgcHJlc2V0YCBJZiBubyBwcmVzZXQgaXMgZ2l2ZW4sIGBkZWZhdWx0YCBpcyB1c2VkLlxuICogQHBhcmFtIHtPYmplY3R9IGBvcHRpb25zYFxuICovXG5cbmZ1bmN0aW9uIFJlbWFya2FibGUocHJlc2V0LCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgcHJlc2V0ICE9PSAnc3RyaW5nJykge1xuICAgIG9wdGlvbnMgPSBwcmVzZXQ7XG4gICAgcHJlc2V0ID0gJ2RlZmF1bHQnO1xuICB9XG5cbiAgdGhpcy5pbmxpbmUgICA9IG5ldyBQYXJzZXJJbmxpbmUoKTtcbiAgdGhpcy5ibG9jayAgICA9IG5ldyBQYXJzZXJCbG9jaygpO1xuICB0aGlzLmNvcmUgICAgID0gbmV3IFBhcnNlckNvcmUoKTtcbiAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcigpO1xuICB0aGlzLnJ1bGVyICAgID0gbmV3IFJ1bGVyKCk7XG5cbiAgdGhpcy5vcHRpb25zICA9IHt9O1xuICB0aGlzLmNvbmZpZ3VyZShjb25maWdbcHJlc2V0XSk7XG4gIHRoaXMuc2V0KG9wdGlvbnMgfHwge30pO1xufVxuXG4vKipcbiAqIFNldCBvcHRpb25zIGFzIGFuIGFsdGVybmF0aXZlIHRvIHBhc3NpbmcgdGhlbVxuICogdG8gdGhlIGNvbnN0cnVjdG9yLlxuICpcbiAqIGBgYGpzXG4gKiBtZC5zZXQoe3R5cG9ncmFwaGVyOiB0cnVlfSk7XG4gKiBgYGBcbiAqIEBwYXJhbSB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVtYXJrYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG59O1xuXG4vKipcbiAqIEJhdGNoIGxvYWRlciBmb3IgY29tcG9uZW50cyBydWxlcyBzdGF0ZXMsIGFuZCBvcHRpb25zXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBgcHJlc2V0c2BcbiAqL1xuXG5SZW1hcmthYmxlLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAocHJlc2V0cykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKCFwcmVzZXRzKSB7IHRocm93IG5ldyBFcnJvcignV3JvbmcgYHJlbWFya2FibGVgIHByZXNldCwgY2hlY2sgbmFtZS9jb250ZW50Jyk7IH1cbiAgaWYgKHByZXNldHMub3B0aW9ucykgeyBzZWxmLnNldChwcmVzZXRzLm9wdGlvbnMpOyB9XG4gIGlmIChwcmVzZXRzLmNvbXBvbmVudHMpIHtcbiAgICBPYmplY3Qua2V5cyhwcmVzZXRzLmNvbXBvbmVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmIChwcmVzZXRzLmNvbXBvbmVudHNbbmFtZV0ucnVsZXMpIHtcbiAgICAgICAgc2VsZltuYW1lXS5ydWxlci5lbmFibGUocHJlc2V0cy5jb21wb25lbnRzW25hbWVdLnJ1bGVzLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBVc2UgYSBwbHVnaW4uXG4gKlxuICogYGBganNcbiAqIHZhciBtZCA9IG5ldyBSZW1hcmthYmxlKCk7XG4gKlxuICogbWQudXNlKHBsdWdpbjEpXG4gKiAgIC51c2UocGx1Z2luMiwgb3B0cylcbiAqICAgLnVzZShwbHVnaW4zKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBgcGx1Z2luYFxuICogQHBhcmFtICB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEByZXR1cm4ge09iamVjdH0gYFJlbWFya2FibGVgIGZvciBjaGFpbmluZ1xuICovXG5cblJlbWFya2FibGUucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4sIG9wdGlvbnMpIHtcbiAgcGx1Z2luKHRoaXMsIG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBQYXJzZSB0aGUgaW5wdXQgYHN0cmluZ2AgYW5kIHJldHVybiBhIHRva2VucyBhcnJheS5cbiAqIE1vZGlmaWVzIGBlbnZgIHdpdGggZGVmaW5pdGlvbnMgZGF0YS5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBzdHJpbmdgXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBlbnZgXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgdG9rZW5zXG4gKi9cblxuUmVtYXJrYWJsZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoc3RyLCBlbnYpIHtcbiAgdmFyIHN0YXRlID0gbmV3IFN0YXRlQ29yZSh0aGlzLCBzdHIsIGVudik7XG4gIHRoaXMuY29yZS5wcm9jZXNzKHN0YXRlKTtcbiAgcmV0dXJuIHN0YXRlLnRva2Vucztcbn07XG5cbi8qKlxuICogVGhlIG1haW4gYC5yZW5kZXIoKWAgbWV0aG9kIHRoYXQgZG9lcyBhbGwgdGhlIG1hZ2ljIDopXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgc3RyaW5nYFxuICogQHBhcmFtICB7T2JqZWN0fSBgZW52YFxuICogQHJldHVybiB7U3RyaW5nfSBSZW5kZXJlZCBIVE1MLlxuICovXG5cblJlbWFya2FibGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChzdHIsIGVudikge1xuICBlbnYgPSBlbnYgfHwge307XG4gIHJldHVybiB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnBhcnNlKHN0ciwgZW52KSwgdGhpcy5vcHRpb25zLCBlbnYpO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gY29udGVudCBgc3RyaW5nYCBhcyBhIHNpbmdsZSBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgc3RyaW5nYFxuICogQHBhcmFtICB7T2JqZWN0fSBgZW52YFxuICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIHRva2Vuc1xuICovXG5cblJlbWFya2FibGUucHJvdG90eXBlLnBhcnNlSW5saW5lID0gZnVuY3Rpb24gKHN0ciwgZW52KSB7XG4gIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZUNvcmUodGhpcywgc3RyLCBlbnYpO1xuICBzdGF0ZS5pbmxpbmVNb2RlID0gdHJ1ZTtcbiAgdGhpcy5jb3JlLnByb2Nlc3Moc3RhdGUpO1xuICByZXR1cm4gc3RhdGUudG9rZW5zO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgYSBzaW5nbGUgY29udGVudCBgc3RyaW5nYCwgd2l0aG91dCB3cmFwcGluZyBpdFxuICogdG8gcGFyYWdyYXBoc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmBcbiAqIEBwYXJhbSAge09iamVjdH0gYGVudmBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5SZW1hcmthYmxlLnByb3RvdHlwZS5yZW5kZXJJbmxpbmUgPSBmdW5jdGlvbiAoc3RyLCBlbnYpIHtcbiAgZW52ID0gZW52IHx8IHt9O1xuICByZXR1cm4gdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5wYXJzZUlubGluZShzdHIsIGVudiksIHRoaXMub3B0aW9ucywgZW52KTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZW1hcmthYmxlYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVtYXJrYWJsZTtcblxuLyoqXG4gKiBFeHBvc2UgYHV0aWxzYCwgVXNlZnVsIGhlbHBlciBmdW5jdGlvbnMgZm9yIGN1c3RvbVxuICogcmVuZGVyaW5nLlxuICovXG5cbm1vZHVsZS5leHBvcnRzLnV0aWxzID0gcmVxdWlyZSgnLi9jb21tb24vdXRpbHMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMb2NhbCBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgUnVsZXIgICAgICA9IHJlcXVpcmUoJy4vcnVsZXInKTtcbnZhciBTdGF0ZUJsb2NrID0gcmVxdWlyZSgnLi9ydWxlc19ibG9jay9zdGF0ZV9ibG9jaycpO1xuXG4vKipcbiAqIFBhcnNlciBydWxlc1xuICovXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ2NvZGUnLCAgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2NvZGUnKSBdLFxuICBbICdmZW5jZXMnLCAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9mZW5jZXMnKSwgICAgIFsgJ3BhcmFncmFwaCcsICdibG9ja3F1b3RlJywgJ2xpc3QnIF0gXSxcbiAgWyAnYmxvY2txdW90ZScsIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svYmxvY2txdW90ZScpLCBbICdwYXJhZ3JhcGgnLCAnYmxvY2txdW90ZScsICdsaXN0JyBdIF0sXG4gIFsgJ2hyJywgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2hyJyksICAgICAgICAgWyAncGFyYWdyYXBoJywgJ2Jsb2NrcXVvdGUnLCAnbGlzdCcgXSBdLFxuICBbICdsaXN0JywgICAgICAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9saXN0JyksICAgICAgIFsgJ3BhcmFncmFwaCcsICdibG9ja3F1b3RlJyBdIF0sXG4gIFsgJ2Zvb3Rub3RlJywgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2Zvb3Rub3RlJyksICAgWyAncGFyYWdyYXBoJyBdIF0sXG4gIFsgJ2hlYWRpbmcnLCAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2hlYWRpbmcnKSwgICAgWyAncGFyYWdyYXBoJywgJ2Jsb2NrcXVvdGUnIF0gXSxcbiAgWyAnbGhlYWRpbmcnLCAgIHJlcXVpcmUoJy4vcnVsZXNfYmxvY2svbGhlYWRpbmcnKSBdLFxuICBbICdodG1sYmxvY2snLCAgcmVxdWlyZSgnLi9ydWxlc19ibG9jay9odG1sYmxvY2snKSwgIFsgJ3BhcmFncmFwaCcsICdibG9ja3F1b3RlJyBdIF0sXG4gIFsgJ3RhYmxlJywgICAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL3RhYmxlJyksICAgICAgWyAncGFyYWdyYXBoJyBdIF0sXG4gIFsgJ2RlZmxpc3QnLCAgICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL2RlZmxpc3QnKSwgICAgWyAncGFyYWdyYXBoJyBdIF0sXG4gIFsgJ3BhcmFncmFwaCcsICByZXF1aXJlKCcuL3J1bGVzX2Jsb2NrL3BhcmFncmFwaCcpIF1cbl07XG5cbi8qKlxuICogQmxvY2sgUGFyc2VyIGNsYXNzXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUGFyc2VyQmxvY2soKSB7XG4gIHRoaXMucnVsZXIgPSBuZXcgUnVsZXIoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBfcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLnJ1bGVyLnB1c2goX3J1bGVzW2ldWzBdLCBfcnVsZXNbaV1bMV0sIHtcbiAgICAgIGFsdDogKF9ydWxlc1tpXVsyXSB8fCBbXSkuc2xpY2UoKVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdG9rZW5zIGZvciB0aGUgZ2l2ZW4gaW5wdXQgcmFuZ2UuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBgc3RhdGVgIEhhcyBwcm9wZXJ0aWVzIGxpa2UgYHNyY2AsIGBwYXJzZXJgLCBgb3B0aW9uc2AgZXRjXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGBzdGFydExpbmVgXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGBlbmRMaW5lYFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUGFyc2VyQmxvY2sucHJvdG90eXBlLnRva2VuaXplID0gZnVuY3Rpb24gKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUpIHtcbiAgdmFyIHJ1bGVzID0gdGhpcy5ydWxlci5nZXRSdWxlcygnJyk7XG4gIHZhciBsZW4gPSBydWxlcy5sZW5ndGg7XG4gIHZhciBsaW5lID0gc3RhcnRMaW5lO1xuICB2YXIgaGFzRW1wdHlMaW5lcyA9IGZhbHNlO1xuICB2YXIgb2ssIGk7XG5cbiAgd2hpbGUgKGxpbmUgPCBlbmRMaW5lKSB7XG4gICAgc3RhdGUubGluZSA9IGxpbmUgPSBzdGF0ZS5za2lwRW1wdHlMaW5lcyhsaW5lKTtcbiAgICBpZiAobGluZSA+PSBlbmRMaW5lKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBUZXJtaW5hdGlvbiBjb25kaXRpb24gZm9yIG5lc3RlZCBjYWxscy5cbiAgICAvLyBOZXN0ZWQgY2FsbHMgY3VycmVudGx5IHVzZWQgZm9yIGJsb2NrcXVvdGVzICYgbGlzdHNcbiAgICBpZiAoc3RhdGUudFNoaWZ0W2xpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBUcnkgYWxsIHBvc3NpYmxlIHJ1bGVzLlxuICAgIC8vIE9uIHN1Y2Nlc3MsIHJ1bGUgc2hvdWxkOlxuICAgIC8vXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLmxpbmVgXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLnRva2Vuc2BcbiAgICAvLyAtIHJldHVybiB0cnVlXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG9rID0gcnVsZXNbaV0oc3RhdGUsIGxpbmUsIGVuZExpbmUsIGZhbHNlKTtcbiAgICAgIGlmIChvaykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgc3RhdGUudGlnaHQgaWZmIHdlIGhhZCBhbiBlbXB0eSBsaW5lIGJlZm9yZSBjdXJyZW50IHRhZ1xuICAgIC8vIGkuZS4gbGF0ZXN0IGVtcHR5IGxpbmUgc2hvdWxkIG5vdCBjb3VudFxuICAgIHN0YXRlLnRpZ2h0ID0gIWhhc0VtcHR5TGluZXM7XG5cbiAgICAvLyBwYXJhZ3JhcGggbWlnaHQgXCJlYXRcIiBvbmUgbmV3bGluZSBhZnRlciBpdCBpbiBuZXN0ZWQgbGlzdHNcbiAgICBpZiAoc3RhdGUuaXNFbXB0eShzdGF0ZS5saW5lIC0gMSkpIHtcbiAgICAgIGhhc0VtcHR5TGluZXMgPSB0cnVlO1xuICAgIH1cblxuICAgIGxpbmUgPSBzdGF0ZS5saW5lO1xuXG4gICAgaWYgKGxpbmUgPCBlbmRMaW5lICYmIHN0YXRlLmlzRW1wdHkobGluZSkpIHtcbiAgICAgIGhhc0VtcHR5TGluZXMgPSB0cnVlO1xuICAgICAgbGluZSsrO1xuXG4gICAgICAvLyB0d28gZW1wdHkgbGluZXMgc2hvdWxkIHN0b3AgdGhlIHBhcnNlciBpbiBsaXN0IG1vZGVcbiAgICAgIGlmIChsaW5lIDwgZW5kTGluZSAmJiBzdGF0ZS5wYXJlbnRUeXBlID09PSAnbGlzdCcgJiYgc3RhdGUuaXNFbXB0eShsaW5lKSkgeyBicmVhazsgfVxuICAgICAgc3RhdGUubGluZSA9IGxpbmU7XG4gICAgfVxuICB9XG59O1xuXG52YXIgVEFCU19TQ0FOX1JFID0gL1tcXG5cXHRdL2c7XG52YXIgTkVXTElORVNfUkUgID0gL1xccltcXG5cXHUwMDg1XXxbXFx1MjQyNFxcdTIwMjhcXHUwMDg1XS9nO1xudmFyIFNQQUNFU19SRSAgICA9IC9cXHUwMGEwL2c7XG5cbi8qKlxuICogVG9rZW5pemUgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHN0cmAgU291cmNlIHN0cmluZ1xuICogQHBhcmFtICB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEBwYXJhbSAge09iamVjdH0gYGVudmBcbiAqIEBwYXJhbSAge0FycmF5fSBgb3V0VG9rZW5zYFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUGFyc2VyQmxvY2sucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHN0ciwgb3B0aW9ucywgZW52LCBvdXRUb2tlbnMpIHtcbiAgdmFyIHN0YXRlLCBsaW5lU3RhcnQgPSAwLCBsYXN0VGFiUG9zID0gMDtcbiAgaWYgKCFzdHIpIHsgcmV0dXJuIFtdOyB9XG5cbiAgLy8gTm9ybWFsaXplIHNwYWNlc1xuICBzdHIgPSBzdHIucmVwbGFjZShTUEFDRVNfUkUsICcgJyk7XG5cbiAgLy8gTm9ybWFsaXplIG5ld2xpbmVzXG4gIHN0ciA9IHN0ci5yZXBsYWNlKE5FV0xJTkVTX1JFLCAnXFxuJyk7XG5cbiAgLy8gUmVwbGFjZSB0YWJzIHdpdGggcHJvcGVyIG51bWJlciBvZiBzcGFjZXMgKDEuLjQpXG4gIGlmIChzdHIuaW5kZXhPZignXFx0JykgPj0gMCkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKFRBQlNfU0NBTl9SRSwgZnVuY3Rpb24gKG1hdGNoLCBvZmZzZXQpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAoc3RyLmNoYXJDb2RlQXQob2Zmc2V0KSA9PT0gMHgwQSkge1xuICAgICAgICBsaW5lU3RhcnQgPSBvZmZzZXQgKyAxO1xuICAgICAgICBsYXN0VGFiUG9zID0gMDtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gJyAgICAnLnNsaWNlKChvZmZzZXQgLSBsaW5lU3RhcnQgLSBsYXN0VGFiUG9zKSAlIDQpO1xuICAgICAgbGFzdFRhYlBvcyA9IG9mZnNldCAtIGxpbmVTdGFydCArIDE7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUgPSBuZXcgU3RhdGVCbG9jayhzdHIsIHRoaXMsIG9wdGlvbnMsIGVudiwgb3V0VG9rZW5zKTtcbiAgdGhpcy50b2tlbml6ZShzdGF0ZSwgc3RhdGUubGluZSwgc3RhdGUubGluZU1heCk7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUGFyc2VyQmxvY2tgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXJCbG9jaztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMb2NhbCBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgUnVsZXIgPSByZXF1aXJlKCcuL3J1bGVyJyk7XG5cbi8qKlxuICogQ29yZSBwYXJzZXIgYHJ1bGVzYFxuICovXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ2Jsb2NrJywgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL2Jsb2NrJykgICAgICAgICAgXSxcbiAgWyAnYWJicicsICAgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvYWJicicpICAgICAgICAgICBdLFxuICBbICdyZWZlcmVuY2VzJywgICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9yZWZlcmVuY2VzJykgICAgIF0sXG4gIFsgJ2lubGluZScsICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL2lubGluZScpICAgICAgICAgXSxcbiAgWyAnZm9vdG5vdGVfdGFpbCcsICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvZm9vdG5vdGVfdGFpbCcpICBdLFxuICBbICdhYmJyMicsICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9hYmJyMicpICAgICAgICAgIF0sXG4gIFsgJ3JlcGxhY2VtZW50cycsICAgcmVxdWlyZSgnLi9ydWxlc19jb3JlL3JlcGxhY2VtZW50cycpICAgXSxcbiAgWyAnc21hcnRxdW90ZXMnLCAgICByZXF1aXJlKCcuL3J1bGVzX2NvcmUvc21hcnRxdW90ZXMnKSAgICBdLFxuICBbICdsaW5raWZ5JywgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfY29yZS9saW5raWZ5JykgICAgICAgIF1cbl07XG5cbi8qKlxuICogQ2xhc3MgZm9yIHRvcCBsZXZlbCAoYGNvcmVgKSBwYXJzZXIgcnVsZXNcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBDb3JlKCkge1xuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5ydWxlciA9IG5ldyBSdWxlcigpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IF9ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMucnVsZXIucHVzaChfcnVsZXNbaV1bMF0sIF9ydWxlc1tpXVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9jZXNzIHJ1bGVzIHdpdGggdGhlIGdpdmVuIGBzdGF0ZWBcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBzdGF0ZWBcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvcmUucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgdmFyIGksIGwsIHJ1bGVzO1xuICBydWxlcyA9IHRoaXMucnVsZXIuZ2V0UnVsZXMoJycpO1xuICBmb3IgKGkgPSAwLCBsID0gcnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcnVsZXNbaV0oc3RhdGUpO1xuICB9XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgQ29yZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvcmU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTG9jYWwgZGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIFJ1bGVyICAgICAgID0gcmVxdWlyZSgnLi9ydWxlcicpO1xudmFyIFN0YXRlSW5saW5lID0gcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3RhdGVfaW5saW5lJyk7XG52YXIgdXRpbHMgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpO1xuXG4vKipcbiAqIElubGluZSBQYXJzZXIgYHJ1bGVzYFxuICovXG5cbnZhciBfcnVsZXMgPSBbXG4gIFsgJ3RleHQnLCAgICAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL3RleHQnKSBdLFxuICBbICduZXdsaW5lJywgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9uZXdsaW5lJykgXSxcbiAgWyAnZXNjYXBlJywgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvZXNjYXBlJykgXSxcbiAgWyAnYmFja3RpY2tzJywgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvYmFja3RpY2tzJykgXSxcbiAgWyAnZGVsJywgICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvZGVsJykgXSxcbiAgWyAnaW5zJywgICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvaW5zJykgXSxcbiAgWyAnbWFyaycsICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvbWFyaycpIF0sXG4gIFsgJ2VtcGhhc2lzJywgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2VtcGhhc2lzJykgXSxcbiAgWyAnc3ViJywgICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3ViJykgXSxcbiAgWyAnc3VwJywgICAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvc3VwJykgXSxcbiAgWyAnbGlua3MnLCAgICAgICAgICAgcmVxdWlyZSgnLi9ydWxlc19pbmxpbmUvbGlua3MnKSBdLFxuICBbICdmb290bm90ZV9pbmxpbmUnLCByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9mb290bm90ZV9pbmxpbmUnKSBdLFxuICBbICdmb290bm90ZV9yZWYnLCAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9mb290bm90ZV9yZWYnKSBdLFxuICBbICdhdXRvbGluaycsICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9hdXRvbGluaycpIF0sXG4gIFsgJ2h0bWx0YWcnLCAgICAgICAgIHJlcXVpcmUoJy4vcnVsZXNfaW5saW5lL2h0bWx0YWcnKSBdLFxuICBbICdlbnRpdHknLCAgICAgICAgICByZXF1aXJlKCcuL3J1bGVzX2lubGluZS9lbnRpdHknKSBdXG5dO1xuXG4vKipcbiAqIElubGluZSBQYXJzZXIgY2xhc3MuIE5vdGUgdGhhdCBsaW5rIHZhbGlkYXRpb24gaXMgc3RyaWN0ZXJcbiAqIGluIFJlbWFya2FibGUgdGhhbiB3aGF0IGlzIHNwZWNpZmllZCBieSBDb21tb25NYXJrLiBJZiB5b3VcbiAqIHdhbnQgdG8gY2hhbmdlIHRoaXMgeW91IGNhbiB1c2UgYSBjdXN0b20gdmFsaWRhdG9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFBhcnNlcklubGluZSgpIHtcbiAgdGhpcy5ydWxlciA9IG5ldyBSdWxlcigpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IF9ydWxlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMucnVsZXIucHVzaChfcnVsZXNbaV1bMF0sIF9ydWxlc1tpXVsxXSk7XG4gIH1cblxuICAvLyBDYW4gYmUgb3ZlcnJpZGRlbiB3aXRoIGEgY3VzdG9tIHZhbGlkYXRvclxuICB0aGlzLnZhbGlkYXRlTGluayA9IHZhbGlkYXRlTGluaztcbn1cblxuLyoqXG4gKiBTa2lwIGEgc2luZ2xlIHRva2VuIGJ5IHJ1bm5pbmcgYWxsIHJ1bGVzIGluIHZhbGlkYXRpb24gbW9kZS5cbiAqIFJldHVybnMgYHRydWVgIGlmIGFueSBydWxlIHJlcG9ydHMgc3VjY2Vzcy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBzdGF0ZWBcbiAqIEBhcGkgcHJpdmFnZVxuICovXG5cblBhcnNlcklubGluZS5wcm90b3R5cGUuc2tpcFRva2VuID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHZhciBydWxlcyA9IHRoaXMucnVsZXIuZ2V0UnVsZXMoJycpO1xuICB2YXIgbGVuID0gcnVsZXMubGVuZ3RoO1xuICB2YXIgcG9zID0gc3RhdGUucG9zO1xuICB2YXIgaSwgY2FjaGVkX3BvcztcblxuICBpZiAoKGNhY2hlZF9wb3MgPSBzdGF0ZS5jYWNoZUdldChwb3MpKSA+IDApIHtcbiAgICBzdGF0ZS5wb3MgPSBjYWNoZWRfcG9zO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChydWxlc1tpXShzdGF0ZSwgdHJ1ZSkpIHtcbiAgICAgIHN0YXRlLmNhY2hlU2V0KHBvcywgc3RhdGUucG9zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5wb3MrKztcbiAgc3RhdGUuY2FjaGVTZXQocG9zLCBzdGF0ZS5wb3MpO1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0b2tlbnMgZm9yIHRoZSBnaXZlbiBpbnB1dCByYW5nZS5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBzdGF0ZWBcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblBhcnNlcklubGluZS5wcm90b3R5cGUudG9rZW5pemUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgdmFyIHJ1bGVzID0gdGhpcy5ydWxlci5nZXRSdWxlcygnJyk7XG4gIHZhciBsZW4gPSBydWxlcy5sZW5ndGg7XG4gIHZhciBlbmQgPSBzdGF0ZS5wb3NNYXg7XG4gIHZhciBvaywgaTtcblxuICB3aGlsZSAoc3RhdGUucG9zIDwgZW5kKSB7XG5cbiAgICAvLyBUcnkgYWxsIHBvc3NpYmxlIHJ1bGVzLlxuICAgIC8vIE9uIHN1Y2Nlc3MsIHRoZSBydWxlIHNob3VsZDpcbiAgICAvL1xuICAgIC8vIC0gdXBkYXRlIGBzdGF0ZS5wb3NgXG4gICAgLy8gLSB1cGRhdGUgYHN0YXRlLnRva2Vuc2BcbiAgICAvLyAtIHJldHVybiB0cnVlXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBvayA9IHJ1bGVzW2ldKHN0YXRlLCBmYWxzZSk7XG5cbiAgICAgIGlmIChvaykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2spIHtcbiAgICAgIGlmIChzdGF0ZS5wb3MgPj0gZW5kKSB7IGJyZWFrOyB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBzdGF0ZS5wZW5kaW5nICs9IHN0YXRlLnNyY1tzdGF0ZS5wb3MrK107XG4gIH1cblxuICBpZiAoc3RhdGUucGVuZGluZykge1xuICAgIHN0YXRlLnB1c2hQZW5kaW5nKCk7XG4gIH1cbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGlucHV0IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBzdHJgXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBvcHRpb25zYFxuICogQHBhcmFtICB7T2JqZWN0fSBgZW52YFxuICogQHBhcmFtICB7QXJyYXl9IGBvdXRUb2tlbnNgXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5QYXJzZXJJbmxpbmUucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHN0ciwgb3B0aW9ucywgZW52LCBvdXRUb2tlbnMpIHtcbiAgdmFyIHN0YXRlID0gbmV3IFN0YXRlSW5saW5lKHN0ciwgdGhpcywgb3B0aW9ucywgZW52LCBvdXRUb2tlbnMpO1xuICB0aGlzLnRva2VuaXplKHN0YXRlKTtcbn07XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIGdpdmVuIGB1cmxgIGJ5IGNoZWNraW5nIGZvciBiYWQgcHJvdG9jb2xzLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYHVybGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdGVMaW5rKHVybCkge1xuICB2YXIgQkFEX1BST1RPQ09MUyA9IFsgJ3Zic2NyaXB0JywgJ2phdmFzY3JpcHQnLCAnZmlsZScgXTtcbiAgdmFyIHN0ciA9IHVybC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgLy8gQ2FyZSBhYm91dCBkaWdpdGFsIGVudGl0aWVzIFwiamF2YXNjcmlwdCYjeDNBO2FsZXJ0KDEpXCJcbiAgc3RyID0gdXRpbHMucmVwbGFjZUVudGl0aWVzKHN0cik7XG4gIGlmIChzdHIuaW5kZXhPZignOicpICE9PSAtMSAmJiBCQURfUFJPVE9DT0xTLmluZGV4T2Yoc3RyLnNwbGl0KCc6JylbMF0pICE9PSAtMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBFeHBvc2UgYFBhcnNlcklubGluZWBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcklubGluZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMb2NhbCBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpO1xudmFyIHJ1bGVzID0gcmVxdWlyZSgnLi9ydWxlcycpO1xuXG4vKipcbiAqIEV4cG9zZSBgUmVuZGVyZXJgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjtcblxuLyoqXG4gKiBSZW5kZXJlciBjbGFzcy4gUmVuZGVycyBIVE1MIGFuZCBleHBvc2VzIGBydWxlc2AgdG8gYWxsb3dcbiAqIGxvY2FsIG1vZGlmaWNhdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG4gIHRoaXMucnVsZXMgPSB1dGlscy5hc3NpZ24oe30sIHJ1bGVzKTtcblxuICAvLyBleHBvcnRlZCBoZWxwZXIsIGZvciBjdXN0b20gcnVsZXMgb25seVxuICB0aGlzLmdldEJyZWFrID0gcnVsZXMuZ2V0QnJlYWs7XG59XG5cbi8qKlxuICogUmVuZGVyIGEgc3RyaW5nIG9mIGlubGluZSBIVE1MIHdpdGggdGhlIGdpdmVuIGB0b2tlbnNgIGFuZFxuICogYG9wdGlvbnNgLlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSBgdG9rZW5zYFxuICogQHBhcmFtICB7T2JqZWN0fSBgb3B0aW9uc2BcbiAqIEBwYXJhbSAge09iamVjdH0gYGVudmBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlcklubGluZSA9IGZ1bmN0aW9uICh0b2tlbnMsIG9wdGlvbnMsIGVudikge1xuICB2YXIgX3J1bGVzID0gdGhpcy5ydWxlcztcbiAgdmFyIGxlbiA9IHRva2Vucy5sZW5ndGgsIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgcmVzdWx0ICs9IF9ydWxlc1t0b2tlbnNbaV0udHlwZV0odG9rZW5zLCBpKyssIG9wdGlvbnMsIGVudiwgdGhpcyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZW5kZXIgYSBzdHJpbmcgb2YgSFRNTCB3aXRoIHRoZSBnaXZlbiBgdG9rZW5zYCBhbmRcbiAqIGBvcHRpb25zYC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYHRva2Vuc2BcbiAqIEBwYXJhbSAge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBlbnZgXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAodG9rZW5zLCBvcHRpb25zLCBlbnYpIHtcbiAgdmFyIF9ydWxlcyA9IHRoaXMucnVsZXM7XG4gIHZhciBsZW4gPSB0b2tlbnMubGVuZ3RoLCBpID0gLTE7XG4gIHZhciByZXN1bHQgPSAnJztcblxuICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgaWYgKHRva2Vuc1tpXS50eXBlID09PSAnaW5saW5lJykge1xuICAgICAgcmVzdWx0ICs9IHRoaXMucmVuZGVySW5saW5lKHRva2Vuc1tpXS5jaGlsZHJlbiwgb3B0aW9ucywgZW52KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ICs9IF9ydWxlc1t0b2tlbnNbaV0udHlwZV0odG9rZW5zLCBpLCBvcHRpb25zLCBlbnYsIHRoaXMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSdWxlciBpcyBhIGhlbHBlciBjbGFzcyBmb3IgYnVpbGRpbmcgcmVzcG9uc2liaWxpdHkgY2hhaW5zIGZyb21cbiAqIHBhcnNlIHJ1bGVzLiBJdCBhbGxvd3M6XG4gKlxuICogICAtIGVhc3kgc3RhY2sgcnVsZXMgY2hhaW5zXG4gKiAgIC0gZ2V0dGluZyBtYWluIGNoYWluIGFuZCBuYW1lZCBjaGFpbnMgY29udGVudCAoYXMgYXJyYXlzIG9mIGZ1bmN0aW9ucylcbiAqXG4gKiBIZWxwZXIgbWV0aG9kcywgc2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5LlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUnVsZXIoKSB7XG4gIC8vIExpc3Qgb2YgYWRkZWQgcnVsZXMuIEVhY2ggZWxlbWVudCBpczpcbiAgLy9cbiAgLy8geyBuYW1lOiBYWFgsXG4gIC8vICAgZW5hYmxlZDogQm9vbGVhbixcbiAgLy8gICBmbjogRnVuY3Rpb24oKSxcbiAgLy8gICBhbHQ6IFsgbmFtZTIsIG5hbWUzIF0gfVxuICAvL1xuICB0aGlzLl9fcnVsZXNfXyA9IFtdO1xuXG4gIC8vIENhY2hlZCBydWxlIGNoYWlucy5cbiAgLy9cbiAgLy8gRmlyc3QgbGV2ZWwgLSBjaGFpbiBuYW1lLCAnJyBmb3IgZGVmYXVsdC5cbiAgLy8gU2Vjb25kIGxldmVsIC0gZGlnaXRhbCBhbmNob3IgZm9yIGZhc3QgZmlsdGVyaW5nIGJ5IGNoYXJjb2Rlcy5cbiAgLy9cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGluZGV4IG9mIGEgcnVsZSBieSBgbmFtZWAuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgbmFtZWBcbiAqIEByZXR1cm4ge051bWJlcn0gSW5kZXggb2YgdGhlIGdpdmVuIGBuYW1lYFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVsZXIucHJvdG90eXBlLl9fZmluZF9fID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIGxlbiA9IHRoaXMuX19ydWxlc19fLmxlbmd0aDtcbiAgdmFyIGkgPSAtMTtcblxuICB3aGlsZSAobGVuLS0pIHtcbiAgICBpZiAodGhpcy5fX3J1bGVzX19bKytpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufTtcblxuLyoqXG4gKiBCdWlsZCB0aGUgcnVsZXMgbG9va3VwIGNhY2hlXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVsZXIucHJvdG90eXBlLl9fY29tcGlsZV9fID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBjaGFpbnMgPSBbICcnIF07XG5cbiAgLy8gY29sbGVjdCB1bmlxdWUgbmFtZXNcbiAgc2VsZi5fX3J1bGVzX18uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIGlmICghcnVsZS5lbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcnVsZS5hbHQuZm9yRWFjaChmdW5jdGlvbiAoYWx0TmFtZSkge1xuICAgICAgaWYgKGNoYWlucy5pbmRleE9mKGFsdE5hbWUpIDwgMCkge1xuICAgICAgICBjaGFpbnMucHVzaChhbHROYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgc2VsZi5fX2NhY2hlX18gPSB7fTtcblxuICBjaGFpbnMuZm9yRWFjaChmdW5jdGlvbiAoY2hhaW4pIHtcbiAgICBzZWxmLl9fY2FjaGVfX1tjaGFpbl0gPSBbXTtcbiAgICBzZWxmLl9fcnVsZXNfXy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBpZiAoIXJ1bGUuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFpbiAmJiBydWxlLmFsdC5pbmRleE9mKGNoYWluKSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VsZi5fX2NhY2hlX19bY2hhaW5dLnB1c2gocnVsZS5mbik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBSdWxlciBwdWJsaWMgbWV0aG9kc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBSZXBsYWNlIHJ1bGUgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGBuYW1lYCBSdWxlIG5hbWVcbiAqIEBwYXJhbSAge0Z1bmN0aW9uIGBmbmBcbiAqIEBwYXJhbSAge09iamVjdH0gYG9wdGlvbnNgXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SdWxlci5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiAobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgdmFyIGlkeCA9IHRoaXMuX19maW5kX18obmFtZSk7XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChpZHggPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYXJzZXIgcnVsZSBub3QgZm91bmQ6ICcgKyBuYW1lKTtcbiAgfVxuXG4gIHRoaXMuX19ydWxlc19fW2lkeF0uZm4gPSBmbjtcbiAgdGhpcy5fX3J1bGVzX19baWR4XS5hbHQgPSBvcHQuYWx0IHx8IFtdO1xuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG4vKipcbiAqIEFkZCBhIHJ1bGUgdG8gdGhlIGNoYWluIGJlZm9yZSBnaXZlbiB0aGUgYHJ1bGVOYW1lYC5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgYGJlZm9yZU5hbWVgXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgYHJ1bGVOYW1lYFxuICogQHBhcmFtICB7RnVuY3Rpb259IGBmbmBcbiAqIEBwYXJhbSAge09iamVjdH0gICBgb3B0aW9uc2BcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bGVyLnByb3RvdHlwZS5iZWZvcmUgPSBmdW5jdGlvbiAoYmVmb3JlTmFtZSwgcnVsZU5hbWUsIGZuLCBvcHRpb25zKSB7XG4gIHZhciBpZHggPSB0aGlzLl9fZmluZF9fKGJlZm9yZU5hbWUpO1xuICB2YXIgb3B0ID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoaWR4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGFyc2VyIHJ1bGUgbm90IGZvdW5kOiAnICsgYmVmb3JlTmFtZSk7XG4gIH1cblxuICB0aGlzLl9fcnVsZXNfXy5zcGxpY2UoaWR4LCAwLCB7XG4gICAgbmFtZTogcnVsZU5hbWUsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBmbjogZm4sXG4gICAgYWx0OiBvcHQuYWx0IHx8IFtdXG4gIH0pO1xuXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cbi8qKlxuICogQWRkIGEgcnVsZSB0byB0aGUgY2hhaW4gYWZ0ZXIgdGhlIGdpdmVuIGBydWxlTmFtZWAuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgIGBhZnRlck5hbWVgXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgYHJ1bGVOYW1lYFxuICogQHBhcmFtICB7RnVuY3Rpb259IGBmbmBcbiAqIEBwYXJhbSAge09iamVjdH0gICBgb3B0aW9uc2BcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bGVyLnByb3RvdHlwZS5hZnRlciA9IGZ1bmN0aW9uIChhZnRlck5hbWUsIHJ1bGVOYW1lLCBmbiwgb3B0aW9ucykge1xuICB2YXIgaWR4ID0gdGhpcy5fX2ZpbmRfXyhhZnRlck5hbWUpO1xuICB2YXIgb3B0ID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoaWR4ID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUGFyc2VyIHJ1bGUgbm90IGZvdW5kOiAnICsgYWZ0ZXJOYW1lKTtcbiAgfVxuXG4gIHRoaXMuX19ydWxlc19fLnNwbGljZShpZHggKyAxLCAwLCB7XG4gICAgbmFtZTogcnVsZU5hbWUsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBmbjogZm4sXG4gICAgYWx0OiBvcHQuYWx0IHx8IFtdXG4gIH0pO1xuXG4gIHRoaXMuX19jYWNoZV9fID0gbnVsbDtcbn07XG5cbi8qKlxuICogQWRkIGEgcnVsZSB0byB0aGUgZW5kIG9mIGNoYWluLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gICBgcnVsZU5hbWVgXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gYGZuYFxuICogQHBhcmFtICB7T2JqZWN0fSAgIGBvcHRpb25zYFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cblJ1bGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBmbiwgb3B0aW9ucykge1xuICB2YXIgb3B0ID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLl9fcnVsZXNfXy5wdXNoKHtcbiAgICBuYW1lOiBydWxlTmFtZSxcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIGZuOiBmbixcbiAgICBhbHQ6IG9wdC5hbHQgfHwgW11cbiAgfSk7XG5cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xufTtcblxuLyoqXG4gKiBFbmFibGUgYSBydWxlIG9yIGxpc3Qgb2YgcnVsZXMuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEFycmF5fSBgbGlzdGAgTmFtZSBvciBhcnJheSBvZiBydWxlIG5hbWVzIHRvIGVuYWJsZVxuICogQHBhcmFtICB7Qm9vbGVhbn0gYHN0cmljdGAgSWYgYHRydWVgLCBhbGwgbm9uIGxpc3RlZCBydWxlcyB3aWxsIGJlIGRpc2FibGVkLlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUnVsZXIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uIChsaXN0LCBzdHJpY3QpIHtcbiAgbGlzdCA9ICFBcnJheS5pc0FycmF5KGxpc3QpXG4gICAgPyBbIGxpc3QgXVxuICAgIDogbGlzdDtcblxuICAvLyBJbiBzdHJpY3QgbW9kZSBkaXNhYmxlIGFsbCBleGlzdGluZyBydWxlcyBmaXJzdFxuICBpZiAoc3RyaWN0KSB7XG4gICAgdGhpcy5fX3J1bGVzX18uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgcnVsZS5lbmFibGVkID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTZWFyY2ggYnkgbmFtZSBhbmQgZW5hYmxlXG4gIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBpZHggPSB0aGlzLl9fZmluZF9fKG5hbWUpO1xuICAgIGlmIChpZHggPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1J1bGVzIG1hbmFnZXI6IGludmFsaWQgcnVsZSBuYW1lICcgKyBuYW1lKTtcbiAgICB9XG4gICAgdGhpcy5fX3J1bGVzX19baWR4XS5lbmFibGVkID0gdHJ1ZTtcbiAgfSwgdGhpcyk7XG5cbiAgdGhpcy5fX2NhY2hlX18gPSBudWxsO1xufTtcblxuXG4vKipcbiAqIERpc2FibGUgYSBydWxlIG9yIGxpc3Qgb2YgcnVsZXMuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEFycmF5fSBgbGlzdGAgTmFtZSBvciBhcnJheSBvZiBydWxlIG5hbWVzIHRvIGRpc2FibGVcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bGVyLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKGxpc3QpIHtcbiAgbGlzdCA9ICFBcnJheS5pc0FycmF5KGxpc3QpXG4gICAgPyBbIGxpc3QgXVxuICAgIDogbGlzdDtcblxuICAvLyBTZWFyY2ggYnkgbmFtZSBhbmQgZGlzYWJsZVxuICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgaWR4ID0gdGhpcy5fX2ZpbmRfXyhuYW1lKTtcbiAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSdWxlcyBtYW5hZ2VyOiBpbnZhbGlkIHJ1bGUgbmFtZSAnICsgbmFtZSk7XG4gICAgfVxuICAgIHRoaXMuX19ydWxlc19fW2lkeF0uZW5hYmxlZCA9IGZhbHNlO1xuICB9LCB0aGlzKTtcblxuICB0aGlzLl9fY2FjaGVfXyA9IG51bGw7XG59O1xuXG4vKipcbiAqIEdldCBhIHJ1bGVzIGxpc3QgYXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gYGNoYWluTmFtZWBcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJ1bGVyLnByb3RvdHlwZS5nZXRSdWxlcyA9IGZ1bmN0aW9uIChjaGFpbk5hbWUpIHtcbiAgaWYgKHRoaXMuX19jYWNoZV9fID09PSBudWxsKSB7XG4gICAgdGhpcy5fX2NvbXBpbGVfXygpO1xuICB9XG4gIHJldHVybiB0aGlzLl9fY2FjaGVfX1tjaGFpbk5hbWVdO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJ1bGVyYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTG9jYWwgZGVwZW5kZW5jaWVzXG4gKi9cblxudmFyIGhhcyAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykuaGFzO1xudmFyIHVuZXNjYXBlTWQgICAgICA9IHJlcXVpcmUoJy4vY29tbW9uL3V0aWxzJykudW5lc2NhcGVNZDtcbnZhciByZXBsYWNlRW50aXRpZXMgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLnJlcGxhY2VFbnRpdGllcztcbnZhciBlc2NhcGVIdG1sICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbi91dGlscycpLmVzY2FwZUh0bWw7XG5cbi8qKlxuICogUmVuZGVyZXIgcnVsZXMgY2FjaGVcbiAqL1xuXG52YXIgcnVsZXMgPSB7fTtcblxuLyoqXG4gKiBCbG9ja3F1b3Rlc1xuICovXG5cbnJ1bGVzLmJsb2NrcXVvdGVfb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPGJsb2NrcXVvdGU+XFxuJztcbn07XG5cbnJ1bGVzLmJsb2NrcXVvdGVfY2xvc2UgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvYmxvY2txdW90ZT4nICsgZ2V0QnJlYWsodG9rZW5zLCBpZHgpO1xufTtcblxuLyoqXG4gKiBDb2RlXG4gKi9cblxucnVsZXMuY29kZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIGlmICh0b2tlbnNbaWR4XS5ibG9jaykge1xuICAgIHJldHVybiAnPHByZT48Y29kZT4nICsgZXNjYXBlSHRtbCh0b2tlbnNbaWR4XS5jb250ZW50KSArICc8L2NvZGU+PC9wcmU+JyArIGdldEJyZWFrKHRva2VucywgaWR4KTtcbiAgfVxuICByZXR1cm4gJzxjb2RlPicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpICsgJzwvY29kZT4nO1xufTtcblxuLyoqXG4gKiBGZW5jZWQgY29kZSBibG9ja3NcbiAqL1xuXG5ydWxlcy5mZW5jZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52LCBzZWxmKSB7XG4gIHZhciB0b2tlbiA9IHRva2Vuc1tpZHhdO1xuICB2YXIgbGFuZ0NsYXNzID0gJyc7XG4gIHZhciBsYW5nUHJlZml4ID0gb3B0aW9ucy5sYW5nUHJlZml4O1xuICB2YXIgbGFuZ05hbWUgPSAnJywgZmVuY2VOYW1lO1xuICB2YXIgaGlnaGxpZ2h0ZWQ7XG5cbiAgaWYgKHRva2VuLnBhcmFtcykge1xuXG4gICAgLy9cbiAgICAvLyBgYGBmb28gYmFyXG4gICAgLy9cbiAgICAvLyBUcnkgY3VzdG9tIHJlbmRlcmVyIFwiZm9vXCIgZmlyc3QuIFRoYXQgd2lsbCBzaW1wbGlmeSBvdmVyd3JpdGVcbiAgICAvLyBmb3IgZGlhZ3JhbXMsIGxhdGV4LCBhbmQgYW55IG90aGVyIGZlbmNlZCBibG9jayB3aXRoIGN1c3RvbSBsb29rXG4gICAgLy9cblxuICAgIGZlbmNlTmFtZSA9IHRva2VuLnBhcmFtcy5zcGxpdCgvXFxzKy9nKVswXTtcblxuICAgIGlmIChoYXMoc2VsZi5ydWxlcy5mZW5jZV9jdXN0b20sIGZlbmNlTmFtZSkpIHtcbiAgICAgIHJldHVybiBzZWxmLnJ1bGVzLmZlbmNlX2N1c3RvbVtmZW5jZU5hbWVdKHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYsIHNlbGYpO1xuICAgIH1cblxuICAgIGxhbmdOYW1lID0gZXNjYXBlSHRtbChyZXBsYWNlRW50aXRpZXModW5lc2NhcGVNZChmZW5jZU5hbWUpKSk7XG4gICAgbGFuZ0NsYXNzID0gJyBjbGFzcz1cIicgKyBsYW5nUHJlZml4ICsgbGFuZ05hbWUgKyAnXCInO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgaGlnaGxpZ2h0ZWQgPSBvcHRpb25zLmhpZ2hsaWdodCh0b2tlbi5jb250ZW50LCBsYW5nTmFtZSkgfHwgZXNjYXBlSHRtbCh0b2tlbi5jb250ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBoaWdobGlnaHRlZCA9IGVzY2FwZUh0bWwodG9rZW4uY29udGVudCk7XG4gIH1cblxuICByZXR1cm4gJzxwcmU+PGNvZGUnICsgbGFuZ0NsYXNzICsgJz4nXG4gICAgICAgICsgaGlnaGxpZ2h0ZWRcbiAgICAgICAgKyAnPC9jb2RlPjwvcHJlPidcbiAgICAgICAgKyBnZXRCcmVhayh0b2tlbnMsIGlkeCk7XG59O1xuXG5ydWxlcy5mZW5jZV9jdXN0b20gPSB7fTtcblxuLyoqXG4gKiBIZWFkaW5nc1xuICovXG5cbnJ1bGVzLmhlYWRpbmdfb3BlbiA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPGgnICsgdG9rZW5zW2lkeF0uaExldmVsICsgJz4nO1xufTtcbnJ1bGVzLmhlYWRpbmdfY2xvc2UgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvaCcgKyB0b2tlbnNbaWR4XS5oTGV2ZWwgKyAnPlxcbic7XG59O1xuXG4vKipcbiAqIEhvcml6b250YWwgcnVsZXNcbiAqL1xuXG5ydWxlcy5ociA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucyAvKiwgZW52ICovKSB7XG4gIHJldHVybiAob3B0aW9ucy54aHRtbE91dCA/ICc8aHIgLz4nIDogJzxocj4nKSArIGdldEJyZWFrKHRva2VucywgaWR4KTtcbn07XG5cbi8qKlxuICogQnVsbGV0c1xuICovXG5cbnJ1bGVzLmJ1bGxldF9saXN0X29wZW4gPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzx1bD5cXG4nO1xufTtcbnJ1bGVzLmJ1bGxldF9saXN0X2Nsb3NlID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L3VsPicgKyBnZXRCcmVhayh0b2tlbnMsIGlkeCk7XG59O1xuXG4vKipcbiAqIExpc3QgaXRlbXNcbiAqL1xuXG5ydWxlcy5saXN0X2l0ZW1fb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPGxpPic7XG59O1xucnVsZXMubGlzdF9pdGVtX2Nsb3NlID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L2xpPlxcbic7XG59O1xuXG4vKipcbiAqIE9yZGVyZWQgbGlzdCBpdGVtc1xuICovXG5cbnJ1bGVzLm9yZGVyZWRfbGlzdF9vcGVuID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgdmFyIHRva2VuID0gdG9rZW5zW2lkeF07XG4gIHZhciBvcmRlciA9IHRva2VuLm9yZGVyID4gMSA/ICcgc3RhcnQ9XCInICsgdG9rZW4ub3JkZXIgKyAnXCInIDogJyc7XG4gIHJldHVybiAnPG9sJyArIG9yZGVyICsgJz5cXG4nO1xufTtcbnJ1bGVzLm9yZGVyZWRfbGlzdF9jbG9zZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPC9vbD4nICsgZ2V0QnJlYWsodG9rZW5zLCBpZHgpO1xufTtcblxuLyoqXG4gKiBQYXJhZ3JhcGhzXG4gKi9cblxucnVsZXMucGFyYWdyYXBoX29wZW4gPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gdG9rZW5zW2lkeF0udGlnaHQgPyAnJyA6ICc8cD4nO1xufTtcbnJ1bGVzLnBhcmFncmFwaF9jbG9zZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHZhciBhZGRCcmVhayA9ICEodG9rZW5zW2lkeF0udGlnaHQgJiYgaWR4ICYmIHRva2Vuc1tpZHggLSAxXS50eXBlID09PSAnaW5saW5lJyAmJiAhdG9rZW5zW2lkeCAtIDFdLmNvbnRlbnQpO1xuICByZXR1cm4gKHRva2Vuc1tpZHhdLnRpZ2h0ID8gJycgOiAnPC9wPicpICsgKGFkZEJyZWFrID8gZ2V0QnJlYWsodG9rZW5zLCBpZHgpIDogJycpO1xufTtcblxuLyoqXG4gKiBMaW5rc1xuICovXG5cbnJ1bGVzLmxpbmtfb3BlbiA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHZhciB0aXRsZSA9IHRva2Vuc1tpZHhdLnRpdGxlID8gKCcgdGl0bGU9XCInICsgZXNjYXBlSHRtbChyZXBsYWNlRW50aXRpZXModG9rZW5zW2lkeF0udGl0bGUpKSArICdcIicpIDogJyc7XG4gIHJldHVybiAnPGEgaHJlZj1cIicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmhyZWYpICsgJ1wiJyArIHRpdGxlICsgJz4nO1xufTtcbnJ1bGVzLmxpbmtfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvYT4nO1xufTtcblxuLyoqXG4gKiBJbWFnZXNcbiAqL1xuXG5ydWxlcy5pbWFnZSA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucyAvKiwgZW52ICovKSB7XG4gIHZhciBzcmMgPSAnIHNyYz1cIicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLnNyYykgKyAnXCInO1xuICB2YXIgdGl0bGUgPSB0b2tlbnNbaWR4XS50aXRsZSA/ICgnIHRpdGxlPVwiJyArIGVzY2FwZUh0bWwocmVwbGFjZUVudGl0aWVzKHRva2Vuc1tpZHhdLnRpdGxlKSkgKyAnXCInKSA6ICcnO1xuICB2YXIgYWx0ID0gJyBhbHQ9XCInICsgKHRva2Vuc1tpZHhdLmFsdCA/IGVzY2FwZUh0bWwocmVwbGFjZUVudGl0aWVzKHRva2Vuc1tpZHhdLmFsdCkpIDogJycpICsgJ1wiJztcbiAgdmFyIHN1ZmZpeCA9IG9wdGlvbnMueGh0bWxPdXQgPyAnIC8nIDogJyc7XG4gIHJldHVybiAnPGltZycgKyBzcmMgKyBhbHQgKyB0aXRsZSArIHN1ZmZpeCArICc+Jztcbn07XG5cbi8qKlxuICogVGFibGVzXG4gKi9cblxucnVsZXMudGFibGVfb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPHRhYmxlPlxcbic7XG59O1xucnVsZXMudGFibGVfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvdGFibGU+XFxuJztcbn07XG5ydWxlcy50aGVhZF9vcGVuID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8dGhlYWQ+XFxuJztcbn07XG5ydWxlcy50aGVhZF9jbG9zZSA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPC90aGVhZD5cXG4nO1xufTtcbnJ1bGVzLnRib2R5X29wZW4gPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzx0Ym9keT5cXG4nO1xufTtcbnJ1bGVzLnRib2R5X2Nsb3NlID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L3Rib2R5Plxcbic7XG59O1xucnVsZXMudHJfb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPHRyPic7XG59O1xucnVsZXMudHJfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvdHI+XFxuJztcbn07XG5ydWxlcy50aF9vcGVuID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgdmFyIHRva2VuID0gdG9rZW5zW2lkeF07XG4gIHJldHVybiAnPHRoJ1xuICAgICsgKHRva2VuLmFsaWduID8gJyBzdHlsZT1cInRleHQtYWxpZ246JyArIHRva2VuLmFsaWduICsgJ1wiJyA6ICcnKVxuICAgICsgJz4nO1xufTtcbnJ1bGVzLnRoX2Nsb3NlID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L3RoPic7XG59O1xucnVsZXMudGRfb3BlbiA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHZhciB0b2tlbiA9IHRva2Vuc1tpZHhdO1xuICByZXR1cm4gJzx0ZCdcbiAgICArICh0b2tlbi5hbGlnbiA/ICcgc3R5bGU9XCJ0ZXh0LWFsaWduOicgKyB0b2tlbi5hbGlnbiArICdcIicgOiAnJylcbiAgICArICc+Jztcbn07XG5ydWxlcy50ZF9jbG9zZSA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPC90ZD4nO1xufTtcblxuLyoqXG4gKiBCb2xkXG4gKi9cblxucnVsZXMuc3Ryb25nX29wZW4gPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxzdHJvbmc+Jztcbn07XG5ydWxlcy5zdHJvbmdfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvc3Ryb25nPic7XG59O1xuXG4vKipcbiAqIEl0YWxpY2l6ZVxuICovXG5cbnJ1bGVzLmVtX29wZW4gPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxlbT4nO1xufTtcbnJ1bGVzLmVtX2Nsb3NlID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L2VtPic7XG59O1xuXG4vKipcbiAqIFN0cmlrZXRocm91Z2hcbiAqL1xuXG5ydWxlcy5kZWxfb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPGRlbD4nO1xufTtcbnJ1bGVzLmRlbF9jbG9zZSA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPC9kZWw+Jztcbn07XG5cbi8qKlxuICogSW5zZXJ0XG4gKi9cblxucnVsZXMuaW5zX29wZW4gPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzxpbnM+Jztcbn07XG5ydWxlcy5pbnNfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvaW5zPic7XG59O1xuXG4vKipcbiAqIEhpZ2hsaWdodFxuICovXG5cbnJ1bGVzLm1hcmtfb3BlbiA9IGZ1bmN0aW9uICgvKiB0b2tlbnMsIGlkeCwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPG1hcms+Jztcbn07XG5ydWxlcy5tYXJrX2Nsb3NlID0gZnVuY3Rpb24gKC8qIHRva2VucywgaWR4LCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8L21hcms+Jztcbn07XG5cbi8qKlxuICogU3VwZXItIGFuZCBzdWItc2NyaXB0XG4gKi9cblxucnVsZXMuc3ViID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8c3ViPicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpICsgJzwvc3ViPic7XG59O1xucnVsZXMuc3VwID0gZnVuY3Rpb24gKHRva2VucywgaWR4IC8qLCBvcHRpb25zLCBlbnYgKi8pIHtcbiAgcmV0dXJuICc8c3VwPicgKyBlc2NhcGVIdG1sKHRva2Vuc1tpZHhdLmNvbnRlbnQpICsgJzwvc3VwPic7XG59O1xuXG4vKipcbiAqIEJyZWFrc1xuICovXG5cbnJ1bGVzLmhhcmRicmVhayA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCwgb3B0aW9ucyAvKiwgZW52ICovKSB7XG4gIHJldHVybiBvcHRpb25zLnhodG1sT3V0ID8gJzxiciAvPlxcbicgOiAnPGJyPlxcbic7XG59O1xucnVsZXMuc29mdGJyZWFrID0gZnVuY3Rpb24gKHRva2VucywgaWR4LCBvcHRpb25zIC8qLCBlbnYgKi8pIHtcbiAgcmV0dXJuIG9wdGlvbnMuYnJlYWtzID8gKG9wdGlvbnMueGh0bWxPdXQgPyAnPGJyIC8+XFxuJyA6ICc8YnI+XFxuJykgOiAnXFxuJztcbn07XG5cbi8qKlxuICogVGV4dFxuICovXG5cbnJ1bGVzLnRleHQgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gZXNjYXBlSHRtbCh0b2tlbnNbaWR4XS5jb250ZW50KTtcbn07XG5cbi8qKlxuICogQ29udGVudFxuICovXG5cbnJ1bGVzLmh0bWxibG9jayA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiB0b2tlbnNbaWR4XS5jb250ZW50O1xufTtcbnJ1bGVzLmh0bWx0YWcgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHggLyosIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gdG9rZW5zW2lkeF0uY29udGVudDtcbn07XG5cbi8qKlxuICogQWJicmV2aWF0aW9ucywgaW5pdGlhbGlzbVxuICovXG5cbnJ1bGVzLmFiYnJfb3BlbiA9IGZ1bmN0aW9uICh0b2tlbnMsIGlkeCAvKiwgb3B0aW9ucywgZW52ICovKSB7XG4gIHJldHVybiAnPGFiYnIgdGl0bGU9XCInICsgZXNjYXBlSHRtbChyZXBsYWNlRW50aXRpZXModG9rZW5zW2lkeF0udGl0bGUpKSArICdcIj4nO1xufTtcbnJ1bGVzLmFiYnJfY2xvc2UgPSBmdW5jdGlvbiAoLyogdG9rZW5zLCBpZHgsIG9wdGlvbnMsIGVudiAqLykge1xuICByZXR1cm4gJzwvYWJicj4nO1xufTtcblxuLyoqXG4gKiBGb290bm90ZXNcbiAqL1xuXG5ydWxlcy5mb290bm90ZV9yZWYgPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgpIHtcbiAgdmFyIG4gPSBOdW1iZXIodG9rZW5zW2lkeF0uaWQgKyAxKS50b1N0cmluZygpO1xuICB2YXIgaWQgPSAnZm5yZWYnICsgbjtcbiAgaWYgKHRva2Vuc1tpZHhdLnN1YklkID4gMCkge1xuICAgIGlkICs9ICc6JyArIHRva2Vuc1tpZHhdLnN1YklkO1xuICB9XG4gIHJldHVybiAnPHN1cCBjbGFzcz1cImZvb3Rub3RlLXJlZlwiPjxhIGhyZWY9XCIjZm4nICsgbiArICdcIiBpZD1cIicgKyBpZCArICdcIj5bJyArIG4gKyAnXTwvYT48L3N1cD4nO1xufTtcbnJ1bGVzLmZvb3Rub3RlX2Jsb2NrX29wZW4gPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgsIG9wdGlvbnMpIHtcbiAgdmFyIGhyID0gb3B0aW9ucy54aHRtbE91dFxuICAgID8gJzxociBjbGFzcz1cImZvb3Rub3Rlcy1zZXBcIiAvPlxcbidcbiAgICA6ICc8aHIgY2xhc3M9XCJmb290bm90ZXMtc2VwXCI+XFxuJztcbiAgcmV0dXJuICBociArICc8c2VjdGlvbiBjbGFzcz1cImZvb3Rub3Rlc1wiPlxcbjxvbCBjbGFzcz1cImZvb3Rub3Rlcy1saXN0XCI+XFxuJztcbn07XG5ydWxlcy5mb290bm90ZV9ibG9ja19jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICc8L29sPlxcbjwvc2VjdGlvbj5cXG4nO1xufTtcbnJ1bGVzLmZvb3Rub3RlX29wZW4gPSBmdW5jdGlvbiAodG9rZW5zLCBpZHgpIHtcbiAgdmFyIGlkID0gTnVtYmVyKHRva2Vuc1tpZHhdLmlkICsgMSkudG9TdHJpbmcoKTtcbiAgcmV0dXJuICc8bGkgaWQ9XCJmbicgKyBpZCArICdcIiAgY2xhc3M9XCJmb290bm90ZS1pdGVtXCI+Jztcbn07XG5ydWxlcy5mb290bm90ZV9jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICc8L2xpPlxcbic7XG59O1xucnVsZXMuZm9vdG5vdGVfYW5jaG9yID0gZnVuY3Rpb24gKHRva2VucywgaWR4KSB7XG4gIHZhciBuID0gTnVtYmVyKHRva2Vuc1tpZHhdLmlkICsgMSkudG9TdHJpbmcoKTtcbiAgdmFyIGlkID0gJ2ZucmVmJyArIG47XG4gIGlmICh0b2tlbnNbaWR4XS5zdWJJZCA+IDApIHtcbiAgICBpZCArPSAnOicgKyB0b2tlbnNbaWR4XS5zdWJJZDtcbiAgfVxuICByZXR1cm4gJyA8YSBocmVmPVwiIycgKyBpZCArICdcIiBjbGFzcz1cImZvb3Rub3RlLWJhY2tyZWZcIj7ihqk8L2E+Jztcbn07XG5cbi8qKlxuICogRGVmaW5pdGlvbiBsaXN0c1xuICovXG5cbnJ1bGVzLmRsX29wZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICc8ZGw+XFxuJztcbn07XG5ydWxlcy5kdF9vcGVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnPGR0Pic7XG59O1xucnVsZXMuZGRfb3BlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJzxkZD4nO1xufTtcbnJ1bGVzLmRsX2Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnPC9kbD5cXG4nO1xufTtcbnJ1bGVzLmR0X2Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnPC9kdD5cXG4nO1xufTtcbnJ1bGVzLmRkX2Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnPC9kZD5cXG4nO1xufTtcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb25zXG4gKi9cblxuZnVuY3Rpb24gbmV4dFRva2VuKHRva2VucywgaWR4KSB7XG4gIGlmICgrK2lkeCA+PSB0b2tlbnMubGVuZ3RoIC0gMikge1xuICAgIHJldHVybiBpZHg7XG4gIH1cbiAgaWYgKCh0b2tlbnNbaWR4XS50eXBlID09PSAncGFyYWdyYXBoX29wZW4nICYmIHRva2Vuc1tpZHhdLnRpZ2h0KSAmJlxuICAgICAgKHRva2Vuc1tpZHggKyAxXS50eXBlID09PSAnaW5saW5lJyAmJiB0b2tlbnNbaWR4ICsgMV0uY29udGVudC5sZW5ndGggPT09IDApICYmXG4gICAgICAodG9rZW5zW2lkeCArIDJdLnR5cGUgPT09ICdwYXJhZ3JhcGhfY2xvc2UnICYmIHRva2Vuc1tpZHggKyAyXS50aWdodCkpIHtcbiAgICByZXR1cm4gbmV4dFRva2VuKHRva2VucywgaWR4ICsgMik7XG4gIH1cbiAgcmV0dXJuIGlkeDtcbn1cblxuLyoqXG4gKiBDaGVjayB0byBzZWUgaWYgYFxcbmAgaXMgbmVlZGVkIGJlZm9yZSB0aGUgbmV4dCB0b2tlbi5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gYHRva2Vuc2BcbiAqIEBwYXJhbSAge051bWJlcn0gYGlkeGBcbiAqIEByZXR1cm4ge1N0cmluZ30gRW1wdHkgc3RyaW5nIG9yIG5ld2xpbmVcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBnZXRCcmVhayA9IHJ1bGVzLmdldEJyZWFrID0gZnVuY3Rpb24gZ2V0QnJlYWsodG9rZW5zLCBpZHgpIHtcbiAgaWR4ID0gbmV4dFRva2VuKHRva2VucywgaWR4KTtcbiAgaWYgKGlkeCA8IHRva2Vucy5sZW5ndGggJiYgdG9rZW5zW2lkeF0udHlwZSA9PT0gJ2xpc3RfaXRlbV9jbG9zZScpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuICdcXG4nO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYHJ1bGVzYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gcnVsZXM7XG4iLCIvLyBCbG9jayBxdW90ZXNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxvY2txdW90ZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIG5leHRMaW5lLCBsYXN0TGluZUVtcHR5LCBvbGRUU2hpZnQsIG9sZEJNYXJrcywgb2xkSW5kZW50LCBvbGRQYXJlbnRUeXBlLCBsaW5lcyxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcyxcbiAgICAgIGksIGwsIHRlcm1pbmF0ZSxcbiAgICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICBpZiAocG9zID4gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGNoZWNrIHRoZSBibG9jayBxdW90ZSBtYXJrZXJcbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKSAhPT0gMHgzRS8qID4gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHN0YXRlLmxldmVsID49IHN0YXRlLm9wdGlvbnMubWF4TmVzdGluZykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyB3ZSBrbm93IHRoYXQgaXQncyBnb2luZyB0byBiZSBhIHZhbGlkIGJsb2NrcXVvdGUsXG4gIC8vIHNvIG5vIHBvaW50IHRyeWluZyB0byBmaW5kIHRoZSBlbmQgb2YgaXQgaW4gc2lsZW50IG1vZGVcbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIHNraXAgb25lIG9wdGlvbmFsIHNwYWNlIGFmdGVyICc+J1xuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgc3RhdGUuYmxrSW5kZW50ID0gMDtcblxuICBvbGRCTWFya3MgPSBbIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdIF07XG4gIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdID0gcG9zO1xuXG4gIC8vIGNoZWNrIGlmIHdlIGhhdmUgYW4gZW1wdHkgYmxvY2txdW90ZVxuICBwb3MgPSBwb3MgPCBtYXggPyBzdGF0ZS5za2lwU3BhY2VzKHBvcykgOiBwb3M7XG4gIGxhc3RMaW5lRW1wdHkgPSBwb3MgPj0gbWF4O1xuXG4gIG9sZFRTaGlmdCA9IFsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gXTtcbiAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBwb3MgLSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcblxuICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5wYXJzZXIucnVsZXIuZ2V0UnVsZXMoJ2Jsb2NrcXVvdGUnKTtcblxuICAvLyBTZWFyY2ggdGhlIGVuZCBvZiB0aGUgYmxvY2tcbiAgLy9cbiAgLy8gQmxvY2sgZW5kcyB3aXRoIGVpdGhlcjpcbiAgLy8gIDEuIGFuIGVtcHR5IGxpbmUgb3V0c2lkZTpcbiAgLy8gICAgIGBgYFxuICAvLyAgICAgPiB0ZXN0XG4gIC8vXG4gIC8vICAgICBgYGBcbiAgLy8gIDIuIGFuIGVtcHR5IGxpbmUgaW5zaWRlOlxuICAvLyAgICAgYGBgXG4gIC8vICAgICA+XG4gIC8vICAgICB0ZXN0XG4gIC8vICAgICBgYGBcbiAgLy8gIDMuIGFub3RoZXIgdGFnXG4gIC8vICAgICBgYGBcbiAgLy8gICAgID4gdGVzdFxuICAvLyAgICAgIC0gLSAtXG4gIC8vICAgICBgYGBcbiAgZm9yIChuZXh0TGluZSA9IHN0YXJ0TGluZSArIDE7IG5leHRMaW5lIDwgZW5kTGluZTsgbmV4dExpbmUrKykge1xuICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tuZXh0TGluZV0gKyBzdGF0ZS50U2hpZnRbbmV4dExpbmVdO1xuICAgIG1heCA9IHN0YXRlLmVNYXJrc1tuZXh0TGluZV07XG5cbiAgICBpZiAocG9zID49IG1heCkge1xuICAgICAgLy8gQ2FzZSAxOiBsaW5lIGlzIG5vdCBpbnNpZGUgdGhlIGJsb2NrcXVvdGUsIGFuZCB0aGlzIGxpbmUgaXMgZW1wdHkuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKyspID09PSAweDNFLyogPiAqLykge1xuICAgICAgLy8gVGhpcyBsaW5lIGlzIGluc2lkZSB0aGUgYmxvY2txdW90ZS5cblxuICAgICAgLy8gc2tpcCBvbmUgb3B0aW9uYWwgc3BhY2UgYWZ0ZXIgJz4nXG4gICAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gICAgICBvbGRCTWFya3MucHVzaChzdGF0ZS5iTWFya3NbbmV4dExpbmVdKTtcbiAgICAgIHN0YXRlLmJNYXJrc1tuZXh0TGluZV0gPSBwb3M7XG5cbiAgICAgIHBvcyA9IHBvcyA8IG1heCA/IHN0YXRlLnNraXBTcGFjZXMocG9zKSA6IHBvcztcbiAgICAgIGxhc3RMaW5lRW1wdHkgPSBwb3MgPj0gbWF4O1xuXG4gICAgICBvbGRUU2hpZnQucHVzaChzdGF0ZS50U2hpZnRbbmV4dExpbmVdKTtcbiAgICAgIHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPSBwb3MgLSBzdGF0ZS5iTWFya3NbbmV4dExpbmVdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gQ2FzZSAyOiBsaW5lIGlzIG5vdCBpbnNpZGUgdGhlIGJsb2NrcXVvdGUsIGFuZCB0aGUgbGFzdCBsaW5lIHdhcyBlbXB0eS5cbiAgICBpZiAobGFzdExpbmVFbXB0eSkgeyBicmVhazsgfVxuXG4gICAgLy8gQ2FzZSAzOiBhbm90aGVyIHRhZyBmb3VuZC5cbiAgICB0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICBmb3IgKGkgPSAwLCBsID0gdGVybWluYXRvclJ1bGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRlcm1pbmF0b3JSdWxlc1tpXShzdGF0ZSwgbmV4dExpbmUsIGVuZExpbmUsIHRydWUpKSB7XG4gICAgICAgIHRlcm1pbmF0ZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVybWluYXRlKSB7IGJyZWFrOyB9XG5cbiAgICBvbGRCTWFya3MucHVzaChzdGF0ZS5iTWFya3NbbmV4dExpbmVdKTtcbiAgICBvbGRUU2hpZnQucHVzaChzdGF0ZS50U2hpZnRbbmV4dExpbmVdKTtcblxuICAgIC8vIEEgbmVnYXRpdmUgbnVtYmVyIG1lYW5zIHRoYXQgdGhpcyBpcyBhIHBhcmFncmFwaCBjb250aW51YXRpb247XG4gICAgLy9cbiAgICAvLyBBbnkgbmVnYXRpdmUgbnVtYmVyIHdpbGwgZG8gdGhlIGpvYiBoZXJlLCBidXQgaXQncyBiZXR0ZXIgZm9yIGl0XG4gICAgLy8gdG8gYmUgbGFyZ2UgZW5vdWdoIHRvIG1ha2UgYW55IGJ1Z3Mgb2J2aW91cy5cbiAgICBzdGF0ZS50U2hpZnRbbmV4dExpbmVdID0gLTEzMzc7XG4gIH1cblxuICBvbGRQYXJlbnRUeXBlID0gc3RhdGUucGFyZW50VHlwZTtcbiAgc3RhdGUucGFyZW50VHlwZSA9ICdibG9ja3F1b3RlJztcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdibG9ja3F1b3RlX29wZW4nLFxuICAgIGxpbmVzOiBsaW5lcyA9IFsgc3RhcnRMaW5lLCAwIF0sXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsKytcbiAgfSk7XG4gIHN0YXRlLnBhcnNlci50b2tlbml6ZShzdGF0ZSwgc3RhcnRMaW5lLCBuZXh0TGluZSk7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnYmxvY2txdW90ZV9jbG9zZScsXG4gICAgbGV2ZWw6IC0tc3RhdGUubGV2ZWxcbiAgfSk7XG4gIHN0YXRlLnBhcmVudFR5cGUgPSBvbGRQYXJlbnRUeXBlO1xuICBsaW5lc1sxXSA9IHN0YXRlLmxpbmU7XG5cbiAgLy8gUmVzdG9yZSBvcmlnaW5hbCB0U2hpZnQ7IHRoaXMgbWlnaHQgbm90IGJlIG5lY2Vzc2FyeSBzaW5jZSB0aGUgcGFyc2VyXG4gIC8vIGhhcyBhbHJlYWR5IGJlZW4gaGVyZSwgYnV0IGp1c3QgdG8gbWFrZSBzdXJlIHdlIGNhbiBkbyB0aGF0LlxuICBmb3IgKGkgPSAwOyBpIDwgb2xkVFNoaWZ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgc3RhdGUuYk1hcmtzW2kgKyBzdGFydExpbmVdID0gb2xkQk1hcmtzW2ldO1xuICAgIHN0YXRlLnRTaGlmdFtpICsgc3RhcnRMaW5lXSA9IG9sZFRTaGlmdFtpXTtcbiAgfVxuICBzdGF0ZS5ibGtJbmRlbnQgPSBvbGRJbmRlbnQ7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gQ29kZSBibG9jayAoNCBzcGFjZXMgcGFkZGVkKVxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb2RlKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUvKiwgc2lsZW50Ki8pIHtcbiAgdmFyIG5leHRMaW5lLCBsYXN0O1xuXG4gIGlmIChzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSAtIHN0YXRlLmJsa0luZGVudCA8IDQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgbGFzdCA9IG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTtcblxuICB3aGlsZSAobmV4dExpbmUgPCBlbmRMaW5lKSB7XG4gICAgaWYgKHN0YXRlLmlzRW1wdHkobmV4dExpbmUpKSB7XG4gICAgICBuZXh0TGluZSsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIC0gc3RhdGUuYmxrSW5kZW50ID49IDQpIHtcbiAgICAgIG5leHRMaW5lKys7XG4gICAgICBsYXN0ID0gbmV4dExpbmU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgYnJlYWs7XG4gIH1cblxuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnY29kZScsXG4gICAgY29udGVudDogc3RhdGUuZ2V0TGluZXMoc3RhcnRMaW5lLCBsYXN0LCA0ICsgc3RhdGUuYmxrSW5kZW50LCB0cnVlKSxcbiAgICBibG9jazogdHJ1ZSxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gRGVmaW5pdGlvbiBsaXN0c1xuXG4ndXNlIHN0cmljdCc7XG5cblxuLy8gU2VhcmNoIGBbOn5dW1xcbiBdYCwgcmV0dXJucyBuZXh0IHBvcyBhZnRlciBtYXJrZXIgb24gc3VjY2Vzc1xuLy8gb3IgLTEgb24gZmFpbC5cbmZ1bmN0aW9uIHNraXBNYXJrZXIoc3RhdGUsIGxpbmUpIHtcbiAgdmFyIHBvcywgbWFya2VyLFxuICAgICAgc3RhcnQgPSBzdGF0ZS5iTWFya3NbbGluZV0gKyBzdGF0ZS50U2hpZnRbbGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3NbbGluZV07XG5cbiAgaWYgKHN0YXJ0ID49IG1heCkgeyByZXR1cm4gLTE7IH1cblxuICAvLyBDaGVjayBidWxsZXRcbiAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQrKyk7XG4gIGlmIChtYXJrZXIgIT09IDB4N0UvKiB+ICovICYmIG1hcmtlciAhPT0gMHgzQS8qIDogKi8pIHsgcmV0dXJuIC0xOyB9XG5cbiAgcG9zID0gc3RhdGUuc2tpcFNwYWNlcyhzdGFydCk7XG5cbiAgLy8gcmVxdWlyZSBzcGFjZSBhZnRlciBcIjpcIlxuICBpZiAoc3RhcnQgPT09IHBvcykgeyByZXR1cm4gLTE7IH1cblxuICAvLyBubyBlbXB0eSBkZWZpbml0aW9ucywgZS5nLiBcIiAgOiBcIlxuICBpZiAocG9zID49IG1heCkgeyByZXR1cm4gLTE7IH1cblxuICByZXR1cm4gcG9zO1xufVxuXG5mdW5jdGlvbiBtYXJrVGlnaHRQYXJhZ3JhcGhzKHN0YXRlLCBpZHgpIHtcbiAgdmFyIGksIGwsXG4gICAgICBsZXZlbCA9IHN0YXRlLmxldmVsICsgMjtcblxuICBmb3IgKGkgPSBpZHggKyAyLCBsID0gc3RhdGUudG9rZW5zLmxlbmd0aCAtIDI7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoc3RhdGUudG9rZW5zW2ldLmxldmVsID09PSBsZXZlbCAmJiBzdGF0ZS50b2tlbnNbaV0udHlwZSA9PT0gJ3BhcmFncmFwaF9vcGVuJykge1xuICAgICAgc3RhdGUudG9rZW5zW2kgKyAyXS50aWdodCA9IHRydWU7XG4gICAgICBzdGF0ZS50b2tlbnNbaV0udGlnaHQgPSB0cnVlO1xuICAgICAgaSArPSAyO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmxpc3Qoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjb250ZW50U3RhcnQsXG4gICAgICBkZExpbmUsXG4gICAgICBkdExpbmUsXG4gICAgICBpdGVtTGluZXMsXG4gICAgICBsaXN0TGluZXMsXG4gICAgICBsaXN0VG9rSWR4LFxuICAgICAgbmV4dExpbmUsXG4gICAgICBvbGRJbmRlbnQsXG4gICAgICBvbGREREluZGVudCxcbiAgICAgIG9sZFBhcmVudFR5cGUsXG4gICAgICBvbGRUU2hpZnQsXG4gICAgICBvbGRUaWdodCxcbiAgICAgIHByZXZFbXB0eUVuZCxcbiAgICAgIHRpZ2h0O1xuXG4gIGlmIChzaWxlbnQpIHtcbiAgICAvLyBxdWlyazogdmFsaWRhdGlvbiBtb2RlIHZhbGlkYXRlcyBhIGRkIGJsb2NrIG9ubHksIG5vdCBhIHdob2xlIGRlZmxpc3RcbiAgICBpZiAoc3RhdGUuZGRJbmRlbnQgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIHJldHVybiBza2lwTWFya2VyKHN0YXRlLCBzdGFydExpbmUpID49IDA7XG4gIH1cblxuICBuZXh0TGluZSA9IHN0YXJ0TGluZSArIDE7XG4gIGlmIChzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgIGlmICgrK25leHRMaW5lID4gZW5kTGluZSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuXG4gIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7IHJldHVybiBmYWxzZTsgfVxuICBjb250ZW50U3RhcnQgPSBza2lwTWFya2VyKHN0YXRlLCBuZXh0TGluZSk7XG4gIGlmIChjb250ZW50U3RhcnQgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmIChzdGF0ZS5sZXZlbCA+PSBzdGF0ZS5vcHRpb25zLm1heE5lc3RpbmcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gU3RhcnQgbGlzdFxuICBsaXN0VG9rSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aDtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2RsX29wZW4nLFxuICAgIGxpbmVzOiBsaXN0TGluZXMgPSBbIHN0YXJ0TGluZSwgMCBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gIH0pO1xuXG4gIC8vXG4gIC8vIEl0ZXJhdGUgbGlzdCBpdGVtc1xuICAvL1xuXG4gIGR0TGluZSA9IHN0YXJ0TGluZTtcbiAgZGRMaW5lID0gbmV4dExpbmU7XG5cbiAgLy8gT25lIGRlZmluaXRpb24gbGlzdCBjYW4gY29udGFpbiBtdWx0aXBsZSBEVHMsXG4gIC8vIGFuZCBvbmUgRFQgY2FuIGJlIGZvbGxvd2VkIGJ5IG11bHRpcGxlIEREcy5cbiAgLy9cbiAgLy8gVGh1cywgdGhlcmUgaXMgdHdvIGxvb3BzIGhlcmUsIGFuZCBsYWJlbCBpc1xuICAvLyBuZWVkZWQgdG8gYnJlYWsgb3V0IG9mIHRoZSBzZWNvbmQgb25lXG4gIC8vXG4gIC8qZXNsaW50IG5vLWxhYmVsczowLGJsb2NrLXNjb3BlZC12YXI6MCovXG4gIE9VVEVSOlxuICBmb3IgKDs7KSB7XG4gICAgdGlnaHQgPSB0cnVlO1xuICAgIHByZXZFbXB0eUVuZCA9IGZhbHNlO1xuXG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2R0X29wZW4nLFxuICAgICAgbGluZXM6IFsgZHRMaW5lLCBkdExpbmUgXSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiBzdGF0ZS5nZXRMaW5lcyhkdExpbmUsIGR0TGluZSArIDEsIHN0YXRlLmJsa0luZGVudCwgZmFsc2UpLnRyaW0oKSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCArIDEsXG4gICAgICBsaW5lczogWyBkdExpbmUsIGR0TGluZSBdLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2R0X2Nsb3NlJyxcbiAgICAgIGxldmVsOiAtLXN0YXRlLmxldmVsXG4gICAgfSk7XG5cbiAgICBmb3IgKDs7KSB7XG4gICAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdkZF9vcGVuJyxcbiAgICAgICAgbGluZXM6IGl0ZW1MaW5lcyA9IFsgbmV4dExpbmUsIDAgXSxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsKytcbiAgICAgIH0pO1xuXG4gICAgICBvbGRUaWdodCA9IHN0YXRlLnRpZ2h0O1xuICAgICAgb2xkRERJbmRlbnQgPSBzdGF0ZS5kZEluZGVudDtcbiAgICAgIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgICAgIG9sZFRTaGlmdCA9IHN0YXRlLnRTaGlmdFtkZExpbmVdO1xuICAgICAgb2xkUGFyZW50VHlwZSA9IHN0YXRlLnBhcmVudFR5cGU7XG4gICAgICBzdGF0ZS5ibGtJbmRlbnQgPSBzdGF0ZS5kZEluZGVudCA9IHN0YXRlLnRTaGlmdFtkZExpbmVdICsgMjtcbiAgICAgIHN0YXRlLnRTaGlmdFtkZExpbmVdID0gY29udGVudFN0YXJ0IC0gc3RhdGUuYk1hcmtzW2RkTGluZV07XG4gICAgICBzdGF0ZS50aWdodCA9IHRydWU7XG4gICAgICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2RlZmxpc3QnO1xuXG4gICAgICBzdGF0ZS5wYXJzZXIudG9rZW5pemUoc3RhdGUsIGRkTGluZSwgZW5kTGluZSwgdHJ1ZSk7XG5cbiAgICAgIC8vIElmIGFueSBvZiBsaXN0IGl0ZW0gaXMgdGlnaHQsIG1hcmsgbGlzdCBhcyB0aWdodFxuICAgICAgaWYgKCFzdGF0ZS50aWdodCB8fCBwcmV2RW1wdHlFbmQpIHtcbiAgICAgICAgdGlnaHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEl0ZW0gYmVjb21lIGxvb3NlIGlmIGZpbmlzaCB3aXRoIGVtcHR5IGxpbmUsXG4gICAgICAvLyBidXQgd2Ugc2hvdWxkIGZpbHRlciBsYXN0IGVsZW1lbnQsIGJlY2F1c2UgaXQgbWVhbnMgbGlzdCBmaW5pc2hcbiAgICAgIHByZXZFbXB0eUVuZCA9IChzdGF0ZS5saW5lIC0gZGRMaW5lKSA+IDEgJiYgc3RhdGUuaXNFbXB0eShzdGF0ZS5saW5lIC0gMSk7XG5cbiAgICAgIHN0YXRlLnRTaGlmdFtkZExpbmVdID0gb2xkVFNoaWZ0O1xuICAgICAgc3RhdGUudGlnaHQgPSBvbGRUaWdodDtcbiAgICAgIHN0YXRlLnBhcmVudFR5cGUgPSBvbGRQYXJlbnRUeXBlO1xuICAgICAgc3RhdGUuYmxrSW5kZW50ID0gb2xkSW5kZW50O1xuICAgICAgc3RhdGUuZGRJbmRlbnQgPSBvbGREREluZGVudDtcblxuICAgICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnZGRfY2xvc2UnLFxuICAgICAgICBsZXZlbDogLS1zdGF0ZS5sZXZlbFxuICAgICAgfSk7XG5cbiAgICAgIGl0ZW1MaW5lc1sxXSA9IG5leHRMaW5lID0gc3RhdGUubGluZTtcblxuICAgICAgaWYgKG5leHRMaW5lID49IGVuZExpbmUpIHsgYnJlYWsgT1VURVI7IH1cblxuICAgICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgYnJlYWsgT1VURVI7IH1cbiAgICAgIGNvbnRlbnRTdGFydCA9IHNraXBNYXJrZXIoc3RhdGUsIG5leHRMaW5lKTtcbiAgICAgIGlmIChjb250ZW50U3RhcnQgPCAwKSB7IGJyZWFrOyB9XG5cbiAgICAgIGRkTGluZSA9IG5leHRMaW5lO1xuXG4gICAgICAvLyBnbyB0byB0aGUgbmV4dCBsb29wIGl0ZXJhdGlvbjpcbiAgICAgIC8vIGluc2VydCBERCB0YWcgYW5kIHJlcGVhdCBjaGVja2luZ1xuICAgIH1cblxuICAgIGlmIChuZXh0TGluZSA+PSBlbmRMaW5lKSB7IGJyZWFrOyB9XG4gICAgZHRMaW5lID0gbmV4dExpbmU7XG5cbiAgICBpZiAoc3RhdGUuaXNFbXB0eShkdExpbmUpKSB7IGJyZWFrOyB9XG4gICAgaWYgKHN0YXRlLnRTaGlmdFtkdExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7IGJyZWFrOyB9XG5cbiAgICBkZExpbmUgPSBkdExpbmUgKyAxO1xuICAgIGlmIChkZExpbmUgPj0gZW5kTGluZSkgeyBicmVhazsgfVxuICAgIGlmIChzdGF0ZS5pc0VtcHR5KGRkTGluZSkpIHsgZGRMaW5lKys7IH1cbiAgICBpZiAoZGRMaW5lID49IGVuZExpbmUpIHsgYnJlYWs7IH1cblxuICAgIGlmIChzdGF0ZS50U2hpZnRbZGRMaW5lXSA8IHN0YXRlLmJsa0luZGVudCkgeyBicmVhazsgfVxuICAgIGNvbnRlbnRTdGFydCA9IHNraXBNYXJrZXIoc3RhdGUsIGRkTGluZSk7XG4gICAgaWYgKGNvbnRlbnRTdGFydCA8IDApIHsgYnJlYWs7IH1cblxuICAgIC8vIGdvIHRvIHRoZSBuZXh0IGxvb3AgaXRlcmF0aW9uOlxuICAgIC8vIGluc2VydCBEVCBhbmQgREQgdGFncyBhbmQgcmVwZWF0IGNoZWNraW5nXG4gIH1cblxuICAvLyBGaW5pbGl6ZSBsaXN0XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnZGxfY2xvc2UnLFxuICAgIGxldmVsOiAtLXN0YXRlLmxldmVsXG4gIH0pO1xuICBsaXN0TGluZXNbMV0gPSBuZXh0TGluZTtcblxuICBzdGF0ZS5saW5lID0gbmV4dExpbmU7XG5cbiAgLy8gbWFyayBwYXJhZ3JhcGhzIHRpZ2h0IGlmIG5lZWRlZFxuICBpZiAodGlnaHQpIHtcbiAgICBtYXJrVGlnaHRQYXJhZ3JhcGhzKHN0YXRlLCBsaXN0VG9rSWR4KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGZlbmNlcyAoYGBgIGxhbmcsIH5+fiBsYW5nKVxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmZW5jZXMoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBtYXJrZXIsIGxlbiwgcGFyYW1zLCBuZXh0TGluZSwgbWVtLFxuICAgICAgaGF2ZUVuZE1hcmtlciA9IGZhbHNlLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIGlmIChwb3MgKyAzID4gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHg3RS8qIH4gKi8gJiYgbWFya2VyICE9PSAweDYwIC8qIGAgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBzY2FuIG1hcmtlciBsZW5ndGhcbiAgbWVtID0gcG9zO1xuICBwb3MgPSBzdGF0ZS5za2lwQ2hhcnMocG9zLCBtYXJrZXIpO1xuXG4gIGxlbiA9IHBvcyAtIG1lbTtcblxuICBpZiAobGVuIDwgMykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwYXJhbXMgPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXgpLnRyaW0oKTtcblxuICBpZiAocGFyYW1zLmluZGV4T2YoJ2AnKSA+PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIFNpbmNlIHN0YXJ0IGlzIGZvdW5kLCB3ZSBjYW4gcmVwb3J0IHN1Y2Nlc3MgaGVyZSBpbiB2YWxpZGF0aW9uIG1vZGVcbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIHNlYXJjaCBlbmQgb2YgYmxvY2tcbiAgbmV4dExpbmUgPSBzdGFydExpbmU7XG5cbiAgZm9yICg7Oykge1xuICAgIG5leHRMaW5lKys7XG4gICAgaWYgKG5leHRMaW5lID49IGVuZExpbmUpIHtcbiAgICAgIC8vIHVuY2xvc2VkIGJsb2NrIHNob3VsZCBiZSBhdXRvY2xvc2VkIGJ5IGVuZCBvZiBkb2N1bWVudC5cbiAgICAgIC8vIGFsc28gYmxvY2sgc2VlbXMgdG8gYmUgYXV0b2Nsb3NlZCBieSBlbmQgb2YgcGFyZW50XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBwb3MgPSBtZW0gPSBzdGF0ZS5iTWFya3NbbmV4dExpbmVdICsgc3RhdGUudFNoaWZ0W25leHRMaW5lXTtcbiAgICBtYXggPSBzdGF0ZS5lTWFya3NbbmV4dExpbmVdO1xuXG4gICAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS50U2hpZnRbbmV4dExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7XG4gICAgICAvLyBub24tZW1wdHkgbGluZSB3aXRoIG5lZ2F0aXZlIGluZGVudCBzaG91bGQgc3RvcCB0aGUgbGlzdDpcbiAgICAgIC8vIC0gYGBgXG4gICAgICAvLyAgdGVzdFxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IG1hcmtlcikgeyBjb250aW51ZTsgfVxuXG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gLSBzdGF0ZS5ibGtJbmRlbnQgPj0gNCkge1xuICAgICAgLy8gY2xvc2luZyBmZW5jZSBzaG91bGQgYmUgaW5kZW50ZWQgbGVzcyB0aGFuIDQgc3BhY2VzXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBwb3MgPSBzdGF0ZS5za2lwQ2hhcnMocG9zLCBtYXJrZXIpO1xuXG4gICAgLy8gY2xvc2luZyBjb2RlIGZlbmNlIG11c3QgYmUgYXQgbGVhc3QgYXMgbG9uZyBhcyB0aGUgb3BlbmluZyBvbmVcbiAgICBpZiAocG9zIC0gbWVtIDwgbGVuKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAvLyBtYWtlIHN1cmUgdGFpbCBoYXMgc3BhY2VzIG9ubHlcbiAgICBwb3MgPSBzdGF0ZS5za2lwU3BhY2VzKHBvcyk7XG5cbiAgICBpZiAocG9zIDwgbWF4KSB7IGNvbnRpbnVlOyB9XG5cbiAgICBoYXZlRW5kTWFya2VyID0gdHJ1ZTtcbiAgICAvLyBmb3VuZCFcbiAgICBicmVhaztcbiAgfVxuXG4gIC8vIElmIGEgZmVuY2UgaGFzIGhlYWRpbmcgc3BhY2VzLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGZyb20gaXRzIGlubmVyIGJsb2NrXG4gIGxlbiA9IHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuXG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZSArIChoYXZlRW5kTWFya2VyID8gMSA6IDApO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2ZlbmNlJyxcbiAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICBjb250ZW50OiBzdGF0ZS5nZXRMaW5lcyhzdGFydExpbmUgKyAxLCBuZXh0TGluZSwgbGVuLCB0cnVlKSxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBmb290bm90ZSByZWZlcmVuY2UgbGlzdFxuXG4ndXNlIHN0cmljdCc7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb290bm90ZShzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIG9sZEJNYXJrLCBvbGRUU2hpZnQsIG9sZFBhcmVudFR5cGUsIHBvcywgbGFiZWwsXG4gICAgICBzdGFydCA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICAvLyBsaW5lIHNob3VsZCBiZSBhdCBsZWFzdCA1IGNoYXJzIC0gXCJbXnhdOlwiXG4gIGlmIChzdGFydCArIDQgPiBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0KSAhPT0gMHg1Qi8qIFsgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCArIDEpICE9PSAweDVFLyogXiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLmxldmVsID49IHN0YXRlLm9wdGlvbnMubWF4TmVzdGluZykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKHBvcyA9IHN0YXJ0ICsgMjsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDIwKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDVEIC8qIF0gKi8pIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwb3MgPT09IHN0YXJ0ICsgMikgeyByZXR1cm4gZmFsc2U7IH0gLy8gbm8gZW1wdHkgZm9vdG5vdGUgbGFiZWxzXG4gIGlmIChwb3MgKyAxID49IG1heCB8fCBzdGF0ZS5zcmMuY2hhckNvZGVBdCgrK3BvcykgIT09IDB4M0EgLyogOiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuICBwb3MrKztcblxuICBpZiAoIXN0YXRlLmVudi5mb290bm90ZXMpIHsgc3RhdGUuZW52LmZvb3Rub3RlcyA9IHt9OyB9XG4gIGlmICghc3RhdGUuZW52LmZvb3Rub3Rlcy5yZWZzKSB7IHN0YXRlLmVudi5mb290bm90ZXMucmVmcyA9IHt9OyB9XG4gIGxhYmVsID0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0ICsgMiwgcG9zIC0gMik7XG4gIHN0YXRlLmVudi5mb290bm90ZXMucmVmc1snOicgKyBsYWJlbF0gPSAtMTtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2Zvb3Rub3RlX3JlZmVyZW5jZV9vcGVuJyxcbiAgICBsYWJlbDogbGFiZWwsXG4gICAgbGV2ZWw6IHN0YXRlLmxldmVsKytcbiAgfSk7XG5cbiAgb2xkQk1hcmsgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXTtcbiAgb2xkVFNoaWZ0ID0gc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG4gIG9sZFBhcmVudFR5cGUgPSBzdGF0ZS5wYXJlbnRUeXBlO1xuICBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSA9IHN0YXRlLnNraXBTcGFjZXMocG9zKSAtIHBvcztcbiAgc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gPSBwb3M7XG4gIHN0YXRlLmJsa0luZGVudCArPSA0O1xuICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2Zvb3Rub3RlJztcblxuICBpZiAoc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHtcbiAgICBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSArPSBzdGF0ZS5ibGtJbmRlbnQ7XG4gICAgc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gLT0gc3RhdGUuYmxrSW5kZW50O1xuICB9XG5cbiAgc3RhdGUucGFyc2VyLnRva2VuaXplKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHRydWUpO1xuXG4gIHN0YXRlLnBhcmVudFR5cGUgPSBvbGRQYXJlbnRUeXBlO1xuICBzdGF0ZS5ibGtJbmRlbnQgLT0gNDtcbiAgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0gPSBvbGRUU2hpZnQ7XG4gIHN0YXRlLmJNYXJrc1tzdGFydExpbmVdID0gb2xkQk1hcms7XG5cbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdmb290bm90ZV9yZWZlcmVuY2VfY2xvc2UnLFxuICAgIGxldmVsOiAtLXN0YXRlLmxldmVsXG4gIH0pO1xuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIGhlYWRpbmcgKCMsICMjLCAuLi4pXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhlYWRpbmcoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbGV2ZWwsIHRtcCxcbiAgICAgIHBvcyA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV0sXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICBpZiAocG9zID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjaCAgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuXG4gIGlmIChjaCAhPT0gMHgyMy8qICMgKi8gfHwgcG9zID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBjb3VudCBoZWFkaW5nIGxldmVsXG4gIGxldmVsID0gMTtcbiAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdCgrK3Bvcyk7XG4gIHdoaWxlIChjaCA9PT0gMHgyMy8qICMgKi8gJiYgcG9zIDwgbWF4ICYmIGxldmVsIDw9IDYpIHtcbiAgICBsZXZlbCsrO1xuICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoKytwb3MpO1xuICB9XG5cbiAgaWYgKGxldmVsID4gNiB8fCAocG9zIDwgbWF4ICYmIGNoICE9PSAweDIwLyogc3BhY2UgKi8pKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBMZXQncyBjdXQgdGFpbHMgbGlrZSAnICAgICMjIyAgJyBmcm9tIHRoZSBlbmQgb2Ygc3RyaW5nXG5cbiAgbWF4ID0gc3RhdGUuc2tpcENoYXJzQmFjayhtYXgsIDB4MjAsIHBvcyk7IC8vIHNwYWNlXG4gIHRtcCA9IHN0YXRlLnNraXBDaGFyc0JhY2sobWF4LCAweDIzLCBwb3MpOyAvLyAjXG4gIGlmICh0bXAgPiBwb3MgJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQodG1wIC0gMSkgPT09IDB4MjAvKiBzcGFjZSAqLykge1xuICAgIG1heCA9IHRtcDtcbiAgfVxuXG4gIHN0YXRlLmxpbmUgPSBzdGFydExpbmUgKyAxO1xuXG4gIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ2hlYWRpbmdfb3BlbicsXG4gICAgaExldmVsOiBsZXZlbCxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG5cbiAgLy8gb25seSBpZiBoZWFkZXIgaXMgbm90IGVtcHR5XG4gIGlmIChwb3MgPCBtYXgpIHtcbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICB0eXBlOiAnaW5saW5lJyxcbiAgICAgIGNvbnRlbnQ6IHN0YXRlLnNyYy5zbGljZShwb3MsIG1heCkudHJpbSgpLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsICsgMSxcbiAgICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSk7XG4gIH1cbiAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAnaGVhZGluZ19jbG9zZScsIGhMZXZlbDogbGV2ZWwsIGxldmVsOiBzdGF0ZS5sZXZlbCB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBIb3Jpem9udGFsIHJ1bGVcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHIoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBtYXJrZXIsIGNudCwgY2gsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIHBvcyArPSBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXTtcblxuICBpZiAocG9zID4gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG1hcmtlciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcblxuICAvLyBDaGVjayBociBtYXJrZXJcbiAgaWYgKG1hcmtlciAhPT0gMHgyQS8qICogKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHgyRC8qIC0gKi8gJiZcbiAgICAgIG1hcmtlciAhPT0gMHg1Ri8qIF8gKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBtYXJrZXJzIGNhbiBiZSBtaXhlZCB3aXRoIHNwYWNlcywgYnV0IHRoZXJlIHNob3VsZCBiZSBhdCBsZWFzdCAzIG9uZVxuXG4gIGNudCA9IDE7XG4gIHdoaWxlIChwb3MgPCBtYXgpIHtcbiAgICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcbiAgICBpZiAoY2ggIT09IG1hcmtlciAmJiBjaCAhPT0gMHgyMC8qIHNwYWNlICovKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmIChjaCA9PT0gbWFya2VyKSB7IGNudCsrOyB9XG4gIH1cblxuICBpZiAoY250IDwgMykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoc2lsZW50KSB7IHJldHVybiB0cnVlOyB9XG5cbiAgc3RhdGUubGluZSA9IHN0YXJ0TGluZSArIDE7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaHInLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBIVE1MIGJsb2NrXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgYmxvY2tfbmFtZXMgPSByZXF1aXJlKCcuLi9jb21tb24vaHRtbF9ibG9ja3MnKTtcblxuXG52YXIgSFRNTF9UQUdfT1BFTl9SRSA9IC9ePChbYS16QS1aXXsxLDE1fSlbXFxzXFwvPl0vO1xudmFyIEhUTUxfVEFHX0NMT1NFX1JFID0gL148XFwvKFthLXpBLVpdezEsMTV9KVtcXHM+XS87XG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGNoKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIHZhciBsYyA9IGNoIHwgMHgyMDsgLy8gdG8gbG93ZXIgY2FzZVxuICByZXR1cm4gKGxjID49IDB4NjEvKiBhICovKSAmJiAobGMgPD0gMHg3YS8qIHogKi8pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGh0bWxibG9jayhzdGF0ZSwgc3RhcnRMaW5lLCBlbmRMaW5lLCBzaWxlbnQpIHtcbiAgdmFyIGNoLCBtYXRjaCwgbmV4dExpbmUsXG4gICAgICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdLFxuICAgICAgc2hpZnQgPSBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXTtcblxuICBwb3MgKz0gc2hpZnQ7XG5cbiAgaWYgKCFzdGF0ZS5vcHRpb25zLmh0bWwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKHNoaWZ0ID4gMyB8fCBwb3MgKyAyID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgzQy8qIDwgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MgKyAxKTtcblxuICBpZiAoY2ggPT09IDB4MjEvKiAhICovIHx8IGNoID09PSAweDNGLyogPyAqLykge1xuICAgIC8vIERpcmVjdGl2ZSBzdGFydCAvIGNvbW1lbnQgc3RhcnQgLyBwcm9jZXNzaW5nIGluc3RydWN0aW9uIHN0YXJ0XG4gICAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIH0gZWxzZSBpZiAoY2ggPT09IDB4MkYvKiAvICovIHx8IGlzTGV0dGVyKGNoKSkge1xuXG4gICAgLy8gUHJvYmFibHkgc3RhcnQgb3IgZW5kIG9mIHRhZ1xuICAgIGlmIChjaCA9PT0gMHgyRi8qIFxcICovKSB7XG4gICAgICAvLyBjbG9zaW5nIHRhZ1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zLCBtYXgpLm1hdGNoKEhUTUxfVEFHX0NMT1NFX1JFKTtcbiAgICAgIGlmICghbWF0Y2gpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG9wZW5pbmcgdGFnXG4gICAgICBtYXRjaCA9IHN0YXRlLnNyYy5zbGljZShwb3MsIG1heCkubWF0Y2goSFRNTF9UQUdfT1BFTl9SRSk7XG4gICAgICBpZiAoIW1hdGNoKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgdGFnIG5hbWUgaXMgdmFsaWRcbiAgICBpZiAoYmxvY2tfbmFtZXNbbWF0Y2hbMV0udG9Mb3dlckNhc2UoKV0gIT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHNpbGVudCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gSWYgd2UgYXJlIGhlcmUgLSB3ZSBkZXRlY3RlZCBIVE1MIGJsb2NrLlxuICAvLyBMZXQncyByb2xsIGRvd24gdGlsbCBlbXB0eSBsaW5lIChibG9jayBlbmQpLlxuICBuZXh0TGluZSA9IHN0YXJ0TGluZSArIDE7XG4gIHdoaWxlIChuZXh0TGluZSA8IHN0YXRlLmxpbmVNYXggJiYgIXN0YXRlLmlzRW1wdHkobmV4dExpbmUpKSB7XG4gICAgbmV4dExpbmUrKztcbiAgfVxuXG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdodG1sYmxvY2snLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBjb250ZW50OiBzdGF0ZS5nZXRMaW5lcyhzdGFydExpbmUsIG5leHRMaW5lLCAwLCB0cnVlKVxuICB9KTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBsaGVhZGluZyAoLS0tLCA9PT0pXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxoZWFkaW5nKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUvKiwgc2lsZW50Ki8pIHtcbiAgdmFyIG1hcmtlciwgcG9zLCBtYXgsXG4gICAgICBuZXh0ID0gc3RhcnRMaW5lICsgMTtcblxuICBpZiAobmV4dCA+PSBlbmRMaW5lKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUudFNoaWZ0W25leHRdIDwgc3RhdGUuYmxrSW5kZW50KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIFNjYW4gbmV4dCBsaW5lXG5cbiAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0XSAtIHN0YXRlLmJsa0luZGVudCA+IDMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gc3RhdGUuYk1hcmtzW25leHRdICsgc3RhdGUudFNoaWZ0W25leHRdO1xuICBtYXggPSBzdGF0ZS5lTWFya3NbbmV4dF07XG5cbiAgaWYgKHBvcyA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgbWFya2VyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICBpZiAobWFya2VyICE9PSAweDJELyogLSAqLyAmJiBtYXJrZXIgIT09IDB4M0QvKiA9ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IHN0YXRlLnNraXBDaGFycyhwb3MsIG1hcmtlcik7XG5cbiAgcG9zID0gc3RhdGUuc2tpcFNwYWNlcyhwb3MpO1xuXG4gIGlmIChwb3MgPCBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXTtcblxuICBzdGF0ZS5saW5lID0gbmV4dCArIDE7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaGVhZGluZ19vcGVuJyxcbiAgICBoTGV2ZWw6IG1hcmtlciA9PT0gMHgzRC8qID0gKi8gPyAxIDogMixcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXRlLmxpbmUgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAnaW5saW5lJyxcbiAgICBjb250ZW50OiBzdGF0ZS5zcmMuc2xpY2UocG9zLCBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXSkudHJpbSgpLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCArIDEsXG4gICAgbGluZXM6IFsgc3RhcnRMaW5lLCBzdGF0ZS5saW5lIC0gMSBdLFxuICAgIGNoaWxkcmVuOiBbXVxuICB9KTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdoZWFkaW5nX2Nsb3NlJyxcbiAgICBoTGV2ZWw6IG1hcmtlciA9PT0gMHgzRC8qID0gKi8gPyAxIDogMixcbiAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgfSk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gTGlzdHNcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8vIFNlYXJjaCBgWy0rKl1bXFxuIF1gLCByZXR1cm5zIG5leHQgcG9zIGFydGVyIG1hcmtlciBvbiBzdWNjZXNzXG4vLyBvciAtMSBvbiBmYWlsLlxuZnVuY3Rpb24gc2tpcEJ1bGxldExpc3RNYXJrZXIoc3RhdGUsIHN0YXJ0TGluZSkge1xuICB2YXIgbWFya2VyLCBwb3MsIG1heDtcblxuICBwb3MgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcblxuICBpZiAocG9zID49IG1heCkgeyByZXR1cm4gLTE7IH1cblxuICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKyk7XG4gIC8vIENoZWNrIGJ1bGxldFxuICBpZiAobWFya2VyICE9PSAweDJBLyogKiAqLyAmJlxuICAgICAgbWFya2VyICE9PSAweDJELyogLSAqLyAmJlxuICAgICAgbWFya2VyICE9PSAweDJCLyogKyAqLykge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyMCkge1xuICAgIC8vIFwiIDEudGVzdCBcIiAtIGlzIG5vdCBhIGxpc3QgaXRlbVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHJldHVybiBwb3M7XG59XG5cbi8vIFNlYXJjaCBgXFxkK1suKV1bXFxuIF1gLCByZXR1cm5zIG5leHQgcG9zIGFydGVyIG1hcmtlciBvbiBzdWNjZXNzXG4vLyBvciAtMSBvbiBmYWlsLlxuZnVuY3Rpb24gc2tpcE9yZGVyZWRMaXN0TWFya2VyKHN0YXRlLCBzdGFydExpbmUpIHtcbiAgdmFyIGNoLFxuICAgICAgcG9zID0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV0gKyBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSxcbiAgICAgIG1heCA9IHN0YXRlLmVNYXJrc1tzdGFydExpbmVdO1xuXG4gIGlmIChwb3MgKyAxID49IG1heCkgeyByZXR1cm4gLTE7IH1cblxuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcysrKTtcblxuICBpZiAoY2ggPCAweDMwLyogMCAqLyB8fCBjaCA+IDB4MzkvKiA5ICovKSB7IHJldHVybiAtMTsgfVxuXG4gIGZvciAoOzspIHtcbiAgICAvLyBFT0wgLT4gZmFpbFxuICAgIGlmIChwb3MgPj0gbWF4KSB7IHJldHVybiAtMTsgfVxuXG4gICAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MrKyk7XG5cbiAgICBpZiAoY2ggPj0gMHgzMC8qIDAgKi8gJiYgY2ggPD0gMHgzOS8qIDkgKi8pIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZvdW5kIHZhbGlkIG1hcmtlclxuICAgIGlmIChjaCA9PT0gMHgyOS8qICkgKi8gfHwgY2ggPT09IDB4MmUvKiAuICovKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuXG4gIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSAhPT0gMHgyMC8qIHNwYWNlICovKSB7XG4gICAgLy8gXCIgMS50ZXN0IFwiIC0gaXMgbm90IGEgbGlzdCBpdGVtXG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiBwb3M7XG59XG5cbmZ1bmN0aW9uIG1hcmtUaWdodFBhcmFncmFwaHMoc3RhdGUsIGlkeCkge1xuICB2YXIgaSwgbCxcbiAgICAgIGxldmVsID0gc3RhdGUubGV2ZWwgKyAyO1xuXG4gIGZvciAoaSA9IGlkeCArIDIsIGwgPSBzdGF0ZS50b2tlbnMubGVuZ3RoIC0gMjsgaSA8IGw7IGkrKykge1xuICAgIGlmIChzdGF0ZS50b2tlbnNbaV0ubGV2ZWwgPT09IGxldmVsICYmIHN0YXRlLnRva2Vuc1tpXS50eXBlID09PSAncGFyYWdyYXBoX29wZW4nKSB7XG4gICAgICBzdGF0ZS50b2tlbnNbaSArIDJdLnRpZ2h0ID0gdHJ1ZTtcbiAgICAgIHN0YXRlLnRva2Vuc1tpXS50aWdodCA9IHRydWU7XG4gICAgICBpICs9IDI7XG4gICAgfVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsaXN0KHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHNpbGVudCkge1xuICB2YXIgbmV4dExpbmUsXG4gICAgICBpbmRlbnQsXG4gICAgICBvbGRUU2hpZnQsXG4gICAgICBvbGRJbmRlbnQsXG4gICAgICBvbGRUaWdodCxcbiAgICAgIG9sZFBhcmVudFR5cGUsXG4gICAgICBzdGFydCxcbiAgICAgIHBvc0FmdGVyTWFya2VyLFxuICAgICAgbWF4LFxuICAgICAgaW5kZW50QWZ0ZXJNYXJrZXIsXG4gICAgICBtYXJrZXJWYWx1ZSxcbiAgICAgIG1hcmtlckNoYXJDb2RlLFxuICAgICAgaXNPcmRlcmVkLFxuICAgICAgY29udGVudFN0YXJ0LFxuICAgICAgbGlzdFRva0lkeCxcbiAgICAgIHByZXZFbXB0eUVuZCxcbiAgICAgIGxpc3RMaW5lcyxcbiAgICAgIGl0ZW1MaW5lcyxcbiAgICAgIHRpZ2h0ID0gdHJ1ZSxcbiAgICAgIHRlcm1pbmF0b3JSdWxlcyxcbiAgICAgIGksIGwsIHRlcm1pbmF0ZTtcblxuICAvLyBEZXRlY3QgbGlzdCB0eXBlIGFuZCBwb3NpdGlvbiBhZnRlciBtYXJrZXJcbiAgaWYgKChwb3NBZnRlck1hcmtlciA9IHNraXBPcmRlcmVkTGlzdE1hcmtlcihzdGF0ZSwgc3RhcnRMaW5lKSkgPj0gMCkge1xuICAgIGlzT3JkZXJlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoKHBvc0FmdGVyTWFya2VyID0gc2tpcEJ1bGxldExpc3RNYXJrZXIoc3RhdGUsIHN0YXJ0TGluZSkpID49IDApIHtcbiAgICBpc09yZGVyZWQgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIFdlIHNob3VsZCB0ZXJtaW5hdGUgbGlzdCBvbiBzdHlsZSBjaGFuZ2UuIFJlbWVtYmVyIGZpcnN0IG9uZSB0byBjb21wYXJlLlxuICBtYXJrZXJDaGFyQ29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvc0FmdGVyTWFya2VyIC0gMSk7XG5cbiAgLy8gRm9yIHZhbGlkYXRpb24gbW9kZSB3ZSBjYW4gdGVybWluYXRlIGltbWVkaWF0ZWx5XG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICAvLyBTdGFydCBsaXN0XG4gIGxpc3RUb2tJZHggPSBzdGF0ZS50b2tlbnMubGVuZ3RoO1xuXG4gIGlmIChpc09yZGVyZWQpIHtcbiAgICBzdGFydCA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdICsgc3RhdGUudFNoaWZ0W3N0YXJ0TGluZV07XG4gICAgbWFya2VyVmFsdWUgPSBOdW1iZXIoc3RhdGUuc3JjLnN1YnN0cihzdGFydCwgcG9zQWZ0ZXJNYXJrZXIgLSBzdGFydCAtIDEpKTtcblxuICAgIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICAgIHR5cGU6ICdvcmRlcmVkX2xpc3Rfb3BlbicsXG4gICAgICBvcmRlcjogbWFya2VyVmFsdWUsXG4gICAgICBsaW5lczogbGlzdExpbmVzID0gWyBzdGFydExpbmUsIDAgXSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gICAgfSk7XG5cbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICB0eXBlOiAnYnVsbGV0X2xpc3Rfb3BlbicsXG4gICAgICBsaW5lczogbGlzdExpbmVzID0gWyBzdGFydExpbmUsIDAgXSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gICAgfSk7XG4gIH1cblxuICAvL1xuICAvLyBJdGVyYXRlIGxpc3QgaXRlbXNcbiAgLy9cblxuICBuZXh0TGluZSA9IHN0YXJ0TGluZTtcbiAgcHJldkVtcHR5RW5kID0gZmFsc2U7XG4gIHRlcm1pbmF0b3JSdWxlcyA9IHN0YXRlLnBhcnNlci5ydWxlci5nZXRSdWxlcygnbGlzdCcpO1xuXG4gIHdoaWxlIChuZXh0TGluZSA8IGVuZExpbmUpIHtcbiAgICBjb250ZW50U3RhcnQgPSBzdGF0ZS5za2lwU3BhY2VzKHBvc0FmdGVyTWFya2VyKTtcbiAgICBtYXggPSBzdGF0ZS5lTWFya3NbbmV4dExpbmVdO1xuXG4gICAgaWYgKGNvbnRlbnRTdGFydCA+PSBtYXgpIHtcbiAgICAgIC8vIHRyaW1taW5nIHNwYWNlIGluIFwiLSAgICBcXG4gIDNcIiBjYXNlLCBpbmRlbnQgaXMgMSBoZXJlXG4gICAgICBpbmRlbnRBZnRlck1hcmtlciA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZGVudEFmdGVyTWFya2VyID0gY29udGVudFN0YXJ0IC0gcG9zQWZ0ZXJNYXJrZXI7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBtb3JlIHRoYW4gNCBzcGFjZXMsIHRoZSBpbmRlbnQgaXMgMVxuICAgIC8vICh0aGUgcmVzdCBpcyBqdXN0IGluZGVudGVkIGNvZGUgYmxvY2spXG4gICAgaWYgKGluZGVudEFmdGVyTWFya2VyID4gNCkgeyBpbmRlbnRBZnRlck1hcmtlciA9IDE7IH1cblxuICAgIC8vIElmIGluZGVudCBpcyBsZXNzIHRoYW4gMSwgYXNzdW1lIHRoYXQgaXQncyBvbmUsIGV4YW1wbGU6XG4gICAgLy8gIFwiLVxcbiAgdGVzdFwiXG4gICAgaWYgKGluZGVudEFmdGVyTWFya2VyIDwgMSkgeyBpbmRlbnRBZnRlck1hcmtlciA9IDE7IH1cblxuICAgIC8vIFwiICAtICB0ZXN0XCJcbiAgICAvLyAgXl5eXl4gLSBjYWxjdWxhdGluZyB0b3RhbCBsZW5ndGggb2YgdGhpcyB0aGluZ1xuICAgIGluZGVudCA9IChwb3NBZnRlck1hcmtlciAtIHN0YXRlLmJNYXJrc1tuZXh0TGluZV0pICsgaW5kZW50QWZ0ZXJNYXJrZXI7XG5cbiAgICAvLyBSdW4gc3VicGFyc2VyICYgd3JpdGUgdG9rZW5zXG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2xpc3RfaXRlbV9vcGVuJyxcbiAgICAgIGxpbmVzOiBpdGVtTGluZXMgPSBbIHN0YXJ0TGluZSwgMCBdLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsKytcbiAgICB9KTtcblxuICAgIG9sZEluZGVudCA9IHN0YXRlLmJsa0luZGVudDtcbiAgICBvbGRUaWdodCA9IHN0YXRlLnRpZ2h0O1xuICAgIG9sZFRTaGlmdCA9IHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICAgIG9sZFBhcmVudFR5cGUgPSBzdGF0ZS5wYXJlbnRUeXBlO1xuICAgIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdID0gY29udGVudFN0YXJ0IC0gc3RhdGUuYk1hcmtzW3N0YXJ0TGluZV07XG4gICAgc3RhdGUuYmxrSW5kZW50ID0gaW5kZW50O1xuICAgIHN0YXRlLnRpZ2h0ID0gdHJ1ZTtcbiAgICBzdGF0ZS5wYXJlbnRUeXBlID0gJ2xpc3QnO1xuXG4gICAgc3RhdGUucGFyc2VyLnRva2VuaXplKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUsIHRydWUpO1xuXG4gICAgLy8gSWYgYW55IG9mIGxpc3QgaXRlbSBpcyB0aWdodCwgbWFyayBsaXN0IGFzIHRpZ2h0XG4gICAgaWYgKCFzdGF0ZS50aWdodCB8fCBwcmV2RW1wdHlFbmQpIHtcbiAgICAgIHRpZ2h0ID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIEl0ZW0gYmVjb21lIGxvb3NlIGlmIGZpbmlzaCB3aXRoIGVtcHR5IGxpbmUsXG4gICAgLy8gYnV0IHdlIHNob3VsZCBmaWx0ZXIgbGFzdCBlbGVtZW50LCBiZWNhdXNlIGl0IG1lYW5zIGxpc3QgZmluaXNoXG4gICAgcHJldkVtcHR5RW5kID0gKHN0YXRlLmxpbmUgLSBzdGFydExpbmUpID4gMSAmJiBzdGF0ZS5pc0VtcHR5KHN0YXRlLmxpbmUgLSAxKTtcblxuICAgIHN0YXRlLmJsa0luZGVudCA9IG9sZEluZGVudDtcbiAgICBzdGF0ZS50U2hpZnRbc3RhcnRMaW5lXSA9IG9sZFRTaGlmdDtcbiAgICBzdGF0ZS50aWdodCA9IG9sZFRpZ2h0O1xuICAgIHN0YXRlLnBhcmVudFR5cGUgPSBvbGRQYXJlbnRUeXBlO1xuXG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2xpc3RfaXRlbV9jbG9zZScsXG4gICAgICBsZXZlbDogLS1zdGF0ZS5sZXZlbFxuICAgIH0pO1xuXG4gICAgbmV4dExpbmUgPSBzdGFydExpbmUgPSBzdGF0ZS5saW5lO1xuICAgIGl0ZW1MaW5lc1sxXSA9IG5leHRMaW5lO1xuICAgIGNvbnRlbnRTdGFydCA9IHN0YXRlLmJNYXJrc1tzdGFydExpbmVdO1xuXG4gICAgaWYgKG5leHRMaW5lID49IGVuZExpbmUpIHsgYnJlYWs7IH1cblxuICAgIGlmIChzdGF0ZS5pc0VtcHR5KG5leHRMaW5lKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBUcnkgdG8gY2hlY2sgaWYgbGlzdCBpcyB0ZXJtaW5hdGVkIG9yIGNvbnRpbnVlZC5cbiAgICAvL1xuICAgIGlmIChzdGF0ZS50U2hpZnRbbmV4dExpbmVdIDwgc3RhdGUuYmxrSW5kZW50KSB7IGJyZWFrOyB9XG5cbiAgICAvLyBmYWlsIGlmIHRlcm1pbmF0aW5nIGJsb2NrIGZvdW5kXG4gICAgdGVybWluYXRlID0gZmFsc2U7XG4gICAgZm9yIChpID0gMCwgbCA9IHRlcm1pbmF0b3JSdWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0ZXJtaW5hdG9yUnVsZXNbaV0oc3RhdGUsIG5leHRMaW5lLCBlbmRMaW5lLCB0cnVlKSkge1xuICAgICAgICB0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRlcm1pbmF0ZSkgeyBicmVhazsgfVxuXG4gICAgLy8gZmFpbCBpZiBsaXN0IGhhcyBhbm90aGVyIHR5cGVcbiAgICBpZiAoaXNPcmRlcmVkKSB7XG4gICAgICBwb3NBZnRlck1hcmtlciA9IHNraXBPcmRlcmVkTGlzdE1hcmtlcihzdGF0ZSwgbmV4dExpbmUpO1xuICAgICAgaWYgKHBvc0FmdGVyTWFya2VyIDwgMCkgeyBicmVhazsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3NBZnRlck1hcmtlciA9IHNraXBCdWxsZXRMaXN0TWFya2VyKHN0YXRlLCBuZXh0TGluZSk7XG4gICAgICBpZiAocG9zQWZ0ZXJNYXJrZXIgPCAwKSB7IGJyZWFrOyB9XG4gICAgfVxuXG4gICAgaWYgKG1hcmtlckNoYXJDb2RlICE9PSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3NBZnRlck1hcmtlciAtIDEpKSB7IGJyZWFrOyB9XG4gIH1cblxuICAvLyBGaW5pbGl6ZSBsaXN0XG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiBpc09yZGVyZWQgPyAnb3JkZXJlZF9saXN0X2Nsb3NlJyA6ICdidWxsZXRfbGlzdF9jbG9zZScsXG4gICAgbGV2ZWw6IC0tc3RhdGUubGV2ZWxcbiAgfSk7XG4gIGxpc3RMaW5lc1sxXSA9IG5leHRMaW5lO1xuXG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcblxuICAvLyBtYXJrIHBhcmFncmFwaHMgdGlnaHQgaWYgbmVlZGVkXG4gIGlmICh0aWdodCkge1xuICAgIG1hcmtUaWdodFBhcmFncmFwaHMoc3RhdGUsIGxpc3RUb2tJZHgpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUGFyYWdyYXBoXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcmFncmFwaChzdGF0ZSwgc3RhcnRMaW5lLyosIGVuZExpbmUqLykge1xuICB2YXIgZW5kTGluZSwgY29udGVudCwgdGVybWluYXRlLCBpLCBsLFxuICAgICAgbmV4dExpbmUgPSBzdGFydExpbmUgKyAxLFxuICAgICAgdGVybWluYXRvclJ1bGVzO1xuXG4gIGVuZExpbmUgPSBzdGF0ZS5saW5lTWF4O1xuXG4gIC8vIGp1bXAgbGluZS1ieS1saW5lIHVudGlsIGVtcHR5IG9uZSBvciBFT0ZcbiAgaWYgKG5leHRMaW5lIDwgZW5kTGluZSAmJiAhc3RhdGUuaXNFbXB0eShuZXh0TGluZSkpIHtcbiAgICB0ZXJtaW5hdG9yUnVsZXMgPSBzdGF0ZS5wYXJzZXIucnVsZXIuZ2V0UnVsZXMoJ3BhcmFncmFwaCcpO1xuXG4gICAgZm9yICg7IG5leHRMaW5lIDwgZW5kTGluZSAmJiAhc3RhdGUuaXNFbXB0eShuZXh0TGluZSk7IG5leHRMaW5lKyspIHtcbiAgICAgIC8vIHRoaXMgd291bGQgYmUgYSBjb2RlIGJsb2NrIG5vcm1hbGx5LCBidXQgYWZ0ZXIgcGFyYWdyYXBoXG4gICAgICAvLyBpdCdzIGNvbnNpZGVyZWQgYSBsYXp5IGNvbnRpbnVhdGlvbiByZWdhcmRsZXNzIG9mIHdoYXQncyB0aGVyZVxuICAgICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gLSBzdGF0ZS5ibGtJbmRlbnQgPiAzKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIC8vIFNvbWUgdGFncyBjYW4gdGVybWluYXRlIHBhcmFncmFwaCB3aXRob3V0IGVtcHR5IGxpbmUuXG4gICAgICB0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICAgIGZvciAoaSA9IDAsIGwgPSB0ZXJtaW5hdG9yUnVsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmICh0ZXJtaW5hdG9yUnVsZXNbaV0oc3RhdGUsIG5leHRMaW5lLCBlbmRMaW5lLCB0cnVlKSkge1xuICAgICAgICAgIHRlcm1pbmF0ZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0ZXJtaW5hdGUpIHsgYnJlYWs7IH1cbiAgICB9XG4gIH1cblxuICBjb250ZW50ID0gc3RhdGUuZ2V0TGluZXMoc3RhcnRMaW5lLCBuZXh0TGluZSwgc3RhdGUuYmxrSW5kZW50LCBmYWxzZSkudHJpbSgpO1xuXG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcbiAgaWYgKGNvbnRlbnQubGVuZ3RoKSB7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ3BhcmFncmFwaF9vcGVuJyxcbiAgICAgIHRpZ2h0OiBmYWxzZSxcbiAgICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsICsgMSxcbiAgICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhdGUubGluZSBdLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ3BhcmFncmFwaF9jbG9zZScsXG4gICAgICB0aWdodDogZmFsc2UsXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFBhcnNlciBzdGF0ZSBjbGFzc1xuXG4ndXNlIHN0cmljdCc7XG5cblxuZnVuY3Rpb24gU3RhdGVCbG9jayhzcmMsIHBhcnNlciwgb3B0aW9ucywgZW52LCB0b2tlbnMpIHtcbiAgdmFyIGNoLCBzLCBzdGFydCwgcG9zLCBsZW4sIGluZGVudCwgaW5kZW50X2ZvdW5kO1xuXG4gIHRoaXMuc3JjID0gc3JjO1xuXG4gIC8vIFNob3J0Y3V0cyB0byBzaW1wbGlmeSBuZXN0ZWQgY2FsbHNcbiAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICB0aGlzLmVudiA9IGVudjtcblxuICAvL1xuICAvLyBJbnRlcm5hbCBzdGF0ZSB2YXJ0aWFibGVzXG4gIC8vXG5cbiAgdGhpcy50b2tlbnMgPSB0b2tlbnM7XG5cbiAgdGhpcy5iTWFya3MgPSBbXTsgIC8vIGxpbmUgYmVnaW4gb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLmVNYXJrcyA9IFtdOyAgLy8gbGluZSBlbmQgb2Zmc2V0cyBmb3IgZmFzdCBqdW1wc1xuICB0aGlzLnRTaGlmdCA9IFtdOyAgLy8gaW5kZW50IGZvciBlYWNoIGxpbmVcblxuICAvLyBibG9jayBwYXJzZXIgdmFyaWFibGVzXG4gIHRoaXMuYmxrSW5kZW50ICA9IDA7IC8vIHJlcXVpcmVkIGJsb2NrIGNvbnRlbnQgaW5kZW50XG4gICAgICAgICAgICAgICAgICAgICAgIC8vIChmb3IgZXhhbXBsZSwgaWYgd2UgYXJlIGluIGxpc3QpXG4gIHRoaXMubGluZSAgICAgICA9IDA7IC8vIGxpbmUgaW5kZXggaW4gc3JjXG4gIHRoaXMubGluZU1heCAgICA9IDA7IC8vIGxpbmVzIGNvdW50XG4gIHRoaXMudGlnaHQgICAgICA9IGZhbHNlOyAgLy8gbG9vc2UvdGlnaHQgbW9kZSBmb3IgbGlzdHNcbiAgdGhpcy5wYXJlbnRUeXBlID0gJ3Jvb3QnOyAvLyBpZiBgbGlzdGAsIGJsb2NrIHBhcnNlciBzdG9wcyBvbiB0d28gbmV3bGluZXNcbiAgdGhpcy5kZEluZGVudCAgID0gLTE7IC8vIGluZGVudCBvZiB0aGUgY3VycmVudCBkZCBibG9jayAoLTEgaWYgdGhlcmUgaXNuJ3QgYW55KVxuXG4gIHRoaXMubGV2ZWwgPSAwO1xuXG4gIC8vIHJlbmRlcmVyXG4gIHRoaXMucmVzdWx0ID0gJyc7XG5cbiAgLy8gQ3JlYXRlIGNhY2hlc1xuICAvLyBHZW5lcmF0ZSBtYXJrZXJzLlxuICBzID0gdGhpcy5zcmM7XG4gIGluZGVudCA9IDA7XG4gIGluZGVudF9mb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoc3RhcnQgPSBwb3MgPSBpbmRlbnQgPSAwLCBsZW4gPSBzLmxlbmd0aDsgcG9zIDwgbGVuOyBwb3MrKykge1xuICAgIGNoID0gcy5jaGFyQ29kZUF0KHBvcyk7XG5cbiAgICBpZiAoIWluZGVudF9mb3VuZCkge1xuICAgICAgaWYgKGNoID09PSAweDIwLyogc3BhY2UgKi8pIHtcbiAgICAgICAgaW5kZW50Kys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZW50X2ZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2ggPT09IDB4MEEgfHwgcG9zID09PSBsZW4gLSAxKSB7XG4gICAgICBpZiAoY2ggIT09IDB4MEEpIHsgcG9zKys7IH1cbiAgICAgIHRoaXMuYk1hcmtzLnB1c2goc3RhcnQpO1xuICAgICAgdGhpcy5lTWFya3MucHVzaChwb3MpO1xuICAgICAgdGhpcy50U2hpZnQucHVzaChpbmRlbnQpO1xuXG4gICAgICBpbmRlbnRfZm91bmQgPSBmYWxzZTtcbiAgICAgIGluZGVudCA9IDA7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgLy8gUHVzaCBmYWtlIGVudHJ5IHRvIHNpbXBsaWZ5IGNhY2hlIGJvdW5kcyBjaGVja3NcbiAgdGhpcy5iTWFya3MucHVzaChzLmxlbmd0aCk7XG4gIHRoaXMuZU1hcmtzLnB1c2gocy5sZW5ndGgpO1xuICB0aGlzLnRTaGlmdC5wdXNoKDApO1xuXG4gIHRoaXMubGluZU1heCA9IHRoaXMuYk1hcmtzLmxlbmd0aCAtIDE7IC8vIGRvbid0IGNvdW50IGxhc3QgZmFrZSBsaW5lXG59XG5cblN0YXRlQmxvY2sucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiBpc0VtcHR5KGxpbmUpIHtcbiAgcmV0dXJuIHRoaXMuYk1hcmtzW2xpbmVdICsgdGhpcy50U2hpZnRbbGluZV0gPj0gdGhpcy5lTWFya3NbbGluZV07XG59O1xuXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5za2lwRW1wdHlMaW5lcyA9IGZ1bmN0aW9uIHNraXBFbXB0eUxpbmVzKGZyb20pIHtcbiAgZm9yICh2YXIgbWF4ID0gdGhpcy5saW5lTWF4OyBmcm9tIDwgbWF4OyBmcm9tKyspIHtcbiAgICBpZiAodGhpcy5iTWFya3NbZnJvbV0gKyB0aGlzLnRTaGlmdFtmcm9tXSA8IHRoaXMuZU1hcmtzW2Zyb21dKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZyb207XG59O1xuXG4vLyBTa2lwIHNwYWNlcyBmcm9tIGdpdmVuIHBvc2l0aW9uLlxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcFNwYWNlcyA9IGZ1bmN0aW9uIHNraXBTcGFjZXMocG9zKSB7XG4gIGZvciAodmFyIG1heCA9IHRoaXMuc3JjLmxlbmd0aDsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGlmICh0aGlzLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MjAvKiBzcGFjZSAqLykgeyBicmVhazsgfVxuICB9XG4gIHJldHVybiBwb3M7XG59O1xuXG4vLyBTa2lwIGNoYXIgY29kZXMgZnJvbSBnaXZlbiBwb3NpdGlvblxuU3RhdGVCbG9jay5wcm90b3R5cGUuc2tpcENoYXJzID0gZnVuY3Rpb24gc2tpcENoYXJzKHBvcywgY29kZSkge1xuICBmb3IgKHZhciBtYXggPSB0aGlzLnNyYy5sZW5ndGg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBpZiAodGhpcy5zcmMuY2hhckNvZGVBdChwb3MpICE9PSBjb2RlKSB7IGJyZWFrOyB9XG4gIH1cbiAgcmV0dXJuIHBvcztcbn07XG5cbi8vIFNraXAgY2hhciBjb2RlcyByZXZlcnNlIGZyb20gZ2l2ZW4gcG9zaXRpb24gLSAxXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5za2lwQ2hhcnNCYWNrID0gZnVuY3Rpb24gc2tpcENoYXJzQmFjayhwb3MsIGNvZGUsIG1pbikge1xuICBpZiAocG9zIDw9IG1pbikgeyByZXR1cm4gcG9zOyB9XG5cbiAgd2hpbGUgKHBvcyA+IG1pbikge1xuICAgIGlmIChjb2RlICE9PSB0aGlzLnNyYy5jaGFyQ29kZUF0KC0tcG9zKSkgeyByZXR1cm4gcG9zICsgMTsgfVxuICB9XG4gIHJldHVybiBwb3M7XG59O1xuXG4vLyBjdXQgbGluZXMgcmFuZ2UgZnJvbSBzb3VyY2UuXG5TdGF0ZUJsb2NrLnByb3RvdHlwZS5nZXRMaW5lcyA9IGZ1bmN0aW9uIGdldExpbmVzKGJlZ2luLCBlbmQsIGluZGVudCwga2VlcExhc3RMRikge1xuICB2YXIgaSwgZmlyc3QsIGxhc3QsIHF1ZXVlLCBzaGlmdCxcbiAgICAgIGxpbmUgPSBiZWdpbjtcblxuICBpZiAoYmVnaW4gPj0gZW5kKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLy8gT3B0OiBkb24ndCB1c2UgcHVzaCBxdWV1ZSBmb3Igc2luZ2xlIGxpbmU7XG4gIGlmIChsaW5lICsgMSA9PT0gZW5kKSB7XG4gICAgZmlyc3QgPSB0aGlzLmJNYXJrc1tsaW5lXSArIE1hdGgubWluKHRoaXMudFNoaWZ0W2xpbmVdLCBpbmRlbnQpO1xuICAgIGxhc3QgPSBrZWVwTGFzdExGID8gdGhpcy5iTWFya3NbZW5kXSA6IHRoaXMuZU1hcmtzW2VuZCAtIDFdO1xuICAgIHJldHVybiB0aGlzLnNyYy5zbGljZShmaXJzdCwgbGFzdCk7XG4gIH1cblxuICBxdWV1ZSA9IG5ldyBBcnJheShlbmQgLSBiZWdpbik7XG5cbiAgZm9yIChpID0gMDsgbGluZSA8IGVuZDsgbGluZSsrLCBpKyspIHtcbiAgICBzaGlmdCA9IHRoaXMudFNoaWZ0W2xpbmVdO1xuICAgIGlmIChzaGlmdCA+IGluZGVudCkgeyBzaGlmdCA9IGluZGVudDsgfVxuICAgIGlmIChzaGlmdCA8IDApIHsgc2hpZnQgPSAwOyB9XG5cbiAgICBmaXJzdCA9IHRoaXMuYk1hcmtzW2xpbmVdICsgc2hpZnQ7XG5cbiAgICBpZiAobGluZSArIDEgPCBlbmQgfHwga2VlcExhc3RMRikge1xuICAgICAgLy8gTm8gbmVlZCBmb3IgYm91bmRzIGNoZWNrIGJlY2F1c2Ugd2UgaGF2ZSBmYWtlIGVudHJ5IG9uIHRhaWwuXG4gICAgICBsYXN0ID0gdGhpcy5lTWFya3NbbGluZV0gKyAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0ID0gdGhpcy5lTWFya3NbbGluZV07XG4gICAgfVxuXG4gICAgcXVldWVbaV0gPSB0aGlzLnNyYy5zbGljZShmaXJzdCwgbGFzdCk7XG4gIH1cblxuICByZXR1cm4gcXVldWUuam9pbignJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVCbG9jaztcbiIsIi8vIEdGTSB0YWJsZSwgbm9uLXN0YW5kYXJkXG5cbid1c2Ugc3RyaWN0JztcblxuXG5mdW5jdGlvbiBnZXRMaW5lKHN0YXRlLCBsaW5lKSB7XG4gIHZhciBwb3MgPSBzdGF0ZS5iTWFya3NbbGluZV0gKyBzdGF0ZS5ibGtJbmRlbnQsXG4gICAgICBtYXggPSBzdGF0ZS5lTWFya3NbbGluZV07XG5cbiAgcmV0dXJuIHN0YXRlLnNyYy5zdWJzdHIocG9zLCBtYXggLSBwb3MpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGFibGUoc3RhdGUsIHN0YXJ0TGluZSwgZW5kTGluZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbGluZVRleHQsIHBvcywgaSwgbmV4dExpbmUsIHJvd3MsXG4gICAgICBhbGlnbnMsIHQsIHRhYmxlTGluZXMsIHRib2R5TGluZXM7XG5cbiAgLy8gc2hvdWxkIGhhdmUgYXQgbGVhc3QgdGhyZWUgbGluZXNcbiAgaWYgKHN0YXJ0TGluZSArIDIgPiBlbmRMaW5lKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIG5leHRMaW5lID0gc3RhcnRMaW5lICsgMTtcblxuICBpZiAoc3RhdGUudFNoaWZ0W25leHRMaW5lXSA8IHN0YXRlLmJsa0luZGVudCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHNlY29uZCBsaW5lIHNob3VsZCBiZSAnfCcgb3IgJy0nXG5cbiAgcG9zID0gc3RhdGUuYk1hcmtzW25leHRMaW5lXSArIHN0YXRlLnRTaGlmdFtuZXh0TGluZV07XG4gIGlmIChwb3MgPj0gc3RhdGUuZU1hcmtzW25leHRMaW5lXSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBjaCA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gIGlmIChjaCAhPT0gMHg3Qy8qIHwgKi8gJiYgY2ggIT09IDB4MkQvKiAtICovICYmIGNoICE9PSAweDNBLyogOiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsaW5lVGV4dCA9IGdldExpbmUoc3RhdGUsIHN0YXJ0TGluZSArIDEpO1xuICBpZiAoIS9eWy06fCBdKyQvLnRlc3QobGluZVRleHQpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJvd3MgPSBsaW5lVGV4dC5zcGxpdCgnfCcpO1xuICBpZiAocm93cyA8PSAyKSB7IHJldHVybiBmYWxzZTsgfVxuICBhbGlnbnMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICB0ID0gcm93c1tpXS50cmltKCk7XG4gICAgaWYgKCF0KSB7XG4gICAgICAvLyBhbGxvdyBlbXB0eSBjb2x1bW5zIGJlZm9yZSBhbmQgYWZ0ZXIgdGFibGUsIGJ1dCBub3QgaW4gYmV0d2VlbiBjb2x1bW5zO1xuICAgICAgLy8gZS5nLiBhbGxvdyBgIHwtLS18IGAsIGRpc2FsbG93IGAgLS0tfHwtLS0gYFxuICAgICAgaWYgKGkgPT09IDAgfHwgaSA9PT0gcm93cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghL146Py0rOj8kLy50ZXN0KHQpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICh0LmNoYXJDb2RlQXQodC5sZW5ndGggLSAxKSA9PT0gMHgzQS8qIDogKi8pIHtcbiAgICAgIGFsaWducy5wdXNoKHQuY2hhckNvZGVBdCgwKSA9PT0gMHgzQS8qIDogKi8gPyAnY2VudGVyJyA6ICdyaWdodCcpO1xuICAgIH0gZWxzZSBpZiAodC5jaGFyQ29kZUF0KDApID09PSAweDNBLyogOiAqLykge1xuICAgICAgYWxpZ25zLnB1c2goJ2xlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxpZ25zLnB1c2goJycpO1xuICAgIH1cbiAgfVxuXG4gIGxpbmVUZXh0ID0gZ2V0TGluZShzdGF0ZSwgc3RhcnRMaW5lKS50cmltKCk7XG4gIGlmIChsaW5lVGV4dC5pbmRleE9mKCd8JykgPT09IC0xKSB7IHJldHVybiBmYWxzZTsgfVxuICByb3dzID0gbGluZVRleHQucmVwbGFjZSgvXlxcfHxcXHwkL2csICcnKS5zcGxpdCgnfCcpO1xuICBpZiAoYWxpZ25zLmxlbmd0aCAhPT0gcm93cy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIHRydWU7IH1cblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3RhYmxlX29wZW4nLFxuICAgIGxpbmVzOiB0YWJsZUxpbmVzID0gWyBzdGFydExpbmUsIDAgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICd0aGVhZF9vcGVuJyxcbiAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ3RyX29wZW4nLFxuICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhcnRMaW5lICsgMSBdLFxuICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gIH0pO1xuICBmb3IgKGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICAgIHR5cGU6ICd0aF9vcGVuJyxcbiAgICAgIGFsaWduOiBhbGlnbnNbaV0sXG4gICAgICBsaW5lczogWyBzdGFydExpbmUsIHN0YXJ0TGluZSArIDEgXSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbCsrXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiByb3dzW2ldLnRyaW0oKSxcbiAgICAgIGxpbmVzOiBbIHN0YXJ0TGluZSwgc3RhcnRMaW5lICsgMSBdLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsLFxuICAgICAgY2hpbGRyZW46IFtdXG4gICAgfSk7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGhfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgfVxuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0cl9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0aGVhZF9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuXG4gIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICB0eXBlOiAndGJvZHlfb3BlbicsXG4gICAgbGluZXM6IHRib2R5TGluZXMgPSBbIHN0YXJ0TGluZSArIDIsIDAgXSxcbiAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICB9KTtcblxuICBmb3IgKG5leHRMaW5lID0gc3RhcnRMaW5lICsgMjsgbmV4dExpbmUgPCBlbmRMaW5lOyBuZXh0TGluZSsrKSB7XG4gICAgaWYgKHN0YXRlLnRTaGlmdFtuZXh0TGluZV0gPCBzdGF0ZS5ibGtJbmRlbnQpIHsgYnJlYWs7IH1cblxuICAgIGxpbmVUZXh0ID0gZ2V0TGluZShzdGF0ZSwgbmV4dExpbmUpLnRyaW0oKTtcbiAgICBpZiAobGluZVRleHQuaW5kZXhPZignfCcpID09PSAtMSkgeyBicmVhazsgfVxuICAgIHJvd3MgPSBsaW5lVGV4dC5yZXBsYWNlKC9eXFx8fFxcfCQvZywgJycpLnNwbGl0KCd8Jyk7XG5cbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0cl9vcGVuJywgbGV2ZWw6IHN0YXRlLmxldmVsKysgfSk7XG4gICAgZm9yIChpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXRlLnRva2Vucy5wdXNoKHsgdHlwZTogJ3RkX29wZW4nLCBhbGlnbjogYWxpZ25zW2ldLCBsZXZlbDogc3RhdGUubGV2ZWwrKyB9KTtcbiAgICAgIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICAgIGNvbnRlbnQ6IHJvd3NbaV0ucmVwbGFjZSgvXlxcfD8gKnwgKlxcfD8kL2csICcnKSxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsLFxuICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgIH0pO1xuICAgICAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndGRfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgICB9XG4gICAgc3RhdGUudG9rZW5zLnB1c2goeyB0eXBlOiAndHJfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgfVxuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0Ym9keV9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICBzdGF0ZS50b2tlbnMucHVzaCh7IHR5cGU6ICd0YWJsZV9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuXG4gIHRhYmxlTGluZXNbMV0gPSB0Ym9keUxpbmVzWzFdID0gbmV4dExpbmU7XG4gIHN0YXRlLmxpbmUgPSBuZXh0TGluZTtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUGFyc2UgYWJicmV2aWF0aW9uIGRlZmluaXRpb25zLCBpLmUuIGAqW2FiYnJdOiBkZXNjcmlwdGlvbmBcbi8vXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgU3RhdGVJbmxpbmUgICAgPSByZXF1aXJlKCcuLi9ydWxlc19pbmxpbmUvc3RhdGVfaW5saW5lJyk7XG52YXIgcGFyc2VMaW5rTGFiZWwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfbGFiZWwnKTtcblxuXG5mdW5jdGlvbiBwYXJzZUFiYnIoc3RyLCBwYXJzZXJJbmxpbmUsIG9wdGlvbnMsIGVudikge1xuICB2YXIgc3RhdGUsIGxhYmVsRW5kLCBwb3MsIG1heCwgbGFiZWwsIHRpdGxlO1xuXG4gIGlmIChzdHIuY2hhckNvZGVBdCgwKSAhPT0gMHgyQS8qICogKi8pIHsgcmV0dXJuIC0xOyB9XG4gIGlmIChzdHIuY2hhckNvZGVBdCgxKSAhPT0gMHg1Qi8qIFsgKi8pIHsgcmV0dXJuIC0xOyB9XG5cbiAgaWYgKHN0ci5pbmRleE9mKCddOicpID09PSAtMSkgeyByZXR1cm4gLTE7IH1cblxuICBzdGF0ZSA9IG5ldyBTdGF0ZUlubGluZShzdHIsIHBhcnNlcklubGluZSwgb3B0aW9ucywgZW52LCBbXSk7XG4gIGxhYmVsRW5kID0gcGFyc2VMaW5rTGFiZWwoc3RhdGUsIDEpO1xuXG4gIGlmIChsYWJlbEVuZCA8IDAgfHwgc3RyLmNoYXJDb2RlQXQobGFiZWxFbmQgKyAxKSAhPT0gMHgzQS8qIDogKi8pIHsgcmV0dXJuIC0xOyB9XG5cbiAgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIC8vIGFiYnIgdGl0bGUgaXMgYWx3YXlzIG9uZSBsaW5lLCBzbyBsb29raW5nIGZvciBlbmRpbmcgXCJcXG5cIiBoZXJlXG4gIGZvciAocG9zID0gbGFiZWxFbmQgKyAyOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgfVxuXG4gIGxhYmVsID0gc3RyLnNsaWNlKDIsIGxhYmVsRW5kKTtcbiAgdGl0bGUgPSBzdHIuc2xpY2UobGFiZWxFbmQgKyAyLCBwb3MpLnRyaW0oKTtcbiAgaWYgKHRpdGxlLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gLTE7IH1cbiAgaWYgKCFlbnYuYWJicmV2aWF0aW9ucykgeyBlbnYuYWJicmV2aWF0aW9ucyA9IHt9OyB9XG4gIC8vIHByZXBlbmQgJzonIHRvIGF2b2lkIGNvbmZsaWN0IHdpdGggT2JqZWN0LnByb3RvdHlwZSBtZW1iZXJzXG4gIGlmICh0eXBlb2YgZW52LmFiYnJldmlhdGlvbnNbJzonICsgbGFiZWxdID09PSAndW5kZWZpbmVkJykge1xuICAgIGVudi5hYmJyZXZpYXRpb25zWyc6JyArIGxhYmVsXSA9IHRpdGxlO1xuICB9XG5cbiAgcmV0dXJuIHBvcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhYmJyKHN0YXRlKSB7XG4gIHZhciB0b2tlbnMgPSBzdGF0ZS50b2tlbnMsIGksIGwsIGNvbnRlbnQsIHBvcztcblxuICBpZiAoc3RhdGUuaW5saW5lTW9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFBhcnNlIGlubGluZXNcbiAgZm9yIChpID0gMSwgbCA9IHRva2Vucy5sZW5ndGggLSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKHRva2Vuc1tpIC0gMV0udHlwZSA9PT0gJ3BhcmFncmFwaF9vcGVuJyAmJlxuICAgICAgICB0b2tlbnNbaV0udHlwZSA9PT0gJ2lubGluZScgJiZcbiAgICAgICAgdG9rZW5zW2kgKyAxXS50eXBlID09PSAncGFyYWdyYXBoX2Nsb3NlJykge1xuXG4gICAgICBjb250ZW50ID0gdG9rZW5zW2ldLmNvbnRlbnQ7XG4gICAgICB3aGlsZSAoY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgcG9zID0gcGFyc2VBYmJyKGNvbnRlbnQsIHN0YXRlLmlubGluZSwgc3RhdGUub3B0aW9ucywgc3RhdGUuZW52KTtcbiAgICAgICAgaWYgKHBvcyA8IDApIHsgYnJlYWs7IH1cbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UocG9zKS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIHRva2Vuc1tpXS5jb250ZW50ID0gY29udGVudDtcbiAgICAgIGlmICghY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgdG9rZW5zW2kgLSAxXS50aWdodCA9IHRydWU7XG4gICAgICAgIHRva2Vuc1tpICsgMV0udGlnaHQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIi8vIEVuY2xvc2UgYWJicmV2aWF0aW9ucyBpbiA8YWJicj4gdGFnc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgUFVOQ1RfQ0hBUlMgPSAnIFxcbigpW11cXCdcIi4sIT8tJztcblxuXG4vLyBmcm9tIEdvb2dsZSBjbG9zdXJlIGxpYnJhcnlcbi8vIGh0dHA6Ly9jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0LWhpc3RvcnkvZG9jcy9sb2NhbF9jbG9zdXJlX2dvb2dfc3RyaW5nX3N0cmluZy5qcy5zb3VyY2UuaHRtbCNsaW5lMTAyMVxuZnVuY3Rpb24gcmVnRXNjYXBlKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvKFstKClcXFtcXF17fSs/Ki4kXFxefCw6IzwhXFxcXF0pL2csICdcXFxcJDEnKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFiYnIyKHN0YXRlKSB7XG4gIHZhciBpLCBqLCBsLCB0b2tlbnMsIHRva2VuLCB0ZXh0LCBub2RlcywgcG9zLCBsZXZlbCwgcmVnLCBtLCByZWdUZXh0LFxuICAgICAgYmxvY2tUb2tlbnMgPSBzdGF0ZS50b2tlbnM7XG5cbiAgaWYgKCFzdGF0ZS5lbnYuYWJicmV2aWF0aW9ucykgeyByZXR1cm47IH1cbiAgaWYgKCFzdGF0ZS5lbnYuYWJiclJlZ0V4cCkge1xuICAgIHJlZ1RleHQgPSAnKF58WycgKyBQVU5DVF9DSEFSUy5zcGxpdCgnJykubWFwKHJlZ0VzY2FwZSkuam9pbignJykgKyAnXSknXG4gICAgICAgICAgICArICcoJyArIE9iamVjdC5rZXlzKHN0YXRlLmVudi5hYmJyZXZpYXRpb25zKS5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfSkubWFwKHJlZ0VzY2FwZSkuam9pbignfCcpICsgJyknXG4gICAgICAgICAgICArICcoJHxbJyArIFBVTkNUX0NIQVJTLnNwbGl0KCcnKS5tYXAocmVnRXNjYXBlKS5qb2luKCcnKSArICddKSc7XG4gICAgc3RhdGUuZW52LmFiYnJSZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ1RleHQsICdnJyk7XG4gIH1cbiAgcmVnID0gc3RhdGUuZW52LmFiYnJSZWdFeHA7XG5cbiAgZm9yIChqID0gMCwgbCA9IGJsb2NrVG9rZW5zLmxlbmd0aDsgaiA8IGw7IGorKykge1xuICAgIGlmIChibG9ja1Rva2Vuc1tqXS50eXBlICE9PSAnaW5saW5lJykgeyBjb250aW51ZTsgfVxuICAgIHRva2VucyA9IGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuO1xuXG4gICAgLy8gV2Ugc2NhbiBmcm9tIHRoZSBlbmQsIHRvIGtlZXAgcG9zaXRpb24gd2hlbiBuZXcgdGFncyBhZGRlZC5cbiAgICBmb3IgKGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICd0ZXh0JykgeyBjb250aW51ZTsgfVxuXG4gICAgICBwb3MgPSAwO1xuICAgICAgdGV4dCA9IHRva2VuLmNvbnRlbnQ7XG4gICAgICByZWcubGFzdEluZGV4ID0gMDtcbiAgICAgIGxldmVsID0gdG9rZW4ubGV2ZWw7XG4gICAgICBub2RlcyA9IFtdO1xuXG4gICAgICB3aGlsZSAoKG0gPSByZWcuZXhlYyh0ZXh0KSkpIHtcbiAgICAgICAgaWYgKHJlZy5sYXN0SW5kZXggPiBwb3MpIHtcbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRleHQuc2xpY2UocG9zLCBtLmluZGV4ICsgbVsxXS5sZW5ndGgpLFxuICAgICAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnYWJicl9vcGVuJyxcbiAgICAgICAgICB0aXRsZTogc3RhdGUuZW52LmFiYnJldmlhdGlvbnNbJzonICsgbVsyXV0sXG4gICAgICAgICAgbGV2ZWw6IGxldmVsKytcbiAgICAgICAgfSk7XG4gICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICBjb250ZW50OiBtWzJdLFxuICAgICAgICAgIGxldmVsOiBsZXZlbFxuICAgICAgICB9KTtcbiAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2FiYnJfY2xvc2UnLFxuICAgICAgICAgIGxldmVsOiAtLWxldmVsXG4gICAgICAgIH0pO1xuICAgICAgICBwb3MgPSByZWcubGFzdEluZGV4IC0gbVszXS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmICghbm9kZXMubGVuZ3RoKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGlmIChwb3MgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgY29udGVudDogdGV4dC5zbGljZShwb3MpLFxuICAgICAgICAgIGxldmVsOiBsZXZlbFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVwbGFjZSBjdXJyZW50IG5vZGVcbiAgICAgIGJsb2NrVG9rZW5zW2pdLmNoaWxkcmVuID0gdG9rZW5zID0gW10uY29uY2F0KHRva2Vucy5zbGljZSgwLCBpKSwgbm9kZXMsIHRva2Vucy5zbGljZShpICsgMSkpO1xuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBibG9jayhzdGF0ZSkge1xuXG4gIGlmIChzdGF0ZS5pbmxpbmVNb2RlKSB7XG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICBjb250ZW50OiBzdGF0ZS5zcmMucmVwbGFjZSgvXFxuL2csICcgJykudHJpbSgpLFxuICAgICAgbGV2ZWw6IDAsXG4gICAgICBsaW5lczogWyAwLCAxIF0sXG4gICAgICBjaGlsZHJlbjogW11cbiAgICB9KTtcblxuICB9IGVsc2Uge1xuICAgIHN0YXRlLmJsb2NrLnBhcnNlKHN0YXRlLnNyYywgc3RhdGUub3B0aW9ucywgc3RhdGUuZW52LCBzdGF0ZS50b2tlbnMpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9vdG5vdGVfYmxvY2soc3RhdGUpIHtcbiAgdmFyIGksIGwsIGosIHQsIGxhc3RQYXJhZ3JhcGgsIGxpc3QsIHRva2VucywgY3VycmVudCwgY3VycmVudExhYmVsLFxuICAgICAgbGV2ZWwgPSAwLFxuICAgICAgaW5zaWRlUmVmID0gZmFsc2UsXG4gICAgICByZWZUb2tlbnMgPSB7fTtcblxuICBpZiAoIXN0YXRlLmVudi5mb290bm90ZXMpIHsgcmV0dXJuOyB9XG5cbiAgc3RhdGUudG9rZW5zID0gc3RhdGUudG9rZW5zLmZpbHRlcihmdW5jdGlvbih0b2spIHtcbiAgICBpZiAodG9rLnR5cGUgPT09ICdmb290bm90ZV9yZWZlcmVuY2Vfb3BlbicpIHtcbiAgICAgIGluc2lkZVJlZiA9IHRydWU7XG4gICAgICBjdXJyZW50ID0gW107XG4gICAgICBjdXJyZW50TGFiZWwgPSB0b2subGFiZWw7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0b2sudHlwZSA9PT0gJ2Zvb3Rub3RlX3JlZmVyZW5jZV9jbG9zZScpIHtcbiAgICAgIGluc2lkZVJlZiA9IGZhbHNlO1xuICAgICAgLy8gcHJlcGVuZCAnOicgdG8gYXZvaWQgY29uZmxpY3Qgd2l0aCBPYmplY3QucHJvdG90eXBlIG1lbWJlcnNcbiAgICAgIHJlZlRva2Vuc1snOicgKyBjdXJyZW50TGFiZWxdID0gY3VycmVudDtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGluc2lkZVJlZikgeyBjdXJyZW50LnB1c2godG9rKTsgfVxuICAgIHJldHVybiAhaW5zaWRlUmVmO1xuICB9KTtcblxuICBpZiAoIXN0YXRlLmVudi5mb290bm90ZXMubGlzdCkgeyByZXR1cm47IH1cbiAgbGlzdCA9IHN0YXRlLmVudi5mb290bm90ZXMubGlzdDtcblxuICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgdHlwZTogJ2Zvb3Rub3RlX2Jsb2NrX29wZW4nLFxuICAgIGxldmVsOiBsZXZlbCsrXG4gIH0pO1xuICBmb3IgKGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBzdGF0ZS50b2tlbnMucHVzaCh7XG4gICAgICB0eXBlOiAnZm9vdG5vdGVfb3BlbicsXG4gICAgICBpZDogaSxcbiAgICAgIGxldmVsOiBsZXZlbCsrXG4gICAgfSk7XG5cbiAgICBpZiAobGlzdFtpXS50b2tlbnMpIHtcbiAgICAgIHRva2VucyA9IFtdO1xuICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAncGFyYWdyYXBoX29wZW4nLFxuICAgICAgICB0aWdodDogZmFsc2UsXG4gICAgICAgIGxldmVsOiBsZXZlbCsrXG4gICAgICB9KTtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2lubGluZScsXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICBsZXZlbDogbGV2ZWwsXG4gICAgICAgIGNoaWxkcmVuOiBsaXN0W2ldLnRva2Vuc1xuICAgICAgfSk7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGhfY2xvc2UnLFxuICAgICAgICB0aWdodDogZmFsc2UsXG4gICAgICAgIGxldmVsOiAtLWxldmVsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGxpc3RbaV0ubGFiZWwpIHtcbiAgICAgIHRva2VucyA9IHJlZlRva2Vuc1snOicgKyBsaXN0W2ldLmxhYmVsXTtcbiAgICB9XG5cbiAgICBzdGF0ZS50b2tlbnMgPSBzdGF0ZS50b2tlbnMuY29uY2F0KHRva2Vucyk7XG4gICAgaWYgKHN0YXRlLnRva2Vuc1tzdGF0ZS50b2tlbnMubGVuZ3RoIC0gMV0udHlwZSA9PT0gJ3BhcmFncmFwaF9jbG9zZScpIHtcbiAgICAgIGxhc3RQYXJhZ3JhcGggPSBzdGF0ZS50b2tlbnMucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3RQYXJhZ3JhcGggPSBudWxsO1xuICAgIH1cblxuICAgIHQgPSBsaXN0W2ldLmNvdW50ID4gMCA/IGxpc3RbaV0uY291bnQgOiAxO1xuICAgIGZvciAoaiA9IDA7IGogPCB0OyBqKyspIHtcbiAgICAgIHN0YXRlLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Zvb3Rub3RlX2FuY2hvcicsXG4gICAgICAgIGlkOiBpLFxuICAgICAgICBzdWJJZDogaixcbiAgICAgICAgbGV2ZWw6IGxldmVsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAobGFzdFBhcmFncmFwaCkge1xuICAgICAgc3RhdGUudG9rZW5zLnB1c2gobGFzdFBhcmFncmFwaCk7XG4gICAgfVxuXG4gICAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgICAgdHlwZTogJ2Zvb3Rub3RlX2Nsb3NlJyxcbiAgICAgIGxldmVsOiAtLWxldmVsXG4gICAgfSk7XG4gIH1cbiAgc3RhdGUudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICdmb290bm90ZV9ibG9ja19jbG9zZScsXG4gICAgbGV2ZWw6IC0tbGV2ZWxcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlubGluZShzdGF0ZSkge1xuICB2YXIgdG9rZW5zID0gc3RhdGUudG9rZW5zLCB0b2ssIGksIGw7XG5cbiAgLy8gUGFyc2UgaW5saW5lc1xuICBmb3IgKGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHRvayA9IHRva2Vuc1tpXTtcbiAgICBpZiAodG9rLnR5cGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICBzdGF0ZS5pbmxpbmUucGFyc2UodG9rLmNvbnRlbnQsIHN0YXRlLm9wdGlvbnMsIHN0YXRlLmVudiwgdG9rLmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn07XG4iLCIvLyBSZXBsYWNlIGxpbmstbGlrZSB0ZXh0cyB3aXRoIGxpbmsgbm9kZXMuXG4vL1xuLy8gQ3VycmVudGx5IHJlc3RyaWN0ZWQgYnkgYGlubGluZS52YWxpZGF0ZUxpbmsoKWAgdG8gaHR0cC9odHRwcy9mdHBcbi8vXG4ndXNlIHN0cmljdCc7XG5cblxudmFyIEF1dG9saW5rZXIgPSByZXF1aXJlKCdhdXRvbGlua2VyJyk7XG5cblxudmFyIExJTktfU0NBTl9SRSA9IC93d3d8QHxcXDpcXC9cXC8vO1xuXG5cbmZ1bmN0aW9uIGlzTGlua09wZW4oc3RyKSB7XG4gIHJldHVybiAvXjxhWz5cXHNdL2kudGVzdChzdHIpO1xufVxuZnVuY3Rpb24gaXNMaW5rQ2xvc2Uoc3RyKSB7XG4gIHJldHVybiAvXjxcXC9hXFxzKj4vaS50ZXN0KHN0cik7XG59XG5cbi8vIFN0dXBpZCBmYWJyaWMgdG8gYXZvaWQgc2luZ2xldG9ucywgZm9yIHRocmVhZCBzYWZldHkuXG4vLyBSZXF1aXJlZCBmb3IgZW5naW5lcyBsaWtlIE5hc2hvcm4uXG4vL1xuZnVuY3Rpb24gY3JlYXRlTGlua2lmaWVyKCkge1xuICB2YXIgbGlua3MgPSBbXTtcbiAgdmFyIGF1dG9saW5rZXIgPSBuZXcgQXV0b2xpbmtlcih7XG4gICAgc3RyaXBQcmVmaXg6IGZhbHNlLFxuICAgIHVybDogdHJ1ZSxcbiAgICBlbWFpbDogdHJ1ZSxcbiAgICB0d2l0dGVyOiBmYWxzZSxcbiAgICByZXBsYWNlRm46IGZ1bmN0aW9uIChhdXRvbGlua2VyLCBtYXRjaCkge1xuICAgICAgLy8gT25seSBjb2xsZWN0IG1hdGNoZWQgc3RyaW5ncyBidXQgZG9uJ3QgY2hhbmdlIGFueXRoaW5nLlxuICAgICAgc3dpdGNoIChtYXRjaC5nZXRUeXBlKCkpIHtcbiAgICAgICAgLyplc2xpbnQgZGVmYXVsdC1jYXNlOjAqL1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICAgIGxpbmtzLnB1c2goe1xuICAgICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hlZFRleHQsXG4gICAgICAgICAgICB1cmw6IG1hdGNoLmdldFVybCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICBsaW5rcy5wdXNoKHtcbiAgICAgICAgICAgIHRleHQ6IG1hdGNoLm1hdGNoZWRUZXh0LFxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGVtYWlsIHByb3RvY29sXG4gICAgICAgICAgICB1cmw6ICdtYWlsdG86JyArIG1hdGNoLmdldEVtYWlsKCkucmVwbGFjZSgvXm1haWx0bzovaSwgJycpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGxpbmtzOiBsaW5rcyxcbiAgICBhdXRvbGlua2VyOiBhdXRvbGlua2VyXG4gIH07XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsaW5raWZ5KHN0YXRlKSB7XG4gIHZhciBpLCBqLCBsLCB0b2tlbnMsIHRva2VuLCB0ZXh0LCBub2RlcywgbG4sIHBvcywgbGV2ZWwsIGh0bWxMaW5rTGV2ZWwsXG4gICAgICBibG9ja1Rva2VucyA9IHN0YXRlLnRva2VucyxcbiAgICAgIGxpbmtpZmllciA9IG51bGwsIGxpbmtzLCBhdXRvbGlua2VyO1xuXG4gIGlmICghc3RhdGUub3B0aW9ucy5saW5raWZ5KSB7IHJldHVybjsgfVxuXG4gIGZvciAoaiA9IDAsIGwgPSBibG9ja1Rva2Vucy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICBpZiAoYmxvY2tUb2tlbnNbal0udHlwZSAhPT0gJ2lubGluZScpIHsgY29udGludWU7IH1cbiAgICB0b2tlbnMgPSBibG9ja1Rva2Vuc1tqXS5jaGlsZHJlbjtcblxuICAgIGh0bWxMaW5rTGV2ZWwgPSAwO1xuXG4gICAgLy8gV2Ugc2NhbiBmcm9tIHRoZSBlbmQsIHRvIGtlZXAgcG9zaXRpb24gd2hlbiBuZXcgdGFncyBhZGRlZC5cbiAgICAvLyBVc2UgcmV2ZXJzZWQgbG9naWMgaW4gbGlua3Mgc3RhcnQvZW5kIG1hdGNoXG4gICAgZm9yIChpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgLy8gU2tpcCBjb250ZW50IG9mIG1hcmtkb3duIGxpbmtzXG4gICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2xpbmtfY2xvc2UnKSB7XG4gICAgICAgIGktLTtcbiAgICAgICAgd2hpbGUgKHRva2Vuc1tpXS5sZXZlbCAhPT0gdG9rZW4ubGV2ZWwgJiYgdG9rZW5zW2ldLnR5cGUgIT09ICdsaW5rX29wZW4nKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIGNvbnRlbnQgb2YgaHRtbCB0YWcgbGlua3NcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSAnaHRtbHRhZycpIHtcbiAgICAgICAgaWYgKGlzTGlua09wZW4odG9rZW4uY29udGVudCkgJiYgaHRtbExpbmtMZXZlbCA+IDApIHtcbiAgICAgICAgICBodG1sTGlua0xldmVsLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTGlua0Nsb3NlKHRva2VuLmNvbnRlbnQpKSB7XG4gICAgICAgICAgaHRtbExpbmtMZXZlbCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaHRtbExpbmtMZXZlbCA+IDApIHsgY29udGludWU7IH1cblxuICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0JyAmJiBMSU5LX1NDQU5fUkUudGVzdCh0b2tlbi5jb250ZW50KSkge1xuXG4gICAgICAgIC8vIEluaXQgbGlua2lmaWVyIGluIGxhenkgbWFubmVyLCBvbmx5IGlmIHJlcXVpcmVkLlxuICAgICAgICBpZiAoIWxpbmtpZmllcikge1xuICAgICAgICAgIGxpbmtpZmllciA9IGNyZWF0ZUxpbmtpZmllcigpO1xuICAgICAgICAgIGxpbmtzID0gbGlua2lmaWVyLmxpbmtzO1xuICAgICAgICAgIGF1dG9saW5rZXIgPSBsaW5raWZpZXIuYXV0b2xpbmtlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSB0b2tlbi5jb250ZW50O1xuICAgICAgICBsaW5rcy5sZW5ndGggPSAwO1xuICAgICAgICBhdXRvbGlua2VyLmxpbmsodGV4dCk7XG5cbiAgICAgICAgaWYgKCFsaW5rcy5sZW5ndGgpIHsgY29udGludWU7IH1cblxuICAgICAgICAvLyBOb3cgc3BsaXQgc3RyaW5nIHRvIG5vZGVzXG4gICAgICAgIG5vZGVzID0gW107XG4gICAgICAgIGxldmVsID0gdG9rZW4ubGV2ZWw7XG5cbiAgICAgICAgZm9yIChsbiA9IDA7IGxuIDwgbGlua3MubGVuZ3RoOyBsbisrKSB7XG5cbiAgICAgICAgICBpZiAoIXN0YXRlLmlubGluZS52YWxpZGF0ZUxpbmsobGlua3NbbG5dLnVybCkpIHsgY29udGludWU7IH1cblxuICAgICAgICAgIHBvcyA9IHRleHQuaW5kZXhPZihsaW5rc1tsbl0udGV4dCk7XG5cbiAgICAgICAgICBpZiAocG9zKSB7XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgY29udGVudDogdGV4dC5zbGljZSgwLCBwb3MpLFxuICAgICAgICAgICAgICBsZXZlbDogbGV2ZWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub2Rlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgICAgICAgaHJlZjogbGlua3NbbG5dLnVybCxcbiAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgIGxldmVsOiBsZXZlbCsrXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICBjb250ZW50OiBsaW5rc1tsbl0udGV4dCxcbiAgICAgICAgICAgIGxldmVsOiBsZXZlbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ2xpbmtfY2xvc2UnLFxuICAgICAgICAgICAgbGV2ZWw6IC0tbGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZShwb3MgKyBsaW5rc1tsbl0udGV4dC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgIG5vZGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgY29udGVudDogdGV4dCxcbiAgICAgICAgICAgIGxldmVsOiBsZXZlbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVwbGFjZSBjdXJyZW50IG5vZGVcbiAgICAgICAgYmxvY2tUb2tlbnNbal0uY2hpbGRyZW4gPSB0b2tlbnMgPSBbXS5jb25jYXQodG9rZW5zLnNsaWNlKDAsIGkpLCBub2RlcywgdG9rZW5zLnNsaWNlKGkgKyAxKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBTdGF0ZUlubGluZSAgICAgICAgICA9IHJlcXVpcmUoJy4uL3J1bGVzX2lubGluZS9zdGF0ZV9pbmxpbmUnKTtcbnZhciBwYXJzZUxpbmtMYWJlbCAgICAgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua19sYWJlbCcpO1xudmFyIHBhcnNlTGlua0Rlc3RpbmF0aW9uID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uJyk7XG52YXIgcGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfdGl0bGUnKTtcbnZhciBub3JtYWxpemVSZWZlcmVuY2UgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbm9ybWFsaXplX3JlZmVyZW5jZScpO1xuXG5cbmZ1bmN0aW9uIHBhcnNlUmVmZXJlbmNlKHN0ciwgcGFyc2VyLCBvcHRpb25zLCBlbnYpIHtcbiAgdmFyIHN0YXRlLCBsYWJlbEVuZCwgcG9zLCBtYXgsIGNvZGUsIHN0YXJ0LCBocmVmLCB0aXRsZSwgbGFiZWw7XG5cbiAgaWYgKHN0ci5jaGFyQ29kZUF0KDApICE9PSAweDVCLyogWyAqLykgeyByZXR1cm4gLTE7IH1cblxuICBpZiAoc3RyLmluZGV4T2YoJ106JykgPT09IC0xKSB7IHJldHVybiAtMTsgfVxuXG4gIHN0YXRlID0gbmV3IFN0YXRlSW5saW5lKHN0ciwgcGFyc2VyLCBvcHRpb25zLCBlbnYsIFtdKTtcbiAgbGFiZWxFbmQgPSBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgMCk7XG5cbiAgaWYgKGxhYmVsRW5kIDwgMCB8fCBzdHIuY2hhckNvZGVBdChsYWJlbEVuZCArIDEpICE9PSAweDNBLyogOiAqLykgeyByZXR1cm4gLTE7IH1cblxuICBtYXggPSBzdGF0ZS5wb3NNYXg7XG5cbiAgLy8gW2xhYmVsXTogICBkZXN0aW5hdGlvbiAgICd0aXRsZSdcbiAgLy8gICAgICAgICBeXl4gc2tpcCBvcHRpb25hbCB3aGl0ZXNwYWNlIGhlcmVcbiAgZm9yIChwb3MgPSBsYWJlbEVuZCArIDI7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoY29kZSAhPT0gMHgyMCAmJiBjb2RlICE9PSAweDBBKSB7IGJyZWFrOyB9XG4gIH1cblxuICAvLyBbbGFiZWxdOiAgIGRlc3RpbmF0aW9uICAgJ3RpdGxlJ1xuICAvLyAgICAgICAgICAgIF5eXl5eXl5eXl5eIHBhcnNlIHRoaXNcbiAgaWYgKCFwYXJzZUxpbmtEZXN0aW5hdGlvbihzdGF0ZSwgcG9zKSkgeyByZXR1cm4gLTE7IH1cbiAgaHJlZiA9IHN0YXRlLmxpbmtDb250ZW50O1xuICBwb3MgPSBzdGF0ZS5wb3M7XG5cbiAgLy8gW2xhYmVsXTogICBkZXN0aW5hdGlvbiAgICd0aXRsZSdcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgIF5eXiBza2lwcGluZyB0aG9zZSBzcGFjZXNcbiAgc3RhcnQgPSBwb3M7XG4gIGZvciAocG9zID0gcG9zICsgMTsgcG9zIDwgbWF4OyBwb3MrKykge1xuICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgfVxuXG4gIC8vIFtsYWJlbF06ICAgZGVzdGluYXRpb24gICAndGl0bGUnXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICBeXl5eXl5eIHBhcnNlIHRoaXNcbiAgaWYgKHBvcyA8IG1heCAmJiBzdGFydCAhPT0gcG9zICYmIHBhcnNlTGlua1RpdGxlKHN0YXRlLCBwb3MpKSB7XG4gICAgdGl0bGUgPSBzdGF0ZS5saW5rQ29udGVudDtcbiAgICBwb3MgPSBzdGF0ZS5wb3M7XG4gIH0gZWxzZSB7XG4gICAgdGl0bGUgPSAnJztcbiAgICBwb3MgPSBzdGFydDtcbiAgfVxuXG4gIC8vIGVuc3VyZSB0aGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUgaXMgZW1wdHlcbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDIwLyogc3BhY2UgKi8pIHsgcG9zKys7IH1cbiAgaWYgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDBBKSB7IHJldHVybiAtMTsgfVxuXG4gIGxhYmVsID0gbm9ybWFsaXplUmVmZXJlbmNlKHN0ci5zbGljZSgxLCBsYWJlbEVuZCkpO1xuICBpZiAodHlwZW9mIGVudi5yZWZlcmVuY2VzW2xhYmVsXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBlbnYucmVmZXJlbmNlc1tsYWJlbF0gPSB7IHRpdGxlOiB0aXRsZSwgaHJlZjogaHJlZiB9O1xuICB9XG5cbiAgcmV0dXJuIHBvcztcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlZmVyZW5jZXMoc3RhdGUpIHtcbiAgdmFyIHRva2VucyA9IHN0YXRlLnRva2VucywgaSwgbCwgY29udGVudCwgcG9zO1xuXG4gIHN0YXRlLmVudi5yZWZlcmVuY2VzID0gc3RhdGUuZW52LnJlZmVyZW5jZXMgfHwge307XG5cbiAgaWYgKHN0YXRlLmlubGluZU1vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTY2FuIGRlZmluaXRpb25zIGluIHBhcmFncmFwaCBpbmxpbmVzXG4gIGZvciAoaSA9IDEsIGwgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gJ2lubGluZScgJiZcbiAgICAgICAgdG9rZW5zW2kgLSAxXS50eXBlID09PSAncGFyYWdyYXBoX29wZW4nICYmXG4gICAgICAgIHRva2Vuc1tpICsgMV0udHlwZSA9PT0gJ3BhcmFncmFwaF9jbG9zZScpIHtcblxuICAgICAgY29udGVudCA9IHRva2Vuc1tpXS5jb250ZW50O1xuICAgICAgd2hpbGUgKGNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICAgIHBvcyA9IHBhcnNlUmVmZXJlbmNlKGNvbnRlbnQsIHN0YXRlLmlubGluZSwgc3RhdGUub3B0aW9ucywgc3RhdGUuZW52KTtcbiAgICAgICAgaWYgKHBvcyA8IDApIHsgYnJlYWs7IH1cbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UocG9zKS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIHRva2Vuc1tpXS5jb250ZW50ID0gY29udGVudDtcbiAgICAgIGlmICghY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgdG9rZW5zW2kgLSAxXS50aWdodCA9IHRydWU7XG4gICAgICAgIHRva2Vuc1tpICsgMV0udGlnaHQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIi8vIFNpbXBsZSB0eXBvZ3JhcGhpY2FsIHJlcGxhY2VtZW50c1xuLy9cbid1c2Ugc3RyaWN0JztcblxuLy8gVE9ETzpcbi8vIC0gZnJhY3Rpb25hbHMgMS8yLCAxLzQsIDMvNCAtPiDCvSwgwrwsIMK+XG4vLyAtIG1pbHRpcGxpY2F0aW9uIDIgeCA0IC0+IDIgw5cgNFxuXG52YXIgUkFSRV9SRSA9IC9cXCstfFxcLlxcLnxcXD9cXD9cXD9cXD98ISEhIXwsLHwtLS87XG5cbnZhciBTQ09QRURfQUJCUl9SRSA9IC9cXCgoY3x0bXxyfHApXFwpL2lnO1xudmFyIFNDT1BFRF9BQkJSID0ge1xuICAnYyc6ICfCqScsXG4gICdyJzogJ8KuJyxcbiAgJ3AnOiAnwqcnLFxuICAndG0nOiAn4oSiJ1xufTtcblxuZnVuY3Rpb24gcmVwbGFjZVNjb3BlZEFiYnIoc3RyKSB7XG4gIGlmIChzdHIuaW5kZXhPZignKCcpIDwgMCkgeyByZXR1cm4gc3RyOyB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKFNDT1BFRF9BQkJSX1JFLCBmdW5jdGlvbihtYXRjaCwgbmFtZSkge1xuICAgIHJldHVybiBTQ09QRURfQUJCUltuYW1lLnRvTG93ZXJDYXNlKCldO1xuICB9KTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcGxhY2Uoc3RhdGUpIHtcbiAgdmFyIGksIHRva2VuLCB0ZXh0LCBpbmxpbmVUb2tlbnMsIGJsa0lkeDtcblxuICBpZiAoIXN0YXRlLm9wdGlvbnMudHlwb2dyYXBoZXIpIHsgcmV0dXJuOyB9XG5cbiAgZm9yIChibGtJZHggPSBzdGF0ZS50b2tlbnMubGVuZ3RoIC0gMTsgYmxrSWR4ID49IDA7IGJsa0lkeC0tKSB7XG5cbiAgICBpZiAoc3RhdGUudG9rZW5zW2Jsa0lkeF0udHlwZSAhPT0gJ2lubGluZScpIHsgY29udGludWU7IH1cblxuICAgIGlubGluZVRva2VucyA9IHN0YXRlLnRva2Vuc1tibGtJZHhdLmNoaWxkcmVuO1xuXG4gICAgZm9yIChpID0gaW5saW5lVG9rZW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0b2tlbiA9IGlubGluZVRva2Vuc1tpXTtcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgdGV4dCA9IHRva2VuLmNvbnRlbnQ7XG5cbiAgICAgICAgdGV4dCA9IHJlcGxhY2VTY29wZWRBYmJyKHRleHQpO1xuXG4gICAgICAgIGlmIChSQVJFX1JFLnRlc3QodGV4dCkpIHtcbiAgICAgICAgICB0ZXh0ID0gdGV4dFxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcKy0vZywgJ8KxJylcbiAgICAgICAgICAgIC8vIC4uLCAuLi4sIC4uLi4uLi4gLT4g4oCmXG4gICAgICAgICAgICAvLyBidXQgPy4uLi4uICYgIS4uLi4uIC0+ID8uLiAmICEuLlxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLnsyLH0vZywgJ+KApicpLnJlcGxhY2UoLyhbPyFdKeKApi9nLCAnJDEuLicpXG4gICAgICAgICAgICAucmVwbGFjZSgvKFs/IV0pezQsfS9nLCAnJDEkMSQxJykucmVwbGFjZSgvLHsyLH0vZywgJywnKVxuICAgICAgICAgICAgLy8gZW0tZGFzaFxuICAgICAgICAgICAgLnJlcGxhY2UoLyhefFteLV0pLS0tKFteLV18JCkvbWcsICckMVxcdTIwMTQkMicpXG4gICAgICAgICAgICAvLyBlbi1kYXNoXG4gICAgICAgICAgICAucmVwbGFjZSgvKF58XFxzKS0tKFxcc3wkKS9tZywgJyQxXFx1MjAxMyQyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oXnxbXi1cXHNdKS0tKFteLVxcc118JCkvbWcsICckMVxcdTIwMTMkMicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9rZW4uY29udGVudCA9IHRleHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwiLy8gQ29udmVydCBzdHJhaWdodCBxdW90YXRpb24gbWFya3MgdG8gdHlwb2dyYXBoaWMgb25lc1xuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgUVVPVEVfVEVTVF9SRSA9IC9bJ1wiXS87XG52YXIgUVVPVEVfUkUgPSAvWydcIl0vZztcbnZhciBQVU5DVF9SRSA9IC9bLVxccygpXFxbXFxdXS87XG52YXIgQVBPU1RST1BIRSA9ICfigJknO1xuXG4vLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hhcmFjdGVyIGF0IGBwb3NgXG4vLyBjb3VsZCBiZSBpbnNpZGUgYSB3b3JkLlxuZnVuY3Rpb24gaXNMZXR0ZXIoc3RyLCBwb3MpIHtcbiAgaWYgKHBvcyA8IDAgfHwgcG9zID49IHN0ci5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHJldHVybiAhUFVOQ1RfUkUudGVzdChzdHJbcG9zXSk7XG59XG5cblxuZnVuY3Rpb24gcmVwbGFjZUF0KHN0ciwgaW5kZXgsIGNoKSB7XG4gIHJldHVybiBzdHIuc3Vic3RyKDAsIGluZGV4KSArIGNoICsgc3RyLnN1YnN0cihpbmRleCArIDEpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc21hcnRxdW90ZXMoc3RhdGUpIHtcbiAgLyplc2xpbnQgbWF4LWRlcHRoOjAqL1xuICB2YXIgaSwgdG9rZW4sIHRleHQsIHQsIHBvcywgbWF4LCB0aGlzTGV2ZWwsIGxhc3RTcGFjZSwgbmV4dFNwYWNlLCBpdGVtLFxuICAgICAgY2FuT3BlbiwgY2FuQ2xvc2UsIGosIGlzU2luZ2xlLCBibGtJZHgsIHRva2VucyxcbiAgICAgIHN0YWNrO1xuXG4gIGlmICghc3RhdGUub3B0aW9ucy50eXBvZ3JhcGhlcikgeyByZXR1cm47IH1cblxuICBzdGFjayA9IFtdO1xuXG4gIGZvciAoYmxrSWR4ID0gc3RhdGUudG9rZW5zLmxlbmd0aCAtIDE7IGJsa0lkeCA+PSAwOyBibGtJZHgtLSkge1xuXG4gICAgaWYgKHN0YXRlLnRva2Vuc1tibGtJZHhdLnR5cGUgIT09ICdpbmxpbmUnKSB7IGNvbnRpbnVlOyB9XG5cbiAgICB0b2tlbnMgPSBzdGF0ZS50b2tlbnNbYmxrSWR4XS5jaGlsZHJlbjtcbiAgICBzdGFjay5sZW5ndGggPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG5cbiAgICAgIGlmICh0b2tlbi50eXBlICE9PSAndGV4dCcgfHwgUVVPVEVfVEVTVF9SRS50ZXN0KHRva2VuLnRleHQpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIHRoaXNMZXZlbCA9IHRva2Vuc1tpXS5sZXZlbDtcblxuICAgICAgZm9yIChqID0gc3RhY2subGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrW2pdLmxldmVsIDw9IHRoaXNMZXZlbCkgeyBicmVhazsgfVxuICAgICAgfVxuICAgICAgc3RhY2subGVuZ3RoID0gaiArIDE7XG5cbiAgICAgIHRleHQgPSB0b2tlbi5jb250ZW50O1xuICAgICAgcG9zID0gMDtcbiAgICAgIG1heCA9IHRleHQubGVuZ3RoO1xuXG4gICAgICAvKmVzbGludCBuby1sYWJlbHM6MCxibG9jay1zY29wZWQtdmFyOjAqL1xuICAgICAgT1VURVI6XG4gICAgICB3aGlsZSAocG9zIDwgbWF4KSB7XG4gICAgICAgIFFVT1RFX1JFLmxhc3RJbmRleCA9IHBvcztcbiAgICAgICAgdCA9IFFVT1RFX1JFLmV4ZWModGV4dCk7XG4gICAgICAgIGlmICghdCkgeyBicmVhazsgfVxuXG4gICAgICAgIGxhc3RTcGFjZSA9ICFpc0xldHRlcih0ZXh0LCB0LmluZGV4IC0gMSk7XG4gICAgICAgIHBvcyA9IHQuaW5kZXggKyAxO1xuICAgICAgICBpc1NpbmdsZSA9ICh0WzBdID09PSBcIidcIik7XG4gICAgICAgIG5leHRTcGFjZSA9ICFpc0xldHRlcih0ZXh0LCBwb3MpO1xuXG4gICAgICAgIGlmICghbmV4dFNwYWNlICYmICFsYXN0U3BhY2UpIHtcbiAgICAgICAgICAvLyBtaWRkbGUgb2Ygd29yZFxuICAgICAgICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdCh0b2tlbi5jb250ZW50LCB0LmluZGV4LCBBUE9TVFJPUEhFKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBjYW5PcGVuID0gIW5leHRTcGFjZTtcbiAgICAgICAgY2FuQ2xvc2UgPSAhbGFzdFNwYWNlO1xuXG4gICAgICAgIGlmIChjYW5DbG9zZSkge1xuICAgICAgICAgIC8vIHRoaXMgY291bGQgYmUgYSBjbG9zaW5nIHF1b3RlLCByZXdpbmQgdGhlIHN0YWNrIHRvIGdldCBhIG1hdGNoXG4gICAgICAgICAgZm9yIChqID0gc3RhY2subGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBzdGFja1tqXTtcbiAgICAgICAgICAgIGlmIChzdGFja1tqXS5sZXZlbCA8IHRoaXNMZXZlbCkgeyBicmVhazsgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc2luZ2xlID09PSBpc1NpbmdsZSAmJiBzdGFja1tqXS5sZXZlbCA9PT0gdGhpc0xldmVsKSB7XG4gICAgICAgICAgICAgIGl0ZW0gPSBzdGFja1tqXTtcbiAgICAgICAgICAgICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zW2l0ZW0udG9rZW5dLmNvbnRlbnQgPSByZXBsYWNlQXQodG9rZW5zW2l0ZW0udG9rZW5dLmNvbnRlbnQsIGl0ZW0ucG9zLCBzdGF0ZS5vcHRpb25zLnF1b3Rlc1syXSk7XG4gICAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdCh0b2tlbi5jb250ZW50LCB0LmluZGV4LCBzdGF0ZS5vcHRpb25zLnF1b3Rlc1szXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zW2l0ZW0udG9rZW5dLmNvbnRlbnQgPSByZXBsYWNlQXQodG9rZW5zW2l0ZW0udG9rZW5dLmNvbnRlbnQsIGl0ZW0ucG9zLCBzdGF0ZS5vcHRpb25zLnF1b3Rlc1swXSk7XG4gICAgICAgICAgICAgICAgdG9rZW4uY29udGVudCA9IHJlcGxhY2VBdCh0b2tlbi5jb250ZW50LCB0LmluZGV4LCBzdGF0ZS5vcHRpb25zLnF1b3Rlc1sxXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhY2subGVuZ3RoID0gajtcbiAgICAgICAgICAgICAgY29udGludWUgT1VURVI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbk9wZW4pIHtcbiAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgIHRva2VuOiBpLFxuICAgICAgICAgICAgcG9zOiB0LmluZGV4LFxuICAgICAgICAgICAgc2luZ2xlOiBpc1NpbmdsZSxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzTGV2ZWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjYW5DbG9zZSAmJiBpc1NpbmdsZSkge1xuICAgICAgICAgIHRva2VuLmNvbnRlbnQgPSByZXBsYWNlQXQodG9rZW4uY29udGVudCwgdC5pbmRleCwgQVBPU1RST1BIRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCIvLyBQcm9jZXNzIGF1dG9saW5rcyAnPHByb3RvY29sOi4uLj4nXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHVybF9zY2hlbWFzICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXJsX3NjaGVtYXMnKTtcbnZhciBub3JtYWxpemVMaW5rID0gcmVxdWlyZSgnLi4vaGVscGVycy9ub3JtYWxpemVfbGluaycpO1xuXG5cbi8qZXNsaW50IG1heC1sZW46MCovXG52YXIgRU1BSUxfUkUgICAgPSAvXjwoW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKik+LztcbnZhciBBVVRPTElOS19SRSA9IC9ePChbYS16QS1aLlxcLV17MSwyNX0pOihbXjw+XFx4MDAtXFx4MjBdKik+LztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF1dG9saW5rKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIHRhaWwsIGxpbmtNYXRjaCwgZW1haWxNYXRjaCwgdXJsLCBmdWxsVXJsLCBwb3MgPSBzdGF0ZS5wb3M7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4M0MvKiA8ICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHRhaWwgPSBzdGF0ZS5zcmMuc2xpY2UocG9zKTtcblxuICBpZiAodGFpbC5pbmRleE9mKCc+JykgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxpbmtNYXRjaCA9IHRhaWwubWF0Y2goQVVUT0xJTktfUkUpO1xuXG4gIGlmIChsaW5rTWF0Y2gpIHtcbiAgICBpZiAodXJsX3NjaGVtYXMuaW5kZXhPZihsaW5rTWF0Y2hbMV0udG9Mb3dlckNhc2UoKSkgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgdXJsID0gbGlua01hdGNoWzBdLnNsaWNlKDEsIC0xKTtcbiAgICBmdWxsVXJsID0gbm9ybWFsaXplTGluayh1cmwpO1xuICAgIGlmICghc3RhdGUucGFyc2VyLnZhbGlkYXRlTGluayh1cmwpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlua19vcGVuJyxcbiAgICAgICAgaHJlZjogZnVsbFVybCxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIGNvbnRlbnQ6IHVybCxcbiAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsICsgMVxuICAgICAgfSk7XG4gICAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ2xpbmtfY2xvc2UnLCBsZXZlbDogc3RhdGUubGV2ZWwgfSk7XG4gICAgfVxuXG4gICAgc3RhdGUucG9zICs9IGxpbmtNYXRjaFswXS5sZW5ndGg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBlbWFpbE1hdGNoID0gdGFpbC5tYXRjaChFTUFJTF9SRSk7XG5cbiAgaWYgKGVtYWlsTWF0Y2gpIHtcblxuICAgIHVybCA9IGVtYWlsTWF0Y2hbMF0uc2xpY2UoMSwgLTEpO1xuXG4gICAgZnVsbFVybCA9IG5vcm1hbGl6ZUxpbmsoJ21haWx0bzonICsgdXJsKTtcbiAgICBpZiAoIXN0YXRlLnBhcnNlci52YWxpZGF0ZUxpbmsoZnVsbFVybCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaW5rX29wZW4nLFxuICAgICAgICBocmVmOiBmdWxsVXJsLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgIH0pO1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgY29udGVudDogdXJsLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWwgKyAxXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnbGlua19jbG9zZScsIGxldmVsOiBzdGF0ZS5sZXZlbCB9KTtcbiAgICB9XG5cbiAgICBzdGF0ZS5wb3MgKz0gZW1haWxNYXRjaFswXS5sZW5ndGg7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiLy8gUGFyc2UgYmFja3RpY2tzXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiYWNrdGlja3Moc3RhdGUsIHNpbGVudCkge1xuICB2YXIgc3RhcnQsIG1heCwgbWFya2VyLCBtYXRjaFN0YXJ0LCBtYXRjaEVuZCxcbiAgICAgIHBvcyA9IHN0YXRlLnBvcyxcbiAgICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICBpZiAoY2ggIT09IDB4NjAvKiBgICovKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHN0YXJ0ID0gcG9zO1xuICBwb3MrKztcbiAgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHg2MC8qIGAgKi8pIHsgcG9zKys7IH1cblxuICBtYXJrZXIgPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHBvcyk7XG5cbiAgbWF0Y2hTdGFydCA9IG1hdGNoRW5kID0gcG9zO1xuXG4gIHdoaWxlICgobWF0Y2hTdGFydCA9IHN0YXRlLnNyYy5pbmRleE9mKCdgJywgbWF0Y2hFbmQpKSAhPT0gLTEpIHtcbiAgICBtYXRjaEVuZCA9IG1hdGNoU3RhcnQgKyAxO1xuXG4gICAgd2hpbGUgKG1hdGNoRW5kIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KG1hdGNoRW5kKSA9PT0gMHg2MC8qIGAgKi8pIHsgbWF0Y2hFbmQrKzsgfVxuXG4gICAgaWYgKG1hdGNoRW5kIC0gbWF0Y2hTdGFydCA9PT0gbWFya2VyLmxlbmd0aCkge1xuICAgICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICAgIGNvbnRlbnQ6IHN0YXRlLnNyYy5zbGljZShwb3MsIG1hdGNoU3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWyBcXG5dKy9nLCAnICcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpLFxuICAgICAgICAgIGJsb2NrOiBmYWxzZSxcbiAgICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzdGF0ZS5wb3MgPSBtYXRjaEVuZDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gbWFya2VyOyB9XG4gIHN0YXRlLnBvcyArPSBtYXJrZXIubGVuZ3RoO1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZXNzIH5+ZGVsZXRlZCB0ZXh0fn5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbChzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBmb3VuZCxcbiAgICAgIHBvcyxcbiAgICAgIHN0YWNrLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3MsXG4gICAgICBsYXN0Q2hhcixcbiAgICAgIG5leHRDaGFyO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCkgIT09IDB4N0UvKiB+ICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc2lsZW50KSB7IHJldHVybiBmYWxzZTsgfSAvLyBkb24ndCBydW4gYW55IHBhaXJzIGluIHZhbGlkYXRpb24gbW9kZVxuICBpZiAoc3RhcnQgKyA0ID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMSkgIT09IDB4N0UvKiB+ICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhc3RDaGFyID0gc3RhcnQgPiAwID8gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQgLSAxKSA6IC0xO1xuICBuZXh0Q2hhciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMik7XG5cbiAgaWYgKGxhc3RDaGFyID09PSAweDdFLyogfiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKG5leHRDaGFyID09PSAweDdFLyogfiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKG5leHRDaGFyID09PSAweDIwIHx8IG5leHRDaGFyID09PSAweDBBKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IHN0YXJ0ICsgMjtcbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDdFLyogfiAqLykgeyBwb3MrKzsgfVxuICBpZiAocG9zID4gc3RhcnQgKyAzKSB7XG4gICAgLy8gc2VxdWVuY2Ugb2YgNCsgbWFya2VycyB0YWtpbmcgYXMgbGl0ZXJhbCwgc2FtZSBhcyBpbiBhIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zICs9IHBvcyAtIHN0YXJ0O1xuICAgIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0LCBwb3MpOyB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIDI7XG4gIHN0YWNrID0gMTtcblxuICB3aGlsZSAoc3RhdGUucG9zICsgMSA8IG1heCkge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpID09PSAweDdFLyogfiAqLykge1xuICAgICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcyArIDEpID09PSAweDdFLyogfiAqLykge1xuICAgICAgICBsYXN0Q2hhciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcyAtIDEpO1xuICAgICAgICBuZXh0Q2hhciA9IHN0YXRlLnBvcyArIDIgPCBtYXggPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MgKyAyKSA6IC0xO1xuICAgICAgICBpZiAobmV4dENoYXIgIT09IDB4N0UvKiB+ICovICYmIGxhc3RDaGFyICE9PSAweDdFLyogfiAqLykge1xuICAgICAgICAgIGlmIChsYXN0Q2hhciAhPT0gMHgyMCAmJiBsYXN0Q2hhciAhPT0gMHgwQSkge1xuICAgICAgICAgICAgLy8gY2xvc2luZyAnfn4nXG4gICAgICAgICAgICBzdGFjay0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dENoYXIgIT09IDB4MjAgJiYgbmV4dENoYXIgIT09IDB4MEEpIHtcbiAgICAgICAgICAgIC8vIG9wZW5pbmcgJ35+J1xuICAgICAgICAgICAgc3RhY2srKztcbiAgICAgICAgICB9IC8vIGVsc2Uge1xuICAgICAgICAgICAgLy8gIC8vIHN0YW5kYWxvbmUgJyB+fiAnIGluZGVudGVkIHdpdGggc3BhY2VzXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgaWYgKHN0YWNrIDw9IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRlLnBhcnNlci5za2lwVG9rZW4oc3RhdGUpO1xuICB9XG5cbiAgaWYgKCFmb3VuZCkge1xuICAgIC8vIHBhcnNlciBmYWlsZWQgdG8gZmluZCBlbmRpbmcgdGFnLCBzbyBpdCdzIG5vdCB2YWxpZCBlbXBoYXNpc1xuICAgIHN0YXRlLnBvcyA9IHN0YXJ0O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGZvdW5kIVxuICBzdGF0ZS5wb3NNYXggPSBzdGF0ZS5wb3M7XG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgMjtcblxuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnZGVsX29wZW4nLCBsZXZlbDogc3RhdGUubGV2ZWwrKyB9KTtcbiAgICBzdGF0ZS5wYXJzZXIudG9rZW5pemUoc3RhdGUpO1xuICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnZGVsX2Nsb3NlJywgbGV2ZWw6IC0tc3RhdGUubGV2ZWwgfSk7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGF0ZS5wb3NNYXggKyAyO1xuICBzdGF0ZS5wb3NNYXggPSBtYXg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgKnRoaXMqIGFuZCBfdGhhdF9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmZ1bmN0aW9uIGlzQWxwaGFOdW0oY29kZSkge1xuICByZXR1cm4gKGNvZGUgPj0gMHgzMCAvKiAwICovICYmIGNvZGUgPD0gMHgzOSAvKiA5ICovKSB8fFxuICAgICAgICAgKGNvZGUgPj0gMHg0MSAvKiBBICovICYmIGNvZGUgPD0gMHg1QSAvKiBaICovKSB8fFxuICAgICAgICAgKGNvZGUgPj0gMHg2MSAvKiBhICovICYmIGNvZGUgPD0gMHg3QSAvKiB6ICovKTtcbn1cblxuLy8gcGFyc2Ugc2VxdWVuY2Ugb2YgZW1waGFzaXMgbWFya2Vycyxcbi8vIFwic3RhcnRcIiBzaG91bGQgcG9pbnQgYXQgYSB2YWxpZCBtYXJrZXJcbmZ1bmN0aW9uIHNjYW5EZWxpbXMoc3RhdGUsIHN0YXJ0KSB7XG4gIHZhciBwb3MgPSBzdGFydCwgbGFzdENoYXIsIG5leHRDaGFyLCBjb3VudCxcbiAgICAgIGNhbl9vcGVuID0gdHJ1ZSxcbiAgICAgIGNhbl9jbG9zZSA9IHRydWUsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCk7XG5cbiAgbGFzdENoYXIgPSBzdGFydCA+IDAgPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCAtIDEpIDogLTE7XG5cbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSBtYXJrZXIpIHsgcG9zKys7IH1cbiAgaWYgKHBvcyA+PSBtYXgpIHsgY2FuX29wZW4gPSBmYWxzZTsgfVxuICBjb3VudCA9IHBvcyAtIHN0YXJ0O1xuXG4gIGlmIChjb3VudCA+PSA0KSB7XG4gICAgLy8gc2VxdWVuY2Ugb2YgZm91ciBvciBtb3JlIHVuZXNjYXBlZCBtYXJrZXJzIGNhbid0IHN0YXJ0L2VuZCBhbiBlbXBoYXNpc1xuICAgIGNhbl9vcGVuID0gY2FuX2Nsb3NlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbmV4dENoYXIgPSBwb3MgPCBtYXggPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpIDogLTE7XG5cbiAgICAvLyBjaGVjayB3aGl0ZXNwYWNlIGNvbmRpdGlvbnNcbiAgICBpZiAobmV4dENoYXIgPT09IDB4MjAgfHwgbmV4dENoYXIgPT09IDB4MEEpIHsgY2FuX29wZW4gPSBmYWxzZTsgfVxuICAgIGlmIChsYXN0Q2hhciA9PT0gMHgyMCB8fCBsYXN0Q2hhciA9PT0gMHgwQSkgeyBjYW5fY2xvc2UgPSBmYWxzZTsgfVxuXG4gICAgaWYgKG1hcmtlciA9PT0gMHg1RiAvKiBfICovKSB7XG4gICAgICAvLyBjaGVjayBpZiB3ZSBhcmVuJ3QgaW5zaWRlIHRoZSB3b3JkXG4gICAgICBpZiAoaXNBbHBoYU51bShsYXN0Q2hhcikpIHsgY2FuX29wZW4gPSBmYWxzZTsgfVxuICAgICAgaWYgKGlzQWxwaGFOdW0obmV4dENoYXIpKSB7IGNhbl9jbG9zZSA9IGZhbHNlOyB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjYW5fb3BlbjogY2FuX29wZW4sXG4gICAgY2FuX2Nsb3NlOiBjYW5fY2xvc2UsXG4gICAgZGVsaW1zOiBjb3VudFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVtcGhhc2lzKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIHN0YXJ0Q291bnQsXG4gICAgICBjb3VudCxcbiAgICAgIGZvdW5kLFxuICAgICAgb2xkQ291bnQsXG4gICAgICBuZXdDb3VudCxcbiAgICAgIHN0YWNrLFxuICAgICAgcmVzLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3MsXG4gICAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCk7XG5cbiAgaWYgKG1hcmtlciAhPT0gMHg1Ri8qIF8gKi8gJiYgbWFya2VyICE9PSAweDJBIC8qICogKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzaWxlbnQpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIGRvbid0IHJ1biBhbnkgcGFpcnMgaW4gdmFsaWRhdGlvbiBtb2RlXG5cbiAgcmVzID0gc2NhbkRlbGltcyhzdGF0ZSwgc3RhcnQpO1xuICBzdGFydENvdW50ID0gcmVzLmRlbGltcztcbiAgaWYgKCFyZXMuY2FuX29wZW4pIHtcbiAgICBzdGF0ZS5wb3MgKz0gc3RhcnRDb3VudDtcbiAgICBpZiAoIXNpbGVudCkgeyBzdGF0ZS5wZW5kaW5nICs9IHN0YXRlLnNyYy5zbGljZShzdGFydCwgc3RhdGUucG9zKTsgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHN0YXRlLmxldmVsID49IHN0YXRlLm9wdGlvbnMubWF4TmVzdGluZykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIHN0YXJ0Q291bnQ7XG4gIHN0YWNrID0gWyBzdGFydENvdW50IF07XG5cbiAgd2hpbGUgKHN0YXRlLnBvcyA8IG1heCkge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpID09PSBtYXJrZXIpIHtcbiAgICAgIHJlcyA9IHNjYW5EZWxpbXMoc3RhdGUsIHN0YXRlLnBvcyk7XG4gICAgICBjb3VudCA9IHJlcy5kZWxpbXM7XG4gICAgICBpZiAocmVzLmNhbl9jbG9zZSkge1xuICAgICAgICBvbGRDb3VudCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBuZXdDb3VudCA9IGNvdW50O1xuXG4gICAgICAgIHdoaWxlIChvbGRDb3VudCAhPT0gbmV3Q291bnQpIHtcbiAgICAgICAgICBpZiAobmV3Q291bnQgPCBvbGRDb3VudCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChvbGRDb3VudCAtIG5ld0NvdW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGFzc2VydChuZXdDb3VudCA+IG9sZENvdW50KVxuICAgICAgICAgIG5ld0NvdW50IC09IG9sZENvdW50O1xuXG4gICAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkgeyBicmVhazsgfVxuICAgICAgICAgIHN0YXRlLnBvcyArPSBvbGRDb3VudDtcbiAgICAgICAgICBvbGRDb3VudCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHN0YXJ0Q291bnQgPSBvbGRDb3VudDtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcy5jYW5fb3BlbikgeyBzdGFjay5wdXNoKGNvdW50KTsgfVxuICAgICAgc3RhdGUucG9zICs9IGNvdW50O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc3RhdGUucGFyc2VyLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kKSB7XG4gICAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kIGVuZGluZyB0YWcsIHNvIGl0J3Mgbm90IHZhbGlkIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZm91bmQhXG4gIHN0YXRlLnBvc01heCA9IHN0YXRlLnBvcztcbiAgc3RhdGUucG9zID0gc3RhcnQgKyBzdGFydENvdW50O1xuXG4gIGlmICghc2lsZW50KSB7XG4gICAgaWYgKHN0YXJ0Q291bnQgPT09IDIgfHwgc3RhcnRDb3VudCA9PT0gMykge1xuICAgICAgc3RhdGUucHVzaCh7IHR5cGU6ICdzdHJvbmdfb3BlbicsIGxldmVsOiBzdGF0ZS5sZXZlbCsrIH0pO1xuICAgIH1cbiAgICBpZiAoc3RhcnRDb3VudCA9PT0gMSB8fCBzdGFydENvdW50ID09PSAzKSB7XG4gICAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ2VtX29wZW4nLCBsZXZlbDogc3RhdGUubGV2ZWwrKyB9KTtcbiAgICB9XG5cbiAgICBzdGF0ZS5wYXJzZXIudG9rZW5pemUoc3RhdGUpO1xuXG4gICAgaWYgKHN0YXJ0Q291bnQgPT09IDEgfHwgc3RhcnRDb3VudCA9PT0gMykge1xuICAgICAgc3RhdGUucHVzaCh7IHR5cGU6ICdlbV9jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICAgIH1cbiAgICBpZiAoc3RhcnRDb3VudCA9PT0gMiB8fCBzdGFydENvdW50ID09PSAzKSB7XG4gICAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ3N0cm9uZ19jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHN0YXRlLnBvc01heCArIHN0YXJ0Q291bnQ7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBodG1sIGVudGl0eSAtICYjMTIzOywgJiN4QUY7LCAmcXVvdDssIC4uLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbnRpdGllcyAgICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbW1vbi9lbnRpdGllcycpO1xudmFyIGhhcyAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaGFzO1xudmFyIGlzVmFsaWRFbnRpdHlDb2RlID0gcmVxdWlyZSgnLi4vY29tbW9uL3V0aWxzJykuaXNWYWxpZEVudGl0eUNvZGU7XG52YXIgZnJvbUNvZGVQb2ludCAgICAgPSByZXF1aXJlKCcuLi9jb21tb24vdXRpbHMnKS5mcm9tQ29kZVBvaW50O1xuXG5cbnZhciBESUdJVEFMX1JFID0gL14mIygoPzp4W2EtZjAtOV17MSw4fXxbMC05XXsxLDh9KSk7L2k7XG52YXIgTkFNRURfUkUgICA9IC9eJihbYS16XVthLXowLTldezEsMzF9KTsvaTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVudGl0eShzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgY29kZSwgbWF0Y2gsIHBvcyA9IHN0YXRlLnBvcywgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDI2LyogJiAqLykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAocG9zICsgMSA8IG1heCkge1xuICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zICsgMSk7XG5cbiAgICBpZiAoY2ggPT09IDB4MjMgLyogIyAqLykge1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChESUdJVEFMX1JFKTtcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgIGNvZGUgPSBtYXRjaFsxXVswXS50b0xvd2VyQ2FzZSgpID09PSAneCcgPyBwYXJzZUludChtYXRjaFsxXS5zbGljZSgxKSwgMTYpIDogcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICBzdGF0ZS5wZW5kaW5nICs9IGlzVmFsaWRFbnRpdHlDb2RlKGNvZGUpID8gZnJvbUNvZGVQb2ludChjb2RlKSA6IGZyb21Db2RlUG9pbnQoMHhGRkZEKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5wb3MgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2ggPSBzdGF0ZS5zcmMuc2xpY2UocG9zKS5tYXRjaChOQU1FRF9SRSk7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgaWYgKGhhcyhlbnRpdGllcywgbWF0Y2hbMV0pKSB7XG4gICAgICAgICAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBlbnRpdGllc1ttYXRjaFsxXV07IH1cbiAgICAgICAgICBzdGF0ZS5wb3MgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSAnJic7IH1cbiAgc3RhdGUucG9zKys7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2NlZXNzIGVzY2FwZWQgY2hhcnMgYW5kIGhhcmRicmVha3NcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRVNDQVBFRCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKSB7IEVTQ0FQRUQucHVzaCgwKTsgfVxuXG4nXFxcXCFcIiMkJSZcXCcoKSorLC4vOjs8PT4/QFtdXl9ge3x9fi0nXG4gIC5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihjaCkgeyBFU0NBUEVEW2NoLmNoYXJDb2RlQXQoMCldID0gMTsgfSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlc2NhcGUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgY2gsIHBvcyA9IHN0YXRlLnBvcywgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDVDLyogXFwgKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG9zKys7XG5cbiAgaWYgKHBvcyA8IG1heCkge1xuICAgIGNoID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcblxuICAgIGlmIChjaCA8IDI1NiAmJiBFU0NBUEVEW2NoXSAhPT0gMCkge1xuICAgICAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmNbcG9zXTsgfVxuICAgICAgc3RhdGUucG9zICs9IDI7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2ggPT09IDB4MEEpIHtcbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdoYXJkYnJlYWsnLFxuICAgICAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcG9zKys7XG4gICAgICAvLyBza2lwIGxlYWRpbmcgd2hpdGVzcGFjZXMgZnJvbSBuZXh0IGxpbmVcbiAgICAgIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyMCkgeyBwb3MrKzsgfVxuXG4gICAgICBzdGF0ZS5wb3MgPSBwb3M7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXNpbGVudCkgeyBzdGF0ZS5wZW5kaW5nICs9ICdcXFxcJzsgfVxuICBzdGF0ZS5wb3MrKztcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBpbmxpbmUgZm9vdG5vdGVzICheWy4uLl0pXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlTGlua0xhYmVsID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2xhYmVsJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb290bm90ZV9pbmxpbmUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgbGFiZWxTdGFydCxcbiAgICAgIGxhYmVsRW5kLFxuICAgICAgZm9vdG5vdGVJZCxcbiAgICAgIG9sZExlbmd0aCxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIHN0YXJ0ID0gc3RhdGUucG9zO1xuXG4gIGlmIChzdGFydCArIDIgPj0gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpICE9PSAweDVFLyogXiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMSkgIT09IDB4NUIvKiBbICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhYmVsU3RhcnQgPSBzdGFydCArIDI7XG4gIGxhYmVsRW5kID0gcGFyc2VMaW5rTGFiZWwoc3RhdGUsIHN0YXJ0ICsgMSk7XG5cbiAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kICddJywgc28gaXQncyBub3QgYSB2YWxpZCBub3RlXG4gIGlmIChsYWJlbEVuZCA8IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gV2UgZm91bmQgdGhlIGVuZCBvZiB0aGUgbGluaywgYW5kIGtub3cgZm9yIGEgZmFjdCBpdCdzIGEgdmFsaWQgbGluaztcbiAgLy8gc28gYWxsIHRoYXQncyBsZWZ0IHRvIGRvIGlzIHRvIGNhbGwgdG9rZW5pemVyLlxuICAvL1xuICBpZiAoIXNpbGVudCkge1xuICAgIGlmICghc3RhdGUuZW52LmZvb3Rub3RlcykgeyBzdGF0ZS5lbnYuZm9vdG5vdGVzID0ge307IH1cbiAgICBpZiAoIXN0YXRlLmVudi5mb290bm90ZXMubGlzdCkgeyBzdGF0ZS5lbnYuZm9vdG5vdGVzLmxpc3QgPSBbXTsgfVxuICAgIGZvb3Rub3RlSWQgPSBzdGF0ZS5lbnYuZm9vdG5vdGVzLmxpc3QubGVuZ3RoO1xuXG4gICAgc3RhdGUucG9zID0gbGFiZWxTdGFydDtcbiAgICBzdGF0ZS5wb3NNYXggPSBsYWJlbEVuZDtcblxuICAgIHN0YXRlLnB1c2goe1xuICAgICAgdHlwZTogJ2Zvb3Rub3RlX3JlZicsXG4gICAgICBpZDogZm9vdG5vdGVJZCxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgIH0pO1xuICAgIHN0YXRlLmxpbmtMZXZlbCsrO1xuICAgIG9sZExlbmd0aCA9IHN0YXRlLnRva2Vucy5sZW5ndGg7XG4gICAgc3RhdGUucGFyc2VyLnRva2VuaXplKHN0YXRlKTtcbiAgICBzdGF0ZS5lbnYuZm9vdG5vdGVzLmxpc3RbZm9vdG5vdGVJZF0gPSB7IHRva2Vuczogc3RhdGUudG9rZW5zLnNwbGljZShvbGRMZW5ndGgpIH07XG4gICAgc3RhdGUubGlua0xldmVsLS07XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBsYWJlbEVuZCArIDE7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBmb290bm90ZSByZWZlcmVuY2VzIChbXi4uLl0pXG5cbid1c2Ugc3RyaWN0JztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvb3Rub3RlX3JlZihzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBsYWJlbCxcbiAgICAgIHBvcyxcbiAgICAgIGZvb3Rub3RlSWQsXG4gICAgICBmb290bm90ZVN1YklkLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3M7XG5cbiAgLy8gc2hvdWxkIGJlIGF0IGxlYXN0IDQgY2hhcnMgLSBcIlteeF1cIlxuICBpZiAoc3RhcnQgKyAzID4gbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGlmICghc3RhdGUuZW52LmZvb3Rub3RlcyB8fCAhc3RhdGUuZW52LmZvb3Rub3Rlcy5yZWZzKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpICE9PSAweDVCLyogWyAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMSkgIT09IDB4NUUvKiBeICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGZvciAocG9zID0gc3RhcnQgKyAyOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjApIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MEEpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4NUQgLyogXSAqLykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBvcyA9PT0gc3RhcnQgKyAyKSB7IHJldHVybiBmYWxzZTsgfSAvLyBubyBlbXB0eSBmb290bm90ZSBsYWJlbHNcbiAgaWYgKHBvcyA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHBvcysrO1xuXG4gIGxhYmVsID0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0ICsgMiwgcG9zIC0gMSk7XG4gIGlmICh0eXBlb2Ygc3RhdGUuZW52LmZvb3Rub3Rlcy5yZWZzWyc6JyArIGxhYmVsXSA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBpZiAoIXN0YXRlLmVudi5mb290bm90ZXMubGlzdCkgeyBzdGF0ZS5lbnYuZm9vdG5vdGVzLmxpc3QgPSBbXTsgfVxuXG4gICAgaWYgKHN0YXRlLmVudi5mb290bm90ZXMucmVmc1snOicgKyBsYWJlbF0gPCAwKSB7XG4gICAgICBmb290bm90ZUlkID0gc3RhdGUuZW52LmZvb3Rub3Rlcy5saXN0Lmxlbmd0aDtcbiAgICAgIHN0YXRlLmVudi5mb290bm90ZXMubGlzdFtmb290bm90ZUlkXSA9IHsgbGFiZWw6IGxhYmVsLCBjb3VudDogMCB9O1xuICAgICAgc3RhdGUuZW52LmZvb3Rub3Rlcy5yZWZzWyc6JyArIGxhYmVsXSA9IGZvb3Rub3RlSWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvb3Rub3RlSWQgPSBzdGF0ZS5lbnYuZm9vdG5vdGVzLnJlZnNbJzonICsgbGFiZWxdO1xuICAgIH1cblxuICAgIGZvb3Rub3RlU3ViSWQgPSBzdGF0ZS5lbnYuZm9vdG5vdGVzLmxpc3RbZm9vdG5vdGVJZF0uY291bnQ7XG4gICAgc3RhdGUuZW52LmZvb3Rub3Rlcy5saXN0W2Zvb3Rub3RlSWRdLmNvdW50Kys7XG5cbiAgICBzdGF0ZS5wdXNoKHtcbiAgICAgIHR5cGU6ICdmb290bm90ZV9yZWYnLFxuICAgICAgaWQ6IGZvb3Rub3RlSWQsXG4gICAgICBzdWJJZDogZm9vdG5vdGVTdWJJZCxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUucG9zID0gcG9zO1xuICBzdGF0ZS5wb3NNYXggPSBtYXg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgaHRtbCB0YWdzXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgSFRNTF9UQUdfUkUgPSByZXF1aXJlKCcuLi9jb21tb24vaHRtbF9yZScpLkhUTUxfVEFHX1JFO1xuXG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGNoKSB7XG4gIC8qZXNsaW50IG5vLWJpdHdpc2U6MCovXG4gIHZhciBsYyA9IGNoIHwgMHgyMDsgLy8gdG8gbG93ZXIgY2FzZVxuICByZXR1cm4gKGxjID49IDB4NjEvKiBhICovKSAmJiAobGMgPD0gMHg3YS8qIHogKi8pO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaHRtbHRhZyhzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBjaCwgbWF0Y2gsIG1heCwgcG9zID0gc3RhdGUucG9zO1xuXG4gIGlmICghc3RhdGUub3B0aW9ucy5odG1sKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIENoZWNrIHN0YXJ0XG4gIG1heCA9IHN0YXRlLnBvc01heDtcbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4M0MvKiA8ICovIHx8XG4gICAgICBwb3MgKyAyID49IG1heCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFF1aWNrIGZhaWwgb24gc2Vjb25kIGNoYXJcbiAgY2ggPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MgKyAxKTtcbiAgaWYgKGNoICE9PSAweDIxLyogISAqLyAmJlxuICAgICAgY2ggIT09IDB4M0YvKiA/ICovICYmXG4gICAgICBjaCAhPT0gMHgyRi8qIC8gKi8gJiZcbiAgICAgICFpc0xldHRlcihjaCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBtYXRjaCA9IHN0YXRlLnNyYy5zbGljZShwb3MpLm1hdGNoKEhUTUxfVEFHX1JFKTtcbiAgaWYgKCFtYXRjaCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnB1c2goe1xuICAgICAgdHlwZTogJ2h0bWx0YWcnLFxuICAgICAgY29udGVudDogc3RhdGUuc3JjLnNsaWNlKHBvcywgcG9zICsgbWF0Y2hbMF0ubGVuZ3RoKSxcbiAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgIH0pO1xuICB9XG4gIHN0YXRlLnBvcyArPSBtYXRjaFswXS5sZW5ndGg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgKytpbnNlcnRlZCB0ZXh0KytcblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlucyhzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBmb3VuZCxcbiAgICAgIHBvcyxcbiAgICAgIHN0YWNrLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3MsXG4gICAgICBsYXN0Q2hhcixcbiAgICAgIG5leHRDaGFyO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCkgIT09IDB4MkIvKiArICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc2lsZW50KSB7IHJldHVybiBmYWxzZTsgfSAvLyBkb24ndCBydW4gYW55IHBhaXJzIGluIHZhbGlkYXRpb24gbW9kZVxuICBpZiAoc3RhcnQgKyA0ID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMSkgIT09IDB4MkIvKiArICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhc3RDaGFyID0gc3RhcnQgPiAwID8gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQgLSAxKSA6IC0xO1xuICBuZXh0Q2hhciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0ICsgMik7XG5cbiAgaWYgKGxhc3RDaGFyID09PSAweDJCLyogKyAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKG5leHRDaGFyID09PSAweDJCLyogKyAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKG5leHRDaGFyID09PSAweDIwIHx8IG5leHRDaGFyID09PSAweDBBKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHBvcyA9IHN0YXJ0ICsgMjtcbiAgd2hpbGUgKHBvcyA8IG1heCAmJiBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpID09PSAweDJCLyogKyAqLykgeyBwb3MrKzsgfVxuICBpZiAocG9zICE9PSBzdGFydCArIDIpIHtcbiAgICAvLyBzZXF1ZW5jZSBvZiAzKyBtYXJrZXJzIHRha2luZyBhcyBsaXRlcmFsLCBzYW1lIGFzIGluIGEgZW1waGFzaXNcbiAgICBzdGF0ZS5wb3MgKz0gcG9zIC0gc3RhcnQ7XG4gICAgaWYgKCFzaWxlbnQpIHsgc3RhdGUucGVuZGluZyArPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQsIHBvcyk7IH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgMjtcbiAgc3RhY2sgPSAxO1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgKyAxIDwgbWF4KSB7XG4gICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcykgPT09IDB4MkIvKiArICovKSB7XG4gICAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zICsgMSkgPT09IDB4MkIvKiArICovKSB7XG4gICAgICAgIGxhc3RDaGFyID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zIC0gMSk7XG4gICAgICAgIG5leHRDaGFyID0gc3RhdGUucG9zICsgMiA8IG1heCA/IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcyArIDIpIDogLTE7XG4gICAgICAgIGlmIChuZXh0Q2hhciAhPT0gMHgyQi8qICsgKi8gJiYgbGFzdENoYXIgIT09IDB4MkIvKiArICovKSB7XG4gICAgICAgICAgaWYgKGxhc3RDaGFyICE9PSAweDIwICYmIGxhc3RDaGFyICE9PSAweDBBKSB7XG4gICAgICAgICAgICAvLyBjbG9zaW5nICcrKydcbiAgICAgICAgICAgIHN0YWNrLS07XG4gICAgICAgICAgfSBlbHNlIGlmIChuZXh0Q2hhciAhPT0gMHgyMCAmJiBuZXh0Q2hhciAhPT0gMHgwQSkge1xuICAgICAgICAgICAgLy8gb3BlbmluZyAnKysnXG4gICAgICAgICAgICBzdGFjaysrO1xuICAgICAgICAgIH0gLy8gZWxzZSB7XG4gICAgICAgICAgICAvLyAgLy8gc3RhbmRhbG9uZSAnICsrICcgaW5kZW50ZWQgd2l0aCBzcGFjZXNcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICBpZiAoc3RhY2sgPD0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGUucGFyc2VyLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kKSB7XG4gICAgLy8gcGFyc2VyIGZhaWxlZCB0byBmaW5kIGVuZGluZyB0YWcsIHNvIGl0J3Mgbm90IHZhbGlkIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gZm91bmQhXG4gIHN0YXRlLnBvc01heCA9IHN0YXRlLnBvcztcbiAgc3RhdGUucG9zID0gc3RhcnQgKyAyO1xuXG4gIGlmICghc2lsZW50KSB7XG4gICAgc3RhdGUucHVzaCh7IHR5cGU6ICdpbnNfb3BlbicsIGxldmVsOiBzdGF0ZS5sZXZlbCsrIH0pO1xuICAgIHN0YXRlLnBhcnNlci50b2tlbml6ZShzdGF0ZSk7XG4gICAgc3RhdGUucHVzaCh7IHR5cGU6ICdpbnNfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHN0YXRlLnBvc01heCArIDI7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2VzcyBbbGlua3NdKDx0bz4gXCJzdHVmZlwiKVxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwYXJzZUxpbmtMYWJlbCAgICAgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvcGFyc2VfbGlua19sYWJlbCcpO1xudmFyIHBhcnNlTGlua0Rlc3RpbmF0aW9uID0gcmVxdWlyZSgnLi4vaGVscGVycy9wYXJzZV9saW5rX2Rlc3RpbmF0aW9uJyk7XG52YXIgcGFyc2VMaW5rVGl0bGUgICAgICAgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3BhcnNlX2xpbmtfdGl0bGUnKTtcbnZhciBub3JtYWxpemVSZWZlcmVuY2UgICA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbm9ybWFsaXplX3JlZmVyZW5jZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGlua3Moc3RhdGUsIHNpbGVudCkge1xuICB2YXIgbGFiZWxTdGFydCxcbiAgICAgIGxhYmVsRW5kLFxuICAgICAgbGFiZWwsXG4gICAgICBocmVmLFxuICAgICAgdGl0bGUsXG4gICAgICBwb3MsXG4gICAgICByZWYsXG4gICAgICBjb2RlLFxuICAgICAgaXNJbWFnZSA9IGZhbHNlLFxuICAgICAgb2xkUG9zID0gc3RhdGUucG9zLFxuICAgICAgbWF4ID0gc3RhdGUucG9zTWF4LFxuICAgICAgc3RhcnQgPSBzdGF0ZS5wb3MsXG4gICAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCk7XG5cbiAgaWYgKG1hcmtlciA9PT0gMHgyMS8qICEgKi8pIHtcbiAgICBpc0ltYWdlID0gdHJ1ZTtcbiAgICBtYXJrZXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdCgrK3N0YXJ0KTtcbiAgfVxuXG4gIGlmIChtYXJrZXIgIT09IDB4NUIvKiBbICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc3RhdGUubGV2ZWwgPj0gc3RhdGUub3B0aW9ucy5tYXhOZXN0aW5nKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGxhYmVsU3RhcnQgPSBzdGFydCArIDE7XG4gIGxhYmVsRW5kID0gcGFyc2VMaW5rTGFiZWwoc3RhdGUsIHN0YXJ0KTtcblxuICAvLyBwYXJzZXIgZmFpbGVkIHRvIGZpbmQgJ10nLCBzbyBpdCdzIG5vdCBhIHZhbGlkIGxpbmtcbiAgaWYgKGxhYmVsRW5kIDwgMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBsYWJlbEVuZCArIDE7XG4gIGlmIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgyOC8qICggKi8pIHtcbiAgICAvL1xuICAgIC8vIElubGluZSBsaW5rXG4gICAgLy9cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgIF5eIHNraXBwaW5nIHRoZXNlIHNwYWNlc1xuICAgIHBvcysrO1xuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG4gICAgaWYgKHBvcyA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBbbGlua10oICA8aHJlZj4gIFwidGl0bGVcIiAgKVxuICAgIC8vICAgICAgICAgIF5eXl5eXiBwYXJzaW5nIGxpbmsgZGVzdGluYXRpb25cbiAgICBzdGFydCA9IHBvcztcbiAgICBpZiAocGFyc2VMaW5rRGVzdGluYXRpb24oc3RhdGUsIHBvcykpIHtcbiAgICAgIGhyZWYgPSBzdGF0ZS5saW5rQ29udGVudDtcbiAgICAgIHBvcyA9IHN0YXRlLnBvcztcbiAgICB9IGVsc2Uge1xuICAgICAgaHJlZiA9ICcnO1xuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgXl4gc2tpcHBpbmcgdGhlc2Ugc3BhY2VzXG4gICAgc3RhcnQgPSBwb3M7XG4gICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgIGNvZGUgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGNvZGUgIT09IDB4MjAgJiYgY29kZSAhPT0gMHgwQSkgeyBicmVhazsgfVxuICAgIH1cblxuICAgIC8vIFtsaW5rXSggIDxocmVmPiAgXCJ0aXRsZVwiICApXG4gICAgLy8gICAgICAgICAgICAgICAgICBeXl5eXl5eIHBhcnNpbmcgbGluayB0aXRsZVxuICAgIGlmIChwb3MgPCBtYXggJiYgc3RhcnQgIT09IHBvcyAmJiBwYXJzZUxpbmtUaXRsZShzdGF0ZSwgcG9zKSkge1xuICAgICAgdGl0bGUgPSBzdGF0ZS5saW5rQ29udGVudDtcbiAgICAgIHBvcyA9IHN0YXRlLnBvcztcblxuICAgICAgLy8gW2xpbmtdKCAgPGhyZWY+ICBcInRpdGxlXCIgIClcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIF5eIHNraXBwaW5nIHRoZXNlIHNwYWNlc1xuICAgICAgZm9yICg7IHBvcyA8IG1heDsgcG9zKyspIHtcbiAgICAgICAgY29kZSA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGUgPSAnJztcbiAgICB9XG5cbiAgICBpZiAocG9zID49IG1heCB8fCBzdGF0ZS5zcmMuY2hhckNvZGVBdChwb3MpICE9PSAweDI5LyogKSAqLykge1xuICAgICAgc3RhdGUucG9zID0gb2xkUG9zO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwb3MrKztcbiAgfSBlbHNlIHtcbiAgICAvL1xuICAgIC8vIExpbmsgcmVmZXJlbmNlXG4gICAgLy9cblxuICAgIC8vIGRvIG5vdCBhbGxvdyBuZXN0ZWQgcmVmZXJlbmNlIGxpbmtzXG4gICAgaWYgKHN0YXRlLmxpbmtMZXZlbCA+IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyBbZm9vXSAgW2Jhcl1cbiAgICAvLyAgICAgIF5eIG9wdGlvbmFsIHdoaXRlc3BhY2UgKGNhbiBpbmNsdWRlIG5ld2xpbmVzKVxuICAgIGZvciAoOyBwb3MgPCBtYXg7IHBvcysrKSB7XG4gICAgICBjb2RlID0gc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmIChjb2RlICE9PSAweDIwICYmIGNvZGUgIT09IDB4MEEpIHsgYnJlYWs7IH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4NUIvKiBbICovKSB7XG4gICAgICBzdGFydCA9IHBvcyArIDE7XG4gICAgICBwb3MgPSBwYXJzZUxpbmtMYWJlbChzdGF0ZSwgcG9zKTtcbiAgICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgICBsYWJlbCA9IHN0YXRlLnNyYy5zbGljZShzdGFydCwgcG9zKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9zID0gc3RhcnQgLSAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvdmVycyBsYWJlbCA9PT0gJycgYW5kIGxhYmVsID09PSB1bmRlZmluZWRcbiAgICAvLyAoY29sbGFwc2VkIHJlZmVyZW5jZSBsaW5rIGFuZCBzaG9ydGN1dCByZWZlcmVuY2UgbGluayByZXNwZWN0aXZlbHkpXG4gICAgaWYgKCFsYWJlbCkgeyBsYWJlbCA9IHN0YXRlLnNyYy5zbGljZShsYWJlbFN0YXJ0LCBsYWJlbEVuZCk7IH1cblxuICAgIHJlZiA9IHN0YXRlLmVudi5yZWZlcmVuY2VzW25vcm1hbGl6ZVJlZmVyZW5jZShsYWJlbCldO1xuICAgIGlmICghcmVmKSB7XG4gICAgICBzdGF0ZS5wb3MgPSBvbGRQb3M7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhyZWYgPSByZWYuaHJlZjtcbiAgICB0aXRsZSA9IHJlZi50aXRsZTtcbiAgfVxuXG4gIC8vXG4gIC8vIFdlIGZvdW5kIHRoZSBlbmQgb2YgdGhlIGxpbmssIGFuZCBrbm93IGZvciBhIGZhY3QgaXQncyBhIHZhbGlkIGxpbms7XG4gIC8vIHNvIGFsbCB0aGF0J3MgbGVmdCB0byBkbyBpcyB0byBjYWxsIHRva2VuaXplci5cbiAgLy9cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBzdGF0ZS5wb3MgPSBsYWJlbFN0YXJ0O1xuICAgIHN0YXRlLnBvc01heCA9IGxhYmVsRW5kO1xuXG4gICAgaWYgKGlzSW1hZ2UpIHtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICBzcmM6IGhyZWYsXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgYWx0OiBzdGF0ZS5zcmMuc3Vic3RyKGxhYmVsU3RhcnQsIGxhYmVsRW5kIC0gbGFiZWxTdGFydCksXG4gICAgICAgIGxldmVsOiBzdGF0ZS5sZXZlbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlua19vcGVuJyxcbiAgICAgICAgaHJlZjogaHJlZixcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWwrK1xuICAgICAgfSk7XG4gICAgICBzdGF0ZS5saW5rTGV2ZWwrKztcbiAgICAgIHN0YXRlLnBhcnNlci50b2tlbml6ZShzdGF0ZSk7XG4gICAgICBzdGF0ZS5saW5rTGV2ZWwtLTtcbiAgICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnbGlua19jbG9zZScsIGxldmVsOiAtLXN0YXRlLmxldmVsIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHBvcztcbiAgc3RhdGUucG9zTWF4ID0gbWF4O1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBQcm9jZXNzID09aGlnaGxpZ2h0ZWQgdGV4dD09XG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWwoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgZm91bmQsXG4gICAgICBwb3MsXG4gICAgICBzdGFjayxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIHN0YXJ0ID0gc3RhdGUucG9zLFxuICAgICAgbGFzdENoYXIsXG4gICAgICBuZXh0Q2hhcjtcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpICE9PSAweDNELyogPSAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gZG9uJ3QgcnVuIGFueSBwYWlycyBpbiB2YWxpZGF0aW9uIG1vZGVcbiAgaWYgKHN0YXJ0ICsgNCA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCArIDEpICE9PSAweDNELyogPSAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLmxldmVsID49IHN0YXRlLm9wdGlvbnMubWF4TmVzdGluZykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBsYXN0Q2hhciA9IHN0YXJ0ID4gMCA/IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXJ0IC0gMSkgOiAtMTtcbiAgbmV4dENoYXIgPSBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCArIDIpO1xuXG4gIGlmIChsYXN0Q2hhciA9PT0gMHgzRC8qID0gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChuZXh0Q2hhciA9PT0gMHgzRC8qID0gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChuZXh0Q2hhciA9PT0gMHgyMCB8fCBuZXh0Q2hhciA9PT0gMHgwQSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBwb3MgPSBzdGFydCArIDI7XG4gIHdoaWxlIChwb3MgPCBtYXggJiYgc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSA9PT0gMHgzRC8qID0gKi8pIHsgcG9zKys7IH1cbiAgaWYgKHBvcyAhPT0gc3RhcnQgKyAyKSB7XG4gICAgLy8gc2VxdWVuY2Ugb2YgMysgbWFya2VycyB0YWtpbmcgYXMgbGl0ZXJhbCwgc2FtZSBhcyBpbiBhIGVtcGhhc2lzXG4gICAgc3RhdGUucG9zICs9IHBvcyAtIHN0YXJ0O1xuICAgIGlmICghc2lsZW50KSB7IHN0YXRlLnBlbmRpbmcgKz0gc3RhdGUuc3JjLnNsaWNlKHN0YXJ0LCBwb3MpOyB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIDI7XG4gIHN0YWNrID0gMTtcblxuICB3aGlsZSAoc3RhdGUucG9zICsgMSA8IG1heCkge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpID09PSAweDNELyogPSAqLykge1xuICAgICAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcyArIDEpID09PSAweDNELyogPSAqLykge1xuICAgICAgICBsYXN0Q2hhciA9IHN0YXRlLnNyYy5jaGFyQ29kZUF0KHN0YXRlLnBvcyAtIDEpO1xuICAgICAgICBuZXh0Q2hhciA9IHN0YXRlLnBvcyArIDIgPCBtYXggPyBzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MgKyAyKSA6IC0xO1xuICAgICAgICBpZiAobmV4dENoYXIgIT09IDB4M0QvKiA9ICovICYmIGxhc3RDaGFyICE9PSAweDNELyogPSAqLykge1xuICAgICAgICAgIGlmIChsYXN0Q2hhciAhPT0gMHgyMCAmJiBsYXN0Q2hhciAhPT0gMHgwQSkge1xuICAgICAgICAgICAgLy8gY2xvc2luZyAnPT0nXG4gICAgICAgICAgICBzdGFjay0tO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dENoYXIgIT09IDB4MjAgJiYgbmV4dENoYXIgIT09IDB4MEEpIHtcbiAgICAgICAgICAgIC8vIG9wZW5pbmcgJz09J1xuICAgICAgICAgICAgc3RhY2srKztcbiAgICAgICAgICB9IC8vIGVsc2Uge1xuICAgICAgICAgICAgLy8gIC8vIHN0YW5kYWxvbmUgJyA9PSAnIGluZGVudGVkIHdpdGggc3BhY2VzXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgaWYgKHN0YWNrIDw9IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRlLnBhcnNlci5za2lwVG9rZW4oc3RhdGUpO1xuICB9XG5cbiAgaWYgKCFmb3VuZCkge1xuICAgIC8vIHBhcnNlciBmYWlsZWQgdG8gZmluZCBlbmRpbmcgdGFnLCBzbyBpdCdzIG5vdCB2YWxpZCBlbXBoYXNpc1xuICAgIHN0YXRlLnBvcyA9IHN0YXJ0O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGZvdW5kIVxuICBzdGF0ZS5wb3NNYXggPSBzdGF0ZS5wb3M7XG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgMjtcblxuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnB1c2goeyB0eXBlOiAnbWFya19vcGVuJywgbGV2ZWw6IHN0YXRlLmxldmVsKysgfSk7XG4gICAgc3RhdGUucGFyc2VyLnRva2VuaXplKHN0YXRlKTtcbiAgICBzdGF0ZS5wdXNoKHsgdHlwZTogJ21hcmtfY2xvc2UnLCBsZXZlbDogLS1zdGF0ZS5sZXZlbCB9KTtcbiAgfVxuXG4gIHN0YXRlLnBvcyA9IHN0YXRlLnBvc01heCArIDI7XG4gIHN0YXRlLnBvc01heCA9IG1heDtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiLy8gUHJvY2Vlc3MgJ1xcbidcblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5ld2xpbmUoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgcG1heCwgbWF4LCBwb3MgPSBzdGF0ZS5wb3M7XG5cbiAgaWYgKHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgIT09IDB4MEEvKiBcXG4gKi8pIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcG1heCA9IHN0YXRlLnBlbmRpbmcubGVuZ3RoIC0gMTtcbiAgbWF4ID0gc3RhdGUucG9zTWF4O1xuXG4gIC8vICcgIFxcbicgLT4gaGFyZGJyZWFrXG4gIC8vIExvb2t1cCBpbiBwZW5kaW5nIGNoYXJzIGlzIGJhZCBwcmFjdGljZSEgRG9uJ3QgY29weSB0byBvdGhlciBydWxlcyFcbiAgLy8gUGVuZGluZyBzdHJpbmcgaXMgc3RvcmVkIGluIGNvbmNhdCBtb2RlLCBpbmRleGVkIGxvb2t1cHMgd2lsbCBjYXVzZVxuICAvLyBjb252ZXJ0aW9uIHRvIGZsYXQgbW9kZS5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBpZiAocG1heCA+PSAwICYmIHN0YXRlLnBlbmRpbmcuY2hhckNvZGVBdChwbWF4KSA9PT0gMHgyMCkge1xuICAgICAgaWYgKHBtYXggPj0gMSAmJiBzdGF0ZS5wZW5kaW5nLmNoYXJDb2RlQXQocG1heCAtIDEpID09PSAweDIwKSB7XG4gICAgICAgIHN0YXRlLnBlbmRpbmcgPSBzdGF0ZS5wZW5kaW5nLnJlcGxhY2UoLyArJC8sICcnKTtcbiAgICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2hhcmRicmVhaycsXG4gICAgICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucGVuZGluZyA9IHN0YXRlLnBlbmRpbmcuc2xpY2UoMCwgLTEpO1xuICAgICAgICBzdGF0ZS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnc29mdGJyZWFrJyxcbiAgICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucHVzaCh7XG4gICAgICAgIHR5cGU6ICdzb2Z0YnJlYWsnLFxuICAgICAgICBsZXZlbDogc3RhdGUubGV2ZWxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHBvcysrO1xuXG4gIC8vIHNraXAgaGVhZGluZyBzcGFjZXMgZm9yIG5leHQgbGluZVxuICB3aGlsZSAocG9zIDwgbWF4ICYmIHN0YXRlLnNyYy5jaGFyQ29kZUF0KHBvcykgPT09IDB4MjApIHsgcG9zKys7IH1cblxuICBzdGF0ZS5wb3MgPSBwb3M7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIElubGluZSBwYXJzZXIgc3RhdGVcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmZ1bmN0aW9uIFN0YXRlSW5saW5lKHNyYywgcGFyc2VySW5saW5lLCBvcHRpb25zLCBlbnYsIG91dFRva2Vucykge1xuICB0aGlzLnNyYyA9IHNyYztcbiAgdGhpcy5lbnYgPSBlbnY7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMucGFyc2VyID0gcGFyc2VySW5saW5lO1xuICB0aGlzLnRva2VucyA9IG91dFRva2VucztcbiAgdGhpcy5wb3MgPSAwO1xuICB0aGlzLnBvc01heCA9IHRoaXMuc3JjLmxlbmd0aDtcbiAgdGhpcy5sZXZlbCA9IDA7XG4gIHRoaXMucGVuZGluZyA9ICcnO1xuICB0aGlzLnBlbmRpbmdMZXZlbCA9IDA7XG5cbiAgdGhpcy5jYWNoZSA9IFtdOyAgICAgICAgLy8gU3RvcmVzIHsgc3RhcnQ6IGVuZCB9IHBhaXJzLiBVc2VmdWwgZm9yIGJhY2t0cmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpbWl6YXRpb24gb2YgcGFpcnMgcGFyc2UgKGVtcGhhc2lzLCBzdHJpa2VzKS5cblxuICAvLyBMaW5rIHBhcnNlciBzdGF0ZSB2YXJzXG5cbiAgdGhpcy5pc0luTGFiZWwgPSBmYWxzZTsgLy8gU2V0IHRydWUgd2hlbiBzZWVrIGxpbmsgbGFiZWwgLSB3ZSBzaG91bGQgZGlzYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInBhaXJlZFwiIHJ1bGVzIChlbXBoYXNpcywgc3RyaWtlcykgdG8gbm90IHNraXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFpbGluZyBgXWBcblxuICB0aGlzLmxpbmtMZXZlbCA9IDA7ICAgICAvLyBJbmNyZW1lbnQgZm9yIGVhY2ggbmVzdGluZyBsaW5rLiBVc2VkIHRvIHByZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmVzdGluZyBpbiBkZWZpbml0aW9uc1xuXG4gIHRoaXMubGlua0NvbnRlbnQgPSAnJzsgIC8vIFRlbXBvcmFyeSBzdG9yYWdlIGZvciBsaW5rIHVybFxuXG4gIHRoaXMubGFiZWxVbm1hdGNoZWRTY29wZXMgPSAwOyAvLyBUcmFjayB1bnBhaXJlZCBgW2AgZm9yIGxpbmsgbGFiZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAoYmFja3RyYWNrIG9wdGltaXphdGlvbilcbn1cblxuXG4vLyBGbHVzaCBwZW5kaW5nIHRleHRcbi8vXG5TdGF0ZUlubGluZS5wcm90b3R5cGUucHVzaFBlbmRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudG9rZW5zLnB1c2goe1xuICAgIHR5cGU6ICd0ZXh0JyxcbiAgICBjb250ZW50OiB0aGlzLnBlbmRpbmcsXG4gICAgbGV2ZWw6IHRoaXMucGVuZGluZ0xldmVsXG4gIH0pO1xuICB0aGlzLnBlbmRpbmcgPSAnJztcbn07XG5cblxuLy8gUHVzaCBuZXcgdG9rZW4gdG8gXCJzdHJlYW1cIi5cbi8vIElmIHBlbmRpbmcgdGV4dCBleGlzdHMgLSBmbHVzaCBpdCBhcyB0ZXh0IHRva2VuXG4vL1xuU3RhdGVJbmxpbmUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgaWYgKHRoaXMucGVuZGluZykge1xuICAgIHRoaXMucHVzaFBlbmRpbmcoKTtcbiAgfVxuXG4gIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICB0aGlzLnBlbmRpbmdMZXZlbCA9IHRoaXMubGV2ZWw7XG59O1xuXG5cbi8vIFN0b3JlIHZhbHVlIHRvIGNhY2hlLlxuLy8gISEhIEltcGxlbWVudGF0aW9uIGhhcyBwYXJzZXItc3BlY2lmaWMgb3B0aW1pemF0aW9uc1xuLy8gISEhIGtleXMgTVVTVCBiZSBpbnRlZ2VyLCA+PSAwOyB2YWx1ZXMgTVVTVCBiZSBpbnRlZ2VyLCA+IDBcbi8vXG5TdGF0ZUlubGluZS5wcm90b3R5cGUuY2FjaGVTZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMuY2FjaGUubGVuZ3RoOyBpIDw9IGtleTsgaSsrKSB7XG4gICAgdGhpcy5jYWNoZS5wdXNoKDApO1xuICB9XG5cbiAgdGhpcy5jYWNoZVtrZXldID0gdmFsO1xufTtcblxuXG4vLyBHZXQgY2FjaGUgdmFsdWVcbi8vXG5TdGF0ZUlubGluZS5wcm90b3R5cGUuY2FjaGVHZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXkgPCB0aGlzLmNhY2hlLmxlbmd0aCA/IHRoaXMuY2FjaGVba2V5XSA6IDA7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVJbmxpbmU7XG4iLCIvLyBQcm9jZXNzIH5zdWJzY3JpcHR+XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gc2FtZSBhcyBVTkVTQ0FQRV9NRF9SRSBwbHVzIGEgc3BhY2VcbnZhciBVTkVTQ0FQRV9SRSA9IC9cXFxcKFsgXFxcXCFcIiMkJSYnKCkqKywuXFwvOjs8PT4/QFtcXF1eX2B7fH1+LV0pL2c7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ViKHN0YXRlLCBzaWxlbnQpIHtcbiAgdmFyIGZvdW5kLFxuICAgICAgY29udGVudCxcbiAgICAgIG1heCA9IHN0YXRlLnBvc01heCxcbiAgICAgIHN0YXJ0ID0gc3RhdGUucG9zO1xuXG4gIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGFydCkgIT09IDB4N0UvKiB+ICovKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoc2lsZW50KSB7IHJldHVybiBmYWxzZTsgfSAvLyBkb24ndCBydW4gYW55IHBhaXJzIGluIHZhbGlkYXRpb24gbW9kZVxuICBpZiAoc3RhcnQgKyAyID49IG1heCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHN0YXRlLmxldmVsID49IHN0YXRlLm9wdGlvbnMubWF4TmVzdGluZykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBzdGF0ZS5wb3MgPSBzdGFydCArIDE7XG5cbiAgd2hpbGUgKHN0YXRlLnBvcyA8IG1heCkge1xuICAgIGlmIChzdGF0ZS5zcmMuY2hhckNvZGVBdChzdGF0ZS5wb3MpID09PSAweDdFLyogfiAqLykge1xuICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3RhdGUucGFyc2VyLnNraXBUb2tlbihzdGF0ZSk7XG4gIH1cblxuICBpZiAoIWZvdW5kIHx8IHN0YXJ0ICsgMSA9PT0gc3RhdGUucG9zKSB7XG4gICAgc3RhdGUucG9zID0gc3RhcnQ7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29udGVudCA9IHN0YXRlLnNyYy5zbGljZShzdGFydCArIDEsIHN0YXRlLnBvcyk7XG5cbiAgLy8gZG9uJ3QgYWxsb3cgdW5lc2NhcGVkIHNwYWNlcy9uZXdsaW5lcyBpbnNpZGVcbiAgaWYgKGNvbnRlbnQubWF0Y2goLyhefFteXFxcXF0pKFxcXFxcXFxcKSpcXHMvKSkge1xuICAgIHN0YXRlLnBvcyA9IHN0YXJ0O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIGZvdW5kIVxuICBzdGF0ZS5wb3NNYXggPSBzdGF0ZS5wb3M7XG4gIHN0YXRlLnBvcyA9IHN0YXJ0ICsgMTtcblxuICBpZiAoIXNpbGVudCkge1xuICAgIHN0YXRlLnB1c2goe1xuICAgICAgdHlwZTogJ3N1YicsXG4gICAgICBsZXZlbDogc3RhdGUubGV2ZWwsXG4gICAgICBjb250ZW50OiBjb250ZW50LnJlcGxhY2UoVU5FU0NBUEVfUkUsICckMScpXG4gICAgfSk7XG4gIH1cblxuICBzdGF0ZS5wb3MgPSBzdGF0ZS5wb3NNYXggKyAxO1xuICBzdGF0ZS5wb3NNYXggPSBtYXg7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIFByb2Nlc3MgXnN1cGVyc2NyaXB0XlxuXG4ndXNlIHN0cmljdCc7XG5cbi8vIHNhbWUgYXMgVU5FU0NBUEVfTURfUkUgcGx1cyBhIHNwYWNlXG52YXIgVU5FU0NBUEVfUkUgPSAvXFxcXChbIFxcXFwhXCIjJCUmJygpKissLlxcLzo7PD0+P0BbXFxdXl9ge3x9fi1dKS9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN1cChzdGF0ZSwgc2lsZW50KSB7XG4gIHZhciBmb3VuZCxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBtYXggPSBzdGF0ZS5wb3NNYXgsXG4gICAgICBzdGFydCA9IHN0YXRlLnBvcztcblxuICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhcnQpICE9PSAweDVFLyogXiAqLykgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKHNpbGVudCkgeyByZXR1cm4gZmFsc2U7IH0gLy8gZG9uJ3QgcnVuIGFueSBwYWlycyBpbiB2YWxpZGF0aW9uIG1vZGVcbiAgaWYgKHN0YXJ0ICsgMiA+PSBtYXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChzdGF0ZS5sZXZlbCA+PSBzdGF0ZS5vcHRpb25zLm1heE5lc3RpbmcpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgc3RhdGUucG9zID0gc3RhcnQgKyAxO1xuXG4gIHdoaWxlIChzdGF0ZS5wb3MgPCBtYXgpIHtcbiAgICBpZiAoc3RhdGUuc3JjLmNoYXJDb2RlQXQoc3RhdGUucG9zKSA9PT0gMHg1RS8qIF4gKi8pIHtcbiAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHN0YXRlLnBhcnNlci5za2lwVG9rZW4oc3RhdGUpO1xuICB9XG5cbiAgaWYgKCFmb3VuZCB8fCBzdGFydCArIDEgPT09IHN0YXRlLnBvcykge1xuICAgIHN0YXRlLnBvcyA9IHN0YXJ0O1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnRlbnQgPSBzdGF0ZS5zcmMuc2xpY2Uoc3RhcnQgKyAxLCBzdGF0ZS5wb3MpO1xuXG4gIC8vIGRvbid0IGFsbG93IHVuZXNjYXBlZCBzcGFjZXMvbmV3bGluZXMgaW5zaWRlXG4gIGlmIChjb250ZW50Lm1hdGNoKC8oXnxbXlxcXFxdKShcXFxcXFxcXCkqXFxzLykpIHtcbiAgICBzdGF0ZS5wb3MgPSBzdGFydDtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBmb3VuZCFcbiAgc3RhdGUucG9zTWF4ID0gc3RhdGUucG9zO1xuICBzdGF0ZS5wb3MgPSBzdGFydCArIDE7XG5cbiAgaWYgKCFzaWxlbnQpIHtcbiAgICBzdGF0ZS5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdXAnLFxuICAgICAgbGV2ZWw6IHN0YXRlLmxldmVsLFxuICAgICAgY29udGVudDogY29udGVudC5yZXBsYWNlKFVORVNDQVBFX1JFLCAnJDEnKVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGUucG9zID0gc3RhdGUucG9zTWF4ICsgMTtcbiAgc3RhdGUucG9zTWF4ID0gbWF4O1xuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCIvLyBTa2lwIHRleHQgY2hhcmFjdGVycyBmb3IgdGV4dCB0b2tlbiwgcGxhY2UgdGhvc2UgdG8gcGVuZGluZyBidWZmZXJcbi8vIGFuZCBpbmNyZW1lbnQgY3VycmVudCBwb3NcblxuJ3VzZSBzdHJpY3QnO1xuXG5cbi8vIFJ1bGUgdG8gc2tpcCBwdXJlIHRleHRcbi8vICd7fSQlQH4rPTonIHJlc2VydmVkIGZvciBleHRlbnRpb25zXG5cbmZ1bmN0aW9uIGlzVGVybWluYXRvckNoYXIoY2gpIHtcbiAgc3dpdGNoIChjaCkge1xuICAgIGNhc2UgMHgwQS8qIFxcbiAqLzpcbiAgICBjYXNlIDB4NUMvKiBcXCAqLzpcbiAgICBjYXNlIDB4NjAvKiBgICovOlxuICAgIGNhc2UgMHgyQS8qICogKi86XG4gICAgY2FzZSAweDVGLyogXyAqLzpcbiAgICBjYXNlIDB4NUUvKiBeICovOlxuICAgIGNhc2UgMHg1Qi8qIFsgKi86XG4gICAgY2FzZSAweDVELyogXSAqLzpcbiAgICBjYXNlIDB4MjEvKiAhICovOlxuICAgIGNhc2UgMHgyNi8qICYgKi86XG4gICAgY2FzZSAweDNDLyogPCAqLzpcbiAgICBjYXNlIDB4M0UvKiA+ICovOlxuICAgIGNhc2UgMHg3Qi8qIHsgKi86XG4gICAgY2FzZSAweDdELyogfSAqLzpcbiAgICBjYXNlIDB4MjQvKiAkICovOlxuICAgIGNhc2UgMHgyNS8qICUgKi86XG4gICAgY2FzZSAweDQwLyogQCAqLzpcbiAgICBjYXNlIDB4N0UvKiB+ICovOlxuICAgIGNhc2UgMHgyQi8qICsgKi86XG4gICAgY2FzZSAweDNELyogPSAqLzpcbiAgICBjYXNlIDB4M0EvKiA6ICovOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRleHQoc3RhdGUsIHNpbGVudCkge1xuICB2YXIgcG9zID0gc3RhdGUucG9zO1xuXG4gIHdoaWxlIChwb3MgPCBzdGF0ZS5wb3NNYXggJiYgIWlzVGVybWluYXRvckNoYXIoc3RhdGUuc3JjLmNoYXJDb2RlQXQocG9zKSkpIHtcbiAgICBwb3MrKztcbiAgfVxuXG4gIGlmIChwb3MgPT09IHN0YXRlLnBvcykgeyByZXR1cm4gZmFsc2U7IH1cblxuICBpZiAoIXNpbGVudCkgeyBzdGF0ZS5wZW5kaW5nICs9IHN0YXRlLnNyYy5zbGljZShzdGF0ZS5wb3MsIHBvcyk7IH1cblxuICBzdGF0ZS5wb3MgPSBwb3M7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAocm9vdC5yZXR1cm5FeHBvcnRzR2xvYmFsID0gZmFjdG9yeSgpKTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXHJcbiAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcm9vdFsnQXV0b2xpbmtlciddID0gZmFjdG9yeSgpO1xyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qIVxyXG5cdCAqIEF1dG9saW5rZXIuanNcclxuXHQgKiAwLjE1LjJcclxuXHQgKlxyXG5cdCAqIENvcHlyaWdodChjKSAyMDE1IEdyZWdvcnkgSmFjb2JzIDxncmVnQGdyZWctamFjb2JzLmNvbT5cclxuXHQgKiBNSVQgTGljZW5zZWQuIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0ICpcclxuXHQgKiBodHRwczovL2dpdGh1Yi5jb20vZ3JlZ2phY29icy9BdXRvbGlua2VyLmpzXHJcblx0ICovXHJcblx0LyoqXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXJcclxuXHQgKiBAZXh0ZW5kcyBPYmplY3RcclxuXHQgKiBcclxuXHQgKiBVdGlsaXR5IGNsYXNzIHVzZWQgdG8gcHJvY2VzcyBhIGdpdmVuIHN0cmluZyBvZiB0ZXh0LCBhbmQgd3JhcCB0aGUgVVJMcywgZW1haWwgYWRkcmVzc2VzLCBhbmQgVHdpdHRlciBoYW5kbGVzIGluIFxyXG5cdCAqIHRoZSBhcHByb3ByaWF0ZSBhbmNob3IgKCZsdDthJmd0OykgdGFncyB0byB0dXJuIHRoZW0gaW50byBsaW5rcy5cclxuXHQgKiBcclxuXHQgKiBBbnkgb2YgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBtYXkgYmUgcHJvdmlkZWQgaW4gYW4gT2JqZWN0IChtYXApIHByb3ZpZGVkIHRvIHRoZSBBdXRvbGlua2VyIGNvbnN0cnVjdG9yLCB3aGljaFxyXG5cdCAqIHdpbGwgY29uZmlndXJlIGhvdyB0aGUge0BsaW5rICNsaW5rIGxpbmsoKX0gbWV0aG9kIHdpbGwgcHJvY2VzcyB0aGUgbGlua3MuXHJcblx0ICogXHJcblx0ICogRm9yIGV4YW1wbGU6XHJcblx0ICogXHJcblx0ICogICAgIHZhciBhdXRvbGlua2VyID0gbmV3IEF1dG9saW5rZXIoIHtcclxuXHQgKiAgICAgICAgIG5ld1dpbmRvdyA6IGZhbHNlLFxyXG5cdCAqICAgICAgICAgdHJ1bmNhdGUgIDogMzBcclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgdmFyIGh0bWwgPSBhdXRvbGlua2VyLmxpbmsoIFwiSm9lIHdlbnQgdG8gd3d3LnlhaG9vLmNvbVwiICk7XHJcblx0ICogICAgIC8vIHByb2R1Y2VzOiAnSm9lIHdlbnQgdG8gPGEgaHJlZj1cImh0dHA6Ly93d3cueWFob28uY29tXCI+eWFob28uY29tPC9hPidcclxuXHQgKiBcclxuXHQgKiBcclxuXHQgKiBUaGUge0BsaW5rICNzdGF0aWMtbGluayBzdGF0aWMgbGluaygpfSBtZXRob2QgbWF5IGFsc28gYmUgdXNlZCB0byBpbmxpbmUgb3B0aW9ucyBpbnRvIGEgc2luZ2xlIGNhbGwsIHdoaWNoIG1heVxyXG5cdCAqIGJlIG1vcmUgY29udmVuaWVudCBmb3Igb25lLW9mZiB1c2VzLiBGb3IgZXhhbXBsZTpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGh0bWwgPSBBdXRvbGlua2VyLmxpbmsoIFwiSm9lIHdlbnQgdG8gd3d3LnlhaG9vLmNvbVwiLCB7XHJcblx0ICogICAgICAgICBuZXdXaW5kb3cgOiBmYWxzZSxcclxuXHQgKiAgICAgICAgIHRydW5jYXRlICA6IDMwXHJcblx0ICogICAgIH0gKTtcclxuXHQgKiAgICAgLy8gcHJvZHVjZXM6ICdKb2Ugd2VudCB0byA8YSBocmVmPVwiaHR0cDovL3d3dy55YWhvby5jb21cIj55YWhvby5jb208L2E+J1xyXG5cdCAqIFxyXG5cdCAqIFxyXG5cdCAqICMjIEN1c3RvbSBSZXBsYWNlbWVudHMgb2YgTGlua3NcclxuXHQgKiBcclxuXHQgKiBJZiB0aGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGRvIG5vdCBwcm92aWRlIGVub3VnaCBmbGV4aWJpbGl0eSwgYSB7QGxpbmsgI3JlcGxhY2VGbn0gbWF5IGJlIHByb3ZpZGVkIHRvIGZ1bGx5IGN1c3RvbWl6ZVxyXG5cdCAqIHRoZSBvdXRwdXQgb2YgQXV0b2xpbmtlci4gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb25jZSBmb3IgZWFjaCBVUkwvRW1haWwvVHdpdHRlciBoYW5kbGUgbWF0Y2ggdGhhdCBpcyBlbmNvdW50ZXJlZC5cclxuXHQgKiBcclxuXHQgKiBGb3IgZXhhbXBsZTpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGlucHV0ID0gXCIuLi5cIjsgIC8vIHN0cmluZyB3aXRoIFVSTHMsIEVtYWlsIEFkZHJlc3NlcywgYW5kIFR3aXR0ZXIgSGFuZGxlc1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgdmFyIGxpbmtlZFRleHQgPSBBdXRvbGlua2VyLmxpbmsoIGlucHV0LCB7XHJcblx0ICogICAgICAgICByZXBsYWNlRm4gOiBmdW5jdGlvbiggYXV0b2xpbmtlciwgbWF0Y2ggKSB7XHJcblx0ICogICAgICAgICAgICAgY29uc29sZS5sb2coIFwiaHJlZiA9IFwiLCBtYXRjaC5nZXRBbmNob3JIcmVmKCkgKTtcclxuXHQgKiAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ0ZXh0ID0gXCIsIG1hdGNoLmdldEFuY2hvclRleHQoKSApO1xyXG5cdCAqICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgc3dpdGNoKCBtYXRjaC5nZXRUeXBlKCkgKSB7XHJcblx0ICogICAgICAgICAgICAgICAgIGNhc2UgJ3VybCcgOiBcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInVybDogXCIsIG1hdGNoLmdldFVybCgpICk7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIGlmKCBtYXRjaC5nZXRVcmwoKS5pbmRleE9mKCAnbXlzaXRlLmNvbScgKSA9PT0gLTEgKSB7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhZyA9IGF1dG9saW5rZXIuZ2V0VGFnQnVpbGRlcigpLmJ1aWxkKCBtYXRjaCApOyAgLy8gcmV0dXJucyBhbiBgQXV0b2xpbmtlci5IdG1sVGFnYCBpbnN0YW5jZSwgd2hpY2ggcHJvdmlkZXMgbXV0YXRvciBtZXRob2RzIGZvciBlYXN5IGNoYW5nZXNcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICB0YWcuc2V0QXR0ciggJ3JlbCcsICdub2ZvbGxvdycgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICB0YWcuYWRkQ2xhc3MoICdleHRlcm5hbC1saW5rJyApO1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWc7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAgLy8gbGV0IEF1dG9saW5rZXIgcGVyZm9ybSBpdHMgbm9ybWFsIGFuY2hvciB0YWcgcmVwbGFjZW1lbnRcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICdlbWFpbCcgOlxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0gbWF0Y2guZ2V0RW1haWwoKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVtYWlsOiBcIiwgZW1haWwgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgaWYoIGVtYWlsID09PSBcIm15QG93bi5hZGRyZXNzXCIgKSB7XHJcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgLy8gZG9uJ3QgYXV0by1saW5rIHRoaXMgcGFydGljdWxhciBlbWFpbCBhZGRyZXNzOyBsZWF2ZSBhcy1pc1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAvLyBubyByZXR1cm4gdmFsdWUgd2lsbCBoYXZlIEF1dG9saW5rZXIgcGVyZm9ybSBpdHMgbm9ybWFsIGFuY2hvciB0YWcgcmVwbGFjZW1lbnQgKHNhbWUgYXMgcmV0dXJuaW5nIGB0cnVlYClcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgKiAgICAgICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgICAgIGNhc2UgJ3R3aXR0ZXInIDpcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIHZhciB0d2l0dGVySGFuZGxlID0gbWF0Y2guZ2V0VHdpdHRlckhhbmRsZSgpO1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHR3aXR0ZXJIYW5kbGUgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8YSBocmVmPVwiaHR0cDovL25ld3BsYWNlLnRvLmxpbmsudHdpdHRlci5oYW5kbGVzLnRvL1wiPicgKyB0d2l0dGVySGFuZGxlICsgJzwvYT4nO1xyXG5cdCAqICAgICAgICAgICAgIH1cclxuXHQgKiAgICAgICAgIH1cclxuXHQgKiAgICAgfSApO1xyXG5cdCAqIFxyXG5cdCAqIFxyXG5cdCAqIFRoZSBmdW5jdGlvbiBtYXkgcmV0dXJuIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxyXG5cdCAqIFxyXG5cdCAqIC0gYHRydWVgIChCb29sZWFuKTogQWxsb3cgQXV0b2xpbmtlciB0byByZXBsYWNlIHRoZSBtYXRjaCBhcyBpdCBub3JtYWxseSB3b3VsZC5cclxuXHQgKiAtIGBmYWxzZWAgKEJvb2xlYW4pOiBEbyBub3QgcmVwbGFjZSB0aGUgY3VycmVudCBtYXRjaCBhdCBhbGwgLSBsZWF2ZSBhcy1pcy5cclxuXHQgKiAtIEFueSBTdHJpbmc6IElmIGEgc3RyaW5nIGlzIHJldHVybmVkIGZyb20gdGhlIGZ1bmN0aW9uLCB0aGUgc3RyaW5nIHdpbGwgYmUgdXNlZCBkaXJlY3RseSBhcyB0aGUgcmVwbGFjZW1lbnQgSFRNTCBmb3JcclxuXHQgKiAgIHRoZSBtYXRjaC5cclxuXHQgKiAtIEFuIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWd9IGluc3RhbmNlLCB3aGljaCBjYW4gYmUgdXNlZCB0byBidWlsZC9tb2RpZnkgYW4gSFRNTCB0YWcgYmVmb3JlIHdyaXRpbmcgb3V0IGl0cyBIVE1MIHRleHQuXHJcblx0ICogXHJcblx0ICogQGNvbnN0cnVjdG9yXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IFtjb25maWddIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBBdXRvbGlua2VyIGluc3RhbmNlLCBzcGVjaWZpZWQgaW4gYW4gT2JqZWN0IChtYXApLlxyXG5cdCAqL1xyXG5cdHZhciBBdXRvbGlua2VyID0gZnVuY3Rpb24oIGNmZyApIHtcclxuXHRcdEF1dG9saW5rZXIuVXRpbC5hc3NpZ24oIHRoaXMsIGNmZyApOyAgLy8gYXNzaWduIHRoZSBwcm9wZXJ0aWVzIG9mIGBjZmdgIG9udG8gdGhlIEF1dG9saW5rZXIgaW5zdGFuY2UuIFByb3RvdHlwZSBwcm9wZXJ0aWVzIHdpbGwgYmUgdXNlZCBmb3IgbWlzc2luZyBjb25maWdzLlxyXG5cclxuXHRcdHRoaXMubWF0Y2hWYWxpZGF0b3IgPSBuZXcgQXV0b2xpbmtlci5NYXRjaFZhbGlkYXRvcigpO1xyXG5cdH07XHJcblxyXG5cclxuXHRBdXRvbGlua2VyLnByb3RvdHlwZSA9IHtcclxuXHRcdGNvbnN0cnVjdG9yIDogQXV0b2xpbmtlciwgIC8vIGZpeCBjb25zdHJ1Y3RvciBwcm9wZXJ0eVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gdXJsc1xyXG5cdFx0ICogXHJcblx0XHQgKiBgdHJ1ZWAgaWYgbWlzY2VsbGFuZW91cyBVUkxzIHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IGxpbmtlZCwgYGZhbHNlYCBpZiB0aGV5IHNob3VsZCBub3QgYmUuXHJcblx0XHQgKi9cclxuXHRcdHVybHMgOiB0cnVlLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gZW1haWxcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmIGVtYWlsIGFkZHJlc3NlcyBzaG91bGQgYmUgYXV0b21hdGljYWxseSBsaW5rZWQsIGBmYWxzZWAgaWYgdGhleSBzaG91bGQgbm90IGJlLlxyXG5cdFx0ICovXHJcblx0XHRlbWFpbCA6IHRydWUsXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtCb29sZWFufSB0d2l0dGVyXHJcblx0XHQgKiBcclxuXHRcdCAqIGB0cnVlYCBpZiBUd2l0dGVyIGhhbmRsZXMgKFwiQGV4YW1wbGVcIikgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgbGlua2VkLCBgZmFsc2VgIGlmIHRoZXkgc2hvdWxkIG5vdCBiZS5cclxuXHRcdCAqL1xyXG5cdFx0dHdpdHRlciA6IHRydWUsXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtCb29sZWFufSBuZXdXaW5kb3dcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmIHRoZSBsaW5rcyBzaG91bGQgb3BlbiBpbiBhIG5ldyB3aW5kb3csIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdFx0ICovXHJcblx0XHRuZXdXaW5kb3cgOiB0cnVlLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gc3RyaXBQcmVmaXhcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmICdodHRwOi8vJyBvciAnaHR0cHM6Ly8nIGFuZC9vciB0aGUgJ3d3dy4nIHNob3VsZCBiZSBzdHJpcHBlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgVVJMIGxpbmtzJyB0ZXh0LCBcclxuXHRcdCAqIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdFx0ICovXHJcblx0XHRzdHJpcFByZWZpeCA6IHRydWUsXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtOdW1iZXJ9IHRydW5jYXRlXHJcblx0XHQgKiBcclxuXHRcdCAqIEEgbnVtYmVyIGZvciBob3cgbWFueSBjaGFyYWN0ZXJzIGxvbmcgVVJMcy9lbWFpbHMvdHdpdHRlciBoYW5kbGVzIHNob3VsZCBiZSB0cnVuY2F0ZWQgdG8gaW5zaWRlIHRoZSB0ZXh0IG9mIFxyXG5cdFx0ICogYSBsaW5rLiBJZiB0aGUgVVJML2VtYWlsL3R3aXR0ZXIgaXMgb3ZlciB0aGlzIG51bWJlciBvZiBjaGFyYWN0ZXJzLCBpdCB3aWxsIGJlIHRydW5jYXRlZCB0byB0aGlzIGxlbmd0aCBieSBcclxuXHRcdCAqIGFkZGluZyBhIHR3byBwZXJpb2QgZWxsaXBzaXMgKCcuLicpIHRvIHRoZSBlbmQgb2YgdGhlIHN0cmluZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogRm9yIGV4YW1wbGU6IEEgdXJsIGxpa2UgJ2h0dHA6Ly93d3cueWFob28uY29tL3NvbWUvbG9uZy9wYXRoL3RvL2EvZmlsZScgdHJ1bmNhdGVkIHRvIDI1IGNoYXJhY3RlcnMgbWlnaHQgbG9va1xyXG5cdFx0ICogc29tZXRoaW5nIGxpa2UgdGhpczogJ3lhaG9vLmNvbS9zb21lL2xvbmcvcGF0Li4nXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gY2xhc3NOYW1lXHJcblx0XHQgKiBcclxuXHRcdCAqIEEgQ1NTIGNsYXNzIG5hbWUgdG8gYWRkIHRvIHRoZSBnZW5lcmF0ZWQgbGlua3MuIFRoaXMgY2xhc3Mgd2lsbCBiZSBhZGRlZCB0byBhbGwgbGlua3MsIGFzIHdlbGwgYXMgdGhpcyBjbGFzc1xyXG5cdFx0ICogcGx1cyB1cmwvZW1haWwvdHdpdHRlciBzdWZmaXhlcyBmb3Igc3R5bGluZyB1cmwvZW1haWwvdHdpdHRlciBsaW5rcyBkaWZmZXJlbnRseS5cclxuXHRcdCAqIFxyXG5cdFx0ICogRm9yIGV4YW1wbGUsIGlmIHRoaXMgY29uZmlnIGlzIHByb3ZpZGVkIGFzIFwibXlMaW5rXCIsIHRoZW46XHJcblx0XHQgKiBcclxuXHRcdCAqIC0gVVJMIGxpbmtzIHdpbGwgaGF2ZSB0aGUgQ1NTIGNsYXNzZXM6IFwibXlMaW5rIG15TGluay11cmxcIlxyXG5cdFx0ICogLSBFbWFpbCBsaW5rcyB3aWxsIGhhdmUgdGhlIENTUyBjbGFzc2VzOiBcIm15TGluayBteUxpbmstZW1haWxcIiwgYW5kXHJcblx0XHQgKiAtIFR3aXR0ZXIgbGlua3Mgd2lsbCBoYXZlIHRoZSBDU1MgY2xhc3NlczogXCJteUxpbmsgbXlMaW5rLXR3aXR0ZXJcIlxyXG5cdFx0ICovXHJcblx0XHRjbGFzc05hbWUgOiBcIlwiLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7RnVuY3Rpb259IHJlcGxhY2VGblxyXG5cdFx0ICogXHJcblx0XHQgKiBBIGZ1bmN0aW9uIHRvIGluZGl2aWR1YWxseSBwcm9jZXNzIGVhY2ggVVJML0VtYWlsL1R3aXR0ZXIgbWF0Y2ggZm91bmQgaW4gdGhlIGlucHV0IHN0cmluZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogU2VlIHRoZSBjbGFzcydzIGRlc2NyaXB0aW9uIGZvciB1c2FnZS5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XHJcblx0XHQgKiBcclxuXHRcdCAqIEBjZmcge0F1dG9saW5rZXJ9IHJlcGxhY2VGbi5hdXRvbGlua2VyIFRoZSBBdXRvbGlua2VyIGluc3RhbmNlLCB3aGljaCBtYXkgYmUgdXNlZCB0byByZXRyaWV2ZSBjaGlsZCBvYmplY3RzIGZyb20gKHN1Y2hcclxuXHRcdCAqICAgYXMgdGhlIGluc3RhbmNlJ3Mge0BsaW5rICNnZXRUYWdCdWlsZGVyIHRhZyBidWlsZGVyfSkuXHJcblx0XHQgKiBAY2ZnIHtBdXRvbGlua2VyLm1hdGNoLk1hdGNofSByZXBsYWNlRm4ubWF0Y2ggVGhlIE1hdGNoIGluc3RhbmNlIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGluZm9ybWF0aW9uIGFib3V0IHRoZVxyXG5cdFx0ICogICB7QGxpbmsgQXV0b2xpbmtlci5tYXRjaC5VcmwgVVJMfS97QGxpbmsgQXV0b2xpbmtlci5tYXRjaC5FbWFpbCBlbWFpbH0ve0BsaW5rIEF1dG9saW5rZXIubWF0Y2guVHdpdHRlciBUd2l0dGVyfVxyXG5cdFx0ICogICBtYXRjaCB0aGF0IHRoZSBgcmVwbGFjZUZuYCBpcyBjdXJyZW50bHkgcHJvY2Vzc2luZy5cclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gaHRtbENoYXJhY3RlckVudGl0aWVzUmVnZXhcclxuXHRcdCAqXHJcblx0XHQgKiBUaGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBjb21tb24gSFRNTCBjaGFyYWN0ZXIgZW50aXRpZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIElnbm9yaW5nICZhbXA7IGFzIGl0IGNvdWxkIGJlIHBhcnQgb2YgYSBxdWVyeSBzdHJpbmcgLS0gaGFuZGxpbmcgaXQgc2VwYXJhdGVseS5cclxuXHRcdCAqL1xyXG5cdFx0aHRtbENoYXJhY3RlckVudGl0aWVzUmVnZXg6IC8oJm5ic3A7fCYjMTYwO3wmbHQ7fCYjNjA7fCZndDt8JiM2Mjt8JnF1b3Q7fCYjMzQ7fCYjMzk7KS9naSxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gbWF0Y2hlclJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIFVSTHMsIGVtYWlsIGFkZHJlc3NlcywgYW5kIFR3aXR0ZXIgaGFuZGxlcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaGFzIHRoZSBmb2xsb3dpbmcgY2FwdHVyaW5nIGdyb3VwczpcclxuXHRcdCAqIFxyXG5cdFx0ICogMS4gR3JvdXAgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB0aGVyZSBpcyBhIFR3aXR0ZXIgaGFuZGxlIG1hdGNoIChpLmUuIFxcQHNvbWVUd2l0dGVyVXNlcikuIFNpbXBseSBjaGVjayBmb3IgaXRzIFxyXG5cdFx0ICogICAgZXhpc3RlbmNlIHRvIGRldGVybWluZSBpZiB0aGVyZSBpcyBhIFR3aXR0ZXIgaGFuZGxlIG1hdGNoLiBUaGUgbmV4dCBjb3VwbGUgb2YgY2FwdHVyaW5nIGdyb3VwcyBnaXZlIGluZm9ybWF0aW9uIFxyXG5cdFx0ICogICAgYWJvdXQgdGhlIFR3aXR0ZXIgaGFuZGxlIG1hdGNoLlxyXG5cdFx0ICogMi4gVGhlIHdoaXRlc3BhY2UgY2hhcmFjdGVyIGJlZm9yZSB0aGUgXFxAc2lnbiBpbiBhIFR3aXR0ZXIgaGFuZGxlLiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZXJlIGFyZSBubyBsb29rYmVoaW5kcyBpblxyXG5cdFx0ICogICAgSlMgcmVndWxhciBleHByZXNzaW9ucywgYW5kIGNhbiBiZSB1c2VkIHRvIHJlY29uc3RydWN0IHRoZSBvcmlnaW5hbCBzdHJpbmcgaW4gYSByZXBsYWNlKCkuXHJcblx0XHQgKiAzLiBUaGUgVHdpdHRlciBoYW5kbGUgaXRzZWxmIGluIGEgVHdpdHRlciBtYXRjaC4gSWYgdGhlIG1hdGNoIGlzICdAc29tZVR3aXR0ZXJVc2VyJywgdGhlIGhhbmRsZSBpcyAnc29tZVR3aXR0ZXJVc2VyJy5cclxuXHRcdCAqIDQuIEdyb3VwIHRoYXQgbWF0Y2hlcyBhbiBlbWFpbCBhZGRyZXNzLiBVc2VkIHRvIGRldGVybWluZSBpZiB0aGUgbWF0Y2ggaXMgYW4gZW1haWwgYWRkcmVzcywgYXMgd2VsbCBhcyBob2xkaW5nIHRoZSBmdWxsIFxyXG5cdFx0ICogICAgYWRkcmVzcy4gRXg6ICdtZUBteS5jb20nXHJcblx0XHQgKiA1LiBHcm91cCB0aGF0IG1hdGNoZXMgYSBVUkwgaW4gdGhlIGlucHV0IHRleHQuIEV4OiAnaHR0cDovL2dvb2dsZS5jb20nLCAnd3d3Lmdvb2dsZS5jb20nLCBvciBqdXN0ICdnb29nbGUuY29tJy5cclxuXHRcdCAqICAgIFRoaXMgYWxzbyBpbmNsdWRlcyBhIHBhdGgsIHVybCBwYXJhbWV0ZXJzLCBvciBoYXNoIGFuY2hvcnMuIEV4OiBnb29nbGUuY29tL3BhdGgvdG8vZmlsZT9xMT0xJnEyPTIjbXlBbmNob3JcclxuXHRcdCAqIDYuIEdyb3VwIHRoYXQgbWF0Y2hlcyBhIHByb3RvY29sIFVSTCAoaS5lLiAnaHR0cDovL2dvb2dsZS5jb20nKS4gVGhpcyBpcyB1c2VkIHRvIG1hdGNoIHByb3RvY29sIFVSTHMgd2l0aCBqdXN0IGEgc2luZ2xlXHJcblx0XHQgKiAgICB3b3JkLCBsaWtlICdodHRwOi8vbG9jYWxob3N0Jywgd2hlcmUgd2Ugd29uJ3QgZG91YmxlIGNoZWNrIHRoYXQgdGhlIGRvbWFpbiBuYW1lIGhhcyBhdCBsZWFzdCBvbmUgJy4nIGluIGl0LlxyXG5cdFx0ICogNy4gQSBwcm90b2NvbC1yZWxhdGl2ZSAoJy8vJykgbWF0Y2ggZm9yIHRoZSBjYXNlIG9mIGEgJ3d3dy4nIHByZWZpeGVkIFVSTC4gV2lsbCBiZSBhbiBlbXB0eSBzdHJpbmcgaWYgaXQgaXMgbm90IGEgXHJcblx0XHQgKiAgICBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaC4gV2UgbmVlZCB0byBrbm93IHRoZSBjaGFyYWN0ZXIgYmVmb3JlIHRoZSAnLy8nIGluIG9yZGVyIHRvIGRldGVybWluZSBpZiBpdCBpcyBhIHZhbGlkIG1hdGNoXHJcblx0XHQgKiAgICBvciB0aGUgLy8gd2FzIGluIGEgc3RyaW5nIHdlIGRvbid0IHdhbnQgdG8gYXV0by1saW5rLlxyXG5cdFx0ICogOC4gQSBwcm90b2NvbC1yZWxhdGl2ZSAoJy8vJykgbWF0Y2ggZm9yIHRoZSBjYXNlIG9mIGEga25vd24gVExEIHByZWZpeGVkIFVSTC4gV2lsbCBiZSBhbiBlbXB0eSBzdHJpbmcgaWYgaXQgaXMgbm90IGEgXHJcblx0XHQgKiAgICBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaC4gU2VlICM2IGZvciBtb3JlIGluZm8uIFxyXG5cdFx0ICovXHJcblx0XHRtYXRjaGVyUmVnZXggOiAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0d2l0dGVyUmVnZXggPSAvKF58W15cXHddKUAoXFx3ezEsMTV9KS8sICAgICAgICAgICAgICAvLyBGb3IgbWF0Y2hpbmcgYSB0d2l0dGVyIGhhbmRsZS4gRXg6IEBncmVnb3J5X2phY29ic1xyXG5cclxuXHRcdFx0ICAgIGVtYWlsUmVnZXggPSAvKD86W1xcLTs6Jj1cXCtcXCQsXFx3XFwuXStAKS8sICAgICAgICAgICAgIC8vIHNvbWV0aGluZ0AgZm9yIGVtYWlsIGFkZHJlc3NlcyAoYS5rLmEuIGxvY2FsLXBhcnQpXHJcblxyXG5cdFx0XHQgICAgcHJvdG9jb2xSZWdleCA9IC8oPzpbQS1aYS16XVstLitBLVphLXowLTldKzooPyFbQS1aYS16XVstLitBLVphLXowLTldKzpcXC9cXC8pKD8hXFxkK1xcLz8pKD86XFwvXFwvKT8pLywgIC8vIG1hdGNoIHByb3RvY29sLCBhbGxvdyBpbiBmb3JtYXQgXCJodHRwOi8vXCIgb3IgXCJtYWlsdG86XCIuIEhvd2V2ZXIsIGRvIG5vdCBtYXRjaCB0aGUgZmlyc3QgcGFydCBvZiBzb21ldGhpbmcgbGlrZSAnbGluazpodHRwOi8vd3d3Lmdvb2dsZS5jb20nIChpLmUuIGRvbid0IG1hdGNoIFwibGluazpcIikuIEFsc28sIG1ha2Ugc3VyZSB3ZSBkb24ndCBpbnRlcnByZXQgJ2dvb2dsZS5jb206ODAwMCcgYXMgaWYgJ2dvb2dsZS5jb20nIHdhcyBhIHByb3RvY29sIGhlcmUgKGkuZS4gaWdub3JlIGEgdHJhaWxpbmcgcG9ydCBudW1iZXIgaW4gdGhpcyByZWdleClcclxuXHRcdFx0ICAgIHd3d1JlZ2V4ID0gLyg/Ond3d1xcLikvLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RhcnRpbmcgd2l0aCAnd3d3LidcclxuXHRcdFx0ICAgIGRvbWFpbk5hbWVSZWdleCA9IC9bQS1aYS16MC05XFwuXFwtXSpbQS1aYS16MC05XFwtXS8sICAvLyBhbnl0aGluZyBsb29raW5nIGF0IGFsbCBsaWtlIGEgZG9tYWluLCBub24tdW5pY29kZSBkb21haW5zLCBub3QgZW5kaW5nIGluIGEgcGVyaW9kXHJcblx0XHRcdCAgICB0bGRSZWdleCA9IC9cXC4oPzppbnRlcm5hdGlvbmFsfGNvbnN0cnVjdGlvbnxjb250cmFjdG9yc3xlbnRlcnByaXNlc3xwaG90b2dyYXBoeXxwcm9kdWN0aW9uc3xmb3VuZGF0aW9ufGltbW9iaWxpZW58aW5kdXN0cmllc3xtYW5hZ2VtZW50fHByb3BlcnRpZXN8dGVjaG5vbG9neXxjaHJpc3RtYXN8Y29tbXVuaXR5fGRpcmVjdG9yeXxlZHVjYXRpb258ZXF1aXBtZW50fGluc3RpdHV0ZXxtYXJrZXRpbmd8c29sdXRpb25zfHZhY2F0aW9uc3xiYXJnYWluc3xib3V0aXF1ZXxidWlsZGVyc3xjYXRlcmluZ3xjbGVhbmluZ3xjbG90aGluZ3xjb21wdXRlcnxkZW1vY3JhdHxkaWFtb25kc3xncmFwaGljc3xob2xkaW5nc3xsaWdodGluZ3xwYXJ0bmVyc3xwbHVtYmluZ3xzdXBwbGllc3x0cmFpbmluZ3x2ZW50dXJlc3xhY2FkZW15fGNhcmVlcnN8Y29tcGFueXxjcnVpc2VzfGRvbWFpbnN8ZXhwb3NlZHxmbGlnaHRzfGZsb3Jpc3R8Z2FsbGVyeXxndWl0YXJzfGhvbGlkYXl8a2l0Y2hlbnxuZXVzdGFyfG9raW5hd2F8cmVjaXBlc3xyZW50YWxzfHJldmlld3N8c2hpa3NoYXxzaW5nbGVzfHN1cHBvcnR8c3lzdGVtc3xhZ2VuY3l8YmVybGlufGNhbWVyYXxjZW50ZXJ8Y29mZmVlfGNvbmRvc3xkYXRpbmd8ZXN0YXRlfGV2ZW50c3xleHBlcnR8ZnV0Ym9sfGthdWZlbnxsdXh1cnl8bWFpc29ufG1vbmFzaHxtdXNldW18bmFnb3lhfHBob3Rvc3xyZXBhaXJ8cmVwb3J0fHNvY2lhbHxzdXBwbHl8dGF0dG9vfHRpZW5kYXx0cmF2ZWx8dmlhamVzfHZpbGxhc3x2aXNpb258dm90aW5nfHZveWFnZXxhY3RvcnxidWlsZHxjYXJkc3xjaGVhcHxjb2Rlc3xkYW5jZXxlbWFpbHxnbGFzc3xob3VzZXxtYW5nb3xuaW5qYXxwYXJ0c3xwaG90b3xzaG9lc3xzb2xhcnx0b2RheXx0b2t5b3x0b29sc3x3YXRjaHx3b3Jrc3xhZXJvfGFycGF8YXNpYXxiZXN0fGJpa2V8Ymx1ZXxidXp6fGNhbXB8Y2x1Ynxjb29sfGNvb3B8ZmFybXxmaXNofGdpZnR8Z3VydXxpbmZvfGpvYnN8a2l3aXxrcmVkfGxhbmR8bGltb3xsaW5rfG1lbnV8bW9iaXxtb2RhfG5hbWV8cGljc3xwaW5rfHBvc3R8cXBvbnxyaWNofHJ1aHJ8c2V4eXx0aXBzfHZvdGV8dm90b3x3YW5nfHdpZW58d2lraXx6b25lfGJhcnxiaWR8Yml6fGNhYnxjYXR8Y2VvfGNvbXxlZHV8Z292fGludHxraW18bWlsfG5ldHxvbmx8b3JnfHByb3xwdWJ8cmVkfHRlbHx1bm98d2VkfHh4eHx4eXp8YWN8YWR8YWV8YWZ8YWd8YWl8YWx8YW18YW58YW98YXF8YXJ8YXN8YXR8YXV8YXd8YXh8YXp8YmF8YmJ8YmR8YmV8YmZ8Ymd8Ymh8Yml8Ymp8Ym18Ym58Ym98YnJ8YnN8YnR8YnZ8Ynd8Ynl8Ynp8Y2F8Y2N8Y2R8Y2Z8Y2d8Y2h8Y2l8Y2t8Y2x8Y218Y258Y298Y3J8Y3V8Y3Z8Y3d8Y3h8Y3l8Y3p8ZGV8ZGp8ZGt8ZG18ZG98ZHp8ZWN8ZWV8ZWd8ZXJ8ZXN8ZXR8ZXV8Zml8Zmp8Zmt8Zm18Zm98ZnJ8Z2F8Z2J8Z2R8Z2V8Z2Z8Z2d8Z2h8Z2l8Z2x8Z218Z258Z3B8Z3F8Z3J8Z3N8Z3R8Z3V8Z3d8Z3l8aGt8aG18aG58aHJ8aHR8aHV8aWR8aWV8aWx8aW18aW58aW98aXF8aXJ8aXN8aXR8amV8am18am98anB8a2V8a2d8a2h8a2l8a218a258a3B8a3J8a3d8a3l8a3p8bGF8bGJ8bGN8bGl8bGt8bHJ8bHN8bHR8bHV8bHZ8bHl8bWF8bWN8bWR8bWV8bWd8bWh8bWt8bWx8bW18bW58bW98bXB8bXF8bXJ8bXN8bXR8bXV8bXZ8bXd8bXh8bXl8bXp8bmF8bmN8bmV8bmZ8bmd8bml8bmx8bm98bnB8bnJ8bnV8bnp8b218cGF8cGV8cGZ8cGd8cGh8cGt8cGx8cG18cG58cHJ8cHN8cHR8cHd8cHl8cWF8cmV8cm98cnN8cnV8cnd8c2F8c2J8c2N8c2R8c2V8c2d8c2h8c2l8c2p8c2t8c2x8c218c258c298c3J8c3R8c3V8c3Z8c3h8c3l8c3p8dGN8dGR8dGZ8dGd8dGh8dGp8dGt8dGx8dG18dG58dG98dHB8dHJ8dHR8dHZ8dHd8dHp8dWF8dWd8dWt8dXN8dXl8dXp8dmF8dmN8dmV8dmd8dml8dm58dnV8d2Z8d3N8eWV8eXR8emF8em18encpXFxiLywgICAvLyBtYXRjaCBvdXIga25vd24gdG9wIGxldmVsIGRvbWFpbnMgKFRMRHMpXHJcblxyXG5cdFx0XHQgICAgLy8gQWxsb3cgb3B0aW9uYWwgcGF0aCwgcXVlcnkgc3RyaW5nLCBhbmQgaGFzaCBhbmNob3IsIG5vdCBlbmRpbmcgaW4gdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJzOiBcIj8hOiwuO1wiXHJcblx0XHRcdCAgICAvLyBodHRwOi8vYmxvZy5jb2Rpbmdob3Jyb3IuY29tL3RoZS1wcm9ibGVtLXdpdGgtdXJscy9cclxuXHRcdFx0ICAgIHVybFN1ZmZpeFJlZ2V4ID0gL1tcXC1BLVphLXowLTkrJkAjXFwvJT1+XygpfCckKlxcW1xcXT8hOiwuO10qW1xcLUEtWmEtejAtOSsmQCNcXC8lPX5fKCl8JyQqXFxbXFxdXS87XHJcblxyXG5cdFx0XHRyZXR1cm4gbmV3IFJlZ0V4cCggW1xyXG5cdFx0XHRcdCcoJywgIC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDEsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGNoZWNrIGZvciBhIHR3aXR0ZXIgaGFuZGxlIG1hdGNoLiBVc2UgZ3JvdXAgJDMgZm9yIHRoZSBhY3R1YWwgdHdpdHRlciBoYW5kbGUgdGhvdWdoLiAkMiBtYXkgYmUgdXNlZCB0byByZWNvbnN0cnVjdCB0aGUgb3JpZ2luYWwgc3RyaW5nIGluIGEgcmVwbGFjZSgpIFxyXG5cdFx0XHRcdFx0Ly8gKioqIENhcHR1cmluZyBncm91cCAkMiwgd2hpY2ggbWF0Y2hlcyB0aGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIgYmVmb3JlIHRoZSAnQCcgc2lnbiAobmVlZGVkIGJlY2F1c2Ugb2Ygbm8gbG9va2JlaGluZHMpLCBhbmQgXHJcblx0XHRcdFx0XHQvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQzLCB3aGljaCBtYXRjaGVzIHRoZSBhY3R1YWwgdHdpdHRlciBoYW5kbGVcclxuXHRcdFx0XHRcdHR3aXR0ZXJSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHQnfCcsXHJcblxyXG5cdFx0XHRcdCcoJywgIC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDQsIHdoaWNoIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGFuIGVtYWlsIG1hdGNoXHJcblx0XHRcdFx0XHRlbWFpbFJlZ2V4LnNvdXJjZSxcclxuXHRcdFx0XHRcdGRvbWFpbk5hbWVSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHR0bGRSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHQnfCcsXHJcblxyXG5cdFx0XHRcdCcoJywgIC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDUsIHdoaWNoIGlzIHVzZWQgdG8gbWF0Y2ggYSBVUkxcclxuXHRcdFx0XHRcdCcoPzonLCAvLyBwYXJlbnMgdG8gY292ZXIgbWF0Y2ggZm9yIHByb3RvY29sIChvcHRpb25hbCksIGFuZCBkb21haW5cclxuXHRcdFx0XHRcdFx0JygnLCAgLy8gKioqIENhcHR1cmluZyBncm91cCAkNiwgZm9yIGEgcHJvdG9jb2wtcHJlZml4ZWQgdXJsIChleDogaHR0cDovL2dvb2dsZS5jb20pXHJcblx0XHRcdFx0XHRcdFx0cHJvdG9jb2xSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRcdFx0ZG9tYWluTmFtZVJlZ2V4LnNvdXJjZSxcclxuXHRcdFx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHRcdFx0J3wnLFxyXG5cclxuXHRcdFx0XHRcdFx0Jyg/OicsICAvLyBub24tY2FwdHVyaW5nIHBhcmVuIGZvciBhICd3d3cuJyBwcmVmaXhlZCB1cmwgKGV4OiB3d3cuZ29vZ2xlLmNvbSlcclxuXHRcdFx0XHRcdFx0XHQnKC4/Ly8pPycsICAvLyAqKiogQ2FwdHVyaW5nIGdyb3VwICQ3IGZvciBhbiBvcHRpb25hbCBwcm90b2NvbC1yZWxhdGl2ZSBVUkwuIE11c3QgYmUgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgc3RyaW5nIG9yIHN0YXJ0IHdpdGggYSBub24td29yZCBjaGFyYWN0ZXJcclxuXHRcdFx0XHRcdFx0XHR3d3dSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRcdFx0ZG9tYWluTmFtZVJlZ2V4LnNvdXJjZSxcclxuXHRcdFx0XHRcdFx0JyknLFxyXG5cclxuXHRcdFx0XHRcdFx0J3wnLFxyXG5cclxuXHRcdFx0XHRcdFx0Jyg/OicsICAvLyBub24tY2FwdHVyaW5nIHBhcmVuIGZvciBrbm93biBhIFRMRCB1cmwgKGV4OiBnb29nbGUuY29tKVxyXG5cdFx0XHRcdFx0XHRcdCcoLj8vLyk/JywgIC8vICoqKiBDYXB0dXJpbmcgZ3JvdXAgJDggZm9yIGFuIG9wdGlvbmFsIHByb3RvY29sLXJlbGF0aXZlIFVSTC4gTXVzdCBiZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmcgb3Igc3RhcnQgd2l0aCBhIG5vbi13b3JkIGNoYXJhY3RlclxyXG5cdFx0XHRcdFx0XHRcdGRvbWFpbk5hbWVSZWdleC5zb3VyY2UsXHJcblx0XHRcdFx0XHRcdFx0dGxkUmVnZXguc291cmNlLFxyXG5cdFx0XHRcdFx0XHQnKScsXHJcblx0XHRcdFx0XHQnKScsXHJcblxyXG5cdFx0XHRcdFx0Jyg/OicgKyB1cmxTdWZmaXhSZWdleC5zb3VyY2UgKyAnKT8nLCAgLy8gbWF0Y2ggZm9yIHBhdGgsIHF1ZXJ5IHN0cmluZywgYW5kL29yIGhhc2ggYW5jaG9yIC0gb3B0aW9uYWxcclxuXHRcdFx0XHQnKSdcclxuXHRcdFx0XS5qb2luKCBcIlwiICksICdnaScgKTtcclxuXHRcdH0gKSgpLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBjaGFyQmVmb3JlUHJvdG9jb2xSZWxNYXRjaFJlZ2V4XHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byByZXRyaWV2ZSB0aGUgY2hhcmFjdGVyIGJlZm9yZSBhIHByb3RvY29sLXJlbGF0aXZlIFVSTCBtYXRjaC5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBpcyB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlIHtAbGluayAjbWF0Y2hlclJlZ2V4fSwgd2hpY2ggbmVlZHMgdG8gZ3JhYiB0aGUgY2hhcmFjdGVyIGJlZm9yZSBhIHByb3RvY29sLXJlbGF0aXZlXHJcblx0XHQgKiAnLy8nIGR1ZSB0byB0aGUgbGFjayBvZiBhIG5lZ2F0aXZlIGxvb2stYmVoaW5kIGluIEphdmFTY3JpcHQgcmVndWxhciBleHByZXNzaW9ucy4gVGhlIGNoYXJhY3RlciBiZWZvcmUgdGhlIG1hdGNoIGlzIHN0cmlwcGVkXHJcblx0XHQgKiBmcm9tIHRoZSBVUkwuXHJcblx0XHQgKi9cclxuXHRcdGNoYXJCZWZvcmVQcm90b2NvbFJlbE1hdGNoUmVnZXggOiAvXiguKT9cXC9cXC8vLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7QXV0b2xpbmtlci5NYXRjaFZhbGlkYXRvcn0gbWF0Y2hWYWxpZGF0b3JcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIE1hdGNoVmFsaWRhdG9yIG9iamVjdCwgdXNlZCB0byBmaWx0ZXIgb3V0IGFueSBmYWxzZSBwb3NpdGl2ZXMgZnJvbSB0aGUge0BsaW5rICNtYXRjaGVyUmVnZXh9LiBTZWVcclxuXHRcdCAqIHtAbGluayBBdXRvbGlua2VyLk1hdGNoVmFsaWRhdG9yfSBmb3IgZGV0YWlscy5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7QXV0b2xpbmtlci5IdG1sUGFyc2VyfSBodG1sUGFyc2VyXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSBIdG1sUGFyc2VyIGluc3RhbmNlIHVzZWQgdG8gc2tpcCBvdmVyIEhUTUwgdGFncywgd2hpbGUgZmluZGluZyB0ZXh0IG5vZGVzIHRvIHByb2Nlc3MuIFRoaXMgaXMgbGF6aWx5IGluc3RhbnRpYXRlZFxyXG5cdFx0ICogaW4gdGhlIHtAbGluayAjZ2V0SHRtbFBhcnNlcn0gbWV0aG9kLlxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtBdXRvbGlua2VyLkFuY2hvclRhZ0J1aWxkZXJ9IHRhZ0J1aWxkZXJcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIEFuY2hvclRhZ0J1aWxkZXIgaW5zdGFuY2UgdXNlZCB0byBidWlsZCB0aGUgVVJML2VtYWlsL1R3aXR0ZXIgcmVwbGFjZW1lbnQgYW5jaG9yIHRhZ3MuIFRoaXMgaXMgbGF6aWx5IGluc3RhbnRpYXRlZFxyXG5cdFx0ICogaW4gdGhlIHtAbGluayAjZ2V0VGFnQnVpbGRlcn0gbWV0aG9kLlxyXG5cdFx0ICovXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQXV0b21hdGljYWxseSBsaW5rcyBVUkxzLCBlbWFpbCBhZGRyZXNzZXMsIGFuZCBUd2l0dGVyIGhhbmRsZXMgZm91bmQgaW4gdGhlIGdpdmVuIGNodW5rIG9mIEhUTUwuIFxyXG5cdFx0ICogRG9lcyBub3QgbGluayBVUkxzIGZvdW5kIHdpdGhpbiBIVE1MIHRhZ3MuXHJcblx0XHQgKiBcclxuXHRcdCAqIEZvciBpbnN0YW5jZSwgaWYgZ2l2ZW4gdGhlIHRleHQ6IGBZb3Ugc2hvdWxkIGdvIHRvIGh0dHA6Ly93d3cueWFob28uY29tYCwgdGhlbiB0aGUgcmVzdWx0XHJcblx0XHQgKiB3aWxsIGJlIGBZb3Ugc2hvdWxkIGdvIHRvICZsdDthIGhyZWY9XCJodHRwOi8vd3d3LnlhaG9vLmNvbVwiJmd0O2h0dHA6Ly93d3cueWFob28uY29tJmx0Oy9hJmd0O2BcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBtZXRob2QgZmluZHMgdGhlIHRleHQgYXJvdW5kIGFueSBIVE1MIGVsZW1lbnRzIGluIHRoZSBpbnB1dCBgdGV4dE9ySHRtbGAsIHdoaWNoIHdpbGwgYmUgdGhlIHRleHQgdGhhdCBpcyBwcm9jZXNzZWQuXHJcblx0XHQgKiBBbnkgb3JpZ2luYWwgSFRNTCBlbGVtZW50cyB3aWxsIGJlIGxlZnQgYXMtaXMsIGFzIHdlbGwgYXMgdGhlIHRleHQgdGhhdCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gYW5jaG9yICgmbHQ7YSZndDspIHRhZ3MuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0T3JIdG1sIFRoZSBIVE1MIG9yIHRleHQgdG8gbGluayBVUkxzLCBlbWFpbCBhZGRyZXNzZXMsIGFuZCBUd2l0dGVyIGhhbmRsZXMgd2l0aGluIChkZXBlbmRpbmcgb24gaWZcclxuXHRcdCAqICAgdGhlIHtAbGluayAjdXJsc30sIHtAbGluayAjZW1haWx9LCBhbmQge0BsaW5rICN0d2l0dGVyfSBvcHRpb25zIGFyZSBlbmFibGVkKS5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIEhUTUwsIHdpdGggVVJMcy9lbWFpbHMvVHdpdHRlciBoYW5kbGVzIGF1dG9tYXRpY2FsbHkgbGlua2VkLlxyXG5cdFx0ICovXHJcblx0XHRsaW5rIDogZnVuY3Rpb24oIHRleHRPckh0bWwgKSB7XHJcblx0XHRcdHZhciBtZSA9IHRoaXMsICAvLyBmb3IgY2xvc3VyZVxyXG5cdFx0XHQgICAgaHRtbFBhcnNlciA9IHRoaXMuZ2V0SHRtbFBhcnNlcigpLFxyXG5cdFx0XHQgICAgaHRtbENoYXJhY3RlckVudGl0aWVzUmVnZXggPSB0aGlzLmh0bWxDaGFyYWN0ZXJFbnRpdGllc1JlZ2V4LFxyXG5cdFx0XHQgICAgYW5jaG9yVGFnU3RhY2tDb3VudCA9IDAsICAvLyB1c2VkIHRvIG9ubHkgcHJvY2VzcyB0ZXh0IGFyb3VuZCBhbmNob3IgdGFncywgYW5kIGFueSBpbm5lciB0ZXh0L2h0bWwgdGhleSBtYXkgaGF2ZVxyXG5cdFx0XHQgICAgcmVzdWx0SHRtbCA9IFtdO1xyXG5cclxuXHRcdFx0aHRtbFBhcnNlci5wYXJzZSggdGV4dE9ySHRtbCwge1xyXG5cdFx0XHRcdC8vIFByb2Nlc3MgSFRNTCBub2RlcyBpbiB0aGUgaW5wdXQgYHRleHRPckh0bWxgXHJcblx0XHRcdFx0cHJvY2Vzc0h0bWxOb2RlIDogZnVuY3Rpb24oIHRhZ1RleHQsIHRhZ05hbWUsIGlzQ2xvc2luZ1RhZyApIHtcclxuXHRcdFx0XHRcdGlmKCB0YWdOYW1lID09PSAnYScgKSB7XHJcblx0XHRcdFx0XHRcdGlmKCAhaXNDbG9zaW5nVGFnICkgeyAgLy8gaXQncyB0aGUgc3RhcnQgPGE+IHRhZ1xyXG5cdFx0XHRcdFx0XHRcdGFuY2hvclRhZ1N0YWNrQ291bnQrKztcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHsgICAvLyBpdCdzIHRoZSBlbmQgPC9hPiB0YWdcclxuXHRcdFx0XHRcdFx0XHRhbmNob3JUYWdTdGFja0NvdW50ID0gTWF0aC5tYXgoIGFuY2hvclRhZ1N0YWNrQ291bnQgLSAxLCAwICk7ICAvLyBhdHRlbXB0IHRvIGhhbmRsZSBleHRyYW5lb3VzIDwvYT4gdGFncyBieSBtYWtpbmcgc3VyZSB0aGUgc3RhY2sgY291bnQgbmV2ZXIgZ29lcyBiZWxvdyAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJlc3VsdEh0bWwucHVzaCggdGFnVGV4dCApOyAgLy8gbm93IGFkZCB0aGUgdGV4dCBvZiB0aGUgdGFnIGl0c2VsZiB2ZXJiYXRpbVxyXG5cdFx0XHRcdH0sXHJcblxyXG5cdFx0XHRcdC8vIFByb2Nlc3MgdGV4dCBub2RlcyBpbiB0aGUgaW5wdXQgYHRleHRPckh0bWxgXHJcblx0XHRcdFx0cHJvY2Vzc1RleHROb2RlIDogZnVuY3Rpb24oIHRleHQgKSB7XHJcblx0XHRcdFx0XHRpZiggYW5jaG9yVGFnU3RhY2tDb3VudCA9PT0gMCApIHtcclxuXHRcdFx0XHRcdFx0Ly8gSWYgd2UncmUgbm90IHdpdGhpbiBhbiA8YT4gdGFnLCBwcm9jZXNzIHRoZSB0ZXh0IG5vZGVcclxuXHRcdFx0XHRcdFx0dmFyIHVuZXNjYXBlZFRleHQgPSBBdXRvbGlua2VyLlV0aWwuc3BsaXRBbmRDYXB0dXJlKCB0ZXh0LCBodG1sQ2hhcmFjdGVyRW50aXRpZXNSZWdleCApOyAgLy8gc3BsaXQgYXQgSFRNTCBlbnRpdGllcywgYnV0IGluY2x1ZGUgdGhlIEhUTUwgZW50aXRpZXMgaW4gdGhlIHJlc3VsdHMgYXJyYXlcclxuXHJcblx0XHRcdFx0XHRcdGZvciAoIHZhciBpID0gMCwgbGVuID0gdW5lc2NhcGVkVGV4dC5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdGV4dFRvUHJvY2VzcyA9IHVuZXNjYXBlZFRleHRbIGkgXSxcclxuXHRcdFx0XHRcdFx0XHQgICAgcHJvY2Vzc2VkVGV4dE5vZGUgPSBtZS5wcm9jZXNzVGV4dE5vZGUoIHRleHRUb1Byb2Nlc3MgKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0SHRtbC5wdXNoKCBwcm9jZXNzZWRUZXh0Tm9kZSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gYHRleHRgIGlzIHdpdGhpbiBhbiA8YT4gdGFnLCBzaW1wbHkgYXBwZW5kIHRoZSB0ZXh0IC0gd2UgZG8gbm90IHdhbnQgdG8gYXV0b2xpbmsgYW55dGhpbmcgXHJcblx0XHRcdFx0XHRcdC8vIGFscmVhZHkgd2l0aGluIGFuIDxhPi4uLjwvYT4gdGFnXHJcblx0XHRcdFx0XHRcdHJlc3VsdEh0bWwucHVzaCggdGV4dCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHJlc3VsdEh0bWwuam9pbiggXCJcIiApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBMYXppbHkgaW5zdGFudGlhdGVzIGFuZCByZXR1cm5zIHRoZSB7QGxpbmsgI2h0bWxQYXJzZXJ9IGluc3RhbmNlIGZvciB0aGlzIEF1dG9saW5rZXIgaW5zdGFuY2UuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFBhcnNlcn1cclxuXHRcdCAqL1xyXG5cdFx0Z2V0SHRtbFBhcnNlciA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaHRtbFBhcnNlciA9IHRoaXMuaHRtbFBhcnNlcjtcclxuXHJcblx0XHRcdGlmKCAhaHRtbFBhcnNlciApIHtcclxuXHRcdFx0XHRodG1sUGFyc2VyID0gdGhpcy5odG1sUGFyc2VyID0gbmV3IEF1dG9saW5rZXIuSHRtbFBhcnNlcigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaHRtbFBhcnNlcjtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUge0BsaW5rICN0YWdCdWlsZGVyfSBpbnN0YW5jZSBmb3IgdGhpcyBBdXRvbGlua2VyIGluc3RhbmNlLCBsYXppbHkgaW5zdGFudGlhdGluZyBpdFxyXG5cdFx0ICogaWYgaXQgZG9lcyBub3QgeWV0IGV4aXN0LlxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGlzIG1ldGhvZCBtYXkgYmUgdXNlZCBpbiBhIHtAbGluayAjcmVwbGFjZUZufSB0byBnZW5lcmF0ZSB0aGUge0BsaW5rIEF1dG9saW5rZXIuSHRtbFRhZyBIdG1sVGFnfSBpbnN0YW5jZSB0aGF0IFxyXG5cdFx0ICogQXV0b2xpbmtlciB3b3VsZCBub3JtYWxseSBnZW5lcmF0ZSwgYW5kIHRoZW4gYWxsb3cgZm9yIG1vZGlmaWNhdGlvbnMgYmVmb3JlIHJldHVybmluZyBpdC4gRm9yIGV4YW1wbGU6XHJcblx0XHQgKiBcclxuXHRcdCAqICAgICB2YXIgaHRtbCA9IEF1dG9saW5rZXIubGluayggXCJUZXN0IGdvb2dsZS5jb21cIiwge1xyXG5cdFx0ICogICAgICAgICByZXBsYWNlRm4gOiBmdW5jdGlvbiggYXV0b2xpbmtlciwgbWF0Y2ggKSB7XHJcblx0XHQgKiAgICAgICAgICAgICB2YXIgdGFnID0gYXV0b2xpbmtlci5nZXRUYWdCdWlsZGVyKCkuYnVpbGQoIG1hdGNoICk7ICAvLyByZXR1cm5zIGFuIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWd9IGluc3RhbmNlXHJcblx0XHQgKiAgICAgICAgICAgICB0YWcuc2V0QXR0ciggJ3JlbCcsICdub2ZvbGxvdycgKTtcclxuXHRcdCAqICAgICAgICAgICAgIFxyXG5cdFx0ICogICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuXHRcdCAqICAgICAgICAgfVxyXG5cdFx0ICogICAgIH0gKTtcclxuXHRcdCAqICAgICBcclxuXHRcdCAqICAgICAvLyBnZW5lcmF0ZWQgaHRtbDpcclxuXHRcdCAqICAgICAvLyAgIFRlc3QgPGEgaHJlZj1cImh0dHA6Ly9nb29nbGUuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9mb2xsb3dcIj5nb29nbGUuY29tPC9hPlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLkFuY2hvclRhZ0J1aWxkZXJ9XHJcblx0XHQgKi9cclxuXHRcdGdldFRhZ0J1aWxkZXIgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRhZ0J1aWxkZXIgPSB0aGlzLnRhZ0J1aWxkZXI7XHJcblxyXG5cdFx0XHRpZiggIXRhZ0J1aWxkZXIgKSB7XHJcblx0XHRcdFx0dGFnQnVpbGRlciA9IHRoaXMudGFnQnVpbGRlciA9IG5ldyBBdXRvbGlua2VyLkFuY2hvclRhZ0J1aWxkZXIoIHtcclxuXHRcdFx0XHRcdG5ld1dpbmRvdyAgIDogdGhpcy5uZXdXaW5kb3csXHJcblx0XHRcdFx0XHR0cnVuY2F0ZSAgICA6IHRoaXMudHJ1bmNhdGUsXHJcblx0XHRcdFx0XHRjbGFzc05hbWUgICA6IHRoaXMuY2xhc3NOYW1lXHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGFnQnVpbGRlcjtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUHJvY2VzcyB0aGUgdGV4dCB0aGF0IGxpZXMgaW5iZXR3ZWVuIEhUTUwgdGFncy4gVGhpcyBtZXRob2QgZG9lcyB0aGUgYWN0dWFsIHdyYXBwaW5nIG9mIFVSTHMgd2l0aFxyXG5cdFx0ICogYW5jaG9yIHRhZ3MuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBhdXRvLWxpbmsuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGggYW5jaG9yIHRhZ3MgYXV0by1maWxsZWQuXHJcblx0XHQgKi9cclxuXHRcdHByb2Nlc3NUZXh0Tm9kZSA6IGZ1bmN0aW9uKCB0ZXh0ICkge1xyXG5cdFx0XHR2YXIgbWUgPSB0aGlzOyAgLy8gZm9yIGNsb3N1cmVcclxuXHJcblx0XHRcdHJldHVybiB0ZXh0LnJlcGxhY2UoIHRoaXMubWF0Y2hlclJlZ2V4LCBmdW5jdGlvbiggbWF0Y2hTdHIsICQxLCAkMiwgJDMsICQ0LCAkNSwgJDYsICQ3LCAkOCApIHtcclxuXHRcdFx0XHR2YXIgbWF0Y2hEZXNjT2JqID0gbWUucHJvY2Vzc0NhbmRpZGF0ZU1hdGNoKCBtYXRjaFN0ciwgJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcsICQ4ICk7ICAvLyBtYXRjaCBkZXNjcmlwdGlvbiBvYmplY3RcclxuXHJcblx0XHRcdFx0Ly8gUmV0dXJuIG91dCB3aXRoIG5vIGNoYW5nZXMgZm9yIG1hdGNoIHR5cGVzIHRoYXQgYXJlIGRpc2FibGVkICh1cmwsIGVtYWlsLCB0d2l0dGVyKSwgb3IgZm9yIG1hdGNoZXMgdGhhdCBhcmUgXHJcblx0XHRcdFx0Ly8gaW52YWxpZCAoZmFsc2UgcG9zaXRpdmVzIGZyb20gdGhlIG1hdGNoZXJSZWdleCwgd2hpY2ggY2FuJ3QgdXNlIGxvb2stYmVoaW5kcyBzaW5jZSB0aGV5IGFyZSB1bmF2YWlsYWJsZSBpbiBKUykuXHJcblx0XHRcdFx0aWYoICFtYXRjaERlc2NPYmogKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hTdHI7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBHZW5lcmF0ZSB0aGUgcmVwbGFjZW1lbnQgdGV4dCBmb3IgdGhlIG1hdGNoXHJcblx0XHRcdFx0XHR2YXIgbWF0Y2hSZXR1cm5WYWwgPSBtZS5jcmVhdGVNYXRjaFJldHVyblZhbCggbWF0Y2hEZXNjT2JqLm1hdGNoLCBtYXRjaERlc2NPYmoubWF0Y2hTdHIgKTtcclxuXHRcdFx0XHRcdHJldHVybiBtYXRjaERlc2NPYmoucHJlZml4U3RyICsgbWF0Y2hSZXR1cm5WYWwgKyBtYXRjaERlc2NPYmouc3VmZml4U3RyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBQcm9jZXNzZXMgYSBjYW5kaWRhdGUgbWF0Y2ggZnJvbSB0aGUge0BsaW5rICNtYXRjaGVyUmVnZXh9LiBcclxuXHRcdCAqIFxyXG5cdFx0ICogTm90IGFsbCBtYXRjaGVzIGZvdW5kIGJ5IHRoZSByZWdleCBhcmUgYWN0dWFsIFVSTC9lbWFpbC9Ud2l0dGVyIG1hdGNoZXMsIGFzIGRldGVybWluZWQgYnkgdGhlIHtAbGluayAjbWF0Y2hWYWxpZGF0b3J9LiBJblxyXG5cdFx0ICogdGhpcyBjYXNlLCB0aGUgbWV0aG9kIHJldHVybnMgYG51bGxgLiBPdGhlcndpc2UsIGEgdmFsaWQgT2JqZWN0IHdpdGggYHByZWZpeFN0cmAsIGBtYXRjaGAsIGFuZCBgc3VmZml4U3RyYCBpcyByZXR1cm5lZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBtYXRjaFN0ciBUaGUgZnVsbCBtYXRjaCB0aGF0IHdhcyBmb3VuZCBieSB0aGUge0BsaW5rICNtYXRjaGVyUmVnZXh9LlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHR3aXR0ZXJNYXRjaCBUaGUgbWF0Y2hlZCB0ZXh0IG9mIGEgVHdpdHRlciBoYW5kbGUsIGlmIHRoZSBtYXRjaCBpcyBhIFR3aXR0ZXIgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdHdpdHRlckhhbmRsZVByZWZpeFdoaXRlc3BhY2VDaGFyIFRoZSB3aGl0ZXNwYWNlIGNoYXIgYmVmb3JlIHRoZSBAIHNpZ24gaW4gYSBUd2l0dGVyIGhhbmRsZSBtYXRjaC4gVGhpcyBcclxuXHRcdCAqICAgaXMgbmVlZGVkIGJlY2F1c2Ugb2Ygbm8gbG9va2JlaGluZHMgaW4gSlMgcmVnZXhlcywgYW5kIGlzIG5lZWQgdG8gcmUtaW5jbHVkZSB0aGUgY2hhcmFjdGVyIGZvciB0aGUgYW5jaG9yIHRhZyByZXBsYWNlbWVudC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0d2l0dGVySGFuZGxlIFRoZSBhY3R1YWwgVHdpdHRlciB1c2VyIChpLmUgdGhlIHdvcmQgYWZ0ZXIgdGhlIEAgc2lnbiBpbiBhIFR3aXR0ZXIgbWF0Y2gpLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsQWRkcmVzc01hdGNoIFRoZSBtYXRjaGVkIGVtYWlsIGFkZHJlc3MgZm9yIGFuIGVtYWlsIGFkZHJlc3MgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdXJsTWF0Y2ggVGhlIG1hdGNoZWQgVVJMIHN0cmluZyBmb3IgYSBVUkwgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xVcmxNYXRjaCBUaGUgbWF0Y2ggVVJMIHN0cmluZyBmb3IgYSBwcm90b2NvbCBtYXRjaC4gRXg6ICdodHRwOi8veWFob28uY29tJy4gVGhpcyBpcyB1c2VkIHRvIG1hdGNoXHJcblx0XHQgKiAgIHNvbWV0aGluZyBsaWtlICdodHRwOi8vbG9jYWxob3N0Jywgd2hlcmUgd2Ugd29uJ3QgZG91YmxlIGNoZWNrIHRoYXQgdGhlIGRvbWFpbiBuYW1lIGhhcyBhdCBsZWFzdCBvbmUgJy4nIGluIGl0LlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHd3d1Byb3RvY29sUmVsYXRpdmVNYXRjaCBUaGUgJy8vJyBmb3IgYSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCBmcm9tIGEgJ3d3dycgdXJsLCB3aXRoIHRoZSBjaGFyYWN0ZXIgdGhhdCBcclxuXHRcdCAqICAgY29tZXMgYmVmb3JlIHRoZSAnLy8nLlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRsZFByb3RvY29sUmVsYXRpdmVNYXRjaCBUaGUgJy8vJyBmb3IgYSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCBmcm9tIGEgVExEICh0b3AgbGV2ZWwgZG9tYWluKSBtYXRjaCwgd2l0aCBcclxuXHRcdCAqICAgdGhlIGNoYXJhY3RlciB0aGF0IGNvbWVzIGJlZm9yZSB0aGUgJy8vJy5cclxuXHRcdCAqICAgXHJcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IEEgXCJtYXRjaCBkZXNjcmlwdGlvbiBvYmplY3RcIi4gVGhpcyB3aWxsIGJlIGBudWxsYCBpZiB0aGUgbWF0Y2ggd2FzIGludmFsaWQsIG9yIGlmIGEgbWF0Y2ggdHlwZSBpcyBkaXNhYmxlZC5cclxuXHRcdCAqICAgT3RoZXJ3aXNlLCB0aGlzIHdpbGwgYmUgYW4gT2JqZWN0IChtYXApIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSByZXR1cm4ucHJlZml4U3RyIFRoZSBjaGFyKHMpIHRoYXQgc2hvdWxkIGJlIHByZXBlbmRlZCB0byB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nLiBUaGVzZSBhcmUgY2hhcihzKSB0aGF0XHJcblx0XHQgKiAgIHdlcmUgbmVlZGVkIHRvIGJlIGluY2x1ZGVkIGZyb20gdGhlIHJlZ2V4IG1hdGNoIHRoYXQgd2VyZSBpZ25vcmVkIGJ5IHByb2Nlc3NpbmcgY29kZSwgYW5kIHNob3VsZCBiZSByZS1pbnNlcnRlZCBpbnRvIFxyXG5cdFx0ICogICB0aGUgcmVwbGFjZW1lbnQgc3RyZWFtLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSByZXR1cm4uc3VmZml4U3RyIFRoZSBjaGFyKHMpIHRoYXQgc2hvdWxkIGJlIGFwcGVuZGVkIHRvIHRoZSByZXBsYWNlbWVudCBzdHJpbmcuIFRoZXNlIGFyZSBjaGFyKHMpIHRoYXRcclxuXHRcdCAqICAgd2VyZSBuZWVkZWQgdG8gYmUgaW5jbHVkZWQgZnJvbSB0aGUgcmVnZXggbWF0Y2ggdGhhdCB3ZXJlIGlnbm9yZWQgYnkgcHJvY2Vzc2luZyBjb2RlLCBhbmQgc2hvdWxkIGJlIHJlLWluc2VydGVkIGludG8gXHJcblx0XHQgKiAgIHRoZSByZXBsYWNlbWVudCBzdHJlYW0uXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybi5tYXRjaFN0ciBUaGUgYG1hdGNoU3RyYCwgZml4ZWQgdXAgdG8gcmVtb3ZlIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm8gbG9uZ2VyIG5lZWRlZCAod2hpY2ggaGF2ZSBiZWVuXHJcblx0XHQgKiAgIGFkZGVkIHRvIGBwcmVmaXhTdHJgIGFuZCBgc3VmZml4U3RyYCkuXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLm1hdGNoLk1hdGNofSByZXR1cm4ubWF0Y2ggVGhlIE1hdGNoIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIG1hdGNoIHRoYXQgd2FzIGZvdW5kLlxyXG5cdFx0ICovXHJcblx0XHRwcm9jZXNzQ2FuZGlkYXRlTWF0Y2ggOiBmdW5jdGlvbiggXHJcblx0XHRcdG1hdGNoU3RyLCB0d2l0dGVyTWF0Y2gsIHR3aXR0ZXJIYW5kbGVQcmVmaXhXaGl0ZXNwYWNlQ2hhciwgdHdpdHRlckhhbmRsZSwgXHJcblx0XHRcdGVtYWlsQWRkcmVzc01hdGNoLCB1cmxNYXRjaCwgcHJvdG9jb2xVcmxNYXRjaCwgd3d3UHJvdG9jb2xSZWxhdGl2ZU1hdGNoLCB0bGRQcm90b2NvbFJlbGF0aXZlTWF0Y2hcclxuXHRcdCkge1xyXG5cdFx0XHR2YXIgcHJvdG9jb2xSZWxhdGl2ZU1hdGNoID0gd3d3UHJvdG9jb2xSZWxhdGl2ZU1hdGNoIHx8IHRsZFByb3RvY29sUmVsYXRpdmVNYXRjaCxcclxuXHRcdFx0ICAgIG1hdGNoLCAgLy8gV2lsbCBiZSBhbiBBdXRvbGlua2VyLm1hdGNoLk1hdGNoIG9iamVjdFxyXG5cclxuXHRcdFx0ICAgIHByZWZpeFN0ciA9IFwiXCIsICAgICAgIC8vIEEgc3RyaW5nIHRvIHVzZSB0byBwcmVmaXggdGhlIGFuY2hvciB0YWcgdGhhdCBpcyBjcmVhdGVkLiBUaGlzIGlzIG5lZWRlZCBmb3IgdGhlIFR3aXR0ZXIgaGFuZGxlIG1hdGNoXHJcblx0XHRcdCAgICBzdWZmaXhTdHIgPSBcIlwiOyAgICAgICAvLyBBIHN0cmluZyB0byBzdWZmaXggdGhlIGFuY2hvciB0YWcgdGhhdCBpcyBjcmVhdGVkLiBUaGlzIGlzIHVzZWQgaWYgdGhlcmUgaXMgYSB0cmFpbGluZyBwYXJlbnRoZXNpcyB0aGF0IHNob3VsZCBub3QgYmUgYXV0by1saW5rZWQuXHJcblxyXG5cclxuXHRcdFx0Ly8gUmV0dXJuIG91dCB3aXRoIGBudWxsYCBmb3IgbWF0Y2ggdHlwZXMgdGhhdCBhcmUgZGlzYWJsZWQgKHVybCwgZW1haWwsIHR3aXR0ZXIpLCBvciBmb3IgbWF0Y2hlcyB0aGF0IGFyZSBcclxuXHRcdFx0Ly8gaW52YWxpZCAoZmFsc2UgcG9zaXRpdmVzIGZyb20gdGhlIG1hdGNoZXJSZWdleCwgd2hpY2ggY2FuJ3QgdXNlIGxvb2stYmVoaW5kcyBzaW5jZSB0aGV5IGFyZSB1bmF2YWlsYWJsZSBpbiBKUykuXHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdCggdHdpdHRlck1hdGNoICYmICF0aGlzLnR3aXR0ZXIgKSB8fCAoIGVtYWlsQWRkcmVzc01hdGNoICYmICF0aGlzLmVtYWlsICkgfHwgKCB1cmxNYXRjaCAmJiAhdGhpcy51cmxzICkgfHxcclxuXHRcdFx0XHQhdGhpcy5tYXRjaFZhbGlkYXRvci5pc1ZhbGlkTWF0Y2goIHVybE1hdGNoLCBwcm90b2NvbFVybE1hdGNoLCBwcm90b2NvbFJlbGF0aXZlTWF0Y2ggKSBcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEhhbmRsZSBhIGNsb3NpbmcgcGFyZW50aGVzaXMgYXQgdGhlIGVuZCBvZiB0aGUgbWF0Y2gsIGFuZCBleGNsdWRlIGl0IGlmIHRoZXJlIGlzIG5vdCBhIG1hdGNoaW5nIG9wZW4gcGFyZW50aGVzaXNcclxuXHRcdFx0Ly8gaW4gdGhlIG1hdGNoIGl0c2VsZi4gXHJcblx0XHRcdGlmKCB0aGlzLm1hdGNoSGFzVW5iYWxhbmNlZENsb3NpbmdQYXJlbiggbWF0Y2hTdHIgKSApIHtcclxuXHRcdFx0XHRtYXRjaFN0ciA9IG1hdGNoU3RyLnN1YnN0ciggMCwgbWF0Y2hTdHIubGVuZ3RoIC0gMSApOyAgLy8gcmVtb3ZlIHRoZSB0cmFpbGluZyBcIilcIlxyXG5cdFx0XHRcdHN1ZmZpeFN0ciA9IFwiKVwiOyAgLy8gdGhpcyB3aWxsIGJlIGFkZGVkIGFmdGVyIHRoZSBnZW5lcmF0ZWQgPGE+IHRhZ1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYoIGVtYWlsQWRkcmVzc01hdGNoICkge1xyXG5cdFx0XHRcdG1hdGNoID0gbmV3IEF1dG9saW5rZXIubWF0Y2guRW1haWwoIHsgbWF0Y2hlZFRleHQ6IG1hdGNoU3RyLCBlbWFpbDogZW1haWxBZGRyZXNzTWF0Y2ggfSApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmKCB0d2l0dGVyTWF0Y2ggKSB7XHJcblx0XHRcdFx0Ly8gZml4IHVwIHRoZSBgbWF0Y2hTdHJgIGlmIHRoZXJlIHdhcyBhIHByZWNlZGluZyB3aGl0ZXNwYWNlIGNoYXIsIHdoaWNoIHdhcyBuZWVkZWQgdG8gZGV0ZXJtaW5lIHRoZSBtYXRjaCBcclxuXHRcdFx0XHQvLyBpdHNlbGYgKHNpbmNlIHRoZXJlIGFyZSBubyBsb29rLWJlaGluZHMgaW4gSlMgcmVnZXhlcylcclxuXHRcdFx0XHRpZiggdHdpdHRlckhhbmRsZVByZWZpeFdoaXRlc3BhY2VDaGFyICkge1xyXG5cdFx0XHRcdFx0cHJlZml4U3RyID0gdHdpdHRlckhhbmRsZVByZWZpeFdoaXRlc3BhY2VDaGFyO1xyXG5cdFx0XHRcdFx0bWF0Y2hTdHIgPSBtYXRjaFN0ci5zbGljZSggMSApOyAgLy8gcmVtb3ZlIHRoZSBwcmVmaXhlZCB3aGl0ZXNwYWNlIGNoYXIgZnJvbSB0aGUgbWF0Y2hcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bWF0Y2ggPSBuZXcgQXV0b2xpbmtlci5tYXRjaC5Ud2l0dGVyKCB7IG1hdGNoZWRUZXh0OiBtYXRjaFN0ciwgdHdpdHRlckhhbmRsZTogdHdpdHRlckhhbmRsZSB9ICk7XHJcblxyXG5cdFx0XHR9IGVsc2UgeyAgLy8gdXJsIG1hdGNoXHJcblx0XHRcdFx0Ly8gSWYgaXQncyBhIHByb3RvY29sLXJlbGF0aXZlICcvLycgbWF0Y2gsIHJlbW92ZSB0aGUgY2hhcmFjdGVyIGJlZm9yZSB0aGUgJy8vJyAod2hpY2ggdGhlIG1hdGNoZXJSZWdleCBuZWVkZWRcclxuXHRcdFx0XHQvLyB0byBtYXRjaCBkdWUgdG8gdGhlIGxhY2sgb2YgYSBuZWdhdGl2ZSBsb29rLWJlaGluZCBpbiBKYXZhU2NyaXB0IHJlZ3VsYXIgZXhwcmVzc2lvbnMpXHJcblx0XHRcdFx0aWYoIHByb3RvY29sUmVsYXRpdmVNYXRjaCApIHtcclxuXHRcdFx0XHRcdHZhciBjaGFyQmVmb3JlTWF0Y2ggPSBwcm90b2NvbFJlbGF0aXZlTWF0Y2gubWF0Y2goIHRoaXMuY2hhckJlZm9yZVByb3RvY29sUmVsTWF0Y2hSZWdleCApWyAxIF0gfHwgXCJcIjtcclxuXHJcblx0XHRcdFx0XHRpZiggY2hhckJlZm9yZU1hdGNoICkgeyAgLy8gZml4IHVwIHRoZSBgbWF0Y2hTdHJgIGlmIHRoZXJlIHdhcyBhIHByZWNlZGluZyBjaGFyIGJlZm9yZSBhIHByb3RvY29sLXJlbGF0aXZlIG1hdGNoLCB3aGljaCB3YXMgbmVlZGVkIHRvIGRldGVybWluZSB0aGUgbWF0Y2ggaXRzZWxmIChzaW5jZSB0aGVyZSBhcmUgbm8gbG9vay1iZWhpbmRzIGluIEpTIHJlZ2V4ZXMpXHJcblx0XHRcdFx0XHRcdHByZWZpeFN0ciA9IGNoYXJCZWZvcmVNYXRjaDtcclxuXHRcdFx0XHRcdFx0bWF0Y2hTdHIgPSBtYXRjaFN0ci5zbGljZSggMSApOyAgLy8gcmVtb3ZlIHRoZSBwcmVmaXhlZCBjaGFyIGZyb20gdGhlIG1hdGNoXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IG5ldyBBdXRvbGlua2VyLm1hdGNoLlVybCgge1xyXG5cdFx0XHRcdFx0bWF0Y2hlZFRleHQgOiBtYXRjaFN0cixcclxuXHRcdFx0XHRcdHVybCA6IG1hdGNoU3RyLFxyXG5cdFx0XHRcdFx0cHJvdG9jb2xVcmxNYXRjaCA6ICEhcHJvdG9jb2xVcmxNYXRjaCxcclxuXHRcdFx0XHRcdHByb3RvY29sUmVsYXRpdmVNYXRjaCA6ICEhcHJvdG9jb2xSZWxhdGl2ZU1hdGNoLFxyXG5cdFx0XHRcdFx0c3RyaXBQcmVmaXggOiB0aGlzLnN0cmlwUHJlZml4XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHByZWZpeFN0ciA6IHByZWZpeFN0cixcclxuXHRcdFx0XHRzdWZmaXhTdHIgOiBzdWZmaXhTdHIsXHJcblx0XHRcdFx0bWF0Y2hTdHIgIDogbWF0Y2hTdHIsXHJcblx0XHRcdFx0bWF0Y2ggICAgIDogbWF0Y2hcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZXJtaW5lcyBpZiBhIG1hdGNoIGZvdW5kIGhhcyBhbiB1bm1hdGNoZWQgY2xvc2luZyBwYXJlbnRoZXNpcy4gSWYgc28sIHRoaXMgcGFyZW50aGVzaXMgd2lsbCBiZSByZW1vdmVkXHJcblx0XHQgKiBmcm9tIHRoZSBtYXRjaCBpdHNlbGYsIGFuZCBhcHBlbmRlZCBhZnRlciB0aGUgZ2VuZXJhdGVkIGFuY2hvciB0YWcgaW4ge0BsaW5rICNwcm9jZXNzVGV4dE5vZGV9LlxyXG5cdFx0ICogXHJcblx0XHQgKiBBIG1hdGNoIG1heSBoYXZlIGFuIGV4dHJhIGNsb3NpbmcgcGFyZW50aGVzaXMgYXQgdGhlIGVuZCBvZiB0aGUgbWF0Y2ggYmVjYXVzZSB0aGUgcmVndWxhciBleHByZXNzaW9uIG11c3QgaW5jbHVkZSBwYXJlbnRoZXNpc1xyXG5cdFx0ICogZm9yIFVSTHMgc3VjaCBhcyBcIndpa2lwZWRpYS5jb20vc29tZXRoaW5nXyhkaXNhbWJpZ3VhdGlvbilcIiwgd2hpY2ggc2hvdWxkIGJlIGF1dG8tbGlua2VkLiBcclxuXHRcdCAqIFxyXG5cdFx0ICogSG93ZXZlciwgYW4gZXh0cmEgcGFyZW50aGVzaXMgKndpbGwqIGJlIGluY2x1ZGVkIHdoZW4gdGhlIFVSTCBpdHNlbGYgaXMgd3JhcHBlZCBpbiBwYXJlbnRoZXNpcywgc3VjaCBhcyBpbiB0aGUgY2FzZSBvZlxyXG5cdFx0ICogXCIod2lraXBlZGlhLmNvbS9zb21ldGhpbmdfKGRpc2FtYmlndWF0aW9uKSlcIi4gSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBjbG9zaW5nIHBhcmVudGhlc2lzIHNob3VsZCAqbm90KiBiZSBwYXJ0IG9mIHRoZSBVUkwgXHJcblx0XHQgKiBpdHNlbGYsIGFuZCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiBgdHJ1ZWAuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbWF0Y2hTdHIgVGhlIGZ1bGwgbWF0Y2ggc3RyaW5nIGZyb20gdGhlIHtAbGluayAjbWF0Y2hlclJlZ2V4fS5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGVyZSBpcyBhbiB1bmJhbGFuY2VkIGNsb3NpbmcgcGFyZW50aGVzaXMgYXQgdGhlIGVuZCBvZiB0aGUgYG1hdGNoU3RyYCwgYGZhbHNlYCBvdGhlcndpc2UuXHJcblx0XHQgKi9cclxuXHRcdG1hdGNoSGFzVW5iYWxhbmNlZENsb3NpbmdQYXJlbiA6IGZ1bmN0aW9uKCBtYXRjaFN0ciApIHtcclxuXHRcdFx0dmFyIGxhc3RDaGFyID0gbWF0Y2hTdHIuY2hhckF0KCBtYXRjaFN0ci5sZW5ndGggLSAxICk7XHJcblxyXG5cdFx0XHRpZiggbGFzdENoYXIgPT09ICcpJyApIHtcclxuXHRcdFx0XHR2YXIgb3BlblBhcmVuc01hdGNoID0gbWF0Y2hTdHIubWF0Y2goIC9cXCgvZyApLFxyXG5cdFx0XHRcdCAgICBjbG9zZVBhcmVuc01hdGNoID0gbWF0Y2hTdHIubWF0Y2goIC9cXCkvZyApLFxyXG5cdFx0XHRcdCAgICBudW1PcGVuUGFyZW5zID0gKCBvcGVuUGFyZW5zTWF0Y2ggJiYgb3BlblBhcmVuc01hdGNoLmxlbmd0aCApIHx8IDAsXHJcblx0XHRcdFx0ICAgIG51bUNsb3NlUGFyZW5zID0gKCBjbG9zZVBhcmVuc01hdGNoICYmIGNsb3NlUGFyZW5zTWF0Y2gubGVuZ3RoICkgfHwgMDtcclxuXHJcblx0XHRcdFx0aWYoIG51bU9wZW5QYXJlbnMgPCBudW1DbG9zZVBhcmVucyApIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIHRoZSByZXR1cm4gc3RyaW5nIHZhbHVlIGZvciBhIGdpdmVuIG1hdGNoIGluIHRoZSBpbnB1dCBzdHJpbmcsIGZvciB0aGUge0BsaW5rICNwcm9jZXNzVGV4dE5vZGV9IG1ldGhvZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBtZXRob2QgaGFuZGxlcyB0aGUge0BsaW5rICNyZXBsYWNlRm59LCBpZiBvbmUgd2FzIHByb3ZpZGVkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtBdXRvbGlua2VyLm1hdGNoLk1hdGNofSBtYXRjaCBUaGUgTWF0Y2ggb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbWF0Y2hTdHIgVGhlIG9yaWdpbmFsIG1hdGNoIHN0cmluZywgYWZ0ZXIgaGF2aW5nIGJlZW4gcHJlcHJvY2Vzc2VkIHRvIGZpeCBtYXRjaCBlZGdlIGNhc2VzIChzZWVcclxuXHRcdCAqICAgdGhlIGBwcmVmaXhTdHJgIGFuZCBgc3VmZml4U3RyYCB2YXJzIGluIHtAbGluayAjcHJvY2Vzc1RleHROb2RlfS5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHN0cmluZyB0aGF0IHRoZSBgbWF0Y2hgIHNob3VsZCBiZSByZXBsYWNlZCB3aXRoLiBUaGlzIGlzIHVzdWFsbHkgdGhlIGFuY2hvciB0YWcgc3RyaW5nLCBidXRcclxuXHRcdCAqICAgbWF5IGJlIHRoZSBgbWF0Y2hTdHJgIGl0c2VsZiBpZiB0aGUgbWF0Y2ggaXMgbm90IHRvIGJlIHJlcGxhY2VkLlxyXG5cdFx0ICovXHJcblx0XHRjcmVhdGVNYXRjaFJldHVyblZhbCA6IGZ1bmN0aW9uKCBtYXRjaCwgbWF0Y2hTdHIgKSB7XHJcblx0XHRcdC8vIEhhbmRsZSBhIGN1c3RvbSBgcmVwbGFjZUZuYCBiZWluZyBwcm92aWRlZFxyXG5cdFx0XHR2YXIgcmVwbGFjZUZuUmVzdWx0O1xyXG5cdFx0XHRpZiggdGhpcy5yZXBsYWNlRm4gKSB7XHJcblx0XHRcdFx0cmVwbGFjZUZuUmVzdWx0ID0gdGhpcy5yZXBsYWNlRm4uY2FsbCggdGhpcywgdGhpcywgbWF0Y2ggKTsgIC8vIEF1dG9saW5rZXIgaW5zdGFuY2UgaXMgdGhlIGNvbnRleHQsIGFuZCB0aGUgZmlyc3QgYXJnXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCB0eXBlb2YgcmVwbGFjZUZuUmVzdWx0ID09PSAnc3RyaW5nJyApIHtcclxuXHRcdFx0XHRyZXR1cm4gcmVwbGFjZUZuUmVzdWx0OyAgLy8gYHJlcGxhY2VGbmAgcmV0dXJuZWQgYSBzdHJpbmcsIHVzZSB0aGF0XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYoIHJlcGxhY2VGblJlc3VsdCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1hdGNoU3RyOyAgLy8gbm8gcmVwbGFjZW1lbnQgZm9yIHRoZSBtYXRjaFxyXG5cclxuXHRcdFx0fSBlbHNlIGlmKCByZXBsYWNlRm5SZXN1bHQgaW5zdGFuY2VvZiBBdXRvbGlua2VyLkh0bWxUYWcgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcGxhY2VGblJlc3VsdC50b1N0cmluZygpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHsgIC8vIHJlcGxhY2VGblJlc3VsdCA9PT0gdHJ1ZSwgb3Igbm8vdW5rbm93biByZXR1cm4gdmFsdWUgZnJvbSBmdW5jdGlvblxyXG5cdFx0XHRcdC8vIFBlcmZvcm0gQXV0b2xpbmtlcidzIGRlZmF1bHQgYW5jaG9yIHRhZyBnZW5lcmF0aW9uXHJcblx0XHRcdFx0dmFyIHRhZ0J1aWxkZXIgPSB0aGlzLmdldFRhZ0J1aWxkZXIoKSxcclxuXHRcdFx0XHQgICAgYW5jaG9yVGFnID0gdGFnQnVpbGRlci5idWlsZCggbWF0Y2ggKTsgIC8vIHJldHVybnMgYW4gQXV0b2xpbmtlci5IdG1sVGFnIGluc3RhbmNlXHJcblxyXG5cdFx0XHRcdHJldHVybiBhbmNob3JUYWcudG9TdHJpbmcoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQXV0b21hdGljYWxseSBsaW5rcyBVUkxzLCBlbWFpbCBhZGRyZXNzZXMsIGFuZCBUd2l0dGVyIGhhbmRsZXMgZm91bmQgaW4gdGhlIGdpdmVuIGNodW5rIG9mIEhUTUwuIFxyXG5cdCAqIERvZXMgbm90IGxpbmsgVVJMcyBmb3VuZCB3aXRoaW4gSFRNTCB0YWdzLlxyXG5cdCAqIFxyXG5cdCAqIEZvciBpbnN0YW5jZSwgaWYgZ2l2ZW4gdGhlIHRleHQ6IGBZb3Ugc2hvdWxkIGdvIHRvIGh0dHA6Ly93d3cueWFob28uY29tYCwgdGhlbiB0aGUgcmVzdWx0XHJcblx0ICogd2lsbCBiZSBgWW91IHNob3VsZCBnbyB0byAmbHQ7YSBocmVmPVwiaHR0cDovL3d3dy55YWhvby5jb21cIiZndDtodHRwOi8vd3d3LnlhaG9vLmNvbSZsdDsvYSZndDtgXHJcblx0ICogXHJcblx0ICogRXhhbXBsZTpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGxpbmtlZFRleHQgPSBBdXRvbGlua2VyLmxpbmsoIFwiR28gdG8gZ29vZ2xlLmNvbVwiLCB7IG5ld1dpbmRvdzogZmFsc2UgfSApO1xyXG5cdCAqICAgICAvLyBQcm9kdWNlczogXCJHbyB0byA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIj5nb29nbGUuY29tPC9hPlwiXHJcblx0ICogXHJcblx0ICogQHN0YXRpY1xyXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0T3JIdG1sIFRoZSBIVE1MIG9yIHRleHQgdG8gZmluZCBVUkxzLCBlbWFpbCBhZGRyZXNzZXMsIGFuZCBUd2l0dGVyIGhhbmRsZXMgd2l0aGluIChkZXBlbmRpbmcgb24gaWZcclxuXHQgKiAgIHRoZSB7QGxpbmsgI3VybHN9LCB7QGxpbmsgI2VtYWlsfSwgYW5kIHtAbGluayAjdHdpdHRlcn0gb3B0aW9ucyBhcmUgZW5hYmxlZCkuXHJcblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBbnkgb2YgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIEF1dG9saW5rZXIgY2xhc3MsIHNwZWNpZmllZCBpbiBhbiBPYmplY3QgKG1hcCkuXHJcblx0ICogICBTZWUgdGhlIGNsYXNzIGRlc2NyaXB0aW9uIGZvciBhbiBleGFtcGxlIGNhbGwuXHJcblx0ICogQHJldHVybiB7U3RyaW5nfSBUaGUgSFRNTCB0ZXh0LCB3aXRoIFVSTHMgYXV0b21hdGljYWxseSBsaW5rZWRcclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLmxpbmsgPSBmdW5jdGlvbiggdGV4dE9ySHRtbCwgb3B0aW9ucyApIHtcclxuXHRcdHZhciBhdXRvbGlua2VyID0gbmV3IEF1dG9saW5rZXIoIG9wdGlvbnMgKTtcclxuXHRcdHJldHVybiBhdXRvbGlua2VyLmxpbmsoIHRleHRPckh0bWwgKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gTmFtZXNwYWNlIGZvciBgbWF0Y2hgIGNsYXNzZXNcclxuXHRBdXRvbGlua2VyLm1hdGNoID0ge307XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qanNoaW50IGVxbnVsbDp0cnVlLCBib3NzOnRydWUgKi9cclxuXHQvKipcclxuXHQgKiBAY2xhc3MgQXV0b2xpbmtlci5VdGlsXHJcblx0ICogQHNpbmdsZXRvblxyXG5cdCAqIFxyXG5cdCAqIEEgZmV3IHV0aWxpdHkgbWV0aG9kcyBmb3IgQXV0b2xpbmtlci5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLlV0aWwgPSB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBhYnN0cmFjdE1ldGhvZFxyXG5cdFx0ICogXHJcblx0XHQgKiBBIGZ1bmN0aW9uIG9iamVjdCB3aGljaCByZXByZXNlbnRzIGFuIGFic3RyYWN0IG1ldGhvZC5cclxuXHRcdCAqL1xyXG5cdFx0YWJzdHJhY3RNZXRob2QgOiBmdW5jdGlvbigpIHsgdGhyb3cgXCJhYnN0cmFjdFwiOyB9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFzc2lnbnMgKHNoYWxsb3cgY29waWVzKSB0aGUgcHJvcGVydGllcyBvZiBgc3JjYCBvbnRvIGBkZXN0YC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IGRlc3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBzcmMgVGhlIHNvdXJjZSBvYmplY3QuXHJcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgKGBkZXN0YClcclxuXHRcdCAqL1xyXG5cdFx0YXNzaWduIDogZnVuY3Rpb24oIGRlc3QsIHNyYyApIHtcclxuXHRcdFx0Zm9yKCB2YXIgcHJvcCBpbiBzcmMgKSB7XHJcblx0XHRcdFx0aWYoIHNyYy5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xyXG5cdFx0XHRcdFx0ZGVzdFsgcHJvcCBdID0gc3JjWyBwcm9wIF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZGVzdDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRXh0ZW5kcyBgc3VwZXJjbGFzc2AgdG8gY3JlYXRlIGEgbmV3IHN1YmNsYXNzLCBhZGRpbmcgdGhlIGBwcm90b1Byb3BzYCB0byB0aGUgbmV3IHN1YmNsYXNzJ3MgcHJvdG90eXBlLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdXBlcmNsYXNzIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgdGhlIHN1cGVyY2xhc3MuXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gcHJvdG9Qcm9wcyBUaGUgbWV0aG9kcy9wcm9wZXJ0aWVzIHRvIGFkZCB0byB0aGUgc3ViY2xhc3MncyBwcm90b3R5cGUuIFRoaXMgbWF5IGNvbnRhaW4gdGhlXHJcblx0XHQgKiAgIHNwZWNpYWwgcHJvcGVydHkgYGNvbnN0cnVjdG9yYCwgd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHRoZSBuZXcgc3ViY2xhc3MncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cclxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgbmV3IHN1YmNsYXNzIGZ1bmN0aW9uLlxyXG5cdFx0ICovXHJcblx0XHRleHRlbmQgOiBmdW5jdGlvbiggc3VwZXJjbGFzcywgcHJvdG9Qcm9wcyApIHtcclxuXHRcdFx0dmFyIHN1cGVyY2xhc3NQcm90byA9IHN1cGVyY2xhc3MucHJvdG90eXBlO1xyXG5cclxuXHRcdFx0dmFyIEYgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0XHRGLnByb3RvdHlwZSA9IHN1cGVyY2xhc3NQcm90bztcclxuXHJcblx0XHRcdHZhciBzdWJjbGFzcztcclxuXHRcdFx0aWYoIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoICdjb25zdHJ1Y3RvcicgKSApIHtcclxuXHRcdFx0XHRzdWJjbGFzcyA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c3ViY2xhc3MgPSBmdW5jdGlvbigpIHsgc3VwZXJjbGFzc1Byb3RvLmNvbnN0cnVjdG9yLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTsgfTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHN1YmNsYXNzUHJvdG8gPSBzdWJjbGFzcy5wcm90b3R5cGUgPSBuZXcgRigpOyAgLy8gc2V0IHVwIHByb3RvdHlwZSBjaGFpblxyXG5cdFx0XHRzdWJjbGFzc1Byb3RvLmNvbnN0cnVjdG9yID0gc3ViY2xhc3M7ICAvLyBmaXggY29uc3RydWN0b3IgcHJvcGVydHlcclxuXHRcdFx0c3ViY2xhc3NQcm90by5zdXBlcmNsYXNzID0gc3VwZXJjbGFzc1Byb3RvO1xyXG5cclxuXHRcdFx0ZGVsZXRlIHByb3RvUHJvcHMuY29uc3RydWN0b3I7ICAvLyBkb24ndCByZS1hc3NpZ24gY29uc3RydWN0b3IgcHJvcGVydHkgdG8gdGhlIHByb3RvdHlwZSwgc2luY2UgYSBuZXcgZnVuY3Rpb24gbWF5IGhhdmUgYmVlbiBjcmVhdGVkIChgc3ViY2xhc3NgKSwgd2hpY2ggaXMgbm93IGFscmVhZHkgdGhlcmVcclxuXHRcdFx0QXV0b2xpbmtlci5VdGlsLmFzc2lnbiggc3ViY2xhc3NQcm90bywgcHJvdG9Qcm9wcyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHN1YmNsYXNzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUcnVuY2F0ZXMgdGhlIGBzdHJgIGF0IGBsZW4gLSBlbGxpcHNpc0NoYXJzLmxlbmd0aGAsIGFuZCBhZGRzIHRoZSBgZWxsaXBzaXNDaGFyc2AgdG8gdGhlXHJcblx0XHQgKiBlbmQgb2YgdGhlIHN0cmluZyAoYnkgZGVmYXVsdCwgdHdvIHBlcmlvZHM6ICcuLicpLiBJZiB0aGUgYHN0cmAgbGVuZ3RoIGRvZXMgbm90IGV4Y2VlZCBcclxuXHRcdCAqIGBsZW5gLCB0aGUgc3RyaW5nIHdpbGwgYmUgcmV0dXJuZWQgdW5jaGFuZ2VkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gdHJ1bmNhdGUgYW5kIGFkZCBhbiBlbGxpcHNpcyB0by5cclxuXHRcdCAqIEBwYXJhbSB7TnVtYmVyfSB0cnVuY2F0ZUxlbiBUaGUgbGVuZ3RoIHRvIHRydW5jYXRlIHRoZSBzdHJpbmcgYXQuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gW2VsbGlwc2lzQ2hhcnM9Li5dIFRoZSBlbGxpcHNpcyBjaGFyYWN0ZXIocykgdG8gYWRkIHRvIHRoZSBlbmQgb2YgYHN0cmBcclxuXHRcdCAqICAgd2hlbiB0cnVuY2F0ZWQuIERlZmF1bHRzIHRvICcuLidcclxuXHRcdCAqL1xyXG5cdFx0ZWxsaXBzaXMgOiBmdW5jdGlvbiggc3RyLCB0cnVuY2F0ZUxlbiwgZWxsaXBzaXNDaGFycyApIHtcclxuXHRcdFx0aWYoIHN0ci5sZW5ndGggPiB0cnVuY2F0ZUxlbiApIHtcclxuXHRcdFx0XHRlbGxpcHNpc0NoYXJzID0gKCBlbGxpcHNpc0NoYXJzID09IG51bGwgKSA/ICcuLicgOiBlbGxpcHNpc0NoYXJzO1xyXG5cdFx0XHRcdHN0ciA9IHN0ci5zdWJzdHJpbmcoIDAsIHRydW5jYXRlTGVuIC0gZWxsaXBzaXNDaGFycy5sZW5ndGggKSArIGVsbGlwc2lzQ2hhcnM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHN0cjtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3VwcG9ydHMgYEFycmF5LnByb3RvdHlwZS5pbmRleE9mKClgIGZ1bmN0aW9uYWxpdHkgZm9yIG9sZCBJRSAoSUU4IGFuZCBiZWxvdykuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IGFyciBUaGUgYXJyYXkgdG8gZmluZCBhbiBlbGVtZW50IG9mLlxyXG5cdFx0ICogQHBhcmFtIHsqfSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZpbmQgaW4gdGhlIGFycmF5LCBhbmQgcmV0dXJuIHRoZSBpbmRleCBvZi5cclxuXHRcdCAqIEByZXR1cm4ge051bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBgZWxlbWVudGAsIG9yIC0xIGlmIGl0IHdhcyBub3QgZm91bmQuXHJcblx0XHQgKi9cclxuXHRcdGluZGV4T2YgOiBmdW5jdGlvbiggYXJyLCBlbGVtZW50ICkge1xyXG5cdFx0XHRpZiggQXJyYXkucHJvdG90eXBlLmluZGV4T2YgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGFyci5pbmRleE9mKCBlbGVtZW50ICk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XHJcblx0XHRcdFx0XHRpZiggYXJyWyBpIF0gPT09IGVsZW1lbnQgKSByZXR1cm4gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBQZXJmb3JtcyB0aGUgZnVuY3Rpb25hbGl0eSBvZiB3aGF0IG1vZGVybiBicm93c2VycyBkbyB3aGVuIGBTdHJpbmcucHJvdG90eXBlLnNwbGl0KClgIGlzIGNhbGxlZFxyXG5cdFx0ICogd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IGNvbnRhaW5zIGNhcHR1cmluZyBwYXJlbnRoZXNpcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogRm9yIGV4YW1wbGU6XHJcblx0XHQgKiBcclxuXHRcdCAqICAgICAvLyBNb2Rlcm4gYnJvd3NlcnM6IFxyXG5cdFx0ICogICAgIFwiYSxiLGNcIi5zcGxpdCggLygsKS8gKTsgIC8vIC0tPiBbICdhJywgJywnLCAnYicsICcsJywgJ2MnIF1cclxuXHRcdCAqICAgICBcclxuXHRcdCAqICAgICAvLyBPbGQgSUUgKGluY2x1ZGluZyBJRTgpOlxyXG5cdFx0ICogICAgIFwiYSxiLGNcIi5zcGxpdCggLygsKS8gKTsgIC8vIC0tPiBbICdhJywgJ2InLCAnYycgXVxyXG5cdFx0ICogICAgIFxyXG5cdFx0ICogVGhpcyBtZXRob2QgZW11bGF0ZXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgbW9kZXJuIGJyb3dzZXJzIGZvciB0aGUgb2xkIElFIGNhc2UuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBzcGxpdC5cclxuXHRcdCAqIEBwYXJhbSB7UmVnRXhwfSBzcGxpdFJlZ2V4IFRoZSByZWd1bGFyIGV4cHJlc3Npb24gdG8gc3BsaXQgdGhlIGlucHV0IGBzdHJgIG9uLiBUaGUgc3BsaXR0aW5nXHJcblx0XHQgKiAgIGNoYXJhY3RlcihzKSB3aWxsIGJlIHNwbGljZWQgaW50byB0aGUgYXJyYXksIGFzIGluIHRoZSBcIm1vZGVybiBicm93c2Vyc1wiIGV4YW1wbGUgaW4gdGhlIFxyXG5cdFx0ICogICBkZXNjcmlwdGlvbiBvZiB0aGlzIG1ldGhvZC4gXHJcblx0XHQgKiAgIE5vdGUgIzE6IHRoZSBzdXBwbGllZCByZWd1bGFyIGV4cHJlc3Npb24gKiptdXN0KiogaGF2ZSB0aGUgJ2cnIGZsYWcgc3BlY2lmaWVkLlxyXG5cdFx0ICogICBOb3RlICMyOiBmb3Igc2ltcGxpY2l0eSdzIHNha2UsIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gZG9lcyBub3QgbmVlZCBcclxuXHRcdCAqICAgdG8gY29udGFpbiBjYXB0dXJpbmcgcGFyZW50aGVzaXMgLSBpdCB3aWxsIGJlIGFzc3VtZWQgdGhhdCBhbnkgbWF0Y2ggaGFzIHRoZW0uXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmdbXX0gVGhlIHNwbGl0IGFycmF5IG9mIHN0cmluZ3MsIHdpdGggdGhlIHNwbGl0dGluZyBjaGFyYWN0ZXIocykgaW5jbHVkZWQuXHJcblx0XHQgKi9cclxuXHRcdHNwbGl0QW5kQ2FwdHVyZSA6IGZ1bmN0aW9uKCBzdHIsIHNwbGl0UmVnZXggKSB7XHJcblx0XHRcdGlmKCAhc3BsaXRSZWdleC5nbG9iYWwgKSB0aHJvdyBuZXcgRXJyb3IoIFwiYHNwbGl0UmVnZXhgIG11c3QgaGF2ZSB0aGUgJ2cnIGZsYWcgc2V0XCIgKTtcclxuXHJcblx0XHRcdHZhciByZXN1bHQgPSBbXSxcclxuXHRcdFx0ICAgIGxhc3RJZHggPSAwLFxyXG5cdFx0XHQgICAgbWF0Y2g7XHJcblxyXG5cdFx0XHR3aGlsZSggbWF0Y2ggPSBzcGxpdFJlZ2V4LmV4ZWMoIHN0ciApICkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKCBzdHIuc3Vic3RyaW5nKCBsYXN0SWR4LCBtYXRjaC5pbmRleCApICk7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goIG1hdGNoWyAwIF0gKTsgIC8vIHB1c2ggdGhlIHNwbGl0dGluZyBjaGFyKHMpXHJcblxyXG5cdFx0XHRcdGxhc3RJZHggPSBtYXRjaC5pbmRleCArIG1hdGNoWyAwIF0ubGVuZ3RoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlc3VsdC5wdXNoKCBzdHIuc3Vic3RyaW5nKCBsYXN0SWR4ICkgKTtcclxuXHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIuSHRtbFBhcnNlclxyXG5cdCAqIEBleHRlbmRzIE9iamVjdFxyXG5cdCAqIFxyXG5cdCAqIEFuIEhUTUwgcGFyc2VyIGltcGxlbWVudGF0aW9uIHdoaWNoIHNpbXBseSB3YWxrcyBhbiBIVE1MIHN0cmluZyBhbmQgY2FsbHMgdGhlIHByb3ZpZGVkIHZpc2l0b3IgZnVuY3Rpb25zIHRvIHByb2Nlc3MgXHJcblx0ICogSFRNTCBhbmQgdGV4dCBub2Rlcy5cclxuXHQgKiBcclxuXHQgKiBBdXRvbGlua2VyIHVzZXMgdGhpcyB0byBvbmx5IGxpbmsgVVJMcy9lbWFpbHMvVHdpdHRlciBoYW5kbGVzIHdpdGhpbiB0ZXh0IG5vZGVzLCBiYXNpY2FsbHkgaWdub3JpbmcgSFRNTCB0YWdzLlxyXG5cdCAqL1xyXG5cdEF1dG9saW5rZXIuSHRtbFBhcnNlciA9IEF1dG9saW5rZXIuVXRpbC5leHRlbmQoIE9iamVjdCwge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBodG1sUmVnZXhcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHB1bGwgb3V0IEhUTUwgdGFncyBmcm9tIGEgc3RyaW5nLiBIYW5kbGVzIG5hbWVzcGFjZWQgSFRNTCB0YWdzIGFuZFxyXG5cdFx0ICogYXR0cmlidXRlIG5hbWVzLCBhcyBzcGVjaWZpZWQgYnkgaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbC1tYXJrdXAvc3ludGF4Lmh0bWwuXHJcblx0XHQgKiBcclxuXHRcdCAqIENhcHR1cmluZyBncm91cHM6XHJcblx0XHQgKiBcclxuXHRcdCAqIDEuIFRoZSBcIiFET0NUWVBFXCIgdGFnIG5hbWUsIGlmIGEgdGFnIGlzIGEgJmx0OyFET0NUWVBFJmd0OyB0YWcuXHJcblx0XHQgKiAyLiBJZiBpdCBpcyBhbiBlbmQgdGFnLCB0aGlzIGdyb3VwIHdpbGwgaGF2ZSB0aGUgJy8nLlxyXG5cdFx0ICogMy4gVGhlIHRhZyBuYW1lIGZvciBhbGwgdGFncyAob3RoZXIgdGhhbiB0aGUgJmx0OyFET0NUWVBFJmd0OyB0YWcpXHJcblx0XHQgKi9cclxuXHRcdGh0bWxSZWdleCA6IChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRhZ05hbWVSZWdleCA9IC9bMC05YS16QS1aXVswLTlhLXpBLVo6XSovLFxyXG5cdFx0XHQgICAgYXR0ck5hbWVSZWdleCA9IC9bXlxcc1xcMFwiJz5cXC89XFx4MDEtXFx4MUZcXHg3Rl0rLywgICAvLyB0aGUgdW5pY29kZSByYW5nZSBhY2NvdW50cyBmb3IgZXhjbHVkaW5nIGNvbnRyb2wgY2hhcnMsIGFuZCB0aGUgZGVsZXRlIGNoYXJcclxuXHRcdFx0ICAgIGF0dHJWYWx1ZVJlZ2V4ID0gLyg/OlwiW15cIl0qP1wifCdbXiddKj8nfFteJ1wiPTw+YFxcc10rKS8sIC8vIGRvdWJsZSBxdW90ZWQsIHNpbmdsZSBxdW90ZWQsIG9yIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZXNcclxuXHRcdFx0ICAgIG5hbWVFcXVhbHNWYWx1ZVJlZ2V4ID0gYXR0ck5hbWVSZWdleC5zb3VyY2UgKyAnKD86XFxcXHMqPVxcXFxzKicgKyBhdHRyVmFsdWVSZWdleC5zb3VyY2UgKyAnKT8nOyAgLy8gb3B0aW9uYWwgJz1bdmFsdWVdJ1xyXG5cclxuXHRcdFx0cmV0dXJuIG5ldyBSZWdFeHAoIFtcclxuXHRcdFx0XHQvLyBmb3IgPCFET0NUWVBFPiB0YWcuIEV4OiA8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgU3RyaWN0Ly9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtc3RyaWN0LmR0ZFwiPikgXHJcblx0XHRcdFx0Jyg/OicsXHJcblx0XHRcdFx0XHQnPCghRE9DVFlQRSknLCAgLy8gKioqIENhcHR1cmluZyBHcm91cCAxIC0gSWYgaXQncyBhIGRvY3R5cGUgdGFnXHJcblxyXG5cdFx0XHRcdFx0XHQvLyBaZXJvIG9yIG1vcmUgYXR0cmlidXRlcyBmb2xsb3dpbmcgdGhlIHRhZyBuYW1lXHJcblx0XHRcdFx0XHRcdCcoPzonLFxyXG5cdFx0XHRcdFx0XHRcdCdcXFxccysnLCAgLy8gb25lIG9yIG1vcmUgd2hpdGVzcGFjZSBjaGFycyBiZWZvcmUgYW4gYXR0cmlidXRlXHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIEVpdGhlcjpcclxuXHRcdFx0XHRcdFx0XHQvLyBBLiBhdHRyPVwidmFsdWVcIiwgb3IgXHJcblx0XHRcdFx0XHRcdFx0Ly8gQi4gXCJ2YWx1ZVwiIGFsb25lIChUbyBjb3ZlciBleGFtcGxlIGRvY3R5cGUgdGFnOiA8IURPQ1RZUEUgaHRtbCBQVUJMSUMgXCItLy9XM0MvL0RURCBYSFRNTCAxLjAgU3RyaWN0Ly9FTlwiIFwiaHR0cDovL3d3dy53My5vcmcvVFIveGh0bWwxL0RURC94aHRtbDEtc3RyaWN0LmR0ZFwiPikgXHJcblx0XHRcdFx0XHRcdFx0Jyg/OicsIG5hbWVFcXVhbHNWYWx1ZVJlZ2V4LCAnfCcsIGF0dHJWYWx1ZVJlZ2V4LnNvdXJjZSArICcpJyxcclxuXHRcdFx0XHRcdFx0JykqJyxcclxuXHRcdFx0XHRcdCc+JyxcclxuXHRcdFx0XHQnKScsXHJcblxyXG5cdFx0XHRcdCd8JyxcclxuXHJcblx0XHRcdFx0Ly8gQWxsIG90aGVyIEhUTUwgdGFncyAoaS5lLiB0YWdzIHRoYXQgYXJlIG5vdCA8IURPQ1RZUEU+KVxyXG5cdFx0XHRcdCcoPzonLFxyXG5cdFx0XHRcdFx0JzwoLyk/JywgIC8vIEJlZ2lubmluZyBvZiBhIHRhZy4gRWl0aGVyICc8JyBmb3IgYSBzdGFydCB0YWcsIG9yICc8LycgZm9yIGFuIGVuZCB0YWcuIFxyXG5cdFx0XHRcdFx0ICAgICAgICAgIC8vICoqKiBDYXB0dXJpbmcgR3JvdXAgMjogVGhlIHNsYXNoIG9yIGFuIGVtcHR5IHN0cmluZy4gU2xhc2ggKCcvJykgZm9yIGVuZCB0YWcsIGVtcHR5IHN0cmluZyBmb3Igc3RhcnQgb3Igc2VsZi1jbG9zaW5nIHRhZy5cclxuXHJcblx0XHRcdFx0XHRcdC8vICoqKiBDYXB0dXJpbmcgR3JvdXAgMyAtIFRoZSB0YWcgbmFtZVxyXG5cdFx0XHRcdFx0XHQnKCcgKyB0YWdOYW1lUmVnZXguc291cmNlICsgJyknLFxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gWmVybyBvciBtb3JlIGF0dHJpYnV0ZXMgZm9sbG93aW5nIHRoZSB0YWcgbmFtZVxyXG5cdFx0XHRcdFx0XHQnKD86JyxcclxuXHRcdFx0XHRcdFx0XHQnXFxcXHMrJywgICAgICAgICAgICAgICAgLy8gb25lIG9yIG1vcmUgd2hpdGVzcGFjZSBjaGFycyBiZWZvcmUgYW4gYXR0cmlidXRlXHJcblx0XHRcdFx0XHRcdFx0bmFtZUVxdWFsc1ZhbHVlUmVnZXgsICAvLyBhdHRyPVwidmFsdWVcIiAod2l0aCBvcHRpb25hbCA9XCJ2YWx1ZVwiIHBhcnQpXHJcblx0XHRcdFx0XHRcdCcpKicsXHJcblxyXG5cdFx0XHRcdFx0XHQnXFxcXHMqLz8nLCAgLy8gYW55IHRyYWlsaW5nIHNwYWNlcyBhbmQgb3B0aW9uYWwgJy8nIGJlZm9yZSB0aGUgY2xvc2luZyAnPidcclxuXHRcdFx0XHRcdCc+JyxcclxuXHRcdFx0XHQnKSdcclxuXHRcdFx0XS5qb2luKCBcIlwiICksICdnaScgKTtcclxuXHRcdH0gKSgpLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFdhbGtzIGFuIEhUTUwgc3RyaW5nLCBjYWxsaW5nIHRoZSBgb3B0aW9ucy5wcm9jZXNzSHRtbE5vZGVgIGZ1bmN0aW9uIGZvciBlYWNoIEhUTUwgdGFnIHRoYXQgaXMgZW5jb3VudGVyZWQsIGFuZCBjYWxsaW5nXHJcblx0XHQgKiB0aGUgYG9wdGlvbnMucHJvY2Vzc1RleHROb2RlYCBmdW5jdGlvbiB3aGVuIGVhY2ggdGV4dCBhcm91bmQgSFRNTCB0YWdzIGlzIGVuY291bnRlcmVkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gaHRtbCBUaGUgSFRNTCB0byBwYXJzZS5cclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQW4gT2JqZWN0IChtYXApIHdoaWNoIG1heSBjb250YWluIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMucHJvY2Vzc0h0bWxOb2RlXSBBIHZpc2l0b3IgZnVuY3Rpb24gd2hpY2ggYWxsb3dzIHByb2Nlc3Npbmcgb2YgYW4gZW5jb3VudGVyZWQgSFRNTCBub2RlLlxyXG5cdFx0ICogICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgYXJndW1lbnRzOlxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnByb2Nlc3NIdG1sTm9kZS50YWdUZXh0XSBUaGUgSFRNTCB0YWcgdGV4dCB0aGF0IHdhcyBmb3VuZC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcm9jZXNzSHRtbE5vZGUudGFnTmFtZV0gVGhlIHRhZyBuYW1lIGZvciB0aGUgSFRNTCB0YWcgdGhhdCB3YXMgZm91bmQuIEV4OiAnYScgZm9yIGFuIGFuY2hvciB0YWcuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJvY2Vzc0h0bWxOb2RlLmlzQ2xvc2luZ1RhZ10gYHRydWVgIGlmIHRoZSB0YWcgaXMgYSBjbG9zaW5nIHRhZyAoZXg6ICZsdDsvYSZndDspLCBgZmFsc2VgIG90aGVyd2lzZS5cclxuXHRcdCAqICBcclxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnByb2Nlc3NUZXh0Tm9kZV0gQSB2aXNpdG9yIGZ1bmN0aW9uIHdoaWNoIGFsbG93cyBwcm9jZXNzaW5nIG9mIGFuIGVuY291bnRlcmVkIHRleHQgbm9kZS5cclxuXHRcdCAqICAgVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czpcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcm9jZXNzVGV4dE5vZGUudGV4dF0gVGhlIHRleHQgbm9kZSB0aGF0IHdhcyBtYXRjaGVkLlxyXG5cdFx0ICovXHJcblx0XHRwYXJzZSA6IGZ1bmN0aW9uKCBodG1sLCBvcHRpb25zICkge1xyXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcblx0XHRcdHZhciBwcm9jZXNzSHRtbE5vZGVWaXNpdG9yID0gb3B0aW9ucy5wcm9jZXNzSHRtbE5vZGUgfHwgZnVuY3Rpb24oKSB7fSxcclxuXHRcdFx0ICAgIHByb2Nlc3NUZXh0Tm9kZVZpc2l0b3IgPSBvcHRpb25zLnByb2Nlc3NUZXh0Tm9kZSB8fCBmdW5jdGlvbigpIHt9LFxyXG5cdFx0XHQgICAgaHRtbFJlZ2V4ID0gdGhpcy5odG1sUmVnZXgsXHJcblx0XHRcdCAgICBjdXJyZW50UmVzdWx0LFxyXG5cdFx0XHQgICAgbGFzdEluZGV4ID0gMDtcclxuXHJcblx0XHRcdC8vIExvb3Agb3ZlciB0aGUgSFRNTCBzdHJpbmcsIGlnbm9yaW5nIEhUTUwgdGFncywgYW5kIHByb2Nlc3NpbmcgdGhlIHRleHQgdGhhdCBsaWVzIGJldHdlZW4gdGhlbSxcclxuXHRcdFx0Ly8gd3JhcHBpbmcgdGhlIFVSTHMgaW4gYW5jaG9yIHRhZ3NcclxuXHRcdFx0d2hpbGUoICggY3VycmVudFJlc3VsdCA9IGh0bWxSZWdleC5leGVjKCBodG1sICkgKSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHR2YXIgdGFnVGV4dCA9IGN1cnJlbnRSZXN1bHRbIDAgXSxcclxuXHRcdFx0XHQgICAgdGFnTmFtZSA9IGN1cnJlbnRSZXN1bHRbIDEgXSB8fCBjdXJyZW50UmVzdWx0WyAzIF0sICAvLyBUaGUgPCFET0NUWVBFPiB0YWcgKGV4OiBcIiFET0NUWVBFXCIpLCBvciBhbm90aGVyIHRhZyAoZXg6IFwiYVwiKSBcclxuXHRcdFx0XHQgICAgaXNDbG9zaW5nVGFnID0gISFjdXJyZW50UmVzdWx0WyAyIF0sXHJcblx0XHRcdFx0ICAgIGluQmV0d2VlblRhZ3NUZXh0ID0gaHRtbC5zdWJzdHJpbmcoIGxhc3RJbmRleCwgY3VycmVudFJlc3VsdC5pbmRleCApO1xyXG5cclxuXHRcdFx0XHRpZiggaW5CZXR3ZWVuVGFnc1RleHQgKSB7XHJcblx0XHRcdFx0XHRwcm9jZXNzVGV4dE5vZGVWaXNpdG9yKCBpbkJldHdlZW5UYWdzVGV4dCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cHJvY2Vzc0h0bWxOb2RlVmlzaXRvciggdGFnVGV4dCwgdGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBpc0Nsb3NpbmdUYWcgKTtcclxuXHJcblx0XHRcdFx0bGFzdEluZGV4ID0gY3VycmVudFJlc3VsdC5pbmRleCArIHRhZ1RleHQubGVuZ3RoO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBQcm9jZXNzIGFueSByZW1haW5pbmcgdGV4dCBhZnRlciB0aGUgbGFzdCBIVE1MIGVsZW1lbnQuIFdpbGwgcHJvY2VzcyBhbGwgb2YgdGhlIHRleHQgaWYgdGhlcmUgd2VyZSBubyBIVE1MIGVsZW1lbnRzLlxyXG5cdFx0XHRpZiggbGFzdEluZGV4IDwgaHRtbC5sZW5ndGggKSB7XHJcblx0XHRcdFx0dmFyIHRleHQgPSBodG1sLnN1YnN0cmluZyggbGFzdEluZGV4ICk7XHJcblxyXG5cdFx0XHRcdGlmKCB0ZXh0ICkge1xyXG5cdFx0XHRcdFx0cHJvY2Vzc1RleHROb2RlVmlzaXRvciggdGV4dCApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qanNoaW50IGJvc3M6dHJ1ZSAqL1xyXG5cdC8qKlxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLkh0bWxUYWdcclxuXHQgKiBAZXh0ZW5kcyBPYmplY3RcclxuXHQgKiBcclxuXHQgKiBSZXByZXNlbnRzIGFuIEhUTUwgdGFnLCB3aGljaCBjYW4gYmUgdXNlZCB0byBlYXNpbHkgYnVpbGQvbW9kaWZ5IEhUTUwgdGFncyBwcm9ncmFtbWF0aWNhbGx5LlxyXG5cdCAqIFxyXG5cdCAqIEF1dG9saW5rZXIgdXNlcyB0aGlzIGFic3RyYWN0aW9uIHRvIGNyZWF0ZSBIVE1MIHRhZ3MsIGFuZCB0aGVuIHdyaXRlIHRoZW0gb3V0IGFzIHN0cmluZ3MuIFlvdSBtYXkgYWxzbyB1c2VcclxuXHQgKiB0aGlzIGNsYXNzIGluIHlvdXIgY29kZSwgZXNwZWNpYWxseSB3aXRoaW4gYSB7QGxpbmsgQXV0b2xpbmtlciNyZXBsYWNlRm4gcmVwbGFjZUZufS5cclxuXHQgKiBcclxuXHQgKiAjIyBFeGFtcGxlc1xyXG5cdCAqIFxyXG5cdCAqIEV4YW1wbGUgaW5zdGFudGlhdGlvbjpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIHRhZyA9IG5ldyBBdXRvbGlua2VyLkh0bWxUYWcoIHtcclxuXHQgKiAgICAgICAgIHRhZ05hbWUgOiAnYScsXHJcblx0ICogICAgICAgICBhdHRycyAgIDogeyAnaHJlZic6ICdodHRwOi8vZ29vZ2xlLmNvbScsICdjbGFzcyc6ICdleHRlcm5hbC1saW5rJyB9LFxyXG5cdCAqICAgICAgICAgaW5uZXJIdG1sIDogJ0dvb2dsZSdcclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgdGFnLnRvU3RyaW5nKCk7ICAvLyA8YSBocmVmPVwiaHR0cDovL2dvb2dsZS5jb21cIiBjbGFzcz1cImV4dGVybmFsLWxpbmtcIj5Hb29nbGU8L2E+XHJcblx0ICogICAgIFxyXG5cdCAqICAgICAvLyBJbmRpdmlkdWFsIGFjY2Vzc29yIG1ldGhvZHNcclxuXHQgKiAgICAgdGFnLmdldFRhZ05hbWUoKTsgICAgICAgICAgICAgICAgIC8vICdhJ1xyXG5cdCAqICAgICB0YWcuZ2V0QXR0ciggJ2hyZWYnICk7ICAgICAgICAgICAgLy8gJ2h0dHA6Ly9nb29nbGUuY29tJ1xyXG5cdCAqICAgICB0YWcuaGFzQ2xhc3MoICdleHRlcm5hbC1saW5rJyApOyAgLy8gdHJ1ZVxyXG5cdCAqIFxyXG5cdCAqIFxyXG5cdCAqIFVzaW5nIG11dGF0b3IgbWV0aG9kcyAod2hpY2ggbWF5IGJlIHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBpbnN0YW50aWF0aW9uIGNvbmZpZyBwcm9wZXJ0aWVzKTpcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIHRhZyA9IG5ldyBBdXRvbGlua2VyLkh0bWxUYWcoKTtcclxuXHQgKiAgICAgdGFnLnNldFRhZ05hbWUoICdhJyApO1xyXG5cdCAqICAgICB0YWcuc2V0QXR0ciggJ2hyZWYnLCAnaHR0cDovL2dvb2dsZS5jb20nICk7XHJcblx0ICogICAgIHRhZy5hZGRDbGFzcyggJ2V4dGVybmFsLWxpbmsnICk7XHJcblx0ICogICAgIHRhZy5zZXRJbm5lckh0bWwoICdHb29nbGUnICk7XHJcblx0ICogICAgIFxyXG5cdCAqICAgICB0YWcuZ2V0VGFnTmFtZSgpOyAgICAgICAgICAgICAgICAgLy8gJ2EnXHJcblx0ICogICAgIHRhZy5nZXRBdHRyKCAnaHJlZicgKTsgICAgICAgICAgICAvLyAnaHR0cDovL2dvb2dsZS5jb20nXHJcblx0ICogICAgIHRhZy5oYXNDbGFzcyggJ2V4dGVybmFsLWxpbmsnICk7ICAvLyB0cnVlXHJcblx0ICogICAgIFxyXG5cdCAqICAgICB0YWcudG9TdHJpbmcoKTsgIC8vIDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIGNsYXNzPVwiZXh0ZXJuYWwtbGlua1wiPkdvb2dsZTwvYT5cclxuXHQgKiAgICAgXHJcblx0ICogXHJcblx0ICogIyMgRXhhbXBsZSB1c2Ugd2l0aGluIGEge0BsaW5rIEF1dG9saW5rZXIjcmVwbGFjZUZuIHJlcGxhY2VGbn1cclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGh0bWwgPSBBdXRvbGlua2VyLmxpbmsoIFwiVGVzdCBnb29nbGUuY29tXCIsIHtcclxuXHQgKiAgICAgICAgIHJlcGxhY2VGbiA6IGZ1bmN0aW9uKCBhdXRvbGlua2VyLCBtYXRjaCApIHtcclxuXHQgKiAgICAgICAgICAgICB2YXIgdGFnID0gYXV0b2xpbmtlci5nZXRUYWdCdWlsZGVyKCkuYnVpbGQoIG1hdGNoICk7ICAvLyByZXR1cm5zIGFuIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWd9IGluc3RhbmNlLCBjb25maWd1cmVkIHdpdGggdGhlIE1hdGNoJ3MgaHJlZiBhbmQgYW5jaG9yIHRleHRcclxuXHQgKiAgICAgICAgICAgICB0YWcuc2V0QXR0ciggJ3JlbCcsICdub2ZvbGxvdycgKTtcclxuXHQgKiAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICByZXR1cm4gdGFnO1xyXG5cdCAqICAgICAgICAgfVxyXG5cdCAqICAgICB9ICk7XHJcblx0ICogICAgIFxyXG5cdCAqICAgICAvLyBnZW5lcmF0ZWQgaHRtbDpcclxuXHQgKiAgICAgLy8gICBUZXN0IDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vZm9sbG93XCI+Z29vZ2xlLmNvbTwvYT5cclxuXHQgKiAgICAgXHJcblx0ICogICAgIFxyXG5cdCAqICMjIEV4YW1wbGUgdXNlIHdpdGggYSBuZXcgdGFnIGZvciB0aGUgcmVwbGFjZW1lbnRcclxuXHQgKiBcclxuXHQgKiAgICAgdmFyIGh0bWwgPSBBdXRvbGlua2VyLmxpbmsoIFwiVGVzdCBnb29nbGUuY29tXCIsIHtcclxuXHQgKiAgICAgICAgIHJlcGxhY2VGbiA6IGZ1bmN0aW9uKCBhdXRvbGlua2VyLCBtYXRjaCApIHtcclxuXHQgKiAgICAgICAgICAgICB2YXIgdGFnID0gbmV3IEF1dG9saW5rZXIuSHRtbFRhZygge1xyXG5cdCAqICAgICAgICAgICAgICAgICB0YWdOYW1lIDogJ2J1dHRvbicsXHJcblx0ICogICAgICAgICAgICAgICAgIGF0dHJzICAgOiB7ICd0aXRsZSc6ICdMb2FkIFVSTDogJyArIG1hdGNoLmdldEFuY2hvckhyZWYoKSB9LFxyXG5cdCAqICAgICAgICAgICAgICAgICBpbm5lckh0bWwgOiAnTG9hZCBVUkw6ICcgKyBtYXRjaC5nZXRBbmNob3JUZXh0KClcclxuXHQgKiAgICAgICAgICAgICB9ICk7XHJcblx0ICogICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuXHQgKiAgICAgICAgIH1cclxuXHQgKiAgICAgfSApO1xyXG5cdCAqICAgICBcclxuXHQgKiAgICAgLy8gZ2VuZXJhdGVkIGh0bWw6XHJcblx0ICogICAgIC8vICAgVGVzdCA8YnV0dG9uIHRpdGxlPVwiTG9hZCBVUkw6IGh0dHA6Ly9nb29nbGUuY29tXCI+TG9hZCBVUkw6IGdvb2dsZS5jb208L2J1dHRvbj5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLkh0bWxUYWcgPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBPYmplY3QsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gdGFnTmFtZVxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgdGFnIG5hbWUuIEV4OiAnYScsICdidXR0b24nLCBldGMuXHJcblx0XHQgKiBcclxuXHRcdCAqIE5vdCByZXF1aXJlZCBhdCBpbnN0YW50aWF0aW9uIHRpbWUsIGJ1dCBzaG91bGQgYmUgc2V0IHVzaW5nIHtAbGluayAjc2V0VGFnTmFtZX0gYmVmb3JlIHtAbGluayAjdG9TdHJpbmd9XHJcblx0XHQgKiBpcyBleGVjdXRlZC5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7T2JqZWN0LjxTdHJpbmcsIFN0cmluZz59IGF0dHJzXHJcblx0XHQgKiBcclxuXHRcdCAqIEFuIGtleS92YWx1ZSBPYmplY3QgKG1hcCkgb2YgYXR0cmlidXRlcyB0byBjcmVhdGUgdGhlIHRhZyB3aXRoLiBUaGUga2V5cyBhcmUgdGhlIGF0dHJpYnV0ZSBuYW1lcywgYW5kIHRoZVxyXG5cdFx0ICogdmFsdWVzIGFyZSB0aGUgYXR0cmlidXRlIHZhbHVlcy5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7U3RyaW5nfSBpbm5lckh0bWxcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIGlubmVyIEhUTUwgZm9yIHRoZSB0YWcuIFxyXG5cdFx0ICogXHJcblx0XHQgKiBOb3RlIHRoZSBjYW1lbCBjYXNlIG5hbWUgb24gYGlubmVySHRtbGAuIEFjcm9ueW1zIGFyZSBjYW1lbENhc2VkIGluIHRoaXMgdXRpbGl0eSAoc3VjaCBhcyBub3QgdG8gcnVuIGludG8gdGhlIGFjcm9ueW0gXHJcblx0XHQgKiBuYW1pbmcgaW5jb25zaXN0ZW5jeSB0aGF0IHRoZSBET00gZGV2ZWxvcGVycyBjcmVhdGVkIHdpdGggYFhNTEh0dHBSZXF1ZXN0YCkuIFlvdSBtYXkgYWx0ZXJuYXRpdmVseSB1c2Uge0BsaW5rICNpbm5lckhUTUx9XHJcblx0XHQgKiBpZiB5b3UgcHJlZmVyLCBidXQgdGhpcyBvbmUgaXMgcmVjb21tZW5kZWQuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gaW5uZXJIVE1MXHJcblx0XHQgKiBcclxuXHRcdCAqIEFsaWFzIG9mIHtAbGluayAjaW5uZXJIdG1sfSwgYWNjZXB0ZWQgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIGJyb3dzZXIgRE9NIGFwaSwgYnV0IHByZWZlciB0aGUgY2FtZWxDYXNlZCB2ZXJzaW9uXHJcblx0XHQgKiBmb3IgYWNyb255bSBuYW1lcy5cclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSB3aGl0ZXNwYWNlUmVnZXhcclxuXHRcdCAqIFxyXG5cdFx0ICogUmVndWxhciBleHByZXNzaW9uIHVzZWQgdG8gbWF0Y2ggd2hpdGVzcGFjZSBpbiBhIHN0cmluZyBvZiBDU1MgY2xhc3Nlcy5cclxuXHRcdCAqL1xyXG5cdFx0d2hpdGVzcGFjZVJlZ2V4IDogL1xccysvLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjb25zdHJ1Y3RvclxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IFtjZmddIFRoZSBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgZm9yIHRoaXMgY2xhc3MsIGluIGFuIE9iamVjdCAobWFwKVxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3RvciA6IGZ1bmN0aW9uKCBjZmcgKSB7XHJcblx0XHRcdEF1dG9saW5rZXIuVXRpbC5hc3NpZ24oIHRoaXMsIGNmZyApO1xyXG5cclxuXHRcdFx0dGhpcy5pbm5lckh0bWwgPSB0aGlzLmlubmVySHRtbCB8fCB0aGlzLmlubmVySFRNTDsgIC8vIGFjY2VwdCBlaXRoZXIgdGhlIGNhbWVsQ2FzZWQgZm9ybSBvciB0aGUgZnVsbHkgY2FwaXRhbGl6ZWQgYWNyb255bVxyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTZXRzIHRoZSB0YWcgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCB0byBnZW5lcmF0ZSB0aGUgdGFnIHdpdGguXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0YWdOYW1lXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLkh0bWxUYWd9IFRoaXMgSHRtbFRhZyBpbnN0YW5jZSwgc28gdGhhdCBtZXRob2QgY2FsbHMgbWF5IGJlIGNoYWluZWQuXHJcblx0XHQgKi9cclxuXHRcdHNldFRhZ05hbWUgOiBmdW5jdGlvbiggdGFnTmFtZSApIHtcclxuXHRcdFx0dGhpcy50YWdOYW1lID0gdGFnTmFtZTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHJpZXZlcyB0aGUgdGFnIG5hbWUuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0VGFnTmFtZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy50YWdOYW1lIHx8IFwiXCI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldHMgYW4gYXR0cmlidXRlIG9uIHRoZSBIdG1sVGFnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gYXR0ck5hbWUgVGhlIGF0dHJpYnV0ZSBuYW1lIHRvIHNldC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyVmFsdWUgVGhlIGF0dHJpYnV0ZSB2YWx1ZSB0byBzZXQuXHJcblx0XHQgKiBAcmV0dXJuIHtBdXRvbGlua2VyLkh0bWxUYWd9IFRoaXMgSHRtbFRhZyBpbnN0YW5jZSwgc28gdGhhdCBtZXRob2QgY2FsbHMgbWF5IGJlIGNoYWluZWQuXHJcblx0XHQgKi9cclxuXHRcdHNldEF0dHIgOiBmdW5jdGlvbiggYXR0ck5hbWUsIGF0dHJWYWx1ZSApIHtcclxuXHRcdFx0dmFyIHRhZ0F0dHJzID0gdGhpcy5nZXRBdHRycygpO1xyXG5cdFx0XHR0YWdBdHRyc1sgYXR0ck5hbWUgXSA9IGF0dHJWYWx1ZTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXRyaWV2ZXMgYW4gYXR0cmlidXRlIGZyb20gdGhlIEh0bWxUYWcuIElmIHRoZSBhdHRyaWJ1dGUgZG9lcyBub3QgZXhpc3QsIHJldHVybnMgYHVuZGVmaW5lZGAuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byByZXRyaWV2ZS5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGF0dHJpYnV0ZSdzIHZhbHVlLCBvciBgdW5kZWZpbmVkYCBpZiBpdCBkb2VzIG5vdCBleGlzdCBvbiB0aGUgSHRtbFRhZy5cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QXR0ciA6IGZ1bmN0aW9uKCBhdHRyTmFtZSApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cnMoKVsgYXR0ck5hbWUgXTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2V0cyBvbmUgb3IgbW9yZSBhdHRyaWJ1dGVzIG9uIHRoZSBIdG1sVGFnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdC48U3RyaW5nLCBTdHJpbmc+fSBhdHRycyBBIGtleS92YWx1ZSBPYmplY3QgKG1hcCkgb2YgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0LlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRzZXRBdHRycyA6IGZ1bmN0aW9uKCBhdHRycyApIHtcclxuXHRcdFx0dmFyIHRhZ0F0dHJzID0gdGhpcy5nZXRBdHRycygpO1xyXG5cdFx0XHRBdXRvbGlua2VyLlV0aWwuYXNzaWduKCB0YWdBdHRycywgYXR0cnMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXRyaWV2ZXMgdGhlIGF0dHJpYnV0ZXMgT2JqZWN0IChtYXApIGZvciB0aGUgSHRtbFRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7T2JqZWN0LjxTdHJpbmcsIFN0cmluZz59IEEga2V5L3ZhbHVlIG9iamVjdCBvZiB0aGUgYXR0cmlidXRlcyBmb3IgdGhlIEh0bWxUYWcuXHJcblx0XHQgKi9cclxuXHRcdGdldEF0dHJzIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmF0dHJzIHx8ICggdGhpcy5hdHRycyA9IHt9ICk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNldHMgdGhlIHByb3ZpZGVkIGBjc3NDbGFzc2AsIG92ZXJ3cml0aW5nIGFueSBjdXJyZW50IENTUyBjbGFzc2VzIG9uIHRoZSBIdG1sVGFnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gY3NzQ2xhc3MgT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHRvIHNldCAob3ZlcndyaXRlKS5cclxuXHRcdCAqIEByZXR1cm4ge0F1dG9saW5rZXIuSHRtbFRhZ30gVGhpcyBIdG1sVGFnIGluc3RhbmNlLCBzbyB0aGF0IG1ldGhvZCBjYWxscyBtYXkgYmUgY2hhaW5lZC5cclxuXHRcdCAqL1xyXG5cdFx0c2V0Q2xhc3MgOiBmdW5jdGlvbiggY3NzQ2xhc3MgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnNldEF0dHIoICdjbGFzcycsIGNzc0NsYXNzICk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENvbnZlbmllbmNlIG1ldGhvZCB0byBhZGQgb25lIG9yIG1vcmUgQ1NTIGNsYXNzZXMgdG8gdGhlIEh0bWxUYWcuIFdpbGwgbm90IGFkZCBkdXBsaWNhdGUgQ1NTIGNsYXNzZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBjc3NDbGFzcyBPbmUgb3IgbW9yZSBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdG8gYWRkLlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRhZGRDbGFzcyA6IGZ1bmN0aW9uKCBjc3NDbGFzcyApIHtcclxuXHRcdFx0dmFyIGNsYXNzQXR0ciA9IHRoaXMuZ2V0Q2xhc3MoKSxcclxuXHRcdFx0ICAgIHdoaXRlc3BhY2VSZWdleCA9IHRoaXMud2hpdGVzcGFjZVJlZ2V4LFxyXG5cdFx0XHQgICAgaW5kZXhPZiA9IEF1dG9saW5rZXIuVXRpbC5pbmRleE9mLCAgLy8gdG8gc3VwcG9ydCBJRTggYW5kIGJlbG93XHJcblx0XHRcdCAgICBjbGFzc2VzID0gKCAhY2xhc3NBdHRyICkgPyBbXSA6IGNsYXNzQXR0ci5zcGxpdCggd2hpdGVzcGFjZVJlZ2V4ICksXHJcblx0XHRcdCAgICBuZXdDbGFzc2VzID0gY3NzQ2xhc3Muc3BsaXQoIHdoaXRlc3BhY2VSZWdleCApLFxyXG5cdFx0XHQgICAgbmV3Q2xhc3M7XHJcblxyXG5cdFx0XHR3aGlsZSggbmV3Q2xhc3MgPSBuZXdDbGFzc2VzLnNoaWZ0KCkgKSB7XHJcblx0XHRcdFx0aWYoIGluZGV4T2YoIGNsYXNzZXMsIG5ld0NsYXNzICkgPT09IC0xICkge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCBuZXdDbGFzcyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXRBdHRycygpWyAnY2xhc3MnIF0gPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmVtb3ZlIG9uZSBvciBtb3JlIENTUyBjbGFzc2VzIGZyb20gdGhlIEh0bWxUYWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBjc3NDbGFzcyBPbmUgb3IgbW9yZSBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdG8gcmVtb3ZlLlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRyZW1vdmVDbGFzcyA6IGZ1bmN0aW9uKCBjc3NDbGFzcyApIHtcclxuXHRcdFx0dmFyIGNsYXNzQXR0ciA9IHRoaXMuZ2V0Q2xhc3MoKSxcclxuXHRcdFx0ICAgIHdoaXRlc3BhY2VSZWdleCA9IHRoaXMud2hpdGVzcGFjZVJlZ2V4LFxyXG5cdFx0XHQgICAgaW5kZXhPZiA9IEF1dG9saW5rZXIuVXRpbC5pbmRleE9mLCAgLy8gdG8gc3VwcG9ydCBJRTggYW5kIGJlbG93XHJcblx0XHRcdCAgICBjbGFzc2VzID0gKCAhY2xhc3NBdHRyICkgPyBbXSA6IGNsYXNzQXR0ci5zcGxpdCggd2hpdGVzcGFjZVJlZ2V4ICksXHJcblx0XHRcdCAgICByZW1vdmVDbGFzc2VzID0gY3NzQ2xhc3Muc3BsaXQoIHdoaXRlc3BhY2VSZWdleCApLFxyXG5cdFx0XHQgICAgcmVtb3ZlQ2xhc3M7XHJcblxyXG5cdFx0XHR3aGlsZSggY2xhc3Nlcy5sZW5ndGggJiYgKCByZW1vdmVDbGFzcyA9IHJlbW92ZUNsYXNzZXMuc2hpZnQoKSApICkge1xyXG5cdFx0XHRcdHZhciBpZHggPSBpbmRleE9mKCBjbGFzc2VzLCByZW1vdmVDbGFzcyApO1xyXG5cdFx0XHRcdGlmKCBpZHggIT09IC0xICkge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5zcGxpY2UoIGlkeCwgMSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXRBdHRycygpWyAnY2xhc3MnIF0gPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIENTUyBjbGFzcyhlcykgZm9yIHRoZSBIdG1sVGFnLCB3aGljaCB3aWxsIGVhY2ggYmUgc2VwYXJhdGVkIGJ5IHNwYWNlcyB3aGVuXHJcblx0XHQgKiB0aGVyZSBhcmUgbXVsdGlwbGUuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0Q2xhc3MgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0QXR0cnMoKVsgJ2NsYXNzJyBdIHx8IFwiXCI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENvbnZlbmllbmNlIG1ldGhvZCB0byBjaGVjayBpZiB0aGUgdGFnIGhhcyBhIENTUyBjbGFzcyBvciBub3QuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBjc3NDbGFzcyBUaGUgQ1NTIGNsYXNzIHRvIGNoZWNrIGZvci5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgSHRtbFRhZyBoYXMgdGhlIENTUyBjbGFzcywgYGZhbHNlYCBvdGhlcndpc2UuXHJcblx0XHQgKi9cclxuXHRcdGhhc0NsYXNzIDogZnVuY3Rpb24oIGNzc0NsYXNzICkge1xyXG5cdFx0XHRyZXR1cm4gKCAnICcgKyB0aGlzLmdldENsYXNzKCkgKyAnICcgKS5pbmRleE9mKCAnICcgKyBjc3NDbGFzcyArICcgJyApICE9PSAtMTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2V0cyB0aGUgaW5uZXIgSFRNTCBmb3IgdGhlIHRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IGh0bWwgVGhlIGlubmVyIEhUTUwgdG8gc2V0LlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGlzIEh0bWxUYWcgaW5zdGFuY2UsIHNvIHRoYXQgbWV0aG9kIGNhbGxzIG1heSBiZSBjaGFpbmVkLlxyXG5cdFx0ICovXHJcblx0XHRzZXRJbm5lckh0bWwgOiBmdW5jdGlvbiggaHRtbCApIHtcclxuXHRcdFx0dGhpcy5pbm5lckh0bWwgPSBodG1sO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHJpZXZlcyB0aGUgaW5uZXIgSFRNTCBmb3IgdGhlIHRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRJbm5lckh0bWwgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaW5uZXJIdG1sIHx8IFwiXCI7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIE92ZXJyaWRlIG9mIHN1cGVyY2xhc3MgbWV0aG9kIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIEhUTUwgc3RyaW5nIGZvciB0aGUgdGFnLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdHRvU3RyaW5nIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0YWdOYW1lID0gdGhpcy5nZXRUYWdOYW1lKCksXHJcblx0XHRcdCAgICBhdHRyc1N0ciA9IHRoaXMuYnVpbGRBdHRyc1N0cigpO1xyXG5cclxuXHRcdFx0YXR0cnNTdHIgPSAoIGF0dHJzU3RyICkgPyAnICcgKyBhdHRyc1N0ciA6ICcnOyAgLy8gcHJlcGVuZCBhIHNwYWNlIGlmIHRoZXJlIGFyZSBhY3R1YWxseSBhdHRyaWJ1dGVzXHJcblxyXG5cdFx0XHRyZXR1cm4gWyAnPCcsIHRhZ05hbWUsIGF0dHJzU3RyLCAnPicsIHRoaXMuZ2V0SW5uZXJIdG1sKCksICc8LycsIHRhZ05hbWUsICc+JyBdLmpvaW4oIFwiXCIgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3VwcG9ydCBtZXRob2QgZm9yIHtAbGluayAjdG9TdHJpbmd9LCByZXR1cm5zIHRoZSBzdHJpbmcgc3BhY2Utc2VwYXJhdGVkIGtleT1cInZhbHVlXCIgcGFpcnMsIHVzZWQgdG8gcG9wdWxhdGUgXHJcblx0XHQgKiB0aGUgc3RyaW5naWZpZWQgSHRtbFRhZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByb3RlY3RlZFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBFeGFtcGxlIHJldHVybjogYGF0dHIxPVwidmFsdWUxXCIgYXR0cjI9XCJ2YWx1ZTJcImBcclxuXHRcdCAqL1xyXG5cdFx0YnVpbGRBdHRyc1N0ciA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiggIXRoaXMuYXR0cnMgKSByZXR1cm4gXCJcIjsgIC8vIG5vIGBhdHRyc2AgT2JqZWN0IChtYXApIGhhcyBiZWVuIHNldCwgcmV0dXJuIGVtcHR5IHN0cmluZ1xyXG5cclxuXHRcdFx0dmFyIGF0dHJzID0gdGhpcy5nZXRBdHRycygpLFxyXG5cdFx0XHQgICAgYXR0cnNBcnIgPSBbXTtcclxuXHJcblx0XHRcdGZvciggdmFyIHByb3AgaW4gYXR0cnMgKSB7XHJcblx0XHRcdFx0aWYoIGF0dHJzLmhhc093blByb3BlcnR5KCBwcm9wICkgKSB7XHJcblx0XHRcdFx0XHRhdHRyc0Fyci5wdXNoKCBwcm9wICsgJz1cIicgKyBhdHRyc1sgcHJvcCBdICsgJ1wiJyApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYXR0cnNBcnIuam9pbiggXCIgXCIgKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKmpzaGludCBzY3JpcHR1cmw6dHJ1ZSAqL1xyXG5cdC8qKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIuTWF0Y2hWYWxpZGF0b3JcclxuXHQgKiBAZXh0ZW5kcyBPYmplY3RcclxuXHQgKiBcclxuXHQgKiBVc2VkIGJ5IEF1dG9saW5rZXIgdG8gZmlsdGVyIG91dCBmYWxzZSBwb3NpdGl2ZXMgZnJvbSB0aGUge0BsaW5rIEF1dG9saW5rZXIjbWF0Y2hlclJlZ2V4fS5cclxuXHQgKiBcclxuXHQgKiBEdWUgdG8gdGhlIGxpbWl0YXRpb25zIG9mIHJlZ3VsYXIgZXhwcmVzc2lvbnMgKGluY2x1ZGluZyB0aGUgbWlzc2luZyBmZWF0dXJlIG9mIGxvb2stYmVoaW5kcyBpbiBKUyByZWd1bGFyIGV4cHJlc3Npb25zKSxcclxuXHQgKiB3ZSBjYW5ub3QgYWx3YXlzIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2YgYSBnaXZlbiBtYXRjaC4gVGhpcyBjbGFzcyBhcHBsaWVzIGEgYml0IG9mIGFkZGl0aW9uYWwgbG9naWMgdG8gZmlsdGVyIG91dCBhbnlcclxuXHQgKiBmYWxzZSBwb3NpdGl2ZXMgdGhhdCBoYXZlIGJlZW4gbWF0Y2hlZCBieSB0aGUge0BsaW5rIEF1dG9saW5rZXIjbWF0Y2hlclJlZ2V4fS5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLk1hdGNoVmFsaWRhdG9yID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggT2JqZWN0LCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGludmFsaWRQcm90b2NvbFJlbE1hdGNoUmVnZXhcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIGNoZWNrIGEgcG90ZW50aWFsIHByb3RvY29sLXJlbGF0aXZlIFVSTCBtYXRjaCwgY29taW5nIGZyb20gdGhlIFxyXG5cdFx0ICoge0BsaW5rIEF1dG9saW5rZXIjbWF0Y2hlclJlZ2V4fS4gQSBwcm90b2NvbC1yZWxhdGl2ZSBVUkwgaXMsIGZvciBleGFtcGxlLCBcIi8veWFob28uY29tXCJcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyByZWd1bGFyIGV4cHJlc3Npb24gY2hlY2tzIHRvIHNlZSBpZiB0aGVyZSBpcyBhIHdvcmQgY2hhcmFjdGVyIGJlZm9yZSB0aGUgJy8vJyBtYXRjaCBpbiBvcmRlciB0byBkZXRlcm1pbmUgaWYgXHJcblx0XHQgKiB3ZSBzaG91bGQgYWN0dWFsbHkgYXV0b2xpbmsgYSBwcm90b2NvbC1yZWxhdGl2ZSBVUkwuIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlcmUgaXMgbm8gbmVnYXRpdmUgbG9vay1iZWhpbmQgaW4gXHJcblx0XHQgKiBKYXZhU2NyaXB0IHJlZ3VsYXIgZXhwcmVzc2lvbnMuIFxyXG5cdFx0ICogXHJcblx0XHQgKiBGb3IgaW5zdGFuY2UsIHdlIHdhbnQgdG8gYXV0b2xpbmsgc29tZXRoaW5nIGxpa2UgXCJHbyB0bzogLy9nb29nbGUuY29tXCIsIGJ1dCB3ZSBkb24ndCB3YW50IHRvIGF1dG9saW5rIHNvbWV0aGluZyBcclxuXHRcdCAqIGxpa2UgXCJhYmMvL2dvb2dsZS5jb21cIlxyXG5cdFx0ICovXHJcblx0XHRpbnZhbGlkUHJvdG9jb2xSZWxNYXRjaFJlZ2V4IDogL15bXFx3XVxcL1xcLy8sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWdleCB0byB0ZXN0IGZvciBhIGZ1bGwgcHJvdG9jb2wsIHdpdGggdGhlIHR3byB0cmFpbGluZyBzbGFzaGVzLiBFeDogJ2h0dHA6Ly8nXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gaGFzRnVsbFByb3RvY29sUmVnZXhcclxuXHRcdCAqL1xyXG5cdFx0aGFzRnVsbFByb3RvY29sUmVnZXggOiAvXltBLVphLXpdWy0uK0EtWmEtejAtOV0rOlxcL1xcLy8sXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWdleCB0byBmaW5kIHRoZSBVUkkgc2NoZW1lLCBzdWNoIGFzICdtYWlsdG86Jy5cclxuXHRcdCAqIFxyXG5cdFx0ICogVGhpcyBpcyB1c2VkIHRvIGZpbHRlciBvdXQgJ2phdmFzY3JpcHQ6JyBhbmQgJ3Zic2NyaXB0Oicgc2NoZW1lcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSB1cmlTY2hlbWVSZWdleFxyXG5cdFx0ICovXHJcblx0XHR1cmlTY2hlbWVSZWdleCA6IC9eW0EtWmEtel1bLS4rQS1aYS16MC05XSs6LyxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJlZ2V4IHRvIGRldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgd29yZCBjaGFyIGV4aXN0cyBhZnRlciB0aGUgcHJvdG9jb2wgKGkuZS4gYWZ0ZXIgdGhlICc6JylcclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBoYXNXb3JkQ2hhckFmdGVyUHJvdG9jb2xSZWdleFxyXG5cdFx0ICovXHJcblx0XHRoYXNXb3JkQ2hhckFmdGVyUHJvdG9jb2xSZWdleCA6IC86W15cXHNdKj9bQS1aYS16XS8sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRGV0ZXJtaW5lcyBpZiBhIGdpdmVuIG1hdGNoIGZvdW5kIGJ5IHtAbGluayBBdXRvbGlua2VyI3Byb2Nlc3NUZXh0Tm9kZX0gaXMgdmFsaWQuIFdpbGwgcmV0dXJuIGBmYWxzZWAgZm9yOlxyXG5cdFx0ICogXHJcblx0XHQgKiAxKSBVUkwgbWF0Y2hlcyB3aGljaCBkbyBub3QgaGF2ZSBhdCBsZWFzdCBoYXZlIG9uZSBwZXJpb2QgKCcuJykgaW4gdGhlIGRvbWFpbiBuYW1lIChlZmZlY3RpdmVseSBza2lwcGluZyBvdmVyIFxyXG5cdFx0ICogICAgbWF0Y2hlcyBsaWtlIFwiYWJjOmRlZlwiKS4gSG93ZXZlciwgVVJMIG1hdGNoZXMgd2l0aCBhIHByb3RvY29sIHdpbGwgYmUgYWxsb3dlZCAoZXg6ICdodHRwOi8vbG9jYWxob3N0JylcclxuXHRcdCAqIDIpIFVSTCBtYXRjaGVzIHdoaWNoIGRvIG5vdCBoYXZlIGF0IGxlYXN0IG9uZSB3b3JkIGNoYXJhY3RlciBpbiB0aGUgZG9tYWluIG5hbWUgKGVmZmVjdGl2ZWx5IHNraXBwaW5nIG92ZXJcclxuXHRcdCAqICAgIG1hdGNoZXMgbGlrZSBcImdpdDoxLjBcIikuXHJcblx0XHQgKiAzKSBBIHByb3RvY29sLXJlbGF0aXZlIHVybCBtYXRjaCAoYSBVUkwgYmVnaW5uaW5nIHdpdGggJy8vJykgd2hvc2UgcHJldmlvdXMgY2hhcmFjdGVyIGlzIGEgd29yZCBjaGFyYWN0ZXIgXHJcblx0XHQgKiAgICAoZWZmZWN0aXZlbHkgc2tpcHBpbmcgb3ZlciBzdHJpbmdzIGxpa2UgXCJhYmMvL2dvb2dsZS5jb21cIilcclxuXHRcdCAqIFxyXG5cdFx0ICogT3RoZXJ3aXNlLCByZXR1cm5zIGB0cnVlYC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHVybE1hdGNoIFRoZSBtYXRjaGVkIFVSTCwgaWYgdGhlcmUgd2FzIG9uZS4gV2lsbCBiZSBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIG1hdGNoIGlzIG5vdCBhIFVSTCBtYXRjaC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbFVybE1hdGNoIFRoZSBtYXRjaCBVUkwgc3RyaW5nIGZvciBhIHByb3RvY29sIG1hdGNoLiBFeDogJ2h0dHA6Ly95YWhvby5jb20nLiBUaGlzIGlzIHVzZWQgdG8gbWF0Y2hcclxuXHRcdCAqICAgc29tZXRoaW5nIGxpa2UgJ2h0dHA6Ly9sb2NhbGhvc3QnLCB3aGVyZSB3ZSB3b24ndCBkb3VibGUgY2hlY2sgdGhhdCB0aGUgZG9tYWluIG5hbWUgaGFzIGF0IGxlYXN0IG9uZSAnLicgaW4gaXQuXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xSZWxhdGl2ZU1hdGNoIFRoZSBwcm90b2NvbC1yZWxhdGl2ZSBzdHJpbmcgZm9yIGEgVVJMIG1hdGNoIChpLmUuICcvLycpLCBwb3NzaWJseSB3aXRoIGEgcHJlY2VkaW5nXHJcblx0XHQgKiAgIGNoYXJhY3RlciAoZXgsIGEgc3BhY2UsIHN1Y2ggYXM6ICcgLy8nLCBvciBhIGxldHRlciwgc3VjaCBhczogJ2EvLycpLiBUaGUgbWF0Y2ggaXMgaW52YWxpZCBpZiB0aGVyZSBpcyBhIHdvcmQgY2hhcmFjdGVyXHJcblx0XHQgKiAgIHByZWNlZGluZyB0aGUgJy8vJy5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgbWF0Y2ggZ2l2ZW4gaXMgdmFsaWQgYW5kIHNob3VsZCBiZSBwcm9jZXNzZWQsIG9yIGBmYWxzZWAgaWYgdGhlIG1hdGNoIGlzIGludmFsaWQgYW5kL29yIFxyXG5cdFx0ICogICBzaG91bGQganVzdCBub3QgYmUgcHJvY2Vzc2VkLlxyXG5cdFx0ICovXHJcblx0XHRpc1ZhbGlkTWF0Y2ggOiBmdW5jdGlvbiggdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2gsIHByb3RvY29sUmVsYXRpdmVNYXRjaCApIHtcclxuXHRcdFx0aWYoXHJcblx0XHRcdFx0KCBwcm90b2NvbFVybE1hdGNoICYmICF0aGlzLmlzVmFsaWRVcmlTY2hlbWUoIHByb3RvY29sVXJsTWF0Y2ggKSApIHx8XHJcblx0XHRcdFx0dGhpcy51cmxNYXRjaERvZXNOb3RIYXZlUHJvdG9jb2xPckRvdCggdXJsTWF0Y2gsIHByb3RvY29sVXJsTWF0Y2ggKSB8fCAgICAgICAvLyBBdCBsZWFzdCBvbmUgcGVyaW9kICgnLicpIG11c3QgZXhpc3QgaW4gdGhlIFVSTCBtYXRjaCBmb3IgdXMgdG8gY29uc2lkZXIgaXQgYW4gYWN0dWFsIFVSTCwgKnVubGVzcyogaXQgd2FzIGEgZnVsbCBwcm90b2NvbCBtYXRjaCAobGlrZSAnaHR0cDovL2xvY2FsaG9zdCcpXHJcblx0XHRcdFx0dGhpcy51cmxNYXRjaERvZXNOb3RIYXZlQXRMZWFzdE9uZVdvcmRDaGFyKCB1cmxNYXRjaCwgcHJvdG9jb2xVcmxNYXRjaCApIHx8ICAvLyBBdCBsZWFzdCBvbmUgbGV0dGVyIGNoYXJhY3RlciBtdXN0IGV4aXN0IGluIHRoZSBkb21haW4gbmFtZSBhZnRlciBhIHByb3RvY29sIG1hdGNoLiBFeDogc2tpcCBvdmVyIHNvbWV0aGluZyBsaWtlIFwiZ2l0OjEuMFwiXHJcblx0XHRcdFx0dGhpcy5pc0ludmFsaWRQcm90b2NvbFJlbGF0aXZlTWF0Y2goIHByb3RvY29sUmVsYXRpdmVNYXRjaCApICAgICAgICAgICAgICAgICAvLyBBIHByb3RvY29sLXJlbGF0aXZlIG1hdGNoIHdoaWNoIGhhcyBhIHdvcmQgY2hhcmFjdGVyIGluIGZyb250IG9mIGl0IChzbyB3ZSBjYW4gc2tpcCBzb21ldGhpbmcgbGlrZSBcImFiYy8vZ29vZ2xlLmNvbVwiKVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZXRlcm1pbmVzIGlmIHRoZSBVUkkgc2NoZW1lIGlzIGEgdmFsaWQgc2NoZW1lIHRvIGJlIGF1dG9saW5rZWQuIFJldHVybnMgYGZhbHNlYCBpZiB0aGUgc2NoZW1lIGlzIFxyXG5cdFx0ICogJ2phdmFzY3JpcHQ6JyBvciAndmJzY3JpcHQ6J1xyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHVyaVNjaGVtZU1hdGNoIFRoZSBtYXRjaCBVUkwgc3RyaW5nIGZvciBhIGZ1bGwgVVJJIHNjaGVtZSBtYXRjaC4gRXg6ICdodHRwOi8veWFob28uY29tJyBcclxuXHRcdCAqICAgb3IgJ21haWx0bzphQGEuY29tJy5cclxuXHRcdCAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgc2NoZW1lIGlzIGEgdmFsaWQgb25lLCBgZmFsc2VgIG90aGVyd2lzZS5cclxuXHRcdCAqL1xyXG5cdFx0aXNWYWxpZFVyaVNjaGVtZSA6IGZ1bmN0aW9uKCB1cmlTY2hlbWVNYXRjaCApIHtcclxuXHRcdFx0dmFyIHVyaVNjaGVtZSA9IHVyaVNjaGVtZU1hdGNoLm1hdGNoKCB0aGlzLnVyaVNjaGVtZVJlZ2V4IClbIDAgXTtcclxuXHJcblx0XHRcdHJldHVybiAoIHVyaVNjaGVtZSAhPT0gJ2phdmFzY3JpcHQ6JyAmJiB1cmlTY2hlbWUgIT09ICd2YnNjcmlwdDonICk7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERldGVybWluZXMgaWYgYSBVUkwgbWF0Y2ggZG9lcyBub3QgaGF2ZSBlaXRoZXI6XHJcblx0XHQgKiBcclxuXHRcdCAqIGEpIGEgZnVsbCBwcm90b2NvbCAoaS5lLiAnaHR0cDovLycpLCBvclxyXG5cdFx0ICogYikgYXQgbGVhc3Qgb25lIGRvdCAoJy4nKSBpbiB0aGUgZG9tYWluIG5hbWUgKGZvciBhIG5vbi1mdWxsLXByb3RvY29sIG1hdGNoKS5cclxuXHRcdCAqIFxyXG5cdFx0ICogRWl0aGVyIHNpdHVhdGlvbiBpcyBjb25zaWRlcmVkIGFuIGludmFsaWQgVVJMIChleDogJ2dpdDpkJyBkb2VzIG5vdCBoYXZlIGVpdGhlciB0aGUgJzovLycgcGFydCwgb3IgYXQgbGVhc3Qgb25lIGRvdFxyXG5cdFx0ICogaW4gdGhlIGRvbWFpbiBuYW1lLiBJZiB0aGUgbWF0Y2ggd2FzICdnaXQ6YWJjLmNvbScsIHdlIHdvdWxkIGNvbnNpZGVyIHRoaXMgdmFsaWQuKVxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHVybE1hdGNoIFRoZSBtYXRjaGVkIFVSTCwgaWYgdGhlcmUgd2FzIG9uZS4gV2lsbCBiZSBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIG1hdGNoIGlzIG5vdCBhIFVSTCBtYXRjaC5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbFVybE1hdGNoIFRoZSBtYXRjaCBVUkwgc3RyaW5nIGZvciBhIHByb3RvY29sIG1hdGNoLiBFeDogJ2h0dHA6Ly95YWhvby5jb20nLiBUaGlzIGlzIHVzZWQgdG8gbWF0Y2hcclxuXHRcdCAqICAgc29tZXRoaW5nIGxpa2UgJ2h0dHA6Ly9sb2NhbGhvc3QnLCB3aGVyZSB3ZSB3b24ndCBkb3VibGUgY2hlY2sgdGhhdCB0aGUgZG9tYWluIG5hbWUgaGFzIGF0IGxlYXN0IG9uZSAnLicgaW4gaXQuXHJcblx0XHQgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIFVSTCBtYXRjaCBkb2VzIG5vdCBoYXZlIGEgZnVsbCBwcm90b2NvbCwgb3IgYXQgbGVhc3Qgb25lIGRvdCAoJy4nKSBpbiBhIG5vbi1mdWxsLXByb3RvY29sXHJcblx0XHQgKiAgIG1hdGNoLlxyXG5cdFx0ICovXHJcblx0XHR1cmxNYXRjaERvZXNOb3RIYXZlUHJvdG9jb2xPckRvdCA6IGZ1bmN0aW9uKCB1cmxNYXRjaCwgcHJvdG9jb2xVcmxNYXRjaCApIHtcclxuXHRcdFx0cmV0dXJuICggISF1cmxNYXRjaCAmJiAoICFwcm90b2NvbFVybE1hdGNoIHx8ICF0aGlzLmhhc0Z1bGxQcm90b2NvbFJlZ2V4LnRlc3QoIHByb3RvY29sVXJsTWF0Y2ggKSApICYmIHVybE1hdGNoLmluZGV4T2YoICcuJyApID09PSAtMSApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBEZXRlcm1pbmVzIGlmIGEgVVJMIG1hdGNoIGRvZXMgbm90IGhhdmUgYXQgbGVhc3Qgb25lIHdvcmQgY2hhcmFjdGVyIGFmdGVyIHRoZSBwcm90b2NvbCAoaS5lLiBpbiB0aGUgZG9tYWluIG5hbWUpLlxyXG5cdFx0ICogXHJcblx0XHQgKiBBdCBsZWFzdCBvbmUgbGV0dGVyIGNoYXJhY3RlciBtdXN0IGV4aXN0IGluIHRoZSBkb21haW4gbmFtZSBhZnRlciBhIHByb3RvY29sIG1hdGNoLiBFeDogc2tpcCBvdmVyIHNvbWV0aGluZyBcclxuXHRcdCAqIGxpa2UgXCJnaXQ6MS4wXCJcclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB1cmxNYXRjaCBUaGUgbWF0Y2hlZCBVUkwsIGlmIHRoZXJlIHdhcyBvbmUuIFdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBtYXRjaCBpcyBub3QgYSBVUkwgbWF0Y2guXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gcHJvdG9jb2xVcmxNYXRjaCBUaGUgbWF0Y2ggVVJMIHN0cmluZyBmb3IgYSBwcm90b2NvbCBtYXRjaC4gRXg6ICdodHRwOi8veWFob28uY29tJy4gVGhpcyBpcyB1c2VkIHRvXHJcblx0XHQgKiAgIGtub3cgd2hldGhlciBvciBub3Qgd2UgaGF2ZSBhIHByb3RvY29sIGluIHRoZSBVUkwgc3RyaW5nLCBpbiBvcmRlciB0byBjaGVjayBmb3IgYSB3b3JkIGNoYXJhY3RlciBhZnRlciB0aGUgcHJvdG9jb2xcclxuXHRcdCAqICAgc2VwYXJhdG9yICgnOicpLlxyXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBVUkwgbWF0Y2ggZG9lcyBub3QgaGF2ZSBhdCBsZWFzdCBvbmUgd29yZCBjaGFyYWN0ZXIgaW4gaXQgYWZ0ZXIgdGhlIHByb3RvY29sLCBgZmFsc2VgXHJcblx0XHQgKiAgIG90aGVyd2lzZS5cclxuXHRcdCAqL1xyXG5cdFx0dXJsTWF0Y2hEb2VzTm90SGF2ZUF0TGVhc3RPbmVXb3JkQ2hhciA6IGZ1bmN0aW9uKCB1cmxNYXRjaCwgcHJvdG9jb2xVcmxNYXRjaCApIHtcclxuXHRcdFx0aWYoIHVybE1hdGNoICYmIHByb3RvY29sVXJsTWF0Y2ggKSB7XHJcblx0XHRcdFx0cmV0dXJuICF0aGlzLmhhc1dvcmRDaGFyQWZ0ZXJQcm90b2NvbFJlZ2V4LnRlc3QoIHVybE1hdGNoICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIERldGVybWluZXMgaWYgYSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCBpcyBhbiBpbnZhbGlkIG9uZS4gVGhpcyBtZXRob2QgcmV0dXJucyBgdHJ1ZWAgaWYgdGhlcmUgaXMgYSBgcHJvdG9jb2xSZWxhdGl2ZU1hdGNoYCxcclxuXHRcdCAqIGFuZCB0aGF0IG1hdGNoIGNvbnRhaW5zIGEgd29yZCBjaGFyYWN0ZXIgYmVmb3JlIHRoZSAnLy8nIChpLmUuIGl0IG11c3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIG5vdGhpbmcgYmVmb3JlIHRoZSAnLy8nIGluXHJcblx0XHQgKiBvcmRlciB0byBiZSBjb25zaWRlcmVkIHZhbGlkKS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBwcm90b2NvbFJlbGF0aXZlTWF0Y2ggVGhlIHByb3RvY29sLXJlbGF0aXZlIHN0cmluZyBmb3IgYSBVUkwgbWF0Y2ggKGkuZS4gJy8vJyksIHBvc3NpYmx5IHdpdGggYSBwcmVjZWRpbmdcclxuXHRcdCAqICAgY2hhcmFjdGVyIChleCwgYSBzcGFjZSwgc3VjaCBhczogJyAvLycsIG9yIGEgbGV0dGVyLCBzdWNoIGFzOiAnYS8vJykuIFRoZSBtYXRjaCBpcyBpbnZhbGlkIGlmIHRoZXJlIGlzIGEgd29yZCBjaGFyYWN0ZXJcclxuXHRcdCAqICAgcHJlY2VkaW5nIHRoZSAnLy8nLlxyXG5cdFx0ICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGl0IGlzIGFuIGludmFsaWQgcHJvdG9jb2wtcmVsYXRpdmUgbWF0Y2gsIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdFx0ICovXHJcblx0XHRpc0ludmFsaWRQcm90b2NvbFJlbGF0aXZlTWF0Y2ggOiBmdW5jdGlvbiggcHJvdG9jb2xSZWxhdGl2ZU1hdGNoICkge1xyXG5cdFx0XHRyZXR1cm4gKCAhIXByb3RvY29sUmVsYXRpdmVNYXRjaCAmJiB0aGlzLmludmFsaWRQcm90b2NvbFJlbE1hdGNoUmVnZXgudGVzdCggcHJvdG9jb2xSZWxhdGl2ZU1hdGNoICkgKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKmpzaGludCBzdWI6dHJ1ZSAqL1xyXG5cdC8qKlxyXG5cdCAqIEBwcm90ZWN0ZWRcclxuXHQgKiBAY2xhc3MgQXV0b2xpbmtlci5BbmNob3JUYWdCdWlsZGVyXHJcblx0ICogQGV4dGVuZHMgT2JqZWN0XHJcblx0ICogXHJcblx0ICogQnVpbGRzIGFuY2hvciAoJmx0O2EmZ3Q7KSB0YWdzIGZvciB0aGUgQXV0b2xpbmtlciB1dGlsaXR5IHdoZW4gYSBtYXRjaCBpcyBmb3VuZC5cclxuXHQgKiBcclxuXHQgKiBOb3JtYWxseSB0aGlzIGNsYXNzIGlzIGluc3RhbnRpYXRlZCwgY29uZmlndXJlZCwgYW5kIHVzZWQgaW50ZXJuYWxseSBieSBhbiB7QGxpbmsgQXV0b2xpbmtlcn0gaW5zdGFuY2UsIGJ1dCBtYXkgXHJcblx0ICogYWN0dWFsbHkgYmUgcmV0cmlldmVkIGluIGEge0BsaW5rIEF1dG9saW5rZXIjcmVwbGFjZUZuIHJlcGxhY2VGbn0gdG8gY3JlYXRlIHtAbGluayBBdXRvbGlua2VyLkh0bWxUYWcgSHRtbFRhZ30gaW5zdGFuY2VzXHJcblx0ICogd2hpY2ggbWF5IGJlIG1vZGlmaWVkIGJlZm9yZSByZXR1cm5pbmcgZnJvbSB0aGUge0BsaW5rIEF1dG9saW5rZXIjcmVwbGFjZUZuIHJlcGxhY2VGbn0uIEZvciBleGFtcGxlOlxyXG5cdCAqIFxyXG5cdCAqICAgICB2YXIgaHRtbCA9IEF1dG9saW5rZXIubGluayggXCJUZXN0IGdvb2dsZS5jb21cIiwge1xyXG5cdCAqICAgICAgICAgcmVwbGFjZUZuIDogZnVuY3Rpb24oIGF1dG9saW5rZXIsIG1hdGNoICkge1xyXG5cdCAqICAgICAgICAgICAgIHZhciB0YWcgPSBhdXRvbGlua2VyLmdldFRhZ0J1aWxkZXIoKS5idWlsZCggbWF0Y2ggKTsgIC8vIHJldHVybnMgYW4ge0BsaW5rIEF1dG9saW5rZXIuSHRtbFRhZ30gaW5zdGFuY2VcclxuXHQgKiAgICAgICAgICAgICB0YWcuc2V0QXR0ciggJ3JlbCcsICdub2ZvbGxvdycgKTtcclxuXHQgKiAgICAgICAgICAgICBcclxuXHQgKiAgICAgICAgICAgICByZXR1cm4gdGFnO1xyXG5cdCAqICAgICAgICAgfVxyXG5cdCAqICAgICB9ICk7XHJcblx0ICogICAgIFxyXG5cdCAqICAgICAvLyBnZW5lcmF0ZWQgaHRtbDpcclxuXHQgKiAgICAgLy8gICBUZXN0IDxhIGhyZWY9XCJodHRwOi8vZ29vZ2xlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vZm9sbG93XCI+Z29vZ2xlLmNvbTwvYT5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLkFuY2hvclRhZ0J1aWxkZXIgPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBPYmplY3QsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IG5ld1dpbmRvd1xyXG5cdFx0ICogQGluaGVyaXRkb2MgQXV0b2xpbmtlciNuZXdXaW5kb3dcclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7TnVtYmVyfSB0cnVuY2F0ZVxyXG5cdFx0ICogQGluaGVyaXRkb2MgQXV0b2xpbmtlciN0cnVuY2F0ZVxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IGNsYXNzTmFtZVxyXG5cdFx0ICogQGluaGVyaXRkb2MgQXV0b2xpbmtlciNjbGFzc05hbWVcclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjb25zdHJ1Y3RvclxyXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IFtjZmddIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBBbmNob3JUYWdCdWlsZGVyIGluc3RhbmNlLCBzcGVjaWZpZWQgaW4gYW4gT2JqZWN0IChtYXApLlxyXG5cdFx0ICovXHJcblx0XHRjb25zdHJ1Y3RvciA6IGZ1bmN0aW9uKCBjZmcgKSB7XHJcblx0XHRcdEF1dG9saW5rZXIuVXRpbC5hc3NpZ24oIHRoaXMsIGNmZyApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBHZW5lcmF0ZXMgdGhlIGFjdHVhbCBhbmNob3IgKCZsdDthJmd0OykgdGFnIHRvIHVzZSBpbiBwbGFjZSBvZiB0aGUgbWF0Y2hlZCBVUkwvZW1haWwvVHdpdHRlciB0ZXh0LFxyXG5cdFx0ICogdmlhIGl0cyBgbWF0Y2hgIG9iamVjdC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtBdXRvbGlua2VyLm1hdGNoLk1hdGNofSBtYXRjaCBUaGUgTWF0Y2ggaW5zdGFuY2UgdG8gZ2VuZXJhdGUgYW4gYW5jaG9yIHRhZyBmcm9tLlxyXG5cdFx0ICogQHJldHVybiB7QXV0b2xpbmtlci5IdG1sVGFnfSBUaGUgSHRtbFRhZyBpbnN0YW5jZSBmb3IgdGhlIGFuY2hvciB0YWcuXHJcblx0XHQgKi9cclxuXHRcdGJ1aWxkIDogZnVuY3Rpb24oIG1hdGNoICkge1xyXG5cdFx0XHR2YXIgdGFnID0gbmV3IEF1dG9saW5rZXIuSHRtbFRhZygge1xyXG5cdFx0XHRcdHRhZ05hbWUgICA6ICdhJyxcclxuXHRcdFx0XHRhdHRycyAgICAgOiB0aGlzLmNyZWF0ZUF0dHJzKCBtYXRjaC5nZXRUeXBlKCksIG1hdGNoLmdldEFuY2hvckhyZWYoKSApLFxyXG5cdFx0XHRcdGlubmVySHRtbCA6IHRoaXMucHJvY2Vzc0FuY2hvclRleHQoIG1hdGNoLmdldEFuY2hvclRleHQoKSApXHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHRcdHJldHVybiB0YWc7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZXMgdGhlIE9iamVjdCAobWFwKSBvZiB0aGUgSFRNTCBhdHRyaWJ1dGVzIGZvciB0aGUgYW5jaG9yICgmbHQ7YSZndDspIHRhZyBiZWluZyBnZW5lcmF0ZWQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcm90ZWN0ZWRcclxuXHRcdCAqIEBwYXJhbSB7XCJ1cmxcIi9cImVtYWlsXCIvXCJ0d2l0dGVyXCJ9IG1hdGNoVHlwZSBUaGUgdHlwZSBvZiBtYXRjaCB0aGF0IGFuIGFuY2hvciB0YWcgaXMgYmVpbmcgZ2VuZXJhdGVkIGZvci5cclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSBocmVmIFRoZSBocmVmIGZvciB0aGUgYW5jaG9yIHRhZy5cclxuXHRcdCAqIEByZXR1cm4ge09iamVjdH0gQSBrZXkvdmFsdWUgT2JqZWN0IChtYXApIG9mIHRoZSBhbmNob3IgdGFnJ3MgYXR0cmlidXRlcy4gXHJcblx0XHQgKi9cclxuXHRcdGNyZWF0ZUF0dHJzIDogZnVuY3Rpb24oIG1hdGNoVHlwZSwgYW5jaG9ySHJlZiApIHtcclxuXHRcdFx0dmFyIGF0dHJzID0ge1xyXG5cdFx0XHRcdCdocmVmJyA6IGFuY2hvckhyZWYgIC8vIHdlJ2xsIGFsd2F5cyBoYXZlIHRoZSBgaHJlZmAgYXR0cmlidXRlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgY3NzQ2xhc3MgPSB0aGlzLmNyZWF0ZUNzc0NsYXNzKCBtYXRjaFR5cGUgKTtcclxuXHRcdFx0aWYoIGNzc0NsYXNzICkge1xyXG5cdFx0XHRcdGF0dHJzWyAnY2xhc3MnIF0gPSBjc3NDbGFzcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiggdGhpcy5uZXdXaW5kb3cgKSB7XHJcblx0XHRcdFx0YXR0cnNbICd0YXJnZXQnIF0gPSBcIl9ibGFua1wiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYXR0cnM7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENyZWF0ZXMgdGhlIENTUyBjbGFzcyB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgYSBnaXZlbiBhbmNob3IgdGFnLCBiYXNlZCBvbiB0aGUgYG1hdGNoVHlwZWAgYW5kIHRoZSB7QGxpbmsgI2NsYXNzTmFtZX1cclxuXHRcdCAqIGNvbmZpZy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7XCJ1cmxcIi9cImVtYWlsXCIvXCJ0d2l0dGVyXCJ9IG1hdGNoVHlwZSBUaGUgdHlwZSBvZiBtYXRjaCB0aGF0IGFuIGFuY2hvciB0YWcgaXMgYmVpbmcgZ2VuZXJhdGVkIGZvci5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIENTUyBjbGFzcyBzdHJpbmcgZm9yIHRoZSBsaW5rLiBFeGFtcGxlIHJldHVybjogXCJteUxpbmsgbXlMaW5rLXVybFwiLiBJZiBubyB7QGxpbmsgI2NsYXNzTmFtZX1cclxuXHRcdCAqICAgd2FzIGNvbmZpZ3VyZWQsIHJldHVybnMgYW4gZW1wdHkgc3RyaW5nLlxyXG5cdFx0ICovXHJcblx0XHRjcmVhdGVDc3NDbGFzcyA6IGZ1bmN0aW9uKCBtYXRjaFR5cGUgKSB7XHJcblx0XHRcdHZhciBjbGFzc05hbWUgPSB0aGlzLmNsYXNzTmFtZTtcclxuXHJcblx0XHRcdGlmKCAhY2xhc3NOYW1lICkgXHJcblx0XHRcdFx0cmV0dXJuIFwiXCI7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gY2xhc3NOYW1lICsgXCIgXCIgKyBjbGFzc05hbWUgKyBcIi1cIiArIG1hdGNoVHlwZTsgIC8vIGV4OiBcIm15TGluayBteUxpbmstdXJsXCIsIFwibXlMaW5rIG15TGluay1lbWFpbFwiLCBvciBcIm15TGluayBteUxpbmstdHdpdHRlclwiXHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFByb2Nlc3NlcyB0aGUgYGFuY2hvclRleHRgIGJ5IHRydW5jYXRpbmcgdGhlIHRleHQgYWNjb3JkaW5nIHRvIHRoZSB7QGxpbmsgI3RydW5jYXRlfSBjb25maWcuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gYW5jaG9yVGV4dCBUaGUgYW5jaG9yIHRhZydzIHRleHQgKGkuZS4gd2hhdCB3aWxsIGJlIGRpc3BsYXllZCkuXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBwcm9jZXNzZWQgYGFuY2hvclRleHRgLlxyXG5cdFx0ICovXHJcblx0XHRwcm9jZXNzQW5jaG9yVGV4dCA6IGZ1bmN0aW9uKCBhbmNob3JUZXh0ICkge1xyXG5cdFx0XHRhbmNob3JUZXh0ID0gdGhpcy5kb1RydW5jYXRlKCBhbmNob3JUZXh0ICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gYW5jaG9yVGV4dDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUGVyZm9ybXMgdGhlIHRydW5jYXRpb24gb2YgdGhlIGBhbmNob3JUZXh0YCwgaWYgdGhlIGBhbmNob3JUZXh0YCBpcyBsb25nZXIgdGhhbiB0aGUge0BsaW5rICN0cnVuY2F0ZX0gb3B0aW9uLlxyXG5cdFx0ICogVHJ1bmNhdGVzIHRoZSB0ZXh0IHRvIDIgY2hhcmFjdGVycyBmZXdlciB0aGFuIHRoZSB7QGxpbmsgI3RydW5jYXRlfSBvcHRpb24sIGFuZCBhZGRzIFwiLi5cIiB0byB0aGUgZW5kLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIGFuY2hvciB0YWcncyB0ZXh0IChpLmUuIHdoYXQgd2lsbCBiZSBkaXNwbGF5ZWQpLlxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHJ1bmNhdGVkIGFuY2hvciB0ZXh0LlxyXG5cdFx0ICovXHJcblx0XHRkb1RydW5jYXRlIDogZnVuY3Rpb24oIGFuY2hvclRleHQgKSB7XHJcblx0XHRcdHJldHVybiBBdXRvbGlua2VyLlV0aWwuZWxsaXBzaXMoIGFuY2hvclRleHQsIHRoaXMudHJ1bmNhdGUgfHwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHQvKmdsb2JhbCBBdXRvbGlua2VyICovXHJcblx0LyoqXHJcblx0ICogQGFic3RyYWN0XHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIubWF0Y2guTWF0Y2hcclxuXHQgKiBcclxuXHQgKiBSZXByZXNlbnRzIGEgbWF0Y2ggZm91bmQgaW4gYW4gaW5wdXQgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSBBdXRvbGlua2VkLiBBIE1hdGNoIG9iamVjdCBpcyB3aGF0IGlzIHByb3ZpZGVkIGluIGEgXHJcblx0ICoge0BsaW5rIEF1dG9saW5rZXIjcmVwbGFjZUZuIHJlcGxhY2VGbn0sIGFuZCBtYXkgYmUgdXNlZCB0byBxdWVyeSBmb3IgZGV0YWlscyBhYm91dCB0aGUgbWF0Y2guXHJcblx0ICogXHJcblx0ICogRm9yIGV4YW1wbGU6XHJcblx0ICogXHJcblx0ICogICAgIHZhciBpbnB1dCA9IFwiLi4uXCI7ICAvLyBzdHJpbmcgd2l0aCBVUkxzLCBFbWFpbCBBZGRyZXNzZXMsIGFuZCBUd2l0dGVyIEhhbmRsZXNcclxuXHQgKiAgICAgXHJcblx0ICogICAgIHZhciBsaW5rZWRUZXh0ID0gQXV0b2xpbmtlci5saW5rKCBpbnB1dCwge1xyXG5cdCAqICAgICAgICAgcmVwbGFjZUZuIDogZnVuY3Rpb24oIGF1dG9saW5rZXIsIG1hdGNoICkge1xyXG5cdCAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImhyZWYgPSBcIiwgbWF0Y2guZ2V0QW5jaG9ySHJlZigpICk7XHJcblx0ICogICAgICAgICAgICAgY29uc29sZS5sb2coIFwidGV4dCA9IFwiLCBtYXRjaC5nZXRBbmNob3JUZXh0KCkgKTtcclxuXHQgKiAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgIHN3aXRjaCggbWF0Y2guZ2V0VHlwZSgpICkge1xyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICd1cmwnIDogXHJcblx0ICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ1cmw6IFwiLCBtYXRjaC5nZXRVcmwoKSApO1xyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgXHJcblx0ICogICAgICAgICAgICAgICAgIGNhc2UgJ2VtYWlsJyA6XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJlbWFpbDogXCIsIG1hdGNoLmdldEVtYWlsKCkgKTtcclxuXHQgKiAgICAgICAgICAgICAgICAgICAgIFxyXG5cdCAqICAgICAgICAgICAgICAgICBjYXNlICd0d2l0dGVyJyA6XHJcblx0ICogICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ0d2l0dGVyOiBcIiwgbWF0Y2guZ2V0VHdpdHRlckhhbmRsZSgpICk7XHJcblx0ICogICAgICAgICAgICAgfVxyXG5cdCAqICAgICAgICAgfVxyXG5cdCAqICAgICB9ICk7XHJcblx0ICogICAgIFxyXG5cdCAqIFNlZSB0aGUge0BsaW5rIEF1dG9saW5rZXJ9IGNsYXNzIGZvciBtb3JlIGRldGFpbHMgb24gdXNpbmcgdGhlIHtAbGluayBBdXRvbGlua2VyI3JlcGxhY2VGbiByZXBsYWNlRm59LlxyXG5cdCAqL1xyXG5cdEF1dG9saW5rZXIubWF0Y2guTWF0Y2ggPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBPYmplY3QsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gbWF0Y2hlZFRleHQgKHJlcXVpcmVkKVxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgb3JpZ2luYWwgdGV4dCB0aGF0IHdhcyBtYXRjaGVkLlxyXG5cdFx0ICovXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNvbnN0cnVjdG9yXHJcblx0XHQgKiBAcGFyYW0ge09iamVjdH0gY2ZnIFRoZSBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgZm9yIHRoZSBNYXRjaCBpbnN0YW5jZSwgc3BlY2lmaWVkIGluIGFuIE9iamVjdCAobWFwKS5cclxuXHRcdCAqL1xyXG5cdFx0Y29uc3RydWN0b3IgOiBmdW5jdGlvbiggY2ZnICkge1xyXG5cdFx0XHRBdXRvbGlua2VyLlV0aWwuYXNzaWduKCB0aGlzLCBjZmcgKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyBhIHN0cmluZyBuYW1lIGZvciB0aGUgdHlwZSBvZiBtYXRjaCB0aGF0IHRoaXMgY2xhc3MgcmVwcmVzZW50cy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQGFic3RyYWN0XHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFR5cGUgOiBBdXRvbGlua2VyLlV0aWwuYWJzdHJhY3RNZXRob2QsXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgb3JpZ2luYWwgdGV4dCB0aGF0IHdhcyBtYXRjaGVkLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldE1hdGNoZWRUZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1hdGNoZWRUZXh0O1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSBhbmNob3IgaHJlZiB0aGF0IHNob3VsZCBiZSBnZW5lcmF0ZWQgZm9yIHRoZSBtYXRjaC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQGFic3RyYWN0XHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldEFuY2hvckhyZWYgOiBBdXRvbGlua2VyLlV0aWwuYWJzdHJhY3RNZXRob2QsXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIHRleHQgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEBhYnN0cmFjdFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRBbmNob3JUZXh0IDogQXV0b2xpbmtlci5VdGlsLmFic3RyYWN0TWV0aG9kXHJcblxyXG5cdH0gKTtcclxuXHQvKmdsb2JhbCBBdXRvbGlua2VyICovXHJcblx0LyoqXHJcblx0ICogQGNsYXNzIEF1dG9saW5rZXIubWF0Y2guRW1haWxcclxuXHQgKiBAZXh0ZW5kcyBBdXRvbGlua2VyLm1hdGNoLk1hdGNoXHJcblx0ICogXHJcblx0ICogUmVwcmVzZW50cyBhIEVtYWlsIG1hdGNoIGZvdW5kIGluIGFuIGlucHV0IHN0cmluZyB3aGljaCBzaG91bGQgYmUgQXV0b2xpbmtlZC5cclxuXHQgKiBcclxuXHQgKiBTZWUgdGhpcyBjbGFzcydzIHN1cGVyY2xhc3MgKHtAbGluayBBdXRvbGlua2VyLm1hdGNoLk1hdGNofSkgZm9yIG1vcmUgZGV0YWlscy5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLm1hdGNoLkVtYWlsID0gQXV0b2xpbmtlci5VdGlsLmV4dGVuZCggQXV0b2xpbmtlci5tYXRjaC5NYXRjaCwge1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7U3RyaW5nfSBlbWFpbCAocmVxdWlyZWQpXHJcblx0XHQgKiBcclxuXHRcdCAqIFRoZSBlbWFpbCBhZGRyZXNzIHRoYXQgd2FzIG1hdGNoZWQuXHJcblx0XHQgKi9cclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGEgc3RyaW5nIG5hbWUgZm9yIHRoZSB0eXBlIG9mIG1hdGNoIHRoYXQgdGhpcyBjbGFzcyByZXByZXNlbnRzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFR5cGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuICdlbWFpbCc7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIGVtYWlsIGFkZHJlc3MgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRFbWFpbCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbWFpbDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIGhyZWYgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9ySHJlZiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJ21haWx0bzonICsgdGhpcy5lbWFpbDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIHRleHQgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9yVGV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbWFpbDtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cdC8qZ2xvYmFsIEF1dG9saW5rZXIgKi9cclxuXHQvKipcclxuXHQgKiBAY2xhc3MgQXV0b2xpbmtlci5tYXRjaC5Ud2l0dGVyXHJcblx0ICogQGV4dGVuZHMgQXV0b2xpbmtlci5tYXRjaC5NYXRjaFxyXG5cdCAqIFxyXG5cdCAqIFJlcHJlc2VudHMgYSBUd2l0dGVyIG1hdGNoIGZvdW5kIGluIGFuIGlucHV0IHN0cmluZyB3aGljaCBzaG91bGQgYmUgQXV0b2xpbmtlZC5cclxuXHQgKiBcclxuXHQgKiBTZWUgdGhpcyBjbGFzcydzIHN1cGVyY2xhc3MgKHtAbGluayBBdXRvbGlua2VyLm1hdGNoLk1hdGNofSkgZm9yIG1vcmUgZGV0YWlscy5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLm1hdGNoLlR3aXR0ZXIgPSBBdXRvbGlua2VyLlV0aWwuZXh0ZW5kKCBBdXRvbGlua2VyLm1hdGNoLk1hdGNoLCB7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtTdHJpbmd9IHR3aXR0ZXJIYW5kbGUgKHJlcXVpcmVkKVxyXG5cdFx0ICogXHJcblx0XHQgKiBUaGUgVHdpdHRlciBoYW5kbGUgdGhhdCB3YXMgbWF0Y2hlZC5cclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIHR5cGUgb2YgbWF0Y2ggdGhhdCB0aGlzIGNsYXNzIHJlcHJlc2VudHMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0VHlwZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJ3R3aXR0ZXInO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIGEgc3RyaW5nIG5hbWUgZm9yIHRoZSB0eXBlIG9mIG1hdGNoIHRoYXQgdGhpcyBjbGFzcyByZXByZXNlbnRzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9XHJcblx0XHQgKi9cclxuXHRcdGdldFR3aXR0ZXJIYW5kbGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMudHdpdHRlckhhbmRsZTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIGhyZWYgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9ySHJlZiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJ2h0dHBzOi8vdHdpdHRlci5jb20vJyArIHRoaXMudHdpdHRlckhhbmRsZTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIHRleHQgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9yVGV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJ0AnICsgdGhpcy50d2l0dGVySGFuZGxlO1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblx0LypnbG9iYWwgQXV0b2xpbmtlciAqL1xyXG5cdC8qKlxyXG5cdCAqIEBjbGFzcyBBdXRvbGlua2VyLm1hdGNoLlVybFxyXG5cdCAqIEBleHRlbmRzIEF1dG9saW5rZXIubWF0Y2guTWF0Y2hcclxuXHQgKiBcclxuXHQgKiBSZXByZXNlbnRzIGEgVXJsIG1hdGNoIGZvdW5kIGluIGFuIGlucHV0IHN0cmluZyB3aGljaCBzaG91bGQgYmUgQXV0b2xpbmtlZC5cclxuXHQgKiBcclxuXHQgKiBTZWUgdGhpcyBjbGFzcydzIHN1cGVyY2xhc3MgKHtAbGluayBBdXRvbGlua2VyLm1hdGNoLk1hdGNofSkgZm9yIG1vcmUgZGV0YWlscy5cclxuXHQgKi9cclxuXHRBdXRvbGlua2VyLm1hdGNoLlVybCA9IEF1dG9saW5rZXIuVXRpbC5leHRlbmQoIEF1dG9saW5rZXIubWF0Y2guTWF0Y2gsIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge1N0cmluZ30gdXJsIChyZXF1aXJlZClcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIHVybCB0aGF0IHdhcyBtYXRjaGVkLlxyXG5cdFx0ICovXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBAY2ZnIHtCb29sZWFufSBwcm90b2NvbFVybE1hdGNoIChyZXF1aXJlZClcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmIHRoZSBVUkwgaXMgYSBtYXRjaCB3aGljaCBhbHJlYWR5IGhhcyBhIHByb3RvY29sIChpLmUuICdodHRwOi8vJyksIGBmYWxzZWAgaWYgdGhlIG1hdGNoIHdhcyBmcm9tIGEgJ3d3dycgb3JcclxuXHRcdCAqIGtub3duIFRMRCBtYXRjaC5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQGNmZyB7Qm9vbGVhbn0gcHJvdG9jb2xSZWxhdGl2ZU1hdGNoIChyZXF1aXJlZClcclxuXHRcdCAqIFxyXG5cdFx0ICogYHRydWVgIGlmIHRoZSBVUkwgaXMgYSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaC4gQSBwcm90b2NvbC1yZWxhdGl2ZSBtYXRjaCBpcyBhIFVSTCB0aGF0IHN0YXJ0cyB3aXRoICcvLycsXHJcblx0XHQgKiBhbmQgd2lsbCBiZSBlaXRoZXIgaHR0cDovLyBvciBodHRwczovLyBiYXNlZCBvbiB0aGUgcHJvdG9jb2wgdGhhdCB0aGUgc2l0ZSBpcyBsb2FkZWQgdW5kZXIuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBjZmcge0Jvb2xlYW59IHN0cmlwUHJlZml4IChyZXF1aXJlZClcclxuXHRcdCAqIEBpbmhlcml0ZG9jIEF1dG9saW5rZXIjc3RyaXBQcmVmaXhcclxuXHRcdCAqL1xyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gdXJsUHJlZml4UmVnZXhcclxuXHRcdCAqIFxyXG5cdFx0ICogQSByZWd1bGFyIGV4cHJlc3Npb24gdXNlZCB0byByZW1vdmUgdGhlICdodHRwOi8vJyBvciAnaHR0cHM6Ly8nIGFuZC9vciB0aGUgJ3d3dy4nIGZyb20gVVJMcy5cclxuXHRcdCAqL1xyXG5cdFx0dXJsUHJlZml4UmVnZXg6IC9eKGh0dHBzPzpcXC9cXC8pPyh3d3dcXC4pPy9pLFxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBwcm90b2NvbFJlbGF0aXZlUmVnZXhcclxuXHRcdCAqIFxyXG5cdFx0ICogVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkIHRvIHJlbW92ZSB0aGUgcHJvdG9jb2wtcmVsYXRpdmUgJy8vJyBmcm9tIHRoZSB7QGxpbmsgI3VybH0gc3RyaW5nLCBmb3IgcHVycG9zZXNcclxuXHRcdCAqIG9mIHtAbGluayAjZ2V0QW5jaG9yVGV4dH0uIEEgcHJvdG9jb2wtcmVsYXRpdmUgVVJMIGlzLCBmb3IgZXhhbXBsZSwgXCIvL3lhaG9vLmNvbVwiXHJcblx0XHQgKi9cclxuXHRcdHByb3RvY29sUmVsYXRpdmVSZWdleCA6IC9eXFwvXFwvLyxcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByb3RvY29sUHJlcGVuZGVkXHJcblx0XHQgKiBcclxuXHRcdCAqIFdpbGwgYmUgc2V0IHRvIGB0cnVlYCBpZiB0aGUgJ2h0dHA6Ly8nIHByb3RvY29sIGhhcyBiZWVuIHByZXBlbmRlZCB0byB0aGUge0BsaW5rICN1cmx9IChiZWNhdXNlIHRoZVxyXG5cdFx0ICoge0BsaW5rICN1cmx9IGRpZCBub3QgaGF2ZSBhIHByb3RvY29sKVxyXG5cdFx0ICovXHJcblx0XHRwcm90b2NvbFByZXBlbmRlZCA6IGZhbHNlLFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgYSBzdHJpbmcgbmFtZSBmb3IgdGhlIHR5cGUgb2YgbWF0Y2ggdGhhdCB0aGlzIGNsYXNzIHJlcHJlc2VudHMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0VHlwZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gJ3VybCc7XHJcblx0XHR9LFxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFJldHVybnMgdGhlIHVybCB0aGF0IHdhcyBtYXRjaGVkLCBhc3N1bWluZyB0aGUgcHJvdG9jb2wgdG8gYmUgJ2h0dHA6Ly8nIGlmIHRoZSBvcmlnaW5hbFxyXG5cdFx0ICogbWF0Y2ggd2FzIG1pc3NpbmcgYSBwcm90b2NvbC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRVcmwgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHVybCA9IHRoaXMudXJsO1xyXG5cclxuXHRcdFx0Ly8gaWYgdGhlIHVybCBzdHJpbmcgZG9lc24ndCBiZWdpbiB3aXRoIGEgcHJvdG9jb2wsIGFzc3VtZSAnaHR0cDovLydcclxuXHRcdFx0aWYoICF0aGlzLnByb3RvY29sUmVsYXRpdmVNYXRjaCAmJiAhdGhpcy5wcm90b2NvbFVybE1hdGNoICYmICF0aGlzLnByb3RvY29sUHJlcGVuZGVkICkge1xyXG5cdFx0XHRcdHVybCA9IHRoaXMudXJsID0gJ2h0dHA6Ly8nICsgdXJsO1xyXG5cclxuXHRcdFx0XHR0aGlzLnByb3RvY29sUHJlcGVuZGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogUmV0dXJucyB0aGUgYW5jaG9yIGhyZWYgdGhhdCBzaG91bGQgYmUgZ2VuZXJhdGVkIGZvciB0aGUgbWF0Y2guXHJcblx0XHQgKiBcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ31cclxuXHRcdCAqL1xyXG5cdFx0Z2V0QW5jaG9ySHJlZiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdXJsID0gdGhpcy5nZXRVcmwoKTtcclxuXHJcblx0XHRcdHJldHVybiB1cmwucmVwbGFjZSggLyZhbXA7L2csICcmJyApOyAgLy8gYW55ICZhbXA7J3MgaW4gdGhlIFVSTCBzaG91bGQgYmUgY29udmVydGVkIGJhY2sgdG8gJyYnIGlmIHRoZXkgd2VyZSBkaXNwbGF5ZWQgYXMgJmFtcDsgaW4gdGhlIHNvdXJjZSBodG1sIFxyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXR1cm5zIHRoZSBhbmNob3IgdGV4dCB0aGF0IHNob3VsZCBiZSBnZW5lcmF0ZWQgZm9yIHRoZSBtYXRjaC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHJldHVybiB7U3RyaW5nfVxyXG5cdFx0ICovXHJcblx0XHRnZXRBbmNob3JUZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBhbmNob3JUZXh0ID0gdGhpcy5nZXRVcmwoKTtcclxuXHJcblx0XHRcdGlmKCB0aGlzLnByb3RvY29sUmVsYXRpdmVNYXRjaCApIHtcclxuXHRcdFx0XHQvLyBTdHJpcCBvZmYgYW55IHByb3RvY29sLXJlbGF0aXZlICcvLycgZnJvbSB0aGUgYW5jaG9yIHRleHRcclxuXHRcdFx0XHRhbmNob3JUZXh0ID0gdGhpcy5zdHJpcFByb3RvY29sUmVsYXRpdmVQcmVmaXgoIGFuY2hvclRleHQgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiggdGhpcy5zdHJpcFByZWZpeCApIHtcclxuXHRcdFx0XHRhbmNob3JUZXh0ID0gdGhpcy5zdHJpcFVybFByZWZpeCggYW5jaG9yVGV4dCApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFuY2hvclRleHQgPSB0aGlzLnJlbW92ZVRyYWlsaW5nU2xhc2goIGFuY2hvclRleHQgKTsgIC8vIHJlbW92ZSB0cmFpbGluZyBzbGFzaCwgaWYgdGhlcmUgaXMgb25lXHJcblxyXG5cdFx0XHRyZXR1cm4gYW5jaG9yVGV4dDtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8vIFV0aWxpdHkgRnVuY3Rpb25hbGl0eVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3RyaXBzIHRoZSBVUkwgcHJlZml4IChzdWNoIGFzIFwiaHR0cDovL1wiIG9yIFwiaHR0cHM6Ly9cIikgZnJvbSB0aGUgZ2l2ZW4gdGV4dC5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IG9mIHRoZSBhbmNob3IgdGhhdCBpcyBiZWluZyBnZW5lcmF0ZWQsIGZvciB3aGljaCB0byBzdHJpcCBvZmYgdGhlXHJcblx0XHQgKiAgIHVybCBwcmVmaXggKHN1Y2ggYXMgc3RyaXBwaW5nIG9mZiBcImh0dHA6Ly9cIilcclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGBhbmNob3JUZXh0YCwgd2l0aCB0aGUgcHJlZml4IHN0cmlwcGVkLlxyXG5cdFx0ICovXHJcblx0XHRzdHJpcFVybFByZWZpeCA6IGZ1bmN0aW9uKCB0ZXh0ICkge1xyXG5cdFx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKCB0aGlzLnVybFByZWZpeFJlZ2V4LCAnJyApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdHJpcHMgYW55IHByb3RvY29sLXJlbGF0aXZlICcvLycgZnJvbSB0aGUgYW5jaG9yIHRleHQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCBvZiB0aGUgYW5jaG9yIHRoYXQgaXMgYmVpbmcgZ2VuZXJhdGVkLCBmb3Igd2hpY2ggdG8gc3RyaXAgb2ZmIHRoZVxyXG5cdFx0ICogICBwcm90b2NvbC1yZWxhdGl2ZSBwcmVmaXggKHN1Y2ggYXMgc3RyaXBwaW5nIG9mZiBcIi8vXCIpXHJcblx0XHQgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBgYW5jaG9yVGV4dGAsIHdpdGggdGhlIHByb3RvY29sLXJlbGF0aXZlIHByZWZpeCBzdHJpcHBlZC5cclxuXHRcdCAqL1xyXG5cdFx0c3RyaXBQcm90b2NvbFJlbGF0aXZlUHJlZml4IDogZnVuY3Rpb24oIHRleHQgKSB7XHJcblx0XHRcdHJldHVybiB0ZXh0LnJlcGxhY2UoIHRoaXMucHJvdG9jb2xSZWxhdGl2ZVJlZ2V4LCAnJyApO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZW1vdmVzIGFueSB0cmFpbGluZyBzbGFzaCBmcm9tIHRoZSBnaXZlbiBgYW5jaG9yVGV4dGAsIGluIHByZXBhcmF0aW9uIGZvciB0aGUgdGV4dCB0byBiZSBkaXNwbGF5ZWQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gYW5jaG9yVGV4dCBUaGUgdGV4dCBvZiB0aGUgYW5jaG9yIHRoYXQgaXMgYmVpbmcgZ2VuZXJhdGVkLCBmb3Igd2hpY2ggdG8gcmVtb3ZlIGFueSB0cmFpbGluZ1xyXG5cdFx0ICogICBzbGFzaCAoJy8nKSB0aGF0IG1heSBleGlzdC5cclxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGBhbmNob3JUZXh0YCwgd2l0aCB0aGUgdHJhaWxpbmcgc2xhc2ggcmVtb3ZlZC5cclxuXHRcdCAqL1xyXG5cdFx0cmVtb3ZlVHJhaWxpbmdTbGFzaCA6IGZ1bmN0aW9uKCBhbmNob3JUZXh0ICkge1xyXG5cdFx0XHRpZiggYW5jaG9yVGV4dC5jaGFyQXQoIGFuY2hvclRleHQubGVuZ3RoIC0gMSApID09PSAnLycgKSB7XHJcblx0XHRcdFx0YW5jaG9yVGV4dCA9IGFuY2hvclRleHQuc2xpY2UoIDAsIC0xICk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGFuY2hvclRleHQ7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHJcblx0cmV0dXJuIEF1dG9saW5rZXI7XHJcblxyXG5cclxufSkpO1xyXG4iXX0=
