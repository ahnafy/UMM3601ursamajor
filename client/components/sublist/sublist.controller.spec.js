/**
* Created by saxxx027 on 11/10/14.
*/

'use strict';

describe('filter', function() {
    beforeEach(module('umm3601ursamajorApp'));

    describe('isntEmpty', function() {
        it('should return return the title and item ' +
            'if the item is an object with length over 0, not ' +
                'an object, but not "" or null, else altTitle',
          inject(function(isntEmptyFilter) {
              expect(isntEmptyFilter("item1", "First Item", "something else")).toBe("First Item item1");
              expect(isntEmptyFilter(21, "myNumber", "something else")).toBe("myNumber 21");
              expect(isntEmptyFilter(["happy", "days", "testing", "rocks"], "arrays", "something else")).toBe('arrays happy,days,testing,rocks');
              expect(isntEmptyFilter("", "something else", "this was an empty string")).toBe("this was an empty string");
          }));
    });


    describe('fancyLimitTo', function() {
        it('should return first "n" characters of the imputed text',
            inject(function(fancyLimitToFilter){
                expect(fancyLimitToFilter("abc", 1 )).toBe("a[...]");
                expect(fancyLimitToFilter("12345", 0)).toBe("[...]");
                expect(fancyLimitToFilter("", 5)).toBe("[...]");
            }));
    });


});

describe('Functions dealing with submissions...', function() {
    beforeEach(module('umm3601ursamajorApp'));
    beforeEach(module('socketMock'));
    beforeEach(module('authMock'));

    var SublistCtrl, scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        SublistCtrl = $controller('SublistCtrl', {
            $scope: scope
        });
    }));

    beforeEach(function(){
       scope.submissions = [
        {
            _id: "uniqueIdString",
            title: "A Study of the Properties of a Paperclip in the Digestive System of a Sloth",
            format: "Artist Statement",
            abstract: "Many physicists would agree that, had it not been for scatter/gather I/O, the study of link-level acknowledgements might never have occurred. " +
                "While such a claim might seem unexpected, it usually conflicts with the need to provide thin clients to hackers worldwide. " +
                "In fact, few security experts would disagree with the construction of kernels. In order to overcome this question, we construct an analysis of the Ethernet (Mollah)," +
                " which we use to prove that redundancy and replication can interfere to achieve this aim. ",
            presentationType: "Oral Presentation",
            formatChange: false,
            presenterInfo: {first: "Hongya", last: "Zhou", email: "zhoux616@morris.umn.edu"},
            copresenterOneInfo: {first: "Otto", last: "Marckel II", email: "marck018@morris.umn.edu"},
            copresenterTwoInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
            discipline: "Biology",
            sponsors: [], //Might need to worry about if this is static for the DB later.
            adviserInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
            coadviserOneInfo: {first: "Dalton", last: "Gusaas", email: "gusaa004@morris.umn.edu"},
            coadviserTwoInfo: {},
            featured: false,
            mediaServicesEquipment: "",
            specialRequirements: "a sloth",
            presenterTeeSize: "M",
            otherInfo: "Maybe",
            approval: false,
            status: {strict: "Awaiting Adviser Approval", text: "Your adviser has yet to approve this submission."},
            timestamp: "Mon Oct 20 2014 1:48:54 GMT-0500 (CDT)",
            group: 3,
            resubmissionData: {comment: "Initial Submission", parentSubmission: "testIdForTesting", isPrimary: false, resubmitFlag: false},
            comments: []
        }, {
           _id: "testIdForTesting",
           title: "Blind Construction: Mixed Media",
           format: "Artist Statement",
           abstract: "The basis of this project was to create a garment using mixed media in order to mimic the human body. " +
               "The materials we used to create this piece include: buckram, copper wire, spray paint, fabric paint, a variety of novelty fabrics, and chains.  " +
               "The techniques we created in order to manipulate the piece include: fabric branding and burning, grid painting, sewing, draping, molding buckram, and coiling.  " +
               "Our overall approach was to create a theatrical wearable art piece. " +
               "Upon completion of the assignment we found the piece aesthetically pleasing because of the way it molds to the human body, but can be a piece all on its own.",
           presentationType: "Performance",
           formatChange: false,
           presenterInfo: {first: "Jacob", last: "Opdahl", email: "opdah023@morris.umn.edu"},
           copresenterOneInfo: {first: "Savannah", last: "Farm", email: "farmx009@morris.umn.edu"},
           copresenterTwoInfo: {first: "Maggie", last: "Casale", email: "casal033@morris.umn.edu"},
           discipline: "Art History",
           sponsors: [],
           adviserInfo: {first: "Mark", last: "Lehet", email: "lehet005@morris.umn.edu"},
           featured: true,
           mediaServicesEquipment: "",
           specialRequirements: "A space to perform with three people.",
           presenterTeeSize: "M",
           otherInfo: "",
           approval: false,
           rejection: false,
           status: {strict: "Revisions Needed", text: "Your URS submission has been flagged for revisions, and is in need of changes."},
           timestamp: "Tue Oct 21 2014 23:22:54 GMT-0500 (CDT)",
           group: 1,
           resubmissionData: {comment: "Initial Submission", parentSubmission: "", isPrimary: true, resubmitFlag: false},
           comments:[]
        }
       ]
    });

    it('1 should equal 1...', function () {
        expect(1).toEqual(1);
    });

    describe('Functions controlling filtering...', function(){
        // Injecting the whole filter service here might be bad practice? IDK, but it works.
        it('Default review group filter should show ALL submissions...', inject(['$filter', function($filter) {
            expect($filter('filter')(scope.submissions, scope.reviewGroupFilter).length == scope.submissions.length).toEqual(true);
        }]));

        it('User with admin role should have admin privs.', inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.hasAdminPrivs()).toEqual(true);
        });

