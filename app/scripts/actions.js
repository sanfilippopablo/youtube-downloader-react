import Api from './utils/Api'

export const DOWNLOAD = 'DOWNLOAD';
export const STATUS_UPDATE = 'STATUS_UPDATE';

export function download (d) {

  return dispatch => {
    Api.download(d);
    dispatch({
      type: DOWNLOAD,
      payload: d
    })
  }
}

export function statusUpdate (payload) {
  return {
    type: STATUS_UPDATE,
    payload: payload
  }
}
