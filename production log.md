# dictionary-editor - production log

Initial steps:

- simplify the requirement document. A copy has been saved in the assets folder at root level.
 
- create git repository
 
-  prepare basic structure (test)
 
- init npm project
 
- add uni testing frameworks.

- install node dependencies

- create Karma config file

- create simple test and verify code coverage output


Development is going to be a TDD.

TDD will drive the definition of classes

NOTES:

- Duplicates domains/ranges cannot happen since the pure dictionary object will not allow it.

- Same for duplicates Domains with different Ranges

- Only one Chain anomaly per Range value is possible. Using dictionare we cannot have more than one chain because
 it will suppose that we allow multiple domains 
 
 - Cycles:...