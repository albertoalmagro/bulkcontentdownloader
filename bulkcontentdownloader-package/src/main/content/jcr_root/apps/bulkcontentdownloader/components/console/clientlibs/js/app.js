/*global angular: false */

angular.module('bulkcontentdownloader-app', ['BulkContentDownloader.notifications']).controller('MainCtrl',
    [ '$scope', '$http', '$timeout', '$interval', 'NotificationsService',
        function ($scope, $http, $timeout, $interval, NotificationsService) {

    $scope.rcp_uris = ['/system/jackrabbit/filevault/rcp', '/libs/granite/packaging/rcp'];

    $scope.task_src = 'http://admin:admin@localhost:4502/crx/server/-/jcr:root/content/dam/my-site';

    $scope.task_dst = '/content/dam/my-site';

    $scope.task_batchSize = '1024';

    $scope.task_throttle = '';

    $scope.checkboxModel = {
        recursive: false,
        update: false,
        onlyNewer: false,
        noOrdering: false,
        autoRefresh: false
    };

    $scope.app = {
        uri: '/system/jackrabbit/filevault/rcp',
        running: false
    };

    $scope.tasks = [];

    $scope.excludes = [];

    $scope.vltMissing = true;

    /*
     * Loads the tasks
     */
    $scope.init = function (rcpUris) {

        $scope.rcp_uris = rcpUris || $scope.rcp_uris;

        angular.forEach($scope.rcp_uris, function (uri) {

            $http.get(uri,
                {
                    params: {ck: (new Date()).getTime()}
                }
            ).success(function (data, status, headers, config) {
                    if (status === 200) {
                        if ($scope.vltMissing) {
                            // Only set the app.uri if a valid end point has not been found
                            $scope.app.uri = uri;
                            $scope.vltMissing = false;
                            $scope.tasks = data.tasks || [];
                        }
                    }
                });
        });
    };

    $scope.refresh = function () {
        $http.get($scope.app.uri,
            {
                params: {ck: (new Date()).getTime()}
            }
        ).
            success(function (data, status, headers, config) {
                $scope.tasks = data.tasks || [];
            })
            .error(function (data, status, headers, config) {
                NotificationsService.add('error', 'ERROR', 'Could not refresh tasks');
            });
    };

    /*
     * Start task
     */
    $scope.start = function (task) {
        var cmd = {
            "cmd": "start",
            "id": task.id
        };

        $http.post($scope.app.uri, cmd).
            success(function (data, status, headers, config) {
                NotificationsService.add('info', 'INFO', 'Task ' + task.id + ' started.');
                $scope.refresh();
            }).
            error(function (data, status, headers, config) {
                NotificationsService.add('error', 'ERROR', 'Could not retrieve tasks');
            });
    };

    /*
     * Stop task
     */
    $scope.stop = function (task) {
        var cmd = {
            "cmd": "stop",
            "id": task.id
        };

        $http.post($scope.app.uri, cmd).
            success(function (data, status, headers, config) {
                NotificationsService.add('info', 'INFO', 'Task ' + task.id + ' stopped.');
                $scope.refresh();
            }).
            error(function (data, status, headers, config) {
                NotificationsService.add('error', 'ERROR', 'Could not retrieve tasks');
            });
    };

    /*
     * Remove task
     */
    $scope.remove = function (task) {
        var cmd = {
            "cmd": "remove",
            "id": task.id
        };

        $http.post($scope.app.uri, cmd).
            success(function (data, status, headers, config) {
                NotificationsService.add('info', 'INFO', 'Task ' + task.id + ' removed.');
                $scope.refresh();
            }).
            error(function (data, status, headers, config) {
                NotificationsService.add('error', 'ERROR', 'Could not retrieve tasks');
            });
    };

    $scope.create = function () {
        var i = 0,
            excludes = [],
            cmd = {
                "cmd": "create",
                "id": $scope.task_id,
                "src": $scope.task_src,
                "dst": $scope.task_dst,
                "batchsize": $scope.task_batchSize || 1024,
                "update": $scope.checkboxModel.update,
                "onlyNewer": $scope.checkboxModel.onlyNewer,
                "recursive": $scope.checkboxModel.recursive,
                "noOrdering": $scope.checkboxModel.noOrdering,
                "throttle": $scope.task_throttle || 0
            };

        if ($scope.task_resumeFrom !== "") {
            cmd.resumeFrom = $scope.task_resumeFrom;
        }

        if ($scope.excludes.length > 0) {
            for (; i < $scope.excludes.length; i++) {
                excludes.push($scope.excludes[i].value);
            }
            cmd.excludes = excludes;
        }

        $http.post($scope.app.uri, cmd).
            success(function (data, status, headers, config) {
                NotificationsService.add('info', 'INFO', 'Task created.');

                $scope.refresh();
                angular.element('#create-new-task-modal').modal('hide');
                $scope.reset();
            }).
            error(function (data, status, headers, config) {
                NotificationsService.add('error', 'ERROR', data.message);
            });
    };


    $scope.reset = function() {
        var taskSrc = 'http://admin:admin@localhost:4502/crx/server/-/jcr:root/content/dam/my-site',
            taskDst = '/content/dam/my-site',
            taskBatchSize = '1024',
            taskThrottle = '',
            checkboxModel = {
                recursive: false,
                update: false,
                onlyNewer: false,
                noOrdering: false,
                autoRefresh: false
            };

        $scope.task_id = '';
        $scope.task_src = taskSrc;
        $scope.task_dst = taskDst;
        $scope.task_batchSize = taskBatchSize;
        $scope.task_throttle = taskThrottle;
        $scope.checkboxModel = checkboxModel;
        $scope.excludes = [];
    };

    $scope.addExclude = function () {
        $scope.excludes.push({value: ""});
    };

    $scope.removeExclude = function (index) {
        $scope.excludes.splice(index, 1);
    };

    $interval(function () {
        if ($scope.checkboxModel.autoRefresh) {
            $scope.refresh();
        }
    }, 5000);

}]);
