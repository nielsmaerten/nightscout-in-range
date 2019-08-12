# Nightscout: In Range
How long has your blood sugar been in range?

```javascript
const inRange = require("nightscout-in-range")
const nightscoutUrl = "https://my-gcm.herokuapp.com"

// Default limits ([180,80])
let range = await inRange.get(nightscoutUrl);
/*
{
    lastHyper: {
        timestamp: 1565508234006,
        value: 199,
        secondsSince: 117786
    },
    lastHypo: {
        timestamp: 1565536733044,
        value: 76,
        secondsSince: 89287
    },
    secondsInRange: 89287
}
*/

// Custom limits:
let range = await inRange.get(nightscoutUrl, [200, 50]);


```