//        it('Should return true if featured is true, return false is featured is false', inject(['$filter', function(featurePresentationFilter) {
//            var $scope.filterData.featurePresentationFilterSelection = "";
//            scope.setFeaturePresentationFilterSelection("All");
//            expect(scope.featurePresentationFilter(scope.submissions[0]).toEqual(true);
////                expect(scope.featurePresentationFilter(scope.submissions[1])).toEqual(false);
//            }]));

        it("Submission's assigned review group members should be in same review group", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 3)}), function() {
            expect(scope.isReviewerGroup(scope.submissions[0])).toEqual(true);
        });

        it("Submission not in user's review group shouldn't be in user's review group", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function(){
            expect(scope.isReviewerGroup(scope.submissions[0])).toEqual(false);
        });

        describe('Functions controlling filter tabs...', function() {
            it('No filtered tabs should be selected by default...', function() {
                for(var key in scope.filterData.tabFilter){
                    if(scope.filterData.tabFilter.hasOwnProperty(key)){
                        expect(scope.filterData.tabFilter[key]).toEqual(false);
                    }
                }
            });

            it('showMySubmissions should set the isPresenter tab to true', function() {
                scope.showMySubmissions();
                expect(scope.filterData.tabFilter.isPresenter).toEqual(true);
            });

            //TODO: more of these need to be written? Functions might need to be refactored to be more testable...
        });


    });

    describe("Functions controlling the selecting...", function() {
        it("No submission should be selected by default", function() {
            expect(scope.selection.selected).toEqual(false);
            expect(scope.selection.selected.item).toEqual(null);
            expect(scope.selection.selected.resubmission).toEqual(null);
        });

        it("selectItem() should set submission as selected", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            scope.selectItem(1);
            expect(scope.selection.selected).toEqual(true);
            expect(scope.selection.item != null).toEqual(true);
            expect(scope.selection.item._id).toBe("testIdForTesting");
        });

        it("selectItem() should find resubmission of selected submission", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            scope.selectItem(1);
            expect(scope.selection.resubmission != null).toEqual(true);
            expect(scope.selection.resubmission._id).toBe("uniqueIdString");
        });

        it("Selecting when filters are applied should select the correct submission (review group filter)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
           expect(scope.selection.item).toEqual(null);
           scope.filterData.reviewGroupFilterSelection = "Review Group 1";
           scope.selectItem(0);
           expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select correct submission (tab filters)", inject(function(Auth){Auth.setCurrentUser("opdah023@morris.umn.edu", "admin", 1)}), function() {
           expect(scope.selection.item).toEqual(null);
           scope.filterData.tabFilter.isPresenter = true;
           scope.selectItem(0);
           expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (feature presentation)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.featurePresentationFilterSelection = "Wants to be featured";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (flagged for resubmission)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.flaggedForResubmitFilterSelection = "Not Flagged";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });

        it("Selecting when filters are applied should select the correct submission (pending resubmissions)", inject(function(Auth){Auth.setCurrentUser("admin@admin.com", "admin", 1)}), function() {
            expect(scope.selection.item).toEqual(null);
            scope.filterData.pendingResubmissionsOptions = "Not Pending Resubmissions";
            scope.selectItem(0);
            expect(scope.selection.item.title).toBe("Blind Construction: Mixed Media");
        });



    });

    describe('Functions handling resubmissions...', function() {
        it('Should be a resubmission... ', function() {
            expect(scope.isResubmission(scope.submissions[0])).toEqual(true);
        });

        it('Should find the resubmission of a submission', function() {
            expect(scope.getResubmission(scope.submissions[1]) != null).toEqual(true);
            expect(scope.getResubmission(scope.submissions[1])._id).toBe("uniqueIdString");
        })
    });

    describe('Functions handling approve/reject button...', function() {
//        it('should be a approval...', function () {
//            expect();
//        });

        it('rejection should be false...', function (){
            expect(scope.submissions[1].rejection).toEqual(false);
        });



//        it('should be a rejection...', function (){
//           scope.rejectSubmission(scope.submissions[1]);
//           expect(scope.submissions[1].rejection).toEqual(true);
//        });

    });

//    describe('Testing the that the additional advisers are indeed in a submission...', function {
//       it('coadviserOneInfo for submission 1 [1] should be Dalton Gusaas...', function() {
//            expect(scope.submissions[0].coadviserOneInfo).toEqual("")
//       });
//    });



});