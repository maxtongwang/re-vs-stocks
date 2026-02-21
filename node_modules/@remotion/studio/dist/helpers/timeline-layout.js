"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimelineLayerHeight = exports.TIMELINE_ITEM_BORDER_BOTTOM = exports.TIMELINE_BORDER = exports.TIMELINE_PADDING = void 0;
exports.TIMELINE_PADDING = 16;
exports.TIMELINE_BORDER = 1;
exports.TIMELINE_ITEM_BORDER_BOTTOM = 1;
const getTimelineLayerHeight = (type) => {
    if (type === 'video') {
        return 50;
    }
    return 25;
};
exports.getTimelineLayerHeight = getTimelineLayerHeight;
