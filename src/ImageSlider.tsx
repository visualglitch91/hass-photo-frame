import { useEffect, useState } from "preact/hooks";
import request, { shuffle } from "./utils";
import ImageCover from "./ImageCover";
import { photos } from "./config.json";

function getUrl(fileName: string) {
  return `/files/${fileName}`;
}

export default function ImageSlider({ onClick }: { onClick: () => void }) {
  const [images, setImages] = useState<string[]>();
  const [{ current, next, opacity }, setState] = useState({
    current: 0,
    next: 1,
    opacity: 0,
  });

  useEffect(() => {
    let a: number;
    let i: number;

    (async () => {
      const { files } = await request<{ files: string[] }>("/files");

      const images = shuffle(files);

      setImages(images);

      i = window.setInterval(() => {
        const start = Date.now();

        const animate = () => {
          const timestamp = Date.now();
          const progress = timestamp - start;

          if (progress < photos.fade) {
            const opacity = progress / photos.fade;
            setState((state) => ({ ...state, opacity }));
            a = window.setTimeout(animate, 60);
          } else {
            setState((state) => ({
              ...state,
              current: state.next,
            }));

            a = window.setTimeout(() => {
              setState((state) => ({
                ...state,
                next: (state.current + 1) % images.length,
                opacity: 0,
              }));
            }, 10);
          }
        };

        animate();
      }, photos.interval);
    })();

    return () => {
      window.clearTimeout(a);
      window.clearInterval(i);
    };
  }, []);

  if (!images) {
    return null;
  }

  return (
    <div className="image-slider" onClick={onClick}>
      <div className="image-slide">
        <ImageCover src={getUrl(images[current])} style={{ zIndex: 1 }} />
      </div>
      <div className="image-slide">
        <ImageCover
          src={getUrl(images[next])}
          style={{ opacity: Math.max(opacity, 0).toFixed(3), zIndex: 2 }}
        />
      </div>
    </div>
  );
}
