import { 
    FETCHING_TOKENS,
    INVALIDATE_TEXT_ENTRY,
} from '../constants/actionTypes';

import 'whatwg-fetch';
import { selectEntry } from './selectEntry';
import { receiveFeed, receiveTextEntry, receiveTokens, receiveVotes } from './receive';

const fetchingTokens = text => {
    return {
        type: FETCHING_TOKENS,
        text
    };
};

const fetchTextEntry = textEntry => {
    return (dispatch) => {

        // Notify App that async call is being made.
        dispatch(fetchingTokens(textEntry));
        
        // Construct form data that API is expecting.
        const formData = new FormData();
        formData.append("Content", textEntry);

        return fetch(`/TextEntries/Create/`, {
            method: "POST",
            credentials: 'same-origin',
            body: formData
        })
        .then(
            response => response.json(),
            error => console.log('An error occured when fetching text entries.', error)
        )
        .then(json => {
            const clearSelection = "";
            dispatch(receiveTokens(json));
            dispatch(receiveTextEntry(json));
            dispatch(selectEntry(clearSelection));
        })
    }
}

const fetchFeedTokens = (tokenId = "", page = 0) => {
    return (dispatch) => {
        return fetch(`/Sentences/Feed/${tokenId}?page=${page}`, {
            method: "GET",
            credentials: "same-origin"
        })
        .then(
            response => response.json(),
            error => console.log('An error occured when fetching feed entry.', error)
        )
        .then(json => {
            const clearSelection = "";

            // Put tokens into storage
            dispatch(receiveTokens(json));
            // Add tokens to feed list
            dispatch(receiveFeed(json));
            // Add votes to the vote list
            dispatch(receiveVotes(json));
            // Clear selection
            dispatch(selectEntry(clearSelection));
        })
    }
}

export { fetchTextEntry, fetchFeedTokens };