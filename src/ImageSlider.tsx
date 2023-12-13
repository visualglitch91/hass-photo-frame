import { useEffect, useState } from "preact/hooks";
import request, { shuffle } from "./utils";
import ImageCover from "./ImageCover";
import config from "../config.json";

const defaultState = {
  current: "",
  next: "",
  opacity: 0,
};

export default function ImageSlider({ onClick }: { onClick: () => void }) {
  const [{ current, next, opacity }, setState] = useState(defaultState);

  useEffect(() => {
    let animationInterval: number;
    let imageInterval: number;
    let currentIndex = 0;
    let nextIndex = 1;
    let images: null | string[] = null;

    const setup = async () => {
      window.clearTimeout(animationInterval);
      window.clearInterval(imageInterval);

      const urls = await request<{ urls: string[] }>("/photos").then((res) => {
        return shuffle(res.urls);
      });

      if (images === null) {
        setState({
          current: urls[0],
          next: urls[1],
          opacity: 0,
        });
      }

      images = urls;

      imageInterval = window.setInterval(() => {
        const start = Date.now();

        const animate = () => {
          const timestamp = Date.now();
          const progress = timestamp - start;

          if (progress < config.photos.fade) {
            const opacity = progress / config.photos.fade;
            setState((state) => ({ ...state, opacity }));
            animationInterval = window.setTimeout(animate, 60);
          } else {
            currentIndex = nextIndex;

            setState((state) => ({ ...state, current: state.next }));

            animationInterval = window.setTimeout(() => {
              nextIndex = (currentIndex + 1) % images!.length;

              setState((state) => ({
                ...state,
                next: images![nextIndex],
                opacity: 0,
              }));
            }, 10);
          }
        };

        animate();
      }, config.photos.interval);
    };

    const setupInterval = window.setInterval(setup, 60 * 60_000);
    setup();

    return () => {
      window.clearTimeout(animationInterval);
      window.clearInterval(imageInterval);
      window.clearInterval(setupInterval);
    };
  }, []);

  if (!current) {
    return null;
  }

  return (
    <div
      className="image-slider"
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
      onClick={onClick}
    >
      <div className="image-slide">
        <ImageCover src={current} style={{ zIndex: 1 }} />
      </div>
      <div className="image-slide">
        <ImageCover
          src={next}
          style={{ opacity: Math.max(opacity, 0).toFixed(3), zIndex: 2 }}
        />
      </div>
    </div>
  );
}
