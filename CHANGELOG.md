# Changelog
All notable changes for this project will be documented in this file.

## 0.0.43 - 2018-10-05
### Added
- [meta]+enter saves and closes modules
- [meta]+[shift]+enter saves, closes, and opens a new module
- clicking on a module opens it for editing
- status field for all major pieces of content
- login2 functionality
- cumulative word count for ContentEditor
- moved all Bible text lookup to cloud functions

### Changed
- consolidated modules
- add lesson moved to cloud functions

### Fixed
- lots of cleanup from Message language
- problematic opened modules are now closed on refresh

## 0.0.42 - 2018-09-06
### Fixed
- first drag and drop on LessonList, DevoList, and ContentEditor should now work properly
- first drag and drop on LessonList and DevoList after using the back should now work properly
- AddSection modal resets input after submitting

## 0.0.41 - 2018-09-06
### Changed
- devos can now be rearranged
- running dev server uses different backend

### Fixed
- light theme main idea tab colors

## 0.0.40 - 2018-09-05
### Changed
- several page and component names to remove the 'R'
- updated all npm packages
- color scheme to match new design
- List uses firebase rather than database - circumvented database permanently
- logo to use aws hosted image
- login persistency is now set to LOCAL

### Fixed
- left drawer auto opening on mobile

### Removed
- some extra unused page files

## 0.0.39 - 2018-09-04
### Changed
- name of Editor module to TextEditor to make more sense
- all lists now use a separate array of ids to determine order (ie. lessonOrder, sectionOrder, moduleOrder)
- all firestore references now use fiery-vue
- cleaned up a lot in ContentEditor component

### Fixed
- $emit and $on functions that were pointed at the wrong place

### Removed
- personalization options for Bible translation and speaking speed
- all settings references to Message

### Issues
- on all lists, on the first drag and drop, if it is being brought from a lower position to a higher postiion, it jumps to the top of the list after release -- still have no idea how to fix this issue, it only happens on the first time you drag and drop something

## 0.0.38 - 2018-08-31
SPLIT!!
The beginning of the split between Builder and Message
### Added
- fiery-vue package to handle firebase connections

### Changed
- lots of changes, mostly removing of any reference to Message
- realtime database scrapped for firestore

### Removed
- Any files that only served Message

## 0.0.37 - 2018-08-27
### Fixed
- section preview now has a dashed border rather than a solid fill
- application module now saves and displays texts properly
- question module uses a single line input rather than a multi-line input for editing the question text

## 0.0.36 - 2018-08-21
### Changed
- OSermons and OScratchPads changed to match the new OLesson style
- RSeries, RLesson, and RDevo changed to match the new OLesson style
- RResearch, RGuide, and RReview changed to match the new OLesson style

## 0.0.35 - 2018-08-10
### Changed
- removed solid background for sections -- changed to dashed border
- moved OLesson title and menu icon into a toolbar -- main idea shows up in a box after scrolling for referral
- various css changes for positioning purposes

## 0.0.34 - 2018-07-11
TESTING FOR RELEASE
### Added
- input for notes in question module

### Changed
- OList tags and bible refs are much more readable
- Devo and Lesson module bible refs are much more readable
- OList and OMedia cards now have an opacity effect when hovering
- text and bible modules now update wordcount and estimated time on save (will not update if user changes their preference)

### Fixed
- closing modules without saving would produce errors
- editing a module when another module is open would not close the original module
- issue when saving modules that would cause other modules in that section to appear as duplications of the saved module

## 0.0.33 - 2018-07-10
### Changed
- minor updates to polls component
- chat on login screen only provides 'builder' tag

## 0.0.32 - 2018-07-03
### Added
- Archive menu item
- Archive and collaboration on OSermon menu
- OArchive page
- Outline and Idea previews
- Outline and Idea modules
- Poll component to notify users of polls and then display accpeted polls

### Changed
- content previews now work with the new module system

### Fixed
- some issues with structure in ocontent

## 0.0.31 - 2018-07-02
### Added
- restoreId updated when users start a support chat

