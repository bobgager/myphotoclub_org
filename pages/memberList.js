/**
 * Created by bgager on 5/25/17.
 */


var memberListPage = {

    //******************************************************************************************************************
    render: function () {

        jPM.close();

        globals.currentPage = 'memberListPage';

        //load the subNav bar
        $('#subNavBar').hide().load("pages/empty_subNav.html", function() {
            //nothing to do after it's loaded
        }).fadeIn('1000');


        $('#content').hide().load("pages/memberList.html?version="+ globals.version, function() {

            //utils.writeDebug('memberList Page loaded',false);
            awsDynamoDBConnector.fetchOldMemberList(memberListPage.memberListReturned);

        }).fadeIn('1000');

    },

    //******************************************************************************************************************
    memberListReturned: function (success, data) {

        if(!success){
            console.log('error retreiving member list: ');
            console.log(data)
            return;
        }

        //console.log('got the member list back')

        //save the Member List so we can use it elsewhere
        globals.memberList = data;

        //build the members list UI


        $('#userList').fadeOut(1);

        var userListHTML = '';

        data.forEach(function (user, index) {

            if (!user.memberStatus){
                user.memberStatus = 'Unknown';
            }
            if (!user.role){
                user.role = 'Standard';
            }

            user.profileImage = user.avatar.substring(15);

            userListHTML += '' +
                '<div class="team-member">' +
                    '<div class="row">' +
                        '<div class="col-sm-2">' +
                            '<a href="#" title="View ' + user.firstName + '&#39;s profile" onclick="userDetailsPage.render(&#39;' + user.userID + '&#39;)">' +
                                '<img src="assets/img/team/'+ user.profileImage +'" class="img-thumbnail" alt="'+ user.firstName +'" />' +
                            '</a>' +
                        '</div>' +
                        '<div class="col-sm-10">' +

                            '<h4 class="name">' +
                                '<a href="#" title="View ' + user.firstName + '&#39;s profile" onclick="userDetailsPage.render(&#39;' + user.userID + '&#39;)">'+ user.firstName + ' ' + user.lastName +'</a>' +
                            '</h4>' +

                            '<p class="role">' + user.role + '</p>' +

                            '<p class="mb-0"><i class="fa fa-map-marker"></i> '+ user.street + ', ' + user.city + ', ' +  user.st+ ' ' +  user.zip + '</p>' +

                            '<p class="mb-0"><i class="fa fa-phone"></i> '+ user.phone + '</p>' +

                            '<p class="mb-2"><i class="fa fa-envelope"></i> ' + user.userEmail + '</p>' +

                            '<a href="http://'+ user.portfolioURL +'" target="_blank"><i class="fa fa-globe"></i> '+ user.portfolioURL +'</a>' +

                            '<p class="mt-2">' + user.memberStatus + '</p>' ;

                            if (user.memberStatus === 'Invited'){
                                userListHTML += '<button class="btn btn-sm btn-outline-primary" type="button" onclick=" adminUsersPage.invitedUserEmail = &#39;' + user.email + '&#39;; adminUsersPage.inviteGUID = &#39;' + user.userGUID + '&#39;; adminUsersPage.sendInvitationEmail(&#39;' + user.email + '&#39;)" ><i class="fa fa-send-o" aria-hidden="true"></i> Resend Invitation </button>';

                            }

                    userListHTML +='' +

                        '</div>' +
                    '</div>' +
                '</div>'

        });

        if (userListHTML === ''){
            userListHTML = "You don't have any Team Members yet. <br>Click the Add Team Member button above to add your first Team Member."
        }

        $('#userList').html(userListHTML);

        $('#userList').fadeIn(3000);





    }

    //******************************************************************************************************************
    //******************************************************************************************************************
};