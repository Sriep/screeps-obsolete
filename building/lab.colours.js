/**
 * Created by Piers on 19/08/2016.
 */
"use strict";

var labColours = {
    RESOURCE_ENERGY : { color : COLOR_WHITE , secondaryColor : COLOR_WHITE },
    RESOURCE_POWER : { color : COLOR_RED , secondaryColor : COLOR_RED },

    RESOURCE_HYDROGEN : { color : COLOR_GREY , secondaryColor : COLOR_WHITE },
    RESOURCE_OXYGEN : { color :  COLOR_YELLOW, secondaryColor : COLOR_WHITE },
    RESOURCE_UTRIUM : { color : COLOR_BLUE , secondaryColor : COLOR_WHITE },
    RESOURCE_KEANIUM : { color : COLOR_PURPLE , secondaryColor : COLOR_WHITE },
    RESOURCE_LEMERGIUM : { color : COLOR_GREEN , secondaryColor : COLOR_WHITE },
    RESOURCE_ZYNTHIUM : { color : COLOR_ORANGE , secondaryColor : COLOR_WHITE },
    RESOURCE_CATALYST : { color : COLOR_RED , secondaryColor : COLOR_WHITE },
    RESOURCE_GHODIUM : { color : COLOR_BROWN , secondaryColor : COLOR_WHITE },

    RESOURCE_HYDROXIDE : { color : COLOR_CYAN , secondaryColor : COLOR_WHITE },
    RESOURCE_ZYNTHIUM_KEANITE : { color : COLOR_ORANGE , secondaryColor : COLOR_PURPLE },
    RESOURCE_UTRIUM_LEMERGITE : { color : COLOR_BLUE , secondaryColor : COLOR_GREEN },

    RESOURCE_UTRIUM_HYDRIDE : { color : COLOR_BLUE , secondaryColor : COLOR_GREY },
    RESOURCE_UTRIUM_OXIDE : { color : COLOR_BLUE , secondaryColor : COLOR_YELLOW },
    RESOURCE_KEANIUM_HYDRIDE : { color : COLOR_PURPLE , secondaryColor : COLOR_GREY },
    RESOURCE_KEANIUM_OXIDE : { color : COLOR_PURPLE , secondaryColor : COLOR_YELLOW },
    RESOURCE_LEMERGIUM_HYDRIDE : { color : COLOR_GREEN , secondaryColor : COLOR_GREY },
    RESOURCE_LEMERGIUM_OXIDE : { color : COLOR_GREEN , secondaryColor : COLOR_YELLOW },
    RESOURCE_ZYNTHIUM_HYDRIDE : { color : COLOR_ORANGE , secondaryColor : COLOR_GREY },
    RESOURCE_ZYNTHIUM_OXIDE : { color : COLOR_ORANGE , secondaryColor : COLOR_YELLOW },
    RESOURCE_GHODIUM_HYDRIDE : { color : COLOR_BROWN , secondaryColor : COLOR_GREY },
    RESOURCE_GHODIUM_OXIDE : { color : COLOR_BROWN  , secondaryColor : COLOR_YELLOW },

    RESOURCE_UTRIUM_ACID : { color : COLOR_BLUE , secondaryColor : COLOR_ORANGE },
    RESOURCE_UTRIUM_ALKALIDE : { color : COLOR_BLUE , secondaryColor : COLOR_CYAN },
    RESOURCE_KEANIUM_ACID : { color : COLOR_PURPLE , secondaryColor : COLOR_ORANGE },
    RESOURCE_KEANIUM_ALKALIDE : { color : COLOR_PURPLE , secondaryColor : COLOR_CYAN },
    RESOURCE_LEMERGIUM_ACID : { color : COLOR_GREEN , secondaryColor : COLOR_ORANGE },
    RESOURCE_LEMERGIUM_ALKALIDE : { color : COLOR_GREEN , secondaryColor : COLOR_CYAN },
    RESOURCE_ZYNTHIUM_ACID : { color : COLOR_ORANGE , secondaryColor :COLOR_ORANGE  },
    RESOURCE_ZYNTHIUM_ALKALIDE : { color : COLOR_ORANGE , secondaryColor : COLOR_CYAN },
    RESOURCE_GHODIUM_ACID : { color : COLOR_BROWN , secondaryColor : COLOR_ORANGE },
    RESOURCE_GHODIUM_ALKALIDE : { color : COLOR_BROWN , secondaryColor : COLOR_CYAN },

    RESOURCE_CATALYZED_UTRIUM_ACID : { color : COLOR_BLUE , secondaryColor : COLOR_RED },
    RESOURCE_CATALYZED_UTRIUM_ALKALIDE : { color : COLOR_BLUE , secondaryColor : COLOR_BLUE },
    RESOURCE_CATALYZED_KEANIUM_ACID : { color : COLOR_PURPLE , secondaryColor : COLOR_RED },
    RESOURCE_CATALYZED_KEANIUM_ALKALIDE : { color :  COLOR_PURPLE, secondaryColor : COLOR_BLUE },
    RESOURCE_CATALYZED_LEMERGIUM_ACID : { color : COLOR_GREEN , secondaryColor : COLOR_RED },
    RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE : { color : COLOR_GREEN , secondaryColor : COLOR_BLUE },
    RESOURCE_CATALYZED_ZYNTHIUM_ACID : { color : COLOR_ORANGE , secondaryColor : COLOR_RED },
    RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE : { color : COLOR_ORANGE , secondaryColor : COLOR_BLUE },
    RESOURCE_CATALYZED_GHODIUM_ACID : { color : COLOR_BROWN , secondaryColor : COLOR_RED },
    RESOURCE_CATALYZED_GHODIUM_ALKALIDE : { color : COLOR_BROWN , secondaryColor :  COLOR_BLUE },

    resource(color, secondaryColor) {
        return eval(_.findKey(labColours, { color : color, secondaryColor } ));
    }
};

module.exports = labColours;













