## 0.0.30 - 2018-07-02
### Added
- can archive lessons/sermons
- support chat
- started Support page for submissions -- still needs work

### Changed
- pluralized lessons/sermons on OList
- added 'Pad' to scratch on OList

## 0.0.29 - 2018-06-30
MODULE OVERHAUL PT2

### Added
- methods for managing drags - adding and removing
- sections handle adding and removing of modules during moving
- handles for moving modules (now works with iPads)

### Changed
- module edit and close icons are now buttons
- RDevo, RGuide, RReview, OLesson, and OSermon all now use the new module system

### Fixed
- modules can now be dragged into empty sections

## 0.0.28 - 2018-06-29
MODULE OVERHAUL

### Added
- ContentEditor to replace ModuleList
- ModuleSection to allow for sections that hold modules
- Resources "drawer overlay" for the RGuide drawer -- will need to also add to RDevo and RReview
- Guide type selector on RGuide
- separate module for Activity, Prayer, and Repeated Thought
- AddSection component to add new sections with a title
- firebase plugin method for retrieving sectionModules

### Changed
- Updated modules to use new save method
- Autosave feature for Editor works better

## 0.0.27 - 2018-06-27
### Changed
- using "All" on NQList will clear out all other filters

### Fixed
- removed error thrown when going to a lesson's research page for the first time
- removed error thrown when reloading a sermon/lesson when logged in as an NQ user

## 0.0.26 - 2018-06-27
### Added
- methods in the firebase plugin to get the reference for guides and reviews
- RGuide and RReview drawers
- subtitles for pages related to RLesson (Guide, Review, Research)

### Removed
- resources from RDevo drawer -- needs to be a new custom component that combines resources from the parent lesson and from the devo itself

### Fixed
- when adding research with AddResearch, already added research topics no longer show up in the search list - should prevent duplicate topics
- devo modules should populate properly now from ModuleList

## 0.0.25 - 2018-06-26
### Added
- RResearch page
- menu item in RLesson to go to RResearch
- RResearch page shows currently added resources
- new resources can be added to a lesson throug the RResearch page
- the RResearch drawer now shows series title and main idea, Bible refs, and notes
- RGuide page
- RReview page
- button in NQList items for adding - shows only on boolean value
- init function to NQList to display items immediately after mounting
- ResearchList component for displaying currently added resources for RResearch

### Changed
- updated database plugin to handle new resource requirements - action and resource
- various graphical updates
- NQList now updates when item list is changed
- removed unnessasary commented code from various places
- NQList defaults to all types of media showing
- ResourcePreview add button only shows when addModule function is defined
- various updates to reflect the change in the database plugin

## 0.0.24 - 2018-06-20
### Added
- REAL lesson page with title and main idea
- shell for devo list inside lesson page
- devosRef and devoContent path for $firebase plugin
- DevoList shows devos for a lesson
- Lesson page properly displays devos w/ info
- RDevo page for editing devo content
    - works like OLesson or OSermon
    - module based
    - set passages are shown at the top of the modules
- drawers specific to the different REAL builder pages (series, lesson, research, devo) -- devo will be used for the guide and review pages
- firebase plugin methods for getting the devos ref and the devoContent ref

### Changed
- deleting lesson on Series page will also delete all devos associated with that lesson
- adding an RSeries now routes with the param "seriesid" instead of "id"
- adding a lesson to a series automatically generates a default structure for the 7 devos
- changed the names of various menu items

### Fixed
- fixed errors thrown when lesson has no bibleRefs in Lesson component
- missing Activity and Question module options when adding a new module

## 0.0.23 - 2018-05-22
### Added
- Google analytics plugin
- Google analytics events for
    - adding content
    - adding non-NQ media
    - adding modules
    - dragging/reordering modules
    - deleting modules
- users can now edit their info (name/email) in settings
- users can now change their password in settings
- users have to change password after first login
- REAL series now updates main idea on blur
- REAL series title can be edited through options menu

### Changed
- title is now required with new content
- media all have required fields when adding new
- logo on default layout works better on mobile devices

