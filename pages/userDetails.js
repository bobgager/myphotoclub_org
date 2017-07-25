/**
 * Created by bgager on 5/25/17.
 */

var userDetailsPage = {

    //******************************************************************************************************************
    render: function (userID) {

        jPM.close();

        globals.currentPage = 'userDetailsPage';


        $('#content').hide().load("pages/userDetails.html?version="+ globals.version, function() {

            //utils.writeDebug('userDetails Page loaded',false);

            //find the index of the member in the memberList array

            //var index = Data.map(function(e) { return e.name; }).indexOf('Nick');
            var index = globals.memberList.map(function(e) { return e.userID; }).indexOf(userID);

            userDetailsPage.fillMemberDetails(globals.memberList[index]);

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


        //fill in the member's Role
        $('#memberRoleLabel').html(member.role);

    },

    //******************************************************************************************************************
    userInfoComplete: function () {

        //for now, there are no additional user parameters required that we don't collect at account creation
        //so, just return true
        //if later we add additional required parameters, then return false

        return (true);
    }

    //******************************************************************************************************************
    //******************************************************************************************************************
};