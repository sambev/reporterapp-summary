summe
=====

Summarize exported json reports from the ReporterApp.

Usage should be as simple as: `./summe exported-report.json`

This script will parse the full report and return summarized data that should look like this:

Tokens | Yes/No | Location | Mutliple Choice | People:
```json
{ 
   'Who are you with?': {
       'James': 12,
       'Sarah': 19
       ....
   }
}
```

Number | Note:
```json
{
   'How happy are you?': [
       {
            'value': 8,
            'date': '2014-05-14T23:16:25-0600',
       },
       .....
   ]
}
```