### Fixed
- hook/prayer modules don't crash
- hook/prayer module editors don't try to auto save after every character
- add media module modals (quite a mouthful) show up properly in sermons/lessons
- adding new sermon/lesson/scratch presents a properly capitalized type in the Nofity popup
- REAL series lessons can now be dragged properly

## 0.0.22 - 2018-05-21
### Added
- users can choose whether lessons/sermons default with hook/application/prayer
- new lessons/sermons follow user's prefs for hook/application/prayer
- options menu for lessons/sermons
- lessons/sermons can be previewed
- users can edit title of lesson/sermon/scratch
- spinner when uploading media
- spinner when changing bible module
- close button for multiple modals to accomodate mobile screens
- all but a single module dims when editing a module

### Changed
- bible modules now have properly colored input labels
- section modules now have properly colored input labels
- hid series seletor for sermons/lessons for now
- centered logo in toolbar
- removed left drawer toolbar button on desktops
- content and media lists and previews now show proper capitalization for type names
- disabled draggable on mobile
- certain fields are auto-selected when opening a module to edit

### Fixed
- videos now show up properly in sermons/lessons

## 0.0.21 - 2018-05-21
### Fixed
- application doesn't get stuck open any more after editing
- hook, application, and prayer subtitles appear properly
- the upload image box doesn't appear on all add media modals after uploading an image

## 0.0.20 - 2018-05-18
### Added
- unlinked temp page "AddUsers" for adding new users
- firebase.json for deploying to hosting

## 0.0.19 - 2018-05-16
### Changed
- updated the colors for icons in the modules
- tags and bibleRefs are now shown on items in OList
- Hook/Application/Prayer modules now have a save button
- module delete buttons changed to outlines

## 0.0.18 - 2018-04-24
### Changed
- resource drawer shows up for sermons and lessons

## 0.0.17 - 2018-04-17
### Added
- rseries works
- can add lessons to RSeries
- LessonList, AddLesson, and the module Lesson were all added for the RSeries to work properly

### Changed
- firebase plugin now removes the extra 's' when looking for series

### Known Issues
- draggable and reordering of lessons inside an RSeries doesn't work...

## 0.0.16 - 2018-04-16
### Added
- users can now change their preferences of content and media types in Settings
- users can now add media directly from the sermon/lesson page

### Changed
- moved all add module functionality to the AddModule component instead of the ModuleList component

## 0.0.15 - 2018-04-14
### Added
- small piece of code to App.vue to disable FastClick -- important for editores in pwas to work properly

## 0.0.14 - 2018-04-13
### Added
- setting for preferred Bible translation
- Bible module now has an option for translation
- OMedia to handle media lists that were being done in OList, just to add clarity

### Changed
- Quotes in Sermons/Lessons need to be edited from either the media drawer inside the sermon/lesson or from the media lists on the left menu -- this will be changed eventually
- Remove Bible Passage list from sermons/lessons - not sure that's exactly what is helpful when building a lesson/sermon
- all media now uses the osis form for BibleRefs
- tag chips for media are colored as primary
- bibleRef chips for media are colored as secondary 

## 0.0.13 - 2018-04-12
### Changed
- edited Bible module to match new server bible system

## 0.0.12 - 2018-04-11
### Added
- FilePond for uploading images
- FilePondImagePreview for previewing images to be uploaded
- Uploaded images are stored in Firebase Storage
- viewing/editing is now possible for all media
- non-NQ Quotes can now be added to lessons!
- masonry plugin

### Changed
- OList now generates download urls for uploaded images when listing them all -- all uploaded images will probably end up at the end of the list currently...
- swapped out vue-bricks components with v-masonry instead -- much faster and easier to use
- right drawer is always closed by default
- left drawer is always open by default
- right drawer shows a masonry layout with searching and filtering for non-NQ users
- right drawer media for non-NQ users uses the same modal as viewing/editing from the OList

### Removed
- vue-bricks

## 0.0.11 - 2018-04-10
### Added
- Settings page
- light and dark theme set by user preferences in Settings
- Scratch Pads for writing down notes or ideas that could be turned into a sermon or lesson in the future
- users can now add and list all media types (save uploaded images)
- media added is directly appended onto the list

