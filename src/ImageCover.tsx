import { useEffect, useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

export default function ImageCover({
  src,
  alt,
  style,
}: {
  src: string;
  alt?: string;
  style?: JSXInternal.CSSProperties;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      return;
    }

    const emulateObjectFitCover = () => {
      const container = image.parentNode!.parentNode! as HTMLElement;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const containerRatio = containerWidth / containerHeight;
      const imageRatio = image.naturalWidth / image.naturalHeight;

      if (containerRatio > imageRatio) {
        image.style.width = "100%";
        image.style.height = "auto";
      } else {
        image.style.width = "auto";
        image.style.height = "100%";
      }

      const top = (containerHeight - image.clientHeight) / 2;
      const left = (containerWidth - image.clientWidth) / 2;

      image.style.top = `${top}px`;
      image.style.left = `${left}px`;
    };

    if (image.complete) {
      emulateObjectFitCover();
    } else {
      image.addEventListener("load", emulateObjectFitCover);
    }

    window.addEventListener("resize", emulateObjectFitCover);

    return () => {
      window.removeEventListener("resize", emulateObjectFitCover);
      image.removeEventListener("load", emulateObjectFitCover);
    };
  }, [src]);

  return (
    <div
      style={{
        ...style,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ position: "absolute", maxWidth: "none", maxHeight: "none" }}
      />
    </div>
  );
}
