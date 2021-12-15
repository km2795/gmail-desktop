# Changelog

## [0.0.0] - 2019-09-07

### Changes
- Remodeled the whole application using React.

### Issues 
- Very slow startup.
- No tests
- Security
- No way to handle errors (network or otherwise).

---

<br />

> ## Remodeling the Application.

<br />

---


## [0.8.35] - 2018-08-26

### Fixed
- Glitches in search feature (was showing the mails even after delete).
- Mails loaded after scrolling did not have the listeners attached.

### Issues
- Everything is running without testing.
- Lists seem to be not ordered after some update operation.

### Security
- No security for user's mails and credentials.


## [0.8.34] - 2018-07-22

### Added 
- Added reply feature.
- Added two more action buttons (reload and update).

### Fixed
- Glitches in DOM rendering and updates.
- Some major issues in the search results.

### Changes
- Major remodeling in the app's internals (not UI).

### Issues
- While displaying the mails they need to categorized.
- Everything is running without testing.
- Lists seem to be not ordered after some update operation.

### Security
- No security for user's mails and credentials.


## [0.7.34] - 2018-06-24

### Added 
- Attachments are now shown when mail content is expanded for 
viewing. Can be downloaded to the file system too.

### Fixed
- APIs not responding after a few requests.

### Issues
- While displaying the mails they need to categorized.
- Everything is running without testing.

### Security
- No security for user's mails and credentials.


## [0.6.34] - 2018-06-23

### Changed
- Syncing will be done manually.

### Fixed
- APIs not responding after a few requests.

### Issues
- While displaying the mails they need to categorized.
- Everything is running without testing.

### Security
- No security for user's mails and credentials.


## [0.6.32] - 2018-06-22

### Added
- Database indexing
- Mails can now be marked as read or reverted back from read.
- Mail list is now shown in parts, and more is loaded as the list is scrolled.
- Added logging facility.
- Selections can now be cleared off with any number of elements without having 
to choose all and then clear all.

### Changed
- Now, database is used for indexing purpose and for storing the user
list instead of file, though the other records such as mail content, 
last login, logging, etc. are still stored in the file system.

### Fixed
- Duplicacy issue (Not tested though).

### Issues
- While displaying the mails they need to categorized.
- Everything is running without testing.

### Security
- No security for user's mails and credentials.


## [0.5.32] - 2018-06-17

### Added
- For user's convenience, a list of previously used mails will be shown when the user wants to send a mail.

### Issues
- Search results can miss out some keys.
- Search results need to be filtered to remove repeating entries.
- A lot of duplicate mail objects are getting rendered.

### Security
- No security for user's mails and credentials.
- No testing done.


## [0.4.32] - 2018-06-17

### Fixed
- Decreased the loading time.
- Fixed some lagging during the application startup.

### Issues
- Search results can miss out some keys.
- Search results need to be filtered to remove repeating entries.
- A lot of duplicate mail objects are getting rendered.

### Security
- No security for user's mails and credentials.
- No testing done.


## [0.4.31] - 2018-06-16

### Fixed
- Improved the search feature for better results.
- Code refactoring.
- Improved the loading time.
- Fixed the code responsible for sluggish/non-responsive UI.

### Issues
- Search results can miss out some keys.
- Search results need to be filtered to remove repeating entries.
- A lot of duplicate mail objects are getting rendered.

### Security
- No security for user's mails and credentials.
- No testing done.


## [0.4.29] - 2018-06-14

### Added
- Added mail sending facility.

### Fixed
- Improved the UI for faster rendering.
- Improved the mail fetching performance.

### Issues
- Sluggish UI when mails are too many or network bandwidth is low.
- Search feature is not effective.
- Mails are still not parsed correctly.
- Not very responsive. Render blocking code is in plenty.
- Simple, though not so manageable UI.
- No way to send, reply to mails, etc.

### Security
- No security for user's mails and credentials.
- No testing done.


## [0.3.29] - 2018-06-04

### Added
- Mails can be read, deleted and searched only.

### Changed
- Revamped the UI.

### Issues
- Sluggish UI when mails are too many or network bandwidth is low.
- Search feature is not effective.
- Not very responsive. Render blocking code is in plenty.
- Simple, though not so manageable UI.
- No way to send, reply to mails, etc.

### Security
- No security for user's mails and credentials.
- No testing done.
