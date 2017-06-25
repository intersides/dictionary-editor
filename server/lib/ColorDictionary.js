/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

//let logger = require('../common/utilities')().logger;
let { Dictionary } = require("./Dictionary");

class ColorDictionary extends Dictionary{

    constructor(_id) {
        super(_id);
    }

    addColorAlias(in_originalColor, in_aliasColor){
        return super.addToDomainRange(in_originalColor, in_aliasColor);
    }

}

module.exports = {
    ColorDictionary:ColorDictionary
};

