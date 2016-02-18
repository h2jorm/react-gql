# react-gql [![Build Status](https://travis-ci.org/leeching/react-gql.svg)](https://travis-ci.org/leeching/react-gql) [![npm version](https://badge.fury.io/js/react-gql.svg)](https://badge.fury.io/js/react-gql)
Here is a collection of helper functions to build a react app with redux and graphql.

Different from `react-relay`, `react-gql` is not a full-featured framework but a flyweight library providing several helper functions to combine react, redux and graphql together. As a result, `react-gql` leaves the control of application to developers and only handles dirty and unpleasant works.

## Providing
`react-gql` does not take care of:

* writing action creator functions, reducer and creating store
* dispatching redux actions
* communication with graphql server

`react-gql` takes care of:

* declaring data structure of a react component
* declaring graphql mutations
* updating component state when `store` changes

## Document

[Api Document](https://github.com/leeching/react-gql/tree/master/docs)
