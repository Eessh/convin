const YoutubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => {
  return (
    <div className="YoutubeEmbed">
      <iframe
        width={640}
        height={390}
        style={{ aspectRatio: "auto", borderRadius: "0.5rem" }}
        frameBorder={0}
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded Youtube Video"
      />
    </div>
  );
};

export default YoutubeEmbed;