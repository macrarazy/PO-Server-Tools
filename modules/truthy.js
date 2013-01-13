/**
 Truthy.js - by TheUnknownOne
 Version: 0.3.2

 License: GPL v3

 Working w/ all ES5 engines (if not, report it).
*/

Truthy = (function (global) {
    function hasConstructor(variable) {
        return typeof variable !== "undefined" && variable !== null && typeof variable.constructor === "function";
    }
    
    var isArray = Array.isArray || function isArray (variable) {
        return hasConstructor(variable) && variable.constructor === Array;
    };
    
    function isFunction(variable) {
        return hasConstructor(variable) && variable.constructor === Function || typeof variable === "function";
    }
    
    function isObject (variable) {
        return Object.prototype.toString.call(variable) === "[object Object]" || (hasConstructor(variable) && variable.constructor === Object);
    }
    
    return {
        hasConstructor: hasConstructor,
        isString: function (variable) {
            return hasConstructor(variable) && variable.constructor === String || typeof variable === "string";
        },
        isBoolean: function (variable) {
            return hasConstructor(variable) && variable.constructor === Boolean || typeof variable === "boolean";
        },
        isNumber: function (variable) {
            return hasConstructor(variable) && variable.constructor === Number || typeof variable === "number";
        },
        isObject: isObject,
        isArray: isArray,
        isArrayLike: function (variable) {
            return variable !== null && typeof variable.length === "number";
        },
        isFunction: isFunction,
        isDate: function (variable) {
            return hasConstructor(variable) && variable.constructor === Date;
        },
        isRegExp: function (variable) {
            return hasConstructor(variable) && variable.constructor === RegExp;
        },
        isNull: function (variable) {
            return variable === null;
        },
        isUndefined: function (variable) {
            return typeof variable === "undefined";
        },
        truthy: function (variable) {
            return !!variable;
        },
        falsy: function (variable) {
            return !variable;
        },
        global: function () {
            if (global) {
                return global;
            }
            
            return null;
        },
        toArray: function (variable) {
            return Array.prototype.slice.call(variable);
        },
        cloneArray: function (variable) {
            if (!isArray(variable)) {
                return variable;
            }
            
            return [].concat(variable);    
        },
        flip: function () {
            return !!Math.round(Math.random());
        },
        rand: function (min, max) { // random number: (inclusive, inclusive)
            return Math.floor(Math.random() * ((max + 1) - min) + min);
        },
        random: function (min, max) { // random number: (inclusive, exclusive)
            return Math.floor(Math.random() * (max - min) + min);
        },
        foreach: function (array, callback, thisArg) {
            var x = 0, 
                len, 
                cb, 
                cont = false;
            
            if (!isArray(array)) {
                return "Truthy.foreach: First argument (array) is not an array";
            }
            
            if (!isFunction(callback)) {
                return array;
            }
            
            if (!isObject(thisArg)) {
                thisArg = global;
            }
            
            len = array.length;
            
            for (; x < len; x++) {
                if (!cont) {
                    cb = callback.call(thisArg, array[x], x, array);
                    
                    if (cb === "continue" || cb === false) {
                        cont = true;
                    } else if (cb === "break" || cb === true) {
                        break;
                    }
                } else {
                    cont = false;
                }
            }
            
            return array;
        },
        eval: eval
    };
})(GLOBAL);

({
    /**
     * Returns the name of this module
     * @private
     * @return {String}
     */
    Name: function () {
        return "Truthy.js";
    }
})
