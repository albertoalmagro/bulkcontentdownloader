/*global angular: false */

angular.module('BulkContentDownloader.notifications', []).factory('NotificationsService', ['$timeout', function ($timeout) {
    return {
        data: {
            timeout: 20 * 1000,
            notifications: [],
            running: {
                visible: false,
                title: 'The process is executing',
                message: 'Please be patient while the process executes.'
            }
        },

        init: function (title, message) {
            this.data.running.title = title;
            this.data.running.message = message;
        },

        running: function (visible) {
            if (visible !== undefined) {
                this.data.running.visible = visible;
            } else {
                this.data.running.visible = !this.data.running.visible;
            }

            return this.data.running.visible;
        },

        isRunning: function() {
            return this.data.running.visible;
        },

        add: function (type, title, message) {
            var self = this,
                notification = {
                type: type || 'info',
                title: title,
                message: message,
                timestamp: (new Date().getTime() / 1000)
            };

            if (notification.title) {
                // Add notification
                this.data.notifications.unshift(notification);

                // Remove notification when the time is right
                $timeout(function () {
                    var index = self.data.notifications.indexOf(notification);

                    if (index > -1) {
                        self.data.notifications.splice(index, 1);
                    }
                }, this.data.timeout);
            }
        }
    };
}]).directive('notifications', ['NotificationsService', function (NotificationsService) {
    return {
        restrict: 'E',
        scope: {
            size: '@size',
            dismissible: '@dismissible'
        },
        template: '<div ng-show="data.notifications.length > 0 || data.running.visible"' +
        ' class="notifications">'
        + '<div ng-show="data.running.visible" class="alert notice large running">'
        + '<strong>{{ data.running.title }}</strong>'
        + '<div>{{ data.running.message }}</div>'
        + '</div>'


        + '<div ng-repeat="notification in data.notifications">'
        + '<div class="alert {{ notification.type }} {{ size }}">'
        + '<button ng-hide="dismissible === \'false\'" class="close"'
        + ' data-dismiss="alert">&times;</button>'
        + '<strong>{{ notification.title }}</strong>'
        + '<div>{{ notification.message }}</div>'
        + '</div>'
        + '</div>'
        + '</div>',
        replace: true,
        link: function(scope, element, attrs) {
            scope.data = NotificationsService.data;
        }
    };
}]);