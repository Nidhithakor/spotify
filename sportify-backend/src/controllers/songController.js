import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";
import upload from "../middleware/multer.js";

const addSong = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    console.log(name,desc,album,audioUpload,imageUpload);
    const duration = `${Math.floor(audioUpload.duration / 60)} : ${Math.floor(
      audioUpload.duration % 60
    )}`;


    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration
    };

    const song = songModel(songData);
    await song.save();

    res.json({ success: true, message: "Song Added" });
  } catch (error) {
    res.json({ success: false, message:error });
    console.log(error);
      
  }
};

// const listSong = async (req, res) => {
//     try {
//         const allSongs = await songModel.find({});

//         res.json({success:true, songs: allSongs});
//     } catch (error) {
//       console.error("An error occurred:", error.message); // LOG the error
//       res.status(500).json({ success: false, message: error.message }); // send message
//     }
// };
const listSong = async (req, res) => {
  try {
    console.log("Fetching all songs...");
    const allSongs = await songModel.find({});
    console.log("Songs fetched:", allSongs);
    res.json({ success: true, songs: allSongs });
  } catch (error) {
    console.error("An error occurred:", error); // Log the full error
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeSong = async (req,res) => {

    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Song Removed"});
    } catch (error) {
        res.json({success:false});
    }
}

export { addSong, listSong, removeSong };
