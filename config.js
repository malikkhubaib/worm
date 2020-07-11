import Firebase from 'firebase';
import RNFetchBlob from "react-native-fetch-blob";
import { ToastAndroid } from 'react-native';
var firebaseConfig = {
  apiKey: "AIzaSyAVGL_voemAwpCQmnIkCghtrt6XIJ8egFE",
  authDomain: "worm-8701c.firebaseapp.com",
  databaseURL: "https://worm-8701c.firebaseio.com",
  projectId: "worm-8701c",
  storageBucket: "worm-8701c.appspot.com",
  messagingSenderId: "132329432190",
  appId: "1:132329432190:web:0f615200b46a738617a42f",
  measurementId: "G-60R1TQ6FG6"
};
// Initialize Firebase

let app;
if (!Firebase.apps.length)
  app = Firebase.initializeApp(firebaseConfig);
else
  app = Firebase.apps[0]

let db = app.database();
let auth = app.auth();
let storage = app.storage("gs://worm-8701c.appspot.com")


//like unlike
let isLiked = async (songId, userId) => {
  var likes = db.ref("users/" + userId + "/likes/")
  try {
    var snap = await likes.child(songId).once("value")
    console.log(snap)
    if (snap == null || snap.val() == null)
      return false
    else
      return true
  } catch (err) {
    ToastAndroid.show(err.toString(), ToastAndroid.SHORT)
  }
}
let loginWithEmailPassword = async (email, pwd) => {
  if (auth.currentUser)
    return auth.currentUser
  try {
    var promise = await auth.signInWithEmailAndPassword(email, pwd)
    return promise
  } catch (err) {
    alert(ToastAndroid.show(err.toString, ToastAndroid.SHORT))
    return null
  }
}

let likeUnlike = async (songId, userId) => {
  try {
    var path = "users/" + userId + "/likes/" + songId
    console.log(path)
    var likeRef = db.ref(path)
    var likeEntry = await likeRef.once("value")
    console.log("entry: ", likeEntry)
    if (likeEntry.val() != null) {
      //liked, unliking!
      console.log("unliking")
      await likeRef.remove()
      return false
    } else {
      //not liked, liking!
      console.log("liking")
      console.log(likeRef.set(true))
      return true
    }
  } catch (err) {
    ToastAndroid.show(err.toString, ToastAndroid.SHORT)
  }
}



//backup playlist
let addToBackupPlaylist = async (songId, userId) => {

  try {
    var path = "users/" + userId + "/backup/" + songId
    console.log(path)
    var likeRef = db.ref(path)
    var likeEntry = await likeRef.once("value")
    console.log("entry: ", likeEntry)
    if (likeEntry.val() != null) {
      //liked, unliking!
      console.log("already in backup playlist")
      return false
    } else {
      //not liked, liking!
      console.log("adding to backup playlist")
      console.log(likeRef.set(true))
      return true
    }
  } catch (err) {
    ToastAndroid.show(err.toString, ToastAndroid.SHORT)
    return false
  }
}

let getBackupPlaylist = async (userId) => {
  let songs = []
  try {
    let path = "users/" + userId + "/backup"
    console.log(path)
    let ref = db.ref(path)
    let snap = await ref.once("value")
    let songsIds = Object.keys(snap.val())
    for (var i = 0; i < songsIds.length; i++) {
      let k = songsIds[i]
      let songId = k
      let song = (await db.ref("songs/" + songId).once("value")).val()
      if (song != null) {
        console.log("song exists")
        songs.push({ song: song, id: k })
      }
      console.log("SONG: ", songId, song)
    }
    console.log("SONGSSSSSSS: ", songs)
    console.log("keys:", Object.keys(snap))
    return songs
  } catch (ex) {
    ToastAndroid.show(ex.toString(), ToastAndroid.LONG)

  }
  return songs
}

let getSongInfo = async (songId) => {
  try {
    var songNode = await db.ref("songs/").child(songId).once("value");
    if (songNode == null)
      return songNode
    else {
      var song = { songId, meta: songNode.child("meta").val(), download_url: songNode.child("download_url").val() }
      return song
    }
  } catch (err) {
    return null
  }
}
let downloadSong = async (songId, context, onprogress = null, onsave = null, onerror = null) => {
  //adding to backup playlist
  let userId = auth.currentUser.uid
  ToastAndroid.show("Adding to backup playlist", ToastAndroid.SHORT)
  if (addToBackupPlaylist(songId, userId)) {
    ToastAndroid.show("Added to backup playlist", ToastAndroid.SHORT)
  }



  try {
    var song = await getSongInfo(songId)

    if (song == null) {
      ToastAndroid.show("Song not in database", ToastAndroid.LONG)
      return null
    } else {
      ToastAndroid.show("Downloading", ToastAndroid.SHORT)
    }




    // console.log("SONG INFO:", songId, song)
    // console.log("SONG META:", song.meta)
    ToastAndroid.show("Downloading: " + song.meta.title, ToastAndroid.SHORT)

    let ext = song.download_url.split('?')[0].split('.')
    ext = ext[ext.length - 1]
    let filePath = RNFetchBlob.fs.dirs.DownloadDir + '/' + song.meta.title + '.' + ext;
    let that = context
    // console.log("FILEPATH: ", filePath)
    var fetcher = RNFetchBlob.fetch('GET', song.download_url)

    fetcher.progress((received, total) => {
      // console.log('progress', received / total)

      if (onprogress)
        onprogress(received, total)
      else
        that.setState({ progress: (received / total) })


    })
      .then((res) => {

        RNFetchBlob.fs.writeFile(filePath, res.base64(), 'base64')
          .then(response => {
            console.log('Success Log: ' + response);
            ToastAndroid.show("File downloaded to location: " + filePath, ToastAndroid.LONG)
            if (onsave)
              onsave()
            else
              that.setState({ progress: 0 })


          })
          .catch(errors => {
            console.log(" Error Log: " + errors);

            if (onerror)
              onerror()
          })

      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
        console.error(errorMessage)
      })



    return fetcher


  } catch (err) {
    console.log("ERROR CATCHED: ", err)
  }
}



export default app;
export { db, auth, storage };
export { isLiked, loginWithEmailPassword, likeUnlike, addToBackupPlaylist, getBackupPlaylist, downloadSong }