import * as React from "react";
import { BookOpen, ChevronLeft, ChevronRight, X } from "react-feather";
import { animate, motion, useMotionValue, PanInfo } from "framer-motion";
import styles from "../../styles/LearnPanel.module.css";

const slides = [
  {
    content: <div style={{ height: "200px" }}>Slide 1</div>,
  },
  {
    content: <div>Slide 2</div>,
  },
  {
    content: <div style={{ width: "300px" }}>Slide 3</div>,
  },
  {
    content: <div>Slide 4</div>,
  },
];

const slideContainerGap = 10;

const LearnPanel = ({
  bounds,
}: {
  bounds: React.RefObject<HTMLDivElement>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      animate(mvX, slideContainerGap);
      animate(mvY, slideContainerGap);
    }
  }, [isOpen]);

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const { velocity } = info;
    const wrapper = bounds.current!;
    const container = containerRef.current!;
    const maxY =
      wrapper.offsetHeight - container.offsetHeight - slideContainerGap;
    const maxX =
      wrapper.offsetWidth - container.offsetWidth - slideContainerGap;
    const minY = slideContainerGap;
    const minX = slideContainerGap;

    if (velocity.x < -200) {
      animate(mvX, minX);
    } else if (velocity.x > 200) {
      animate(mvX, maxX);
    } else {
      animate(mvX, mvX.get() > maxX / 2 ? maxX : minX);
    }

    if (velocity.y < -200) {
      animate(mvY, minY);
    } else if (velocity.y > 200) {
      animate(mvY, maxY);
    } else {
      animate(mvY, mvY.get() > maxY / 2 ? maxY : minY);
    }
  };

  // slide change can
  React.useEffect(() => {
    const wrapper = bounds.current!;
    const container = containerRef.current!;
    const maxY =
      wrapper.offsetHeight - container.offsetHeight - slideContainerGap;
    const maxX =
      wrapper.offsetWidth - container.offsetWidth - slideContainerGap;
    const minY = slideContainerGap;
    const minX = slideContainerGap;

    animate(
      mvY,
      mvY.get() + container.offsetHeight + slideContainerGap >
        wrapper.offsetHeight
        ? maxY
        : mvY.get() > maxY / 2
        ? maxY
        : minY
    );

    animate(
      mvX,
      mvX.get() + container.offsetWidth + slideContainerGap >
        wrapper.offsetWidth
        ? maxX
        : mvX.get() > maxX / 2
        ? maxX
        : minX
    );
  }, [currentSlide]);

  return (
    <motion.div
      className={styles.container}
      ref={containerRef}
      drag={isOpen}
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.025}
      style={{ x: mvX, y: mvY }}
      onDragEnd={handleDragEnd}
    >
      {!isOpen ? (
        <button className={styles.iconButton} onClick={() => setIsOpen(true)}>
          <BookOpen />
        </button>
      ) : (
        <div className={styles.slideContainer}>
          <div className={styles.slideHeader}>
            <button
              className={styles.iconButton}
              onClick={() => {
                setIsOpen(false);
                setCurrentSlide(0);
              }}
            >
              <X />
            </button>
            <div className={styles.slideHeading}>This is a heading</div>
            <div className={styles.slideNavigation}>
              <button
                className={styles.iconButton}
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft />
              </button>
              <button
                className={styles.iconButton}
                disabled={currentSlide === slides.length - 1}
                onClick={() =>
                  setCurrentSlide((prev) =>
                    Math.min(prev + 1, slides.length - 1)
                  )
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className={styles.slideContent}>
            {slides[currentSlide].content}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LearnPanel;
