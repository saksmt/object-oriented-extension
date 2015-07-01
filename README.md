object-oriented-extension
=========================

Provides support for "protected" fields and methods without conventions. Also provides inherit functionality.

Usage
-----

    if (global.objectOrientedExtension) {
        require("object-oriented-extension/ObjectOriented/JsExtension");
        // or simply: 'global.include("ObjectOriented/JsExtension");', when using include-js package
    }
    var SomeClass = function (protectedData/*, some other arguments for constructor) {
        protectedData.protectedField = 'some value';
        protectedData.protectedMethod = function () {};
        // Realization
    };
    SomeClass = SomeClass.injectProtected(); // <- that's it
    var SomeChildClass = function (protectedData/*, ... */) {
        SomeClass.call(this, someArgument); // <- Call parent constructor
        // Realization
        this.someMethod = function (someArg) {
            SomeClass.someMethod.call(this, someArg); // <- Call parent method
        };
    };
    SomeChildClass = SomeChildClass.extend(SomeClass); // <- simply like this (call of "injectProtected" is fully optional in that case)

Almost useless bonus:

    // In definition of some class...
    this.someMethod = Function.abstractMethod();
    this.someAnotherMethod = (function () {}).makeAbstract();