import Image, { type ImageProps } from "next/image";

type WatermarkSize = "sm" | "md" | "lg";
type WatermarkPosition = "br" | "tr" | "bl" | "tl";

type WatermarkedImageProps = ImageProps & {
  /** Corner trademark size. Default: md */
  watermarkSize?: WatermarkSize;
  /** Corner placement. Default: br (bottom-right) */
  watermarkPosition?: WatermarkPosition;
};

/**
 * next/image wrapper that adds a subtle Kaba Fence trademark
 * in the corner. Parent must be `position: relative` (and sized
 * appropriately when using `fill`).
 */
export default function WatermarkedImage({
  watermarkSize = "md",
  watermarkPosition = "br",
  ...imageProps
}: WatermarkedImageProps) {
  return (
    <>
      <Image {...imageProps} />
      <span
        className={`img-watermark img-watermark-${watermarkPosition} img-watermark-${watermarkSize}`}
        aria-hidden
      >
        <Image
          src="/brand/kaba-fence-logo.png"
          alt=""
          width={273}
          height={280}
          className="img-watermark-mark"
        />
      </span>
    </>
  );
}
