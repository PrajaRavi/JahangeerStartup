import React from "react";

interface UploadProgressCircleProps {
  /*
    Upload progress
    value from 0 -> 100
  */
  progress: number;

  /*
    Circle size
  */
  size?: number;

  /*
    Stroke width
  */
  strokeWidth?: number;

  /*
    Optional text
  */
  text?: string;
}

const UploadProgressCircle: React.FC<
  UploadProgressCircleProps
> = ({
  progress,
  size = 70,
  strokeWidth = 5,
  text,
}) => {
  /*
    Radius calculation

    Why:
    SVG stroke should stay inside viewbox
  */
  const radius =
    (size - strokeWidth) / 2;

  /*
    Full circle length
  */
  const circumference =
    2 * Math.PI * radius;

  /*
    Progress stroke calculation

    Example:
    progress = 50%
    means half circle visible
  */
  const offset =
    circumference -
    (progress / 100) *
      circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* SVG */}
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#000"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"

          /*
            Dashed circle animation
          */
          strokeDasharray={
            circumference
          }

          strokeDashoffset={
            offset
          }

          /*
            Smooth animation
          */
          style={{
            transition:
              "stroke-dashoffset 0.3s ease",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Percentage */}
        <span className="text-white text-sm font-semibold">
          {progress}%
        </span>

        {/* Optional text */}
        {/* {text && (
          <span className="text-[10px] text-gray-300">
            {text}
          </span>
        )} */}
      </div>
    </div>
  );
};

export default UploadProgressCircle;