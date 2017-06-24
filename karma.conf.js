module.exports = function (config) {
    config.list({
        basePath: '',
        frameworks: ['mocha', 'sinon-chai', 'browserify'],

        // list of files to exclude
        exclude: ["**/*.config.js"], //NOTE:<-not working

        preprocessors: {
            //COMMON
            './server/common/**/*.js': ['browserify'],


            //TESTS
            './test//**/*Test.js': ['browserify']
        },


        files: [
            //'./common/classes/InterSides/**/*.js',
            './server/common/**/*.js',

            //TESTS
            './test/**/*Test.js'
    ],


        // Browserify configuration
        // The coverage command goes here instead of the preprocessor because we need it to work with browserify
        browserify: {
            debug: true,
            transform: [
                [
                    'babelify',
                    {
                        presets: 'es2015'
                    }
                ], [
                    'browserify-istanbul',
                    {
                        instrumenterConfig: {
                            embedSource: true
                        }
                    }
                ]
            ]
        },

        coverageReporter: {
            reporters: [
                {'type': 'text'},
                {'type': 'html', dir: 'coverage'},
                {'type': 'lcov'}
            ]
        },

        reporters: ['mocha', 'coverage'],


        plugins: [
            //'karma-commonjs',
            'karma-mocha',
            'karma-sinon-chai',
            'karma-browserify',
            'karma-mocha-reporter',
            //'karma-chai',
            'karma-coverage',
            //'karma-phantomjs-launcher'
            'karma-chrome-launcher'
        ],

        port: 9878,
        indexMap: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        autowatch: true,

        //browsers: ['PhantomJS'],
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};