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
        $('#memberStateLabel').html(member.state);
        $('#memberZipLabel').html(member.zip);

        //and their phone number
        $('#memberPhoneLabel').html(member.phone);

        //and their email
        $('#memberEmailLabel').html(member.userEmail);

        //and their portfolio link

        $("#memberPortfolioLabel").attr("href", 'http://'+ member.portfolioURL);
        $('#memberPortfolioLabelText').html(member.portfolioURL);


        //fill in the member's Status
        $('#memberStatusLabel').html(member.status);

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


        $('#memberStatusLabel').replaceWith(function(){

            var newElement = '' +
                '<div id="memberStatusDropdown" class="dropdown">' +
                    '<button id="memberStatusDropdownBTN" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        globals.memberList[userDetailsPage.memberIndex].status +
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

    setMemberStatus: function (status) {
        userDetailsPage.member.status = status;
        $('#memberStatusDropdownBTN').html(status);
    },

    //******************************************************************************************************************
    saveChanges: function () {
        $('#editMemberBTN').show();
        $('#saveChangesBTN').hide();
        $('#cancelChangesBTN').hide();
    },

    //******************************************************************************************************************
    cancelChanges: function () {
        userDetailsPage.render(userDetailsPage.member.userID);
    }

    //******************************************************************************************************************
    //******************************************************************************************************************
};