import { DOWNLOAD, STATUS_UPDATE } from '../actions'

const initialState = []

const mainReducer = (state=initialState, action) => {
  switch (action.type) {

    case DOWNLOAD:
      let defParams = {
        'status': 'preprocessing',
        'details': {
          'percent': 0
        }
      }
      let d = Object.assign({}, action.payload, defParams);
      return  [...state, d]

    case STATUS_UPDATE:
      let newStatus = Object.assign({}, action.payload);

      if(action.payload.status !== 'downloading') {

        if (typeof action.payload.details === 'undefined') {
          newStatus.details = {}
        }

        newStatus.details.speed = "N/A";
        newStatus.details.ETA = "N/A";
      }

      let newDownload = {};

      for (var i = 0; i < state.length; i++) {
        if (state[i].URL === action.payload.URL) {

          // Si lo encuentro, newDownload es el download anterior
          // Pero con el updated status
          Object.assign(newDownload, state[i], newStatus);

          return [
              ...state.slice(0, i),
              newDownload,
              ...state.slice(i+1)
            ]
        }
      }

      // Devolver un state igual al anterior pero
      // con newDownload appended to downloads
      return [...state.downloads, newStatus]

    default:
      return state;
  }
}

export default mainReducer
