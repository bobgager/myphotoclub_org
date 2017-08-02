/**
 * Created by bgager on 5/25/17.
 */


var userDetailsPage = {

    memberIndex: null,
    member: null,

    //******************************************************************************************************************
    render: function (userID) {

        jPM.close();

        globals.currentPage = 'userDetailsPage';

        //load the subNav bar
        $('#subNavBar').hide().load("pages/userDetails_subNav.html?version=" + globals.version, function() {
            //set the visibility of the buttons
            $('#editMemberBTN').show();
            $('#saveChangesBTN').hide();
            $('#cancelChangesBTN').hide();
        }).fadeIn('1000');


        $('#content').hide().load("pages/userDetails.html?version="+ globals.version, function() {

            //utils.writeDebug('userDetails Page loaded',false);

            //find the index of the member in the memberList array

            //var index = Data.map(function(e) { return e.name; }).indexOf('Nick');
            userDetailsPage.memberIndex = globals.memberList.map(function(e) { return e.userID; }).indexOf(userID);

            //make a deep copy of the member and store it locally
            userDetailsPage.member = jQuery.extend(true, {}, globals.memberList[userDetailsPage.memberIndex]);

            userDetailsPage.fillMemberDetails(userDetailsPage.member);

        }).fadeIn('5000');

    },

    //******************************************************************************************************************
    fillMemberDetails: function (member) {

        //fill in the header information
        $('#firstNameHeader').html(member.firstName);
        $('#lastNameHeader').html(member.lastName);

        //fill in the member's profile image
        var profileImage = member.avatar.substring(15);
        $("#memberProfileImage").attr("src","assets/img/team/" + profileImage);

        //fill in member's address
        $('#memberStreetLabel').html(member.street);
        $('#memberCityLabel').html(member.city);
        $('#memberStateLabel').html(member.st);
        $('#memberZipLabel').html(member.zip);

        //and their phone number
        $('#memberPhoneLabel').html(member.phone);

        //and their email
        $('#memberEmailLabel').html(member.userEmail);

        //and their portfolio link

        $("#memberPortfolioLabel").attr("href", 'http://'+ member.portfolioURL);
        $('#memberPortfolioLabelText').html(member.portfolioURL);


        //fill in the member's Status
        $('#memberStatusLabel').html(member.memberStatus);

        //fill in the member's Role
        $('#memberRoleLabel').html('<span class="text-primary-darkend">Member Type: </span>' + member.role);

    },

    //******************************************************************************************************************
    userInfoComplete: function () {

        //this function is called after the user logs in to make sure we have all the required information about them

        //for now, there are no additional user parameters required that we don't collect at account creation
        //so, just return true
        //if later we add additional required parameters, then return false

        return (true);
    },

    //******************************************************************************************************************
    editMember: function () {
        $('#editMemberBTN').hide();
        $('#saveChangesBTN').show();
        $('#cancelChangesBTN').show();



        $('#memberAddressP').replaceWith(function(){

            var newElement = '' +
                '<div class="row no-gutters">' +
                    '<div class="col-9">' +
                        '<input id="memberStreetInput" type="text" class="form-control" placeholder="Street" value="' + userDetailsPage.member.street + '">' +
                    '</div>' +
                '</div>' +
                '<div class="row no-gutters">' +
                    '<div class="col-4">' +
                        '<input id="memberCityInput" type="text" class="form-control" placeholder="City" value="' + userDetailsPage.member.city + '">' +
                    '</div>' +
                    '<div class="col-2">' +
                        '<input id="memberStInput" type="text" class="form-control" placeholder="State" value="' + userDetailsPage.member.st + '">' +
                    '</div>' +
                    '<div class="col-3">' +
                        '<input id="memberZipInput" type="text" class="form-control" placeholder="Zip" value="' + userDetailsPage.member.zip + '">' +
                    '</div>' +
                '</div>' ;


            return newElement ;
        });

        $('#memberPhoneP').replaceWith(function(){

            var newElement = '' +
                '<div class="row no-gutters">' +
                    '<div class="col-9">' +
                        '<input id="memberPhoneInput" type="text" class="form-control" placeholder="Phone" value="' + userDetailsPage.member.phone + '">' +
                    '</div>' +
                '</div>' ;


            return newElement ;
        });

        $('#memberEmailP').replaceWith(function(){

            var newElement = '' +
                '<div class="row no-gutters">' +
                    '<div class="col-9">' +
                        '<input id="memberEmailInput" type="text" class="form-control" placeholder="Email" value="' + userDetailsPage.member.userEmail + '">' +
                    '</div>' +
                '</div>' ;


            return newElement ;
        });

        $('#memberPortfolioLabel').replaceWith(function(){

            var newElement = '' +
                '<div class="row no-gutters">' +
                    '<div class="col-9">' +
                        '<input id="memberPortfolioInput" type="text" class="form-control" placeholder="Portfolio URL" value="' + userDetailsPage.member.portfolioURL + '">' +
                    '</div>' +
                '</div>' ;


            return newElement ;
        });

        $('#memberStatusLabel').replaceWith(function(){

            var newElement = '' +
                '<div id="memberStatusDropdown" class="dropdown">' +
                    '<button id="memberStatusDropdownBTN" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        globals.memberList[userDetailsPage.memberIndex].memberStatus +
                    '</button>' +
                    '<div class="dropdown-menu" aria-labelledby="memberStatusDropdownBTN">' +
                        '<a class="dropdown-item" href="#" onclick="userDetailsPage.setMemberStatus(&#39;Invited&#39;)" >Invited</a>' +
                        '<a class="dropdown-item" href="#" onclick="userDetailsPage.setMemberStatus(&#39;Active&#39;)" >Active</a>' +
                        '<a class="dropdown-item" href="#" onclick="userDetailsPage.setMemberStatus(&#39;Inactive&#39;)" >Inactive</a>' +
                    '</div>' +
                '</div>';


            return newElement ;
        })


    },

    setMemberStatus: function (memberStatus) {
        userDetailsPage.member.memberStatus = memberStatus;
        $('#memberStatusDropdownBTN').html(memberStatus);
    },

    //******************************************************************************************************************
    saveChanges: function () {
        $('#editMemberBTN').show();
        $('#saveChangesBTN').hide();
        $('#cancelChangesBTN').hide();

        userDetailsPage.member.street = $('#memberStreetInput').val();
        userDetailsPage.member.city = $('#memberCityInput').val();
        userDetailsPage.member.st = $('#memberStInput').val();
        userDetailsPage.member.zip = $('#memberZipInput').val();

        userDetailsPage.member.phone = $('#memberPhoneInput').val();

        userDetailsPage.member.userEmail = $('#memberEmailInput').val();

        userDetailsPage.member.portfolioURL = $('#memberPortfolioInput').val();

        //save the changes locally (deep copy)
        globals.memberList[userDetailsPage.memberIndex] = jQuery.extend(true, {}, userDetailsPage.member);

        //save changes to cloud and then re-render this page
        awsDynamoDBConnector.updateMember(userDetailsPage.member, userDetailsPage.memberUpdated );

    },

    //******************************************************************************************************************
    memberUpdated: function (success, data) {

        if (!success){
            //something went wrong with the update
            console.log(data);
        }

        userDetailsPage.render(userDetailsPage.member.userID);
    },

    //******************************************************************************************************************
    cancelChanges: function () {
        userDetailsPage.render(userDetailsPage.member.userID);
    }

    //******************************************************************************************************************
    //******************************************************************************************************************
};