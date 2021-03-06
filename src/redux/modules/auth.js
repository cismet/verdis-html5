import objectAssign from 'object-assign';
import 'whatwg-fetch';
import {
    SERVICE,
    DOMAIN
} from '../../constants/cids';

import { actions as UiStateActions } from './uiState';

///TYPES
export const types = {
    SET_LOGIN_INFORMATION: 'AUTH/SET_LOGIN_INFORMATION',
    SET_LOGIN_IN_PROGRESS: 'AUTH/SET_LOGIN_IN_PROGRESS',
    SET_STAC: 'AUTH/SET_STAC',

};


///INITIAL STATE
const initialState = {
    user: null,
    password: null,
    succesfullLogin: false,
    loginInProgress: false,
    loginInProgressTextInfo: "XLaden der Daten ...", 
    stac: null,
};


///REDUCER

export default function uiStateReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case types.SCREEN_RESIZE:
            {
                newState = objectAssign({}, state);
                newState.width = action.width;
                newState.height = action.height;
                return newState;
            }

        case types.SET_LOGIN_INFORMATION:
            {
                newState = objectAssign({}, state);
                newState.loginInProgress = false;
                newState.user = action.user;
                newState.password = action.password;
                newState.succesfullLogin = action.status;
                newState.stac= null;
                return newState;
            }
        case types.SET_LOGIN_IN_PROGRESS:
            {
                newState = objectAssign({}, state);
                newState.loginInProgress = true;
                if (action.loginInProgressTextInfo){
                    newState.loginInProgressTextInfo=action.loginInProgressTextInfo;
                }
                return newState;
            }
        case types.SET_STAC:
        {
            newState = objectAssign({}, state);
            newState.stac = action.stac;
            newState.loginInProgress = false;
            newState.succesfullLogin = true;

            return newState;
        }
        default:
            return state;

    }
}


///SIMPLEACTIONCREATORS
function setLoginInProgress(loginInProgressTextInfo) {
    return {
        type: types.SET_LOGIN_IN_PROGRESS, loginInProgressTextInfo

    };
}

function setLoginInformation(user, password, status) {
    return {
        type: types.SET_LOGIN_INFORMATION,
        user,
        password,
        status
    };

}

function setStac(stac) {
    return {
        type: types.SET_STAC,
        stac
    };
}
//COMPLEXACTIONS

function login(user, password , succesfulHandler) {
    if (typeof succesfulHandler === "undefined" ) {
        succesfulHandler = () => {};
    }
    return function (dispatch) {
        dispatch(setLoginInProgress());
        fetch(SERVICE + '/classes?domain=local&limit=1&offset=0&role=all', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(user + '@' + DOMAIN + ':' + password),
                'Content-Type': 'application/json',
            }
        }).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                dispatch(setLoginInformation(user, password, true));
                dispatch(succesfulHandler);
            } else {
                dispatch(setLoginInformation(user, password, false));
            }
        }).catch(function (err) {
            dispatch(UiStateActions.showError("Beim Login ist ein Fehler aufgetreten. (" + err + ")"));
            dispatch(invalidateLogin(user, password));
        });
    };
}

function invalidateLogin(username, pass) {
    return function (dispatch) {
        dispatch(setLoginInformation(username, pass, false));
    };
}

function logout() {
    return function (dispatch) {
        dispatch(setLoginInformation(null, null, false));
    };
}
//EXPORT ACTIONS

export const actions = {
    setLoginInProgress,
    setLoginInformation,
    login,
    invalidateLogin,
    logout,
    setStac
};
