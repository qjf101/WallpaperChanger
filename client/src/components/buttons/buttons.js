import React, { Component } from 'react';
import './buttons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Buttons extends Component {

  state = {
    imagePathPre: null,
    imagePath: null
  };

  // Updates image file path to be used for the image preview
  updateImagePath(path){
    this.setState({imagePath: `${path}?${Date.now()}`})
    };

  // Get path for the currently set wallpaper from the backend and update imagePath
  getCurrentWallpaper = async () => {
    const currentWallpaper = await fetch('http://localhost:5000/api/getCurrentWallpaper')
    const currentWallpaperPath = await currentWallpaper.text();

    this.setState({imagePathPre : currentWallpaperPath}); 
  }

  // Call getCurrentWallpaper on app start for image preview
  componentDidMount(){
    this.getCurrentWallpaper()
  }
  
  // Get path for a new wallpaper from the backend and update imagePath
  getNewWallpaper = async () => {
    const newWallpaper = await fetch('http://localhost:5000/api/getNewWallpaper');
    const newWallpaperPath = await newWallpaper.text();
    console.log(newWallpaperPath)

    this.updateImagePath(newWallpaperPath)
  }

  // Set wallpaper after getting a new wallpaper
  setWallpaper = async () => {
    const setWallpaper = await fetch('http://localhost:5000/api/setWallpaper');
    const setWallpaperPath = await setWallpaper.text();
    console.log(setWallpaperPath)
  }

  // Save wallpaper after getting a new wallpaper
  saveWallpaper = async () => {
    fetch('http://localhost:5000/api/saveWallpaper');
  }

  customId = "custom-id-yes";
  notify = () => toast("Get a new wallpaper before saving.", {
    toastId: this.customId
  });
    
  render() {
    return (
    <div>
      <div className="wrapper">
        <div className="imgBox">
          {this.state.imagePath || this.state.imagePathPre ? (
          <img src={this.state.imagePath || this.state.imagePathPre} alt="Wallaper"></img>
          ) : (
            <></>
          )
          }
          </div>
      </div>
      <div className='button'>
      <div className='button'>
        <button onClick={this.getNewWallpaper}>
          Get
        </button>
        <button onClick={this.setWallpaper}>
          Set
        </button>
        <button onClick={this.state.imagePath ? this.saveWallpaper : this.notify}>
          Save
        </button>
        <ToastContainer />
      </div>
      </div>
    </div>
    
    );
  }
}

export default Buttons;