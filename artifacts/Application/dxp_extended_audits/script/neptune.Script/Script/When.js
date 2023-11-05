const When = {};
(function() {
    const _When = {
        getPromise: function(pfCondition) {
            let loPromisePack = { resolve:'', reject: '', condition: pfCondition };
            return new Promise( (res, rej) => {
                loPromisePack.resolve = res;
                loPromisePack.reject = rej;
                _When.testCondition(loPromisePack);
            })
        },
        testCondition: (poPromisePack) => {
            // console.log(".");
            let lvResult = poPromisePack.condition();
            if (lvResult < 0) {
                // console.log("Rejected:", lvResult);
                poPromisePack.reject();
            }
            else if (lvResult > 0) {
                // console.log("Resolved:", lvResult);
                poPromisePack.resolve();
            }
            else {
                setTimeout(() => {_When.testCondition( poPromisePack )}, 250);
            }
        }
    }
    $.extend( true, When, {
        promise: pfCondition => {
            return _When.getPromise(pfCondition);
        }
    })
})()