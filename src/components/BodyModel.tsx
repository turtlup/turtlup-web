import React from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { IMUData } from '../services/BluetoothService';
import { IMUDataWithId } from "../services/BluetoothService";

interface BodyModelProps {
  imuData: IMUDataWithId[];
  width: number;
  height: number;
}

const BodyModel: React.FC<BodyModelProps> = ({ imuData, width, height }) => {
  // Define the torso shape points
  const torsoPoints = [
    width * 0.4, height * 0.2,  // Left shoulder
    width * 0.6, height * 0.2,  // Right shoulder
    width * 0.65, height * 0.6, // Right hip
    width * 0.35, height * 0.6, // Left hip
  ];

  // Function to determine circle color based on IMU data
  const getCircleColor = (imu: IMUData) => {
    // Map orientation to color - use all 3 axes for more dynamic visualization
    const xLevel = Math.abs(imu.ax);
    const yLevel = Math.abs(imu.ay);
    const zLevel = Math.abs(imu.az);

    // Threshold for movement detection
    const threshold = 5;

    if (xLevel > threshold) {
      // Calculate intensity based on highest movement value
      const maxLevel = Math.max(xLevel, yLevel, zLevel);
      const intensity = Math.min(255, Math.round((maxLevel / 20) * 255));

      // Red gets more intense with higher values
      const red = Math.min(255, 100 + intensity);
      const green = Math.max(0, 255 - intensity);
      const blue = 50;

      return `rgb(${red},${green},${blue})`;
    }

    // Default color when stable (green)
    return '#44ff44';
  };

  const mostRecentImu = imuData[imuData.length - 1];

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Draw torso outline */}
        <Line
          points={torsoPoints}
          closed
          stroke="#333"
          strokeWidth={2}
        />

        {/* Draw IMU points */}
        {mostRecentImu.data.map((imu:any, index:number) => {
          // Get the position based on the predefined points
          const positionIndex = index % 4;
          const x = torsoPoints[positionIndex * 2];
          const y = torsoPoints[positionIndex * 2 + 1];

          return (
            <Circle
              key={`${mostRecentImu.id}-${index}`}
              x={x}
              y={y}
              radius={10}
              fill={getCircleColor(imu)}
              stroke="#333"
              strokeWidth={2}
            />
          );
        }
        )}
      </Layer>
    </Stage>
  )
};

export default BodyModel;