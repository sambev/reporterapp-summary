ReporterApp Summary
=====

Summarize exported json reports from the ReporterApp.

Usage should be as simple as: `./summarize exported-report.json`

This script will parse the full report and write summarized data in json
format.  The data is structed like this:

Tokens | Yes/No | Location | Mutliple Choice | People:
```json
{ 
   "Who are you with?": {
       "James": 12,
       "Sarah": 19
       ....
   }
}
```

Number | Note:
```json
{
   "How happy are you?": [
       {
            "value": 8,
            "date": "2014-05-14T23:16:25-0600",
       },
       .....
   ]
}
```
