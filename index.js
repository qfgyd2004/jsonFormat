(function(root, factory) {
  var root = root || window;
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.J = factory();
  }
})(this, function() {
  'use strict';

  var _toString = Object.prototype.toString;
  var _isString = function(obj) {
    return typeof obj === 'string';
  }
  var _isPlainObject = function(obj) {
    return _toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj;
  }
  var _isArray = function(obj) {
    return _toString.call(obj) === '[object Array]';
  }
  var _isNumber = function(obj) {
    return _toString.call(obj) === '[object Number]';
  }

  var J = {
    format: function(obj, options) {
      options = options || {
        TABBASE: options && options.TABBASE || '',
        SPACE: options && options.SPACE || 2,
      };
      var __TAB__ = new Array(options.SPACE).join(' ');
      var getTabs = function(count) {
        let tabs = [];
        for (var i = 0; i < count; i++) {
          tabs.push(__TAB__);
        }
        return tabs.join('');
      }
      var deepWalk = function(_obj, level) {
        level++;
        var formatCodes = [],
          tabNext = getTabs(level),
          TABBASE = options.TABBASE;

        if (_isArray(_obj)) {
          formatCodes.push('[');
          for (var i = 0, len = _obj.length; i < len; i++) {
            var item = _obj[i];
            if (_isArray(item) || _isPlainObject(item)) {
              var childCodes = deepWalk(item, level);
              formatCodes.push(childCodes);
              if (i < len - 1) {
                formatCodes.push(', ');
              }
            } else {
              if (_isString(item)) {
                item = "'" + item + "'";
              }
              formatCodes.push(item);
              if (i < len - 1) {
                formatCodes.push(', ');
              }
              if (!_isString(item) && !_isNumber(item)) {
                formatCodes.push('\n');
              }
            }
          }
          formatCodes.push(']');
        } else {
          formatCodes.push('{\n');
          for (var key in _obj) {
            var item = _obj[key];
            if (_isArray(item) || _isPlainObject(item)) {
              var childCodes = deepWalk(item, _isPlainObject(item) ? level : level - 1);
              formatCodes.push(TABBASE + tabNext + key + ': ' + childCodes + ',\n');
            } else {
              if (_isString(item)) {
                item = "'" + item + "'";
              }
              formatCodes.push(TABBASE + tabNext + key + ": " + item + ",\n");
            }
          }
          tabNext = getTabs(level - 1);
          if (level > 2) {
            formatCodes.push(TABBASE + tabNext + '}');
          } else {
            formatCodes.push('}');
          }
        }
        return formatCodes.join('');
      }
      return deepWalk(obj, 1);
    }
  }
  return J;
});