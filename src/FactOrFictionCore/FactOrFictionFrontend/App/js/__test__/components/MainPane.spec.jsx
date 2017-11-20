﻿import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import MainPane from '../../components/MainPane.jsx';
import { VIEW_INPUT, VIEW_RESULT } from '../../constants/viewTypes';

describe('MainPane', () => {

    let mainPane;
    let mainPaneResult;

    let details;
    let tokens;
    let isFetching;
    let didInvalidate;
    let textEntryTokenIds;
    let feedTokenIds;
    let view;
    let selectedEntryId;
    let votes;

    let changeView;
    let selectEntry;
    let fetchFeedTokens;
    let fetchTextEntry;
    let fetchDetails;
    let detailsShown;
    let showDetails;
    let castVote;

    beforeEach(() => {
        tokens = {
            "hi": {
                "type": "OBJECTIVE",
                "id": "123",
                "content": "Hello"
            }
        };
        details = {}
        isFetching = false;
        didInvalidate = false;
        textEntryTokenIds = ["hi"];
        feedTokenIds = ["hi"];
        selectedEntryId = "abc"; 
        detailsShown = {};
        votes = {};
        showDetails = jest.fn();
        fetchDetails = jest.fn()
        fetchFeedTokens = jest.fn();
        fetchTextEntry = jest.fn();
        changeView = jest.fn();
        selectEntry = jest.fn();
        castVote = jest.fn();

        mainPane = mount(
            <MainPane 
                details={details}
                fetchDetails={fetchDetails}
                fetchTextEntry={fetchTextEntry} 
                changeView={changeView}
                selectedEntryId={selectedEntryId}
                votes={votes}
                selectEntry={selectEntry}
                fetchFeedTokens={fetchFeedTokens}
                tokens={tokens}
                isFetching={isFetching}
                didInvalidate={didInvalidate}
                textEntryTokenIds={textEntryTokenIds}
                feedTokenIds={feedTokenIds}
                view={VIEW_INPUT} 
                detailsShown={detailsShown}
                showDetails={showDetails}
                castVote={castVote}
            />
        );
        mainPaneResult = mount(
            <MainPane 
                details={details}
                fetchDetails={fetchDetails}                
                fetchDetails={fetchDetails}
                fetchTextEntry={fetchTextEntry}
                changeView={changeView}
                selectedEntryId={selectedEntryId}
                votes={votes}
                selectEntry={selectEntry}
                fetchFeedTokens={fetchFeedTokens}
                tokens={tokens}
                isFetching={isFetching}
                didInvalidate={didInvalidate}
                textEntryTokenIds={textEntryTokenIds}
                feedTokenIds={feedTokenIds}
                view={VIEW_RESULT}
                detailsShown={detailsShown}
                showDetails={showDetails}
                castVote={castVote}
            />
        );
    });

    it('MainPane requires fetchTextEntry prop', () => {
        expect(mainPane.props().fetchTextEntry).toBeDefined();
    });

    it('MainPane requires changeView prop', () => {
        expect(mainPane.props().changeView).toBeDefined();
    });

    it('MainPane requires view prop', () => {
        expect(mainPane.props().view).toBeDefined();
    });

    it('MainPane requires votes prop', () => {
        expect(mainPane.props().votes).toBeDefined();
    });

    it('MainPane requires selectEntry prop', () => {
        expect(mainPane.props().selectEntry).toBeDefined();
    });

    it('MainPane requires selectedEntryId prop', () => {
        expect(mainPane.props().selectedEntryId).toBeDefined();
    });

    it('MainPane requires castVote prop', () => {
        expect(mainPane.props().castVote).toBeDefined();
    });

    it('App renders nested components (input)', () => {
        expect(mainPane.find('InputPane').length).toEqual(1);
    });

    it('App renders nested components (result)', () => {
        expect(mainPaneResult.find('ListView').length).toEqual(1);
    });

    it('Button click calls changeView', () => {
        let button = mainPaneResult.find('.change-view-button').first();
        button.simulate('click');
        expect(changeView).toBeCalledWith(VIEW_INPUT);
    });
});