import EventEmitter from "eventemitter3";

export const EVENTS = {
    START:'START',
    LOADED:'LOADED',
    MOUSE_MOVE:'MOUSE_MOVE',
    UPDATE_POINTS:'UPDATE_POINTS',
    CLICK: 'CLICK',
    GAME_OVER: 'GAME_OVER',
    STACK:'STACK',
    UNCAP_BOTTLE:'UNCAP_BOTTLE',
    CHANGE_COLOR:'CHANGE_COLOR',
    REVERSE_COLOR:'REVERSE_COLOR',
    PLAY_VIDEO:'PLAY_VIDEO',
    SHOW_VIDEO:'SHOW_VIDEO',
    HIDE_VIDEO:'HIDE_VIDEO',
}

const Observer = new EventEmitter();
export default Observer;
