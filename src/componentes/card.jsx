import "./card.css";

export default function Card({
  image,
  title,
  description,
  link,
  kicker,
  className = "",
  imageHeight,
}) {
  const imageHeightValue =
    imageHeight == null
      ? undefined
      : typeof imageHeight === "number"
        ? `${imageHeight}%`
        : imageHeight;
  return (
    <div
      className={`card ${className}`.trim()}
      style={
        imageHeightValue
          ? { "--card-image-height": imageHeightValue }
          : undefined
      }
    >
      {image ? (
        <img
          src={image}
          alt={title ?? ""}
          className="card-image"
          loading="lazy"
          onError={(e) => e.currentTarget.remove()}
        />
      ) : null}
      <div className="card-content">
        {kicker ? <p className="card-kicker">{kicker}</p> : null}
        {title ? <h3 className="card-title">{title}</h3> : null}
        {description ? (
          <p className="card-description">{description}</p>
        ) : null}
        {link && (
          <a
            href={link}
            className="card-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más
          </a>
        )}
      </div>
    </div>
  );
}