### Changed
- changed point to module
- all modules are not draggable when editing any module
- menu icons are the default until hover or active when they become the primary color
- menu item backgrounds are inherited rather than changing for hover and active
- adding content, olist, others now use singular types instead of plurarl

### Fixed
- right drawer closes on refresh for non-NQ users

### Removed
- bible plugin, to reduce confusion (it wasn't functional)

## 0.0.10 - 2018-04-09
### Added
- get user db values from firebase plugin
- user value from firebase into root component (App) for access from all components
- menu option available for realUser to switch to REAL Curriculum builder
- small logo for menu item
- builder layout menu items for media types

### Changed
- setup tooltips for real layout
- OList now checks types from a list to determine whether the list should show content or media
- names and paths for dashboards changed to better reflect a readable url
- renamed MediaList to MediaSearch to better reflect what that component does
- MediaSearch setup to receive search terms and return matching media from the database, currently setup for only non-NQ media
- Resources shows components based on whether a NQ or non-NQ user
- right drawer does not open automatically when writing for a non-NQ user (might change for all users?)

### Fixed
- default route for non-NQ users switched to dashboard rather than odashboard

## 0.0.9 - 2018-04-08
### Added
- separate Dashboard pages for REAL and Other
- OSermon page (same as OLesson currently)
- can add OSermon
- OList displays list of sermons
- real layout to separate users
- routes that separate real and other pages and the logic to restrict real pages to only real users
- NQList component to separate calls for NQ research media and simple builder media

### Changed
- firebase saves modules in o/lessons/ rather than olesson/
- database bible call requires version
- MediaList component should be used for simple builder media - not NQ media
- left drawer has been condensed to icons with tooltips to save on realestate

### Fixed
- Resources component doesn't load unless on 'olesson' route

## 0.0.8 - 2018-04-06
### Added
- quotes, ideas, outlines, and illustrations can now be added as modules from the Resources drawer
- Quote module filled out
- OLesson info is updated on blur (main idea, bible refs, and tags)

### Changed
- changed edit function for modules to edit, save, and close in order to differentiate between all those functions
- added buttons in all module "editing views" for saving and deleting the modules

## 0.0.7 - 2018-04-06
### Added
- research function in database plugin
- research can now be added to or deleted from OLessons

## 0.0.6 - 2018-04-05
### Added
- resources option for database plugin
- resources for connected topics are now shown in OLessons
- AddResearch component for adding new topics to a lesson

### Changed
- right drawer only opens for OLessons
- left drawer closes on OLessons
- right drawer is now the proper size
- bricks layout for right drawer resources now functions properly

## 0.0.5 - 2018-04-05
### Added
- ModuleList and modules folder
- Point, Text, Question, Activity, Bible modules (full functioning)
- Quote, Video, Image, Composition modules (just shells)
- vuefire plugin
- wordcounts and estimated time are generated for each module on save
- collaboration is possible by locking modules being edited by others
- drag and drop for modules is implemented
- all module data is synced back to Firebase

### Changed
- updated README file
- OLesson now uses ModuleList

### Fixed
- AddMedia page now uses this.$database instead of this.database
- Login page and builder layout now use this.$firebase instead of this.firebase

## 0.0.4 - 2018-03-23
### Changed
- updated database plugin to use new database url

## 0.0.3 - 2018-03-21
### Added
- database plugin
- add functionality to database
- can add Lessons and Series to other
- OList for listing other series and lessons
- RList for listing REAL series (possibly lessons)
- played with Edtiors a bit
- adding BibleRefs to an olesson will present the passages

### Issues
- No idea how to get resources from NQ to here...

## 0.0.2 - 2018-03-20
### Added
- Login page
- Dashboard page
- Logout button on the builder sidebar
- firebase plugin - includes vuefire and vue-firestore
- vuelidate plugin
- REAL Curriculum logo

### Changed
- added Firebase authentication to router
- set dark theme

## 0.0.1 - 2018-03-19
### Added
- Initial commit
- New project