//Search when search icon is clicked
document.querySelector(".js-submit").addEventListener('click', function() {
    var input = document.querySelector("input").value;
    console.log(input);
    SoundCloudAPI.getTrack(input);
    document.querySelector(".js-search-results").innerHTML = "";
});

//Search when enter/return is pressed
document.querySelector(".js-search").addEventListener('keyup', function(e) {
    var input = document.querySelector("input").value;
    console.log(input);

    if (e.which === 13) {
        SoundCloudAPI.getTrack(input)
    }
    document.querySelector(".js-search-results").innerHTML = "";
});

//Initialising SoundCloudAPI object
var SoundCloudAPI = {};

SoundCloudAPI.init = function() {
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
      });
};

SoundCloudAPI.init();

//Defining the getTrack function (from the SoundCloud API website)
SoundCloudAPI.getTrack = function(inputValue) {
    SC.get('/tracks', {
        q: inputValue
      }).then(function(tracks) {
        console.log(tracks);
        SoundCloudAPI.renderTracks(tracks);
      });
};

//Defining the function used to render the cards for the tracks
SoundCloudAPI.renderTracks = function(tracks) {
    tracks.forEach(function(track) {
        //Rendering the card div
        var card = document.createElement('div');
        card.classList.add("card");

        //Rendering the image for the card
        var imageDiv = document.createElement('div');
        imageDiv.classList.add("image");

        var image_img = document.createElement('img');
        image_img.classList.add('image_img');
        image_img.src = track.artwork_url || "https://www.wagbet.com/wp-content/uploads/2019/11/music_placeholder.png";

        imageDiv.appendChild(image_img);

        //Rendering the content of the card
        var content = document.createElement('div');
        content.classList.add('content');

        var header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = '<a href = "' + track.permalink_url + '" target = "_blank">' + track.title + '</a>';

        //Rendering the add to playlist button
        var button = document.createElement('div');
        button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

        var icon = document.createElement('i');
        icon.classList.add('add', 'icon');

        var buttonText = document.createElement('span');
        buttonText.innerHTML = 'Add to playlist';
        
        //appendChild methods
        content.appendChild(header);

        button.appendChild(icon);
        button.appendChild(buttonText);

        button.addEventListener('click', function() {
            SoundCloudAPI.getEmbed(track.permalink_url);
        });

        card.appendChild(imageDiv);
        card.appendChild(content);
        card.appendChild(button);

        var searchResults = document.querySelector(".js-search-results");
        searchResults.appendChild(card);
    });
}

//Defining the function for adding tracks to the sidebar and storing them in localStorage
SoundCloudAPI.getEmbed = function(trackURL) {
    SC.oEmbed(trackURL, {
        auto_play: false
        }).then(function(embed){
        console.log('oEmbed response: ', embed);

        var sideBar = document.querySelector(".js-playlist");

        var box = document.createElement('div');
        box.innerHTML = embed.html;

        sideBar.insertBefore(box, sideBar.firstChild);

        localStorage.setItem("key", sideBar.innerHTML);
    });
}

//Loading from localStorage on open
var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");