import _ from "lodash";
import async from "async";
import React from "react";
import Config from "../Config";
import GmailApi from "../GmailApi";
import Main from "../AppLogic";
import ThreadList from "../ThreadList";
import UserList from "../UserList";
import Utility from "../Utility";
import ActionButtons from "./ActionButtons";
import AuthenticationTokenBox from "./AuthenticationTokenBox";
import EmailSearch from "./EmailSearch";
import MessageView from "./MessageView";
import ThreadExpansion from "./ThreadExpansion";
import ThreadListUi from "./ThreadList";
import ThreadListNavigation from "./ThreadListNavigation";
import UserLogin from "./UserLogin";

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      /* Main ThreadList object. */
      Threads: new ThreadList(),

      /* Main UserList object. */
      UserList: new UserList(),

      /* Whether show the user login page at startup or not. */
      showUserLogin: true,

      /* Whether show user authentication token input box. */
      showAuthenticationTokenBox: false,

      /* Whether to show the message view or not. */
      showMessageView: false,

      /* Text to show in the message view. */
      messageViewText: "",

      /* Show or hide the thread expansion area. */
      showThreadExpansion: false,

      /* Thread expansion area, is wide or default */
      expandThreadExpansionState: false,

      /* Current message list to be expanded. */
      currentThreadExpansionList: [],

      /* To reduce the size of <ThreadList />. */
      collapseThreadList: false,

      /*
       * Used for passing the authentication credentials from
       * 'GmailApi.js'
       * to '<AuthenticationTokenBox />'
       * to '<App />'
       * to 'GmailApi.js'
       */
      userTokenGenerationAuth: null,

      /* Suggestions from stored emails during login. */
      userSuggestions: [],

      /*
       * Which label is currently chosen to display the
       * thread list. __ALL__ is default for all messages.
       */
      currentThreadListLabelId: "__ALL__",

      /*
       * Stores the list of Thread object to display.
       * (label-wise, search-wise).
       */
      currentThreadList: [],

      /* Number of threads comprising of this label. */
      currentThreadListCount: 0,

      /*
       * To display only certain number of messages at
       * the start and load more in groups.
       */
      currentDisplayCount: 20,

      /*
       * Whether the thread list navigation area is
       * expanded or not.
       */
      threadListNavigationExpandState: false,

      /*
       * Most recent history ID.
       */
      historyId: 0
    };

    /*
     * Updates 'this.state.Threads' and
     * 'this.state.currentThreadList' according to the
     * list provided, otherwise
     * 'this.state.currentThreadListLabelId'.
     */
    this.updateThreadList =
      this.updateThreadList.bind(this);

    /*
     * Updates the this.state.currentThreadList and
     * this.state.currentThreadListLabelId according
     * to label.
     */
    this.changeThreadList =
      this.changeThreadList.bind(this);

    /*
     * Change the read status of a Thread Object and
     * update the UI too.
     */
    this.changeThreadReadStatus =
      this.changeThreadReadStatus.bind(this);

    /* Delete thread from the Mailbox and store. */
    this.deleteThread =
      this.deleteThread.bind(this);

    /* Resets the ThreadList state and it's related states. */
    this.resetThreadListState =
      this.resetThreadListState.bind(this);

    /* Show the message view. */
    this.showMessageView =
      this.showMessageView.bind(this);

    /* Hide the message view. */
    this.hideMessageView =
      this.hideMessageView.bind(this);

    /* To update the text in the message view. */
    this.updateMessageView =
      this.updateMessageView.bind(this);

    /* Show the thread expansion area. */
    this.openThreadExpansion =
      this.openThreadExpansion.bind(this);

    /* Hide the thread expansion area. */
    this.closeThreadExpansion =
      this.closeThreadExpansion.bind(this);

    /* Increase/decrease the size of the thread expansion area. */
    this.expandThreadExpansion =
      this.expandThreadExpansion.bind(this);

    /* Show <AuthenticationTokenBox /> */
    this.showAuthenticationTokenBox =
      this.showAuthenticationTokenBox.bind(this);

    /* Hide <AuthenticationTokenBox /> */
    this.hideAuthenticationTokenBox =
      this.hideAuthenticationTokenBox.bind(this);

    /* Hide the <UserLogin /> component. */
    this.hideUserLogin =
      this.hideUserLogin.bind(this);

    /*
     * Set the 'this.state.currentThreadList' according
     * to the suggestions list provided.
     */
    this.selectMessageSearchSuggestion =
      this.selectMessageSearchSuggestion.bind(this);

    /*
     * Submit the generated token to GmailApi.js
     * for storing.
     */
    this.submitAuthenticationTokenBox =
      this.submitAuthenticationTokenBox.bind(this);

    /* Main function, starts the fetch loop. */
    this.main = this.main.bind(this);

    /* Sync the app with the mailbox. */
    this.startSync = this.startSync.bind(this);

    /* Update the 'historyId' state variable and store the value in file. */
    this.updateAndStoreHistoryId = this.updateAndStoreHistoryId.bind(this);

    /* Fetch and sync messages, completely. */
    this.fetchAndSync = this.fetchAndSync.bind(this);

    /* Reload the user's store. */
    this.refreshUserStore =
      this.refreshUserStore.bind(this);

    /*
     * Checks whether user is present in record and loads
     * configurations according to that user's credentials.
     * Calls loadConfig() for further execution.
     */
    this.logInUser = this.logInUser.bind(this);

    /*
     * Fetches messages from Mailbox. Wrapper around smaller
     * functions.
     */
    this.fetchMessages = this.fetchMessages.bind(this);

    /* Update the history ID property of state object. */
    this.updateHistoryId = this.updateHistoryId.bind(this);

    /* This will append 20 more messages to the list. */
    this.showMoreMessages = this.showMoreMessages.bind(this);

    /* Increase/decrease the thread list navigation area. */
    this.threadListNavigationExpand = this.threadListNavigationExpand.bind(this);
  }

  componentDidMount () {
    // Before the app starts (<App /> UI is rendered).
    Main.checkDirectoryStructure();

    // Load the Users object for login and all.
    this.state.UserList.load(() => {
      this.setState({ UserList: this.state.UserList });
    });
  }

  /**
   * Update the current display list.
   *
   * @param {object} threadList - List of threads.
   *
   * @returns {}
   */
  updateThreadList (threadList) {
    const labelId = this.state.currentThreadListLabelId;

    /*
     * If search label is open and the thread list is also empty,
     * do not update the thread list.
     */
    if (_.isEmpty(threadList) && labelId === "__SEARCH__") {
      return;

    // If the search label is open and thread is not empty, return then too.
    } else if (labelId === "__SEARCH__") {
      return;
    }

    const list = (threadList && _.isEmpty(threadList))
      ? threadList
      : this.state.Threads.getLabelSpecificThreadList(labelId);

    /*
     * If a specific threadList is passed then render
     * that otherwise show current label's thread list.
     */
    this.setState({
      currentThreadListCount: list.length,
      currentThreadList: list
    });
  }

  /**
   * Threads of which label to show. Reset the display
   * counter also.
   *
   * @param {string} labelId - ID of label which is to be opened.
   *
   * @returns {}
   */
  changeThreadList (labelId) {
    const threadList =
      this.state.Threads.getLabelSpecificThreadList(
        labelId || "__ALL__"
      );

    this.setState({
      currentThreadListLabelId: labelId || "__ALL__",
      currentDisplayCount: 20,
      currentThreadList: threadList,
      currentThreadListCount: threadList.length
    });
  }

  /**
   * Change thread read status of a thread.
   *
   * @param {string} id - ID of the thread whose status
   * is to be changed.
   *
   * @returns {}
   */
  changeThreadReadStatus (id) {
    const self = this;
    Main.changeThreadReadStatus(id, self.state.Threads, () => {
      self.startSync();
      self.updateThreadList(self.state.currentThreadList)
    });
  }

  /**
   * Delete the thread from the Gmail mailbox and local cache too.
   *
   * @param {string} id - ID of the thread to be deleted.
   *
   * @returns {}
   */
  deleteThread (id) {
    const self = this;
    Main.deleteThread(id, true, null, (result) => {
      if (result.status) {
        /*
         * Remove the deleted thread from the
         * displayed list (currentThreadList).
         */
        _.remove(
          self.state.currentThreadList,
          (item) => item.threadId === id
        );

        // Sync with the mailbox.
        self.startSync();
      }
    });
  }

  /** Resets the state of the ThreadList and it's related states.
   *
   * @param {}
   *
   * @returns {}
   */
  resetThreadListState () {
    this.state.Threads = new ThreadList();
    this.state.showThreadExpansion = false;
    this.state.currentThreadExpansionList = [];
    this.state.collapseThreadList = false;
    this.state.currentThreadListLabelId = "__ALL__";
    this.state.currentThreadList = [];
    this.state.currentThreadListCount = 0;
    this.state.currentDisplayCount = 20;
  }

  /**
   * Show the <MessageView /> component.
   *
   * @param {}
   *
   * @returns {}
   */
  showMessageView () {
    this.setState({ showMessageView: true });
  }

  /**
   * Hide the <MessageView /> component.
   *
   * @param {}
   *
   * @returns {}
   */
  hideMessageView () {
    this.setState({ showMessageView: false });
  }

  /**
   * Update the message in the message view.
   *
   * @param {string} message - Message to display.
   *
   * @returns {}
   */
  updateMessageView (message) {
    this.setState({
      showMessageView: true,
      messageViewText: message
    });
  }

  /**
   * Show the <ThreadExpansion /> component.
   *
   * @param {string} threadId - ID of the thread to expand.
   *
   * @returns
   */
  openThreadExpansion (threadId) {
    this.setState({
      showThreadExpansion: true,
      currentThreadExpansionList: this.state.Threads.getMessageValues(threadId),
      collapseThreadList: true
    });
  }

  /**
   * Close the <ThreadExpansion /> component.
   *
   * @param {}
   *
   * @returns {}
   */
  closeThreadExpansion () {
    this.setState({
      showThreadExpansion: false,
      collapseThreadList: false,
      expandThreadExpansionState: false
    });
  }

  /**
   * Increase/decrease the size of the thread expansion area.
   *
   * @param {}
   *
   * @returns {}
   */
  expandThreadExpansion () {
    this.setState({
      expandThreadExpansionState: !this.state.expandThreadExpansionState
    });
  }

  /**
   * Show the <AuthenticationTokenBox /> component.
   *
   * @param {object} auth - Client application's credentials.
   *
   * @returns {}
   */
  showAuthenticationTokenBox (auth) {
    this.setState({
      showAuthenticationTokenBox: true,
      userTokenGenerationAuth: auth
    });
  }

  /**
   * Hide the <AuthenticationTokenBox /> component.
   *
   * @param {}
   *
   * @returns {}
   */
  hideAuthenticationTokenBox () {
    this.setState({ showAuthenticationTokenBox: false });
  }

  /**
   * Hide the <UserLogin /> component.
   *
   * @param {}
   *
   * @returns {}
   */
  hideUserLogin () {
    this.setState({ showUserLogin: false });
  }

  /**
   * Display the select message search suggestions.
   *
   * @param {object} threads - List of threads.
   *
   * @returns {}
   */
  selectMessageSearchSuggestion (threads) {
    this.setState({
      // Set the label.
      currentThreadListLabelId: "__SEARCH__",

      // Update the thread list that is to be displayed.
      currentThreadList: threads.map(
        (item) => this.state.Threads.get(item)
      )
    });
  }

  /**
   * Submit the authentication token for storing.
   *
   * @param {string} token - Generated token code.
   * @param {object} auth - Client Application credentials.
   *
   * @returns {}
   */
  submitAuthenticationTokenBox (token, auth) {
    GmailApi.storeNewToken(
      Config.User.store,
      auth,
      token,
      (status) => {
        // Hide the <AuthenticationTokenBox /> and start app.
        if (status != null) {
          this.hideAuthenticationTokenBox();
          this.main();
        } else {
          console.log("Internal Error.");
        }
      }
    );
  }

  /**
   * Initialization function.
   *
   * @param {}
   *
   * @returns {}
   */
  main () {
    const self = this;

    // Fetch the message labels.
    Main.fetchLabels(Config.User, (labels) => {
      Config.Labels = labels;

      // Load the message list and display the DOM nodes also.
      self.state.Threads.load(Config.User.dir, () => {
        self.updateThreadList();

        // Hide the login page.
        this.hideUserLogin();

        // Load the mailbox history ID.
        Main.loadHistoryId(Config.HISTORY_ID_STORE, (result) => {
          self.updateHistoryId(result.data);

          // Fetch history ID list periodically to see the changes.
          self.startSync();
          setInterval(() => {
            self.startSync();
          }, Config.FETCH_INTERVAL);
        });
      });
    });
  }

  /**
   * Sync the app with the mailbox.
   *
   * @param {}
   *
   * @callback {}
   */
  startSync (callback) {
    const self = this;

    GmailApi.getHistoryList(
      Config.User,
      self.state.historyId,
      (res) => {
        if (res.status) {
          // If there are some changes to make.
          if (res.data.history && res.data.history.length > 0) {
            async.eachSeries(res.data.history, (history, callback) => {
              // Parse the changes in history to get a simpler object.
              const historyDetails =
                GmailApi.parseHistoryList(history);

              // Change in mailbox, update the app.
              if (historyDetails.change) {
                async.series([
                  // Update labels.
                  function (callback) {
                    if (historyDetails.labelsChanged.length > 0) {
                      // Iterate over the label changes.
                      async.eachLimit(
                        historyDetails.labelsChanged,
                        20,
                        (item, callback) => {
                          Main.updateThreadLabels(
                            item.threadId,
                            item.labels,
                            self.state.Threads,
                            () => {
                              callback();
                            }
                          );
                        }, (err) => {
                          if (err) ;

                          callback(null, null);
                        }
                      );
                    } else {
                      callback(null, null);
                    }
                  },

                  // Add messages.
                  function (callback) {
                    if (historyDetails.messagesAdded.length > 0) {
                      self.customFetchMessages(
                        Config.User,
                        historyDetails.messagesAdded,
                        () => {
                          self.updateThreadList();
                          callback(null, null);
                        }
                      );
                    } else {
                      callback(null, null);
                    }
                  },

                  // Delete messages.
                  function (callback) {
                    if (historyDetails.messagesDeleted.length > 0) {
                      async.eachLimit(
                        historyDetails.messagesDeleted,
                        20,
                        (messageId, callback) => {
                          /*
                           * Get the thread ID to be deleted,
                           * using message's ID, and delete the thread.
                           */
                          Main.deleteThread(
                            self.state.Threads.getThreadIdFromMessageId(messageId),
                            false,
                            self.state.Threads,
                            () => {
                              callback();
                            }
                          );
                        }, (err) => {
                          if (err) {
                            Config.Logger.error(err);
                          } else {
                            self.updateThreadList(
                              self.state.currentThreadList);
                          }
                          callback(null, null);
                        }
                      );
                    } else {
                      callback(null, null);
                    }
                  }
                ], (_err, _results) => {
                  self.updateThreadList();
                  self.updateAndStoreHistoryId(history.id);
                  callback();
                });
              } else {
                self.updateAndStoreHistoryId(history.id);
                callback()
              }
            }, (_err) => {
              typeof callback === "function" ? callback() : {};
            });
          } else {
            self.updateAndStoreHistoryId(res.data.historyId);
            console.log(`Last Sync: ${Utility.modifyDateField(new Date(), true)}`);
            typeof callback === "function" ? callback() : {};
          }
        } else {
          self.fetchAndSync();
          typeof callback === "function" ? callback() : {};
        }
      }
    );
  }

  /**
   * Update the state variable with the new history ID
   * and store the same in file.
   *
   * @param {string} historyId - History ID to store and update.
   *
   * @callback {}
   */
  updateAndStoreHistoryId (historyId, callback) {
    const self = this;

    // Store the next history ID provided in response.
    Main.storeHistoryId(Config.HISTORY_ID_STORE, historyId, () => {
      self.updateHistoryId(historyId);
      typeof callback === "function" ? callback() : {};
    });
  }

  /**
   * Consolidated two functions.
   *
   * @param {}
   *
   * @callback {}
   */
  fetchAndSync () {
    const self = this;

    // Start fetching the message for first time.
    self.fetchMessages(Config.User, () => {
      self.updateThreadList();

      // Sync the application with the Gmail mailbox.
      self.syncMessages(Config.User, () => {});
    });
  }

  /**
   * Remove the messages or threads that are present in the
   * local cache but are not present in the Gmail mailbox
   * (fetched list).
   *
   * @param {object} user - User's info.
   *
   * @callback {}
   */
  syncMessages (user, callback) {
    const self = this;

    GmailApi.getMessageList(user, (result) => {
      if (result.status) {
        // Elements present in local cache but not in fetched list.
        const extras = Utility.getUnique(
          self.state.Threads.getMessageKeys(),
          result.data.messageList
        );

        async.eachLimit(extras, 20, (messageId, callback) => {
          /*
           * Get the thread ID to be deleted,
           * using message's ID and then delete the thread.
           */
          Main.deleteThread(
            self.state.Threads.getThreadIdFromMessageId(messageId),
            false,
            self.state.Threads,
            () => {
              callback();
            });
        }, (err) => {
          if (err) ;

          // Store the threads and render the updated list.
          self.updateThreadList(self.state.currentThreadList);
          callback();
        });
      }
    });
  }

  /**
   * Instead of complete fetch, this just fetches
   * the required messages (argument provided).
   *
   * @param {object} user - User object.
   * @param {[]} messageList - List of messages to fetch.
   *
   * @callback {}
   */
  customFetchMessages (user, messageList, callback) {
    const self = this;
    const tempHistoryIdList = [];
    const Threads = self.state.Threads;

    if (Config.FetchingMessages) {
      callback();
    } else {
      Config.FetchingMessages = true;
      let count = 0;
      async.eachLimit(messageList, 20, (messageId, callback) => {
        Main.fetchAndStoreMessage(
          user,
          Threads,
          messageId,
          tempHistoryIdList,
          () => {
            self.updateMessageView(
              `Fetching ${++count} of ${messageList.length} messages.`
            );
            self.updateThreadList();
            callback(null);
          }
        );
      }, () => {
        self.hideMessageView();

        // Reset the flag.
        Config.FetchingMessages = false;

        callback();
      });
    }
  }

  /**
   * Fetch messages from Mailbox.
   *
   * @param {object} user - User's info.
   *
   * @callback {}
   */
  fetchMessages (user, callback) {
    const self = this;
    const Threads = self.state.Threads;
    const tempHistoryIdList = [];

    // Check if another instance of fetchMessages() is not running.
    if (Config.FetchingMessages) {
      callback();
    } else {
      // Set the flag.
      Config.FetchingMessages = true;

      // Check if there are new messages to fetch.
      Main.checkForNewMessages(
        user,
        Threads.getMessageKeys(),
        (result) => {
          if (!result.status) {
            console.log("Internal Error");
            // Reset the flag.
            Config.FetchingMessages = false;
            callback(null);
          } else {
            // Start fetching messages.
            let count = 0;
            async.eachLimit(
              result.data,
              20,
              (messageId, callback) => {
                Main.fetchAndStoreMessage(
                  user,
                  Threads,
                  messageId,
                  tempHistoryIdList,
                  () => {
                    self.updateMessageView(
                      `Fetching ${++count} of ${result.data.length} messages.`
                    );
                    self.updateThreadList();
                    callback(null);
                  }
                );
              }, () => {
                self.hideMessageView();
                // Reset the flag.
                Config.FetchingMessages = false;

                // Sort the history IDs in descending order
                const historyId =
                  _.sortBy(tempHistoryIdList).reverse()[0];

                // Update the history Id in app state.
                self.updateHistoryId(historyId);

                // Store the history ID in file.
                Main.storeHistoryId(
                  Config.HISTORY_ID_STORE,
                  historyId,
                  () => {}
                );

                callback();
              }
            );
          }
        }
      );
    }
  }

  /**
   * Update the history ID in state.
   *
   * @param {string} historyId - History ID.
   */
  updateHistoryId (historyId) {
    this.setState({
      historyId: historyId
    });
  }

  /**
   * Removes all the messages from the user's store and reload it.
   *
   * @param {string} userStore - User's database storage Id.
   *
   * @returns {}
   */
  refreshUserStore () {
    const self = this;
    Main.emptyUserStore((result) => {
      if (result.status) {
        /* Reset the ThreadList related states. */
        self.resetThreadListState();

        // Update the thread list to show empty thread list.
        self.updateThreadList();

        // Start fetching again.
        self.fetchMessages(Config.User, () => {});
      }
    });
  }

  /**
   * AppLogic.logInUser() does the main work.
   *
   * @param {string} email - Email address of the user to sign-in/up.
   * @param {boolean} createNew - Whether to create a new user or not.
   *
   * @returns {}
   */
  logInUser (email, createNew) {
    Main.logInUser(email, createNew, this.state.UserList,
      this.showAuthenticationTokenBox, this.main);
  }

  /**
   * At each call, append 20 more messages to the list.
   *
   * @param {}
   *
   * @returns {}
   */
  showMoreMessages () {
    this.setState({
      currentDisplayCount: this.state.currentDisplayCount + 20
    });
  }

  /**
   * Increase/decrease the thread list navigation area.
   *
   * @param {}
   *
   * @returns {}
   */
  threadListNavigationExpand () {
    this.setState({
      threadListNavigationExpandState: !this.state.threadListNavigationExpandState
    });
  }

  render () {
    return (
      <div className="main-container">
        <UserLogin
          logInUser={this.logInUser}
          show={this.state.showUserLogin}
          userList={this.state.UserList.getUserIds()}
        />

        <AuthenticationTokenBox
          show={this.state.showAuthenticationTokenBox}
          auth={this.state.userTokenGenerationAuth}
          hideAuthBox={this.hideAuthenticationTokenBox}
          submitAuthToken={this.submitAuthenticationTokenBox}
        />

        <header>
          <span className="header-left">

            {
             /*
              * Search feature is turned off until fixed.
              *
            <EmailSearch
              threads={this.state.Threads}
              searchMessages={Main.searchMessages}
              suggestions={this.state.messageSearchSuggestions}
              selectMessageSearchSuggestion={this.selectMessageSearchSuggestion}
            />
              *
              */
            }

          </span>

          <span className="header-right">
            <ActionButtons
              refreshUserStore={this.refreshUserStore}
              syncApp={this.startSync}
            />
          </span>
        </header>

        <article>
          <ThreadListNavigation
            threadNavList={
              !_.isEmpty(Config.Labels)
                ? Config.Labels.getValues()
                : []
            }
            changeThreadList={this.changeThreadList}
            threadListCount={this.state.currentThreadListCount}
            currentThreadListLabelId={this.state.currentThreadListLabelId}
            threadListNavigationExpandState={this.state.threadListNavigationExpandState}
            threadListNavigationExpand={this.threadListNavigationExpand}
          />

          <ThreadListUi
            threadList={this.state.currentThreadList}
            currentUserId={this.state.UserList.currentUserId}
            changeThreadReadStatus={this.changeThreadReadStatus}
            deleteThread={this.deleteThread}
            openThreadExpansion={this.openThreadExpansion}
            collapseThreadList={this.state.collapseThreadList}
            displayCount={this.state.currentDisplayCount}
            showMoreMessages={this.showMoreMessages}
            userInfo={Config.User}
            LABEL_COLORS={Config.LABEL_COLORS}
            LABELS={Config.Labels}
          />

          <ThreadExpansion
            show={this.state.showThreadExpansion}
            closeThreadExpansion={this.closeThreadExpansion}
            messageList={this.state.currentThreadExpansionList}
            userInfo={Config.User}
            expandThreadExpansionState={this.state.expandThreadExpansionState}
            expandThreadExpansion={this.expandThreadExpansion}
          />
        </article>

        <MessageView
          show={this.state.showMessageView}
          message={this.state.messageViewText}
        />

      </div>
    );
  }
}

export default App;
