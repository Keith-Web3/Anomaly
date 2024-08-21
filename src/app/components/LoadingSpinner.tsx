interface LoadingSpinnerProps {
  ringColor: string
  radii: number
  ringWidth: number
}

const LoadingSpinner = function ({
  ringColor,
  ringWidth,
  radii,
}: LoadingSpinnerProps) {
  return (
    <div
      style={{
        border: `${ringWidth}px solid ${ringColor}`,
        width: `${radii}px`,
      }}
      className=" aspect-square bg-transparent !border-r-transparent rounded-[50%] opacity-80 animate-[rotate_500ms_linear_infinite]"
    />
  )
}

export default LoadingSpinner
