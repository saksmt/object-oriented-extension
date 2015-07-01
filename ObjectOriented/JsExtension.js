(function (global) {
    'use strict';
    /**
     * @return {Function} Abstract function placeholder
     */
    Function.prototype.makeAbstract = function () {
        return function () {
            throw new Error('Abstract method can\'t be called.');
        };
    };

    /**
     * Factory method to create abstract methods.
     * @returns {Function}
     */
    Function.abstractMethod = function () {
        var method = function () {};
        return method.makeAbstract();
    };

    /**
     * Check if protected-data was injected
     * @returns {boolean}
     */
    Function.prototype.isProtectedInjected = function () {
        return false;
    };

    /**
     * Inject protected-data object to class
     * @private
     * @param Class {Function} Class
     * @param protectedData {Object} Protected-data object
     * @return {Function} Result class
     */
    function injectProtected(Class, protectedData) {
        return (function (Native) {
            function Overridden() {
                var args = Array.prototype.map.call(arguments, function (value) { return [value]; });
                args.unshift(protectedData);
                args.unshift(null);
                return (new (Function.prototype.bind.apply(Native, args))());
            }
            Overridden.prototype = new Native({});
            Overridden.getNative = function () {
                return Native;
            };
            Overridden.isProtectedInjected = function () {
                return true;
            };
            return Overridden;
        }(Class));
    }

    /**
     * Get native class without injection of protected
     * @returns {Function} Class
     */
    Function.prototype.getNative = function () {
        return this;
    };

    /**
     * Extend from @a ParentClass
     * @param {Function} ParentClass
     * @return {Function} Result class
     */
    Function.prototype.extend = function (ParentClass) {
        var protectedData = {},
            parent,
            me = this.getNative();
        if (ParentClass.isProtectedInjected()) {
            ParentClass = injectProtected(ParentClass.getNative(), protectedData);
        }
        parent = new ParentClass();
        me.prototype = parent;
        me.prototype.constructor = me;
        protectedData.parent = parent;
        if (me.isProtectedInjected()) {
            me = injectProtected(me, protectedData);
        }
        me.prototype = parent;
        me.prototype.constructor = me;
        return me;
    };

    /**
     * Injects protected-data object to class
     * @example
     *  function SomeClass(protectedData/\* , ... *\/) {
     *      protectedData.protectedMethod = function () {};
     *      protectedData.protectedVariable = 'Access only from children and self';
     *      /\* ...Realization... *\/
     *  }.injectProtected()
     * @returns {Function}
     */
    Function.prototype.injectProtected = function () {
        return injectProtected(this, {});
    };
    global.objectOriendedExtension = true;
}(Function, global));