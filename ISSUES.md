# ISSUES

## Issues Pending

## #1. Too slow startup

## #2. ThreadList JSON storing function is not atomic

## #3. No tests

## #4. No way to handle sudden network disruption

## #5. User authentication is not secure

## <strike>#6. [Fixed] Labels are not cached in storage for offline purpose </strike>

## #7. Search is very slow and inefficient and also not very accurate

## <strike>#8. [Fixed] ThreadList UI is unresponsive or lagging (the whole UI, actually) for even smaller lists (> 100) </strike>

## #9. Messages (in thread expansion) after expansion won't resize if the window is resized

## #10. ThreadList does not show more threads automatically, but needs a button to be clicked each time

## #11. ThreadExpansionItem's IFrame uses the height of the previous ThreadExpansionItem, if the IFrame is open

## <strike>#12. [Fixed] \<UserLogin /> does not show 'createNewUser' button when asked to. Need to fix the component's updating mechanism </strike>

## <strike>#13. [Fixed] When searching, sometimes the threads vanish, maybe due to the App's state getting udpated, and hence displaying empty list due to the <App />'s 'state.currentThreadList' (Array) being empty during the update. __SEARCH__ label might be causing this abnormal behavior </strike>

## #14. No way to show the download progress of an attachment

## <strike>#15. [Fixed] App.fetchMails() is called periodically, hence there are multiple instances of it running, in case the fetching takes longer than the prescribed interval period </strike>

## <strike>#16. When syncing Threads, any change in the labels will not be shown </strike>

## <strike>#17. When a label is removed from the mailbox, then the mails corresponding to that label should also be updated </strike>

<br />
<br />

## Issues Fixed

## [9 August, 2019]

### #6. Labels are not cached in storage for offline purpose

> <b>FIX</b>: Labels are fetched and immediately stored in file and in case of errors or no response while fetching, they are loaded from persistent storage.

## [11 September, 2019]

### #8. ThreadList UI is unresponsive or lagging (the whole UI, actually) for even smaller lists (> 100)

> <b>FIX</b>: Threads are shown in batches of 20 and a 'Load More' button is appended at the bottom of the list. Obviously, it's not an optimal solution, but at least the application won't lag at the startup.

## [17 September, 2019]

### #12. \<UserLogin /> does not show 'createNewUser' button when asked to. Need to fix the component's updating mechanism

> <b>FIX</b>: 'show' property was needed by the \<UserLoginActionButton /> component, which was not passed in create user button but was passed in login button. Removed that property from the component.

## [20 September, 2019]

### #13. When searching, sometimes the threads vanish, maybe due to the App's state getting udpated, and hence displaying empty list due to the <App />'s 'state.currentThreadList' (Array) being empty during the update. __SEARCH__ label might be causing this abnormal behavior

> <b>FIX</b>: An empty suggestion list 'suggestionList' (searchMails() in \<App />) was passed for empty input, hence displaying empty list in case of state change.

> <b>Reference Commit</b>: 97277e00387953ac5fa6abd9b83429df05b8e95f

## [24 September, 2019]

### #15. App.fetchMails() is called periodically, hence there are multiple instances of it running, in case the fetching takes longer than the prescribed interval period

> <b>FIX</b>: [boolean] Config.FetchingMails is used for checking whether fetchMails() is not already running. First instance of fetchMails() will set the flag to true and the same will set it to false after exiting.

> <b>Reference Commit</b>: 1cedf553cec4ab616ed05b290a25346dc4aa1dbc


## [5 July, 2020]

### #16. When syncing Threads, any change in the labels will not be shown
### #17. When a label is removed from the mailbox, then the mails corresponding to that label should also be updated

> <b>FIX</b>: Using 'historyId' property of the mailbox for syncing. Instead of fetching the whole message list, historyId is fetched, since it shows all the changes in the mailbox. 'historyId' is an increasing number, with each increase means a new set of change in the mailbox. This way, only when there is a 404 error during 'historyId' fetch, the full sync is done (full message list is fetched), otherwise, just a small fetch would do. A huge cut in the bandwidth usage. 
For labels related syncing, it gets automatically updated, since the 'history' provides with the added or removed labels as an array for each message (in turn, each Thread) in the response, which can be set directly to the Thread object.