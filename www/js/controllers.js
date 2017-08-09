angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicHistory) {

  $ionicHistory.clearHistory();
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/logout.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.logoutPopup = function() {
    $scope.modal.show();
  };

  $scope.logout = function()
  {
    auth.signOut().then(function() {
      console.log("Successfully logged out");
      $scope.modal.hide();
      $state.go('welcome');

    }, function(error) {
      console.log("error", error);
    });
  }


})
.controller('WelcomeCtrl', function ($scope, $state, $firebaseAuth, $location) {

    $scope.errorE="";
    $scope.errorP="";
    $scope.errorM1="Email not valid";
    $scope.errorM2="Password required";
    $scope.e=false;
    $scope.p=false;
    $scope.errorM3="Email and password don't match";
    $scope.errorM4="Email already in use";

    

    $scope.welcome=function(form, email, password, num)
    {
    if(form.$valid) 
    {

      if(num===1)
      {
         auth.signInWithEmailAndPassword(email, password)
       .then(function(firebaseUser) {
          console.log("User Successfully loggin with uid: ", firebaseUser.uid);
          $state.go('app.home');
        }).catch(function(error) {
            console.log("error: ", error);
            $scope.errorL=$scope.errorM3;
            $scope.l=true;
           
        });
      }
      else
      {
        auth.createUserWithEmailAndPassword(email, password)
       .then(function(firebaseUser) {
          console.log("User Successfully created with uid: ", firebaseUser.uid);
          $state.go('app.settings');
        }).catch(function(error) {
            console.log("error: ", error);
             $scope.errorR=$scope.errorM4;
            $scope.r=true;
        });
      }


       
    }
    else
    {
       if(form.email.$invalid || form.email.$pristine)
        {
        $scope.errorE=$scope.errorM1;
        $scope.e=true;
        }
        else
        {
        $scope.e=false;
        }
      
        if(form.password.$invalid || form.password.$pristine)
        {
        $scope.errorP=$scope.errorM2;
        $scope.p=true;
        }
        else
        {
         $scope.p=false;
        }
    }
      
    }


    
})

.controller('HomeCtrl', function ($scope, $firebaseAuth, $ionicModal, $state, $ionicHistory, $firebaseStorage, $cordovaCamera) {
 
    $ionicHistory.clearHistory();

  var user = null;
  var imagesouce = null;

    $scope.load = function(){
    user = auth.currentUser;

      if (user != null) {
        user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
        });
      }
      
      $scope.user=user.displayName;



var allpostsRef = database.ref("posts");

allpostsRef.on("value", function(snapshot) {
  //console.log(snapshot.val());
var i = 0;
 $scope.postList = [];
snapshot.forEach(function(child){
                var postObj = child.val();
                $scope.postList.push(postObj);
                console.log("££", $scope.postList[i].date);
                console.log("££", $scope.postList[i].photo);
                console.log("££", $scope.postList[i].title);
                i++;
                
 });


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

 } 
//end load func     

      auth.onAuthStateChanged(function(currentuser) {
    if (currentuser==null) {
      console.log("user unexpectedly logged out");
      $state.go('welcome');
    }
    });

      $ionicModal.fromTemplateUrl('templates/createpost.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.postPopup = function() {
    $scope.modal.show();
  };


$scope.takeimage = function(){
  var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };


     $cordovaCamera.getPicture(options).then(function(imageData) {
      var imagesource = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

}

//start post



  $scope.post = function(title, url){


//uncomment this if running on phone + see below

//this uses the ngcordova camera plugin to get image and store on firebase storage
  /*  var downloadURL;
    var storageRef = storage.ref().child('images');
    var uploadTask = storageRef.put(imagesource);
    uploadTask.on('state_changed', function(snapshot){
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
    case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }
}, function(error) {
  console.log("error uploading");
}, function() {
   downloadURL = uploadTask.snapshot.downloadURL;
   console.log("uploaded!", downloadURL);
});

imagesource = null;
*/



    var currentdate = new Date().toString();
  
    console.log(title, url, currentdate);


var postsRef = database.ref().child('posts');
    postsRef.push().set({
    title: title,
    //if running on phone, uncomment the line below this and comment out the line below that (hasnt been tested on mobile)
    //photo: downloadURL,
    photo: url,
    date: currentdate,
    user: user.uid,
    profile: user.photoURL
    });


console.log(title, url, currentdate);
    $scope.modal.hide();
  };
//end post



})
.controller('SettingsCtrl', function($scope, $ionicModal) {

  $scope.editVar="";
  $scope.inp="";
  $scope.x="";
  $scope.username="";
  $scope.email="";

var user = auth.currentUser;

      if (user != null) {
        user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
        });
      }
      
      $scope.email=user.email;
      $scope.username=user.displayName;


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/edit.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Open the login modal
  $scope.editPopup = function(num) {
    if(num===1)
    {
    $scope.editVar="Username";
    $scope.x=1;
    }
    if(num===2)
    {
    $scope.editVar="email";
    $scope.x=2;
    }
    $scope.modal.show();
  };

  $scope.edit = function(inp)
  {
   if($scope.x===1)
   {

    user.updateProfile({
   displayName: inp,
  }).then(function() {
  console.log("Successfully changed uername", inp);
  }, function(error) {
  console.log("error", error);
});

   }
   if($scope.x===2)
   {
    
user.updateEmail(inp).then(function() {
  console.log("Successfully changed email", inp);
}, function(error) {
  console.log("error", error);
});

   }
   $scope.modal.hide();
    $scope.email=user.email;
    $scope.username=user.displayName;

     
        user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
        });
      

  }

 

})
.controller('ProfileCtrl', function($scope, $ionicModal) {


$scope.load = function(){

      
var postsRef = database.ref("posts");

postsRef.on("value", function(snapshot) {

var i = 0;
 $scope.postList = [];
snapshot.forEach(function(child){
                var postObj = child.val();
                console.log("£", postObj.date);
                console.log("£", postObj.photo);
                console.log("£", postObj.title);
                if(user.uid==postObj.user)
                {
                  console.log(auth.currentUser.uid + "  " + postObj.user);
                  $scope.postList.push(postObj);
                }
              
                i++;
                
 });


}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

 } 
//end load func     

 
});
