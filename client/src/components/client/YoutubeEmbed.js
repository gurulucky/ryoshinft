import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = ({ embedId }) => (
    <div className="video-responsive">
        <iframe
            width="1280"
            height="720"
              src={`https://www.youtube.com/embed/${embedId}`}
            // src='https://pastebin.com/2EWLXvJ8'
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;