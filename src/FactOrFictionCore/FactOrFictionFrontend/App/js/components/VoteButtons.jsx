import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { VOTE_TRUE, VOTE_FALSE, VOTE_UNVOTED } from '../constants/voteTypes.js'
import _ from '../../stylesheets/components/_VoteButtons.scss'

export default class VoteButtons extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        sentenceVote: PropTypes.string.isRequired,
        castVote: PropTypes.func.isRequired,
        voteTrue: PropTypes.number,
        voteFalse: PropTypes.number
    }

    render() {
        const { 
            sentenceVote, 
            voteTrue, 
            voteFalse 
        } = this.props;

        const trueClass = `vote-button-true${sentenceVote == VOTE_TRUE ? `-pressed` : ""}`
        const falseClass = `vote-button-false${sentenceVote == VOTE_FALSE ? `-pressed` : ""}`

        return (
            <div className="vote-buttons">
                <table style={{"width": "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{"textAlign": "right"}}>
                                <Button 
                                    handleClick={() => {
                                        this.handleClick(VOTE_TRUE);                                        
                                    }}
                                    content={
                                        <div>
                                            <i
                                                className={`ms-Icon ms-Icon--triangleUp ${trueClass}`}
                                                aria-hidden="true"
                                            />
                                            <span>  True {voteTrue}</span>
                                        </div>
                                    }
                                />
                            </th>
                            <th style={{"textAlign": "left"}}>
                                <button 
                                    className={"ff-Button change-view-button ms-Button"}
                                    onClickCapture={e => {
                                        e.stopPropagation();
                                        this.handleClick(VOTE_FALSE);
                                        return false;
                                    }}>                                    
                                    <i
                                        className={`ms-Icon ms-Icon--triangleDown ${falseClass}`}
                                        aria-hidden="true"
                                    />
                                    <span>  False {voteFalse}</span>
                                </button>
                            </th> 
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    handleClick(type) {
        const { id, castVote } = this.props;
        castVote(id, type);
    }
}
