'use strict';

(function() {

    angular
        .module('simpleArmoryApp')
        .controller('AdminCtrl', AdminCtrl);

    function AdminCtrl($scope, AdminService, $routeParams, $window) {

        // Analytics for page
        $window.ga('send', 'pageview', 'Admin');

        // TODO: change download url to be based on file we're working on
        $scope.downloadFile = 'mounts.json';

        // TODO: don't show save button unless we've made a change

        AdminService.getMountData().then(function(data){
            // store the data in the scope so that we can build out forms from it
            var categories = [];
            for(var i=0; i<data.length; i++) {
                var cat = data[i];
                var name = cat.name;
                categories.push(cat);
            }

            $scope.categories = categories;
            $scope.selectedCat = $scope.categories[0];

            $scope.selectionChanged();
        });

        $scope.saveClicked = function() {
            // NOTE: There is probably an easier way todo this, but I'm using 2 anchors, one to trigger refresh of data
            // and a 2nd to actually download that data

            // trigger hidden link
            var anchor = document.getElementById('downloadLink');
            anchor.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson($scope.categories, 2));
            anchor.click()
        }

        $scope.selectionChanged = function() {
            var cat =  $scope.selectedCat;
            var subcat = $scope.selectedSubCat;

            // reset any selected indexes if we've done modifications
            if (cat === null) {
                $scope.selectedCat = cat = $scope.categories[0];
            }

            if (subcat === undefined || 
                cat.subcats.indexOf(subcat) === -1) {
                $scope.selectedSubCat = subcat = cat.subcats[0];
            }

            // enable and disable up/down arrows it we're at the boundaries
            $scope.catUpDisabled = $scope.categories.indexOf(cat) == 0;
            $scope.catDownDisabled = $scope.categories.indexOf(cat) == $scope.categories.length - 1;

            $scope.subCatUpDisabled = cat.subcats.indexOf(subcat) === 0;
            $scope.subCatDownDisabled = cat.subcats.indexOf(subcat) === cat.subcats.length - 1;
        }

        $scope.move = function(up, item, array) {
            var src = array.indexOf(item);
            var dest = up ? src - 1 : src + 1;

            array[src] = array[dest];
            array[dest] = item;

            $scope.selectionChanged();
        }

        /* ## Category ############################################################################### */

        $scope.addCategory = function() {
            var newCategory = prompt('Category to add:');
            if (newCategory != '') {
                var catObj = { name: newCategory, subcats: [] }
                $scope.categories.push(catObj);
            }

            $scope.selectionChanged();
        }

        $scope.removeCategory = function() {
            $scope.categories = $scope.categories.filter(function(category){
                return category != $scope.selectedCat;
            });

            $scope.selectionChanged();
        }

        /* ## Sub Category ############################################################################### */

        $scope.removeSubCategory = function() {
            $scope.selectedCat.subcats = $scope.selectedCat.subcats.filter(function(sub){
                return sub != $scope.selectedSubCat;
            });

            $scope.selectionChanged();
        }

        $scope.addSubCategory = function() {
             var newCat = prompt('Sub Category to add:');
             if (newCat != '') {
                 var catObj = { name: newCat, items: [] };
                 $scope.selectedCat.subcats.push(catObj);
             }

             $scope.selectionChanged();
        }
    }

})();