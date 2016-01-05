angular.module("proton.controllers.Conversation", ["proton.constants"])

.controller("ConversationController", function(
    $log,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $q,
    action,
    authentication,
    cache,
    CONSTANTS,
    conversation,
    Conversation,
    networkActivityTracker,
    notify,
    tools
) {
    $scope.mailbox = tools.currentMailbox();
    $scope.labels = authentication.user.Labels;
    $scope.currentState = $state.$current.name;
    $rootScope.draftOpen = false;
    $scope.scrolled = false;
    $scope.conversation = conversation;

    // Listeners
    $scope.$on('refreshConversation', function(event) {
        var conversation = cache.getConversationCached($stateParams.id);
        var messages = cache.queryMessagesCached($stateParams.id);
        var loc = tools.currentLocation();

        messages = messages.reverse();  // We reverse the array because the new message appear to the bottom of the list

        if(angular.isDefined(conversation)) {
            var labels = conversation.LabelIDs;

            labels.push(CONSTANTS.MAILBOX_IDENTIFIERS.search); // tricks

            if(labels.indexOf(loc) !== -1) {
                _.extend($scope.conversation, conversation);
            } else {
                return $scope.back();
            }
        } else {
            return $scope.back();
        }

        if(angular.isDefined(messages)) {
            _.each(messages, function(message) {
                var current = _.findWhere($scope.messages, {ID: message.ID});
                var index = $rootScope.discarded.indexOf(message.ID); // Check if the message is not discarded

                if(angular.isUndefined(current) && index === -1) {
                    // Add message
                    $scope.messages.push(message);
                }
            });

            _.each($scope.messages, function(message) {
                var current = _.findWhere(messages, {ID: message.ID});

                if(angular.isUndefined(current)) {
                    var index = $scope.messages.indexOf(current);
                    // Delete message
                    $scope.messages.splice(index, 1);
                }
            });

            if($scope.messages.length === 0) {
                $scope.back();
            }
        } else {
            $scope.back();
        }
    });

    $scope.$on('$destroy', function(event) {
        delete $rootScope.targetID;
    });

    $scope.$on('targetLoaded', function(event) {
        if ($scope.scrolled === false) {
            $scope.scrolled = true;
            $scope.scrollToMessage($rootScope.targetID); // Scroll to the target
        }
    });

    /**
     * Method call at the initialization of this controller
     */
    $scope.initialization = function() {
        var loc = tools.currentLocation();

        if(angular.isDefined(conversation)) {
            var labels = conversation.LabelIDs;

            labels.push(CONSTANTS.MAILBOX_IDENTIFIERS.search); // tricks

            if(labels.indexOf(loc) !== -1) {
                var messages = cache.queryMessagesCached($scope.conversation.ID).reverse(); // We reverse the array because the new message appear to the bottom of the list
                var latest = _.last(messages);

                if($state.is('secured.sent.view')) { // If we open a conversation in the sent folder
                    var sents = _.where(messages, { AddressID: authentication.user.Addresses[0].ID });

                    if(sents.length > 0) {
                        // We try to open the last sent message
                        $rootScope.targetID = _.last(sents).ID;
                    } else {
                        // Or the last message
                        $rootScope.targetID = _.last(messages).ID;
                    }
                } else if(angular.isDefined($rootScope.targetID)) {
                    // Do nothing, target initialized by click
                } else {
                    // If the latest message is unread, we open it
                    if(latest.IsRead === 0) {
                        latest.open = true;
                        $rootScope.targetID = latest.ID;
                    } else {
                        // Else we open the first message unread beginning to the end list
                        var loop = true;
                        var latestIndex = messages.indexOf(latest);
                        var index = latestIndex;

                        while(loop === true && index > 0) {
                            if(angular.isDefined(messages[(index - 1)]) && messages[(index - 1)].IsRead === 1) {
                                index--;
                            } else {
                                loop = false;
                                index--;
                            }
                        }
                        if (loop === true) {
                            index = latestIndex;
                        }

                        $rootScope.targetID = messages[index].ID;
                    }
                }

                $scope.messages = messages;
            } else {
                $scope.back();
            }
        } else {
            $scope.back();
        }

    };

    /**
     * Back to conversation / message list
     */
    $scope.back = function() {
        $state.go("secured." + $scope.mailbox, {
            id: null // remove ID
        });
    };

    /**
     * Return messages data for dropdown labels
     */
    $scope.getMessages = function() {
        return $scope.messages;
    };

    /**
     * Mark current conversation as read
     * @param {Boolean} back
     */
    $scope.read = function() {
        var ids = [$scope.conversation.ID];

        action.readConversation(ids);
    };

    /**
     * Mark current conversation as unread
     */
    $scope.unread = function() {
        var ids = [$scope.conversation.ID];

        action.unreadConversation(ids);
    };

    /**
     * Delete current conversation
     */
    $scope.delete = function() {
        var ids = [$scope.conversation.ID];

        action.deleteConversation(ids);
    };

    /**
     * Move current conversation to a specific location
     */
    $scope.move = function(mailbox) {
        var ids = [$scope.conversation.ID];

        action.moveConversation(ids, mailbox);
    };

    /**
     * Apply labels for the current conversation
     * @return {Promise}
     */
    $scope.saveLabels = function(labels, alsoArchive) {
        var ids = [$scope.conversation.ID];

        action.labelConversation(ids, labels, alsoArchive);
    };

    /**
     * Scroll to the message specified
     * @param {String} ID
     */
    $scope.scrollToMessage = function(ID) {
        $timeout.cancel($rootScope.scroll);
        var index = _.findIndex($scope.messages, {ID: ID});
        var id = '#message' + index; // TODO improve it for the search case

        $rootScope.scroll = $timeout(function() {
            var element = angular.element(id);

            if(angular.isElement(element) && angular.isDefined(element.offset())) {
                var headerOffset = $('#conversationHeader').offset().top + $('#conversationHeader').height();
                var value = element.offset().top - headerOffset;

                $('#pm_thread').animate({
                    scrollTop: value
                }, 250, function() {
                    $(this).animate({
                        opacity: 1
                    }, 200);
                });
            }
        }, 100);
    };

    /**
     * Toggle star status for current conversation
     */
     $scope.toggleStar = function() {
        if($scope.starred() === true) {
            $scope.unstar();
        } else {
            $scope.star();
        }
     };

    /**
     * Star the current conversation
     */
    $scope.star = function() {
        action.starConversation($scope.conversation.ID);
    };

    /**
     * Unstar the current conversation
     */
    $scope.unstar = function() {
        action.unstarConversation($scope.conversation.ID);
    };

    /**
     * Return status of the star conversation
     * @return {Boolean}
     */
    $scope.starred = function() {
        return $scope.conversation.LabelIDs.indexOf(CONSTANTS.MAILBOX_IDENTIFIERS.starred) !== -1;
    };

    /**
     * Go to the next conversation
     */
    $scope.next = function() {
        var current = $state.$current.name;

        cache.more($scope.conversation, 'next').then(function(id) {
            // $state.go(current, {id: id});
        });
    };

    /**
     * Go to the previous conversation
     */
    $scope.previous = function() {
        var current = $state.$current.name;

        cache.more($scope.conversation, 'previous').then(function(id) {
            // $state.go(current, {id: id});
        });
    };

    // Call initialization
    $scope.initialization();
});
