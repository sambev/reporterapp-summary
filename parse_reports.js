#!/usr/local/bin/node

/**
 * ReporterApp data processing script written in javascript.
 * Usage should as simple as:
 * ./parse_report <exported-report.json>
 * This script will parse the full report and return summarized data that
 * should look like this:
 * Tokens | Yes/No | Location | Mutliple Choice | People:
 * {
 *     'Who are you with?': {
 *         'James': 12,
 *         'Sarah': 19
 *         ....
 *     }
 * }
 *
 * Number | Note:
 * {
 *     'How happy are you?': [
 *         {
 *              'value': 8,
 *              'date': '2014-05-14T23:16:25-0600',
 *         },
 *         .....
 *     ]
 * }
 *
 * @TODO. Read the report and send it through the parsing script below.
 */

var fs = require('fs');

var reports;
var nice_responses = {};

try {
    console.log('Reading file...');
    data = fs.readFileSync('./reporter-export.json', 'utf-8');
    console.log('File read success!');
} catch (err) {
    console.log('Error reading file: ' + err);
    process.exit(1);
}

try {
    console.log('Parsing file... this might take a while...');
    report = JSON.parse(data);
    report.snapshots.forEach(function(snp) {
        var date = snp.date;
        snp.responses.forEach(function(resp) {
            var question = resp.questionPrompt;
            if (!nice_responses[question]) {
                nice_responses[question] = {};
            }
            //=================================================================
            // NUMERIC RESPONSES
            //=================================================================
            if (resp.numericResponse) {
                if (!nice_responses[question].entries) {
                    nice_responses[question].entries = [];
                }
                var new_entry = {
                    'value': resp.numericResponse,
                    'date': date
                }
                nice_responses[question].entries.push(new_entry);

            //=================================================================
            // TOKEN RESPONSES
            //=================================================================
            } else if (resp.tokens) {
                for (var i = resp.tokens.length - 1; i >= 0; i--) {
                    var token = resp.tokens[i];
                    if (token && nice_responses[question][token]) {
                        nice_responses[question][token]++;
                    } else {
                        nice_responses[question][token] = 1;
                    }
                }

            //=================================================================
            // LOCATION RESPONSES
            //=================================================================
            } else if (resp.locationResponse) {
                var loc_name = resp.locationResponse.text;
                if (nice_responses[question][loc_name]) {
                    nice_responses[question][loc_name]++;
                } else {
                    nice_responses[question][loc_name] = 1;
                }

            //=================================================================
            // TEXT REPSONSES
            //=================================================================
            } else if (resp.textResponse) {
                if (!nice_responses[question].entries) {
                    nice_responses[question].entries = [];
                }
                var new_entry = {
                    'value': resp.textResponse,
                    'date': date
                }
                nice_responses[question].entries.push(new_entry);

            //=================================================================
            // MULTIPLE CHOICE RESPONSES
            //=================================================================
            } else if (resp.answeredOptions) {
                for (var i = resp.answeredOptions.length - 1; i >= 0; i--) {
                    var option = resp.answeredOptions[i];
                    if (option && nice_responses[question][option]) {
                        nice_responses[question][option]++;
                    } else {
                        nice_responses[question][option] = 1;
                    }
                }
            }
        });
    });
    console.log('File parse success!');
} catch (err) {
    console.log('Error parsing file: ' + err);
    process.exit(1)
}

try {
    console.log('Writing report-summary.json file...');
    fs.writeFileSync('./report-summary.json', JSON.stringify(nice_responses), 'utf-8');
    console.log('File write success!');
    process.exit(0);
} catch (err) {
    console.log('Error writing file: ' + err);
    process.exit(1);
}
