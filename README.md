[![Build Status](https://travis-ci.com/Microsoft/redux-dag-history.svg?token=Zp5ok23F9QzZUVfCEpU5&branch=master)](https://travis-ci.com/Microsoft/redux-dag-history)

# Redux DAG History

Nonlinear History

This project is a redux middleware that provides an alternative take on application history. Independent threads of user exploration are tracked as 
separate "branches" in a state DAG (Directed Acyclic Graph) inspired roughly by Git version control. Some additional concepts have been implemented, 
including:

* Pinning states of interest
* Checking for state equivalency before inserting a new state
* Tracking alternate routes to a state
* Import/Export
