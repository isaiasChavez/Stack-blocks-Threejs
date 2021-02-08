import Observer, { EVENTS } from "../Observer"

class UserInterface {
 constructor () {
   this.splashScreen = document.getElementById( 'splashscreen' )
   this.UIScreen = document.getElementById( 'UIScreen' )
   this.buttonChange = document.getElementById( 'button_change' )
   this.buttonPlay = document.getElementById( 'button_play' )
   this.video = document.querySelector('#video')
   console.log(this.video);
   this.colorHasChanged = false
   this.videoHasPlayed = false
   console.log( this.splashScreen );
   
   this.buttonChange.addEventListener( 'click', () => {
     if (!this.colorHasChanged) {
       Observer.emit( EVENTS.CHANGE_COLOR )
       this.buttonChange.style.opacity = 0.5
       this.colorHasChanged = true
      } else
      {
        Observer.emit( EVENTS.REVERSE_COLOR )
        this.buttonChange.style.opacity = 1
       this.colorHasChanged = false
     } 
   })
   this.buttonPlay.addEventListener( 'click', () => {
     if( !this.videoHasPlayed )
     {
       Observer.emit( EVENTS.SHOW_VIDEO )
       this.buttonPlay.style.opacity = 0.5
       setTimeout( () => {
         this.video.play();
       }, 1000);
				this.video.addEventListener( 'play', function () {

					this.currentTime = 0;
          
        }, false );
        
        this.videoHasPlayed = true
      } else
      {
        Observer.emit( EVENTS.HIDE_VIDEO )
                 this.video.currentTime = 0;
                 this.video.pause();

        this.buttonPlay.style.opacity = 1
       this.videoHasPlayed = false
     } 
   })


  this.events()
 }

 events () {
  Observer.on( EVENTS.LOADED, () => {
    this.splashScreen.classList.add('fade-out')
    setTimeout(() => {
      this.splashScreen.style.display = 'none'
    }, 400);
  })
  Observer.on( EVENTS.UNCAP_BOTTLE, () => {
    this.UIScreen.style.display = 'flex'

   })
 

  }
  


}
export default UserInterface